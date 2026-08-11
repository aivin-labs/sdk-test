import { usage } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/**
 * `usage` thường scope theo workspace, mà mintCap ở đây không cấp workspace_id — nên chấp nhận
 * lỗi nghiệp vụ (vd "workspace required") là PASS, miễn không phải lỗi transport/auth. Read-only,
 * không có tham số bắt buộc nên an toàn để gọi thẳng.
 */
export async function testUsage(): Promise<void> {
  await runCheck("usage", "checkBalance", () => usage.checkBalance(), {
    expectBusinessError: true,
  });

  await runCheck("usage", "getUsage", () => usage.getUsage(), {
    expectBusinessError: true,
  });
}
