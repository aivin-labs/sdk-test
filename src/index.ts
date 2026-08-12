import { SDKClient, session, withMockSDK } from "@aivin-labs/sdk";
import { mintCap } from "./helpers/mintCap";
import { printReport } from "./helpers/report";
import { testAi } from "./tests/ai.test";
import { testModels } from "./tests/models.test";
import { testStore } from "./tests/store.test";
import { testRedis } from "./tests/redis.test";
import { testMongo } from "./tests/mongo.test";
import { testKnowledge } from "./tests/knowledge.test";
import { testVector } from "./tests/vector.test";
import { testUsage } from "./tests/usage.test";
import { testDatasource } from "./tests/datasource.test";
import { testCausality } from "./tests/causality.test";
import { testAttachment } from "./tests/attachment.test";
import { testWorkspace } from "./tests/workspace.test";
import { testAgent } from "./tests/agent.test";
import { testBrowser } from "./tests/browser.test";
import { testProject } from "./tests/project.test";
import { testTable } from "./tests/table.test";
import { testTask } from "./tests/task.test";
import { testMessage } from "./tests/message.test";
import { testSession } from "./tests/session.test";
import { testRealtime } from "./tests/realtime.test";
import { testQueue } from "./tests/queue.test";
import { testNotification } from "./tests/notification.test";
import { testResource } from "./tests/resource.test";
import { testSetting } from "./tests/setting.test";
import { testAutomation } from "./tests/automation.test";
import { testCode } from "./tests/code.test";
import { testFile } from "./tests/file.test";

async function main() {
  // mintCap() wires the endpoint/secret straight into the SDK's transport (configureTransport) -
  // no process.env involved, so nothing here needs to touch it.
  const { cap, client, workspace_id, project_id, user_id, email } = await mintCap({ plugin_id: "test-sdk" });

  // `user_id` (workspace.creator_uid - chính chủ tài khoản API_KEY đang dùng) cho `ctx.user` để
  // các handler đọc thẳng `ctx.user.id`/`ctx.user.client` không null-check (vd DatastoreSDK's
  // createTable) không throw TypeError thô vì thiếu context.user hoàn toàn.
  const sdk = new SDKClient(
    {
      client,
      user: user_id ? ({ id: user_id, client } as any) : (undefined as any),
      workspace: undefined as any,
      session: undefined as any,
    },
    { cap },
  );

  console.log(
    `[test-sdk] client=${client} cap=${cap.slice(0, 8)}... workspace_id=${workspace_id ?? "(none)"} project_id=${project_id ?? "(none)"} user_id=${user_id ?? "(none)"}`,
  );

  // withMockSDK is really just `invocationStorage.run(sdk, fn)` - "Mock" in the name is about its
  // usual unit-test callers, not a requirement; binding a REAL SDKClient here is exactly what
  // PluginServer does for a real invocation. Lets every test file below use the documented
  // `import { ai } from "@aivin-labs/sdk"` style instead of threading `sdk` through every function.
  await withMockSDK(sdk, async () => {
    // 1 session test CỐ ĐỊNH, tái sử dụng giữa các lần chạy (session.newSession tự "tìm thấy thì
    // update, chưa có thì tạo mới" - xem session.test.ts) - dùng chung cho testSession/testMessage
    // để cả 2 namespace test được thật thay vì skip toàn bộ vì thiếu session_id.
    let sessionId: string | undefined;
    try {
      const created = await session.newSession({ id: "test-sdk-probe-session", workspace_id });
      sessionId = (created as any)?.id ?? (created as any)?._id ?? "test-sdk-probe-session";
    } catch (e: any) {
      console.error(`[test-sdk] setup session.newSession failed (session/message tests sẽ skip nhiều hơn): ${e?.message || e}`);
    }

    await testAi();
    await testModels();
    await testStore();
    await testRedis();
    await testMongo();
    await testKnowledge();
    await testVector();
    await testUsage();
    await testDatasource();
    await testCausality();
    await testAttachment();
    await testWorkspace(workspace_id);
    await testAgent();
    await testBrowser();
    await testProject(workspace_id);
    await testTable(workspace_id, project_id);
    await testTask(workspace_id);
    await testMessage(sessionId);
    await testSession(sessionId, workspace_id);
    await testRealtime();
    await testQueue();
    await testNotification(user_id, email);
    await testResource();
    await testSetting();
    await testAutomation(workspace_id);
    await testCode();
    await testFile();
  });

  const ok = printReport();
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error("[test-sdk] FATAL:", e);
  process.exit(1);
});
