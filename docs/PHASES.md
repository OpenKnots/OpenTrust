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
- artifact display in homepage and trace detail views

## Remaining recommended phases

### Phase 6 — Richer tool-result pairing
- pair tool calls with corresponding results where present
- improve tool lifecycle status mapping
- expose richer tool evidence in trace details
- link tool activity more clearly into artifact generation

### Phase 7 — Semantic indexing
- add sqlite-vec runtime table + embedding pipeline
- chunk traces, workflows, and artifacts
- support hybrid semantic + lexical investigations

### Phase 8 — Saved investigations and operator flows
- named investigations
- reusable SQL views/queries
- artifact explorer page
- deeper workflow detail pages
- export / backup / audit affordances
