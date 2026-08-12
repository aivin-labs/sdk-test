import { workspace } from "@aivin-labs/sdk";
import { assertNoPrototypePollution, runCheck, skip } from "../helpers/report";

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

  // getByIds với mảng rỗng — không có gì để tra, phải trả mảng rỗng sạch, không phải throw vì
  // code cố build 1 query "IN ()" rỗng.
  await runCheck("workspace", "getByIds (empty array)", () => workspace.getByIds([]), {
    expectBusinessError: true,
  });

  await runCheck("workspace", "getMembers", () => workspace.getMembers(), { expectBusinessError: true });

  await runCheck(
    "workspace",
    "checkPermission",
    () => workspace.checkPermission({ workspace_id: workspaceId, permission: "read" }),
    { expectBusinessError: true },
  );

  // permission không nằm trong enum hợp lệ nào — phải bị reject sạch bằng lỗi nghiệp vụ hoặc trả
  // false (không có quyền lạ), không phải throw vì code cố index vào 1 permission map không có key đó.
  await runCheck(
    "workspace",
    "checkPermission (invalid permission)",
    () => workspace.checkPermission({ workspace_id: workspaceId, permission: "this-is-not-a-real-permission" }),
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

  // query rỗng — khác query thật ở trên, phải trả full list có giới hạn/lỗi nghiệp vụ sạch, không
  // phải throw vì search engine nhận query rỗng.
  await runCheck(
    "workspace",
    "searchAgents (empty query)",
    () => workspace.searchAgents({ query: "", limit: 3 }),
    { expectBusinessError: true },
  );

  await runCheck(
    "workspace",
    "updatePlugin",
    () => workspace.updatePlugin({ plugin_id: "test-sdk", workspace_id: workspaceId, arguments: {} }),
    { expectBusinessError: true },
  );

  // `arguments` là field TỰ DO duy nhất trong toàn namespace này (mọi method khác đều string/id cố
  // định) — bề mặt injection/pollution rộng nhất ở đây. Vẫn dùng đúng `plugin_id: "test-sdk"` như
  // case ở trên (phạm vi tenant test tự quản lý, không đụng plugin thật nào khác).
  await runCheck(
    "workspace",
    "updatePlugin (prototype pollution via arguments)",
    async () => {
      const res = await workspace.updatePlugin(
        JSON.parse(
          `{"plugin_id":"test-sdk","workspace_id":${JSON.stringify(workspaceId ?? null)},"arguments":{"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}}}`,
        ),
      );
      assertNoPrototypePollution("workspace.updatePlugin()'s arguments");
      return res;
    },
    { expectBusinessError: true },
  );
}
