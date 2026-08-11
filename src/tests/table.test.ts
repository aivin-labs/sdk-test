import { table } from "@aivin-labs/sdk";
import { runCheck, skip } from "../helpers/report";

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

    await runCheck("table", "getRows", () =>
      table.getRows({ workspace_id: workspaceId, project_id: projectId, table_id: tableId as string }),
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

    let snapshotId: string | undefined;

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

    await runCheck(
      "table",
      "smartQuery",
      () => table.smartQuery(`liệt kê tất cả row trong bảng ${tableId}`),
      { expectBusinessError: true },
    );

    await runCheck(
      "table",
      "batchUpdateByAI",
      () => table.batchUpdateByAI(`đổi title của mọi row trong bảng ${tableId} thành "ai updated"`),
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
    }
  }
}
