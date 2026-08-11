import { redis } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/**
 * `redis` là Redis riêng theo plugin+tenant do host cấp (không phải kết nối Redis trực tiếp) —
 * cũng không cần workspace/session, chỉ cần cap+client hợp lệ. Tự set/incr/del 1 key test.
 */
export async function testRedis(): Promise<void> {
  const key = `test-sdk:probe:${Date.now()}`;

  await runCheck("redis", "set", () => redis.set(key, "1"));

  await runCheck("redis", "get", async () => {
    const v = await redis.get(key);
    if (v !== "1") throw new Error(`get returned "${v}", expected "1"`);
    return v;
  });

  await runCheck("redis", "incr", async () => {
    const v = await redis.incr(key);
    if (v !== 2) throw new Error(`incr returned ${v}, expected 2`);
    return v;
  });

  await runCheck("redis", "exists", async () => {
    const v = await redis.exists(key);
    if (v !== 1) throw new Error(`exists returned ${v}, expected 1`);
    return v;
  });

  await runCheck("redis", "del", async () => {
    const v = await redis.del(key);
    if (v !== 1) throw new Error(`del returned ${v}, expected 1 (exactly one key deleted)`);
    return v;
  });
}
