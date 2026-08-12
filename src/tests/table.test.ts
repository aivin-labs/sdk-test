import { call, table } from "@aivin-labs/sdk";
import { AssertionFailure, assertNoPrototypePollution, runCheck, skip } from "../helpers/report";

/**
 * Khác bản trước (chỉ đọc) — giờ tạo hẳn 1 bảng test thật (`test_sdk_probe_table`) trong try/finally
 * để LUÔN gọi `deleteTable` ở cuối dù bước nào giữa chừng có fail, không để lại bảng rác hiển thị
 * trong UI tenant. Mọi thao tác ghi (row/AI) đều chạy trên đúng bảng throwaway này nên an toàn.
 *
 * `ensureTable` (AI tự "find or create" theo purpose, không phải bảng cụ thể mình chỉ định) và
 * `rollback` (cần snapshot_id từ 1 lần mutate trước, không phải lúc nào cũng có) vẫn skip — không
 * kiểm soát được bảng nào bị động tới / không có snapshot chắc chắn để test.
 */
export async function testTable(workspaceId?: string, projectId?: string): Promise<void> {
  await runCheck(
    "table",
    "getAllTables",
    () => table.getAllTables({ workspace_id: workspaceId, project_id: projectId }),
    { expectBusinessError: true },
  );

  if (!workspaceId || !projectId) {
    for (const method of [
      "createTable", "getTable", "updateTable", "deleteTable", "addRow", "getRow", "updateRow",
      "getRows", "bulkAddRows", "batchUpdateRows", "batchDeleteRows", "deleteRow", "searchSemantic",
      "smartQuery", "batchUpdateByAI", "getTableStats", "countRows", "exportTable",
      "deduplicateTable", "backfillColumn", "formatRowsForContext",
    ]) {
      skip("table", method, "missing a real workspace_id/project_id");
    }
    skip("table", "ensureTable", "AI picks/creates a table by purpose on its own, no control over which table gets touched");
    skip("table", "rollback", "needs a snapshot_id from a prior mutation, not always available");
    return;
  }

  let tableId: string | undefined;
  let rowId: string | undefined;
  const bulkRowIds: string[] = [];

  try {
    await runCheck("table", "createTable", async () => {
      const created = await table.createTable({
        workspace_id: workspaceId,
        project_id: projectId,
        name: `test_sdk_probe_table_${Date.now()}`,
        description: "Auto-created by test-sdk to verify the round-trip, deleted again right after.",
        columns: [{ name: "title", type: "text" }],
      });
      tableId = (created as any)?.id ?? (created as any)?._id;
      return created;
    });

    if (!tableId) {
      skip("table", "*", "createTable returned no id (may have failed above) - skipping everything that needs a table_id");
      return;
    }

    await runCheck("table", "getTable", () => table.getTable({ workspace_id: workspaceId, table_id: tableId as string }));

    await runCheck("table", "updateTable", () =>
      table.updateTable({ workspace_id: workspaceId, table_id: tableId as string, description: "updated by test-sdk" }),
    );

    // getTable với table_id giả — không phải "chưa tạo table" như case getAllTables lúc thiếu
    // workspace_id/project_id, mà là table_id hợp lệ về hình thức nhưng không tồn tại. Phải là lỗi
    // nghiệp vụ "not found" sạch, không phải throw vì BE cố deref 1 document null.
    await runCheck(
      "table",
      "getTable (nonexistent table_id)",
      () => table.getTable({ workspace_id: workspaceId, table_id: "test-sdk-nonexistent-table-id" }),
      { expectBusinessError: true },
    );

    await runCheck("table", "addRow", async () => {
      const row = await table.addRow({
        workspace_id: workspaceId,
        project_id: projectId,
        table_id: tableId as string,
        data: { title: "probe row" },
      });
      rowId = (row as any)?.id ?? (row as any)?._id;
      return row;
    });

    if (rowId) {
      await runCheck("table", "getRow", () => table.getRow(rowId as string));
      await runCheck("table", "updateRow", () => table.updateRow(rowId as string, { title: "probe row updated" }));
    } else {
      skip("table", "getRow", "addRow returned no id");
      skip("table", "updateRow", "addRow returned no id");
    }

    // getRow với row_id giả — round-trip "not found" tách biệt khỏi case rowId thật ở trên, để chắc
    // lookup miss không tự throw kiểu transport (vd cố .toString() trên null).
    await runCheck("table", "getRow (nonexistent row_id)", () => table.getRow("test-sdk-nonexistent-row-id"), {
      expectBusinessError: true,
    });

    // addRow với data KHÔNG khớp column schema đã khai báo (`title` là kiểu "text", đưa cả 1 object
    // lồng vào) — trường hợp dữ liệu khó chứ không phải happy-path "probe row" như trên; phải là lỗi
    // validate nghiệp vụ sạch, không phải làm hỏng cả bảng hay throw serialize.
    await runCheck(
      "table",
      "addRow (schema-mismatched data)",
      () =>
        table.addRow({
          workspace_id: workspaceId,
          project_id: projectId,
          table_id: tableId as string,
          data: { title: { nested: "object instead of text" }, nonexistent_column: 123 },
        }),
      { expectBusinessError: true },
    );

    // Prototype pollution qua `__proto__` trong row data — thử "đầu độc" Object.prototype của
    // CHÍNH process test-sdk này qua vòng round-trip serialize/deserialize (gRPC/msgpack thường an
    // toàn hơn JSON.parse thô, nhưng bất kỳ tầng nào lỡ dùng `JSON.parse`/merge ngây thơ ở giữa đều
    // có thể dính). Assert `({} as any).polluted === undefined` NGAY SAU lời gọi để phát hiện global
    // prototype pollution thật, không chỉ "có throw hay không" như mọi case khác trong file này.
    await runCheck(
      "table",
      "addRow (prototype pollution attempt)",
      async () => {
        const res = await table.addRow({
          workspace_id: workspaceId,
          project_id: projectId,
          table_id: tableId as string,
          data: JSON.parse('{"title":"proto probe","__proto__":{"polluted":"yes"},"constructor":{"prototype":{"polluted2":"yes"}}}'),
        });
        assertNoPrototypePollution("this row");
        return res;
      },
      { expectBusinessError: true },
    );

    // Giá trị field trông giống MongoDB query operator (`$ne`/`$gt`) nhưng đây là DATA thật của 1
    // row (table cột "text"), không phải filter — nếu tầng lưu trữ bên dưới lỡ diễn giải nhầm thành
    // operator thay vì literal value, có thể match/ghi đè nhầm row khác (NoSQL injection qua field
    // value, khác hẳn injection qua tên field/query params thường gặp).
    await runCheck(
      "table",
      "addRow (NoSQL-operator-shaped value, as literal data)",
      () =>
        table.addRow({
          workspace_id: workspaceId,
          project_id: projectId,
          table_id: tableId as string,
          data: { title: JSON.stringify({ $ne: null, $gt: "" }) },
        }),
      { expectBusinessError: true },
    );

    // Object lồng rất sâu (60 tầng) — stack-safety cho bất kỳ recursive serializer/validator nào ở
    // giữa (JSON.stringify sâu vô hạn có thể RangeError: Maximum call stack size exceeded) — khác
    // hẳn case "schema-mismatched" ở trên (chỉ lồng 1 tầng).
    await runCheck(
      "table",
      "addRow (deeply nested data, 60 levels)",
      () => {
        let nested: any = { leaf: true };
        for (let i = 0; i < 60; i++) nested = { child: nested };
        return table.addRow({
          workspace_id: workspaceId,
          project_id: projectId,
          table_id: tableId as string,
          data: { title: "deep nest probe", nested_junk: nested },
        });
      },
      { expectBusinessError: true },
    );

    await runCheck("table", "getRows", () =>
      table.getRows({ workspace_id: workspaceId, project_id: projectId, table_id: tableId as string }),
    );

    // getRows với limit=0 — biên nhỏ nhất, phải trả mảng rỗng chứ không phải "limit 0 = không giới
    // hạn" (lỗi hay gặp khi code phía BE coi `0` là falsy rồi rơi về default).
    await runCheck(
      "table",
      "getRows (limit=0)",
      async () => {
        const rows = await table.getRows({
          workspace_id: workspaceId,
          project_id: projectId,
          table_id: tableId as string,
          limit: 0,
        } as any);
        if (Array.isArray(rows) && rows.length !== 0) {
          throw new AssertionFailure(`limit=0 should return an empty array, got ${rows.length} rows`);
        }
        return rows;
      },
      { expectBusinessError: true },
    );

    // getRows với limit CỰC LỚN (Number.MAX_SAFE_INTEGER) — khác hẳn limit=0 ở trên (biên nhỏ nhất);
    // đây là biên lớn nhất, kiểm tra BE có cap về 1 giá trị an toàn hay cố `LIMIT 9007199254740991`
    // thẳng xuống query engine (có thể timeout/OOM thay vì trả lỗi/kết quả sạch).
    await runCheck(
      "table",
      "getRows (limit=Number.MAX_SAFE_INTEGER)",
      () =>
        table.getRows({
          workspace_id: workspaceId,
          project_id: projectId,
          table_id: tableId as string,
          limit: Number.MAX_SAFE_INTEGER,
        } as any),
      { expectBusinessError: true },
    );

    await runCheck("table", "bulkAddRows", async () => {
      const res = await table.bulkAddRows({
        workspace_id: workspaceId,
        project_id: projectId,
        table_id: tableId as string,
        rows: [{ title: "bulk 1" }, { title: "bulk 2" }],
      });
      const ids = ((res as any)?.rows ?? res) as any[];
      if (Array.isArray(ids)) {
        for (const r of ids) {
          const id = r?.id ?? r?._id;
          if (id) bulkRowIds.push(id);
        }
      }
      return res;
    });

    // bulkAddRows với mảng rows rỗng — không có gì để chèn, phải là no-op sạch (mảng rỗng/lỗi
    // nghiệp vụ), không phải throw vì code cố lặp qua rồi build bulk-insert query rỗng.
    await runCheck(
      "table",
      "bulkAddRows (empty rows array)",
      () =>
        table.bulkAddRows({
          workspace_id: workspaceId,
          project_id: projectId,
          table_id: tableId as string,
          rows: [],
        }),
      { expectBusinessError: true },
    );

    // Batch LỚN (100 row cùng lúc) — khác hẳn batch nhỏ (2 row) ở trên, ép chạm giới hạn kích thước
    // batch/gRPC message thật thay vì chỉ chứng minh happy-path cho vài row. Tự dọn ngay trong chính
    // case này (không đưa vào `bulkRowIds` dùng chung ở dưới) để không ảnh hưởng các case
    // batchUpdateRows/batchDeleteRows phía sau vốn giả định đúng 2 row "bulk 1"/"bulk 2".
    await runCheck(
      "table",
      "bulkAddRows (large batch, 100 rows)",
      async () => {
        const rows = Array.from({ length: 100 }, (_, i) => ({ title: `large-batch-probe-${i}` }));
        const res = await table.bulkAddRows({
          workspace_id: workspaceId,
          project_id: projectId,
          table_id: tableId as string,
          rows,
        });
        const inserted = ((res as any)?.rows ?? res) as any[];
        const ids = Array.isArray(inserted) ? inserted.map((r: any) => r?.id ?? r?._id).filter(Boolean) : [];
        if (ids.length) await table.batchDeleteRows(ids); // dọn ngay, không để lại 100 row rác
        return { requested: rows.length, inserted: ids.length };
      },
      { expectBusinessError: true },
    );

    let snapshotId: string | undefined;

    // batchUpdateRows với filter không khớp row nào — khác hẳn case "bulk 1" ở dưới (chắc chắn có
    // match); phải trả 0 row bị update / lỗi nghiệp vụ sạch, không phải throw vì tưởng filter rỗng
    // nghĩa là "update tất cả".
    await runCheck(
      "table",
      "batchUpdateRows (filter matches nothing)",
      () =>
        table.batchUpdateRows({
          workspace_id: workspaceId,
          project_id: projectId,
          table_id: tableId as string,
          filter: { title: "this-value-does-not-exist-in-any-row" },
          update: { title: "should not apply to anything" },
        }),
      { expectBusinessError: true },
    );

    await runCheck("table", "batchUpdateRows", async () => {
      const res = await table.batchUpdateRows({
        workspace_id: workspaceId,
        project_id: projectId,
        table_id: tableId as string,
        filter: { title: "bulk 1" },
        update: { title: "bulk 1 updated" },
      });
      snapshotId = (res as any)?.snapshot_id;
      return res;
    });

    if (snapshotId) {
      await runCheck("table", "rollback", () => table.rollback(snapshotId as string));
    } else {
      skip("table", "rollback", "batchUpdateRows returned no snapshot_id to roll back to");
    }

    if (bulkRowIds.length) {
      await runCheck("table", "batchDeleteRows", () => table.batchDeleteRows(bulkRowIds));
    } else {
      skip("table", "batchDeleteRows", "bulkAddRows returned no ids to delete");
    }

    await runCheck("table", "searchSemantic", () =>
      table.searchSemantic({ query: "probe", table_id: tableId as string, limit: 5 }),
    );

    // searchSemantic với query rỗng — không có gì để embed/so khớp, phải là lỗi nghiệp vụ sạch
    // ("query required") thay vì round-trip 1 embedding rỗng xuống tận vector layer.
    await runCheck(
      "table",
      "searchSemantic (empty query)",
      () => table.searchSemantic({ query: "", table_id: tableId as string, limit: 5 }),
      { expectBusinessError: true },
    );

    // `table.smartQuery()`/`batchUpdateByAI()` sugar dùng timeout mặc định 30s của SDK - tier
    // "medium" thử `ollama` (local, http://localhost:11434) TRƯỚC rồi mới fallback sang `openllm`
    // (nvidia-hosted); ở môi trường không có Ollama chạy sẵn, bước thử-rồi-fail đó ăn hết luôn 30s
    // trước khi kịp fallback, khiến client tự huỷ với DEADLINE_EXCEEDED dù server rốt cuộc vẫn trả
    // được qua openllm. Dùng `call()` (escape hatch) truyền timeout dài hơn hẳn để có cơ hội thấy
    // kết quả thật thay vì lỗi timeout phía client.
    await runCheck(
      "table",
      "smartQuery",
      () => call("table.smartQuery", { query: `liệt kê tất cả row trong bảng ${tableId}` }, 90_000),
      { expectBusinessError: true },
    );

    await runCheck(
      "table",
      "batchUpdateByAI",
      () =>
        call(
          "table.batchUpdateByAI",
          { instruction: `đổi title của mọi row trong bảng ${tableId} thành "ai updated"` },
          90_000,
        ),
      { expectBusinessError: true },
    );

    await runCheck("table", "getTableStats", () =>
      table.getTableStats({ table_id: tableId as string, workspace_id: workspaceId, project_id: projectId }),
    );

    await runCheck("table", "countRows", () =>
      table.countRows({ table_id: tableId as string, workspace_id: workspaceId, project_id: projectId }),
    );

    await runCheck("table", "exportTable", () =>
      table.exportTable({ table_id: tableId as string, workspace_id: workspaceId, project_id: projectId }),
    );

    await runCheck("table", "deduplicateTable", () =>
      table.deduplicateTable({ table_id: tableId as string, workspace_id: workspaceId, project_id: projectId }),
    );

    await runCheck("table", "backfillColumn", () =>
      table.backfillColumn({
        table_id: tableId as string,
        workspace_id: workspaceId,
        project_id: projectId,
        column_key: "title",
        default_value: "backfilled",
      }),
    );

    await runCheck("table", "formatRowsForContext", () =>
      table.formatRowsForContext({ table_id: tableId as string, workspace_id: workspaceId, project_id: projectId }),
    );

    if (rowId) {
      await runCheck("table", "deleteRow", () => table.deleteRow(rowId as string));
    } else {
      skip("table", "deleteRow", "no row to delete");
    }

    skip("table", "ensureTable", "AI picks/creates a table by purpose on its own, no control over which table gets touched");
  } finally {
    if (tableId) {
      await runCheck("table", "deleteTable", () => table.deleteTable({ workspace_id: workspaceId, table_id: tableId as string }));

      // Gọi deleteTable lần 2 trên đúng table vừa xoá — idempotency của delete là thứ hay bị bỏ sót:
      // nhiều BE throw 500 khi cố xoá 1 document đã không còn tồn tại thay vì trả về lỗi nghiệp vụ
      // "not found" gọn/no-op. expectBusinessError vì cả throw nghiệp vụ lẫn no-op im lặng đều PASS.
      await runCheck(
        "table",
        "deleteTable (already deleted)",
        () => table.deleteTable({ workspace_id: workspaceId, table_id: tableId as string }),
        { expectBusinessError: true },
      );
    }
  }
}
