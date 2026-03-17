import { formatRelativeTime } from "@/lib/opentrust/format";
import type { IngestionStateRow } from "@/lib/opentrust/ingestion-state";
import type { RecentTrace, WorkflowSummary } from "@/lib/opentrust/overview";

export interface HealthSummary {
  attentionTraces: number;
  riskyWorkflows: number;
  stalePipelines: number;
  latestActivityLabel: string;
}

export function summarizeHealth(input: {
  traces: RecentTrace[];
  workflows: WorkflowSummary[];
  ingestionStates: IngestionStateRow[];
}): HealthSummary {
  const attentionTraces = input.traces.filter((trace) => trace.status === "attention").length;
  const riskyWorkflows = input.workflows.filter((workflow) => ["attention", "error", "failed"].includes(workflow.status)).length;
  const stalePipelines = input.ingestionStates.filter((state) => {
    if (!state.last_run_at) return true;
    const ms = new Date(state.last_run_at).getTime();
    if (Number.isNaN(ms)) return true;
    return Date.now() - ms > 1000 * 60 * 60 * 24;
  }).length;
  const latest = input.ingestionStates[0]?.last_run_at ?? input.traces[0]?.updated_at ?? null;

  return {
    attentionTraces,
    riskyWorkflows,
    stalePipelines,
    latestActivityLabel: latest ? formatRelativeTime(latest) : "unknown",
  };
}
