import { ai } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/**
 * Namespace quan trọng nhất — mọi lời gọi ở đây thật sự đi tới BE's AIEngine (qua ai.prompt),
 * đúng round-trip vừa fix (SDK_GRPC_TLS). Không mock gì — model thật trả lời thật.
 */
export async function testAi(): Promise<void> {
  await runCheck("ai", "prompt", () =>
    ai.prompt('Trả lời đúng 1 từ: "ok"'),
  );

  // `promptStream` đi qua RPC khác hẳn `prompt` (InvokeStream, không phải Invoke) — vẫn cùng
  // namespace `ai` nên gộp chung file này (không tách file riêng theo RPC transport), nhưng cần
  // check riêng vì có thể fail độc lập dù `prompt` đã pass (khác code path cả 2 đầu SDK lẫn
  // GrpcSDKServer).
  await runCheck("ai", "promptStream", async () => {
    const { textStream, text } = ai.promptStream(
      'Đếm từ 1 đến 5, mỗi số cách nhau 1 khoảng trắng, không thêm chữ gì khác.',
    );

    let chunkCount = 0;
    let assembled = "";
    for await (const delta of textStream) {
      chunkCount++;
      assembled += delta;
      process.stdout.write(`[chunk ${chunkCount}] ${JSON.stringify(delta)}\n`);
    }

    const full = await text;
    if (full !== assembled) {
      throw new Error(
        `final text doesn't match the string assembled from textStream — final="${full}" assembled="${assembled}"`,
      );
    }
    if (chunkCount === 0) {
      throw new Error("textStream emitted zero chunks — server may have fallen back incorrectly or isn't streaming for real");
    }

    return { chunkCount, textLength: full.length, preview: full.slice(0, 80) };
  });

  await runCheck("ai", "getEmbedding", () => ai.getEmbedding("xin chào"));

  await runCheck("ai", "getEmbeddings", () =>
    ai.getEmbeddings(["xin chào", "hello"]),
  );

  await runCheck("ai", "rerank", () =>
    ai.rerank("thời tiết hôm nay", [
      "Hà Nội hôm nay nắng đẹp",
      "Con mèo đang ngủ trên ghế",
    ]),
  );

  await runCheck("ai", "getModels", () => ai.getModels());

  await runCheck("ai", "calculateTokens", () =>
    ai.calculateTokens({ text: "xin chào thế giới" }),
  );

  // 1x1 PNG trong suốt - đủ để chứng minh round-trip OCR thật, không cần ảnh có chữ (kết quả rỗng
  // là hợp lệ, miễn không throw ở tầng transport). expectBusinessError vì driver OCR có thể chưa
  // cấu hình trên môi trường này (giống rerank trước khi fix pool) - đó là gap hạ tầng, không phải
  // lỗi round-trip của SDK.
  await runCheck(
    "ai",
    "ocr",
    () =>
      ai.ocr({
        id: "test-sdk-ocr-probe",
        url: "",
        file: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
      }),
    { expectBusinessError: true },
  );

  // max_cost_usd cực thấp - cố tình ép rơi vào nhánh "vượt ngân sách" (throw) thay vì generate thật
  // tốn tiền. Cả 2 nhánh (generate thành công với tier siêu rẻ, hoặc bị chặn vì vượt ngân sách) đều
  // chứng minh round-trip đúng - expectBusinessError coi throw ngân sách là PASS hợp lệ, không phải
  // lỗi SDK.
  await runCheck(
    "ai",
    "image",
    () => ai.image("a single red dot on white background", { max_cost_usd: 0.01, media_tier: "budget" }),
    { expectBusinessError: true },
  );

  await runCheck(
    "ai",
    "video",
    () => ai.video("a single red dot, still frame", { max_cost_usd: 0.01, media_tier: "budget" }),
    { expectBusinessError: true },
  );
}
