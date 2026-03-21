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
  children: SessionTraceGroup[];
}

/**
 * Derive a parent session key from a colon-delimited session id.
 * e.g. "agent:main:code-editor:thread-2" → "agent:main:code-editor"
 *      "agent:main:main" → null  (top-level)
 *
 * We treat sessions with 3 segments (agent:X:Y) as roots and anything
 * deeper as a child of its prefix.
 */
function deriveParentKey(sessionId: string): string | null {
  const parts = sessionId.split(":");
  if (parts.length <= 3) return null;
  return parts.slice(0, -1).join(":");
}

function shortLabel(sessionId: string): string {
  const parts = sessionId.split(":");
  return parts[parts.length - 1];
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
    LIMIT 120;
  `);

  const groups: Map<string, SessionTraceGroup> = new Map();

  for (const session of sessions) {
    const traces = queryJson<TraceSummaryRow>(
      `
        SELECT id, title, status, summary, updated_at
        FROM traces
        WHERE session_id = :session_id
        ORDER BY updated_at DESC;
      `,
      { session_id: session.session_id },
    );

    groups.set(session.session_id, { ...session, traces, children: [] });
  }

  const roots: SessionTraceGroup[] = [];

  for (const group of groups.values()) {
    const parentKey = deriveParentKey(group.session_id);
    const parent = parentKey ? groups.get(parentKey) : null;

    if (parent) {
      if (!group.session_label) {
        group.session_label = shortLabel(group.session_id);
      }
      parent.children.push(group);
    } else {
      roots.push(group);
    }
  }

  for (const root of roots) {
    root.children.sort(
      (a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime(),
    );
  }

  return roots;
}
