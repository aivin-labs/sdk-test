import { agent } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

/**
 * `get`/`status` không truyền id sẽ resolve theo agent hiện tại của invocation — mintCap không có
 * session/agent thật nên chấp nhận lỗi nghiệp vụ.
 *
 * `reply`/`tell` an toàn kể cả không có session thật — đọc thẳng `AgentSDK.ts` xác nhận cả 2 tự hạ
 * cấp có kiểm soát khi thiếu `ctx.session.id`: `reply` rơi về `AIEngine.prompt` trần (không có gì
 * persist vào chat), `tell` trả `{success:false}` (không throw, không side effect). `resolveHil`
 * với session giả cũng an toàn — `SDK.session.get()` không thấy session thì trả lỗi nghiệp vụ sạch
 * `session_not_found`, không throw.
 *
 * `cancel`/`delegate`/`processMessage` vẫn skip — có tác dụng phụ thật (huỷ response đang chạy,
 * trigger routing/agent khác) không có nhánh hạ cấp an toàn khi thiếu context như 2 cái trên.
 */
export async function testAgent(): Promise<void> {
  await runCheck("agent", "get", () => agent.get(), { expectBusinessError: true });

  await runCheck("agent", "status", () => agent.status(), { expectBusinessError: true });

  await runCheck("agent", "reply", () => agent.reply('Trả lời đúng 1 từ: "ok"'), {
    expectBusinessError: true,
  });

  await runCheck("agent", "tell", () => agent.tell("test-sdk probe (no live session, safe no-op)"), {
    expectBusinessError: true,
  });

  await runCheck(
    "agent",
    "resolveHil",
    () => agent.resolveHil({ session_id: "test-sdk-probe-missing-session", reply_id: "test-sdk-probe-missing-reply" }),
    { expectBusinessError: true },
  );

  for (const method of ["cancel", "delegate", "processMessage"]) {
    skip("agent", method, "real side effect on a real user's chat/session (cancels a live response, triggers routing to another agent...), no safe degrade path when context is missing");
  }
}
