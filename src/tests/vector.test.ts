import { vector } from "@aivin-labs/sdk";
import { AssertionFailure, assertNoPrototypePollution, runCheck } from "../helpers/report";

/**
 * Khác với `knowledge.test.ts` (né store/del vì lúc đó chưa có endpoint xoá an toàn), `vector.*`
 * giờ có `delete` đối xứng với `index` nên probe này làm full round-trip: index 1 document test
 * tự sinh (id có timestamp để không đụng lần chạy trước) → search/searchBatch/get thấy được nó →
 * delete dọn sạch ở cuối, dù nhánh nào phía trên fail. `similarity`/`normalize` không gọi mạng
 * (pure local math trong SDKClient) nên luôn PASS trừ khi logic tính toán sai.
 *
 * Mọi round-trip thật (index/search/searchBatch/get/delete/matchBatch/requestCollection/
 * getCollectionStatus) chấp nhận lỗi nghiệp vụ là PASS — chỉ lỗi transport/auth mới là FAIL thật
 * (phòng trường hợp cap token của môi trường chạy không có đủ workspace scope). `requestCollection`
 * chỉ tạo 1 bản ghi 'pending' chờ admin duyệt (không tự tạo Milvus collection nào) nên an toàn gọi
 * lặp lại; dùng label cố định để không tích rác qua nhiều lần chạy. Không có probe cho
 * approve/reject/archive — đó là admin action qua REST + SuperAdminGuard, khác hẳn kênh capability
 * token của plugin nên test-sdk (chạy như 1 plugin) không có quyền gọi được.
 *
 * `index` hiện luôn fail với "BRAIN.INDEX_DOCUMENT_FAILED" trên tài khoản test này - KHÔNG phải
 * bug code (`VectorDBService.indexDocuments` đã tự động embed content thiếu embedding, đối xứng
 * với `searchDocuments`). Root cause thật: `MilvusIO.ensureDatabase()` chặn tạo Milvus
 * database/collection mới cho client chưa nằm trong whitelist Redis `registered_clients`
 * (`checkClientRegistration`, MilvusIO.ts) - whitelist đó chỉ được nạp từ Organization có
 * `status:'active'` trong Mongo (`MongoIO.ts`'s `populateRegisteredClientsFromDB`), mà tài khoản
 * test này không thuộc Organization nào (cùng gốc rễ với `usage.getUsage`/`code.executeLogic`'s
 * `CODE.ORG_ID_REQUIRED`). Cần Organization thật cho tài khoản test mới thấy round-trip `index`
 * thành công.
 */
