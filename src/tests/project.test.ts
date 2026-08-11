import { project } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/** Cả 2 đều read-only, an toàn. Không có project_id thật sẵn có (xem README của test-sdk) nên
 *  `get` dùng id giả — vẫn chứng minh round-trip đúng qua lỗi nghiệp vụ "not found". */
export async function testProject(workspaceId?: string): Promise<void> {
  await runCheck("project", "search", () => project.search({ workspace_id: workspaceId, keyword: "test" }), {
    expectBusinessError: true,
  });

  await runCheck("project", "get", () => project.get({ id: "test-sdk-probe-missing-id" }), {
    expectBusinessError: true,
  });
}
