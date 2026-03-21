import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson } from "@/lib/opentrust/db";

export interface WorkflowRunSummary {
  id: string;
  name: string;
  status: string;
  summary: string | null;
  source_kind: string | null;
  updated_at: string;
}

export interface WorkflowKeyGroup {
  workflow_key: string | null;
  run_count: number;
  error_count: number;
  last_updated: string;
  runs: WorkflowRunSummary[];
}

export function getGroupedWorkflows(): WorkflowKeyGroup[] {
  ensureBootstrapped();

  const keys = queryJson<{
    workflow_key: string | null;
    run_count: number;
    error_count: number;
    last_updated: string;
  }>(`
    SELECT
      workflow_key,
      COUNT(*) AS run_count,
      SUM(CASE WHEN status IN ('error', 'attention') THEN 1 ELSE 0 END) AS error_count,
      MAX(updated_at) AS last_updated
    FROM workflow_runs
    GROUP BY workflow_key
    ORDER BY MAX(updated_at) DESC
    LIMIT 40;
  `);

  return keys.map((key) => {
    const runs = queryJson<WorkflowRunSummary>(
      `
        SELECT id, name, status, summary, source_kind, updated_at
        FROM workflow_runs
        WHERE workflow_key IS :workflow_key
        ORDER BY updated_at DESC;
      `,
      { workflow_key: key.workflow_key },
    );

    return { ...key, runs };
  });
}
