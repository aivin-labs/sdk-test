import { resource } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/**
 * Upload 1 file text bé xíu (`temp: true` + `is_public: false` — tự dọn theo thời gian dù `remove`
 * bên dưới có fail) rồi `remove` ngay để dọn sạch trong cùng lần chạy. Round-trip đầy đủ, không
 * để lại rác lâu dài trong storage thật của tenant.
 */
export async function testResource(): Promise<void> {
  const content = `test-sdk probe ${Date.now()}`;
  let uploadedUrl: string | undefined;

  await runCheck(
    "resource",
    "upload",
    async () => {
      const meta = await resource.upload({
        file: Buffer.from(content, "utf8").toString("base64"),
        name: "test-sdk-probe.txt",
        mime: "text/plain",
        is_public: false,
        temp: true,
      });
      uploadedUrl = (meta as any)?.url;
      return meta;
    },
    { expectBusinessError: true },
  );

  if (uploadedUrl) {
    await runCheck("resource", "remove", () => resource.remove({ url: uploadedUrl as string }));

    // remove lần 2 trên đúng url vừa xoá — idempotency hay bị bỏ sót: phải là no-op/lỗi nghiệp vụ
    // sạch, không phải throw vì cố xoá 1 resource đã không còn tồn tại.
    await runCheck("resource", "remove (already removed)", () => resource.remove({ url: uploadedUrl as string }), {
      expectBusinessError: true,
    });
  }

  // remove với url hoàn toàn giả (chưa từng upload) — tách biệt khỏi case "đã xoá" ở trên, phải là
  // lỗi nghiệp vụ "not found" sạch, không phải throw vì storage driver nhận url không tồn tại.
  await runCheck(
    "resource",
    "remove (nonexistent url)",
    () => resource.remove({ url: "https://storage.example.invalid/test-sdk-nonexistent-resource.txt" }),
    { expectBusinessError: true },
  );

  // `name` chỉ là `z.string().optional()` ở tầng validate client (`validation.ts:77`) — không giới
  // hạn ký tự nào, nên filename dạng path traversal đi lọt qua tới tận server. Nếu tầng lưu trữ dùng
  // thẳng `name` làm 1 phần đường dẫn vật lý mà không sanitize, đây là lỗ hổng ghi đè file ngoài ý
  // muốn (cùng loại rủi ro đã thử ở `file.test.ts`, nhưng qua đường resource/storage riêng biệt).
  let traversalUrl: string | undefined;
  await runCheck(
    "resource",
    "upload (path traversal filename)",
    async () => {
      const meta: any = await resource.upload({
        file: Buffer.from("path traversal probe via resource.upload", "utf8").toString("base64"),
        name: "../../../../etc/test-sdk-probe-traversal.txt",
        mime: "text/plain",
        is_public: false,
        temp: true,
      });
      traversalUrl = meta?.url;
      return meta;
    },
    { expectBusinessError: true },
  );
  if (traversalUrl) {
    await runCheck("resource", "remove (path traversal probe cleanup)", () => resource.remove({ url: traversalUrl as string }));
  }
}
