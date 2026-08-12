# test-sdk report

Run: 2026-08-12T13:01:56.705Z
Duration: 2m17.3s

**284 PASS, 0 FAIL, 22 SKIP (306 cases)**

## Summary by namespace

| Namespace | Cases | Pass | Fail | Skip |
|---|---|---|---|---|
| ai | 34 | 34 | 0 | 0 |
| models | 21 | 17 | 0 | 4 |
| store | 13 | 12 | 0 | 1 |
| redis | 24 | 24 | 0 | 0 |
| mongo | 12 | 12 | 0 | 0 |
| knowledge | 3 | 3 | 0 | 0 |
| vector | 18 | 18 | 0 | 0 |
| usage | 2 | 2 | 0 | 0 |
| datasource | 4 | 3 | 0 | 1 |
| causality | 7 | 7 | 0 | 0 |
| attachment | 9 | 3 | 0 | 6 |
| workspace | 11 | 11 | 0 | 0 |
| agent | 11 | 8 | 0 | 3 |
| browser | 2 | 2 | 0 | 0 |
| project | 4 | 4 | 0 | 0 |
| table | 37 | 36 | 0 | 1 |
| task | 7 | 7 | 0 | 0 |
| message | 19 | 18 | 0 | 1 |
| session | 14 | 14 | 0 | 0 |
| realtime | 4 | 4 | 0 | 0 |
| queue | 1 | 0 | 0 | 1 |
| notification | 18 | 18 | 0 | 0 |
| resource | 6 | 6 | 0 | 0 |
| setting | 2 | 2 | 0 | 0 |
| automation | 6 | 2 | 0 | 4 |
| code | 5 | 5 | 0 | 0 |
| file | 12 | 12 | 0 | 0 |

## Summary by namespace / function

