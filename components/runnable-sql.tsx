"use client";

import { useState, useTransition } from "react";
import { Play, Loader2, AlertCircle } from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { DataTable } from "@/components/ui/data-table";
import { executeInvestigationSql } from "@/app/(app)/investigations/actions";

interface RunnableSqlBlockProps {
  sql: string;
}

export function RunnableSqlBlock({ sql }: RunnableSqlBlockProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    columns: string[];
    rows: Record<string, unknown>[];
    error?: string;
    rowCount: number;
  } | null>(null);

  function handleRun() {
    startTransition(async () => {
      const res = await executeInvestigationSql(sql);
      setResult(res);
    });
  }

  return (
    <div className="runnable-sql">
      <div className="runnable-sql__toolbar">
        <button
          className="btn btn--primary btn--sm"
          onClick={handleRun}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <Play size={14} />
          )}
          {isPending ? "Running…" : "Run query"}
        </button>
        {result && !result.error && (
          <span className="runnable-sql__row-count">
            {result.rowCount} row{result.rowCount !== 1 ? "s" : ""} returned
          </span>
        )}
      </div>

      <CodeBlock code={sql} language="sql" />

      {result?.error && (
        <div className="runnable-sql__error">
          <AlertCircle size={14} />
          <span>{result.error}</span>
        </div>
      )}

      {result && !result.error && result.rows.length > 0 && (
        <div className="runnable-sql__results">
          <DataTable columns={result.columns} rows={result.rows} />
        </div>
      )}

      {result && !result.error && result.rows.length === 0 && (
        <div className="runnable-sql__empty">Query returned no rows.</div>
      )}
    </div>
  );
}
