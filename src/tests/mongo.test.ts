import { mongo } from "@aivin-labs/sdk";
import { AssertionFailure, assertNoPrototypePollution, runCheck } from "../helpers/report";

/**
 * `mongo.model(name)` là collection MongoDB riêng theo plugin+tenant do host cấp — cũng không
 * cần workspace/session. Tự insert 1 doc test rồi dọn sạch bằng deleteOne, không đụng data thật.
 */
export async function testMongo(): Promise<void> {
  const model = mongo.model("test_sdk_probe");
  const marker = `probe-${Date.now()}`;

  await runCheck("mongo", "create", () => model.create({ marker, n: 42 }));

  await runCheck("mongo", "findOne", async () => {
    const doc = await model.findOne({ marker });
    if (!doc) throw new AssertionFailure(`findOne didn't find the doc just created (marker=${marker})`);
    return doc;
  });

  await runCheck("mongo", "find", () => model.find({ marker }));

  await runCheck("mongo", "countDocuments", () => model.countDocuments({ marker }));

  await runCheck("mongo", "updateOne", () =>
    model.updateOne({ marker }, { $set: { n: 43 } }),
  );

  // updateOne với filter không khớp doc nào — khác case marker thật ở trên, phải trả
  // matchedCount:0 sạch, không phải throw vì "0 kết quả" bị coi nhầm là lỗi.
  await runCheck("mongo", "updateOne (filter matches nothing)", async () => {
    const res: any = await model.updateOne({ marker: "this-marker-does-not-exist" }, { $set: { n: 99 } });
    if (res?.matchedCount !== 0) {
      throw new AssertionFailure(`expected matchedCount:0 for a filter matching nothing, got ${JSON.stringify(res)}`);
    }
    return res;
  });

  // findOne với filter không khớp doc nào — phải trả null sạch, không phải throw vì lookup miss.
  await runCheck("mongo", "findOne (filter matches nothing)", async () => {
    const doc = await model.findOne({ marker: "this-marker-does-not-exist" });
    if (doc) throw new AssertionFailure(`findOne returned a doc for a marker that was never created`);
    return { doc };
  });

  await runCheck("mongo", "deleteOne", async () => {
    const res = await model.deleteOne({ marker });
    return res;
  });

  // deleteOne lần 2 trên đúng marker vừa xoá — idempotency hay bị bỏ sót: phải trả deletedCount:0
  // sạch, không phải throw vì cố xoá 1 doc đã không còn tồn tại.
  await runCheck("mongo", "deleteOne (already deleted)", async () => {
    const res: any = await model.deleteOne({ marker });
    if (res?.deletedCount !== 0) {
      throw new AssertionFailure(`expected deletedCount:0 for a doc already deleted, got ${JSON.stringify(res)}`);
    }
    return res;
  });

  // --- Deeper/harder: prototype pollution + operator-as-literal-data + toán tử Mongo nâng cao thật ---

  // Prototype pollution qua `__proto__`/`constructor.prototype` trong doc data — assert
  // Object.prototype của CHÍNH process test-sdk KHÔNG bị đầu độc sau round-trip, không chỉ kiểm tra
  // "có throw hay không" như các case khác trong file này.
  const pollutionMarker = `proto-probe-${Date.now()}`;
  await runCheck(
    "mongo",
    "create (prototype pollution attempt)",
    async () => {
      const res = await model.create(
        JSON.parse(`{"marker":"${pollutionMarker}","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}}`),
      );
      assertNoPrototypePollution("this doc");
      await model.deleteOne({ marker: pollutionMarker }); // dọn ngay, không phụ thuộc cleanup ở trên
      return res;
    },
  );

  // Field value trông giống Mongo query operator (`$gt`/`$where`) nhưng đây là DATA thật của 1 field
  // (`payload`), không phải filter — round-trip xong PHẢI đọc lại đúng y hệt object gốc (literal
  // value), không bị driver diễn giải nhầm thành operator ở bất kỳ tầng nào giữa client và DB.
  const operatorValueMarker = `op-value-probe-${Date.now()}`;
  await runCheck("mongo", "create+findOne (operator-shaped value, as literal data)", async () => {
    const payload = { $gt: "", $where: "this is data, not a query operator" };
    await model.create({ marker: operatorValueMarker, payload });
    const doc: any = await model.findOne({ marker: operatorValueMarker });
    await model.deleteOne({ marker: operatorValueMarker });
    if (!doc || JSON.stringify(doc.payload) !== JSON.stringify(payload)) {
      throw new AssertionFailure(`operator-shaped field value didn't round-trip as literal data — got ${JSON.stringify(doc?.payload)}`);
    }
    return doc;
  });

  // Toán tử Mongo nâng cao thật (`$in`) trên 3 doc — khác hẳn mọi case ở trên (chỉ dùng equality
  // filter đơn giản `{marker}`); xác nhận passthrough query API hỗ trợ thật các operator phức tạp,
  // không chỉ lookup theo field đơn.
  const groupMarkers = [`group-probe-a-${Date.now()}`, `group-probe-b-${Date.now()}`, `group-probe-c-${Date.now()}`];
  await runCheck("mongo", "find ($in operator)", async () => {
    for (const m of groupMarkers) await model.create({ marker: m, group: "test-sdk-probe-group" });
    try {
      const docs: any[] = await model.find({ marker: { $in: [groupMarkers[0], groupMarkers[2]] } });
      if (docs.length !== 2) {
        throw new AssertionFailure(`$in should match exactly 2 of the 3 docs, matched ${docs.length}`);
      }
      return { matched: docs.length };
    } finally {
      for (const m of groupMarkers) await model.deleteOne({ marker: m }); // luôn dọn dù assertion trên fail
    }
  });
}
