import { SDKClient, ai, call, withMockSDK } from "@aivin-labs/sdk";
import { mintCap } from "./helpers/mintCap";

// Ứng viên lấy từ danh sách THẬT trả về bởi ai.getModels('openllm') (index.models.ts) - không đoán
// tên model. Mỗi ứng viên test bằng 1 prompt ngắn, đo latency thật trước khi đề xuất đưa vào
// config/llm_tier.json. Bỏ nvidia/llama-3.1-nemotron-70b-instruct (404 - model list có tên nhưng
// endpoint chat completions không phục vụ, không dùng được).
const CANDIDATES: Array<{ label: string; model: string; provider: string; host?: string; targetTier: string }> = [
  { label: "Qwen2.5 7B (local ollama)", model: "qwen2.5:7b", provider: "ollama", targetTier: "medium/hard fallback - local, no NVIDIA dependency" },
];

const PROMPT = "In one short sentence, what happens if you click 'Submit' on a form with a required field left empty?";

async function testCandidate(c: (typeof CANDIDATES)[number]): Promise<void> {
  const start = Date.now();
  try {
    // Escape hatch call() - timeout 90s (dài hơn hẳn default 30s của ai.prompt sugar) - lần trước
    // llama-3.3-70b bị cắt ở đúng 30s (DEADLINE_EXCEEDED phía CLIENT, không phải model thật sự chậm
    // tới đâu), cần con số thật để so sánh công bằng với 2 model 30B đã đo ở trên.
    const result = await call(
      "ai.prompt",
      {
        quest: PROMPT,
        opts: { provider: c.provider, host: c.host, model: c.model, max_tokens: 200 },
      },
      90_000,
    );
    const ms = Date.now() - start;
    const text = typeof result === "string" ? result : JSON.stringify(result);
    console.log(`[test-sdk] ✅ ${c.label} (${c.model}) [${c.targetTier}] — ${ms}ms`);
    console.log(`[test-sdk]    → ${text.slice(0, 200).replace(/\n/g, " ")}`);
  } catch (e: any) {
    const ms = Date.now() - start;
    console.log(`[test-sdk] ❌ ${c.label} (${c.model}) [${c.targetTier}] — FAILED after ${ms}ms: ${e?.message || e}`);
  }
}

async function main() {
  const { cap, client } = await mintCap({ plugin_id: "test-sdk" });
  const sdk = new SDKClient(
    { client, user: undefined as any, workspace: undefined as any, session: undefined as any },
    { cap },
  );

  await withMockSDK(sdk, async () => {
    // Tuần tự, không song song - muốn đo latency THẬT của từng model riêng biệt, tránh nhiều request
    // cùng lúc cạnh tranh rate-limit/slot làm sai lệch số đo.
    for (const c of CANDIDATES) {
      await testCandidate(c);
    }
  });

  process.exit(0);
}

main().catch((e) => {
  console.error("[test-sdk] FATAL:", e);
  process.exit(1);
});
