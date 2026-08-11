import { workspace } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

/**
 * Toàn bộ read-only, an toàn gọi thẳng với `workspaceId` thật (mintCap đã fetch sẵn) — không có
 * thì vẫn chấp nhận lỗi nghiệp vụ. `updatePlugin` ghi 1 config rỗng cho đúng `plugin_id: "test-sdk"`
 * (`getPluginConfig` ở trên xác nhận trước đó chưa có entry nào cho plugin này - `arguments: {}` là
 * artifact vô hại, đúng phạm vi tenant test đang tự quản lý, không đụng plugin thật nào khác).
 */
export async function testWorkspace(workspaceId?: string): Promise<void> {
  await runCheck("workspace", "get", () => workspace.get(workspaceId ?? "test-sdk-probe-missing-id"), {
    expectBusinessError: true,
  });

  await runCheck(
    "workspace",
    "getByIds",
    () => workspace.getByIds(workspaceId ? [workspaceId] : ["test-sdk-probe-missing-id"]),
    { expectBusinessError: true },
  );

  await runCheck("workspace", "getMembers", () => workspace.getMembers(), { expectBusinessError: true });

  await runCheck(
    "workspace",
    "checkPermission",
    () => workspace.checkPermission({ workspace_id: workspaceId, permission: "read" }),
    { expectBusinessError: true },
  );

  await runCheck(
    "workspace",
    "getPluginConfig",
    () => workspace.getPluginConfig({ plugin_id: "test-sdk", workspace_id: workspaceId }),
    { expectBusinessError: true },
  );

  await runCheck(
    "workspace",
    "searchAgents",
    () => workspace.searchAgents({ query: "test", limit: 3 }),
    { expectBusinessError: true },
  );

  await runCheck(
    "workspace",
    "updatePlugin",
    () => workspace.updatePlugin({ plugin_id: "test-sdk", workspace_id: workspaceId, arguments: {} }),
    { expectBusinessError: true },
  );
}
