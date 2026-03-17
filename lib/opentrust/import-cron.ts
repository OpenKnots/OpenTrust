import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { escapeSqlString, runSql } from "@/lib/opentrust/db";
import { recordIngestionState } from "@/lib/opentrust/ingestion-state";

interface CronJobEntry {
  id: string;
  name?: string;
  enabled?: boolean;
  schedule?: { kind?: string; expr?: string; tz?: string };
  state?: {
    nextRunAtMs?: number;
    lastRunAtMs?: number;
    lastStatus?: string;
    lastDurationMs?: number;
    consecutiveErrors?: number;
  };
  payload?: Record<string, unknown>;
  delivery?: Record<string, unknown>;
}

interface CronRunRecord {
  ts?: number;
  jobId?: string;
  action?: string;
  status?: string;
  error?: string;
  summary?: string;
  runAtMs?: number;
  durationMs?: number;
  nextRunAtMs?: number;
}

function cronRoot() {
  return path.join(process.env.HOME ?? "", ".openclaw", "cron");
}

function sqlJson(value: unknown) {
  return escapeSqlString(JSON.stringify(value));
}

function msToIso(value?: number) {
  return typeof value === "number" ? new Date(value).toISOString() : new Date().toISOString();
}

function loadJobs(): CronJobEntry[] {
  const file = path.join(cronRoot(), "jobs.json");
  if (!existsSync(file)) return [];
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as { jobs?: CronJobEntry[] };
    return parsed.jobs ?? [];
  } catch {
    return [];
  }
}

function loadRunRecords(jobId: string): CronRunRecord[] {
  const file = path.join(cronRoot(), "runs", `${jobId}.jsonl`);
  if (!existsSync(file)) return [];
  return readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(-80)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as CronRunRecord];
      } catch {
        return [];
      }
    });
}

function inferStatus(job: CronJobEntry, records: CronRunRecord[]) {
  const last = records.at(-1);
  return last?.status ?? job.state?.lastStatus ?? (job.enabled ? "idle" : "disabled");
}

function upsertWorkflow(job: CronJobEntry, records: CronRunRecord[]) {
  const workflowId = `workflow:cron:${job.id}`;
  const startedAt = msToIso(job.state?.lastRunAtMs ?? records[0]?.runAtMs ?? Date.now());
  const updatedAt = msToIso(job.state?.lastRunAtMs ?? records.at(-1)?.ts ?? Date.now());
  const status = inferStatus(job, records);
  const summary = records.at(-1)?.summary ?? records.at(-1)?.error ?? `Cron workflow ${job.name ?? job.id}`;

  runSql(`
    INSERT INTO workflow_runs (id, name, workflow_key, status, started_at, updated_at, ended_at, summary, source_kind, metadata_json)
    VALUES (
      ${escapeSqlString(workflowId)},
      ${escapeSqlString(job.name ?? job.id)},
      ${escapeSqlString(job.id)},
      ${escapeSqlString(status)},
      ${escapeSqlString(startedAt)},
      ${escapeSqlString(updatedAt)},
      NULL,
      ${escapeSqlString(summary)},
      'cron',
      ${sqlJson({ job, latestRecord: records.at(-1) ?? null })}
    )
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      workflow_key=excluded.workflow_key,
      status=excluded.status,
      updated_at=excluded.updated_at,
      summary=excluded.summary,
      source_kind=excluded.source_kind,
      metadata_json=excluded.metadata_json;

    DELETE FROM workflow_steps WHERE workflow_run_id = ${escapeSqlString(workflowId)};
  `);

  records.forEach((record, index) => {
    const stepId = `${workflowId}:step:${index + 1}`;
    runSql(`
      INSERT INTO workflow_steps (id, workflow_run_id, step_key, label, status, started_at, updated_at, ended_at, metadata_json)
      VALUES (
        ${escapeSqlString(stepId)},
        ${escapeSqlString(workflowId)},
        ${escapeSqlString(record.action ?? `run-${index + 1}`)},
        ${escapeSqlString(record.action ?? `Run ${index + 1}`)},
        ${escapeSqlString(record.status ?? "unknown")},
        ${escapeSqlString(msToIso(record.runAtMs ?? record.ts))},
        ${escapeSqlString(msToIso(record.ts ?? record.runAtMs))},
        ${record.status === "ok" || record.status === "error" || record.status === "skipped" ? escapeSqlString(msToIso(record.ts ?? record.runAtMs)) : "NULL"},
        ${sqlJson(record)}
      );
    `);
  });
}

export function importCronWorkflows(limit = 24) {
  const jobs = loadJobs().slice(0, limit);
  for (const job of jobs) {
    const records = loadRunRecords(job.id);
    upsertWorkflow(job, records);
  }

  const latestRunMs = jobs
    .map((job) => job.state?.lastRunAtMs ?? 0)
    .sort((a, b) => b - a)[0] ?? null;

  recordIngestionState({
    sourceKey: "openclaw:cron:main",
    sourceKind: "cron-jobs",
    cursorText: jobs[0]?.id ?? null,
    cursorNumber: latestRunMs,
    lastRunAt: new Date().toISOString(),
    lastStatus: "ok",
    importedCount: jobs.length,
    metadata: {
      limit,
      newestJobId: jobs[0]?.id ?? null,
      oldestJobId: jobs.at(-1)?.id ?? null,
    },
  });

  return jobs.length;
}
