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
  }
}
