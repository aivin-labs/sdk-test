import { ai } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

/**
 * Duyệt qua TOÀN BỘ model text-generation thật đang cấu hình trong môi trường hiện tại — mỗi model
 * 1 lời gọi `ai.prompt` thật, để biết CHÍNH XÁC model nào đang hỏng thay vì chỉ biết "tier X hoạt
 * động" (tier có nhiều model dự phòng, 1 model chết vẫn có thể bị che bởi model khác trong cùng tier).
 *
 * Nguồn danh sách: snapshot tay từ BE's `.data/config/LLMTier.json` (client này không có cách nào tự
 * lấy danh sách qua chính SDK — xem 2 lý do dưới) — nên DỄ LỖI THỜI nếu ai đó đổi model trong config
 * đó mà quên cập nhật ở đây. Coi đây là điểm bảo trì thủ công, không phải nguồn chân lý.
 *
 * Tại sao không tự động lấy danh sách:
 * 1. `ai.getModels(provider?)` (SDK method DUY NHẤT liên quan tới việc "list model") chỉ proxy
 *    `AIEngine.getAvailableModels()` → `driverPool.get(provider).listModels()` của ĐÚNG 1 provider,
 *    không phải toàn bộ tier config — và trong môi trường này trả `array(0)` dù gọi không kèm
 *    provider (dùng provider mặc định) lẫn kèm provider giả, xem `ai.test.ts`'s
 *    "getModels"/"getModels (unknown provider)". Không dùng được để enumerate.
 * 2. Danh sách đầy đủ + trạng thái online thật (`ModelManagerService.getModelsWithAvailability`) chỉ
 *    lộ qua REST `GET /message/model/list` (`MessageController`), route FE-only dùng `AuthOptionalGuard`
 *    đọc JWT cookie/header — KHÔNG nhận API_KEY dạng `${client}-ak-<random>` mà test-sdk/mintCap dùng
 *    (`AuthHelper.parseToken` chỉ parse JWT, apiKey không parse được nên coi như request không có
 *    token, trả kết quả không gắn với tenant nào cụ thể) — không đáng tin cậy để dùng làm test fixture.
 *
 * De-dup theo (model) — nhiều tier dùng lại đúng 1 model (vd `claude-sonnet-4.6` ở cả
 * xhard/hard/medium/code/vl) nên chỉ probe 1 lần, tránh tốn tiền/thời gian gọi trùng.
 *
 * BẮT BUỘC truyền `provider` kèm `model` — PHÁT HIỆN THẬT từ lần chạy đầu (chỉ truyền `model` suông):
 * `resolveModelAndProvider` (`PromptResolutionHelper.ts:50-52`) khi thiếu `opts.provider` sẽ tra
 * `ModelHelper.getModelEndpoint(model)`; model không có trong registry local-endpoint (mọi model
 * cloud: claude/gemini/openai) rơi thẳng về `Env.DEFAULT_LLM_PROVIDER` — trên môi trường/`.env` đang
 * trỏ tới (`aivin login` credentials), biến này là `"vllm"` (`.env.staging:72`) nhưng KHÔNG có driver
 * vllm nào chạy thật ở đó, nên MỌI model không kèm `provider` đều fail giống hệt nhau
 * ("No driver found for provider vllm") dù model đó có tồn tại/hoạt động thật hay không — che mất
 * hoàn toàn tín hiệu "model nào thật sự có vấn đề". Đây là gap thật đáng báo cho team hạ tầng: bất kỳ
 * plugin nào gọi `ai.prompt(x, { model })` mà quên kèm `provider` trên staging đều lãnh đúng lỗi này.
 * Truyền tay `provider` (khớp `LLMTier.json`) ở đây để né gap đó và lấy được tín hiệu thật per-model.
 *
 * CHÚ Ý CHI PHÍ: đây là ~17 lời gọi LLM thật, kể cả các model tier cao nhất (o3-pro, claude-opus-4.8,
 * gemini-3.5-deep-think) — prompt cực ngắn + `max_tokens` thấp nên chi phí mỗi lần chạy không đáng
 * kể, nhưng vẫn là tiền thật, không phải no-op.
 *
 * KHÔNG kèm `tier` khi gọi — theo đúng `AIEngine.prompt`'s `isStrictTarget` (chỉ true khi có `model`
 * mà KHÔNG có `tier`): model lỗi sẽ THROW thẳng thay vì âm thầm auto-fallback sang model khác trong
 * cùng tier (auto-fallback chỉ áp dụng cho lỗi hạ tầng 5xx/offline, không che lỗi riêng của model cụ
 * thể) — đúng mục đích bài test này.
 *
 * Bỏ qua tier `realtime` (WebSocket voice session, không hợp round-trip request/response đơn giản
 * của `ai.prompt`), `embedding`/`stt` (không có cách tạo input giả an toàn — audio/text thật cần
 * decode đúng định dạng), và `rerank` (`AISDK.ts`'s `register('rerank', ...)` KHÔNG forward
 * `params.opts` xuống `AIEngine.rerank` — model rerank không thể ép qua SDK, chỉ có đúng 1 model nên
 * không có gì để duyệt thêm ngoài case `ai.rerank` mặc định đã có sẵn trong `ai.test.ts`).
 */
