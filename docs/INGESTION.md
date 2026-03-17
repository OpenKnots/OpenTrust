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
- `tool_calls`
- `search_chunks`
- `artifacts`
- `trace_edges`
- `ingestion_state`

### 2. Cron jobs and runs
- `~/.openclaw/cron/jobs.json`
- `~/.openclaw/cron/runs/*.jsonl`

Imported into:
- `workflow_runs`
- `workflow_steps`
- `artifacts`
- `run_artifacts`
- `ingestion_state`

### 3. Semantic indexing
Built from ingested local evidence into:
- `semantic_chunks`
- `semantic_index_state`
- `semantic_vec` / `semantic_vec_map` when sqlite-vec loads

## Runtime split

OpenTrust keeps these responsibilities separate:
- **bootstrap** — migrate schema and sync static capability metadata only
- **ingest** — pull in session/workflow evidence on demand or in background jobs
- **index** — build semantic chunks/vectors from ingested data
- **query** — render UI and investigations from already-ingested local data

OpenTrust now runs in **real-data-only** mode. Dummy seeded traces/workflows/artifacts are no longer created.

## Current commands

```bash
pnpm run db:init
pnpm run ingest:openclaw
pnpm run ingest:cron
pnpm run index:semantic
```

## Incremental behavior

OpenTrust now tracks per-source and per-item ingestion state so repeated imports can skip unchanged sessions/jobs based on stored cursors.

## Current artifact extraction

Current artifact extraction is heuristic and local-first.

It infers and registers:
- URLs
- repos (`owner/repo`)
- docs / file paths
- lightweight document references

## Current lineage support

OpenTrust currently records lineage edges for:
- event parent relationships when detectable
- tool-result to tool-call relationships
- trace to artifact references
- workflow to artifact references

## What remains from here

Completion work is done.

Next work is optional enhancement, such as:
- stronger artifact normalization
- richer event lineage coverage
- more advanced embedding models
- export/backup flows
- UI authoring for saved investigations
