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

/**
 * Throw this - instead of a plain `Error` - from inside a `runCheck()` callback when the FAILURE
 * itself is the thing under test (an assertion on the response shape/behavior, e.g. "limit=0 should
 * return an empty array" or "GLOBAL Object.prototype was polluted"), as opposed to just letting
 * whatever the backend/transport raised propagate. Once caught below, a plain `Error` thrown from
 * such an assertion is indistinguishable from a legitimate backend business-error response - with
 * `expectBusinessError: true` it would silently be recorded as PASS, defeating the assertion
 * entirely (this bit real cases: a confirmed sandbox-escape / prototype-pollution detection would
 * have been reported as a passing check). `AssertionFailure` always fails the check, regardless of
 * `expectBusinessError`.
 */
export class AssertionFailure extends Error {}

/**
 * Checks whether THIS process's global `Object.prototype` was polluted (e.g. a `JSON.parse`/merge
 * somewhere along a round-trip treated a request/response's `__proto__`/`constructor.prototype` keys
 * as literal object properties instead of inert data) and throws an `AssertionFailure` naming the
 * round-tripped call if so. Call this right after any round-trip that sent a
 * `{"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}}`-shaped payload
 * through the SDK - shared here so every prototype-pollution probe across the test files checks/
 * reports it the same way instead of duplicating the same few lines at each call site (~15 near-
 * identical copies before this was pulled out).
 */
