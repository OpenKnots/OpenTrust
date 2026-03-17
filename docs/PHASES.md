# OpenTrust — Phase Status

## Phase 1 — Foundation shell ✅

Shipped:
- private OpenKnots repo
- Next.js field-manual shell
- local-first product framing
- initial SQLite schema blueprint
- capability model for skills, plugins, souls, and bundles
- architecture and UX docs

## Phase 2 — Local runtime foundation ✅

Shipped:
- real SQLite runtime layer
- schema bootstrap and migration path
- capability sync from the local OpenClaw environment
- seeded sessions, traces, workflows, artifacts, and tool calls
- homepage driven by local DB state

## Phase 3 — Real evidence ingestion ✅

Shipped:
- OpenClaw session ingestion from local JSONL transcripts
- FTS-backed investigation search
- imported session traces in UI
- trace detail route
- runtime hardening
  - rendering/query split from ingestion
  - safe search highlighting
  - explicit ingestion commands

## Phase 4 — Workflow clarity + ingestion state ✅

Shipped:
- cron/workflow ingestion from `~/.openclaw/cron/jobs.json` and `~/.openclaw/cron/runs/*.jsonl`
- workflow source labeling in UI
- ingestion state tracking
- cursor and imported-count tracking for session + cron pipelines
- secret-blocking pre-commit hook via husky + secretlint

## Phase 5 — Artifact extraction ✅

Shipped:
- artifact extraction from imported traces and workflows
- artifact registry population
- trace → artifact linkage
- workflow → artifact linkage
- artifact display in overview and trace detail views

## Phase 6 — Tool pairing and workflow surfaces ✅

Shipped:
- richer tool-call / tool-result pairing
- workflow detail pages
- artifact explorer page
- saved investigations page
- workflow and artifact navigation from the field manual

## Phase 7 — Lineage and incremental ingestion ✅

Shipped:
- event lineage edges for parent/tool-result relationships
- incremental-style ingestion behavior using ingestion state cursors
- per-session and per-cron-job ingestion tracking

## Phase 8 — Semantic indexing activation ✅

Shipped:
- semantic chunk staging for traces and artifacts
- sqlite-vec activation via installed extension package
- vector-ready semantic index status in UI
- semantic indexing command
- vector-backed fallback search path

## Current status

The originally planned phases and steps are now complete.

Remaining work from here is optional expansion rather than completion work, for example:
- richer artifact normalization
- deeper workflow analytics
- editing/saving custom investigations from the UI
- stronger semantic embedding models
- exports, backups, and audit/report tooling
