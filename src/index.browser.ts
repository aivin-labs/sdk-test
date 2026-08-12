import { SDKClient, browser, withMockSDK } from "@aivin-labs/sdk";
import { mintCap } from "./helpers/mintCap";

interface AgentStepChunk {
  step: number;
  type: string;
  url: string;
  summary: string;
  clientId?: string;
}

/**
 * Đọc `steps` (AsyncGenerator<string>) và in ra ngay khi có - đây là log THẬT từ backend
 * (AIBrowserService.emitAgentStep, cùng dữ liệu FE screencast nhận qua `browser:agent-step`), khác
 * hẳn heartbeat giả trước đây. Chạy song song (không await) với việc chờ `result` ở nơi gọi.
 */
async function logStepsAsTheyArrive(steps: AsyncGenerator<string, void, void>, start: number): Promise<void> {
  for await (const raw of steps) {
    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    try {
      const step = JSON.parse(raw) as AgentStepChunk;
      console.log(`[test-sdk]   [+${elapsed}s] step ${step.step} (${step.type}) @ ${step.url} — ${step.summary}`);
    } catch {
      console.log(`[test-sdk]   [+${elapsed}s] (chunk không parse được JSON) ${raw}`);
    }
  }
}

async function main() {
  const { cap, client } = await mintCap({ plugin_id: "test-sdk" });

  const sdk = new SDKClient(
    { client, user: undefined as any, workspace: undefined as any, session: undefined as any },
    { cap },
  );

  console.log(`[test-sdk] client=${client} cap=${cap.slice(0, 8)}...`);

  // Tracked outside withMockSDK's callback so the process exit code reflects whether the mission
  // actually succeeded - previously this script always `process.exit(0)` unconditionally, so a
  // failed/errored mission still reported success to the shell/CI (`npm run test:browser` is a
  // separate one-off script from `npm test`'s index.ts, which correctly derives its exit code from
  // printReport()'s totalFail).
  let missionFailed = false;

  await withMockSDK(sdk, async () => {
    // KHÔNG gọi browser.cancel() ở đây trước khi run() - browser.cancel() set 1 cờ Redis TTL 600s
    // (AIBrowserService.requestCancel), mission MỚI bên dưới sẽ thấy cờ đó ngay ở vòng lặp đầu và tự
    // hủy ngay lập tức (đã tự bắt lỗi này: response trả về "Nhiệm vụ đã bị hủy theo yêu cầu
    // (sdk.browser.cancel)" dù chưa hề gọi cancel cho CHÍNH mission này). cancel() chỉ nên gọi nhắm
    // vào 1 mission ĐANG THẬT SỰ chạy, không phải như bước "dọn dẹp" trước khi bắt đầu cái mới.
    console.log(`[test-sdk] browser.runStream() bắt đầu - log real-time từng bước agent bên dưới:`);
    const start = Date.now();
    const { steps, result } = browser.runStream(
      "Go to the start URL and report the exact text of the page's <title> tag.",
      {
        start_url: "https://example.com",
        success_criteria: ["Page title has been read and reported"],
        steps: ["Load the page", "Read the <title> tag text", "Report it and finish"],
      },
    );

    // Đọc chunk song song, KHÔNG await ở đây - result cũng phải được await độc lập bên dưới, không
    // thì lỗi bị nuốt (final rejects) trong khi ta chỉ đứng chờ mỗi steps generator.
    const stepLogging = logStepsAsTheyArrive(steps, start).catch((e) =>
      console.error(`[test-sdk] step stream error: ${e?.message || e}`),
    );

    const final = await result.catch((e: any) => ({ __error: e?.message || String(e) }));
    await stepLogging;

    console.log(`[test-sdk] browser.runStream() kết thúc sau ${((Date.now() - start) / 1000).toFixed(1)}s:`);
    console.log(JSON.stringify(final, null, 2).slice(0, 4000));
    missionFailed = !!(final as any)?.__error;

    const postClean = await browser.cancel();
    console.log(`[test-sdk] cancel (post): ${JSON.stringify(postClean)}`);
  });

  process.exit(missionFailed ? 1 : 0);
}

main().catch((e) => {
  console.error("[test-sdk] FATAL:", e);
  process.exit(1);
});
