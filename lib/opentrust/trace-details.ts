import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson, queryOne } from "@/lib/opentrust/db";

export interface TraceEventRow {
  id: string;
  kind: string;
  created_at: string;
  text_preview: string | null;
}

export interface TraceToolRow {
  id: string;
  tool_name: string;
  status: string;
  started_at: string;
  error_text: string | null;
}

export interface TraceDetail {
  id: string;
  title: string | null;
  status: string;
  summary: string | null;
  updated_at: string;
  session_label: string | null;
  metadata_json: string;
  events: TraceEventRow[];
  tools: TraceToolRow[];
}

export function getTraceDetail(traceId: string): TraceDetail | null {
  ensureBootstrapped();

  const trace = queryOne<Omit<TraceDetail, "events" | "tools">>(`
    SELECT
      traces.id,
      traces.title,
      traces.status,
      traces.summary,
      traces.updated_at,
      sessions.label AS session_label,
      traces.metadata_json
    FROM traces
    LEFT JOIN sessions ON sessions.id = traces.session_id
    WHERE traces.id = :traceId
    LIMIT 1;
  `, { traceId });

  if (!trace) return null;

  const events = queryJson<TraceEventRow>(`
    SELECT id, kind, created_at, text_preview
    FROM events
    WHERE trace_id = :traceId
    ORDER BY sequence_no ASC
    LIMIT 80;
  `, { traceId });

  const tools = queryJson<TraceToolRow>(`
    SELECT id, tool_name, status, started_at, error_text
    FROM tool_calls
    WHERE trace_id = :traceId
    ORDER BY started_at ASC;
  `, { traceId });

  return { ...trace, events, tools };
}
