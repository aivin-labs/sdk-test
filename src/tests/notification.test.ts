import { notification } from "@aivin-labs/sdk";
import { assertNoPrototypePollution, runCheck, skip } from "../helpers/report";

/**
 * `push`/`sendMail` gửi thật, nhưng nhắm thẳng vào CHÍNH tài khoản API_KEY đang chạy test (user_id/
 * email lấy từ `/apikey/whoami` - xem mintCap.ts) thay vì 1 người dùng thật xa lạ - người nhận
 * chính là người đang chạy `npm test`, không phải spam ai khác. `subscribeTopic`/`unsubscribeTopic`
 * chỉ là đăng ký/huỷ đăng ký nội bộ (không gửi gì cho ai), an toàn để round-trip trọn vẹn.
 *
 * Các case "push (...)" phía dưới (sau case "push (prototype pollution...)") probe phần cơ chế
 * mạnh hơn của backend (`NotificationService.pushNotification`/`NotificationIO`): chọn channel
 * (`channels`), định tuyến theo `priority`, resolve audience qua `receiver_id`/`receiver_ids`/`topic`
 * (broadcast), render i18n qua `title_key`/`message_key`/`vars`, và `messageIsHtml`. Trước đây field
 * `user_id` (documented, REQUIRED) không được `NotificationService.pushNotification` đọc để resolve
 * audience (nó chỉ đọc `user`/`receiver_id`/`receiver_ids`/`topic`) — round-trip PASS nhưng không
 * thật sự gửi gì; `body` cũng bị bỏ qua tương tự (mọi engine chỉ đọc `notiReq.message`). ĐÃ FIX ở SDK
 * (`@aivin-labs/sdk` — xem `push()` trong SDKClient.ts + `pushNotificationParamsSchema` trong
 * validation.ts, CHANGELOG.md "Unreleased"): `user_id`/`body` giờ được remap sang `receiver_id`/
 * `message` ngay trong client trước khi gửi lên host. Case "push" gốc ở trên giờ đã delivery thật;
 * các case dưới vẫn giữ để cover trực tiếp `receiver_id`/`receiver_ids`/`topic`/channels/priority/i18n
 * — không còn là "workaround" cho field bị bỏ qua nữa, mà là coverage cho các audience shape khác.
 */
