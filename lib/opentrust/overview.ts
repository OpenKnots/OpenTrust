import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { queryJson, queryOne } from "@/lib/opentrust/db";

export interface OverviewCounts {
  sessions: number;
  traces: number;
  workflows: number;
  capabilities: number;
  artifacts: number;
}

export interface RecentTrace {
  id: string;
  title: string | null;
  status: string;
  summary: string | null;
  session_label: string | null;
  updated_at: string;
}

export interface CapabilitySummary {
  kind: string;
  count: number;
}

export interface OpenTrustOverview {
  counts: OverviewCounts;
  recentTraces: RecentTrace[];
  capabilityBreakdown: CapabilitySummary[];
  recentWorkflows: Array<{ id: string; name: string; status: string; summary: string | null }>;
  localDatabasePath: string;
}

export function getOverview(): OpenTrustOverview {
  ensureBootstrapped();

  const counts = queryOne<OverviewCounts>(`
    SELECT
      (SELECT COUNT(*) FROM sessions) AS sessions,
      (SELECT COUNT(*) FROM traces) AS traces,
      (SELECT COUNT(*) FROM workflow_runs) AS workflows,
      (SELECT COUNT(*) FROM capabilities) AS capabilities,
      (SELECT COUNT(*) FROM artifacts) AS artifacts;
  `) ?? { sessions: 0, traces: 0, workflows: 0, capabilities: 0, artifacts: 0 };

  const recentTraces = queryJson<RecentTrace>(`
    SELECT
      traces.id,
      traces.title,
      traces.status,
      traces.summary,
      sessions.label AS session_label,
      traces.updated_at
    FROM traces
    LEFT JOIN sessions ON sessions.id = traces.session_id
    ORDER BY traces.updated_at DESC
    LIMIT 6;
  `);

  const capabilityBreakdown = queryJson<CapabilitySummary>(`
    SELECT kind, COUNT(*) AS count
    FROM capabilities
    GROUP BY kind
    ORDER BY count DESC, kind ASC;
  `);

  const recentWorkflows = queryJson<{ id: string; name: string; status: string; summary: string | null }>(`
    SELECT id, name, status, summary
    FROM workflow_runs
    ORDER BY updated_at DESC
    LIMIT 4;
  `);

  const dbInfo = queryOne<{ file: string }>(`PRAGMA database_list;`) ?? { file: "storage/opentrust.sqlite" };

  return {
    counts,
    recentTraces,
    capabilityBreakdown,
    recentWorkflows,
    localDatabasePath: dbInfo.file,
  };
}
