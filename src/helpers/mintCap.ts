import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { configureTransport } from "@aivin-labs/sdk";

/**
 * Reads the SAME machine-wide active context `aivin login <baseUrl>` (the CLI in @aivin-labs/sdk)
 * writes to `~/.aivin/credentials` - the ONLY source for `base_url`/`api_key`/`sdk_endpoint` here.
 * test-sdk carries no config of its own on purpose - it's just another local script on this
 * machine, wherever `aivin login` last pointed is exactly where this should run against too.
 */
function loadCliActiveContext(): { base_url?: string; api_key?: string; sdk_endpoint?: string } {
  const credentialsPath = path.join(os.homedir(), ".aivin", "credentials");
  if (!fs.existsSync(credentialsPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(credentialsPath, "utf8"));
  } catch {
    return {};
  }
}

/**
 * Client id 1 API key được mint dưới dạng `${client}-ak-<random>` (xem ApiKeyService.createApiKey
 * phía BE, và bản CLI parse y hệt qua `parseApiKeyClient`) - tách local, không cần gọi mạng gì thêm.
 *
 * Cần gửi kèm làm header `x-client-slug` cho MỌI request có Authorization tới route không thuộc
 * `PUBLIC_CATEGORIES` (như `/plugins/*`) - `checkRegisteredClient` (SettingService.ts) resolve
 * "client" ưu tiên từ header này, rồi tới Origin/Referer map qua TrustDomainService, cuối cùng mới
 * fallback về chính Host header của request. Gọi thẳng vào domain API gốc (CLI/SDK, không phải FE
 * qua domain riêng của tenant) không có Origin nào để map - fallback về Host sẽ ra domain API
 * ("beta_api_aivin_vn" chẳng hạn), không bao giờ khớp `client` thật nào trong `registered_clients`
 * → 403 CLIENT_NOT_REGISTERED dù API key hoàn toàn hợp lệ. Không phải lỗi thiếu đăng ký tenant -
 * là gap giữa luồng "gọi qua domain riêng của FE" (có Origin, map được) và "gọi thẳng CLI/SDK vào
 * API host" (không có gì để map ngoài chính header này).
 */
function parseApiKeyClient(apiKey: string): string | undefined {
  const anchorIndex = apiKey.lastIndexOf("-ak-");
  return anchorIndex === -1 ? undefined : apiKey.slice(0, anchorIndex);
}

/**
 * `store`/`knowledge`/`usage` (và nhiều namespace khác) cần `workspace_id` thật trong context -
 * không có thì BE trả lỗi nghiệp vụ "Missing workspaceId" ngay từ đầu, che mất việc round-trip có
 * thật sự hoạt động hay không. Lấy y hệt cách `aivin test`'s runSmokeTest làm (`GET /workspace/list`,
 * lấy workspace đầu tiên) - best-effort, không throw nếu fail (tài khoản có thể chưa có workspace
 * nào, hoặc route đổi khác) vì thiếu workspace vẫn còn hữu ích hơn crash hẳn cả run.
 *
 * `store.*` cụ thể (StoreSDK.resolveScope) đòi cả `project_id`, không chỉ `workspace_id` - thiếu
 * riêng field này là lý do mọi store.* trước đây fail "Missing workspaceId, projectId or client
 * context" dù workspace đã có. `GET /workspace/list` trả kèm `projects` lồng trong mỗi workspace
 * (WorkspaceService.normalizeEnrichedProjects) nên lấy project đầu tiên của workspace đầu tiên
 * luôn, không cần gọi thêm request nào.
 */
