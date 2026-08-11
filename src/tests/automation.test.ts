import { automation } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

/**
 * `getJobs` là read-only. `createJob`/`updateJob`/`deleteJob`/`executeById` đều tạo/sửa/kích hoạt
 * 1 automation THẬT hiển thị trong UI tenant, và `createJob` bắt buộc `agent_id` thật mà test-sdk
 * không có sẵn — skip nhóm ghi thay vì đoán bừa agent_id (có thể trigger job chạy thật).
 */
export async function testAutomation(workspaceId?: string): Promise<void> {
  await runCheck(
    "automation",
    "getJobs",
    () => automation.getJobs({ workspace_id: workspaceId as string, limit: 3 }),
    { expectBusinessError: true },
  );

  for (const method of ["createJob", "updateJob", "deleteJob", "executeById"]) {
    skip("automation", method, "creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess");
  }
}
