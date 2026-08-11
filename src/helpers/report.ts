import * as fs from "fs";
import * as path from "path";

export type TestOutcome = "PASS" | "FAIL" | "SKIP";

export interface TestResult {
  namespace: string;
  method: string;
  outcome: TestOutcome;
  detail: string;
  ms: number;
}

const results: TestResult[] = [];

/** Mốc thời gian module này được load - sát với lúc `npm test` bắt đầu chạy thật (trước
 *  `mintCap()`), dùng để tính tổng thời gian cả lần chạy trong report. */
const runStartedAt = Date.now();

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const totalSec = ms / 1000;
  if (totalSec < 60) return `${totalSec.toFixed(1)}s`;
  const min = Math.floor(totalSec / 60);
  const sec = (totalSec % 60).toFixed(1);
  return `${min}m${sec}s`;
}

/**
 * Every namespace `docs/SDK.md`/README documents as part of the SDK's public surface - used only
 * to flag a namespace with ZERO entries in `results` (no test file even attempted it), distinct
 * from one we deliberately `skip()` with a stated reason. Keep in sync with SDKClient's own
 * namespace list if the SDK grows one.
 */
const ALL_NAMESPACES = [
  "ai", "knowledge", "vector", "datasource", "causality", "attachment", "workspace",
  "agent", "browser", "project", "table", "task", "message", "notification", "realtime",
  "queue", "usage", "automation", "resource", "session", "code", "file", "setting", "store",
  "redis", "mongo",
];

/**
 * Chạy 1 lời gọi SDK và ghi nhận kết quả. "PASS" nghĩa là round-trip qua gRPC thành công (kể cả
 * khi response là lỗi nghiệp vụ hợp lệ như "not found" — cái đó chứng minh SDK/transport/auth đều
 * đúng). "FAIL" chỉ dành cho lỗi tầng transport/auth/serialize — thứ thật sự chứng tỏ SDK hỏng.
 */
export async function runCheck(
  namespace: string,
  method: string,
  fn: () => Promise<any>,
  opts?: { expectBusinessError?: boolean },
): Promise<void> {
  const start = Date.now();
  try {
    const res = await fn();
    results.push({
      namespace,
      method,
      outcome: "PASS",
      detail: summarize(res),
      ms: Date.now() - start,
    });
  } catch (e: any) {
    const msg = e?.message || String(e);
    const isTransportFailure =
      /UNAVAILABLE|wrong version number|ECONNREFUSED|CAPABILITY_TOKEN|unauthorized|DEADLINE_EXCEEDED|Too many failed attempts/i.test(
        msg,
      );
    results.push({
      namespace,
      method,
      outcome: isTransportFailure || !opts?.expectBusinessError ? "FAIL" : "PASS",
      detail: msg.slice(0, 200),
      ms: Date.now() - start,
    });
  }
}

/** Namespace/method deliberately not exercised - vd rủi ro spam người thật (notification.push),
 *  tốn tiền/nặng (browser.run), hoặc pollute tenant thật không có cách dọn sạch (automation.createJob). */
export function skip(namespace: string, method: string, reason: string): void {
  results.push({ namespace, method, outcome: "SKIP", detail: reason, ms: 0 });
}

function summarize(res: any): string {
  if (res === undefined || res === null) return "null/undefined";
  if (Array.isArray(res)) return `array(${res.length})`;
  if (typeof res === "object") return JSON.stringify(res).slice(0, 150);
  return String(res).slice(0, 150);
}

function icon(outcome: TestOutcome): string {
  return outcome === "PASS" ? "✅" : outcome === "FAIL" ? "❌" : "⏭️";
}

export function printReport(): boolean {
  const totalDurationMs = Date.now() - runStartedAt;
  const byNamespace = new Map<string, TestResult[]>();
  for (const r of results) {
    if (!byNamespace.has(r.namespace)) byNamespace.set(r.namespace, []);
    byNamespace.get(r.namespace)!.push(r);
  }

  let totalPass = 0;
  let totalFail = 0;
  let totalSkip = 0;

  console.log("\n" + "=".repeat(70));
  console.log("SDK TEST REPORT");
  console.log("=".repeat(70));

  for (const [ns, items] of byNamespace) {
    console.log(`\n[${ns}]`);
    for (const r of items) {
      console.log(`  ${icon(r.outcome)} ${r.method} (${r.ms}ms) — ${r.detail}`);
      if (r.outcome === "PASS") totalPass++;
      else if (r.outcome === "FAIL") totalFail++;
      else totalSkip++;
    }
  }

  const untouched = ALL_NAMESPACES.filter((ns) => !byNamespace.has(ns));
  if (untouched.length) {
    console.log(`\n[untested] ${untouched.join(", ")}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log(`TOTAL: ${totalPass} PASS, ${totalFail} FAIL, ${totalSkip} SKIP — ${formatDuration(totalDurationMs)}`);
  console.log("=".repeat(70) + "\n");

  const reportPath = writeReportFiles(byNamespace, untouched, {
    totalPass,
    totalFail,
    totalSkip,
    totalDurationMs,
  });
  console.log(`[test-sdk] Report written to ${reportPath.json}\n                       and ${reportPath.md}`);

  return totalFail === 0;
}

/**
 * Ghi report ra file (`.test/report.json` + `.test/report.md`, cùng quy ước thư mục `aivin test`
 * CLI đã dùng cho smoke-test report) - console log biến mất khi terminal đóng, file thì không, và
 * JSON cho phép diff giữa các lần chạy / máy khác đọc lại bằng script.
 */
function writeReportFiles(
  byNamespace: Map<string, TestResult[]>,
  untouched: string[],
  summary: { totalPass: number; totalFail: number; totalSkip: number; totalDurationMs: number },
): { json: string; md: string } {
  const outDir = path.join(process.cwd(), ".test");
  fs.mkdirSync(outDir, { recursive: true });
  const timestamp = new Date().toISOString();

  const jsonPath = path.join(outDir, "report.json");
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      { timestamp, duration_ms: summary.totalDurationMs, summary, untested_namespaces: untouched, results },
      null,
      2,
    ),
  );

  const mdPath = path.join(outDir, "report.md");
  fs.writeFileSync(mdPath, buildMarkdown(timestamp, byNamespace, untouched, summary));

  return { json: jsonPath, md: mdPath };
}

function buildMarkdown(
  timestamp: string,
  byNamespace: Map<string, TestResult[]>,
  untouched: string[],
  summary: { totalPass: number; totalFail: number; totalSkip: number; totalDurationMs: number },
): string {
  const lines: string[] = [];
  lines.push(`# test-sdk report`, "", `Run: ${timestamp}`, `Duration: ${formatDuration(summary.totalDurationMs)}`, "");
  lines.push(
    `**${summary.totalPass} PASS, ${summary.totalFail} FAIL, ${summary.totalSkip} SKIP**`,
    "",
  );

  lines.push("| Namespace | Method | Outcome | Time | Detail |");
  lines.push("|---|---|---|---|---|");
  for (const [ns, items] of byNamespace) {
    for (const r of items) {
      const detail = r.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(`| ${ns} | ${r.method} | ${icon(r.outcome)} ${r.outcome} | ${r.ms}ms | ${detail} |`);
    }
  }
  lines.push("");

  if (untouched.length) {
    lines.push(
      `## Untested namespaces`,
      "",
      "Namespaces that exist in the SDK but no test file touches at all yet (different from SKIP - SKIP means deliberately considered and skipped with a reason):",
      "",
      ...untouched.map((ns) => `- \`${ns}\``),
      "",
    );
  }

  return lines.join("\n");
}
