import { message } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

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

  await runCheck("message", "getList", async () => {
    const list = await message.getList({ session_id: sessionId, limit: 5 });
    messageId = (list as any[])?.[0]?.id ?? (list as any[])?.[0]?._id;
    return list;
  });

  await runCheck("message", "search", () => message.search({ session_id: sessionId, query: "probe", limit: 3 }), {
    expectBusinessError: true,
  });

  await runCheck("message", "init", () => message.init({ session_id: sessionId }), {
    expectBusinessError: true,
  });

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
  } else {
    skip("message", "getById", "getList returned no id (brand-new session has no messages yet)");
    skip("message", "update", "getList returned no id (brand-new session has no messages yet)");
  }

  skip("message", "stream", "MessageService.streamResponse reads ctx.session.id, not params.session_id, to attach the message - our ctx.session is always undefined, so this would persist an orphaned message with no session instead of landing in the test session");
}
