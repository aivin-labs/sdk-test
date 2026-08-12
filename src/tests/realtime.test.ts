import { realtime } from "@aivin-labs/sdk";
import { assertNoPrototypePollution, runCheck } from "../helpers/report";

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

  // target="user" — nhánh delivery khác hẳn "workspace" (broadcast toàn phòng vs. gửi riêng 1 user,
  // chắc chắn resolve về đúng ctx.user hiện tại — vẫn an toàn, không gửi cho ai khác).
  await runCheck(
    "realtime",
    "publish (target=user)",
    () =>
      realtime.publish({
        event: "test-sdk.probe.user",
        data: { note: "round-trip probe from test-sdk targeting the calling user" },
        target: "user",
      }),
    { expectBusinessError: true },
  );

  // event rỗng — phải bị validate reject sạch, không phải throw vì pub/sub channel nhận tên event rỗng.
  await runCheck(
    "realtime",
    "publish (empty event name)",
    () => realtime.publish({ event: "", data: {}, target: "workspace" }),
    { expectBusinessError: true },
  );

  // `data` là kiểu `any` hoàn toàn tự do (nội dung event, không ràng buộc shape) — bề mặt pollution
  // duy nhất trong namespace này. Assert Object.prototype của CHÍNH process KHÔNG bị đầu độc, và vì
  // đây là pub/sub thuần (không ghi DB) nên an toàn tuyệt đối để thử, giống mọi case publish khác.
  await runCheck(
    "realtime",
    "publish (prototype pollution via data)",
    async () => {
      const res = await realtime.publish(
        JSON.parse('{"event":"test-sdk.probe.proto","data":{"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}},"target":"workspace"}'),
      );
      assertNoPrototypePollution("realtime.publish()'s data");
      return res;
    },
    { expectBusinessError: true },
  );
}
