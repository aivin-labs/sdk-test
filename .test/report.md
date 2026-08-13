# test-sdk report

Run: 2026-08-13T10:55:22.624Z
Duration: 4m25.3s

**285 PASS, 0 FAIL, 21 SKIP (306 cases)**

## Summary by namespace

| Namespace | Cases | Pass | Fail | Skip |
|---|---|---|---|---|
| ai | 34 | 34 | 0 | 0 |
| models | 21 | 17 | 0 | 4 |
| store | 13 | 13 | 0 | 0 |
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
| store | get | 2 | 2 | 0 | 0 |
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
| ai | prompt | ✅ PASS | 78ms | Ok |
| ai | promptStream | ✅ PASS | 66ms | {"chunkCount":1,"textLength":9,"preview":"1 2 3 4 5"} |
| ai | getEmbedding | ✅ PASS | 139ms | {"0":-0.04829481616616249,"1":0.01439779531210661,"2":-0.055122435092926025,"3":-0.023896675556898117,"4":-0.028757017105817795,"5":-0.035912517458200 |
| ai | getEmbeddings | ✅ PASS | 164ms | array(2) |
| ai | rerank | ✅ PASS | 59ms | array(2) |
| ai | getModels | ✅ PASS | 61ms | array(0) |
| ai | calculateTokens | ✅ PASS | 60ms | null/undefined |
| ai | ocr | ✅ PASS | 102ms |  |
| ai | image | ✅ PASS | 183ms | [AIEngine.image] fal/flux-1.1-pro does not support image generation |
| ai | video | ✅ PASS | 148ms | [AIEngine.video] kling/kling-v2-master does not support video generation |
| ai | prompt (empty string) | ✅ PASS | 58ms | [AIEngine] prompt: request/quest is required |
| ai | prompt (message array) | ✅ PASS | 74ms | No driver found for provider vllm |
| ai | prompt (huge input ~20k chars) | ✅ PASS | 70ms | This passage is filled with the placeholder text "lorem ipsum" and does not contain any meaningful content. A summary cannot be provided as there are  |
| ai | prompt (schema/structured output) | ✅ PASS | 58ms | {"name":"An","age":30} |
| ai | prompt (max_tokens=1, temperature=0) | ✅ PASS | 63ms | Once |
| ai | promptStream (empty string) | ✅ PASS | 55ms | [AIEngine] prompt: request/quest is required |
| ai | getEmbedding (empty string) | ✅ PASS | 55ms | [AIEngine] getEmbedding: data is required |
| ai | getEmbeddings (empty array) | ✅ PASS | 54ms | array(0) |
| ai | rerank (empty docs) | ✅ PASS | 55ms | array(0) |
| ai | getModels (unknown provider) | ✅ PASS | 55ms | array(0) |
| ai | calculateTokens (empty text) | ✅ PASS | 55ms | null/undefined |
| ai | calculateTokens (missing text field) | ✅ PASS | 56ms | null/undefined |
| ai | ocr (malformed base64 payload) | ✅ PASS | 69ms |  |
| ai | image (invalid media_tier) | ✅ PASS | 136ms | [AIEngine.image] fal/flux-1.1-pro does not support image generation |
| ai | prompt (5x concurrent) | ✅ PASS | 67ms | {"ok":5} |
| ai | prompt (instructions actually enforced) | ✅ PASS | 58ms | {"text":"BANANA"} |
| ai | prompt (temperature out of valid range) | ✅ PASS | 56ms | OK |
| ai | prompt (negative max_tokens) | ✅ PASS | 56ms | Ok |
| ai | prompt (adversarial unicode: ZWJ/RTL-override/stacked combining marks) | ✅ PASS | 58ms | The provided string contains a combination of special characters and file names. Here is the decoded version for clarity:  ``` "é́́́́"‍‍ + gnp.exe +  |
| ai | prompt (temperature = NaN) | ✅ PASS | 60ms | Ok |
| ai | prompt (max_tokens = Infinity) | ✅ PASS | 58ms | Ok |
| ai | prompt (whitespace-only string) | ✅ PASS | 58ms | It seems like you've provided placeholder tags for user input without any actual content. Could you please provide more details or a specific question |
| ai | prompt (lone UTF-16 surrogate) | ✅ PASS | 65ms | The input you provided seems to be related to a testing scenario involving a "lone surrogate" character |
| ai | prompt (15x concurrent) | ✅ PASS | 86ms | {"ok":15} |
| models | xhard/openllm:qwen3.7-max | ✅ PASS | 80ms | No driver found for provider openllm |
| models | xhard/openllm:deepseek-v4-pro | ✅ PASS | 57ms | No driver found for provider openllm |
| models | xhard/claude:claude-sonnet-4.6 | ✅ PASS | 65ms | No driver found for provider claude |
| models | xhard/gemini:gemini-3.5-pro | ✅ PASS | 60ms | No driver found for provider gemini |
| models | xhard/openai:gpt-5.5 | ✅ PASS | 57ms | No driver found for provider openai |
| models | xhard/openai:o3-pro | ✅ PASS | 58ms | No driver found for provider openai |
| models | xhard/claude:claude-opus-4.8 | ✅ PASS | 59ms | No driver found for provider claude |
| models | xhard/gemini:gemini-3.5-deep-think | ✅ PASS | 59ms | No driver found for provider gemini |
| models | medium/openllm:qwen3.7-plus | ✅ PASS | 58ms | No driver found for provider openllm |
| models | medium/claude:claude-haiku-4.5 | ✅ PASS | 56ms | No driver found for provider claude |
| models | medium/gemini:gemini-3.5-flash | ✅ PASS | 58ms | No driver found for provider gemini |
| models | medium/openai:gpt-5.5-mini | ✅ PASS | 59ms | No driver found for provider openai |
| models | light/openllm:qwen-turbo | ✅ PASS | 58ms | No driver found for provider openllm |
| models | nano/vllm:Qwen/Qwen2.5-3B-Instruct-AWQ | ✅ PASS | 58ms | No driver found for provider vllm |
| models | code/openllm:qwen3-coder-plus | ✅ PASS | 57ms | No driver found for provider openllm |
| models | vl/openllm:qwen-vl-plus | ✅ PASS | 59ms | No driver found for provider openllm |
| models | vl/openllm:qwen-vl-max | ✅ PASS | 59ms | No driver found for provider openllm |
| models | embedding/BAAI/bge-m3 | ⏭️ SKIP | 0ms | already covered as the default embedding model in ai.test.ts (getEmbedding/getEmbeddings) — only 1 model configured for this tier, nothing extra to probe |
| models | rerank/BAAI/bge-reranker-v2-m3 | ⏭️ SKIP | 0ms | already covered as the default rerank model in ai.test.ts (rerank) — only 1 model configured for this tier, nothing extra to probe (AISDK.ts's register('rerank', ...) forwards params.opts now, so model override IS possible via SDK, just nothing to override to here) |
| models | realtime/* | ⏭️ SKIP | 0ms | WebSocket voice session, not a fit for ai.prompt's simple request/response round-trip |
| models | tts/*, stt/* | ⏭️ SKIP | 0ms | needs a real audio payload to decode/produce meaningfully — no safe fake audio like OCR's 1x1 PNG, and not the focus of this 'which LLM models work' probe |
| store | set | ✅ PASS | 73ms | {"_id":"6a7da1958ef0a5af824e847d","table_id":"tbl_msrd4ksl_rzqj3","project_id":"6a7b302e1e54b7d0ca03681f","store_key_hash":"f8151f2c0b067d3e49661979", |
| store | get | ✅ PASS | 57ms | {"_id":"6a7da1958ef0a5af824e847d","table_id":"tbl_msrd4ksl_rzqj3","project_id":"6a7b302e1e54b7d0ca03681f","store_key_hash":"f8151f2c0b067d3e49661979", |
| store | query | ✅ PASS | 109ms | array(0) |
| store | count | ✅ PASS | 60ms | 0 |
| store | search | ✅ PASS | 62ms | array(0) |
| store | del | ✅ PASS | 72ms | {"deleted":true} |
| store | get (deleted/nonexistent key) | ✅ PASS | 63ms | {"row":null} |
| store | del (nonexistent key) | ✅ PASS | 61ms | {"deleted":false} |
| store | set (overwrite same key) | ✅ PASS | 241ms | {"_id":"6a7da1968ef0a5af824e84b1","table_id":"tbl_msrd4ksl_rzqj3","project_id":"6a7b302e1e54b7d0ca03681f","store_key_hash":"f2a9429630fd1bf067060d53", |
| store | set+get (key with special characters) | ✅ PASS | 181ms | {"_id":"6a7da1968ef0a5af824e84b9","table_id":"tbl_msrd4ksl_rzqj3","project_id":"6a7b302e1e54b7d0ca03681f","store_key_hash":"ecec198f0fd60f5ca513c927", |
| store | query (filter matches nothing) | ✅ PASS | 57ms | array(0) |
| store | set+get (prototype pollution attempt) | ✅ PASS | 183ms | {"_id":"6a7da1968ef0a5af824e84c0","project_id":"6a7b302e1e54b7d0ca03681f","table_id":"tbl_msrd4ksl_rzqj3","store_key_hash":"c71277bc3cfb94d6b4164cee", |
| store | set (circular reference value) | ✅ PASS | 0ms | Converting circular structure to JSON     --> starting at object with constructor 'Object'     --- property 'self' closes the circle |
| redis | set | ✅ PASS | 55ms | OK |
| redis | get | ✅ PASS | 55ms | 1 |
| redis | incr | ✅ PASS | 59ms | 2 |
| redis | exists | ✅ PASS | 55ms | 1 |
| redis | del | ✅ PASS | 55ms | 1 |
| redis | get (deleted/nonexistent key) | ✅ PASS | 58ms | {"v":null} |
| redis | del (nonexistent key) | ✅ PASS | 56ms | 1 |
| redis | exists (nonexistent key) | ✅ PASS | 56ms | 0 |
| redis | incr (non-numeric value) | ✅ PASS | 167ms | ERR value is not an integer or out of range |
| redis | incr (near Number.MAX_SAFE_INTEGER) | ✅ PASS | 168ms | 9007199254740990 |
| redis | setex (seconds=0) | ✅ PASS | 114ms | ERR invalid expire time in 'set' command |
| redis | setex (negative seconds) | ✅ PASS | 113ms | ERR invalid expire time in 'set' command |
| redis | incrby (NaN increment) | ✅ PASS | 111ms | 1 |
| redis | incrby (Infinity increment) | ✅ PASS | 115ms | 1 |
| redis | decrby (non-integer float) | ✅ PASS | 168ms | ERR value is not an integer or out of range |
| redis | hset | ✅ PASS | 58ms | 1 |
| redis | hget | ✅ PASS | 55ms | value1 |
| redis | hset (second field) | ✅ PASS | 56ms | 1 |
| redis | hgetall | ✅ PASS | 55ms | {"field1":"value1","field2":"value2"} |
| redis | hget (nonexistent field) | ✅ PASS | 58ms | {"v":null} |
| redis | hdel | ✅ PASS | 54ms | 1 |
| redis | hset (prototype pollution via field name) | ✅ PASS | 55ms | {"ok":true} |
| redis | keys (own key appears under matching pattern) | ✅ PASS | 178ms | {"found":1} |
| redis | keys (wildcard '*', sanity check) | ✅ PASS | 71ms | {"count":0} |
| mongo | create | ✅ PASS | 56ms | {"marker":"probe-1786618265145","n":42} |
| mongo | findOne | ✅ PASS | 56ms | {"marker":"probe-1786618265145","n":42} |
| mongo | find | ✅ PASS | 59ms | array(1) |
| mongo | countDocuments | ✅ PASS | 56ms | 1 |
| mongo | updateOne | ✅ PASS | 58ms | {"modifiedCount":1,"matchedCount":1,"upsertedId":null} |
| mongo | updateOne (filter matches nothing) | ✅ PASS | 57ms | {"modifiedCount":0,"matchedCount":0,"upsertedId":null} |
| mongo | findOne (filter matches nothing) | ✅ PASS | 57ms | {"doc":null} |
| mongo | deleteOne | ✅ PASS | 57ms | {"deletedCount":1} |
| mongo | deleteOne (already deleted) | ✅ PASS | 60ms | {"deletedCount":0} |
| mongo | create (prototype pollution attempt) | ✅ PASS | 117ms | {"marker":"proto-probe-1786618265661","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}} |
| mongo | create+findOne (operator-shaped value, as literal data) | ✅ PASS | 169ms | {"marker":"op-value-probe-1786618265778","payload":{"$gt":"","$where":"this is data, not a query operator"}} |
| mongo | find ($in operator) | ✅ PASS | 430ms | {"matched":2} |
| knowledge | search | ✅ PASS | 190ms | array(0) |
| knowledge | search (empty query) | ✅ PASS | 59ms | array(0) |
| knowledge | search (limit=0) | ✅ PASS | 136ms | array(0) |
| vector | index | ✅ PASS | 145ms | Lập chỉ mục tài liệu thất bại (id: test-sdk-vector-probe-1786618266763). |
| vector | index (empty content) | ✅ PASS | 55ms | Lập chỉ mục tài liệu thất bại (id: test-sdk-vector-probe-1786618266763-empty). |
| vector | search | ✅ PASS | 133ms | array(0) |
| vector | search (empty query) | ✅ PASS | 57ms | array(0) |
| vector | search (rerank) | ✅ PASS | 138ms | array(0) |
| vector | searchBatch | ✅ PASS | 135ms | array(0) |
| vector | get | ✅ PASS | 65ms | array(0) |
| vector | get (nonexistent id) | ✅ PASS | 60ms | array(0) |
| vector | searchBatch (one empty query in batch) | ✅ PASS | 143ms | array(0) |
| vector | matchBatch | ✅ PASS | 209ms | array(2) |
| vector | index (re-index same id, verify latest content wins) | ✅ PASS | 129ms | Lập chỉ mục tài liệu thất bại (id: test-sdk-vector-probe-1786618266763). |
| vector | index (prototype pollution via metadata) | ✅ PASS | 134ms | Lập chỉ mục tài liệu thất bại (id: test-sdk-vector-probe-1786618266763-proto). |
| vector | index (5x concurrent, same id) | ✅ PASS | 288ms | Lập chỉ mục tài liệu thất bại (id: test-sdk-vector-probe-1786618266763-race). |
| vector | delete | ✅ PASS | 62ms | {"deleted":0} |
| vector | requestCollection | ✅ PASS | 60ms | {"client":"wes_aivin_vn","plugin_id":"test-sdk","requested_by":"6a7b084ef26be74d655f29af","workspace_id":"6a7b0853f16f8c62bc49955d","label":"test-sdk- |
| vector | getCollectionStatus | ✅ PASS | 56ms | {"client":"wes_aivin_vn","plugin_id":"test-sdk","requested_by":"6a7b084ef26be74d655f29af","workspace_id":"6a7b0853f16f8c62bc49955d","label":"test-sdk- |
| vector | similarity | ✅ PASS | 1ms | {"score":1} |
| vector | normalize | ✅ PASS | 0ms | {"norm":1.000000023841858} |
| usage | checkBalance | ✅ PASS | 56ms | [usage.checkBalance] missing usage_info in context |
| usage | getUsage | ✅ PASS | 58ms | [usage.getUsage] user has no organization to report usage for |
| datasource | getSources | ✅ PASS | 58ms | Workspace with id  not found |
| datasource | getDomains | ✅ PASS | 73ms | array(0) |
| datasource | getSources (nonexistent source_id filter) | ✅ PASS | 60ms | Workspace with id  not found |
| datasource | learn | ⏭️ SKIP | 0ms | triggers a real learning job (async, resource-intensive) on a real data source — needs a real source_id, won't guess |
| causality | think | ✅ PASS | 104ms | array(0) |
| causality | search | ✅ PASS | 143ms | array(0) |
| causality | search (empty query) | ✅ PASS | 56ms | array(0) |
| causality | absorb (empty array) | ✅ PASS | 57ms | array(0) |
| causality | absorb | ✅ PASS | 61ms | array(0) |
| causality | absorb (prototype pollution attempt) | ✅ PASS | 55ms | array(0) |
| causality | think (prompt injection-shaped query) | ✅ PASS | 112ms | array(2) |
| attachment | search | ✅ PASS | 56ms | Cần có session để tìm kiếm tệp đính kèm. |
| attachment | search (empty query) | ✅ PASS | 57ms | Cần có session để tìm kiếm tệp đính kèm. |
| attachment | search (limit=0) | ✅ PASS | 57ms | Cần có session để tìm kiếm tệp đính kèm. |
| attachment | upload | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | deepResearch | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | evaluate | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | queryTabularData | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | queryMediaTimestamp | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| attachment | extract | ⏭️ SKIP | 0ms | needs a real docId that already exists in the tenant; most are heavy/costly AI calls, won't guess a docId |
| workspace | get | ✅ PASS | 60ms | {"_id":"6a7b0853f16f8c62bc49955d","creator_uid":"6a7b084ef26be74d655f29af","client":"wes_aivin_vn","name":"Personal","__v":97,"agents":[{"agent_id":"6 |
| workspace | getByIds | ✅ PASS | 61ms | array(1) |
| workspace | getByIds (empty array) | ✅ PASS | 55ms | array(0) |
| workspace | getMembers | ✅ PASS | 57ms | array(1) |
| workspace | checkPermission | ✅ PASS | 57ms | true |
| workspace | checkPermission (invalid permission) | ✅ PASS | 57ms | true |
| workspace | getPluginConfig | ✅ PASS | 57ms | {"__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}} |
| workspace | searchAgents | ✅ PASS | 136ms | array(0) |
| workspace | searchAgents (empty query) | ✅ PASS | 56ms | array(0) |
| workspace | updatePlugin | ✅ PASS | 67ms | {"creator_uid":"6a7b084ef26be74d655f29af","client":"wes_aivin_vn","name":"Personal","agents":[{"response_config":{"tone":[],"format":[]},"behavior":{" |
| workspace | updatePlugin (prototype pollution via arguments) | ✅ PASS | 65ms | {"creator_uid":"6a7b084ef26be74d655f29af","client":"wes_aivin_vn","name":"Personal","agents":[{"response_config":{"tone":[],"format":[]},"behavior":{" |
| agent | get | ✅ PASS | 57ms | [agent.getAIStaff] id is required (không có agent trong context) |
| agent | status | ✅ PASS | 57ms | {"status":"unlinked"} |
| agent | reply | ✅ PASS | 60ms | Ok |
| agent | tell | ✅ PASS | 54ms | {"success":false} |
| agent | resolveHil | ✅ PASS | 61ms | [MessageSDK] missing client in context |
| agent | reply (empty string) | ✅ PASS | 55ms | [agent.reply] quest is required |
| agent | resolveHil (missing session_id) | ✅ PASS | 57ms | [agent.resolveHil] session_id and reply_id are required |
| agent | resolveHil (prototype pollution via payload) | ✅ PASS | 57ms | [MessageSDK] missing client in context |
| agent | cancel | ⏭️ SKIP | 0ms | real side effect on a real user's chat/session (cancels a live response, triggers routing to another agent...), no safe degrade path when context is missing |
| agent | delegate | ⏭️ SKIP | 0ms | real side effect on a real user's chat/session (cancels a live response, triggers routing to another agent...), no safe degrade path when context is missing |
| agent | processMessage | ⏭️ SKIP | 0ms | real side effect on a real user's chat/session (cancels a live response, triggers routing to another agent...), no safe degrade path when context is missing |
| browser | cancel | ✅ PASS | 57ms | {"success":true,"session_id":"wes_aivin_vn"} |
| browser | run | ✅ PASS | 92960ms | {"status":"success","data":{"reason":"The proposed sequence successfully loaded the page, located and extracted the title tag text.","markdown":"[PAGE |
| project | search | ✅ PASS | 112ms | array(0) |
| project | get | ✅ PASS | 65ms | Project not found |
| project | search (empty keyword) | ✅ PASS | 61ms | Project search failed: [AIEngine] getEmbedding: data is required |
| project | search (regex/operator-injection-shaped keyword) | ✅ PASS | 82ms | array(0) |
| table | getAllTables | ✅ PASS | 67ms | array(1) |
| table | createTable | ✅ PASS | 139ms | {"_id":"6a7da1fc53f4f1b857ab7d27","table_id":"tbl_msreg0pv_ylh3m","name":"test_sdk_probe_table_1786618364286","description":"Auto-created by test-sdk  |
| table | getTable | ✅ PASS | 58ms | {"table_id":"tbl_msreg0pv_ylh3m","name":"test_sdk_probe_table_1786618364286","description":"Auto-created by test-sdk to verify the round-trip, deleted |
| table | updateTable | ✅ PASS | 754ms | {"success":true,"message":"Table updated"} |
| table | getTable (nonexistent table_id) | ✅ PASS | 60ms | Table not found |
| table | addRow | ✅ PASS | 71ms | {"table_id":"6a7da1fc53f4f1b857ab7d27","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | getRow | ✅ PASS | 66ms | {"_id":"6a7da1fd53f4f1b857ab7d4a","table_id":"6a7da1fc53f4f1b857ab7d27","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca0368 |
| table | updateRow | ✅ PASS | 71ms | {"_id":"6a7da1fd53f4f1b857ab7d4a","table_id":"6a7da1fc53f4f1b857ab7d27","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca0368 |
| table | getRow (nonexistent row_id) | ✅ PASS | 58ms | null/undefined |
| table | addRow (schema-mismatched data) | ✅ PASS | 64ms | {"table_id":"6a7da1fc53f4f1b857ab7d27","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | addRow (prototype pollution attempt) | ✅ PASS | 61ms | {"table_id":"6a7da1fc53f4f1b857ab7d27","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | addRow (NoSQL-operator-shaped value, as literal data) | ✅ PASS | 62ms | {"table_id":"6a7da1fc53f4f1b857ab7d27","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | addRow (deeply nested data, 60 levels) | ✅ PASS | 62ms | {"table_id":"6a7da1fc53f4f1b857ab7d27","workspace_id":"6a7b0853f16f8c62bc49955d","project_id":"6a7b302e1e54b7d0ca03681f","client":"wes_aivin_vn","data |
| table | getRows | ✅ PASS | 60ms | array(5) |
| table | getRows (limit=0) | ✅ PASS | 0ms | [table.getRows] invalid params - limit: Too small: expected number to be >0 |
| table | getRows (limit=Number.MAX_SAFE_INTEGER) | ✅ PASS | 68ms | array(5) |
| table | bulkAddRows | ✅ PASS | 63ms | array(2) |
| table | bulkAddRows (empty rows array) | ✅ PASS | 0ms | [table.bulkAddRows] invalid params - rows: rows must have at least one entry |
| table | bulkAddRows (large batch, 100 rows) | ✅ PASS | 162ms | {"requested":100,"inserted":100} |
| table | batchUpdateRows (filter matches nothing) | ✅ PASS | 70ms | {"modifiedCount":0} |
| table | batchUpdateRows | ✅ PASS | 81ms | {"modifiedCount":1,"snapshot_id":"ds:snap:1786618366280:7f1ohz4"} |
| table | rollback | ✅ PASS | 66ms | {"restored":1,"reinserted":0,"removed":0,"failed":0} |
| table | batchDeleteRows | ✅ PASS | 66ms | {"success":true,"deletedCount":2,"snapshot_id":"ds:snap:1786618366420:yv4z7bi"} |
| table | searchSemantic | ✅ PASS | 825ms | array(0) |
| table | searchSemantic (empty query) | ✅ PASS | 0ms | [table.searchSemantic] invalid params - query: query is required |
| table | smartQuery | ✅ PASS | 7827ms | {"rows":[],"count":0,"schema_used":{"table_id":"tbl_msrd4ksl_rzqj3","name":"test_sdk_probe","description":"Auto-created by test-sdk to verify the stor |
| table | batchUpdateByAI | ✅ PASS | 17181ms | {"modifiedCount":0,"reason":"Based on the provided instruction, we need to update all rows in the table 'test_sdk_probe_table_1786618364286' by changi |
| table | getTableStats | ✅ PASS | 60ms | {"count":0,"last_updated_at":null,"top_sources":[],"schema_coverage":{},"warning_threshold":750,"hard_limit":1000} |
| table | countRows | ✅ PASS | 58ms | {"count":5,"warning_threshold":750,"hard_limit":1000} |
| table | exportTable | ✅ PASS | 73ms | array(0) |
| table | deduplicateTable | ✅ PASS | 61ms | {"removed":0,"merged":0,"groups_found":0} |
| table | backfillColumn | ✅ PASS | 67ms | {"updated":0} |
| table | formatRowsForContext | ✅ PASS | 59ms | {"context":"Table: test_sdk_probe_table_1786618364286\n","rows_included":0,"estimated_tokens":11,"total_rows":0} |
| table | deleteRow | ✅ PASS | 69ms | {"success":true,"snapshot_id":"ds:snap:1786618392705:mv8oj32"} |
| table | ensureTable | ⏭️ SKIP | 0ms | AI picks/creates a table by purpose on its own, no control over which table gets touched |
| table | deleteTable | ✅ PASS | 75ms | {"success":true} |
| table | deleteTable (already deleted) | ✅ PASS | 63ms | Table not found |
| task | create | ✅ PASS | 31426ms | {"title":"test-sdk probe 1786618392867","client":"wes_aivin_vn","key":"test-sdk-probe-1786618392867","step":"Initialization","status":"processing","ha |
| task | create (empty title) | ✅ PASS | 87ms | {"title":"","client":"wes_aivin_vn","status":"processing","handler_history":[{"member_id":"6a7b084ef26be74d655f29af","member_name":"Phùng Đức Thắng"," |
| task | listMine | ✅ PASS | 74ms | array(3) |
| task | listMine (limit=0) | ✅ PASS | 60ms | array(0) |
| task | delete | ✅ PASS | 65ms | {"title":"test-sdk probe 1786618392867","client":"wes_aivin_vn","key":"test-sdk-probe-1786618392867","step":"Initialization","status":"processing","ha |
| task | delete (already deleted) | ✅ PASS | 60ms | Task not found |
| task | create (5x concurrent) | ✅ PASS | 63885ms | {"created":5,"failed":0} |
| message | getRecent | ✅ PASS | 71ms | array(3) |
| message | save | ✅ PASS | 65ms | {"client":"wes_aivin_vn","id":"6a7da27853f4f1b857ab7f23","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save (empty text) | ✅ PASS | 62ms | {"client":"wes_aivin_vn","id":"6a7da27853f4f1b857ab7f28","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save (invalid role) | ✅ PASS | 60ms | [message.saveMessage] invalid role "this-is-not-a-role" - must be one of: user, assistant, system |
| message | save (valid role, wrong case: User) | ✅ PASS | 56ms | [message.saveMessage] invalid role "User" - must be one of: user, assistant, system |
| message | save (huge text ~15k chars) | ✅ PASS | 66ms | {"client":"wes_aivin_vn","id":"6a7da27853f4f1b857ab7f2b","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save+getById (injection-shaped content, round-trip integrity) | ✅ PASS | 123ms | {"id":"6a7da27853f4f1b857ab7f2e","client":"wes_aivin_vn","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | save (10x concurrent, same session) | ✅ PASS | 240ms | {"landed":10} |
| message | getList | ✅ PASS | 59ms | array(5) |
| message | search | ✅ PASS | 228ms | array(50) |
| message | search (empty query) | ✅ PASS | 87ms | array(50) |
| message | getList (negative limit) | ✅ PASS | 60ms | array(1) |
| message | init | ✅ PASS | 59ms | {"client":"wes_aivin_vn","id":"6a7da27953f4f1b857ab7f6f","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | getById (nonexistent id) | ✅ PASS | 56ms | Không tìm thấy tin nhắn. |
| message | getById | ✅ PASS | 67ms | {"id":"6a7da27953f4f1b857ab7f41","client":"wes_aivin_vn","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | update | ✅ PASS | 63ms | {"id":"6a7da27953f4f1b857ab7f41","client":"wes_aivin_vn","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | update (empty text) | ✅ PASS | 62ms | {"id":"6a7da27953f4f1b857ab7f41","client":"wes_aivin_vn","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | update (prototype pollution via free-form fields) | ✅ PASS | 65ms | {"id":"6a7da27953f4f1b857ab7f41","client":"wes_aivin_vn","context_attachments":[],"files":[],"images":[],"role":"user","session_id":"test-sdk-probe-se |
| message | stream | ⏭️ SKIP | 0ms | MessageService.streamResponse reads ctx.session.id, not params.session_id, to attach the message - our ctx.session is always undefined, so this would persist an orphaned message with no session instead of landing in the test session |
| session | getList | ✅ PASS | 60ms | array(0) |
| session | get | ✅ PASS | 55ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | get (nonexistent id) | ✅ PASS | 59ms | null/undefined |
| session | updateStatus (invalid status value) | ✅ PASS | 58ms | [session.updateSessionStatus] invalid status "this-is-not-a-valid-status" - must be one of: idle, processing, completed |
| session | update (empty payload) | ✅ PASS | 57ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | updateStatus (valid value, wrong case: IDLE) | ✅ PASS | 55ms | [session.updateSessionStatus] invalid status "IDLE" - must be one of: idle, processing, completed |
| session | markAsSeen | ✅ PASS | 56ms | null/undefined |
| session | update | ✅ PASS | 56ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | update (prototype pollution via free-form fields) | ✅ PASS | 57ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | updateStatus | ✅ PASS | 59ms | null/undefined |
| session | updateAgent | ✅ PASS | 58ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | newSession | ✅ PASS | 63ms | {"id":"test-sdk-probe-session","client":"wes_aivin_vn","context_usage_cache":0,"human_takeover":false,"is_activated":true,"is_background":false,"is_pr |
| session | create | ✅ PASS | 54ms | agent_id "undefined" is invalid — cannot build session |
| session | updateStatus (3x concurrent, same session) | ✅ PASS | 64ms | {"ok":3} |
| realtime | publish | ✅ PASS | 56ms | {"success":true,"delivered_to":"6a7b0853f16f8c62bc49955d"} |
| realtime | publish (target=user) | ✅ PASS | 55ms | {"success":true,"delivered_to":"6a7b084ef26be74d655f29af"} |
| realtime | publish (empty event name) | ✅ PASS | 58ms | Thiếu tham số event. |
| realtime | publish (prototype pollution via data) | ✅ PASS | 56ms | {"success":true,"delivered_to":"6a7b0853f16f8c62bc49955d"} |
| queue | scheduleJob | ⏭️ SKIP | 0ms | schedules this same plugin to run again, with no way to cancel a scheduled job — test-sdk isn't a real running plugin so the job would be orphaned forever |
| notification | subscribeTopic | ✅ PASS | 55ms | null/undefined |
| notification | unsubscribeTopic | ✅ PASS | 56ms | null/undefined |
| notification | unsubscribeTopic (never subscribed) | ✅ PASS | 57ms | null/undefined |
| notification | push | ✅ PASS | 65ms | null/undefined |
| notification | push (prototype pollution via free-form fields) | ✅ PASS | 60ms | null/undefined |
| notification | push (receiver_id - the field the real handler actually reads) | ✅ PASS | 64ms | null/undefined |
| notification | push (receiver_ids batch) | ✅ PASS | 60ms | null/undefined |
| notification | push (channels + priority routing) | ✅ PASS | 61ms | null/undefined |
| notification | push (channels: ['email'], priority: 'urgent' — the beautiful MailHelper template, AI-generated from prompt) | ✅ PASS | 2676ms | null/undefined |
| notification | push (messageIsHtml) | ✅ PASS | 64ms | null/undefined |
| notification | push (title_key/message_key/vars i18n) | ✅ PASS | 77ms | null/undefined |
| notification | subscribeTopic (setup for push topic-broadcast probe) | ✅ PASS | 55ms | null/undefined |
| notification | push (topic broadcast — no user_id/receiver_id, audience = topic subscribers) | ✅ PASS | 60ms | null/undefined |
| notification | unsubscribeTopic (cleanup push topic-broadcast probe) | ✅ PASS | 57ms | null/undefined |
| notification | sendMail | ✅ PASS | 2454ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| notification | sendMail (HTML/script content in body) | ✅ PASS | 19447ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| notification | sendMail (CRLF header injection in subject) | ✅ PASS | 2290ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| notification | sendMail (CRLF injection in to) | ✅ PASS | 2111ms | {"accepted":["thangphung.work@gmail.com"],"rejected":[],"ehlo":["PIPELINING","SIZE 48811212","ETRN","AUTH PLAIN LOGIN","ENHANCEDSTATUSCODES","8BITMIME |
| resource | upload | ✅ PASS | 90ms | {"name":"test-sdk-probe.txt","mime":"text/plain","is_public":false,"temp":true,"client":"wes_aivin_vn","user_id":"6a7b084ef26be74d655f29af","workspace |
| resource | remove | ✅ PASS | 91ms | null/undefined |
| resource | remove (already removed) | ✅ PASS | 60ms | null/undefined |
| resource | remove (nonexistent url) | ✅ PASS | 57ms | Không thể xóa dữ liệu thuộc về tổ chức khác. |
| resource | upload (path traversal filename) | ✅ PASS | 92ms | {"name":"../../../../etc/test-sdk-probe-traversal.txt","mime":"text/plain","is_public":false,"temp":true,"client":"wes_aivin_vn","user_id":"6a7b084ef2 |
| resource | remove (path traversal probe cleanup) | ✅ PASS | 97ms | null/undefined |
| setting | get | ✅ PASS | 55ms | {"app_domain":"demo.aivin.vn","app_url":"https://demo.aivin.vn","app_logo":"https://i.ibb.co/WNfcd5sG/aivin-logo-removebg-preview.png","app_slogan":"N |
| setting | getMerchantConfig | ✅ PASS | 57ms | null/undefined |
| automation | getJobs | ✅ PASS | 60ms | array(0) |
| automation | getJobs (nonexistent workspace_id) | ✅ PASS | 58ms | Workspace with id test-sdk-nonexistent-workspace-id not found |
| automation | createJob | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| automation | updateJob | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| automation | deleteJob | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| automation | executeById | ⏭️ SKIP | 0ms | creates/edits/triggers a REAL automation visible in the tenant UI, needs a real agent_id — won't guess |
| code | executeLogic | ✅ PASS | 55ms | Thiếu org_id. |
| code | executeLogic (logic throws) | ✅ PASS | 55ms | Thiếu org_id. |
| code | executeLogic (missing logic field) | ✅ PASS | 57ms | Thiếu org_id. |
| code | executeLogic (sandbox escape attempt) | ✅ PASS | 55ms | Thiếu org_id. |
| code | executeLogic (prototype pollution via args) | ✅ PASS | 59ms | Thiếu org_id. |
| file | list | ✅ PASS | 61ms | array(0) |
| file | search | ✅ PASS | 70ms | array(0) |
| file | search (empty query) | ✅ PASS | 55ms | array(0) |
| file | get (nonexistent id) | ✅ PASS | 55ms | File ID không hợp lệ: "test-sdk-nonexistent-file-id" |
| file | create | ✅ PASS | 61ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"test-sdk-probe-1786618522118.txt","content":"Auto-created by test-sdk to ve |
| file | get | ✅ PASS | 56ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"test-sdk-probe-1786618522118.txt","content":"Auto-created by test-sdk to ve |
| file | del | ✅ PASS | 76ms | {"success":true,"message":"File deleted successfully"} |
| file | del (already deleted) | ✅ PASS | 58ms | File not found or you don't have permission to delete it |
| file | create (path traversal filename) | ✅ PASS | 64ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"../../../../etc/test-sdk-probe-traversal.txt","content":"path traversal pro |
| file | del (path traversal probe cleanup) | ✅ PASS | 71ms | {"success":true,"message":"File deleted successfully"} |
| file | create (prototype pollution attempt) | ✅ PASS | 57ms | {"client":"wes_aivin_vn","workspace_id":"6a7b0853f16f8c62bc49955d","name":"proto-probe.txt","content":"proto probe","extension":"txt","creator_id":"6a |
| file | del (prototype pollution probe cleanup) | ✅ PASS | 60ms | {"success":true,"message":"File deleted successfully"} |
