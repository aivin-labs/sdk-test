import { SDKClient, browser, withMockSDK } from "@aivin-labs/sdk";
import { mintCap } from "./helpers/mintCap";

async function main() {
  const { cap, client } = await mintCap({ plugin_id: "test-sdk" });
  const sdk = new SDKClient(
    { client, user: undefined as any, workspace: undefined as any, session: undefined as any },
    { cap },
  );
  await withMockSDK(sdk, async () => {
    const r = await browser.cancel();
    console.log("cancel result:", JSON.stringify(r));
  });
  process.exit(0);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