async function fetchFirstWorkspaceContext(
  baseUrl: string,
  apiKey: string,
  clientSlug: string | undefined,
): Promise<{ workspace_id?: string; project_id?: string; user_id?: string }> {
  try {
    // `/workspace/list` không nằm trong PUBLIC_CATEGORIES nên dính đúng gap y hệt mint-cap - thiếu
    // `x-client-slug` là request rơi vào Host-fallback, ra "client" = domain API (không map được
    // registered_clients nào) → 401/403, im lặng trả về {} (không throw, vẫn coi là "không có
    // workspace" thay vì crash cả run) khiến mọi test cần workspace_id/project_id phía sau mất hết
    // context dù account hoàn toàn hợp lệ. Cùng 1 header, cùng 1 lý do như POST /plugins/test/mint-cap.
    const res = await fetch(`${baseUrl}/workspace/list`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(clientSlug ? { "x-client-slug": clientSlug } : {}),
      },
    });
    if (!res.ok) return {};
    const data = (await res.json()) as any;
    const workspaces = Array.isArray(data) ? data : data?.items ?? [];
    const workspace = workspaces[0];
    return {
      workspace_id: workspace?.id ?? workspace?._id,
      project_id: workspace?.projects?.[0]?.id ?? workspace?.projects?.[0]?._id,
      // `creator_uid` - chủ sở hữu workspace này. Với workspace "Personal" tự động tạo cho chính
      // tài khoản API_KEY đang dùng, đây chính là user_id thật của tài khoản đó - dùng để build
      // `ctx.user` cho SDKClient (nhiều handler như DatastoreSDK.createTable đọc thẳng `ctx.user.id`
      // không null-check, throw TypeError thô nếu context.user không có).
      user_id: workspace?.creator_uid,
    };
  } catch {
    return {};
  }
}

/**
 * `notification.push`/`sendMail` cần 1 địa chỉ thật để test round-trip có ý nghĩa (không chỉ dừng
 * ở lỗi nghiệp vụ) - dùng `/apikey/whoami` (route CLI `aivin key`/`aivin login` đã dùng để in email
 * tài khoản) để gửi thẳng cho CHÍNH tài khoản đang chạy test, không phải người lạ.
 */
async function fetchAccountEmail(
  baseUrl: string,
  apiKey: string,
  clientSlug: string | undefined,
): Promise<string | undefined> {
  try {
    const res = await fetch(`${baseUrl}/apikey/whoami`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...(clientSlug ? { "x-client-slug": clientSlug } : {}),
      },
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as any;
    return data?.email;
  } catch {
    return undefined;
  }
}

/**
 * SDK's `project` namespace (từ trong 1 plugin đang chạy) chỉ có `get`/`search` - đọc, không tạo
 * được. Tạo project là việc của CLI/API-key, qua `POST /:workspaceId/project/edit` (comment gốc
 * ở `ProjectController.ts`: "`aivin project create`/`aivin project update` (the CLI) upsert
 * projects using the same API_KEY it already deploys/triggers plugins with") - đúng cơ chế
 * test-sdk đã có sẵn (cùng 1 api_key, cùng cần `x-client-slug`). Tự nhiên idempotent: chỉ gọi khi
 * workspace chưa có project nào, nên lần chạy sau sẽ thấy đúng project vừa tạo qua
 * `fetchFirstWorkspaceContext` ở trên (nó luôn là project đầu tiên), không tạo trùng.
 */
