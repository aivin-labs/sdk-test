import { redis } from "@aivin-labs/sdk";
import { AssertionFailure, assertNoPrototypePollution, runCheck } from "../helpers/report";

/**
 * `redis` là Redis riêng theo plugin+tenant do host cấp (không phải kết nối Redis trực tiếp) —
 * cũng không cần workspace/session, chỉ cần cap+client hợp lệ. Tự set/incr/del 1 key test.
 */
export async function testRedis(): Promise<void> {
  const key = `test-sdk:probe:${Date.now()}`;

  await runCheck("redis", "set", () => redis.set(key, "1"));

  await runCheck("redis", "get", async () => {
    const v = await redis.get(key);
    if (v !== "1") throw new AssertionFailure(`get returned "${v}", expected "1"`);
    return v;
  });

  await runCheck("redis", "incr", async () => {
    const v = await redis.incr(key);
    if (v !== 2) throw new AssertionFailure(`incr returned ${v}, expected 2`);
    return v;
  });

  await runCheck("redis", "exists", async () => {
    const v = await redis.exists(key);
    if (v !== 1) throw new AssertionFailure(`exists returned ${v}, expected 1`);
    return v;
  });

  await runCheck("redis", "del", async () => {
    const v = await redis.del(key);
    if (v !== 1) throw new AssertionFailure(`del returned ${v}, expected 1 (exactly one key deleted)`);
    return v;
  });

  // get trên key vừa xoá ở trên — khác case "get" phía trên (key chắc chắn tồn tại), phải trả
  // null/undefined sạch, không phải throw vì lookup miss.
  await runCheck("redis", "get (deleted/nonexistent key)", async () => {
    const v = await redis.get(key);
    if (v !== null && v !== undefined) throw new AssertionFailure(`get returned "${v}" for a key that was just deleted`);
    return { v };
  });

  // del trên key không tồn tại (chưa từng set) — KHÔNG mong đợi 0. Đọc kỹ `SDKClient.ts:1380-1384`
  // (comment tự tài liệu hoá): BE's `redisDel` chỉ trả `{success:true}` bất kể key có tồn tại hay
  // không, nên client giả lập số trả về bằng `keys.length` (số key ĐƯỢC YÊU CẦU xoá), không phải số
  // key THỰC SỰ bị xoá như ioredis thật — quyết định có chủ đích, không phải bug. Case này xác nhận
  // đúng hợp đồng đó (khác `exists` bên dưới — method đó phản ánh trạng thái thật từ BE).
  await runCheck("redis", "del (nonexistent key)", async () => {
    const v = await redis.del(`test-sdk:probe:nonexistent:${Date.now()}`);
    if (v !== 1) throw new AssertionFailure(`del returned ${v}, expected 1 (SDK echoes back keys.length, not the real deleted count — see SDKClient.ts:1380-1384)`);
    return v;
  });

  // exists trên key không tồn tại — phải trả 0 sạch.
  await runCheck("redis", "exists (nonexistent key)", async () => {
    const v = await redis.exists(`test-sdk:probe:nonexistent:${Date.now()}`);
    if (v !== 0) throw new AssertionFailure(`exists returned ${v}, expected 0 for a key that was never set`);
    return v;
  });

  // incr trên 1 key đang giữ giá trị KHÔNG phải số — Redis thật throw "value is not an integer" ở
  // đây; đúng hành vi nghiệp vụ hợp lệ (không phải lỗi transport), khác hẳn case incr thành công ở
  // trên (key đang giữ "1"/"2", toàn số).
  const nonNumericKey = `test-sdk:probe:non-numeric:${Date.now()}`;
  await runCheck(
    "redis",
    "incr (non-numeric value)",
    async () => {
      await redis.set(nonNumericKey, "not-a-number");
      try {
        return await redis.incr(nonNumericKey);
      } finally {
        await redis.del(nonNumericKey);
      }
    },
    { expectBusinessError: true },
  );

  // --- Deeper/harder: biên số học thật (không phải chỉ "sai kiểu dữ liệu" như case trên) ---

  // incr sát trần Number.MAX_SAFE_INTEGER — Redis INCR dùng số nguyên 64-bit thật (vượt xa giới hạn
  // an toàn của JS number, 2^53-1), trong khi gRPC/JSON transport phía JS có thể làm tròn/mất chính
  // xác ở numbers lớn. Set giá trị sát biên rồi incr 1 lần, xác nhận kết quả CHÍNH XÁC +1, không bị
  // làm tròn/overflow âm.
  const overflowKey = `test-sdk:probe:overflow:${Date.now()}`;
  await runCheck(
    "redis",
    "incr (near Number.MAX_SAFE_INTEGER)",
    async () => {
      const nearMax = Number.MAX_SAFE_INTEGER - 2; // 9007199254740989
      await redis.set(overflowKey, String(nearMax));
      try {
        const v = await redis.incr(overflowKey);
        if (v !== nearMax + 1) {
          throw new AssertionFailure(`incr near MAX_SAFE_INTEGER returned ${v}, expected exactly ${nearMax + 1} — possible precision loss over the wire`);
        }
        return v;
      } finally {
        await redis.del(overflowKey);
      }
    },
    { expectBusinessError: true },
  );

  // setex với seconds=0 — biên vô lý cố tình (TTL 0 giây nghĩa là gì? hết hạn ngay lập tức hay
  // "không hết hạn"?). Phải là lỗi nghiệp vụ sạch hoặc hành vi có kiểm soát, không phải throw kiểu
  // transport vì Redis EX 0 vốn bị chính Redis reject ("invalid expire time").
  const setexZeroKey = `test-sdk:probe:setex-zero:${Date.now()}`;
  await runCheck(
    "redis",
    "setex (seconds=0)",
    async () => {
      try {
        return await redis.setex(setexZeroKey, 0, "value");
      } finally {
        await redis.del(setexZeroKey);
      }
    },
    { expectBusinessError: true },
  );

  // setex với seconds âm — cùng lý do, input SAI cố tình khác hẳn "0 mập mờ" ở trên; Redis thật
  // reject rõ ràng "invalid expire time in 'setex' command".
  const setexNegKey = `test-sdk:probe:setex-neg:${Date.now()}`;
  await runCheck(
    "redis",
    "setex (negative seconds)",
    async () => {
      try {
        return await redis.setex(setexNegKey, -10, "value");
      } finally {
        await redis.del(setexNegKey);
      }
    },
    { expectBusinessError: true },
  );

  // --- Oái oăm hơn: NaN/Infinity làm increment, và toàn bộ nhóm hash (`hset`/`hget`/`hgetall`/
  // `hdel`) + `keys` CHƯA TỪNG được test trong file này (`incrby`/`decrby` cũng vậy) — không phải
  // "input khó" mà là GAP COVERAGE thật, 6 method public của SDK chưa từng round-trip lần nào. ---

  // incrby với NaN — `JSON.stringify(NaN)` tự nó đã ra `null` (NaN không có biểu diễn JSON hợp lệ),
  // nên đây thực chất là test "server nhận `amount: null` thì làm gì", khác hẳn incr thường (luôn
  // +1 cố định, không nhận amount tuỳ ý).
  const incrbyNanKey = `test-sdk:probe:incrby-nan:${Date.now()}`;
  await runCheck(
    "redis",
    "incrby (NaN increment)",
    async () => {
      try {
        return await redis.incrby(incrbyNanKey, NaN);
      } finally {
        await redis.del(incrbyNanKey);
      }
    },
    { expectBusinessError: true },
  );

  // incrby với Infinity — cùng lý do `JSON.stringify(Infinity)` ra `null`, nhưng test riêng vì đại
  // diện 1 lớp lỗi lập trình khác (chia cho 0, overflow tính toán) hay gặp hơn NaN trong thực tế.
  const incrbyInfKey = `test-sdk:probe:incrby-inf:${Date.now()}`;
  await runCheck(
    "redis",
    "incrby (Infinity increment)",
    async () => {
      try {
        return await redis.incrby(incrbyInfKey, Infinity);
      } finally {
        await redis.del(incrbyInfKey);
      }
    },
    { expectBusinessError: true },
  );

  // decrby với 1 số thập phân (không phải số nguyên) — Redis INCRBY/DECRBY chỉ nhận số NGUYÊN 64-bit,
  // 3.5 phải bị Redis thật reject ("value is not an integer"), khác hẳn incr/decr nguyên ở trên.
  const decrbyFloatKey = `test-sdk:probe:decrby-float:${Date.now()}`;
  await runCheck(
    "redis",
    "decrby (non-integer float)",
    async () => {
      await redis.set(decrbyFloatKey, "10");
      try {
        return await redis.decrby(decrbyFloatKey, 3.5);
      } finally {
        await redis.del(decrbyFloatKey);
      }
    },
    { expectBusinessError: true },
  );

  // --- Hash operations (hset/hget/hgetall/hdel) — full round-trip, hoàn toàn chưa test trước đây ---
  const hashKey = `test-sdk:probe:hash:${Date.now()}`;
  await runCheck("redis", "hset", () => redis.hset(hashKey, "field1", "value1"));

  await runCheck("redis", "hget", async () => {
    const v = await redis.hget(hashKey, "field1");
    if (v !== "value1") throw new AssertionFailure(`hget returned "${v}", expected "value1"`);
    return v;
  });

  await runCheck("redis", "hset (second field)", () => redis.hset(hashKey, "field2", "value2"));

  await runCheck("redis", "hgetall", async () => {
    const all = await redis.hgetall(hashKey);
    if (all?.field1 !== "value1" || all?.field2 !== "value2") {
      throw new AssertionFailure(`hgetall returned unexpected shape: ${JSON.stringify(all)}`);
    }
    return all;
  });

  // hget field không tồn tại trên hash CÓ tồn tại — khác case hget field thật ở trên, phải trả
  // null sạch, không phải throw vì field-miss trên 1 hash key có thật.
  await runCheck("redis", "hget (nonexistent field)", async () => {
    const v = await redis.hget(hashKey, "this-field-does-not-exist");
    if (v !== null && v !== undefined) throw new AssertionFailure(`hget returned "${v}" for a field that was never set`);
    return { v };
  });

  await runCheck("redis", "hdel", async () => {
    const v = await redis.hdel(hashKey, "field1");
    if (v !== 1) throw new AssertionFailure(`hdel returned ${v}, expected 1 (exactly one field deleted)`);
    return v;
  });

  // hset với field name `__proto__` — hash field là string key tự do, thử prototype pollution nếu
  // tầng nào đó merge field vào 1 object JS thay vì lưu đúng ngữ nghĩa Redis HSET (field độc lập,
  // không phải object property access).
  await runCheck(
    "redis",
    "hset (prototype pollution via field name)",
    async () => {
      await redis.hset(hashKey, "__proto__", "polluted-value");
      assertNoPrototypePollution("a hash field named __proto__");
      return { ok: true };
    },
    { expectBusinessError: true },
  );

  await redis.del(hashKey); // dọn sạch toàn bộ hash

  // --- keys() với glob pattern — chưa từng test; xác nhận prefix isolation THẬT (không chỉ đọc code
  // `PluginStorageService.redisKeys` — nó nối `${prefix}${pattern}` TRƯỚC khi scan, nên về lý thuyết
  // không thể leak sang plugin/tenant khác dù pattern là "*" tuyệt đối) ---
  const keysProbeKey = `test-sdk:probe:keys-scan:${Date.now()}`;
  await runCheck("redis", "keys (own key appears under matching pattern)", async () => {
    await redis.set(keysProbeKey, "1");
    try {
      const found = await redis.keys(`test-sdk:probe:keys-scan:*`);
      if (!found.includes(keysProbeKey)) {
        throw new AssertionFailure(`keys() didn't find the key just set under a matching pattern — found: ${JSON.stringify(found)}`);
      }
      return { found: found.length };
    } finally {
      await redis.del(keysProbeKey);
    }
  });

  // pattern "*" tuyệt đối — case quan trọng nhất: xác nhận KHÔNG có key nào trông như thuộc plugin/
  // tenant KHÁC lẫn vào (mọi key trả về phải nằm trong namespace của CHÍNH test-sdk, không phải
  // cross-tenant leak). Không thể biết chắc data của tenant khác trông thế nào, nhưng ít nhất xác
  // nhận round-trip không crash trên wildcard tuyệt đối và không có gì bất thường về số lượng.
  await runCheck("redis", "keys (wildcard '*', sanity check)", async () => {
    const all = await redis.keys("*");
    return { count: Array.isArray(all) ? all.length : -1 };
  });
}
