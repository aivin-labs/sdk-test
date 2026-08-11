import { setting } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/** Cả 2 đều read-only, không tham số bắt buộc — an toàn tuyệt đối. */
export async function testSetting(): Promise<void> {
  await runCheck("setting", "get", () => setting.get(), { expectBusinessError: true });

  await runCheck("setting", "getMerchantConfig", () => setting.getMerchantConfig(), {
    expectBusinessError: true,
  });
}
