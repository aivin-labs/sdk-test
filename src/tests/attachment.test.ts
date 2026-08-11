import { attachment } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

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

  for (const method of ["upload", "deepResearch", "evaluate", "queryTabularData", "queryMediaTimestamp", "extract"]) {
    skip("attachment", method, "needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId");
  }
}
