import { session } from "@aivin-labs/sdk";
import { AssertionFailure, assertNoPrototypePollution, runCheck, skip } from "../helpers/report";

/**
 * `sessionId` truyền vào là 1 session test CỐ ĐỊNH (tạo/tái sử dụng ở `index.ts`, id không đổi
 * giữa các lần chạy) — `session.newSession`/`createSession` phía BE tự "tìm thấy thì cập nhật,
 * chưa có thì tạo mới" (SessionService.newSession) nên không tạo session rác mới mỗi lần chạy.
 * Không có method `deleteSession` nào được expose nên không tự dọn được — chấp nhận 1 session test
 * tồn tại lâu dài, đổi lại test được gần hết namespace thay vì skip toàn bộ.
 */
export async function testSession(sessionId?: string, workspaceId?: string): Promise<void> {
  await runCheck("session", "getList", () => session.getList({ limit: 3 }), {
    expectBusinessError: true,
  });

  if (!sessionId) {
    for (const method of ["get", "markAsSeen", "update", "newSession", "create", "updateStatus", "updateAgent"]) {
      skip("session", method, "couldn't create the fixed test session (see the setup log in index.ts)");
    }
    return;
  }

  await runCheck("session", "get", () => session.get(sessionId), { expectBusinessError: true });

  // get với id không tồn tại — tách biệt với case sessionId thật ở trên: phải là lỗi nghiệp vụ
  // "not found" / null sạch, không phải throw kiểu transport vì lookup miss.
  await runCheck("session", "get (nonexistent id)", () => session.get("test-sdk-nonexistent-session-id"), {
    expectBusinessError: true,
  });

  // updateStatus với giá trị status không nằm trong enum hợp lệ (`idle`/`processing`/`completed`)
  // — phải bị BE reject sạch bằng lỗi nghiệp vụ, không phải lưu thẳng 1 status rác vào DB.
  await runCheck(
    "session",
    "updateStatus (invalid status value)",
    () => session.updateStatus({ session_id: sessionId, status: "this-is-not-a-valid-status" as any }),
    { expectBusinessError: true },
  );

  // update với payload rỗng (không note, không field gì thay đổi ngoài id) — no-op hợp lệ phải
  // round-trip được, không throw vì "không có gì để update".
  await runCheck("session", "update (empty payload)", () => session.update({ id: sessionId }), {
    expectBusinessError: true,
  });

  // status ĐÚNG giá trị hợp lệ nhưng SAI case ("IDLE" thay vì "idle") — khác hẳn case "invalid
  // status value" ở trên (chuỗi hoàn toàn không nằm trong enum); đây là bẫy hay gặp khi validate
  // bằng `enum.includes(value)` (case-sensitive) trong khi UI/caller khác lại gửi hoa/thường lẫn
  // lộn. Phải bị reject sạch (nếu BE case-sensitive) hoặc chuẩn hoá đúng (nếu case-insensitive) —
  // không phải throw kiểu transport hay lưu thẳng "IDLE" như 1 giá trị status khác "idle".
  // `updateStatus` tự nó trả về null/undefined dù thành công hay không (xác nhận qua mọi lần chạy
  // trước — không phải lỗi riêng của case này), nên PHẢI gọi `get()` lại sau đó để thấy giá trị thật
  // đã persist — không thể kết luận gì chỉ từ response của updateStatus.
  await runCheck(
    "session",
    "updateStatus (valid value, wrong case: IDLE)",
    async () => {
      await session.updateStatus({ session_id: sessionId, status: "IDLE" as any });
      const doc: any = await session.get(sessionId);
      return { persistedStatus: doc?.status };
    },
    { expectBusinessError: true },
  );

  await runCheck(
    "session",
    "markAsSeen",
    () => session.markAsSeen({ session_id: sessionId, workspace_id: workspaceId as string, user_id: "test-sdk-probe-user" }),
    { expectBusinessError: true },
  );

  await runCheck("session", "update", () => session.update({ id: sessionId, note: "updated by test-sdk" }), {
    expectBusinessError: true,
  });

  // update() nhận `[key: string]: any` tự do (khác `updateStatus`/`updateAgent`, đều có shape cố
  // định) — thử prototype pollution qua đúng cửa tự do đó. Assert Object.prototype của CHÍNH process
  // KHÔNG bị đầu độc sau round-trip, không chỉ kiểm tra "có throw hay không".
  await runCheck(
    "session",
    "update (prototype pollution via free-form fields)",
    async () => {
      const res = await session.update(
        JSON.parse(`{"id":"${sessionId}","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}}`),
      );
      assertNoPrototypePollution("session.update()");
      return res;
    },
    { expectBusinessError: true },
  );

  await runCheck(
    "session",
    "updateStatus",
    () => session.updateStatus({ session_id: sessionId, status: "idle" }),
    { expectBusinessError: true },
  );

  await runCheck(
    "session",
    "updateAgent",
    () => session.updateAgent({ session_id: sessionId, agent_id: "test-sdk-probe-agent" }),
    { expectBusinessError: true },
  );

  // `newSession` đã dùng để setup sessionId ở index.ts (idempotent, tìm-thấy-thì-update) - gọi lại
  // lần nữa ở đây chỉ update `last_updated`, không tạo trùng, nên an toàn để round-trip luôn.
  await runCheck(
    "session",
    "newSession",
    () => session.newSession({ id: sessionId, workspace_id: workspaceId }),
    { expectBusinessError: true },
  );

  // Confirmed against SessionService.createSession's real source - it just builds a DTO and
  // delegates to `this.newSession(sessionDTO)` internally, the exact same idempotent find-or-create
  // as `newSession` above. Safe to call with the same fixed sessionId.
  await runCheck(
    "session",
    "create",
    () => session.create({ id: sessionId, workspace_id: workspaceId }),
    { expectBusinessError: true },
  );

  // 3 updateStatus song song trên CÙNG session (idle/processing/completed) — round-trip đơn lẻ ở
  // trên không lộ ra race condition ghi đè lẫn nhau; ở đây chỉ cần cả 3 request tự nó không crash
  // transport (nội dung "ai thắng cuối" là hành vi nghiệp vụ hợp lệ, không phải thứ test này xác định).
  await runCheck("session", "updateStatus (3x concurrent, same session)", async () => {
    const settled = await Promise.allSettled(
      (["idle", "processing", "completed"] as const).map((status) =>
        session.updateStatus({ session_id: sessionId, status }),
      ),
    );
    const rejected = settled.filter((s) => s.status === "rejected") as PromiseRejectedResult[];
    if (rejected.length > 0) {
      throw new AssertionFailure(`${rejected.length}/3 concurrent updateStatus() calls failed: ${rejected[0].reason?.message || rejected[0].reason}`);
    }
    return { ok: settled.length };
  }, { expectBusinessError: true });
}
