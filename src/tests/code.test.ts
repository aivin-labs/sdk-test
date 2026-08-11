import { code } from "@aivin-labs/sdk";
import { runCheck } from "../helpers/report";

/**
 * `executeLogic` chạy code sandbox nên chỉ đưa vào 1 đoạn logic vô hại (cộng 2 số) — nhưng handler
 * (`CodeSDK.ts`) đòi `ctx.user` bắt buộc, mà mintCap ở đây không cấp user thật, nên round-trip
 * chắc chắn dừng ở lỗi nghiệp vụ "missing user in context" trước khi chạm tới sandbox thật — vẫn
 * đủ để chứng minh transport/auth namespace này hoạt động đúng.
 */
export async function testCode(): Promise<void> {
  await runCheck(
    "code",
    "executeLogic",
    () =>
      code.executeLogic({
        logic: "return (args.x || 0) + (args.y || 0);",
        args: { x: 1, y: 2 },
      }),
    { expectBusinessError: true },
  );
}
