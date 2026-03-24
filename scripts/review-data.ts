import { ensureMigrated, queryJson, queryOne } from "@/lib/opentrust/db";
import { getIngestionStates } from "@/lib/opentrust/ingestion-state";
import { getSemanticStatus } from "@/lib/opentrust/semantic";

ensureMigrated();

interface CountRow {
  count: number;
}

const tables = [
  "sessions",
  "traces",
  "events",
  "workflow_runs",
  "workflow_steps",
  "artifacts",
  "tool_calls",
  "trace_edges",
  "capabilities",
  "memory_entries",
  "saved_investigations",
] as const;

const counts: Record<string, number> = {};
for (const table of tables) {
  const row = queryOne<CountRow>(`SELECT COUNT(*) AS count FROM ${table};`);
  counts[table] = row?.count ?? 0;
}

const ftsRow = queryOne<CountRow>("SELECT COUNT(*) AS count FROM search_chunks;");
const ftsCount = ftsRow?.count ?? 0;

const ingestionStates = getIngestionStates();
const semanticStatus = getSemanticStatus();

const result = {
  counts,
  ftsCount,
  ingestionStates: ingestionStates.map((s) => ({
    source_key: s.source_key,
    source_kind: s.source_kind,
    last_run_at: s.last_run_at,
    last_status: s.last_status,
    imported_count: s.imported_count,
  })),
  semantic: {
    chunkCount: semanticStatus.chunkCount,
    vectorReady: semanticStatus.vectorReady,
    lastChunkRunAt: semanticStatus.lastChunkRunAt,
  },
};

console.log(JSON.stringify(result));
