import { queryJson } from "@/lib/opentrust/db";
import { runReadOnlySql } from "@/lib/opentrust/sql-runner";

export interface SavedInvestigationRow {
  id: string;
  title: string;
  description: string | null;
  sql_text: string;
  created_at: string;
  updated_at: string;
}

export interface InvestigationTemplate {
  id: string;
  title: string;
  description: string;
  sql_text: string;
}

const investigationTemplates: InvestigationTemplate[] = [
  {
    id: "template:cron-attention",
    title: "Cron runs needing attention",
    description: "Find cron-origin workflows that ended in error or attention states.",
    sql_text: `SELECT id, name, status, updated_at FROM workflow_runs WHERE source_kind = 'cron' AND status IN ('error', 'attention') ORDER BY updated_at DESC LIMIT 50;`,
  },
  {
    id: "template:recent-tool-errors",
    title: "Recent tool errors",
    description: "List traces with tool calls that produced errors.",
    sql_text: `SELECT traces.id, traces.title, tool_calls.tool_name, tool_calls.error_text FROM tool_calls JOIN traces ON traces.id = tool_calls.trace_id WHERE tool_calls.status = 'error' ORDER BY tool_calls.started_at DESC LIMIT 50;`,
  },
  {
    id: "template:artifact-heavy-traces",
    title: "Artifact-heavy traces",
    description: "Find traces that reference multiple artifacts.",
    sql_text: `SELECT trace_edges.from_id AS trace_id, COUNT(*) AS artifact_count FROM trace_edges WHERE trace_edges.from_kind = 'trace' AND trace_edges.to_kind = 'artifact' GROUP BY trace_edges.from_id ORDER BY artifact_count DESC LIMIT 50;`,
  },
];

export function getSavedInvestigations() {
  return queryJson<SavedInvestigationRow>(`
    SELECT id, title, description, sql_text, created_at, updated_at
    FROM saved_investigations
    ORDER BY updated_at DESC;
  `);
}

export function getInvestigationTemplates() {
  return investigationTemplates;
}

export function previewInvestigationSql(sql: string, limit = 8) {
  const trimmed = sql.trim().replace(/;\s*$/, "");
  return runReadOnlySql(`SELECT * FROM (${trimmed}) LIMIT ${limit};`);
}
