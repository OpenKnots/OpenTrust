# OpenTrust — Phase Status

This document now distinguishes between the completed baseline plan and the remaining optional expansion work.

## Completed baseline checklist

### Phase 1 — Foundation shell

- [x] private OpenKnots repo
- [x] Next.js dashboard shell
- [x] local-first product framing
- [x] initial SQLite schema blueprint
- [x] capability model for skills, plugins, souls, and bundles
- [x] architecture and UX docs

### Phase 2 — Local runtime foundation

- [x] real SQLite runtime layer
- [x] schema bootstrap and migration path
- [x] capability sync from the local OpenClaw environment
- [x] homepage driven by local DB state
- [x] real-data-only mode with seeded evidence removed

### Phase 3 — Real evidence ingestion

- [x] OpenClaw session ingestion from local JSONL transcripts
- [x] FTS-backed investigation search
- [x] imported session traces in UI
- [x] trace detail route
- [x] rendering/query split from ingestion
- [x] safe search highlighting
- [x] explicit ingestion commands

### Phase 4 — Workflow clarity + ingestion state

- [x] cron/workflow ingestion from `~/.openclaw/cron/jobs.json` and `~/.openclaw/cron/runs/*.jsonl`
- [x] workflow source labeling in UI
- [x] ingestion state tracking
- [x] cursor and imported-count tracking for session + cron pipelines
- [x] secret-blocking pre-commit hook via Husky + Secretlint

### Phase 5 — Artifact extraction

- [x] artifact extraction from imported traces and workflows
- [x] artifact registry population
- [x] trace-to-artifact linkage
- [x] workflow-to-artifact linkage
- [x] artifact display in overview and trace detail views

### Phase 6 — Tool pairing and workflow surfaces

- [x] richer tool-call / tool-result pairing
- [x] workflow detail pages
- [x] artifact explorer page
- [x] saved investigations page
- [x] workflow and artifact navigation from the main dashboard

### Phase 7 — Lineage and incremental ingestion

- [x] event lineage edges for parent/tool-result relationships
- [x] incremental-style ingestion behavior using ingestion state cursors
- [x] per-session and per-cron-job ingestion tracking

### Phase 8 — Semantic indexing activation

- [x] semantic chunk staging for traces and artifacts
- [x] sqlite-vec activation via installed extension package
- [x] vector-ready semantic index status in UI
- [x] semantic indexing command
- [x] vector-backed fallback search path

## Incomplete expansion checklist

These are not blockers for the original roadmap, but they remain meaningful improvement opportunities.

- [ ] richer artifact normalization
- [ ] deeper workflow analytics
- [ ] editing and saving custom investigations from the UI
- [ ] stronger semantic embedding models and ranking quality
- [ ] exports, backups, and audit/report tooling
- [ ] capability explorer surface
- [ ] SQL / investigation studio surface
- [ ] better operator health views for ingestion and semantic indexing

## Evaluation

### What is working well

- The core local-first evidence platform is complete end-to-end: ingest, normalize, store, search, and inspect.
- The retrieval stack is strong for a local system: relational SQL, FTS5, and sqlite-vec are all present.
- The operational baseline is healthy: explicit ingestion commands, cursor-based incremental behavior, and secret scanning reduce risk.

### Where improvement is most valuable

- Investigation workflows need more authoring power. Saved investigations exist, but UI-based creation, editing, and repeatable analysis flows are still incomplete.
- The semantic layer is enabled, but activation is not the same as quality. Better embeddings, ranking evaluation, and relevance tuning would raise usefulness quickly.
- Artifact and workflow intelligence can go further. Normalization, analytics, and higher-level summaries would make the system more valuable for operator decision-making.
- Operator trust would improve with export, backup, audit, and health-report tooling so evidence can be preserved, reviewed, and shared safely.
- The documented UX vision is broader than the currently shipped surface area. A capability explorer and SQL/investigation studio are still strong candidates for the next major product step.
