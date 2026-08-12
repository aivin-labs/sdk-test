import { knowledge } from "@aivin-labs/sdk";
import { AssertionFailure, runCheck } from "../helpers/report";

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

  // query rỗng — khác query thật ở trên, phải là lỗi nghiệp vụ sạch hoặc trả rỗng có kiểm soát,
  // không phải throw vì search engine nhận query rỗng.
  await runCheck("knowledge", "search (empty query)", () => knowledge.search("", { limit: 3 }), {
    expectBusinessError: true,
  });

  // limit=0 — biên nhỏ nhất, phải trả mảng rỗng chứ không phải bị coi là "không giới hạn".
  await runCheck(
    "knowledge",
    "search (limit=0)",
    async () => {
      const res = await knowledge.search("test-sdk probe query", { limit: 0 } as any);
      if (Array.isArray(res) && res.length !== 0) {
        throw new AssertionFailure(`limit=0 should return an empty array, got ${res.length} results`);
      }
      return res;
    },
    { expectBusinessError: true },
  );
}
