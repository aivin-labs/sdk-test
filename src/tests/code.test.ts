import { code } from "@aivin-labs/sdk";
import { AssertionFailure, assertNoPrototypePollution, runCheck } from "../helpers/report";

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

  // logic tự throw lỗi runtime bên trong sandbox — khác case cộng 2 số ở trên (luôn thành công về
  // mặt logic); ở đây lỗi PHẢI đến từ chính đoạn code chạy trong sandbox, không phải lỗi
  // context/auth như case trên. Cả 2 đều dừng ở "missing user in context" trước khi chạm sandbox
  // thật (theo đúng comment gốc của file này) nên vẫn PASS ở nghĩa round-trip, nhưng nếu môi trường
  // nào đó có user context thật, case này sẽ lộ ra đúng lỗi runtime của sandbox thay vì lỗi context.
  await runCheck(
    "code",
    "executeLogic (logic throws)",
    () => code.executeLogic({ logic: "throw new Error('test-sdk probe: intentional sandbox error');" }),
    { expectBusinessError: true },
  );

  // thiếu hẳn field `logic` — phải bị validate reject sạch, không phải throw vì code cố eval
  // `undefined` như 1 chuỗi.
  await runCheck(
    "code",
    "executeLogic (missing logic field)",
    () => code.executeLogic({} as any),
    { expectBusinessError: true },
  );

  // --- Deeper/harder: thử ESCAPE khỏi sandbox thật — vô nghĩa với mọi case ở trên (chỉ test logic
  // đơn giản chạy ĐÚNG bên trong sandbox), ở đây cố tình tấn công CHÍNH ranh giới sandbox. Handler
  // dùng `isolated-vm` thật (`IsolatedVmSandboxHelper.ts` phía BE — V8 isolate riêng biệt, không
  // share global object với host process) nên các vector escape kiểu `constructor.constructor(...)`
  // classic (hoạt động với `vm2`/`new Function` ngây thơ) LẼ RA phải bị chặn — nhưng đáng kiểm tra
  // thật thay vì giả định. Ghi chú: comment gốc đầu file đã xác nhận `ctx.user` thiếu khiến MỌI call
  // dừng ở "missing user in context" trước khi chạm sandbox thật trong môi trường test-sdk hiện tại
  // — case này vẫn PASS ở nghĩa round-trip, nhưng sẽ lộ ra escape thật (throw lỗi rõ ràng) nếu chạy
  // ở môi trường có user context thật, đúng lúc nó có giá trị nhất.
  await runCheck(
    "code",
    "executeLogic (sandbox escape attempt)",
    async () => {
      const res: any = await code.executeLogic({
        logic: `
          try {
            const proc = this.constructor.constructor('return process')();
            return { escaped: true, via: 'constructor.constructor', leaked: proc.version };
          } catch (e1) {
            try {
              return { escaped: true, via: 'global.process', leaked: global.process.version };
            } catch (e2) {
              return { escaped: false };
            }
          }
        `,
      });
      if (res?.escaped === true) {
        throw new AssertionFailure(`SANDBOX ESCAPE — code running inside code.executeLogic() reached the host process (via ${res.via}, leaked ${res.leaked}). Critical isolation failure.`);
      }
      return res;
    },
    { expectBusinessError: true },
  );

  // Prototype pollution qua `args` (kiểu `any`, không ràng buộc shape) — assert Object.prototype của
  // CHÍNH process test-sdk (client-side) không bị đầu độc qua round-trip request/response.
  await runCheck(
    "code",
    "executeLogic (prototype pollution via args)",
    async () => {
      const res = await code.executeLogic(
        JSON.parse('{"logic":"return (args.x || 0) + (args.y || 0);","args":{"x":1,"y":2,"__proto__":{"polluted":"yes"}}}'),
      );
      assertNoPrototypePollution("code.executeLogic()'s args");
      return res;
    },
    { expectBusinessError: true },
  );
}
