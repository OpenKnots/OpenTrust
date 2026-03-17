import { execute, queryJson } from "@/lib/opentrust/db";

export interface SavedInvestigationRow {
  id: string;
  title: string;
  description: string | null;
  sql_text: string;
  created_at: string;
  updated_at: string;
}

const seedInvestigations: Array<Pick<SavedInvestigationRow, "id" | "title" | "description" | "sql_text">> = [
  {
    id: "investigation:cron-attention",
    title: "Cron runs needing attention",
    description: "Find cron-origin workflows that ended in error or attention states.",
    sql_text: `SELECT id, name, status, updated_at FROM workflow_runs WHERE source_kind = 'cron' AND status IN ('error', 'attention') ORDER BY updated_at DESC LIMIT 50;`,
  },
  {
    id: "investigation:recent-tool-errors",
    title: "Recent tool errors",
    description: "List traces with tool calls that produced errors.",
    sql_text: `SELECT traces.id, traces.title, tool_calls.tool_name, tool_calls.error_text FROM tool_calls JOIN traces ON traces.id = tool_calls.trace_id WHERE tool_calls.status = 'error' ORDER BY tool_calls.started_at DESC LIMIT 50;`,
  },
  {
    id: "investigation:artifact-heavy-traces",
    title: "Artifact-heavy traces",
    description: "Find traces that reference multiple artifacts.",
    sql_text: `SELECT trace_edges.from_id AS trace_id, COUNT(*) AS artifact_count FROM trace_edges WHERE trace_edges.from_kind = 'trace' AND trace_edges.to_kind = 'artifact' GROUP BY trace_edges.from_id ORDER BY artifact_count DESC LIMIT 50;`,
  },
];

function nowIso() {
  return new Date().toISOString();
}

export function ensureSavedInvestigationsSeeded() {
  const now = nowIso();
  for (const item of seedInvestigations) {
    execute(
      `
        INSERT INTO saved_investigations (id, title, description, sql_text, created_at, updated_at, metadata_json)
        VALUES (:id, :title, :description, :sqlText, :createdAt, :updatedAt, :metadataJson)
        ON CONFLICT(id) DO UPDATE SET
          title=excluded.title,
          description=excluded.description,
          sql_text=excluded.sql_text,
          updated_at=excluded.updated_at,
          metadata_json=excluded.metadata_json;
      `,
      {
        id: item.id,
        title: item.title,
        description: item.description,
        sqlText: item.sql_text,
        createdAt: now,
        updatedAt: now,
        metadataJson: JSON.stringify({ seeded: true }),
      },
    );
  }
}

export function getSavedInvestigations() {
  ensureSavedInvestigationsSeeded();
  return queryJson<SavedInvestigationRow>(`
    SELECT id, title, description, sql_text, created_at, updated_at
    FROM saved_investigations
    ORDER BY updated_at DESC;
  `);
}