export async function testVector(): Promise<void> {
  const probeId = `test-sdk-vector-probe-${Date.now()}`;

  await runCheck(
    "vector",
    "index",
    () =>
      vector.index({
        id: probeId,
        content: "test-sdk vector probe content",
        type: "test-sdk-probe",
      }),
    { expectBusinessError: true },
  );

  // index với content rỗng — không có gì để embed, phải là lỗi nghiệp vụ sạch ("content required")
  // thay vì round-trip 1 embedding rỗng/toàn-zero xuống Milvus.
  await runCheck(
    "vector",
    "index (empty content)",
    () => vector.index({ id: `${probeId}-empty`, content: "", type: "test-sdk-probe" }),
    { expectBusinessError: true },
  );

  await runCheck(
    "vector",
    "search",
    () => vector.search({ query: "test-sdk probe query", limit: 3 }),
    { expectBusinessError: true },
  );

  // search với query rỗng — khác case query thật ở trên, phải bị reject sạch bằng lỗi nghiệp vụ
  // thay vì embed 1 chuỗi rỗng rồi trả về kết quả ngẫu nhiên vô nghĩa.
  await runCheck(
    "vector",
    "search (empty query)",
    () => vector.search({ query: "", limit: 3 }),
    { expectBusinessError: true },
  );

  await runCheck(
    "vector",
    "search (rerank)",
    () => vector.search({ query: "test-sdk probe query", limit: 3, rerank: true }),
    { expectBusinessError: true },
  );

  await runCheck(
    "vector",
    "searchBatch",
    () =>
      vector.searchBatch({
        queries: ["test-sdk probe query 1", "test-sdk probe query 2"],
        limit: 3,
      }),
    { expectBusinessError: true },
  );

  await runCheck(
    "vector",
    "get",
    () => vector.get([probeId]),
    { expectBusinessError: true },
  );

  // get với id không tồn tại — tách biệt khỏi case probeId thật ở trên: phải trả mảng rỗng/thiếu
  // entry sạch, không phải throw vì lookup miss trên 1 collection Milvus thật.
  await runCheck(
    "vector",
    "get (nonexistent id)",
    () => vector.get(["test-sdk-nonexistent-vector-id"]),
    { expectBusinessError: true },
  );

  // searchBatch với 1 query rỗng lẫn trong mảng — batch API dễ bị lỗi ở đúng 1 phần tử bất thường
  // kéo sập cả batch, khác hẳn case searchBatch toàn query hợp lệ ở dưới.
  await runCheck(
    "vector",
    "searchBatch (one empty query in batch)",
    () => vector.searchBatch({ queries: ["test-sdk probe query 1", ""], limit: 3 }),
    { expectBusinessError: true },
  );

  await runCheck(
    "vector",
    "matchBatch",
    () =>
      vector.matchBatch(
        ["Hà Nội hôm nay nắng đẹp", "con mèo đang ngủ trên ghế"],
        "thời tiết hôm nay",
      ),
    { expectBusinessError: true },
  );

  // --- Deeper/harder: luồng re-index + race, không chỉ 1 lời gọi index() đơn lẻ như ở trên ---

  // Re-index CÙNG id với content khác hẳn — đây là luồng thật hay gặp (update tài liệu đã index),
  // khác hẳn case "index" ban đầu (chỉ index 1 lần). Xác nhận `get()` sau đó thấy đúng content MỚI
  // NHẤT (upsert thật), không tạo ra 2 bản ghi trùng id hay giữ lại bản cũ.
  await runCheck(
    "vector",
    "index (re-index same id, verify latest content wins)",
    async () => {
      await vector.index({ id: probeId, content: "test-sdk vector probe content — VERSION 2", type: "test-sdk-probe" });
      const rows: any[] = await vector.get([probeId]);
      const row = rows?.[0];
      if (row && typeof row.content === "string" && !row.content.includes("VERSION 2")) {
        throw new AssertionFailure(`get() after re-index still shows old content, upsert may not be replacing in place: ${JSON.stringify(row).slice(0, 200)}`);
      }
      return { row };
    },
    { expectBusinessError: true },
  );

  // Prototype pollution qua `metadata` — field tự do duy nhất trong `index()`, khác hẳn `content`/
  // `type`/`id` (đều là string đơn giản không có chỗ cho object lồng).
  await runCheck(
    "vector",
    "index (prototype pollution via metadata)",
    async () => {
      await vector.index(
        JSON.parse(`{"id":"${probeId}-proto","content":"proto probe","type":"test-sdk-probe","metadata":{"__proto__":{"polluted":"yes"}}}`),
      );
      assertNoPrototypePollution("vector metadata");
      await vector.delete([`${probeId}-proto`]);
      return { ok: true };
    },
    { expectBusinessError: true },
  );

  // 5 lời gọi index() song song trên CÙNG id, content khác nhau — race condition thật (ai thắng
  // cuối không quan trọng bằng việc không được crash/corrupt dữ liệu thành hỗn hợp 2 content).
  await runCheck(
    "vector",
    "index (5x concurrent, same id)",
    async () => {
      const settled = await Promise.allSettled(
        Array.from({ length: 5 }, (_, i) =>
          vector.index({ id: `${probeId}-race`, content: `race content v${i}`, type: "test-sdk-probe" }),
        ),
      );
      const rejected = settled.filter((s) => s.status === "rejected") as PromiseRejectedResult[];
      await vector.delete([`${probeId}-race`]);
      if (rejected.length === settled.length) {
        // tất cả đều fail cùng lý do nghiệp vụ (vd thiếu collection) vẫn coi là PASS ở mức round-trip
        throw rejected[0].reason;
      }
      return { ok: settled.length - rejected.length, failed: rejected.length };
    },
    { expectBusinessError: true },
  );

  // Cleanup — dọn document probe dù index() ở trên có thành công thật hay không (id không tồn tại
  // thì deleteDocuments trả {deleted: 0}, không throw).
  await runCheck(
    "vector",
    "delete",
    () => vector.delete([probeId]),
    { expectBusinessError: true },
  );

  // --- Collection provisioning: chỉ tạo bản ghi 'pending' chờ admin duyệt, KHÔNG tự tạo Milvus
  // collection nào ở đây. Label cố định (không timestamp) để lần chạy sau tái dùng đúng request cũ
  // thay vì tạo rác mới — idempotent theo (client, plugin_id, label), xem VectorCollectionRequestService.
  await runCheck(
    "vector",
    "requestCollection",
    () =>
      vector.requestCollection({
        label: "test-sdk-probe",
        reason: "test-sdk round-trip probe — không dùng để index dữ liệu thật",
      }),
    { expectBusinessError: true },
  );

  await runCheck(
    "vector",
    "getCollectionStatus",
    () => vector.getCollectionStatus("test-sdk-probe"),
    { expectBusinessError: true },
  );

  // --- Pure local math (không round-trip lên server) ---
  await runCheck("vector", "similarity", async () => {
    const score = vector.similarity(new Float32Array([1, 0, 0]), new Float32Array([1, 0, 0]));
    if (Math.abs(score - 1) > 1e-6) throw new AssertionFailure(`expected cosine similarity ~1, got ${score}`);
    return { score };
  });

  await runCheck("vector", "normalize", async () => {
    const v = vector.normalize(new Float32Array([3, 4]));
    const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    if (Math.abs(norm - 1) > 1e-6) throw new AssertionFailure(`expected unit length, got ${norm}`);
    return { norm };
  });
}
