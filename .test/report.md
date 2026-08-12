# test-sdk report

Run: 2026-08-12T07:13:36.375Z
Duration: 5m15.0s

**279 PASS, 4 FAIL, 21 SKIP**

| Namespace | Method | Outcome | Time | Detail |
|---|---|---|---|---|
| ai | prompt | ✅ PASS | 65ms | Ok |
| ai | promptStream | ✅ PASS | 65ms | {"chunkCount":1,"textLength":9,"preview":"1 2 3 4 5"} |
| ai | getEmbedding | ✅ PASS | 132ms | {"0":-0.04829481616616249,"1":0.01439779531210661,"2":-0.055122435092926025,"3":-0.023896675556898117,"4":-0.028757017105817795,"5":-0.035912517458200 |
| ai | getEmbeddings | ✅ PASS | 157ms | array(2) |
| ai | rerank | ✅ PASS | 60ms | array(2) |
| ai | getModels | ✅ PASS | 67ms | array(0) |
| ai | calculateTokens | ✅ PASS | 60ms | null/undefined |
| ai | ocr | ✅ PASS | 64ms | [AIEngine] OCR driver not configured |
| ai | image | ✅ PASS | 86ms | [AIEngine.image] fal/flux-1.1-pro does not support image generation |
| ai | video | ✅ PASS | 81ms | [AIEngine.video] kling/kling-v2-master does not support video generation |
| ai | prompt (empty string) | ✅ PASS | 58ms | [AIEngine] prompt: request/quest is required |
| ai | prompt (message array) | ✅ PASS | 74ms | No driver found for provider vllm |
| ai | prompt (huge input ~20k chars) | ✅ PASS | 71ms | The text appears to be filler content ("lorem ipsum") without any meaningful information. Therefore, a summary is not possible as there are no key poi |
| ai | prompt (schema/structured output) | ✅ PASS | 62ms | {"name":"An","age":30} |
| ai | prompt (max_tokens=1, temperature=0) | ✅ PASS | 63ms | Once |
| ai | promptStream (empty string) | ✅ PASS | 60ms | [AIEngine] prompt: request/quest is required |
| ai | getEmbedding (empty string) | ✅ PASS | 59ms | [AIEngine] getEmbedding: data is required |
| ai | getEmbeddings (empty array) | ✅ PASS | 59ms | array(0) |
| ai | rerank (empty docs) | ✅ PASS | 58ms | array(0) |
| ai | getModels (unknown provider) | ✅ PASS | 59ms | array(0) |
| ai | calculateTokens (empty text) | ✅ PASS | 59ms | null/undefined |
| ai | calculateTokens (missing text field) | ✅ PASS | 61ms | null/undefined |
| ai | ocr (malformed base64 payload) | ✅ PASS | 60ms | [AIEngine] OCR driver not configured |
| ai | image (invalid media_tier) | ✅ PASS | 64ms | [AIEngine.image] fal/flux-1.1-pro does not support image generation |
| ai | prompt (5x concurrent) | ✅ PASS | 71ms | {"ok":5} |
| ai | prompt (instructions actually enforced) | ✅ PASS | 683ms | {"text":"BANANA"} |
| ai | prompt (temperature out of valid range) | ✅ PASS | 401ms | ``` OK ``` |
| ai | prompt (negative max_tokens) | ✅ PASS | 204ms | Ok |
| ai | prompt (adversarial unicode: ZWJ/RTL-override/stacked combining marks) | ✅ PASS | 776ms | The provided string is a combination of various Unicode characters and file names. Here's the breakdown:  1. **"é́́́́":** This represents an 'e' with |
| ai | prompt (temperature = NaN) | ✅ PASS | 75ms | Ok |
| ai | prompt (max_tokens = Infinity) | ✅ PASS | 94ms | Ok |
| ai | prompt (whitespace-only string) | ✅ PASS | 58ms | It seems like you've provided placeholder tags `<user_input>` without any actual content. Could you please provide more details so I can assist you be |
| ai | prompt (lone UTF-16 surrogate) | ✅ PASS | 60ms | ### Test SDK Probe with Lone Surrogate: "�" No Pair  The input you provided mentions |
| ai | prompt (15x concurrent) | ✅ PASS | 3083ms | {"ok":15} |
| models | xhard/openllm:qwen3.7-max | ✅ PASS | 68ms | No driver found for provider openllm |
| models | xhard/openllm:deepseek-v4-pro | ✅ PASS | 91ms | No driver found for provider openllm |
| models | xhard/claude:claude-sonnet-4.6 | ✅ PASS | 63ms | No driver found for provider claude |
| models | xhard/gemini:gemini-3.5-pro | ✅ PASS | 62ms | No driver found for provider gemini |
| models | xhard/openai:gpt-5.5 | ✅ PASS | 76ms | No driver found for provider openai |
| models | xhard/openai:o3-pro | ✅ PASS | 61ms | No driver found for provider openai |
| models | xhard/claude:claude-opus-4.8 | ✅ PASS | 61ms | No driver found for provider claude |
| models | xhard/gemini:gemini-3.5-deep-think | ✅ PASS | 70ms | No driver found for provider gemini |
| models | medium/openllm:qwen3.7-plus | ✅ PASS | 60ms | No driver found for provider openllm |
| models | medium/claude:claude-haiku-4.5 | ✅ PASS | 61ms | No driver found for provider claude |
| models | medium/gemini:gemini-3.5-flash | ✅ PASS | 62ms | No driver found for provider gemini |
| models | medium/openai:gpt-5.5-mini | ✅ PASS | 63ms | No driver found for provider openai |
| models | light/openllm:qwen-turbo | ✅ PASS | 64ms | No driver found for provider openllm |
| models | nano/vllm:Qwen/Qwen2.5-3B-Instruct-AWQ | ✅ PASS | 58ms | No driver found for provider vllm |
| models | code/openllm:qwen3-coder-plus | ✅ PASS | 62ms | No driver found for provider openllm |
| models | vl/openllm:qwen-vl-plus | ✅ PASS | 58ms | No driver found for provider openllm |
| models | vl/openllm:qwen-vl-max | ✅ PASS | 64ms | No driver found for provider openllm |
| models | embedding/BAAI/bge-m3 | ⏭️ SKIP | 0ms | already covered as the default embedding model in ai.test.ts (getEmbedding/getEmbeddings) — only 1 model configured for this tier, nothing extra to probe |
| models | rerank/BAAI/bge-reranker-v2-m3 | ⏭️ SKIP | 0ms | AISDK.ts's register('rerank', ...) doesn't forward params.opts to AIEngine.rerank — model can't be overridden through the SDK, and only 1 model is configured anyway (already covered in ai.test.ts) |
| models | realtime/* | ⏭️ SKIP | 0ms | WebSocket voice session, not a fit for ai.prompt's simple request/response round-trip |
| models | tts/*, stt/* | ⏭️ SKIP | 0ms | needs a real audio payload to decode/produce meaningfully — no safe fake audio like OCR's 1x1 PNG, and not the focus of this 'which LLM models work' probe |
| store | set | ✅ PASS | 58ms | App Exception |
| store | get | ✅ PASS | 62ms | get returned null for the key just set (probe-1786518510513) |
| store | query | ✅ PASS | 60ms | array(0) |
| store | count | ✅ PASS | 61ms | 0 |
| store | search | ✅ PASS | 61ms | array(0) |
| store | del | ✅ PASS | 58ms | App Exception |
| store | get (deleted/nonexistent key) | ✅ PASS | 59ms | {"row":null} |
| store | del (nonexistent key) | ✅ PASS | 64ms | App Exception |
| store | set (overwrite same key) | ✅ PASS | 58ms | App Exception |
| store | set+get (key with special characters) | ✅ PASS | 62ms | App Exception |
| store | query (filter matches nothing) | ✅ PASS | 61ms | array(0) |
| store | set+get (prototype pollution attempt) | ✅ PASS | 67ms | App Exception |
| store | set (circular reference value) | ✅ PASS | 1ms | Converting circular structure to JSON     --> starting at object with constructor 'Object'     --- property 'self' closes the circle |
| redis | set | ✅ PASS | 57ms | OK |
| redis | get | ✅ PASS | 58ms | 1 |
| redis | incr | ✅ PASS | 57ms | 2 |
| redis | exists | ✅ PASS | 58ms | 1 |
| redis | del | ✅ PASS | 58ms | 1 |
| redis | get (deleted/nonexistent key) | ✅ PASS | 61ms | {"v":null} |
| redis | del (nonexistent key) | ✅ PASS | 58ms | 1 |
| redis | exists (nonexistent key) | ✅ PASS | 59ms | 0 |
| redis | incr (non-numeric value) | ✅ PASS | 176ms | ERR value is not an integer or out of range |
| redis | incr (near Number.MAX_SAFE_INTEGER) | ✅ PASS | 173ms | 9007199254740990 |
| redis | setex (seconds=0) | ✅ PASS | 123ms | ERR invalid expire time in 'set' command |
| redis | setex (negative seconds) | ✅ PASS | 123ms | ERR invalid expire time in 'set' command |
| redis | incrby (NaN increment) | ✅ PASS | 127ms | 1 |
| redis | incrby (Infinity increment) | ✅ PASS | 122ms | 1 |
| redis | decrby (non-integer float) | ✅ PASS | 171ms | ERR value is not an integer or out of range |
| redis | hset | ✅ PASS | 59ms | 1 |
| redis | hget | ✅ PASS | 64ms | value1 |
| redis | hset (second field) | ✅ PASS | 66ms | 1 |
| redis | hgetall | ✅ PASS | 63ms | {"field1":"value1","field2":"value2"} |
| redis | hget (nonexistent field) | ✅ PASS | 59ms | {"v":null} |
| redis | hdel | ✅ PASS | 68ms | 1 |
| redis | hset (prototype pollution via field name) | ✅ PASS | 62ms | {"ok":true} |
| redis | keys (own key appears under matching pattern) | ✅ PASS | 216ms | {"found":1} |
| redis | keys (wildcard '*', sanity check) | ✅ PASS | 122ms | {"count":0} |
| mongo | create | ✅ PASS | 71ms | {"marker":"probe-1786518513568","n":42} |
| mongo | findOne | ✅ PASS | 62ms | {"marker":"probe-1786518513568","n":42} |
| mongo | find | ✅ PASS | 57ms | array(1) |
| mongo | countDocuments | ✅ PASS | 62ms | 1 |
| mongo | updateOne | ✅ PASS | 58ms | {"modifiedCount":1,"matchedCount":1,"upsertedId":null} |
| mongo | updateOne (filter matches nothing) | ✅ PASS | 62ms | {"modifiedCount":0,"matchedCount":0,"upsertedId":null} |
| mongo | findOne (filter matches nothing) | ✅ PASS | 61ms | {"doc":null} |
| mongo | deleteOne | ✅ PASS | 59ms | {"deletedCount":1} |
| mongo | deleteOne (already deleted) | ✅ PASS | 58ms | {"deletedCount":0} |
| mongo | create (prototype pollution attempt) | ✅ PASS | 121ms | {"marker":"proto-probe-1786518514118","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}} |
| mongo | create+findOne (operator-shaped value, as literal data) | ✅ PASS | 184ms | {"marker":"op-value-probe-1786518514239","payload":{"$gt":"","$where":"this is data, not a query operator"}} |
| mongo | find ($in operator) | ✅ PASS | 448ms | {"matched":2} |
| knowledge | search | ✅ PASS | 117ms | array(0) |
| knowledge | search (empty query) | ✅ PASS | 59ms | array(0) |
| knowledge | search (limit=0) | ✅ PASS | 105ms | array(0) |
| vector | index | ✅ PASS | 56ms | App Exception |
| vector | index (empty content) | ✅ PASS | 60ms | App Exception |
| vector | search | ✅ PASS | 105ms | array(0) |
| vector | search (empty query) | ✅ PASS | 59ms | array(0) |
| vector | search (rerank) | ✅ PASS | 116ms | array(0) |
| vector | searchBatch | ✅ PASS | 132ms | array(0) |
| vector | get | ✅ PASS | 69ms | array(0) |
| vector | get (nonexistent id) | ✅ PASS | 59ms | array(0) |
| vector | searchBatch (one empty query in batch) | ✅ PASS | 140ms | array(0) |
| vector | matchBatch | ✅ PASS | 211ms | array(2) |
| vector | index (re-index same id, verify latest content wins) | ✅ PASS | 63ms | App Exception |
| vector | index (prototype pollution via metadata) | ✅ PASS | 61ms | App Exception |
| vector | index (5x concurrent, same id) | ✅ PASS | 139ms | App Exception |
| vector | delete | ✅ PASS | 63ms | {"deleted":0} |
| vector | requestCollection | ✅ PASS | 60ms | {"client":"wes_aivin_vn","plugin_id":"test-sdk","requested_by":"6a7b084ef26be74d655f29af","workspace_id":"6a7b0853f16f8c62bc49955d","label":"test-sdk- |
| vector | getCollectionStatus | ✅ PASS | 65ms | {"client":"wes_aivin_vn","plugin_id":"test-sdk","requested_by":"6a7b084ef26be74d655f29af","workspace_id":"6a7b0853f16f8c62bc49955d","label":"test-sdk- |
| vector | similarity | ✅ PASS | 0ms | {"score":1} |
| vector | normalize | ✅ PASS | 1ms | {"norm":1.000000023841858} |
| usage | checkBalance | ✅ PASS | 58ms | [usage.checkBalance] missing usage_info in context |
| usage | getUsage | ✅ PASS | 65ms | Cannot read properties of null (reading 'owner_id') |
| datasource | getSources | ✅ PASS | 58ms | App Exception |
| datasource | getDomains | ✅ PASS | 61ms | array(0) |
| datasource | getSources (nonexistent source_id filter) | ✅ PASS | 62ms | App Exception |
| datasource | learn | ⏭️ SKIP | 0ms | triggers a real learning job (async, resource-intensive) on a real data source — needs a real source_id, won't guess |
| causality | think | ✅ PASS | 148ms | array(0) |
| causality | search | ✅ PASS | 153ms | array(0) |
| causality | search (empty query) | ✅ PASS | 5649ms | array(0) |
| causality | absorb (empty array) | ✅ PASS | 60ms | array(0) |
| causality | absorb | ✅ PASS | 60ms | array(0) |
| causality | absorb (prototype pollution attempt) | ✅ PASS | 6060ms | array(1) |
| causality | think (prompt injection-shaped query) | ✅ PASS | 114ms | array(2) |
| attachment | search | ✅ PASS | 56ms | App Exception |
| attachment | search (empty query) | ✅ PASS | 58ms | App Exception |
| attachment | search (limit=0) | ✅ PASS | 55ms | App Exception |
| attachment | upload | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | deepResearch | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | evaluate | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | queryTabularData | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | queryMediaTimestamp | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | extract | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| workspace | get | ✅ PASS | 58ms | {"creator_uid":"6a7b084ef26be74d655f29af","client":"wes_aivin_vn","name":"Personal","agents":[{"response_config":{"tone":[],"format":[]},"behavior":{" |
| workspace | getByIds | ✅ PASS | 58ms | array(1) |
| workspace | getByIds (empty array) | ✅ PASS | 56ms | array(0) |
| workspace | getMembers | ✅ PASS | 57ms | array(1) |
| workspace | checkPermission | ✅ PASS | 58ms | true |
| workspace | checkPermission (invalid permission) | ✅ PASS | 58ms | true |
| workspace | getPluginConfig | ✅ PASS | 62ms | {"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}} |
| workspace | searchAgents | ✅ PASS | 122ms | array(0) |
| workspace | searchAgents (empty query) | ✅ PASS | 66ms | array(0) |
| workspace | updatePlugin | ✅ PASS | 69ms | {"creator_uid":"6a7b084ef26be74d655f29af","client":"wes_aivin_vn","name":"Personal","agents":[{"response_config":{"tone":[],"format":[]},"behavior":{" |
| workspace | updatePlugin (prototype pollution via arguments) | ✅ PASS | 64ms | {"creator_uid":"6a7b084ef26be74d655f29af","client":"wes_aivin_vn","name":"Personal","agents":[{"response_config":{"tone":[],"format":[]},"behavior":{" |
| agent | get | ✅ PASS | 57ms | [agent.getAIStaff] id is required (không có agent trong context) |
| agent | status | ✅ PASS | 56ms | {"status":"unlinked"} |
| agent | reply | ✅ PASS | 61ms | Ok |
| agent | tell | ✅ PASS | 67ms | {"success":false} |
| agent | resolveHil | ✅ PASS | 59ms | [MessageSDK] missing client in context |
| agent | reply (empty string) | ✅ PASS | 61ms | [agent.reply] quest is required |
| agent | resolveHil (missing session_id) | ✅ PASS | 64ms | [agent.resolveHil] session_id and reply_id are required |
| agent | resolveHil (prototype pollution via payload) | ✅ PASS | 58ms | [MessageSDK] missing client in context |
| agent | cancel | ⏭️ SKIP | 0ms | real side effect on a real user's chat/session (cancels a live response, triggers routing to another agent...), no safe degrade path when context is missing |
| agent | delegate | ⏭️ SKIP | 0ms | real side effect on a real user's chat/session (cancels a live response, triggers routing to another agent...), no safe degrade path when context is missing |
| agent | processMessage | ⏭️ SKIP | 0ms | real side effect on a real user's chat/session (cancels a live response, triggers routing to another agent...), no safe degrade path when context is missing |
| browser | cancel | ✅ PASS | 59ms | {"success":true,"session_id":"wes_aivin_vn"} |
| browser | run | ✅ PASS | 125050ms | gRPC invoke 'browser.run' failed: 2 UNKNOWN: Received HTTP status code 524 |
| project | search | ✅ PASS | 4560ms | array(0) |
| project | get | ✅ PASS | 138ms | App Exception |
| project | search (empty keyword) | ✅ PASS | 63ms | Project search failed: [AIEngine] getEmbedding: data is required |
| project | search (regex/operator-injection-shaped keyword) | ✅ PASS | 105ms | array(0) |
| table | getAllTables | ✅ PASS | 59ms | array(1) |
| table | createTable | ✅ PASS | 186ms | {"_id":"6a7c1c833b81126aced4876d","table_id":"tbl_mspr301e_yplhh","name":"test_sdk_probe_table_1786518660573","description":"Auto-created by test-sdk  |
| table | getTable | ✅ PASS | 62ms | {"table_id":"tbl_mspr301e_yplhh","name":"test_sdk_probe_table_1786518660573","description":"Auto-created by test-sdk to verify the round-trip, deleted |
| table | updateTable | ✅ PASS | 120ms | {"success":true,"message":"Table updated"} |
| table | getTable (nonexistent table_id) | ✅ PASS | 57ms | App Exception |
| table | addRow | ✅ PASS | 62ms | {"table_id":"6a7c1c833b81126aced4876d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | getRow | ✅ PASS | 146ms | {"_id":"6a7c1c833b81126aced4878e","table_id":"6a7c1c833b81126aced4876d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca0368 |
| table | updateRow | ✅ PASS | 64ms | {"_id":"6a7c1c833b81126aced4878e","table_id":"6a7c1c833b81126aced4876d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca0368 |
| table | getRow (nonexistent row_id) | ✅ PASS | 66ms | Cast to ObjectId failed for value "test-sdk-nonexistent-row-id" (type string) at path "_id" for model "dynamic_row" |
| table | addRow (schema-mismatched data) | ✅ PASS | 64ms | {"table_id":"6a7c1c833b81126aced4876d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | addRow (prototype pollution attempt) | ✅ PASS | 63ms | {"table_id":"6a7c1c833b81126aced4876d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | addRow (NoSQL-operator-shaped value, as literal data) | ✅ PASS | 59ms | {"table_id":"6a7c1c833b81126aced4876d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | addRow (deeply nested data, 60 levels) | ✅ PASS | 61ms | {"table_id":"6a7c1c833b81126aced4876d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | getRows | ✅ PASS | 96ms | array(5) |
| table | getRows (limit=0) | ✅ PASS | 1ms | [table.getRows] invalid params - limit: Too small: expected number to be >0 |
| table | getRows (limit=Number.MAX_SAFE_INTEGER) | ✅ PASS | 62ms | array(5) |
| table | bulkAddRows | ✅ PASS | 88ms | array(2) |
| table | bulkAddRows (empty rows array) | ✅ PASS | 1ms | [table.bulkAddRows] invalid params - rows: rows must have at least one entry |
| table | bulkAddRows (large batch, 100 rows) | ✅ PASS | 169ms | {"requested":100,"inserted":100} |
| table | batchUpdateRows (filter matches nothing) | ✅ PASS | 65ms | {"modifiedCount":0} |
| table | batchUpdateRows | ✅ PASS | 68ms | {"modifiedCount":1,"snapshot_id":"ds:snap:1786518661151:tcrhmt7"} |
| table | rollback | ✅ PASS | 66ms | {"restored":1,"reinserted":0,"removed":0,"failed":0} |
| table | batchDeleteRows | ✅ PASS | 69ms | {"success":true,"deletedCount":2,"snapshot_id":"ds:snap:1786518661295:3r6z58g"} |
| table | searchSemantic | ✅ PASS | 116ms | array(0) |
| table | searchSemantic (empty query) | ✅ PASS | 0ms | [table.searchSemantic] invalid params - query: query is required |
| table | smartQuery | ❌ FAIL | 27723ms | gRPC invoke 'table.smartQuery' failed: 4 DEADLINE_EXCEEDED: Deadline exceeded |
| table | batchUpdateByAI | ❌ FAIL | 27757ms | gRPC invoke 'table.batchUpdateByAI' failed: 4 DEADLINE_EXCEEDED: Deadline exceeded |
| table | getTableStats | ✅ PASS | 70ms | {"count":0,"last_updated_at":null,"top_sources":[],"schema_coverage":{},"warning_threshold":750,"hard_limit":1000} |
| table | countRows | ✅ PASS | 68ms | {"count":5,"warning_threshold":750,"hard_limit":1000} |
| table | exportTable | ✅ PASS | 62ms | array(0) |
| table | deduplicateTable | ✅ PASS | 66ms | {"removed":0,"merged":0,"groups_found":0} |
| table | backfillColumn | ✅ PASS | 61ms | {"updated":0} |
| table | formatRowsForContext | ✅ PASS | 61ms | {"context":"Table: test_sdk_probe_table_1786518660573\n","rows_included":0,"estimated_tokens":11,"total_rows":0} |
| table | deleteRow | ✅ PASS | 70ms | {"success":true,"snapshot_id":"ds:snap:1786518717423:h10aqin"} |
| table | ensureTable | ⏭️ SKIP | 0ms | AI picks/creates a table by purpose on its own, no control over which table gets touched |
| table | deleteTable | ✅ PASS | 80ms | {"success":true} |
| table | deleteTable (already deleted) | ✅ PASS | 64ms | App Exception |
| task | create | ❌ FAIL | 27728ms | gRPC invoke 'task.createTask' failed: 4 DEADLINE_EXCEEDED: Deadline exceeded |
| task | create (empty title) | ✅ PASS | 74ms | {"title":"","client":"wes_aivin_vn","status":"processing","handler_history":[{"member_id":"6a7b084ef26be74d655f29af","member_name":"Phùng Đức Thắng"," |
| task | listMine | ✅ PASS | 68ms | array(25) |
| task | listMine (limit=0) | ✅ PASS | 68ms | limit=0 should return an empty array, got 25 tasks |
| task | create (5x concurrent) | ❌ FAIL | 27776ms | gRPC invoke 'task.createTask' failed: 4 DEADLINE_EXCEEDED: Deadline exceeded |
| message | getRecent | ✅ PASS | 67ms | array(3) |
| message | save | ✅ PASS | 67ms | {"client":"wes_aivin_vn","id":"6a7c1cf53b81126aced48869","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save (empty text) | ✅ PASS | 65ms | {"client":"wes_aivin_vn","id":"6a7c1cf53b81126aced4886d","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save (invalid role) | ✅ PASS | 64ms | {"client":"wes_aivin_vn","id":"6a7c1cf53b81126aced48870","context_attachments":[],"files":[],"images":[],"role":"this-is-not-a-role","session_id":"tes |
| message | save (valid role, wrong case: User) | ✅ PASS | 73ms | {"id":"6a7c1cf53b81126aced48874","client":"wes_aivin_vn","context_attachments":[],"files":[],"images":[],"role":"User","session_id":"test-sdk-probe-se |
| message | save (huge text ~15k chars) | ✅ PASS | 71ms | {"client":"wes_aivin_vn","id":"6a7c1cf53b81126aced48878","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save+getById (injection-shaped content, round-trip integrity) | ✅ PASS | 131ms | {"client":"wes_aivin_vn","id":"6a7c1cf53b81126aced4887b","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save (10x concurrent, same session) | ✅ PASS | 231ms | {"landed":10} |
| message | getList | ✅ PASS | 65ms | array(5) |
| message | search | ✅ PASS | 260ms | array(50) |
| message | search (empty query) | ✅ PASS | 90ms | array(50) |
| message | getList (negative limit) | ✅ PASS | 62ms | array(1) |
| message | init | ✅ PASS | 59ms | {"client":"wes_aivin_vn","id":"6a7c1cf63b81126aced488af","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | getById (nonexistent id) | ✅ PASS | 67ms | App Exception |
| message | getById | ✅ PASS | 62ms | {"client":"wes_aivin_vn","id":"6a7c1cf63b81126aced4888a","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | update | ✅ PASS | 88ms | App Exception |
| message | update (empty text) | ✅ PASS | 59ms | App Exception |
| message | update (prototype pollution via free-form fields) | ✅ PASS | 59ms | App Exception |
| message | stream | ⏭️ SKIP | 0ms | MessageService.streamResponse reads ctx.session.id, not params.session_id, to attach the message - our ctx.session is always undefined, so this would persist an orphaned message with no session instead of landing in the test session |
| session | getList | ✅ PASS | 62ms | array(0) |
| session | get | ✅ PASS | 62ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | get (nonexistent id) | ✅ PASS | 57ms | null/undefined |
| session | updateStatus (invalid status value) | ✅ PASS | 59ms | null/undefined |
| session | update (empty payload) | ✅ PASS | 61ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | updateStatus (valid value, wrong case: IDLE) | ✅ PASS | 116ms | {"persistedStatus":"IDLE"} |
| session | markAsSeen | ✅ PASS | 67ms | null/undefined |
| session | update | ✅ PASS | 62ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | update (prototype pollution via free-form fields) | ✅ PASS | 61ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | updateStatus | ✅ PASS | 59ms | null/undefined |
| session | updateAgent | ✅ PASS | 61ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | newSession | ✅ PASS | 67ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | create | ✅ PASS | 60ms | App Exception |
| session | updateStatus (3x concurrent, same session) | ✅ PASS | 62ms | {"ok":3} |
| realtime | publish | ✅ PASS | 61ms | {"success":true,"delivered_to":"6a7b0853f16f8c62bc49955d"} |
| realtime | publish (target=user) | ✅ PASS | 59ms | {"success":true,"delivered_to":"6a7b084ef26be74d655f29af"} |
| realtime | publish (empty event name) | ✅ PASS | 58ms | App Exception |
| realtime | publish (prototype pollution via data) | ✅ PASS | 58ms | {"success":true,"delivered_to":"6a7b0853f16f8c62bc49955d"} |
| queue | scheduleJob | ⏭️ SKIP | 0ms | schedules this same plugin to run again, with no way to cancel a scheduled job — test-sdk isn't a real running plugin so the job would be orphaned forever |
| notification | subscribeTopic | ✅ PASS | 57ms | null/undefined |
| notification | unsubscribeTopic | ✅ PASS | 60ms | null/undefined |
| notification | unsubscribeTopic (never subscribed) | ✅ PASS | 60ms | null/undefined |
| notification | push | ✅ PASS | 67ms | null/undefined |
| notification | push (prototype pollution via free-form fields) | ✅ PASS | 62ms | null/undefined |
| notification | push (receiver_id - the field the real handler actually reads) | ✅ PASS | 63ms | null/undefined |
| notification | push (receiver_ids batch) | ✅ PASS | 64ms | null/undefined |
| notification | push (channels + priority routing) | ✅ PASS | 62ms | null/undefined |
| notification | push (channels: ['email'], priority: 'urgent' — the beautiful MailHelper template, AI-generated from prompt) | ✅ PASS | 18160ms | null/undefined |
| notification | push (messageIsHtml) | ✅ PASS | 65ms | null/undefined |
| notification | push (title_key/message_key/vars i18n) | ✅ PASS | 69ms | null/undefined |
| notification | subscribeTopic (setup for push topic-broadcast probe) | ✅ PASS | 57ms | null/undefined |
| notification | push (topic broadcast — no user_id/receiver_id, audience = topic subscribers) | ✅ PASS | 62ms | null/undefined |
| notification | unsubscribeTopic (cleanup push topic-broadcast probe) | ✅ PASS | 60ms | null/undefined |
| notification | sendMail | ✅ PASS | 7103ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| notification | sendMail (HTML/script content in body) | ✅ PASS | 2020ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| notification | sendMail (CRLF header injection in subject) | ✅ PASS | 2016ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| notification | sendMail (CRLF injection in to) | ✅ PASS | 2191ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| resource | upload | ✅ PASS | 91ms | {"name":"test-sdk-probe.txt","mime":"text/plain","is_public":false,"temp":true,"client":"wes_aivin_vn","user_id":"6a7b084ef26be74d655f29af","workspace |
| resource | remove | ✅ PASS | 94ms | null/undefined |
| resource | remove (already removed) | ✅ PASS | 70ms | null/undefined |
| resource | remove (nonexistent url) | ✅ PASS | 60ms | App Exception |
| resource | upload (path traversal filename) | ✅ PASS | 88ms | {"name":"../../../../etc/test-sdk-probe-traversal.txt","mime":"text/plain","is_public":false,"temp":true,"client":"wes_aivin_vn","user_id":"6a7b084ef2 |
| resource | remove (path traversal probe cleanup) | ✅ PASS | 95ms | null/undefined |
| setting | get | ✅ PASS | 60ms | {"app_domain":"demo.aivin.vn","app_url":"https://demo.aivin.vn","app_logo":"https://i.ibb.co/WNfcd5sG/aivin-logo-removebg-preview.png","app_slogan":"N |
| setting | getMerchantConfig | ✅ PASS | 56ms | null/undefined |
| automation | getJobs | ✅ PASS | 59ms | array(0) |
| automation | getJobs (nonexistent workspace_id) | ✅ PASS | 58ms | App Exception |
| automation | createJob | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| automation | updateJob | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| automation | deleteJob | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| automation | executeById | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| code | executeLogic | ✅ PASS | 80ms | App Exception |
| code | executeLogic (logic throws) | ✅ PASS | 59ms | App Exception |
| code | executeLogic (missing logic field) | ✅ PASS | 62ms | App Exception |
| code | executeLogic (sandbox escape attempt) | ✅ PASS | 58ms | App Exception |
| code | executeLogic (prototype pollution via args) | ✅ PASS | 57ms | App Exception |
| file | list | ✅ PASS | 60ms | array(0) |
| file | search | ✅ PASS | 5361ms | array(0) |
| file | search (empty query) | ✅ PASS | 57ms | array(0) |
| file | get (nonexistent id) | ✅ PASS | 59ms | App Exception |
| file | create | ✅ PASS | 71ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"test-sdk-probe-1786518815860.txt","content":"Auto-created by test-sdk to ve |
| file | get | ✅ PASS | 65ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"test-sdk-probe-1786518815860.txt","content":"Auto-created by test-sdk to ve |
| file | del | ✅ PASS | 61ms | {"success":true,"message":"File deleted successfully"} |
| file | del (already deleted) | ✅ PASS | 60ms | App Exception |
| file | create (path traversal filename) | ✅ PASS | 61ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"../../../../etc/test-sdk-probe-traversal.txt","content":"path traversal pro |
| file | del (path traversal probe cleanup) | ✅ PASS | 67ms | {"success":true,"message":"File deleted successfully"} |
| file | create (prototype pollution attempt) | ✅ PASS | 59ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"proto-probe.txt","content":"proto probe","extension":"txt","creator_id":"6a |
| file | del (prototype pollution probe cleanup) | ✅ PASS | 63ms | {"success":true,"message":"File deleted successfully"} |
