import { file } from "@aivin-labs/sdk";
import { assertNoPrototypePollution, runCheck } from "../helpers/report";

/**
 * Đọc thẳng `FileShareSDK.ts`/`FileDTO.ts` phía BE thay vì đoán shape — `create` nhận
 * `{workspace_id, name?, content?, extension?}` (mọi field khác optional), `del` nhận file id thật.
 * Tạo 1 file test rồi xoá ngay trong cùng lần chạy (creator xoá được file của chính mình, không
 * cần quyền admin) — không để lại record rác.
 */
export async function testFile(workspaceId?: string): Promise<void> {
  await runCheck("file", "list", () => file.list({ limit: 3 }), { expectBusinessError: true });

  await runCheck("file", "search", () => file.search("test-sdk probe", { limit: 3 }), {
    expectBusinessError: true,
  });

  // search query rỗng — khác case query thật ở trên, phải là lỗi nghiệp vụ sạch hoặc trả rỗng có
  // kiểm soát, không phải throw vì search engine nhận query rỗng.
  await runCheck("file", "search (empty query)", () => file.search("", { limit: 3 }), {
    expectBusinessError: true,
  });

  // get với id không tồn tại — tách biệt khỏi case fileId thật bên dưới, phải là lỗi nghiệp vụ
  // "not found" sạch, không phải throw vì lookup miss.
  await runCheck("file", "get (nonexistent id)", () => file.get("test-sdk-nonexistent-file-id"), {
    expectBusinessError: true,
  });

  let fileId: string | undefined;

  await runCheck(
    "file",
    "create",
    async () => {
      const created = await file.create({
        workspace_id: workspaceId,
        name: `test-sdk-probe-${Date.now()}.txt`,
        content: "Auto-created by test-sdk to verify the round-trip, deleted again right after.",
        extension: "txt",
      });
      fileId = (created as any)?.id ?? (created as any)?._id;
      return created;
    },
    { expectBusinessError: true },
  );

  if (fileId) {
    await runCheck("file", "get", () => file.get(fileId as string), { expectBusinessError: true });
    await runCheck("file", "del", () => file.del(fileId as string));

    // del lần 2 trên đúng file vừa xoá — idempotency hay bị bỏ sót: nhiều BE throw 500 khi cố xoá
    // 1 document đã không còn tồn tại thay vì trả lỗi nghiệp vụ "not found"/no-op sạch.
    await runCheck("file", "del (already deleted)", () => file.del(fileId as string), {
      expectBusinessError: true,
    });
  }

  // --- Deeper/harder: `create` nhận `Record<string, any>` HOÀN TOÀN tự do (không có type nào ràng
  // buộc field ngoài `workspace_id`/`name`/`content`/`extension`) — bề mặt injection/pollution rộng
  // nhất trong file này, khác hẳn mọi case ở trên vốn chỉ đổi `content`/`query` là string đơn giản.

  // Filename dạng path traversal (`../../../etc/passwd`) — nếu tầng lưu trữ dùng thẳng `name` làm
  // 1 phần đường dẫn vật lý mà không sanitize, đây là lỗ hổng ghi đè file ngoài ý muốn. Chỉ kiểm tra
  // round-trip không crash + dọn sạch bằng chính id trả về (không phụ thuộc đoán đúng path thật).
  let traversalFileId: string | undefined;
  await runCheck(
    "file",
    "create (path traversal filename)",
    async () => {
      const created: any = await file.create({
        workspace_id: workspaceId,
        name: "../../../../etc/test-sdk-probe-traversal.txt",
        content: "path traversal probe — should be sanitized/rejected, never escape the intended storage root",
        extension: "txt",
      });
      traversalFileId = created?.id ?? created?._id;
      return created;
    },
    { expectBusinessError: true },
  );
  if (traversalFileId) {
    await runCheck("file", "del (path traversal probe cleanup)", () => file.del(traversalFileId as string));
  }

  // Prototype pollution qua field tự do (`create` không giới hạn field nào ngoài 4 field tài liệu) —
  // assert Object.prototype của CHÍNH process KHÔNG bị đầu độc sau round-trip.
  let protoFileId: string | undefined;
  await runCheck(
    "file",
    "create (prototype pollution attempt)",
    async () => {
      const created: any = await file.create(
        JSON.parse(
          `{"workspace_id":${JSON.stringify(workspaceId ?? null)},"name":"proto-probe.txt","content":"proto probe","extension":"txt","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}}`,
        ),
      );
      protoFileId = created?.id ?? created?._id;
      assertNoPrototypePollution("file.create()");
      return created;
    },
    { expectBusinessError: true },
  );
  if (protoFileId) {
    await runCheck("file", "del (prototype pollution probe cleanup)", () => file.del(protoFileId as string));
  }
}
