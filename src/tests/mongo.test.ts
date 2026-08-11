import { mongo } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

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
    if (!doc) throw new Error(`findOne didn't find the doc just created (marker=${marker})`);
    return doc;
  });

  await runCheck("mongo", "find", () => model.find({ marker }));

  await runCheck("mongo", "countDocuments", () => model.countDocuments({ marker }));

  await runCheck("mongo", "updateOne", () =>
    model.updateOne({ marker }, { $set: { n: 43 } }),
  );

  await runCheck("mongo", "deleteOne", async () => {
    const res = await model.deleteOne({ marker });
    return res;
  });
}
