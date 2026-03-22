"use server";

import { isAuthenticatedRequest } from "@/lib/opentrust/auth";
import { runReadOnlySql } from "@/lib/opentrust/sql-runner";

export async function executeInvestigationSql(sql: string): Promise<{
  columns: string[];
  rows: Record<string, unknown>[];
  error?: string;
  rowCount: number;
}> {
  if (!(await isAuthenticatedRequest())) {
    return {
      columns: [],
      rows: [],
      error: "Unauthorized",
      rowCount: 0,
    };
  }

  try {
    const rows = runReadOnlySql(sql);
    const columns = Object.keys(rows[0] ?? {});
    return { columns, rows, rowCount: rows.length };
  } catch (err) {
    return {
      columns: [],
      rows: [],
      error: err instanceof Error ? err.message : String(err),
      rowCount: 0,
    };
  }
}
