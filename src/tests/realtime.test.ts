import { realtime } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/**
 * `publish` là pub/sub thuần (không ghi gì xuống DB, không tạo bản ghi lâu dài) — an toàn để test
 * thật, đặt tên event rõ ràng là probe để không gây hiểu nhầm nếu ai đó đang lắng nghe workspace
 * room đúng lúc test chạy.
 */
export async function testRealtime(): Promise<void> {
  await runCheck(
    "realtime",
    "publish",
    () =>
      realtime.publish({
        event: "test-sdk.probe",
        data: { note: "round-trip probe from test-sdk, safe to ignore if you see this event" },
        target: "workspace",
      }),
    { expectBusinessError: true },
  );
}
