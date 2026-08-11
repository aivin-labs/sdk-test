import { causality } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

/**
 * `think`/`search` chỉ đọc/suy luận (giống `ai.prompt`), an toàn. `absorb` ghi vĩnh viễn vào bộ nhớ
 * causality thật của tenant (không có method xoá được expose) — chấp nhận đánh đổi đã thống nhất:
 * ghi 1 fact RÕ RÀNG là test-sdk probe (action/reasons đặt tên rõ, không mập mờ với data thật của
 * người dùng), giống cách đã chấp nhận 1 session test tồn tại lâu dài.
 */
export async function testCausality(): Promise<void> {
  await runCheck("causality", "think", () => causality.think("test-sdk probe: 2+2 bằng mấy?"), {
    expectBusinessError: true,
  });

  await runCheck("causality", "search", () => causality.search("test-sdk probe query", { limit: 3 }), {
    expectBusinessError: true,
  });

  await runCheck(
    "causality",
    "absorb",
    () =>
      causality.absorb([
        {
          reasons: ["test-sdk round-trip probe"],
          action: "test-sdk-probe-action",
          consequences: ["safe to ignore - no real effect, written only to verify the SDK round-trip"],
        },
      ]),
    { expectBusinessError: true },
  );
}
