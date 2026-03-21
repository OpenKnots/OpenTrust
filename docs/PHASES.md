# OpenTrust — Phase Status

This document defines the roadmap for **OpenTrust as the official OpenClaw memory layer standard**.

It intentionally replaces the split narrative between:
- “OpenTrust as a standalone product idea”
- “OpenTrust as a prototype to discard”

The aligned plan is:
- OpenTrust is the **reference memory layer** for OpenClaw
- the current implementation is the **completed baseline**
- future phases deepen it into a world-class storage, retrieval, insight, and traceability system

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

## Next aligned roadmap

These are no longer “misc optional ideas.”
They are the next phases required to turn the baseline into the full OpenClaw memory standard.

### Phase 9 — Memory writeback and curation
Goal: support durable promotion from raw event streams to curated memory.

Primary design docs:
- `docs/MEMORY-API-CONTRACT.md`
- `docs/CURATED-MEMORY-DESIGN.md`
- `docs/PHASE-9-IMPLEMENTATION-PLAN.md`

Includes:
- [ ] curated memory entities and retention labels
- [ ] promotion flows from traces/artifacts to long-term memory
- [ ] review metadata for promoted memory
- [ ] write contracts suitable for future OpenClaw memory APIs
- [ ] distinction between transient evidence and curated memory

### Phase 10 — Retrieval quality and ranking
Goal: make storage useful by improving answer quality.

Includes:
- [ ] stronger semantic embedding models and ranking quality
- [ ] retrieval-quality evaluation flows
- [ ] source-aware ranking and provenance-weighted retrieval
- [ ] confidence / uncertainty metadata in retrieval responses
- [ ] “why this result surfaced” explanations

### Phase 11 — Insight and metrics layer
Goal: derive dynamic intelligence from the memory substrate.

Includes:
- [ ] richer artifact normalization
- [ ] deeper workflow analytics
- [ ] event and workflow drift detection
- [ ] operator metrics for freshness, coverage, and reliability
- [ ] insight surfaces tied directly to evidence and provenance

### Phase 12 — Memory health and operator trust
Goal: make memory reliability operationally visible.

Includes:
- [ ] better operator health views for ingestion and semantic indexing
- [ ] stale-pipeline detection
- [ ] missing-index / degraded-search indicators
- [ ] backup, export, audit, and report tooling
- [ ] evidence preservation and reproducible report bundles

### Phase 13 — Authoring and investigation power
Goal: let operators work directly with the memory layer.

Includes:
- [ ] editing and saving custom investigations from the UI
- [ ] SQL / investigation studio surface
- [ ] richer capability explorer surface
- [ ] repeatable investigation presets and query workflows
- [ ] better comparative and timeline-driven analysis tools

### Phase 14 — Official OpenClaw integration standard
Goal: expose OpenTrust cleanly as OpenClaw’s memory infrastructure.

Includes:
- [ ] stable memory API contracts for OpenClaw retrieval
- [ ] agent-facing retrieval interface design
- [ ] memory writeback / promotion interface design
- [ ] integration with OpenClaw operator surfaces
- [ ] clear standards for source metadata, provenance, and retrieval response shape

## Evaluation

### What is already strong
- The core local-first evidence platform is complete end-to-end: ingest, normalize, store, search, and inspect.
- The retrieval stack is strong for a local system: relational SQL, FTS5, and sqlite-vec are all present.
- The operational baseline is healthy: explicit ingestion commands, cursor-based incremental behavior, and secret scanning reduce risk.
- The current system is already a credible foundation for an official OpenClaw memory layer.

### What now matters most
- Memory authoring and writeback are still missing.
- Retrieval quality needs to become measurable and tunable, not just enabled.
- Insight and metrics should be first-class derived products of the memory substrate.
- Memory health, export, and auditability must improve for operator trust.
- Integration contracts with OpenClaw should become explicit so this can serve as the official standard rather than only an internal prototype.

## Decision

OpenTrust should be developed as:
- the OpenClaw memory layer reference implementation
- the standard for durable evidence, retrieval, lineage, and insights
- the basis for future OpenClaw memory APIs and operator-facing memory UX

That is the governing scope going forward.
