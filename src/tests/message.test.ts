import { message } from "@aivin-labs/sdk";
import { AssertionFailure, assertNoPrototypePollution, runCheck, skip } from "../helpers/report";

/**
 * `sessionId` truyền vào là session test cố định (setup ở `index.ts`, tái sử dụng giữa các lần
 * chạy) - ghi message vào đó an toàn vì đây không phải session thật của người dùng nào, không hiện
 * trong UI chat của ai cả. `stream` bị skip vì ngữ nghĩa gần với `agent.reply`/`realtime.publish`
 * (đẩy vào 1 phiên chat đang live) hơn là ghi 1 bản ghi tĩnh — không chắc an toàn như `save`.
 */
export async function testMessage(sessionId?: string): Promise<void> {
  await runCheck("message", "getRecent", () => message.getRecent({ session_id: sessionId, limit: 3 }), {
    expectBusinessError: true,
  });

  if (!sessionId) {
    for (const method of ["save", "getList", "getById", "search", "update", "init"]) {
      skip("message", method, "couldn't create the fixed test session (see the setup log in index.ts)");
    }
    skip("message", "stream", "MessageService.streamResponse reads ctx.session.id, not params.session_id, to attach the message - our ctx.session is always undefined, so this would persist an orphaned message with no session instead of landing in the test session");
    return;
  }

  let messageId: string | undefined;

  await runCheck("message", "save", () =>
    message.save({ text: `test-sdk probe ${Date.now()}`, role: "user", session_id: sessionId }),
  );

  // save với text rỗng — 1 message không nội dung có nên tồn tại? Phải là lỗi nghiệp vụ sạch
  // ("text required") hoặc lưu được thật, không phải throw kiểu transport vì serialize chuỗi rỗng.
  await runCheck(
    "message",
    "save (empty text)",
    () => message.save({ text: "", role: "user", session_id: sessionId }),
    { expectBusinessError: true },
  );

  // save với role không nằm trong enum hợp lệ — phải bị reject sạch bằng lỗi nghiệp vụ, không phải
  // lưu thẳng 1 role rác khiến UI chat render sai sau này.
  await runCheck(
    "message",
    "save (invalid role)",
    () => message.save({ text: "probe with bogus role", role: "this-is-not-a-role" as any, session_id: sessionId }),
    { expectBusinessError: true },
  );

  // role ĐÚNG giá trị hợp lệ nhưng SAI case ("User" thay vì "user") — khác case "invalid role" ở
  // trên (hoàn toàn không nằm trong enum); bẫy case-sensitivity thường lộ ra khi validate bằng
  // `enum.includes()` so sánh chuỗi thô. Phải bị reject sạch hoặc chuẩn hoá đúng, không lưu thẳng
  // "User" như 1 role khác hẳn "user" khiến UI chat render sai (role quyết định avatar/vị trí bubble).
  await runCheck(
    "message",
    "save (valid role, wrong case: User)",
    () => message.save({ text: "probe with wrong-case role", role: "User" as any, session_id: sessionId }),
    { expectBusinessError: true },
  );

  // save với text rất dài (~15k ký tự) — khác câu ngắn ở trên, ép chạm giới hạn kích thước message
  // thật (DB field size / gRPC message size) thay vì chỉ test happy-path ngắn gọn.
  await runCheck(
    "message",
    "save (huge text ~15k chars)",
    () => message.save({ text: "test-sdk probe huge message ".repeat(500), role: "user", session_id: sessionId }),
    { expectBusinessError: true },
  );

  // --- Deeper/harder: race condition thật + tính toàn vẹn nội dung, không chỉ "input rỗng/dài" ---

  // Payload trông giống injection (script tag, template injection, SQL-comment-style) lưu làm TEXT
  // THẬT của message — sau khi lưu, đọc lại bằng getById PHẢI khớp CHÍNH XÁC byte-for-byte với input
  // gốc. Không kiểm tra "có sanitize hay không" (đó là quyết định sản phẩm), mà kiểm tra KHÔNG có
  // mutation ngầm/silent — nếu server tự ý sửa đổi nội dung mà không báo, đó là data integrity bug.
  const injectionPayload = `<script>alert(document.cookie)</script> {{7*7}} '); DROP TABLE messages; --`;
  await runCheck("message", "save+getById (injection-shaped content, round-trip integrity)", async () => {
    const saved: any = await message.save({ text: injectionPayload, role: "user", session_id: sessionId });
    const savedId = saved?.id ?? saved?._id;
    if (!savedId) return { note: "save() didn't return an id — integrity check skipped, but call itself round-tripped fine" };
    const doc: any = await message.getById({ message_id: savedId });
    if (doc?.text !== injectionPayload) {
      throw new AssertionFailure(`content was silently mutated on round-trip — sent ${JSON.stringify(injectionPayload)}, got back ${JSON.stringify(doc?.text)}`);
    }
    return doc;
  });

  // 10 lời gọi save() song song vào CÙNG session — race condition thật: phải KHÔNG mất write nào
  // (lost update), khác hẳn mọi case save() đơn lẻ ở trên. Đếm qua getList ngay sau đó bằng cách so
  // khớp marker riêng của lần chạy này (không đếm tuyệt đối vì session dùng chung giữa nhiều lần chạy).
  await runCheck("message", "save (10x concurrent, same session)", async () => {
    const raceMarker = `race-${Date.now()}`;
    const settled = await Promise.allSettled(
      Array.from({ length: 10 }, (_, i) =>
        message.save({ text: `test-sdk ${raceMarker} #${i}`, role: "user", session_id: sessionId }),
      ),
    );
    const rejected = settled.filter((s) => s.status === "rejected") as PromiseRejectedResult[];
    if (rejected.length > 0) {
      throw new AssertionFailure(`${rejected.length}/10 concurrent save() calls failed: ${rejected[0].reason?.message || rejected[0].reason}`);
    }
    const list: any[] = await message.getList({ session_id: sessionId, limit: 50 });
    const landed = list.filter((m) => typeof m?.text === "string" && m.text.includes(raceMarker)).length;
    if (landed !== 10) {
      throw new AssertionFailure(`expected all 10 concurrent messages to land, found ${landed}/10 via getList — possible lost write under concurrency`);
    }
    return { landed };
  });

  await runCheck("message", "getList", async () => {
    const list = await message.getList({ session_id: sessionId, limit: 5 });
    messageId = (list as any[])?.[0]?.id ?? (list as any[])?.[0]?._id;
    return list;
  });

  await runCheck("message", "search", () => message.search({ session_id: sessionId, query: "probe", limit: 3 }), {
    expectBusinessError: true,
  });

  // search với query rỗng — không có gì để tìm, phải là lỗi nghiệp vụ sạch hoặc trả full list có
  // giới hạn, không phải throw vì FTS engine nhận query rỗng.
  await runCheck(
    "message",
    "search (empty query)",
    () => message.search({ session_id: sessionId, query: "", limit: 3 }),
    { expectBusinessError: true },
  );

  // getList với limit âm — biên vô lý cố tình, phải bị reject/normalize sạch, không phải throw kiểu
  // transport vì code cố `.slice(0, -1)` hay build LIMIT -1 trong query thật.
  await runCheck(
    "message",
    "getList (negative limit)",
    () => message.getList({ session_id: sessionId, limit: -1 } as any),
    { expectBusinessError: true },
  );

  await runCheck("message", "init", () => message.init({ session_id: sessionId }), {
    expectBusinessError: true,
  });

  // getById với id không tồn tại — tách biệt khỏi case messageId thật bên dưới, phải là lỗi
  // nghiệp vụ "not found" sạch, không phải throw vì lookup trả null rồi code cố đọc field trên đó.
  await runCheck(
    "message",
    "getById (nonexistent id)",
    () => message.getById({ message_id: "test-sdk-nonexistent-message-id" }),
    { expectBusinessError: true },
  );

  if (messageId) {
    await runCheck("message", "getById", () => message.getById({ message_id: messageId as string }), {
      expectBusinessError: true,
    });
    await runCheck(
      "message",
      "update",
      () => message.update({ message_id: messageId as string, text: "updated by test-sdk" }),
      { expectBusinessError: true },
    );

    // update với text rỗng trên message THẬT vừa lấy được — khác case "save (empty text)" ở trên
    // (đó là tạo mới); ở đây là ghi đè nội dung có sẵn thành rỗng, nhánh code update có thể khác.
    await runCheck(
      "message",
      "update (empty text)",
      () => message.update({ message_id: messageId as string, text: "" }),
      { expectBusinessError: true },
    );

    // update() nhận `[key: string]: any` tự do (khác `save`, chỉ có 3 field cố định) — thử
    // prototype pollution qua đúng cửa tự do đó, assert Object.prototype của CHÍNH process KHÔNG bị
    // đầu độc sau round-trip.
    await runCheck(
      "message",
      "update (prototype pollution via free-form fields)",
      async () => {
        const res = await message.update(
          JSON.parse(`{"message_id":"${messageId}","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}}`),
        );
        assertNoPrototypePollution("message.update()");
        return res;
      },
      { expectBusinessError: true },
    );
  } else {
    skip("message", "getById", "getList returned no id (brand-new session has no messages yet)");
    skip("message", "update", "getList returned no id (brand-new session has no messages yet)");
  }

  skip("message", "stream", "MessageService.streamResponse reads ctx.session.id, not params.session_id, to attach the message - our ctx.session is always undefined, so this would persist an orphaned message with no session instead of landing in the test session");
}
