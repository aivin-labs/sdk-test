import { attachment } from "@aivin-labs/sdk";
import { AssertionFailure, runCheck, skip } from "../helpers/report";

/**
 * Chỉ `search` là read-only, không cần `docId` thật. Mọi method khác (`upload`/`deepResearch`/
 * `evaluate`/`queryTabularData`/`queryMediaTimestamp`/`extract`) đều cần 1 `docId` thật đã tồn tại
 * trong tenant, và hầu hết là các lời gọi AI nặng/tốn tiền (deep research nhiều vòng, đọc bảng...) —
 * không có docId thật để test nên skip toàn bộ thay vì đoán bừa.
 */
export async function testAttachment(): Promise<void> {
  await runCheck("attachment", "search", () => attachment.search({ query: "test-sdk probe", limit: 3 }), {
    expectBusinessError: true,
  });

  // query rỗng — không có gì để tìm, phải là lỗi nghiệp vụ sạch hoặc trả full/rỗng có kiểm soát,
  // không phải throw vì search engine nhận query rỗng.
  await runCheck("attachment", "search (empty query)", () => attachment.search({ query: "", limit: 3 }), {
    expectBusinessError: true,
  });

  // limit=0 — biên nhỏ nhất, phải trả mảng rỗng chứ không phải bị coi là "không giới hạn" (lỗi hay
  // gặp khi BE coi 0 là falsy rồi rơi về default).
  await runCheck(
    "attachment",
    "search (limit=0)",
    async () => {
      const res = await attachment.search({ query: "test-sdk probe", limit: 0 } as any);
      if (Array.isArray(res) && res.length !== 0) {
        throw new AssertionFailure(`limit=0 should return an empty array, got ${res.length} results`);
      }
      return res;
    },
    { expectBusinessError: true },
  );

  for (const method of ["upload", "deepResearch", "evaluate", "queryTabularData", "queryMediaTimestamp", "extract"]) {
    skip("attachment", method, "needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId");
  }
}
