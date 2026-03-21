import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson } from "@/lib/opentrust/db";

export interface TraceSummaryRow {
  id: string;
  title: string | null;
  status: string;
  summary: string | null;
  updated_at: string;
}

export interface SessionTraceGroup {
  session_id: string;
  session_label: string | null;
  trace_count: number;
  attention_count: number;
  last_updated: string;
  traces: TraceSummaryRow[];
}

export function getGroupedTraces(): SessionTraceGroup[] {
  ensureBootstrapped();

  const sessions = queryJson<{
    session_id: string;
    session_label: string | null;
    trace_count: number;
    attention_count: number;
    last_updated: string;
  }>(`
    SELECT
      sessions.id AS session_id,
      sessions.label AS session_label,
      COUNT(traces.id) AS trace_count,
      SUM(CASE WHEN traces.status = 'attention' THEN 1 ELSE 0 END) AS attention_count,
      MAX(traces.updated_at) AS last_updated
    FROM sessions
    JOIN traces ON traces.session_id = sessions.id
    GROUP BY sessions.id, sessions.label
    ORDER BY MAX(traces.updated_at) DESC
    LIMIT 60;
  `);

  return sessions.map((session) => {
    const traces = queryJson<TraceSummaryRow>(
      `
        SELECT id, title, status, summary, updated_at
        FROM traces
        WHERE session_id = :session_id
        ORDER BY updated_at DESC;
      `,
      { session_id: session.session_id },
    );

    return { ...session, traces };
  });
}
