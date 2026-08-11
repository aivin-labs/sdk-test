import { vector } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

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

  await runCheck(
    "vector",
    "search",
    () => vector.search({ query: "test-sdk probe query", limit: 3 }),
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
    if (Math.abs(score - 1) > 1e-6) throw new Error(`expected cosine similarity ~1, got ${score}`);
    return { score };
  });

  await runCheck("vector", "normalize", async () => {
    const v = vector.normalize(new Float32Array([3, 4]));
    const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    if (Math.abs(norm - 1) > 1e-6) throw new Error(`expected unit length, got ${norm}`);
    return { norm };
  });
}
