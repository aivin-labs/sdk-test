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

  // search với keyword rỗng — khác keyword thật ở trên, phải trả full list có giới hạn/lỗi nghiệp vụ
  // sạch, không phải throw vì search engine nhận keyword rỗng.
  await runCheck(
    "project",
    "search (empty keyword)",
    () => project.search({ workspace_id: workspaceId, keyword: "" }),
    { expectBusinessError: true },
  );

  // keyword dạng regex/NoSQL-operator injection (`.*`, `$where`) trong 1 chuỗi tìm kiếm text bình
  // thường — nếu search engine bên dưới build regex/query thẳng từ input không escape, đây có thể
  // là ReDoS hoặc NoSQL injection qua field tìm kiếm. Chỉ xác nhận không crash transport, không giả
  // định được search engine cụ thể nào đứng sau.
  await runCheck(
    "project",
    "search (regex/operator-injection-shaped keyword)",
    () => project.search({ workspace_id: workspaceId, keyword: '.*$where:"1==1"(a+)+$' }),
    { expectBusinessError: true },
  );
}
