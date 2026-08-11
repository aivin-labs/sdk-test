import { datasource } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

/**
 * `getSources`/`getDomains` chỉ đọc, an toàn gọi thẳng. `learn` kích hoạt 1 job học thật từ
 * `source_id` thật (bất đồng bộ, tốn tài nguyên, không có cách huỷ/dọn từ phía test) — skip, không
 * đoán bừa 1 source_id để tránh kích hoạt job học không cần thiết trên nguồn dữ liệu thật của tenant.
 */
export async function testDatasource(): Promise<void> {
  await runCheck("datasource", "getSources", () => datasource.getSources({}), {
    expectBusinessError: true,
  });

  await runCheck("datasource", "getDomains", () => datasource.getDomains({}), {
    expectBusinessError: true,
  });

  skip("datasource", "learn", "triggers a real learning job (async, resource-intensive) on a real data source — needs a real source_id, won't guess");
}
