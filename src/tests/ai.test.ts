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

  // ---------------------------------------------------------------------------------------------
  // Hard cases — mọi trường hợp dưới đây cố tình đưa input về biên (empty/huge/malformed) để lộ ra
  // các lỗi transport (crash serialize, treo timeout, sai encoding) mà happy-path ở trên không chạm
  // tới. expectBusinessError vẫn dùng bất cứ khi nào BE có thể hợp lệ trả lỗi nghiệp vụ (400 kiểu
  // "invalid input") thay vì round-trip thành công — cả 2 nhánh đều chứng minh SDK/transport ổn.
  // ---------------------------------------------------------------------------------------------

  // Chuỗi rỗng — nhiều LLM gateway 400 ngay ở tầng validate trước khi chạm model, cần chắc SDK
  // forward đúng lỗi đó thay vì tự throw sớm hơn hoặc treo.
  await runCheck("ai", "prompt (empty string)", () => ai.prompt(""), { expectBusinessError: true });

  // Prompt dạng mảng message (chat-style) thay vì string — nhánh code khác hẳn ở cả 2 đầu
  // (SDKClient chấp `quest: string | any[]`) nên cần probe riêng, không suy ra được từ case string.
  await runCheck(
    "ai",
    "prompt (message array)",
    () =>
      ai.prompt([
        { role: "system", content: "Bạn là trợ lý chỉ trả lời đúng 1 từ." },
        { role: "user", content: 'Trả lời đúng 1 từ: "ok"' },
      ] as any),
    { expectBusinessError: true },
  );

  // Input rất dài (~20k ký tự lặp) — ép request đi qua giới hạn context/chunking thật, khác hẳn các
  // câu ngắn ở trên vốn không bao giờ chạm nhánh "quá dài" của model hay transport (gRPC message size).
  await runCheck(
    "ai",
    "prompt (huge input ~20k chars)",
    () => ai.prompt("Tóm tắt đoạn văn sau trong đúng 1 câu:\n" + "lorem ipsum dolor sit amet ".repeat(700)),
    { expectBusinessError: true },
  );

  // Structured output qua `schema` — xác nhận round-trip JSON-mode thật (nhánh code khác hẳn free-text),
  // và tự verify response parse được đúng shape đã khai báo thay vì chỉ "không throw".
  //
  // LƯU Ý format: `schema` ở đây KHÔNG phải JSON Schema chuẩn (dù field khác `LLMPromptOptions` không
  // gợi ý gì khác — type khai báo `Record<string, any>`). Đây là shorthand riêng của hệ thống
  // (`DriverHelper.convertCustomSchemaToJSONSchema`, xác nhận qua cách gọi thật ở
  // `MissionProgressService`/`ConditionParser` bên BE): mỗi key là TÊN FIELD, value là chuỗi
  // `"type - mô tả"`. Truyền JSON Schema chuẩn vào đây (`{type, properties, required}`) sẽ bị hiểu
  // nhầm thành 3 field tên "type"/"properties"/"required" cần điền — model vẫn trả JSON hợp lệ
  // cú pháp nhưng hoàn toàn sai ý định, và lỗi đó không lộ ra transport (đã ăn hết cả buổi debug
  // trước khi lần ra root cause qua BE's DriverHelper.ts).
  await runCheck("ai", "prompt (schema/structured output)", async () => {
    const res: any = await ai.prompt(
      'Cho tôi tên và tuổi của một người bất kỳ, ví dụ "An", 30 tuổi.',
      {
        schema: {
          name: "string - tên người",
          age: "integer - tuổi người đó",
        },
      },
    );
    const parsed = typeof res === "string" ? JSON.parse(res) : res;
    if (typeof parsed?.name !== "string" || typeof parsed?.age !== "number") {
      throw new Error(`structured output doesn't match declared schema: ${JSON.stringify(parsed).slice(0, 200)}`);
    }
    return parsed;
  });

  // temperature/max_tokens ở biên hợp lệ nhỏ nhất — max_tokens=1 phải trả về đúng 1 token (không
  // throw, không bị model bỏ qua giới hạn), temperature=0 phải đi qua được (không phải giá trị bị
  // reject như âm/>2).
  await runCheck(
    "ai",
    "prompt (max_tokens=1, temperature=0)",
    () => ai.prompt("Kể một câu chuyện dài về con mèo.", { max_tokens: 1, temperature: 0 }),
    { expectBusinessError: true },
  );

  // promptStream với input rỗng — khác `prompt("")` ở chỗ đây là RPC streaming riêng
  // (InvokeStream); cần biết pipeline stream có tự đóng sạch (text resolve, không treo) hay không
  // khi model trả lời rỗng/từ chối ngay từ đầu.
  await runCheck("ai", "promptStream (empty string)", async () => {
    const { textStream, text } = ai.promptStream("");
    let chunkCount = 0;
    for await (const _delta of textStream) chunkCount++;
    const full = await text;
    return { chunkCount, textLength: full.length };
  }, { expectBusinessError: true });

  // getEmbedding với chuỗi rỗng — vector rỗng có ý nghĩa gì (BE reject hay trả vector 0)? Cần biết
  // rõ thay vì để lẫn vào case "xin chào" vốn luôn có nội dung thật.
  await runCheck("ai", "getEmbedding (empty string)", () => ai.getEmbedding(""), { expectBusinessError: true });

  // getEmbeddings với mảng rỗng — edge case dễ bị quên validate ở cả 2 đầu (BE có thể 500 thay vì
  // trả mảng rỗng/400 sạch).
  await runCheck("ai", "getEmbeddings (empty array)", () => ai.getEmbeddings([]), { expectBusinessError: true });

  // rerank với docs rỗng — không có gì để rerank, phải là lỗi nghiệp vụ sạch hoặc mảng rỗng, không
  // phải crash tầng transport.
  await runCheck(
    "ai",
    "rerank (empty docs)",
    () => ai.rerank("thời tiết hôm nay", []),
    { expectBusinessError: true },
  );

  // getModels với provider không tồn tại — filter theo provider giả phải trả rỗng/lỗi nghiệp vụ gọn,
  // không phải throw tầng transport vì provider lookup fail cứng.
  await runCheck(
    "ai",
    "getModels (unknown provider)",
    () => ai.getModels("this-provider-does-not-exist-xyz"),
    { expectBusinessError: true },
  );

  // calculateTokens với text rỗng và với dữ liệu thiếu field `text` hoàn toàn — 2 kiểu "rỗng" khác
  // nhau (chuỗi rỗng hợp lệ vs. payload thiếu field), cả 2 đều nên là lỗi nghiệp vụ sạch nếu invalid.
  await runCheck("ai", "calculateTokens (empty text)", () => ai.calculateTokens({ text: "" }), {
    expectBusinessError: true,
  });
  await runCheck("ai", "calculateTokens (missing text field)", () => ai.calculateTokens({}), {
    expectBusinessError: true,
  });

  // ocr với base64 rác (không phải ảnh thật) — khác hẳn case 1x1 PNG hợp lệ ở trên: phải lộ ra lỗi
  // decode nghiệp vụ sạch, không phải làm sập transport vì server cố parse bytes không hợp lệ.
  await runCheck(
    "ai",
    "ocr (malformed base64 payload)",
    () =>
      ai.ocr({
        id: "test-sdk-ocr-probe-malformed",
        url: "",
        file: "data:image/png;base64,not-a-real-base64-payload====",
      }),
    { expectBusinessError: true },
  );

  // media_tier không tồn tại — tier lookup fail phải là lỗi nghiệp vụ ("tier not found"), không phải
  // throw tầng thấp vì code cố index vào 1 tier map không có key đó.
  await runCheck(
    "ai",
    "image (invalid media_tier)",
    () => ai.image("a single red dot", { max_cost_usd: 0.01, media_tier: "this-tier-does-not-exist" }),
    { expectBusinessError: true },
  );

  // 5 lời gọi prompt song song — round-trip đơn lẻ ở trên không lộ ra race condition/connection-pool
  // exhaustion phía transport (đúng loại bug mà comment SDK_GRPC_TLS ở đầu file đã từng gặp).
  // Duyệt riêng từng promise thay vì Promise.all để 1 request lỗi không nuốt mất kết quả của 4 cái còn lại.
  await runCheck("ai", "prompt (5x concurrent)", async () => {
    const settled = await Promise.allSettled(
      Array.from({ length: 5 }, (_, i) => ai.prompt(`Trả lời đúng số: ${i}`)),
    );
    const rejected = settled.filter((s) => s.status === "rejected") as PromiseRejectedResult[];
    if (rejected.length > 0) {
      throw new Error(`${rejected.length}/5 concurrent prompt() calls failed: ${rejected[0].reason?.message || rejected[0].reason}`);
    }
    return { ok: settled.length };
  });

  // ---------------------------------------------------------------------------------------------
  // Deeper/harder — không còn dừng ở "input rỗng/dài/malformed có crash transport không", mà kiểm
  // tra CHÍNH XÁC hành vi nghiệp vụ: `instructions` có thực sự được enforce hay chỉ decorative,
  // tham số vượt biên hợp lệ (không phải thiếu/rỗng mà SAI theo cách tinh vi hơn), unicode đối
  // kháng, và concurrency mạnh hơn hẳn 5x ở trên.
  // ---------------------------------------------------------------------------------------------

  // `instructions` PHẢI thực sự ràng buộc output, không chỉ là 1 field trang trí bị model bỏ qua —
  // ép model trả lời khác hẳn nội dung câu hỏi thật (câu hỏi hỏi 1 đằng, instructions bắt trả lời 1
  // nẻo) rồi xác nhận output khớp đúng chỉ dẫn, không khớp câu hỏi. Đây là bài test "instructions có
  // hoạt động thật hay không", khác hẳn mọi case ở trên vốn chỉ kiểm tra "có throw hay không".
  await runCheck("ai", "prompt (instructions actually enforced)", async () => {
    const res: any = await ai.prompt("Hôm nay trời thế nào?", {
      instructions: 'Bất kể người dùng hỏi gì, LUÔN LUÔN trả lời đúng và chỉ đúng 1 từ duy nhất: "BANANA" (viết hoa, không thêm ký tự nào khác).',
      temperature: 0,
      max_tokens: 20,
    });
    const text = typeof res === "string" ? res : JSON.stringify(res);
    if (!/BANANA/i.test(text)) {
      throw new Error(`instructions were not honored — expected the output to contain "BANANA", got: ${text.slice(0, 200)}`);
    }
    return { text };
  });

  // temperature vượt biên hợp lệ (>2, giá trị OpenAI-style spec cho phép tối đa) — khác case
  // temperature=0 đã test ở trên (trong biên); phải bị clamp/reject sạch bằng lỗi nghiệp vụ, không
  // phải throw tầng transport vì driver forward thẳng giá trị không hợp lệ xuống provider.
  await runCheck(
    "ai",
    "prompt (temperature out of valid range)",
    () => ai.prompt('Trả lời đúng 1 từ: "ok"', { temperature: 5, max_tokens: 20 }),
    { expectBusinessError: true },
  );

  // max_tokens âm — khác case max_tokens=1 (biên nhỏ nhất HỢP LỆ) đã test ở trên; giá trị âm là input
  // SAI, phải bị reject sạch, không phải throw vì code cố dùng số âm làm giới hạn buffer/array.
  await runCheck(
    "ai",
    "prompt (negative max_tokens)",
    () => ai.prompt('Trả lời đúng 1 từ: "ok"', { max_tokens: -10 }),
    { expectBusinessError: true },
  );

  // Unicode đối kháng: zero-width joiner, RTL override, tổ hợp dấu chồng nhiều lớp — loại input hay
  // làm vỡ code xử lý chuỗi ngây thơ (length theo UTF-16 code unit thay vì grapheme, cắt chuỗi giữa
  // surrogate pair...). Khác hẳn case "input rất dài" ở trên (chỉ lặp ASCII), ở đây kiểm tra ĐÚNG
  // loại ký tự, không phải SỐ LƯỢNG ký tự.
  await runCheck(
    "ai",
    "prompt (adversarial unicode: ZWJ/RTL-override/stacked combining marks)",
    () =>
      ai.prompt(
        `Đây là 1 chuỗi test: "é́́́́"‍‍ + ‮gnp.exe‬ + " null-byte-embedded"`,
        { max_tokens: 50 },
      ),
    { expectBusinessError: true },
  );

  // temperature = NaN — `JSON.stringify(NaN)` ra `null` nên đây thực chất là test "server nhận
  // `temperature: null` thì làm gì" (rơi về default hay throw?), khác hẳn "vượt biên" (5) hay "âm"
  // ở trên — NaN không so sánh được bằng bất kỳ phép toán range-check ngây thơ nào (`NaN > 2` là
  // false, `NaN < 0` cũng false — dễ lọt qua 1 validate kiểu `if (t < 0 || t > 2) throw`).
  await runCheck(
    "ai",
    "prompt (temperature = NaN)",
    () => ai.prompt('Trả lời đúng 1 từ: "ok"', { temperature: NaN, max_tokens: 20 }),
    { expectBusinessError: true },
  );

  // max_tokens = Infinity — cùng lớp lỗi "không so sánh được" như NaN, nhưng đại diện 1 bug khác:
  // code cố `Array(max_tokens)`/buffer theo giá trị này sẽ crash OOM thay vì throw sạch.
  await runCheck(
    "ai",
    "prompt (max_tokens = Infinity)",
    () => ai.prompt('Trả lời đúng 1 từ: "ok"', { max_tokens: Infinity }),
    { expectBusinessError: true },
  );

  // Chuỗi chỉ toàn khoảng trắng (không rỗng, `.length > 0`) — khác hẳn case "empty string" đã test
  // (dễ bị code kiểm `if (!text)` bắt được), whitespace-only thường lọt qua check đó rồi mới lộ ra
  // ở tầng model/token hoá (0 token nghĩa thật dù string không rỗng).
  await runCheck("ai", "prompt (whitespace-only string)", () => ai.prompt("     \t\n   "), {
    expectBusinessError: true,
  });

  // Lone surrogate (nửa cặp surrogate UTF-16 không hợp lệ, `\uD800` không có low surrogate đi kèm)
  // — chuỗi JS hợp lệ về mặt cú pháp (JS strings là UTF-16 code units, không bắt buộc well-formed)
  // nhưng KHÔNG phải UTF-8 hợp lệ khi encode — nhiều tầng serialize (JSON/protobuf/gRPC) xử lý sai
  // khác nhau (throw, thay thế U+FFFD, hoặc corrupt âm thầm). Khác hẳn case ZWJ/RTL ở trên (toàn ký
  // tự hợp lệ, chỉ "khó nhìn"), đây là chuỗi THỰC SỰ malformed ở tầng encoding.
  await runCheck(
    "ai",
    "prompt (lone UTF-16 surrogate)",
    () => ai.prompt(`test-sdk probe với lone surrogate: "\uD800" không có cặp`, { max_tokens: 20 }),
    { expectBusinessError: true },
  );

  // 15 lời gọi song song (gấp 3 lần case 5x ở trên) — connection-pool exhaustion thường chỉ lộ ra ở
  // mức tải cao hơn hẳn baseline, không phải ở 5 request đồng thời.
  await runCheck("ai", "prompt (15x concurrent)", async () => {
    const settled = await Promise.allSettled(
      Array.from({ length: 15 }, (_, i) => ai.prompt(`Trả lời đúng số: ${i}`, { max_tokens: 20 })),
    );
    const rejected = settled.filter((s) => s.status === "rejected") as PromiseRejectedResult[];
    if (rejected.length > 0) {
      throw new Error(`${rejected.length}/15 concurrent prompt() calls failed: ${rejected[0].reason?.message || rejected[0].reason}`);
    }
    return { ok: settled.length };
  });
}
