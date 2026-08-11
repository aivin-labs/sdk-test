import { task } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/**
 * `create` cần `workspace_id` thật — không có thì chấp nhận lỗi nghiệp vụ. Nếu tạo thành công,
 * dọn sạch bằng `delete` ngay trong cùng lần chạy (không để lại task rác hiển thị trong UI của
 * tenant). `update`/`getById`/`addComment`/`requestSupport` cần task thật đang tồn tại lâu dài
 * hơn 1 lần chạy nên không test riêng — round-trip create+delete đã đủ chứng minh namespace hoạt
 * động đúng.
 */
export async function testTask(workspaceId?: string): Promise<void> {
  let createdTaskId: string | undefined;

  await runCheck(
    "task",
    "create",
    async () => {
      const created = await task.create({
        title: `test-sdk probe ${Date.now()}`,
        content: "Auto-created by test-sdk to verify the round-trip, deleted again right after.",
        workspace_id: workspaceId as string,
      });
      createdTaskId = (created as any)?.id;
      return created;
    },
    { expectBusinessError: true },
  );

  await runCheck("task", "listMine", () => task.listMine({ limit: 3 }), { expectBusinessError: true });

  if (createdTaskId) {
    await runCheck("task", "delete", () => task.delete(createdTaskId as string));
  }
}
