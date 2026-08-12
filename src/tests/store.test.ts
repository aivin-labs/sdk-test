import { store } from "@aivin-labs/sdk";
import { AssertionFailure, assertNoPrototypePollution, runCheck, skip } from "../helpers/report";

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

  // `get` phía dưới giả định `set` này đã ghi thật key `key` - nhưng ở môi trường thiếu
  // project_id (xem comment đầu file), `set` tự nó throw lỗi nghiệp vụ nên KHÔNG ghi gì cả. Theo
  // dõi kết quả thật của `set` để `get` không assert nhầm "phải khác null" trên 1 key chưa từng
  // tồn tại - đó không phải bug của `get`, chỉ là hệ quả hợp lệ của `set` đã fail trước đó.
  let setSucceeded = false;
  await runCheck(
    "store",
    "set",
    async () => {
      const res = await store.set(table, key, { hello: "world", n: 42 });
      setSucceeded = true;
      return res;
    },
    { expectBusinessError: true },
  );

  if (setSucceeded) {
    await runCheck("store", "get", async () => {
      const row = await store.get(table, key);
      if (!row) throw new AssertionFailure(`get returned null for the key just set (${key})`);
      return row;
    });
  } else {
    skip("store", "get", "store.set above failed with a business error (missing project_id in this test account's context), so there's no key to verify get() against");
  }

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
      if (!res.deleted) throw new AssertionFailure(`del didn't remove the key just created (${key})`);
      return res;
    },
    { expectBusinessError: true },
  );

  // get trên key vừa xoá ở trên — khác hẳn case "get" phía trên (key vừa set, chắc chắn tồn tại):
  // đây phải trả về null/rỗng sạch, không phải throw vì lookup miss. Đúng ngữ nghĩa "not found" của
  // key-value store, không phải lỗi.
  await runCheck(
    "store",
    "get (deleted/nonexistent key)",
    async () => {
      const row = await store.get(table, key);
      if (row) throw new AssertionFailure(`get returned a row for a key that was just deleted (${key})`);
      return { row };
    },
    { expectBusinessError: true },
  );

  // del trên key không tồn tại (chưa từng set) — phải là no-op sạch ({deleted:false}), không phải
  // throw vì code cố xoá 1 document không có ở DB.
  await runCheck(
    "store",
    "del (nonexistent key)",
    async () => {
      const res = await store.del(table, `nonexistent-${Date.now()}`);
      if (res.deleted) throw new AssertionFailure(`del reported deleted:true for a key that was never set`);
      return res;
    },
    { expectBusinessError: true },
  );

  // set 2 lần liên tiếp trên CÙNG key (overwrite) — khác case "set" đơn ở trên (chỉ set 1 lần);
  // xác nhận set là upsert thật (không throw "duplicate key") và get sau đó thấy đúng giá trị mới nhất.
  const overwriteKey = `probe-overwrite-${Date.now()}`;
  await runCheck(
    "store",
    "set (overwrite same key)",
    async () => {
      await store.set(table, overwriteKey, { version: 1 });
      await store.set(table, overwriteKey, { version: 2 });
      const row: any = await store.get(table, overwriteKey);
      if (row?.version !== 2) {
        throw new AssertionFailure(`expected the second set() to win (version:2), got ${JSON.stringify(row)}`);
      }
      await store.del(table, overwriteKey);
      return row;
    },
    { expectBusinessError: true },
  );

  // key chứa ký tự đặc biệt (khoảng trắng, "/", unicode) — nhiều store dùng key làm 1 phần của
  // path/URL nội bộ, dễ vỡ nếu không encode đúng. Dọn ngay trong cùng check để không để lại rác.
  const weirdKey = `probe/weird key with spaces/tiếng việt/${Date.now()}`;
  await runCheck(
    "store",
    "set+get (key with special characters)",
    async () => {
      await store.set(table, weirdKey, { ok: true });
      const row = await store.get(table, weirdKey);
      await store.del(table, weirdKey);
      if (!row) throw new AssertionFailure(`get returned null right after set() for a key with special characters (${weirdKey})`);
      return row;
    },
    { expectBusinessError: true },
  );

  // query với filter không khớp record nào — phải trả mảng rỗng sạch, không phải throw vì "0 kết
  // quả" bị code coi nhầm là lỗi.
  await runCheck(
    "store",
    "query (filter matches nothing)",
    () => store.query(table, { key: "this-key-does-not-exist-anywhere" }, undefined, 10),
    { expectBusinessError: true },
  );

  // --- Deeper/harder ---

  // Prototype pollution qua `__proto__` trong value — assert Object.prototype của CHÍNH process
  // test-sdk KHÔNG bị đầu độc sau round-trip set/get, không chỉ kiểm tra "có throw hay không" như
  // mọi case khác trong file này.
  const pollutionKey = `probe-proto-${Date.now()}`;
  await runCheck(
    "store",
    "set+get (prototype pollution attempt)",
    async () => {
      await store.set(table, pollutionKey, JSON.parse('{"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}}'));
      const row = await store.get(table, pollutionKey);
      await store.del(table, pollutionKey);
      assertNoPrototypePollution("this value");
      return row;
    },
    { expectBusinessError: true },
  );

  // value chứa circular reference — không thể JSON.stringify được (RangeError/TypeError ở tầng
  // serialize) — phải là lỗi client-side sạch (ném ra trước khi gửi request) hoặc lỗi nghiệp vụ, chứ
  // KHÔNG được hang/treo request vô thời hạn. Bọc try/catch riêng vì lỗi này hợp lệ xảy ra ở
  // NGOÀI phạm vi runCheck's promise catch nếu SDK serialize đồng bộ trước khi tạo Promise — ép nó
  // luôn nằm trong 1 async function để runCheck bắt được dù throw đồng bộ hay bất đối xứng.
  await runCheck(
    "store",
    "set (circular reference value)",
    async () => {
      const circular: any = { a: 1 };
      circular.self = circular;
      return store.set(table, `probe-circular-${Date.now()}`, circular);
    },
    { expectBusinessError: true },
  );
}
