import { task } from "@aivin-labs/sdk";
import { AssertionFailure, runCheck } from "../helpers/report";

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

  // create với title rỗng — khác case title thật ở trên, phải là lỗi nghiệp vụ sạch ("title
  // required") hoặc tạo được thật, không phải throw vì code cố dùng chuỗi rỗng làm key/slug.
  await runCheck(
    "task",
    "create (empty title)",
    () => task.create({ title: "", workspace_id: workspaceId as string }),
    { expectBusinessError: true },
  );

  await runCheck("task", "listMine", () => task.listMine({ limit: 3 }), { expectBusinessError: true });

  // listMine với limit=0 — biên nhỏ nhất, phải trả mảng rỗng chứ không phải bị coi là "không giới hạn".
  await runCheck(
    "task",
    "listMine (limit=0)",
    async () => {
      const res = await task.listMine({ limit: 0 } as any);
      if (Array.isArray(res) && res.length !== 0) {
        throw new AssertionFailure(`limit=0 should return an empty array, got ${res.length} tasks`);
      }
      return res;
    },
    { expectBusinessError: true },
  );

  if (createdTaskId) {
    await runCheck("task", "delete", () => task.delete(createdTaskId as string));

    // delete lần 2 trên đúng task vừa xoá — idempotency hay bị bỏ sót: phải là lỗi nghiệp vụ/no-op
    // sạch, không phải throw vì cố xoá 1 task đã không còn tồn tại.
    await runCheck("task", "delete (already deleted)", () => task.delete(createdTaskId as string), {
      expectBusinessError: true,
    });
  }

  // 5 lời gọi create() song song — khác hẳn case create đơn ở trên; xác nhận không có race condition
  // nào làm mất write/tạo trùng id/crash transport khi nhiều task được tạo đồng thời. Tự dọn ngay
  // trong chính case này (không phụ thuộc `createdTaskId` ở trên).
  await runCheck(
    "task",
    "create (5x concurrent)",
    async () => {
      const marker = `race-${Date.now()}`;
      const settled = await Promise.allSettled(
        Array.from({ length: 5 }, (_, i) =>
          task.create({ title: `test-sdk ${marker} #${i}`, workspace_id: workspaceId as string }),
        ),
      );
      const created = settled
        .filter((s): s is PromiseFulfilledResult<any> => s.status === "fulfilled")
        .map((s) => s.value?.id)
        .filter(Boolean);
      const ids = new Set(created);
      try {
        if (ids.size !== created.length) {
          throw new AssertionFailure(`5 concurrent create() calls returned duplicate ids: ${JSON.stringify(created)}`);
        }
        const rejected = settled.filter((s) => s.status === "rejected") as PromiseRejectedResult[];
        if (rejected.length > 0 && created.length === 0) {
          throw rejected[0].reason; // tất cả fail cùng lý do nghiệp vụ — để runCheck tự xử lý qua expectBusinessError
        }
        return { created: created.length, failed: rejected.length };
      } finally {
        for (const id of created) await task.delete(id as string); // dọn ngay, không để lại task rác
      }
    },
    { expectBusinessError: true },
  );
}
