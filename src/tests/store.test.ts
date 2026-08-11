import { store } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/**
 * `store` scope theo workspace+project+tenant (StoreSDK.resolveScope) — cần cả workspace_id VÀ
 * project_id thật trong context, không chỉ client. mintCap() tự fetch cả 2 từ workspace đầu tiên
 * của tài khoản (`GET /workspace/list`) khi không truyền tay - nhưng chỉ khi workspace đó THẬT SỰ
 * có ít nhất 1 project (`workspace.projects[0]`). Tài khoản test hiện tại có workspace nhưng
 * `projects: []` (chưa tạo project nào qua UI), nên `project_id` vẫn `undefined` dù mintCap chạy
 * đúng - BE trả lỗi nghiệp vụ hợp lệ "Missing ... projectId ..." chứ không phải lỗi SDK. Theo
 * đúng convention của workspace.test.ts/task.test.ts/project.test.ts: chấp nhận lỗi nghiệp vụ khi
 * thiếu resource tiên quyết mà test-sdk không có quyền tự tạo (tạo project mới sẽ hiện thật trong
 * UI tenant, không có cách dọn sạch an toàn).
 */
export async function testStore(): Promise<void> {
  const table = "test_sdk_probe";
  const key = `probe-${Date.now()}`;

  await runCheck(
    "store",
    "set",
    () => store.set(table, key, { hello: "world", n: 42 }),
    { expectBusinessError: true },
  );

  await runCheck(
    "store",
    "get",
    async () => {
      const row = await store.get(table, key);
      if (!row) throw new Error(`get returned null for the key just set (${key})`);
      return row;
    },
    { expectBusinessError: true },
  );

  await runCheck(
    "store",
    "query",
    () => store.query(table, { key }, undefined, 10),
    { expectBusinessError: true },
  );

  await runCheck("store", "count", () => store.count(table, { key }), { expectBusinessError: true });

  await runCheck(
    "store",
    "search",
    () => store.search(table, "hello", { mode: "keyword", limit: 5 }),
    { expectBusinessError: true },
  );

  await runCheck(
    "store",
    "del",
    async () => {
      const res = await store.del(table, key);
      if (!res.deleted) throw new Error(`del didn't remove the key just created (${key})`);
      return res;
    },
    { expectBusinessError: true },
  );
}