| Namespace | Function | Cases | Pass | Fail | Skip |
|---|---|---|---|---|---|
| ai | prompt | 16 | 16 | 0 | 0 |
| ai | promptStream | 2 | 2 | 0 | 0 |
| ai | getEmbedding | 2 | 2 | 0 | 0 |
| ai | getEmbeddings | 2 | 2 | 0 | 0 |
| ai | rerank | 2 | 2 | 0 | 0 |
| ai | getModels | 2 | 2 | 0 | 0 |
| ai | calculateTokens | 3 | 3 | 0 | 0 |
| ai | ocr | 2 | 2 | 0 | 0 |
| ai | image | 2 | 2 | 0 | 0 |
| ai | video | 1 | 1 | 0 | 0 |
| models | xhard/openllm:qwen3.7-max | 1 | 1 | 0 | 0 |
| models | xhard/openllm:deepseek-v4-pro | 1 | 1 | 0 | 0 |
| models | xhard/claude:claude-sonnet-4.6 | 1 | 1 | 0 | 0 |
| models | xhard/gemini:gemini-3.5-pro | 1 | 1 | 0 | 0 |
| models | xhard/openai:gpt-5.5 | 1 | 1 | 0 | 0 |
| models | xhard/openai:o3-pro | 1 | 1 | 0 | 0 |
| models | xhard/claude:claude-opus-4.8 | 1 | 1 | 0 | 0 |
| models | xhard/gemini:gemini-3.5-deep-think | 1 | 1 | 0 | 0 |
| models | medium/openllm:qwen3.7-plus | 1 | 1 | 0 | 0 |
| models | medium/claude:claude-haiku-4.5 | 1 | 1 | 0 | 0 |
| models | medium/gemini:gemini-3.5-flash | 1 | 1 | 0 | 0 |
| models | medium/openai:gpt-5.5-mini | 1 | 1 | 0 | 0 |
| models | light/openllm:qwen-turbo | 1 | 1 | 0 | 0 |
| models | nano/vllm:Qwen/Qwen2.5-3B-Instruct-AWQ | 1 | 1 | 0 | 0 |
| models | code/openllm:qwen3-coder-plus | 1 | 1 | 0 | 0 |
| models | vl/openllm:qwen-vl-plus | 1 | 1 | 0 | 0 |
| models | vl/openllm:qwen-vl-max | 1 | 1 | 0 | 0 |
| models | embedding/BAAI/bge-m3 | 1 | 0 | 0 | 1 |
| models | rerank/BAAI/bge-reranker-v2-m3 | 1 | 0 | 0 | 1 |
| models | realtime/* | 1 | 0 | 0 | 1 |
| models | tts/*, stt/* | 1 | 0 | 0 | 1 |
| store | set | 3 | 3 | 0 | 0 |
| store | get | 2 | 1 | 0 | 1 |
| store | query | 2 | 2 | 0 | 0 |
| store | count | 1 | 1 | 0 | 0 |
| store | search | 1 | 1 | 0 | 0 |
| store | del | 2 | 2 | 0 | 0 |
| store | set+get | 2 | 2 | 0 | 0 |
| redis | set | 1 | 1 | 0 | 0 |
| redis | get | 2 | 2 | 0 | 0 |
| redis | incr | 3 | 3 | 0 | 0 |
| redis | exists | 2 | 2 | 0 | 0 |
| redis | del | 2 | 2 | 0 | 0 |
| redis | setex | 2 | 2 | 0 | 0 |
| redis | incrby | 2 | 2 | 0 | 0 |
| redis | decrby | 1 | 1 | 0 | 0 |
| redis | hset | 3 | 3 | 0 | 0 |
| redis | hget | 2 | 2 | 0 | 0 |
| redis | hgetall | 1 | 1 | 0 | 0 |
| redis | hdel | 1 | 1 | 0 | 0 |
| redis | keys | 2 | 2 | 0 | 0 |
| mongo | create | 2 | 2 | 0 | 0 |
| mongo | findOne | 2 | 2 | 0 | 0 |
| mongo | find | 2 | 2 | 0 | 0 |
| mongo | countDocuments | 1 | 1 | 0 | 0 |
| mongo | updateOne | 2 | 2 | 0 | 0 |
| mongo | deleteOne | 2 | 2 | 0 | 0 |
| mongo | create+findOne | 1 | 1 | 0 | 0 |
| knowledge | search | 3 | 3 | 0 | 0 |
| vector | index | 5 | 5 | 0 | 0 |
| vector | search | 3 | 3 | 0 | 0 |
| vector | searchBatch | 2 | 2 | 0 | 0 |
| vector | get | 2 | 2 | 0 | 0 |
| vector | matchBatch | 1 | 1 | 0 | 0 |
| vector | delete | 1 | 1 | 0 | 0 |
| vector | requestCollection | 1 | 1 | 0 | 0 |
| vector | getCollectionStatus | 1 | 1 | 0 | 0 |
| vector | similarity | 1 | 1 | 0 | 0 |
| vector | normalize | 1 | 1 | 0 | 0 |
| usage | checkBalance | 1 | 1 | 0 | 0 |
| usage | getUsage | 1 | 1 | 0 | 0 |
| datasource | getSources | 2 | 2 | 0 | 0 |
| datasource | getDomains | 1 | 1 | 0 | 0 |
| datasource | learn | 1 | 0 | 0 | 1 |
| causality | think | 2 | 2 | 0 | 0 |
| causality | search | 2 | 2 | 0 | 0 |
| causality | absorb | 3 | 3 | 0 | 0 |
| attachment | search | 3 | 3 | 0 | 0 |
| attachment | upload | 1 | 0 | 0 | 1 |
| attachment | deepResearch | 1 | 0 | 0 | 1 |
| attachment | evaluate | 1 | 0 | 0 | 1 |
| attachment | queryTabularData | 1 | 0 | 0 | 1 |
| attachment | queryMediaTimestamp | 1 | 0 | 0 | 1 |
| attachment | extract | 1 | 0 | 0 | 1 |
| workspace | get | 1 | 1 | 0 | 0 |
| workspace | getByIds | 2 | 2 | 0 | 0 |
| workspace | getMembers | 1 | 1 | 0 | 0 |
| workspace | checkPermission | 2 | 2 | 0 | 0 |
| workspace | getPluginConfig | 1 | 1 | 0 | 0 |
| workspace | searchAgents | 2 | 2 | 0 | 0 |
| workspace | updatePlugin | 2 | 2 | 0 | 0 |
| agent | get | 1 | 1 | 0 | 0 |
| agent | status | 1 | 1 | 0 | 0 |
| agent | reply | 2 | 2 | 0 | 0 |
| agent | tell | 1 | 1 | 0 | 0 |
| agent | resolveHil | 3 | 3 | 0 | 0 |
| agent | cancel | 1 | 0 | 0 | 1 |
| agent | delegate | 1 | 0 | 0 | 1 |
| agent | processMessage | 1 | 0 | 0 | 1 |
| browser | cancel | 1 | 1 | 0 | 0 |
| browser | run | 1 | 1 | 0 | 0 |
| project | search | 3 | 3 | 0 | 0 |
| project | get | 1 | 1 | 0 | 0 |
| table | getAllTables | 1 | 1 | 0 | 0 |
| table | createTable | 1 | 1 | 0 | 0 |
| table | getTable | 2 | 2 | 0 | 0 |
| table | updateTable | 1 | 1 | 0 | 0 |
| table | addRow | 5 | 5 | 0 | 0 |
| table | getRow | 2 | 2 | 0 | 0 |
| table | updateRow | 1 | 1 | 0 | 0 |
| table | getRows | 3 | 3 | 0 | 0 |
| table | bulkAddRows | 3 | 3 | 0 | 0 |
| table | batchUpdateRows | 2 | 2 | 0 | 0 |
| table | rollback | 1 | 1 | 0 | 0 |
| table | batchDeleteRows | 1 | 1 | 0 | 0 |
| table | searchSemantic | 2 | 2 | 0 | 0 |
| table | smartQuery | 1 | 1 | 0 | 0 |
| table | batchUpdateByAI | 1 | 1 | 0 | 0 |
| table | getTableStats | 1 | 1 | 0 | 0 |
| table | countRows | 1 | 1 | 0 | 0 |
| table | exportTable | 1 | 1 | 0 | 0 |
| table | deduplicateTable | 1 | 1 | 0 | 0 |
| table | backfillColumn | 1 | 1 | 0 | 0 |
| table | formatRowsForContext | 1 | 1 | 0 | 0 |
| table | deleteRow | 1 | 1 | 0 | 0 |
| table | ensureTable | 1 | 0 | 0 | 1 |
| table | deleteTable | 2 | 2 | 0 | 0 |
| task | create | 3 | 3 | 0 | 0 |
| task | listMine | 2 | 2 | 0 | 0 |
| task | delete | 2 | 2 | 0 | 0 |
| message | getRecent | 1 | 1 | 0 | 0 |
| message | save | 6 | 6 | 0 | 0 |
| message | save+getById | 1 | 1 | 0 | 0 |
| message | getList | 2 | 2 | 0 | 0 |
| message | search | 2 | 2 | 0 | 0 |
| message | init | 1 | 1 | 0 | 0 |
| message | getById | 2 | 2 | 0 | 0 |
| message | update | 3 | 3 | 0 | 0 |
| message | stream | 1 | 0 | 0 | 1 |
| session | getList | 1 | 1 | 0 | 0 |
| session | get | 2 | 2 | 0 | 0 |
| session | updateStatus | 4 | 4 | 0 | 0 |
| session | update | 3 | 3 | 0 | 0 |
| session | markAsSeen | 1 | 1 | 0 | 0 |
| session | updateAgent | 1 | 1 | 0 | 0 |
| session | newSession | 1 | 1 | 0 | 0 |
| session | create | 1 | 1 | 0 | 0 |
| realtime | publish | 4 | 4 | 0 | 0 |
| queue | scheduleJob | 1 | 0 | 0 | 1 |
| notification | subscribeTopic | 2 | 2 | 0 | 0 |
| notification | unsubscribeTopic | 3 | 3 | 0 | 0 |
| notification | push | 9 | 9 | 0 | 0 |
| notification | sendMail | 4 | 4 | 0 | 0 |
| resource | upload | 2 | 2 | 0 | 0 |
| resource | remove | 4 | 4 | 0 | 0 |
| setting | get | 1 | 1 | 0 | 0 |
| setting | getMerchantConfig | 1 | 1 | 0 | 0 |
| automation | getJobs | 2 | 2 | 0 | 0 |
| automation | createJob | 1 | 0 | 0 | 1 |
| automation | updateJob | 1 | 0 | 0 | 1 |
| automation | deleteJob | 1 | 0 | 0 | 1 |
| automation | executeById | 1 | 0 | 0 | 1 |
| code | executeLogic | 5 | 5 | 0 | 0 |
| file | list | 1 | 1 | 0 | 0 |
| file | search | 2 | 2 | 0 | 0 |
| file | get | 2 | 2 | 0 | 0 |
| file | create | 3 | 3 | 0 | 0 |
| file | del | 4 | 4 | 0 | 0 |

## Case detail

| Namespace | Method | Outcome | Time | Detail |
|---|---|---|---|---|
| ai | prompt | ✅ PASS | 691ms | Ok |
| ai | promptStream | ✅ PASS | 302ms | {"chunkCount":1,"textLength":9,"preview":"1 2 3 4 5"} |
| ai | getEmbedding | ✅ PASS | 75ms | {"0":-0.04829481616616249,"1":0.01439779531210661,"2":-0.055122435092926025,"3":-0.023896675556898117,"4":-0.028757017105817795,"5":-0.035912517458200 |
| ai | getEmbeddings | ✅ PASS | 93ms | array(2) |
| ai | rerank | ✅ PASS | 317ms | array(2) |
| ai | getModels | ✅ PASS | 61ms | array(0) |
| ai | calculateTokens | ✅ PASS | 59ms | null/undefined |
| ai | ocr | ✅ PASS | 109ms |  |
| ai | image | ✅ PASS | 84ms | [AIEngine.image] fal/flux-1.1-pro does not support image generation |
| ai | video | ✅ PASS | 81ms | [AIEngine.video] kling/kling-v2-master does not support video generation |
| ai | prompt (empty string) | ✅ PASS | 53ms | [AIEngine] prompt: request/quest is required |
| ai | prompt (message array) | ✅ PASS | 172ms | No driver found for provider vllm |
| ai | prompt (huge input ~20k chars) | ✅ PASS | 1094ms | The text appears to be filler content ("lorem ipsum") without any meaningful information. A summary of such text would simply state that it consists o |
| ai | prompt (schema/structured output) | ✅ PASS | 605ms | {"name":"An","age":30} |
| ai | prompt (max_tokens=1, temperature=0) | ✅ PASS | 222ms | Once |
| ai | promptStream (empty string) | ✅ PASS | 59ms | [AIEngine] prompt: request/quest is required |
| ai | getEmbedding (empty string) | ✅ PASS | 59ms | [AIEngine] getEmbedding: data is required |
| ai | getEmbeddings (empty array) | ✅ PASS | 55ms | array(0) |
| ai | rerank (empty docs) | ✅ PASS | 55ms | array(0) |
| ai | getModels (unknown provider) | ✅ PASS | 59ms | array(0) |
| ai | calculateTokens (empty text) | ✅ PASS | 55ms | null/undefined |
| ai | calculateTokens (missing text field) | ✅ PASS | 56ms | null/undefined |
| ai | ocr (malformed base64 payload) | ✅ PASS | 60ms |  |
| ai | image (invalid media_tier) | ✅ PASS | 71ms | [AIEngine.image] fal/flux-1.1-pro does not support image generation |
| ai | prompt (5x concurrent) | ✅ PASS | 1412ms | {"ok":5} |
| ai | prompt (instructions actually enforced) | ✅ PASS | 270ms | {"text":"BANANA"} |
| ai | prompt (temperature out of valid range) | ✅ PASS | 236ms | OK |
| ai | prompt (negative max_tokens) | ✅ PASS | 228ms | Ok |
| ai | prompt (adversarial unicode: ZWJ/RTL-override/stacked combining marks) | ✅ PASS | 815ms | The provided string contains a mix of special characters and file names. Here is the decoded version:  ``` "é" + gnp.exe + "null-byte-embedded" ```  T |
| ai | prompt (temperature = NaN) | ✅ PASS | 231ms | Ok |
| ai | prompt (max_tokens = Infinity) | ✅ PASS | 201ms | Ok |
| ai | prompt (whitespace-only string) | ✅ PASS | 595ms | It seems like you've provided placeholder tags for user input without any actual content. Could you please provide more details or a specific question |
| ai | prompt (lone UTF-16 surrogate) | ✅ PASS | 423ms | The input appears to be describing a scenario where a test using the "test-sdk" tool is encountering |
| ai | prompt (15x concurrent) | ✅ PASS | 2912ms | {"ok":15} |
| models | xhard/openllm:qwen3.7-max | ✅ PASS | 60ms | No driver found for provider openllm |
| models | xhard/openllm:deepseek-v4-pro | ✅ PASS | 59ms | No driver found for provider openllm |
| models | xhard/claude:claude-sonnet-4.6 | ✅ PASS | 56ms | No driver found for provider claude |
| models | xhard/gemini:gemini-3.5-pro | ✅ PASS | 57ms | No driver found for provider gemini |
| models | xhard/openai:gpt-5.5 | ✅ PASS | 60ms | No driver found for provider openai |
| models | xhard/openai:o3-pro | ✅ PASS | 102ms | No driver found for provider openai |
| models | xhard/claude:claude-opus-4.8 | ✅ PASS | 59ms | No driver found for provider claude |
| models | xhard/gemini:gemini-3.5-deep-think | ✅ PASS | 58ms | No driver found for provider gemini |
| models | medium/openllm:qwen3.7-plus | ✅ PASS | 56ms | No driver found for provider openllm |
| models | medium/claude:claude-haiku-4.5 | ✅ PASS | 63ms | No driver found for provider claude |
| models | medium/gemini:gemini-3.5-flash | ✅ PASS | 57ms | No driver found for provider gemini |
| models | medium/openai:gpt-5.5-mini | ✅ PASS | 57ms | No driver found for provider openai |
| models | light/openllm:qwen-turbo | ✅ PASS | 58ms | No driver found for provider openllm |
| models | nano/vllm:Qwen/Qwen2.5-3B-Instruct-AWQ | ✅ PASS | 57ms | No driver found for provider vllm |
| models | code/openllm:qwen3-coder-plus | ✅ PASS | 57ms | No driver found for provider openllm |
| models | vl/openllm:qwen-vl-plus | ✅ PASS | 59ms | No driver found for provider openllm |
| models | vl/openllm:qwen-vl-max | ✅ PASS | 57ms | No driver found for provider openllm |
| models | embedding/BAAI/bge-m3 | ⏭️ SKIP | 0ms | already covered as the default embedding model in ai.test.ts (getEmbedding/getEmbeddings) — only 1 model configured for this tier, nothing extra to probe |
| models | rerank/BAAI/bge-reranker-v2-m3 | ⏭️ SKIP | 0ms | already covered as the default rerank model in ai.test.ts (rerank) — only 1 model configured for this tier, nothing extra to probe (AISDK.ts's register('rerank', ...) forwards params.opts now, so model override IS possible via SDK, just nothing to override to here) |
| models | realtime/* | ⏭️ SKIP | 0ms | WebSocket voice session, not a fit for ai.prompt's simple request/response round-trip |
| models | tts/*, stt/* | ⏭️ SKIP | 0ms | needs a real audio payload to decode/produce meaningfully — no safe fake audio like OCR's 1x1 PNG, and not the focus of this 'which LLM models work' probe |
| store | set | ✅ PASS | 58ms | Table 'test_sdk_probe' not found in project |
| store | get | ⏭️ SKIP | 0ms | store.set above failed with a business error (missing project_id in this test account's context), so there's no key to verify get() against |
| store | query | ✅ PASS | 56ms | array(0) |
| store | count | ✅ PASS | 55ms | 0 |
| store | search | ✅ PASS | 56ms | array(0) |
| store | del | ✅ PASS | 59ms | Table 'test_sdk_probe' not found in project |
| store | get (deleted/nonexistent key) | ✅ PASS | 56ms | {"row":null} |
| store | del (nonexistent key) | ✅ PASS | 57ms | Table 'test_sdk_probe' not found in project |
| store | set (overwrite same key) | ✅ PASS | 56ms | Table 'test_sdk_probe' not found in project |
| store | set+get (key with special characters) | ✅ PASS | 58ms | Table 'test_sdk_probe' not found in project |
| store | query (filter matches nothing) | ✅ PASS | 54ms | array(0) |
| store | set+get (prototype pollution attempt) | ✅ PASS | 56ms | Table 'test_sdk_probe' not found in project |
| store | set (circular reference value) | ✅ PASS | 1ms | Converting circular structure to JSON     --> starting at object with constructor 'Object'     --- property 'self' closes the circle |
| redis | set | ✅ PASS | 56ms | OK |
| redis | get | ✅ PASS | 56ms | 1 |
| redis | incr | ✅ PASS | 55ms | 2 |
| redis | exists | ✅ PASS | 55ms | 1 |
| redis | del | ✅ PASS | 55ms | 1 |
| redis | get (deleted/nonexistent key) | ✅ PASS | 62ms | {"v":null} |
| redis | del (nonexistent key) | ✅ PASS | 61ms | 1 |
| redis | exists (nonexistent key) | ✅ PASS | 56ms | 0 |
| redis | incr (non-numeric value) | ✅ PASS | 168ms | ERR value is not an integer or out of range |
| redis | incr (near Number.MAX_SAFE_INTEGER) | ✅ PASS | 175ms | 9007199254740990 |
| redis | setex (seconds=0) | ✅ PASS | 113ms | ERR invalid expire time in 'set' command |
| redis | setex (negative seconds) | ✅ PASS | 119ms | ERR invalid expire time in 'set' command |
| redis | incrby (NaN increment) | ✅ PASS | 111ms | 1 |
| redis | incrby (Infinity increment) | ✅ PASS | 116ms | 1 |
| redis | decrby (non-integer float) | ✅ PASS | 175ms | ERR value is not an integer or out of range |
| redis | hset | ✅ PASS | 58ms | 1 |
| redis | hget | ✅ PASS | 59ms | value1 |
| redis | hset (second field) | ✅ PASS | 57ms | 1 |
| redis | hgetall | ✅ PASS | 62ms | {"field1":"value1","field2":"value2"} |
| redis | hget (nonexistent field) | ✅ PASS | 57ms | {"v":null} |
| redis | hdel | ✅ PASS | 56ms | 1 |
| redis | hset (prototype pollution via field name) | ✅ PASS | 53ms | {"ok":true} |
| redis | keys (own key appears under matching pattern) | ✅ PASS | 196ms | {"found":1} |
| redis | keys (wildcard '*', sanity check) | ✅ PASS | 78ms | {"count":0} |
| mongo | create | ✅ PASS | 60ms | {"marker":"probe-1786539595853","n":42} |
| mongo | findOne | ✅ PASS | 67ms | {"marker":"probe-1786539595853","n":42} |
| mongo | find | ✅ PASS | 56ms | array(1) |
| mongo | countDocuments | ✅ PASS | 56ms | 1 |
| mongo | updateOne | ✅ PASS | 59ms | {"modifiedCount":1,"matchedCount":1,"upsertedId":null} |
| mongo | updateOne (filter matches nothing) | ✅ PASS | 54ms | {"modifiedCount":0,"matchedCount":0,"upsertedId":null} |
| mongo | findOne (filter matches nothing) | ✅ PASS | 57ms | {"doc":null} |
| mongo | deleteOne | ✅ PASS | 58ms | {"deletedCount":1} |
| mongo | deleteOne (already deleted) | ✅ PASS | 58ms | {"deletedCount":0} |
| mongo | create (prototype pollution attempt) | ✅ PASS | 123ms | {"marker":"proto-probe-1786539596378","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}} |
| mongo | create+findOne (operator-shaped value, as literal data) | ✅ PASS | 169ms | {"marker":"op-value-probe-1786539596501","payload":{"$gt":"","$where":"this is data, not a query operator"}} |
| mongo | find ($in operator) | ✅ PASS | 389ms | {"matched":2} |
| knowledge | search | ✅ PASS | 139ms | array(0) |
| knowledge | search (empty query) | ✅ PASS | 59ms | array(0) |
| knowledge | search (limit=0) | ✅ PASS | 102ms | array(0) |
| vector | index | ✅ PASS | 98ms | Lập chỉ mục tài liệu thất bại (id: test-sdk-vector-probe-1786539597360). |
| vector | index (empty content) | ✅ PASS | 54ms | Lập chỉ mục tài liệu thất bại (id: test-sdk-vector-probe-1786539597360-empty). |
| vector | search | ✅ PASS | 98ms | array(0) |
| vector | search (empty query) | ✅ PASS | 57ms | array(0) |
| vector | search (rerank) | ✅ PASS | 96ms | array(0) |
| vector | searchBatch | ✅ PASS | 104ms | array(0) |
| vector | get | ✅ PASS | 62ms | array(0) |
| vector | get (nonexistent id) | ✅ PASS | 60ms | array(0) |
| vector | searchBatch (one empty query in batch) | ✅ PASS | 100ms | array(0) |
| vector | matchBatch | ✅ PASS | 127ms | array(2) |
| vector | index (re-index same id, verify latest content wins) | ✅ PASS | 96ms | Lập chỉ mục tài liệu thất bại (id: test-sdk-vector-probe-1786539597360). |
| vector | index (prototype pollution via metadata) | ✅ PASS | 100ms | Lập chỉ mục tài liệu thất bại (id: test-sdk-vector-probe-1786539597360-proto). |
| vector | index (5x concurrent, same id) | ✅ PASS | 227ms | Lập chỉ mục tài liệu thất bại (id: test-sdk-vector-probe-1786539597360-race). |
| vector | delete | ✅ PASS | 60ms | {"deleted":0} |
| vector | requestCollection | ✅ PASS | 60ms | {"client":"wes_aivin_vn","plugin_id":"test-sdk","requested_by":"6a7b084ef26be74d655f29af","workspace_id":"6a7b0853f16f8c62bc49955d","label":"test-sdk- |
| vector | getCollectionStatus | ✅ PASS | 56ms | {"client":"wes_aivin_vn","plugin_id":"test-sdk","requested_by":"6a7b084ef26be74d655f29af","workspace_id":"6a7b0853f16f8c62bc49955d","label":"test-sdk- |
| vector | similarity | ✅ PASS | 0ms | {"score":1} |
| vector | normalize | ✅ PASS | 0ms | {"norm":1.000000023841858} |
| usage | checkBalance | ✅ PASS | 57ms | [usage.checkBalance] missing usage_info in context |
| usage | getUsage | ✅ PASS | 57ms | [usage.getUsage] user has no organization to report usage for |
| datasource | getSources | ✅ PASS | 57ms | Workspace with id  not found |
| datasource | getDomains | ✅ PASS | 58ms | array(0) |
| datasource | getSources (nonexistent source_id filter) | ✅ PASS | 58ms | Workspace with id  not found |
| datasource | learn | ⏭️ SKIP | 0ms | triggers a real learning job (async, resource-intensive) on a real data source — needs a real source_id, won't guess |
| causality | think | ✅ PASS | 107ms | array(0) |
| causality | search | ✅ PASS | 244ms | array(0) |
| causality | search (empty query) | ✅ PASS | 57ms | array(0) |
| causality | absorb (empty array) | ✅ PASS | 57ms | array(0) |
| causality | absorb | ✅ PASS | 694ms | array(0) |
| causality | absorb (prototype pollution attempt) | ✅ PASS | 240ms | array(0) |
| causality | think (prompt injection-shaped query) | ✅ PASS | 82ms | array(2) |
| attachment | search | ✅ PASS | 56ms | Cần có session để tìm kiếm tệp đính kèm. |
| attachment | search (empty query) | ✅ PASS | 54ms | Cần có session để tìm kiếm tệp đính kèm. |
| attachment | search (limit=0) | ✅ PASS | 58ms | Cần có session để tìm kiếm tệp đính kèm. |
| attachment | upload | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | deepResearch | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | evaluate | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | queryTabularData | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | queryMediaTimestamp | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | extract | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| workspace | get | ✅ PASS | 56ms | {"_id":"6a7b0853f16f8c62bc49955d","creator_uid":"6a7b084ef26be74d655f29af","client":"wes_aivin_vn","name":"Personal","__v":84,"agents":[{"agent_id":"6 |
| workspace | getByIds | ✅ PASS | 60ms | array(1) |
| workspace | getByIds (empty array) | ✅ PASS | 57ms | array(0) |
| workspace | getMembers | ✅ PASS | 57ms | array(1) |
| workspace | checkPermission | ✅ PASS | 58ms | true |
| workspace | checkPermission (invalid permission) | ✅ PASS | 56ms | true |
| workspace | getPluginConfig | ✅ PASS | 59ms | {"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}} |
| workspace | searchAgents | ✅ PASS | 76ms | array(0) |
| workspace | searchAgents (empty query) | ✅ PASS | 56ms | array(0) |
| workspace | updatePlugin | ✅ PASS | 67ms | {"creator_uid":"6a7b084ef26be74d655f29af","client":"wes_aivin_vn","name":"Personal","agents":[{"response_config":{"tone":[],"format":[]},"behavior":{" |
| workspace | updatePlugin (prototype pollution via arguments) | ✅ PASS | 62ms | {"creator_uid":"6a7b084ef26be74d655f29af","client":"wes_aivin_vn","name":"Personal","agents":[{"response_config":{"tone":[],"format":[]},"behavior":{" |
| agent | get | ✅ PASS | 57ms | [agent.getAIStaff] id is required (không có agent trong context) |
| agent | status | ✅ PASS | 58ms | {"status":"unlinked"} |
| agent | reply | ✅ PASS | 58ms | Ok |
| agent | tell | ✅ PASS | 57ms | {"success":false} |
| agent | resolveHil | ✅ PASS | 59ms | [MessageSDK] missing client in context |
| agent | reply (empty string) | ✅ PASS | 55ms | [agent.reply] quest is required |
| agent | resolveHil (missing session_id) | ✅ PASS | 56ms | [agent.resolveHil] session_id and reply_id are required |
| agent | resolveHil (prototype pollution via payload) | ✅ PASS | 54ms | [MessageSDK] missing client in context |
| agent | cancel | ⏭️ SKIP | 0ms | real side effect on a real user's chat/session (cancels a live response, triggers routing to another agent...), no safe degrade path when context is missing |
| agent | delegate | ⏭️ SKIP | 0ms | real side effect on a real user's chat/session (cancels a live response, triggers routing to another agent...), no safe degrade path when context is missing |
| agent | processMessage | ⏭️ SKIP | 0ms | real side effect on a real user's chat/session (cancels a live response, triggers routing to another agent...), no safe degrade path when context is missing |
| browser | cancel | ✅ PASS | 54ms | {"success":true,"session_id":"wes_aivin_vn"} |
| browser | run | ✅ PASS | 60952ms | {"status":"fail","message":"Đã có một nhiệm vụ khác đang chạy cho khách hàng wes_aivin_vn. Vui lòng đợi.","data":{"status":"failed","message":"Đã có m |
| project | search | ✅ PASS | 190ms | array(0) |
| project | get | ✅ PASS | 58ms | Project not found |
| project | search (empty keyword) | ✅ PASS | 57ms | Project search failed: [AIEngine] getEmbedding: data is required |
| project | search (regex/operator-injection-shaped keyword) | ✅ PASS | 150ms | array(0) |
| table | getAllTables | ✅ PASS | 60ms | array(1) |
| table | createTable | ✅ PASS | 176ms | {"_id":"6a7c6e8e9bffc85200da346d","table_id":"tbl_msq3l5z0_virss","name":"test_sdk_probe_table_1786539663394","description":"Auto-created by test-sdk  |
| table | getTable | ✅ PASS | 58ms | {"table_id":"tbl_msq3l5z0_virss","name":"test_sdk_probe_table_1786539663394","description":"Auto-created by test-sdk to verify the round-trip, deleted |
| table | updateTable | ✅ PASS | 154ms | {"success":true,"message":"Table updated"} |
| table | getTable (nonexistent table_id) | ✅ PASS | 61ms | Table not found |
| table | addRow | ✅ PASS | 65ms | {"table_id":"6a7c6e8e9bffc85200da346d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | getRow | ✅ PASS | 55ms | {"_id":"6a7c6e8e9bffc85200da3494","table_id":"6a7c6e8e9bffc85200da346d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca0368 |
| table | updateRow | ✅ PASS | 64ms | {"_id":"6a7c6e8e9bffc85200da3494","table_id":"6a7c6e8e9bffc85200da346d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca0368 |
| table | getRow (nonexistent row_id) | ✅ PASS | 57ms | null/undefined |
| table | addRow (schema-mismatched data) | ✅ PASS | 56ms | {"table_id":"6a7c6e8e9bffc85200da346d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | addRow (prototype pollution attempt) | ✅ PASS | 56ms | {"table_id":"6a7c6e8e9bffc85200da346d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | addRow (NoSQL-operator-shaped value, as literal data) | ✅ PASS | 57ms | {"table_id":"6a7c6e8e9bffc85200da346d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | addRow (deeply nested data, 60 levels) | ✅ PASS | 57ms | {"table_id":"6a7c6e8e9bffc85200da346d","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | getRows | ✅ PASS | 58ms | array(5) |
| table | getRows (limit=0) | ✅ PASS | 1ms | [table.getRows] invalid params - limit: Too small: expected number to be >0 |
| table | getRows (limit=Number.MAX_SAFE_INTEGER) | ✅ PASS | 60ms | array(5) |
| table | bulkAddRows | ✅ PASS | 58ms | array(2) |
| table | bulkAddRows (empty rows array) | ✅ PASS | 0ms | [table.bulkAddRows] invalid params - rows: rows must have at least one entry |
| table | bulkAddRows (large batch, 100 rows) | ✅ PASS | 153ms | {"requested":100,"inserted":100} |
| table | batchUpdateRows (filter matches nothing) | ✅ PASS | 63ms | {"modifiedCount":0} |
| table | batchUpdateRows | ✅ PASS | 79ms | {"modifiedCount":1,"snapshot_id":"ds:snap:1786539663868:h2pxx2j"} |
| table | rollback | ✅ PASS | 58ms | {"restored":1,"reinserted":0,"removed":0,"failed":0} |
| table | batchDeleteRows | ✅ PASS | 61ms | {"success":true,"deletedCount":2,"snapshot_id":"ds:snap:1786539664013:94oqgfu"} |
| table | searchSemantic | ✅ PASS | 134ms | array(0) |
| table | searchSemantic (empty query) | ✅ PASS | 1ms | [table.searchSemantic] invalid params - query: query is required |
| table | smartQuery | ✅ PASS | 2261ms | {"rows":[],"count":0,"schema_used":{"table_id":"tbl_msq3l5z0_virss","name":"test_sdk_probe_table_1786539663394","description":"updated by test-sdk","c |
| table | batchUpdateByAI | ✅ PASS | 2085ms | {"modifiedCount":5,"snapshot_id":"ds:snap:1786539668912:ek9b2qy","reason":"This JSON object defines the filter to find all rows in table '6a7c6e8e9bff |
| table | getTableStats | ✅ PASS | 67ms | {"count":0,"last_updated_at":null,"top_sources":[],"schema_coverage":{},"warning_threshold":750,"hard_limit":1000} |
| table | countRows | ✅ PASS | 59ms | {"count":5,"warning_threshold":750,"hard_limit":1000} |
| table | exportTable | ✅ PASS | 62ms | array(0) |
| table | deduplicateTable | ✅ PASS | 60ms | {"removed":0,"merged":0,"groups_found":0} |
| table | backfillColumn | ✅ PASS | 59ms | {"updated":0} |
| table | formatRowsForContext | ✅ PASS | 66ms | {"context":"Table: test_sdk_probe_table_1786539663394\n","rows_included":0,"estimated_tokens":11,"total_rows":0} |
| table | deleteRow | ✅ PASS | 63ms | {"success":true,"snapshot_id":"ds:snap:1786539669396:qk5mhoc"} |
| table | ensureTable | ⏭️ SKIP | 0ms | AI picks/creates a table by purpose on its own, no control over which table gets touched |
| table | deleteTable | ✅ PASS | 75ms | {"success":true} |
| table | deleteTable (already deleted) | ✅ PASS | 58ms | Table not found |
| task | create | ✅ PASS | 2392ms | {"title":"test-sdk probe 1786539669950","client":"wes_aivin_vn","key":"test-sdk-probe-1786539669950","step":"Analysis","status":"processing","handler_ |
| task | create (empty title) | ✅ PASS | 64ms | {"title":"","client":"wes_aivin_vn","status":"processing","handler_history":[{"member_id":"6a7b084ef26be74d655f29af","member_name":"Phùng Đức Thắng"," |
| task | listMine | ✅ PASS | 63ms | array(3) |
| task | listMine (limit=0) | ✅ PASS | 55ms | array(0) |
| task | delete | ✅ PASS | 59ms | {"title":"test-sdk probe 1786539669950","client":"wes_aivin_vn","key":"test-sdk-probe-1786539669950","step":"Analysis","status":"processing","handler_ |
| task | delete (already deleted) | ✅ PASS | 57ms | Task not found |
| task | create (5x concurrent) | ✅ PASS | 9718ms | {"created":5,"failed":0} |
| message | getRecent | ✅ PASS | 77ms | array(3) |
| message | save | ✅ PASS | 59ms | {"client":"wes_aivin_vn","id":"6a7c6ea39bffc85200da363e","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save (empty text) | ✅ PASS | 61ms | {"client":"wes_aivin_vn","id":"6a7c6ea39bffc85200da3642","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save (invalid role) | ✅ PASS | 56ms | [message.saveMessage] invalid role "this-is-not-a-role" - must be one of: user, assistant, system |
| message | save (valid role, wrong case: User) | ✅ PASS | 57ms | [message.saveMessage] invalid role "User" - must be one of: user, assistant, system |
| message | save (huge text ~15k chars) | ✅ PASS | 67ms | {"client":"wes_aivin_vn","id":"6a7c6ea39bffc85200da3645","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save+getById (injection-shaped content, round-trip integrity) | ✅ PASS | 121ms | {"id":"6a7c6ea39bffc85200da3648","client":"wes_aivin_vn","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save (10x concurrent, same session) | ✅ PASS | 227ms | {"landed":10} |
| message | getList | ✅ PASS | 76ms | array(5) |
| message | search | ✅ PASS | 192ms | array(50) |
| message | search (empty query) | ✅ PASS | 83ms | array(50) |
| message | getList (negative limit) | ✅ PASS | 61ms | array(1) |
| message | init | ✅ PASS | 56ms | {"id":"6a7c6ea19bffc85200da367d","client":"wes_aivin_vn","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | getById (nonexistent id) | ✅ PASS | 56ms | Không tìm thấy tin nhắn. |
| message | getById | ✅ PASS | 56ms | {"client":"wes_aivin_vn","id":"6a7c6ea39bffc85200da365c","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | update | ✅ PASS | 55ms | Không tìm thấy hoặc bạn không có quyền cập nhật. |
| message | update (empty text) | ✅ PASS | 54ms | Không tìm thấy hoặc bạn không có quyền cập nhật. |
| message | update (prototype pollution via free-form fields) | ✅ PASS | 55ms | Không tìm thấy hoặc bạn không có quyền cập nhật. |
| message | stream | ⏭️ SKIP | 0ms | MessageService.streamResponse reads ctx.session.id, not params.session_id, to attach the message - our ctx.session is always undefined, so this would persist an orphaned message with no session instead of landing in the test session |
| session | getList | ✅ PASS | 56ms | array(0) |
| session | get | ✅ PASS | 57ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | get (nonexistent id) | ✅ PASS | 55ms | null/undefined |
| session | updateStatus (invalid status value) | ✅ PASS | 56ms | [session.updateSessionStatus] invalid status "this-is-not-a-valid-status" - must be one of: idle, processing, completed |
| session | update (empty payload) | ✅ PASS | 58ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | updateStatus (valid value, wrong case: IDLE) | ✅ PASS | 53ms | [session.updateSessionStatus] invalid status "IDLE" - must be one of: idle, processing, completed |
| session | markAsSeen | ✅ PASS | 57ms | null/undefined |
| session | update | ✅ PASS | 58ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | update (prototype pollution via free-form fields) | ✅ PASS | 59ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | updateStatus | ✅ PASS | 56ms | null/undefined |
| session | updateAgent | ✅ PASS | 56ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | newSession | ✅ PASS | 58ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | create | ✅ PASS | 55ms | agent_id "undefined" is invalid — cannot build session |
| session | updateStatus (3x concurrent, same session) | ✅ PASS | 59ms | {"ok":3} |
| realtime | publish | ✅ PASS | 55ms | {"success":true,"delivered_to":"6a7b0853f16f8c62bc49955d"} |
| realtime | publish (target=user) | ✅ PASS | 56ms | {"success":true,"delivered_to":"6a7b084ef26be74d655f29af"} |
| realtime | publish (empty event name) | ✅ PASS | 54ms | Thiếu tham số event. |
| realtime | publish (prototype pollution via data) | ✅ PASS | 55ms | {"success":true,"delivered_to":"6a7b0853f16f8c62bc49955d"} |
| queue | scheduleJob | ⏭️ SKIP | 0ms | schedules this same plugin to run again, with no way to cancel a scheduled job — test-sdk isn't a real running plugin so the job would be orphaned forever |
| notification | subscribeTopic | ✅ PASS | 60ms | null/undefined |
| notification | unsubscribeTopic | ✅ PASS | 54ms | null/undefined |
| notification | unsubscribeTopic (never subscribed) | ✅ PASS | 56ms | null/undefined |
| notification | push | ✅ PASS | 71ms | null/undefined |
| notification | push (prototype pollution via free-form fields) | ✅ PASS | 60ms | null/undefined |
| notification | push (receiver_id - the field the real handler actually reads) | ✅ PASS | 60ms | null/undefined |
| notification | push (receiver_ids batch) | ✅ PASS | 59ms | null/undefined |
| notification | push (channels + priority routing) | ✅ PASS | 59ms | null/undefined |
| notification | push (channels: ['email'], priority: 'urgent' — the beautiful MailHelper template, AI-generated from prompt) | ✅ PASS | 9247ms | null/undefined |
| notification | push (messageIsHtml) | ✅ PASS | 68ms | null/undefined |
| notification | push (title_key/message_key/vars i18n) | ✅ PASS | 78ms | null/undefined |
| notification | subscribeTopic (setup for push topic-broadcast probe) | ✅ PASS | 73ms | null/undefined |
| notification | push (topic broadcast — no user_id/receiver_id, audience = topic subscribers) | ✅ PASS | 72ms | null/undefined |
| notification | unsubscribeTopic (cleanup push topic-broadcast probe) | ✅ PASS | 56ms | null/undefined |
| notification | sendMail | ✅ PASS | 7924ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| notification | sendMail (HTML/script content in body) | ✅ PASS | 7346ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| notification | sendMail (CRLF header injection in subject) | ✅ PASS | 2298ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| notification | sendMail (CRLF injection in to) | ✅ PASS | 2441ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| resource | upload | ✅ PASS | 100ms | {"name":"test-sdk-probe.txt","mime":"text/plain","is_public":false,"temp":true,"client":"wes_aivin_vn","user_id":"6a7b084ef26be74d655f29af","workspace |
| resource | remove | ✅ PASS | 92ms | null/undefined |
| resource | remove (already removed) | ✅ PASS | 74ms | null/undefined |
| resource | remove (nonexistent url) | ✅ PASS | 55ms | Không thể xóa dữ liệu thuộc về tổ chức khác. |
| resource | upload (path traversal filename) | ✅ PASS | 87ms | {"name":"../../../../etc/test-sdk-probe-traversal.txt","mime":"text/plain","is_public":false,"temp":true,"client":"wes_aivin_vn","user_id":"6a7b084ef2 |
| resource | remove (path traversal probe cleanup) | ✅ PASS | 95ms | null/undefined |
| setting | get | ✅ PASS | 57ms | {"app_domain":"demo.aivin.vn","app_url":"https://demo.aivin.vn","app_logo":"https://i.ibb.co/WNfcd5sG/aivin-logo-removebg-preview.png","app_slogan":"N |
| setting | getMerchantConfig | ✅ PASS | 59ms | null/undefined |
| automation | getJobs | ✅ PASS | 66ms | array(0) |
| automation | getJobs (nonexistent workspace_id) | ✅ PASS | 59ms | Workspace with id test-sdk-nonexistent-workspace-id not found |
| automation | createJob | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| automation | updateJob | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| automation | deleteJob | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| automation | executeById | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| code | executeLogic | ✅ PASS | 83ms | Thiếu org_id. |
| code | executeLogic (logic throws) | ✅ PASS | 59ms | Thiếu org_id. |
| code | executeLogic (missing logic field) | ✅ PASS | 58ms | Thiếu org_id. |
| code | executeLogic (sandbox escape attempt) | ✅ PASS | 58ms | Thiếu org_id. |
| code | executeLogic (prototype pollution via args) | ✅ PASS | 55ms | Thiếu org_id. |
| file | list | ✅ PASS | 58ms | array(0) |
| file | search | ✅ PASS | 69ms | array(0) |
| file | search (empty query) | ✅ PASS | 57ms | array(0) |
| file | get (nonexistent id) | ✅ PASS | 55ms | File ID không hợp lệ: "test-sdk-nonexistent-file-id" |
| file | create | ✅ PASS | 62ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"test-sdk-probe-1786539716222.txt","content":"Auto-created by test-sdk to ve |
| file | get | ✅ PASS | 57ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"test-sdk-probe-1786539716222.txt","content":"Auto-created by test-sdk to ve |
| file | del | ✅ PASS | 63ms | {"success":true,"message":"File deleted successfully"} |
| file | del (already deleted) | ✅ PASS | 58ms | File not found or you don't have permission to delete it |
| file | create (path traversal filename) | ✅ PASS | 59ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"../../../../etc/test-sdk-probe-traversal.txt","content":"path traversal pro |
| file | del (path traversal probe cleanup) | ✅ PASS | 60ms | {"success":true,"message":"File deleted successfully"} |
| file | create (prototype pollution attempt) | ✅ PASS | 59ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"proto-probe.txt","content":"proto probe","extension":"txt","creator_id":"6a |
| file | del (prototype pollution probe cleanup) | ✅ PASS | 62ms | {"success":true,"message":"File deleted successfully"} |
