import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson } from "@/lib/opentrust/db";
import { importRecentOpenClawSessions } from "@/lib/opentrust/import-openclaw";

export interface ImportedTraceRow {
  id: string;
  title: string | null;
  status: string;
  summary: string | null;
  session_label: string | null;
  updated_at: string;
}

export function getImportedSessionTraces(limit = 8): ImportedTraceRow[] {
  ensureBootstrapped();
  importRecentOpenClawSessions();

  return queryJson<ImportedTraceRow>(`
    SELECT
      traces.id,
      traces.title,
      traces.status,
      traces.summary,
      sessions.label AS session_label,
      traces.updated_at
    FROM traces
    LEFT JOIN sessions ON sessions.id = traces.session_id
    WHERE json_extract(traces.metadata_json, '$.source') = 'openclaw-session'
    ORDER BY traces.updated_at DESC
    LIMIT ${limit};
  `);
}