export async function testNotification(userId?: string, email?: string): Promise<void> {
  const topic = `test-sdk-probe-${Date.now()}`;

  await runCheck("notification", "subscribeTopic", () => notification.subscribeTopic({ topic }), {
    expectBusinessError: true,
  });

  await runCheck("notification", "unsubscribeTopic", () => notification.unsubscribeTopic({ topic }), {
    expectBusinessError: true,
  });

  // unsubscribeTopic cho 1 topic CHƯA BAO GIỜ subscribe — khác case topic thật ở trên (vừa
  // subscribe xong), phải là no-op sạch, không phải throw vì cố xoá 1 subscription không tồn tại.
  await runCheck(
    "notification",
    "unsubscribeTopic (never subscribed)",
    () => notification.unsubscribeTopic({ topic: `test-sdk-probe-never-subscribed-${Date.now()}` }),
    { expectBusinessError: true },
  );

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

    // push() nhận `[key: string]: any` tự do — bề mặt pollution duy nhất trong namespace này. Vẫn
    // nhắm vào CHÍNH tài khoản đang chạy test (đúng đánh đổi đã chấp nhận ở case "push" phía trên),
    // chỉ thêm 1 push nữa, không lạm dụng.
    await runCheck(
      "notification",
      "push (prototype pollution via free-form fields)",
      async () => {
        const res = await notification.push(
          JSON.parse(
            `{"user_id":"${userId}","title":"test-sdk proto probe","body":"safe to ignore","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}}`,
          ),
        );
        assertNoPrototypePollution("notification.push()");
        return res;
      },
      { expectBusinessError: true },
    );

    // `receiver_id` - field mà pushNotification() THẬT SỰ đọc để resolve audience (khác `user_id`
    // documented ở trên, vốn bị bỏ qua). channels: ['database'] để chỉ tạo entry Notification Center,
    // không kích push thiết bị/email thật cho case cơ bản này.
    await runCheck(
      "notification",
      "push (receiver_id - the field the real handler actually reads)",
      () =>
        notification.push({
          user_id: userId,
          receiver_id: userId,
          title: "test-sdk probe (receiver_id)",
          body: "Round-trip probe using `receiver_id`, safe to ignore, sent to your own account.",
          channels: ["database"],
        }),
      { expectBusinessError: true },
    );

    // `receiver_ids` (mảng) - batch audience resolution, nhánh khác `receiver_id` đơn ở trên.
    await runCheck(
      "notification",
      "push (receiver_ids batch)",
      () =>
        notification.push({
          user_id: userId,
          receiver_ids: [userId],
          title: "test-sdk probe (receiver_ids batch)",
          body: "Round-trip probe for batch receiver_ids audience resolution, self-targeted.",
          channels: ["database"],
        }),
      { expectBusinessError: true },
    );

    // `channels` + `priority` - channels lọc engine SAU KHI đã match priority (không thay priority,
    // chỉ loại bớt). 'push' engine tự no-op nếu tài khoản test không có device/FCM token đăng ký.
    await runCheck(
      "notification",
      "push (channels + priority routing)",
      () =>
        notification.push({
          user_id: userId,
          receiver_id: userId,
          title: "test-sdk probe (channels+priority)",
          body: "Round-trip probe for channel-filtered, priority-routed dispatch.",
          priority: "high",
          channels: ["database", "push"],
        }),
      { expectBusinessError: true },
    );

    // channels: ['email'] + priority: 'urgent' - CHỈ combo này kích hoạt EmailEngine
    // (EmailEngine.isMatch() yêu cầu đúng priority === 'urgent', xem
    // be/src/notification/engine/EmailEngine.ts). Khác `sendMail()` (gửi thẳng text/HTML thô mình
    // đưa vào), path này wrap qua MailHelper.getNotificationTemplate() - header màu, greeting cá
    // nhân hoá theo tên user, notification box, footer - "bản đẹp" thật sự của hệ thống. Cố tình bỏ
    // `title`/`body`, chỉ đưa `prompt` để backend tự AI-generate nội dung
    // (NotificationHelper.generateDatabase) trước khi wrap - đúng cơ chế "gen" đã bàn, gửi thật vào
    // hộp mail của chính tài khoản đang test.
    await runCheck(
      "notification",
      "push (channels: ['email'], priority: 'urgent' — the beautiful MailHelper template, AI-generated from prompt)",
      () =>
        notification.push({
          user_id: userId,
          prompt:
            "Chúc mừng bạn đã hoàn tất thiết lập test-sdk và bộ test notification chạy thành công. Đây là email xác nhận round-trip cuối cùng.",
          priority: "urgent",
          channels: ["email"],
        }),
      { expectBusinessError: true },
    );

    // `messageIsHtml` - báo cho EmailEngine biết `body` đã là HTML hoàn chỉnh, gửi thẳng không
    // escape/nhúng qua template chung. Giữ channels: ['database'] để không phát sinh email thật ở
    // case này (email HTML đã được cover riêng ở nhóm sendMail bên dưới, và case ngay trên đã cover
    // EmailEngine's own beautiful template).
    await runCheck(
      "notification",
      "push (messageIsHtml)",
      () =>
        notification.push({
          user_id: userId,
          receiver_id: userId,
          title: "test-sdk probe (messageIsHtml)",
          body: "<b>test-sdk probe</b> — safe, self-targeted, HTML body via messageIsHtml.",
          messageIsHtml: true,
          channels: ["database"],
        }),
      { expectBusinessError: true },
    );

    // `title_key`/`message_key`/`vars` - đường render i18n (config/i18n/default.json) thay cho
    // title/body cố định. Key dùng ở đây không hẳn tồn tại trong deployment đang test - chỉ xác nhận
    // round-trip không crash khi key không resolve được, không assert nội dung render ra (business/
    // config concern, ngoài tầm test-sdk).
    await runCheck(
      "notification",
      "push (title_key/message_key/vars i18n)",
      () =>
        notification.push({
          user_id: userId,
          receiver_id: userId,
          title: "test-sdk probe (i18n fallback title)",
          body: "test-sdk probe (i18n fallback body)",
          title_key: "TEST_SDK.PROBE_TITLE",
          message_key: "TEST_SDK.PROBE_MESSAGE",
          vars: { probe: "test-sdk", ts: Date.now() },
          channels: ["database"],
        }),
      { expectBusinessError: true },
    );

    // Topic broadcast (CASE 3 trong pushNotification): audience resolve qua danh sách subscriber của
    // topic (Redis `noti_pub:<client>:<topic>`) thay vì user/receiver_id/receiver_ids trực tiếp. Dùng
    // topic riêng (không đụng `topic` ở phần subscribeTopic/unsubscribeTopic phía trên, cái đó đã bị
    // unsubscribe ngay sau khi subscribe) - tự subscribe rồi unsubscribe lại để không để sót state.
    const broadcastTopic = `test-sdk-probe-broadcast-${Date.now()}`;
    await runCheck(
      "notification",
      "subscribeTopic (setup for push topic-broadcast probe)",
      () => notification.subscribeTopic({ topic: broadcastTopic, user_id: userId }),
      { expectBusinessError: true },
    );

    await runCheck(
      "notification",
      "push (topic broadcast — no user_id/receiver_id, audience = topic subscribers)",
      () =>
        notification.push({
          user_id: userId,
          topic: broadcastTopic,
          title: "test-sdk probe (topic broadcast)",
          body: "Round-trip probe for topic-broadcast audience resolution, safe/self-targeted.",
          channels: ["database"],
        }),
      { expectBusinessError: true },
    );

    await runCheck(
      "notification",
      "unsubscribeTopic (cleanup push topic-broadcast probe)",
      () => notification.unsubscribeTopic({ topic: broadcastTopic, user_id: userId }),
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

    // body chứa HTML/script thật — email client render HTML nên đây là bề mặt XSS-in-email kinh
    // điển nếu body không được escape đúng khi nhúng vào template email. Chỉ gửi thêm 1 email nữa,
    // vẫn về CHÍNH tài khoản đang chạy test (không phải ai lạ) — không kiểm tra "có bị escape hay
    // không" (quyết định sản phẩm), chỉ xác nhận round-trip không crash khi body chứa HTML thật.
    await runCheck(
      "notification",
      "sendMail (HTML/script content in body)",
      () =>
        notification.sendMail({
          to: email,
          subject: "test-sdk probe (HTML body)",
          body: `<script>alert('test-sdk probe — safe, sent only to your own account')</script><img src=x onerror="alert(1)">Round-trip probe with HTML content — safe to ignore.`,
        }),
      { expectBusinessError: true },
    );

    // CRLF header injection kinh điển trong `subject` (SMTP header injection — nếu mail lib nối
    // thẳng subject vào raw header block mà không escape `\r\n`, attacker chèn được header tuỳ ý,
    // thường dùng để thêm Bcc âm thầm gửi cho người khác). Bcc TỰ NHẮM VÀO CHÍNH email đang test —
    // dù injection có thành công thật, người nhận vẫn chỉ là chính tài khoản này, không phải ai lạ.
    // Không assert "có bị injection hay không" (cần đọc raw email header, ngoài tầm với của test-sdk)
    // — chỉ xác nhận round-trip không crash khi subject chứa CRLF + header giả.
    await runCheck(
      "notification",
      "sendMail (CRLF header injection in subject)",
      () =>
        notification.sendMail({
          to: email,
          subject: `test-sdk probe\r\nBcc: ${email}\r\nX-Test-Sdk-Injected-Header: true`,
          body: "Round-trip probe testing CRLF/header-injection handling in the subject field — safe, self-targeted only.",
        }),
      { expectBusinessError: true },
    );

    // CRLF injection trong `to` — cùng lớp lỗ hổng nhưng qua field khác (`to` thường được validate
    // chặt hơn `subject` vì trực tiếp quyết định người nhận — đáng test riêng, không suy ra được từ
    // case subject ở trên). Giá trị sau `\r\n` vẫn là CHÍNH email này, không phải người lạ.
    await runCheck(
      "notification",
      "sendMail (CRLF injection in to)",
      () =>
        notification.sendMail({
          to: `${email}\r\nBcc: ${email}`,
          subject: "test-sdk probe (CRLF in to field)",
          body: "Round-trip probe testing CRLF injection in the `to` field — safe, self-targeted only.",
        }),
      { expectBusinessError: true },
    );
  } else {
    skip("notification", "sendMail", "no email resolved for this account (see mintCap.ts setup)");
  }
}