async function createProject(
  baseUrl: string,
  apiKey: string,
  clientSlug: string | undefined,
  workspaceId: string,
): Promise<string | undefined> {
  try {
    const res = await fetch(`${baseUrl}/project/${workspaceId}/project/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        ...(clientSlug ? { "x-client-slug": clientSlug } : {}),
      },
      // `@Body() dirReq: ProjectRequest` được validate (class-validator, `workspace_id` @IsNotEmpty)
      // TRƯỚC khi handler kịp tự gán `dirReq.workspace_id = workspaceId` từ URL param - thiếu field
      // này trong chính JSON body sẽ bị chặn 400 ngay ở validation pipe, chưa tới được handler.
      body: JSON.stringify({ name: "test-sdk", workspace_id: workspaceId }),
    });
    if (!res.ok) {
      console.error(`[test-sdk] createProject failed: HTTP ${res.status} ${await res.text().catch(() => "")}`);
      return undefined;
    }
    const project = (await res.json()) as any;
    return project?.id ?? project?._id;
  } catch (e: any) {
    console.error(`[test-sdk] createProject threw: ${e?.message || e}`);
    return undefined;
  }
}

/**
 * Mint 1 capability token thật qua `POST /plugins/test/mint-cap` (PluginController) - endpoint này
 * gọi đúng `GrpcCapabilityStore.mint()` mà BE tự dùng khi khởi động 1 container plugin thật, giả
 * lập bước "host cấp cap cho lời gọi này" mà không cần đăng nhập FE thật.
 *
 * Xác thực bằng API_KEY thật (đúng key `aivin login` mint, cùng cơ chế `AuthGuard` + `@AllowApiKey()`
 * mọi endpoint CLI khác dùng) - `client` do BE tự lấy từ danh tính API_KEY, KHÔNG nhận từ tham số
 * `claims` nữa. Bản đầu tiên dùng 1 private-key tĩnh dùng chung (PrivateApiGuard) và tin thẳng
 * `client` do caller tự khai trong body - ai cầm đúng key đó mint được cap giả danh BẤT KỲ tenant
 * nào trong hệ thống, về bản chất là 1 master key impersonate xuyên tenant. Giờ chỉ mint được cap
 * cho đúng tenant của chính API_KEY đang dùng, không còn cách nào chạm tới tenant khác.
 *
 * KHÔNG dùng Redis trực tiếp nữa (bản cũ tự `setex` thẳng vào Redis mà BE đọc) — đòi hỏi test-sdk
 * phải cầm password Redis full-quyền (đọc/ghi cả DB) chỉ để làm đúng 1 thao tác hẹp, và chỉ hoạt
 * động khi Redis publish ra host cùng máy (không test được staging/remote qua tunnel).
 *
 * Cũng trả kèm `secret` (GrpcContainerSecretStore, thay hẳn cho `SDK_SECRET` tĩnh dùng chung toàn
 * platform trước đây — giá trị đó đã bị bỏ hoàn toàn phía BE, không còn cách nào dùng lại). Đưa
 * `secret`/`sdk_endpoint` vào SDK qua `configureTransport()` (module-private trong GrpcInvoker,
 * KHÔNG qua `process.env`) - tránh đúng rủi ro mà `resolveSdkSecret()` phía SDK cảnh báo: business
 * logic của plugin (hoặc bất cứ code nào share process này) đọc được secret chỉ bằng 1 dòng
 * `console.log(process.env)`.
 */
export async function mintCap(claims: {
  plugin_id: string;
  workspace_id?: string;
  project_id?: string;
  session_id?: string;
}): Promise<{
  cap: string;
  client: string;
  workspace_id?: string;
  project_id?: string;
  user_id?: string;
  email?: string;
}> {
  const { base_url: baseUrl, api_key: apiKey, sdk_endpoint: sdkEndpoint } = loadCliActiveContext();
  if (!apiKey || !baseUrl) {
    throw new Error("Not logged in - run `aivin login <baseUrl>` once (saves to ~/.aivin/credentials).");
  }

  const clientSlug = parseApiKeyClient(apiKey);
  let userId: string | undefined;

  if (!claims.workspace_id || !claims.project_id) {
    const ctx = await fetchFirstWorkspaceContext(baseUrl, apiKey, clientSlug);
    claims = {
      ...claims,
      workspace_id: claims.workspace_id ?? ctx.workspace_id,
      project_id: claims.project_id ?? ctx.project_id,
    };
    userId = ctx.user_id;
  }

  const email = await fetchAccountEmail(baseUrl, apiKey, clientSlug);

  // Workspace có thật nhưng chưa có project nào (case "Personal" workspace mới) - tự tạo 1 project
  // tên "test-sdk" 1 lần duy nhất, các lần chạy sau tự thấy lại đúng project này.
  if (claims.workspace_id && !claims.project_id) {
    claims = {
      ...claims,
      project_id: await createProject(baseUrl, apiKey, clientSlug, claims.workspace_id),
    };
  }

  const res = await fetch(`${baseUrl}/plugins/test/mint-cap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      ...(clientSlug ? { "x-client-slug": clientSlug } : {}),
    },
    body: JSON.stringify(claims),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`mint-cap failed: HTTP ${res.status} ${text}`);
  }

  const { cap, client, secret } = (await res.json()) as { cap: string; client: string; secret: string };
  configureTransport({ endpoint: sdkEndpoint, secret });
  return { cap, client, workspace_id: claims.workspace_id, project_id: claims.project_id, user_id: userId, email };
}
