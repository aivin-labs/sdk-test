import { knowledge } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/**
 * `knowledge` thường scope theo workspace, mà mintCap ở đây không cấp workspace_id — nên chấp
 * nhận lỗi nghiệp vụ (vd "workspace required") là PASS, miễn không phải lỗi transport/auth. Chỉ
 * gọi `search` (read-only), không `store`/`del` để tránh tạo/xoá data thật ngoài ý muốn.
 */
export async function testKnowledge(): Promise<void> {
  await runCheck(
    "knowledge",
    "search",
    () => knowledge.search("test-sdk probe query", { limit: 3 }),
    { expectBusinessError: true },
  );
}
