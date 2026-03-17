import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson, queryOne } from "@/lib/opentrust/db";

export interface WorkflowStepRow {
  id: string;
  step_key: string;
  label: string | null;
  status: string;
  started_at: string | null;
  updated_at: string | null;
  ended_at: string | null;
}

export interface WorkflowArtifactRow {
  id: string;
  kind: string;
  uri: string;
  title: string | null;
  relation: string;
}

export interface WorkflowDetail {
  id: string;
  name: string;
  workflow_key: string | null;
  status: string;
  started_at: string;
  updated_at: string;
  ended_at: string | null;
  summary: string | null;
  source_kind: string | null;
  metadata_json: string;
  steps: WorkflowStepRow[];
  artifacts: WorkflowArtifactRow[];
}

export function getWorkflowDetail(workflowId: string): WorkflowDetail | null {
  ensureBootstrapped();

  const workflow = queryOne<Omit<WorkflowDetail, "steps" | "artifacts">>(
    `
      SELECT id, name, workflow_key, status, started_at, updated_at, ended_at, summary, source_kind, metadata_json
      FROM workflow_runs
      WHERE id = :workflowId
      LIMIT 1;
    `,
    { workflowId },
  );

  if (!workflow) return null;

  const steps = queryJson<WorkflowStepRow>(
    `
      SELECT id, step_key, label, status, started_at, updated_at, ended_at
      FROM workflow_steps
      WHERE workflow_run_id = :workflowId
      ORDER BY COALESCE(updated_at, started_at, ended_at, id) DESC
      LIMIT 120;
    `,
    { workflowId },
  );

  const artifacts = queryJson<WorkflowArtifactRow>(
    `
      SELECT artifacts.id, artifacts.kind, artifacts.uri, artifacts.title, run_artifacts.relation
      FROM run_artifacts
      JOIN artifacts ON artifacts.id = run_artifacts.artifact_id
      WHERE run_artifacts.run_id = :workflowId
      ORDER BY artifacts.created_at DESC;
    `,
    { workflowId },
  );

  return { ...workflow, steps, artifacts };
}
