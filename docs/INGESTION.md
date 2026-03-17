# OpenTrust — Ingestion Foundation

## Current ingestion coverage

OpenTrust currently ingests from these local OpenClaw sources:

### 1. Main session transcripts
- `~/.openclaw/agents/main/sessions/sessions.json`
- linked session `*.jsonl` transcript files

Imported into:
- `sessions`
- `traces`
- `events`
- `tool_calls` (observed tool calls)
- `search_chunks`
- `artifacts` (inferred)
- `trace_edges`

### 2. Cron jobs and runs
- `~/.openclaw/cron/jobs.json`
- `~/.openclaw/cron/runs/*.jsonl`

Imported into:
- `workflow_runs`
- `workflow_steps`
- `artifacts` (inferred)
- `run_artifacts`

### 3. Ingestion state tracking
Imported into:
- `ingestion_state`

Tracks:
- source key
- source kind
- cursor text
- cursor number
- last run time
- last status
- imported count
- metadata JSON

## Runtime split

OpenTrust keeps these responsibilities separate:
- **bootstrap** — migrate schema and sync static capability metadata
- **ingest** — pull in session/workflow evidence on demand or in background jobs
- **query** — render UI and investigations from already-ingested local data

## Current commands

```bash
pnpm run db:init
pnpm run ingest:openclaw
pnpm run ingest:cron
```

## Artifact extraction

Current artifact extraction is heuristic and safe-by-default.

It infers and registers:
- URLs
- repos (`owner/repo`)
- docs / file paths
- lightweight document references

This is enough for first-pass traceability, but it is not yet a full structured artifact parser.

## What remains

### Next highest-priority ingestion work
1. richer tool-result pairing in imported traces
2. better parent/child event linkage
3. incremental ingestion based on cursors instead of simple recent-window imports
4. more structured artifact extraction
5. sqlite-vec chunking + embedding jobs