export function assertNoPrototypePollution(context: string): void {
  if ((({} as any).polluted !== undefined) || (({} as any).polluted2 !== undefined)) {
    throw new AssertionFailure(`GLOBAL Object.prototype was polluted by round-tripping ${context} through the SDK`);
  }
}

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
    const isAssertionFailure = e instanceof AssertionFailure;
    results.push({
      namespace,
      method,
      outcome: isAssertionFailure || isTransportFailure || !opts?.expectBusinessError ? "FAIL" : "PASS",
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

interface Counts {
  total: number;
  pass: number;
  fail: number;
  skip: number;
}

interface ReportSummary extends Counts {
  totalDurationMs: number;
}

/** "prompt (empty string)" -> "prompt" - nhiều case (edge-case, adversarial input, ...) của cùng
 *  một hàm SDK được đặt tên "method (mô tả case)" ở call site; bóc phần mô tả ra để gom case theo
 *  hàm gốc thay vì đếm mỗi biến thể như một hàm riêng. */
function baseMethodName(method: string): string {
  return method.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function tally(items: TestResult[]): Counts {
  const c: Counts = { total: items.length, pass: 0, fail: 0, skip: 0 };
  for (const r of items) {
    if (r.outcome === "PASS") c.pass++;
    else if (r.outcome === "FAIL") c.fail++;
    else c.skip++;
  }
  return c;
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    if (!map.has(key(item))) map.set(key(item), []);
    map.get(key(item))!.push(item);
  }
  return map;
}

/** namespace -> method gốc -> các case (kết quả) của method đó trong namespace. */
function groupByNamespaceAndMethod(items: TestResult[]): Map<string, Map<string, TestResult[]>> {
  const byNamespace = groupBy(items, (r) => r.namespace);
  const nested = new Map<string, Map<string, TestResult[]>>();
  for (const [ns, nsItems] of byNamespace) {
    nested.set(ns, groupBy(nsItems, (r) => baseMethodName(r.method)));
  }
  return nested;
}

function logConsoleReport(byNamespace: Map<string, TestResult[]>, untouched: string[], summary: ReportSummary): void {
  console.log("\n" + "=".repeat(70));
  console.log("SDK TEST REPORT");
  console.log("=".repeat(70));

  for (const [ns, items] of byNamespace) {
    const c = tally(items);
    console.log(`\n[${ns}] ${c.pass} PASS, ${c.fail} FAIL, ${c.skip} SKIP (${c.total} cases)`);
    for (const r of items) {
      console.log(`  ${icon(r.outcome)} ${r.method} (${r.ms}ms) — ${r.detail}`);
    }
  }

  if (untouched.length) {
    console.log(`\n[untested] ${untouched.join(", ")}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log(`TOTAL: ${summary.pass} PASS, ${summary.fail} FAIL, ${summary.skip} SKIP — ${formatDuration(summary.totalDurationMs)}`);
  console.log("=".repeat(70) + "\n");
}

export function printReport(): boolean {
  const summary: ReportSummary = { ...tally(results), totalDurationMs: Date.now() - runStartedAt };
  const byNamespace = groupBy(results, (r) => r.namespace);
  const untouched = ALL_NAMESPACES.filter((ns) => !byNamespace.has(ns));

  logConsoleReport(byNamespace, untouched, summary);

  const reportPath = writeReportFiles(byNamespace, untouched, summary);
  console.log(`[test-sdk] Report written to ${reportPath.json}\n                       and ${reportPath.md}`);

  return summary.fail === 0;
}

/**
 * Ghi report ra file (`.test/report.json` + `.test/report.md`, cùng quy ước thư mục `aivin test`
 * CLI đã dùng cho smoke-test report) - console log biến mất khi terminal đóng, file thì không, và
 * JSON cho phép diff giữa các lần chạy / máy khác đọc lại bằng script.
 */
function writeReportFiles(
  byNamespace: Map<string, TestResult[]>,
  untouched: string[],
  summary: ReportSummary,
): { json: string; md: string } {
  const outDir = path.join(process.cwd(), ".test");
  fs.mkdirSync(outDir, { recursive: true });
  const timestamp = new Date().toISOString();

  const byNamespaceAndMethod = groupByNamespaceAndMethod(results);
  const namespaceSummary = [...byNamespace].map(([ns, items]) => ({ namespace: ns, ...tally(items) }));
  const functionSummary = [...byNamespaceAndMethod].flatMap(([ns, byMethod]) =>
    [...byMethod].map(([method, items]) => ({ namespace: ns, method, ...tally(items) })),
  );

  const jsonPath = path.join(outDir, "report.json");
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        timestamp,
        duration_ms: summary.totalDurationMs,
        summary,
        untested_namespaces: untouched,
        namespace_summary: namespaceSummary,
        function_summary: functionSummary,
        results,
      },
      null,
      2,
    ),
  );

  const mdPath = path.join(outDir, "report.md");
  fs.writeFileSync(mdPath, buildMarkdown(timestamp, byNamespace, byNamespaceAndMethod, untouched, summary));

  return { json: jsonPath, md: mdPath };
}

function buildSummaryTable(namespaceSummary: { namespace: string; total: number; pass: number; fail: number; skip: number }[]): string[] {
  const lines: string[] = [];
  lines.push("| Namespace | Cases | Pass | Fail | Skip |");
  lines.push("|---|---|---|---|---|");
  for (const s of namespaceSummary) {
    lines.push(`| ${s.namespace} | ${s.total} | ${s.pass} | ${s.fail} | ${s.skip} |`);
  }
  return lines;
}

function buildFunctionSummaryTable(byNamespaceAndMethod: Map<string, Map<string, TestResult[]>>): string[] {
  const lines: string[] = [];
  lines.push("| Namespace | Function | Cases | Pass | Fail | Skip |");
  lines.push("|---|---|---|---|---|---|");
  for (const [ns, byMethod] of byNamespaceAndMethod) {
    for (const [method, items] of byMethod) {
      const c = tally(items);
      lines.push(`| ${ns} | ${method} | ${c.total} | ${c.pass} | ${c.fail} | ${c.skip} |`);
    }
  }
  return lines;
}

function buildDetailTable(byNamespace: Map<string, TestResult[]>): string[] {
  const lines: string[] = [];
  lines.push("| Namespace | Method | Outcome | Time | Detail |");
  lines.push("|---|---|---|---|---|");
  for (const [ns, items] of byNamespace) {
    for (const r of items) {
      const detail = r.detail.replace(/\|/g, "\\|").replace(/\n/g, " ");
      lines.push(`| ${ns} | ${r.method} | ${icon(r.outcome)} ${r.outcome} | ${r.ms}ms | ${detail} |`);
    }
  }
  return lines;
}

function buildMarkdown(
  timestamp: string,
  byNamespace: Map<string, TestResult[]>,
  byNamespaceAndMethod: Map<string, Map<string, TestResult[]>>,
  untouched: string[],
  summary: ReportSummary,
): string {
  const namespaceSummary = [...byNamespace].map(([ns, items]) => ({ namespace: ns, ...tally(items) }));

  const lines: string[] = [];
  lines.push(`# test-sdk report`, "", `Run: ${timestamp}`, `Duration: ${formatDuration(summary.totalDurationMs)}`, "");
  lines.push(`**${summary.pass} PASS, ${summary.fail} FAIL, ${summary.skip} SKIP (${summary.total} cases)**`, "");

  lines.push(`## Summary by namespace`, "", ...buildSummaryTable(namespaceSummary), "");
  lines.push(`## Summary by namespace / function`, "", ...buildFunctionSummaryTable(byNamespaceAndMethod), "");
  lines.push(`## Case detail`, "", ...buildDetailTable(byNamespace), "");

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
