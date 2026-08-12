import { SDKClient, ai, withMockSDK } from "@aivin-labs/sdk";
import { mintCap } from "./helpers/mintCap";

async function main() {
  const { cap, client } = await mintCap({ plugin_id: "test-sdk" });

  const sdk = new SDKClient(
    { client, user: undefined as any, workspace: undefined as any, session: undefined as any },
    { cap },
  );

  await withMockSDK(sdk, async () => {
    const models = await ai.getModels("openllm");
    console.log(`[test-sdk] openllm models (${Array.isArray(models) ? models.length : "?"}):`);
    console.log(JSON.stringify(models, null, 2));
  });

  process.exit(0);
}

main().catch((e) => {
  console.error("[test-sdk] FATAL:", e);
  process.exit(1);
});
