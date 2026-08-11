import { SDKClient, browser, call, withMockSDK } from "@aivin-labs/sdk";
import { mintCap } from "./helpers/mintCap";
import { printReport, runCheck } from "./helpers/report";

/**
 * Bọc 1 lời gọi run() dài hạn bằng heartbeat log mỗi `intervalMs` - KHÔNG phải log tiến trình thật
 * của mission (SDK's browser.run() không expose step-by-step log qua RPC, xem docs/sdk/browser.md:
 * "There is still no way to stream intermediate progress... only reaches the chat UI's live
 * screencast via a separate socket channel, not through this SDK call"). Đây chỉ là dấu hiệu
 * "vẫn đang chờ, chưa treo" phía client, không phải log thật từ backend.
 */
function withHeartbeat<T>(label: string, fn: () => Promise<T>, intervalMs = 15_000): () => Promise<T> {
  return async () => {
    const start = Date.now();
    const timer = setInterval(() => {
      console.log(`[test-sdk]   ... ${label} vẫn đang chạy (${Math.round((Date.now() - start) / 1000)}s trôi qua, chưa có log real-time từ backend)`);
    }, intervalMs);
    try {
      return await fn();
    } finally {
      clearInterval(timer);
    }
  };
}

async function main() {
  const { cap, client } = await mintCap({ plugin_id: "test-sdk" });

  const sdk = new SDKClient(
    { client, user: undefined as any, workspace: undefined as any, session: undefined as any },
    { cap },
  );

  console.log(`[test-sdk] client=${client} cap=${cap.slice(0, 8)}...`);

  const minimalMission = () =>
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
    );

  await withMockSDK(sdk, async () => {
    // Dọn mission cũ (nếu có) TRƯỚC khi thử run() mới - lần chạy trước fail vì "đã có nhiệm vụ khác
    // đang chạy cho khách hàng" nên phải cancel() trước, không thì run() mới cũng sẽ fail y hệt.
    await runCheck("browser", "cancel (pre-clean)", () => browser.cancel(), { expectBusinessError: true });

    await runCheck("browser", "run #1", withHeartbeat("browser.run #1", minimalMission), {
      expectBusinessError: true,
    });

    /**
     * Chẩn đoán: gọi lại NGAY (không cancel ở giữa) - AIBrowserService.executeMission's
     * acquireLockWithWait chờ tới 60s rồi mới trả lỗi nghiệp vụ "ANOTHER_MISSION_RUNNING" nếu lock
     * (TTL 1500s) vẫn còn bị giữ. Nếu lần #1 vừa rồi thật sự bị cắt bởi timeout tầng transport (HTTP
     * 524 từ Cloudflare Tunnel `beta-sdk.aivin.vn`) trong khi mission SERVER-SIDE vẫn tiếp tục chạy,
     * thì lần gọi #2 này sẽ thấy đúng thông báo đó trong vòng ~60-65s - bằng chứng trực tiếp mission
     * vẫn sống, không phải bị crash/hỏng. Nếu #2 KHÔNG thấy thông báo đó (chạy tiếp bình thường hoặc
     * lỗi khác), nghĩa là lock đã được giải phóng - mission #1 đã thật sự kết thúc trước đó.
     */
    await runCheck("browser", "run #2 (probe lock, ngay sau #1)", withHeartbeat("browser.run #2", minimalMission), {
      expectBusinessError: true,
    });

    await runCheck("browser", "cancel (post)", () => browser.cancel(), { expectBusinessError: true });
  });

  const ok = printReport();
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error("[test-sdk] FATAL:", e);
  process.exit(1);
});