const TEXT_MODELS: Array<{ tier: string; provider: string; model: string; host?: string }> = [
  // xhard
  { tier: "xhard", provider: "openllm", model: "qwen3.7-max", host: "aliyuncs.com" },
  { tier: "xhard", provider: "openllm", model: "deepseek-v4-pro", host: "aliyuncs.com" },
  { tier: "xhard", provider: "claude", model: "claude-sonnet-4.6" },
  { tier: "xhard", provider: "gemini", model: "gemini-3.5-pro" },
  { tier: "xhard", provider: "openai", model: "gpt-5.5" },
  { tier: "xhard", provider: "openai", model: "o3-pro" },
  { tier: "xhard", provider: "claude", model: "claude-opus-4.8" },
  { tier: "xhard", provider: "gemini", model: "gemini-3.5-deep-think" },
  // medium (model mới so với xhard/hard)
  { tier: "medium", provider: "openllm", model: "qwen3.7-plus", host: "aliyuncs.com" },
  { tier: "medium", provider: "claude", model: "claude-haiku-4.5" },
  { tier: "medium", provider: "gemini", model: "gemini-3.5-flash" },
  { tier: "medium", provider: "openai", model: "gpt-5.5-mini" },
  // light (model mới)
  { tier: "light", provider: "openllm", model: "qwen-turbo", host: "aliyuncs.com" },
  // nano (model mới)
  { tier: "nano", provider: "vllm", model: "Qwen/Qwen2.5-3B-Instruct-AWQ" },
  // code (model mới)
  { tier: "code", provider: "openllm", model: "qwen3-coder-plus", host: "aliyuncs.com" },
  // vl (model mới)
  { tier: "vl", provider: "openllm", model: "qwen-vl-plus", host: "aliyuncs.com" },
  { tier: "vl", provider: "openllm", model: "qwen-vl-max", host: "aliyuncs.com" },
];

export async function testModels(): Promise<void> {
  for (const { tier, provider, model, host } of TEXT_MODELS) {
    await runCheck(
      "models",
      `${tier}/${provider}:${model}`,
      () =>
        ai.prompt('Trả lời đúng 1 từ: "ok"', {
          provider,
          model,
          ...(host ? { host } : {}),
          max_tokens: 200, // dư dả cho model reasoning (o3-pro/claude-opus-4.8/gemini-deep-think) tốn token nghĩ trước khi ra chữ
          temperature: 0,
        } as any),
      { expectBusinessError: true },
    );
  }

  skip("models", "embedding/BAAI/bge-m3", "already covered as the default embedding model in ai.test.ts (getEmbedding/getEmbeddings) — only 1 model configured for this tier, nothing extra to probe");
  skip("models", "rerank/BAAI/bge-reranker-v2-m3", "AISDK.ts's register('rerank', ...) doesn't forward params.opts to AIEngine.rerank — model can't be overridden through the SDK, and only 1 model is configured anyway (already covered in ai.test.ts)");
  skip("models", "realtime/*", "WebSocket voice session, not a fit for ai.prompt's simple request/response round-trip");
  skip("models", "tts/*, stt/*", "needs a real audio payload to decode/produce meaningfully — no safe fake audio like OCR's 1x1 PNG, and not the focus of this 'which LLM models work' probe");
}
