import { browser, call } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/**
 * `cancel` không có mission nào đang chạy vẫn an toàn gọi (no-op có kiểm soát, không tốn tài
 * nguyên).
 *
 * `run` là 1 agentic AI Browser mission nhiều vòng LLM+browser thật — tốn tiền/thời gian thật mỗi
 * lần chạy, trước đây skip mặc định. Giờ test thật theo yêu cầu, chọn mission tối giản nhất có thể
 * (1 bước, site nhẹ, success_criteria rõ ràng) để mission hội tụ nhanh, giảm chi phí. Dùng `call()`
 * (escape hatch, không phải `browser.run()` sugar) để truyền timeout riêng dài hơn hẳn mức mặc định
 * 30s của SDK.
 *
 * 10 phút, không phải đoán bừa — comment gốc `AIBrowserService.triggerMission` nói thẳng mission
 * "tới 8 phút, hàng chục lệnh LLM", nên timeout phải nới rộng hơn hẳn con số đó mới có cơ hội thấy
 * kết quả thật thay vì DEADLINE_EXCEEDED (lần chạy 120s trước đã xác nhận đúng như vậy).
 */
export async function testBrowser(): Promise<void> {
  await runCheck("browser", "cancel", () => browser.cancel(), { expectBusinessError: true });

  // (Cân nhắc thêm 1 case "mission thiếu data" nhưng bỏ — `start_url`/`steps` trong AIBrowserDTO đều
  // OPTIONAL ("tùy chọn - agent tự điều hướng nếu không có", xem BrowserEvalTypes.ts), nên thiếu field
  // không bị validate-reject sớm mà sẽ thật sự khởi động 1 mission agentic mở tốn tiền/thời gian —
  // không an toàn hơn gì so với case `run` đầy đủ ở dưới, chỉ tốn thêm 1 lần chạy thật vô ích.)

  await runCheck(
    "browser",
    "run",
    () =>
      call(
        "browser.run",
        {
          mission: "Go to the start URL and report the exact text of the page's <title> tag.",
          data: {
            start_url: "https://example.com",
            success_criteria: ["Page title has been read and reported"],
            steps: ["Load the page", "Read the <title> tag text", "Report it and finish"],
          },
        },
        600_000,
      ),
    { expectBusinessError: true },
  );
}
