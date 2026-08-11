import { skip } from "../helpers/report";

/**
 * `scheduleJob` lên lịch chạy lại CHÍNH plugin này ("test-sdk") sau `delay_ms` — nhưng test-sdk
 * không phải 1 plugin thật đang chạy trong container nào, nên job đó sẽ không bao giờ có ai chạy
 * tới, và không có method nào expose để huỷ 1 job đã lên lịch. Skip toàn bộ để tránh rác vĩnh viễn.
 */
export async function testQueue(): Promise<void> {
  skip("queue", "scheduleJob", "schedules this same plugin to run again, with no way to cancel a scheduled job — test-sdk isn't a real running plugin so the job would be orphaned forever");
}
