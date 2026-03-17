import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ensureMigrated, escapeSqlString, queryOne, runSql } from "@/lib/opentrust/db";

function sqlJson(value: unknown) {
  return escapeSqlString(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function syncCapability(kind: "skill" | "plugin" | "soul" | "bundle", name: string, metadata: Record<string, unknown> = {}) {
  const id = `${kind}:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  runSql(`
    INSERT INTO capabilities (id, kind, name, metadata_json)
    VALUES (${escapeSqlString(id)}, ${escapeSqlString(kind)}, ${escapeSqlString(name)}, ${sqlJson(metadata)})
    ON CONFLICT(id) DO UPDATE SET metadata_json=excluded.metadata_json;
  `);
}

function syncSkillsFromDirectory(directory: string, sourceLabel: string) {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    syncCapability("skill", entry.name, { source: sourceLabel, path: path.join(directory, entry.name) });
  }
}

function syncPluginsFromConfig() {
  const configPath = path.join(process.env.HOME ?? "", ".openclaw", "openclaw.json");
  if (!existsSync(configPath)) return;

  try {
    const parsed = JSON.parse(readFileSync(configPath, "utf8")) as {
      plugins?: { entries?: Record<string, { enabled?: boolean }> };
    };
    for (const [name, config] of Object.entries(parsed.plugins?.entries ?? {})) {
      if (config?.enabled) {
        syncCapability("plugin", name, { source: "openclaw.json", enabled: true });
      }
    }
  } catch {
    // Keep bootstrap resilient.
  }
}

function syncSoulFromIdentity() {
  const identityPath = path.join(process.env.HOME ?? "", ".openclaw", "workspace", "IDENTITY.md");
  if (!existsSync(identityPath)) return;
  const text = readFileSync(identityPath, "utf8");
  const match = text.match(/- \*\*Name:\*\*\s*(.+)/);
  const name = match?.[1]?.trim() || "Nova";
  syncCapability("soul", name, { source: "IDENTITY.md" });
}

function seedBundleCapability() {
  syncCapability("bundle", "OpenTrust Field Manual", {
    source: "seed",
    description: "Starter bundle for local-first OpenClaw investigations.",
  });
}

function seedDemoTraceIfEmpty() {
  const row = queryOne<{ count: number }>("SELECT COUNT(*) AS count FROM traces;");
  if ((row?.count ?? 0) > 0) return;

  syncCapability("skill", "diffs", { source: "seed", role: "review" });
  syncCapability("plugin", "diffs", { source: "seed", role: "render" });

  const createdAt = nowIso();
  runSql(`
    INSERT INTO sessions (id, channel, agent_id, label, started_at, status, metadata_json)
    VALUES
      ('session:nova:seed-1', 'imessage', 'main', 'OpenTrust seed session', ${escapeSqlString(createdAt)}, 'complete', ${sqlJson({ source: 'seed' })}),
      ('session:nova:seed-2', 'discord', 'main', 'Workflow trace session', ${escapeSqlString(createdAt)}, 'active', ${sqlJson({ source: 'seed' })});

    INSERT INTO workflow_runs (id, name, workflow_key, status, started_at, updated_at, summary, metadata_json)
    VALUES
      ('workflow:seed:incident', 'Gateway incident review', 'incident-review', 'attention', ${escapeSqlString(createdAt)}, ${escapeSqlString(createdAt)}, 'Reviewing a gateway regression across sessions and tools.', ${sqlJson({ source: 'seed' })});

    INSERT INTO traces (id, session_id, workflow_run_id, title, status, summary, started_at, updated_at, metadata_json)
    VALUES
      ('trace:seed:1', 'session:nova:seed-1', 'workflow:seed:incident', 'Investigate gateway auth regression', 'attention', 'Trace links gateway auth failure to a client handshake change and review workflow.', ${escapeSqlString(createdAt)}, ${escapeSqlString(createdAt)}, ${sqlJson({ source: 'seed', confidence: 'high' })}),
      ('trace:seed:2', 'session:nova:seed-2', 'workflow:seed:incident', 'Stabilize release prep workflow', 'streaming', 'Trace follows release-prep work across rituals, agents, and generated artifacts.', ${escapeSqlString(createdAt)}, ${escapeSqlString(createdAt)}, ${sqlJson({ source: 'seed', confidence: 'medium' })});

    INSERT INTO workflow_steps (id, workflow_run_id, step_key, label, status, owner_session_id, started_at, updated_at, metadata_json)
    VALUES
      ('step:seed:1', 'workflow:seed:incident', 'triage', 'Initial triage', 'complete', 'session:nova:seed-1', ${escapeSqlString(createdAt)}, ${escapeSqlString(createdAt)}, ${sqlJson({ source: 'seed' })}),
      ('step:seed:2', 'workflow:seed:incident', 'repair', 'Repair and verify', 'active', 'session:nova:seed-2', ${escapeSqlString(createdAt)}, ${escapeSqlString(createdAt)}, ${sqlJson({ source: 'seed' })});

    INSERT INTO events (id, trace_id, session_id, kind, sequence_no, created_at, payload_json, text_preview)
    VALUES
      ('event:seed:1', 'trace:seed:1', 'session:nova:seed-1', 'message.user', 1, ${escapeSqlString(createdAt)}, ${sqlJson({ text: 'Fix the gateway auth regression.' })}, 'Fix the gateway auth regression.'),
      ('event:seed:2', 'trace:seed:1', 'session:nova:seed-1', 'tool.exec', 2, ${escapeSqlString(createdAt)}, ${sqlJson({ tool: 'exec', command: 'pnpm run check' })}, 'Ran pnpm run check'),
      ('event:seed:3', 'trace:seed:2', 'session:nova:seed-2', 'workflow.step', 1, ${escapeSqlString(createdAt)}, ${sqlJson({ step: 'repair', status: 'active' })}, 'Workflow repair step active');

    INSERT INTO tool_calls (id, trace_id, session_id, tool_name, arguments_json, result_json, status, started_at, finished_at)
    VALUES
      ('tool:seed:1', 'trace:seed:1', 'session:nova:seed-1', 'exec', ${sqlJson({ command: 'pnpm run build' })}, ${sqlJson({ exitCode: 0 })}, 'success', ${escapeSqlString(createdAt)}, ${escapeSqlString(createdAt)}),
      ('tool:seed:2', 'trace:seed:2', 'session:nova:seed-2', 'sessions_spawn', ${sqlJson({ runtime: 'acp', agentId: 'codex' })}, ${sqlJson({ status: 'queued' })}, 'running', ${escapeSqlString(createdAt)}, NULL);

    INSERT INTO artifacts (id, kind, uri, title, created_at, metadata_json)
    VALUES
      ('artifact:seed:1', 'doc', 'docs/ARCHITECTURE.md', 'Architecture spec', ${escapeSqlString(createdAt)}, ${sqlJson({ source: 'seed' })}),
      ('artifact:seed:2', 'repo', 'OpenKnots/OpenTrust', 'OpenTrust repository', ${escapeSqlString(createdAt)}, ${sqlJson({ source: 'seed' })});

    INSERT INTO run_artifacts (run_id, artifact_id, relation)
    VALUES
      ('workflow:seed:incident', 'artifact:seed:1', 'references'),
      ('workflow:seed:incident', 'artifact:seed:2', 'updates');

    INSERT INTO trace_edges (id, from_kind, from_id, edge_type, to_kind, to_id, created_at, metadata_json)
    VALUES
      ('edge:seed:1', 'trace', 'trace:seed:1', 'uses', 'capability', 'skill:diffs', ${escapeSqlString(createdAt)}, ${sqlJson({ source: 'seed' })}),
      ('edge:seed:2', 'trace', 'trace:seed:2', 'uses', 'capability', 'plugin:diffs', ${escapeSqlString(createdAt)}, ${sqlJson({ source: 'seed' })}),
      ('edge:seed:3', 'trace', 'trace:seed:2', 'produces', 'artifact', 'artifact:seed:2', ${escapeSqlString(createdAt)}, ${sqlJson({ source: 'seed' })});

    INSERT INTO trace_capabilities (trace_id, capability_id, role, created_at)
    VALUES
      ('trace:seed:1', 'skill:diffs', 'review', ${escapeSqlString(createdAt)}),
      ('trace:seed:2', 'plugin:diffs', 'render', ${escapeSqlString(createdAt)});

    INSERT INTO search_chunks (source_kind, source_id, title, body)
    VALUES
      ('trace', 'trace:seed:1', 'Investigate gateway auth regression', 'Trace links gateway auth failure to a client handshake change and review workflow.'),
      ('trace', 'trace:seed:2', 'Stabilize release prep workflow', 'Trace follows release-prep work across rituals, agents, and generated artifacts.');
  `);
}

export function ensureBootstrapped() {
  ensureMigrated();
  syncSkillsFromDirectory(path.join(process.env.HOME ?? "", ".openclaw", "workspace", "skills"), "workspace-skills");
  syncSkillsFromDirectory(path.join(process.env.HOME ?? "", ".nvm", "versions", "node", "v24.13.0", "lib", "node_modules", "openclaw", "skills"), "builtin-skills");
  syncPluginsFromConfig();
  syncSoulFromIdentity();
  seedBundleCapability();
  seedDemoTraceIfEmpty();
}
