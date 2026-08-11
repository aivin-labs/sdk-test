import { session } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

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

  await runCheck(
    "session",
    "markAsSeen",
    () => session.markAsSeen({ session_id: sessionId, workspace_id: workspaceId as string, user_id: "test-sdk-probe-user" }),
    { expectBusinessError: true },
  );

  await runCheck("session", "update", () => session.update({ id: sessionId, note: "updated by test-sdk" }), {
    expectBusinessError: true,
  });

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
}
