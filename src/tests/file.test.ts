import { file } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

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
  }
}
