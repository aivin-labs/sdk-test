import { notification } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

/**
 * `push`/`sendMail` gửi thật, nhưng nhắm thẳng vào CHÍNH tài khoản API_KEY đang chạy test (user_id/
 * email lấy từ `/apikey/whoami` - xem mintCap.ts) thay vì 1 người dùng thật xa lạ - người nhận
 * chính là người đang chạy `npm test`, không phải spam ai khác. `subscribeTopic`/`unsubscribeTopic`
 * chỉ là đăng ký/huỷ đăng ký nội bộ (không gửi gì cho ai), an toàn để round-trip trọn vẹn.
 */
export async function testNotification(userId?: string, email?: string): Promise<void> {
  const topic = `test-sdk-probe-${Date.now()}`;

  await runCheck("notification", "subscribeTopic", () => notification.subscribeTopic({ topic }), {
    expectBusinessError: true,
  });

  await runCheck("notification", "unsubscribeTopic", () => notification.unsubscribeTopic({ topic }), {
    expectBusinessError: true,
  });

  if (userId) {
    await runCheck(
      "notification",
      "push",
      () =>
        notification.push({
          user_id: userId,
          title: "test-sdk probe",
          body: "Round-trip probe from test-sdk - safe to ignore, sent to your own account.",
        }),
      { expectBusinessError: true },
    );
  } else {
    skip("notification", "push", "no user_id resolved for this account (see mintCap.ts setup)");
  }

  if (email) {
    await runCheck(
      "notification",
      "sendMail",
      () =>
        notification.sendMail({
          to: email,
          subject: "test-sdk probe",
          body: "Round-trip probe from test-sdk - safe to ignore, sent to your own account.",
        }),
      { expectBusinessError: true },
    );
  } else {
    skip("notification", "sendMail", "no email resolved for this account (see mintCap.ts setup)");
  }
}
