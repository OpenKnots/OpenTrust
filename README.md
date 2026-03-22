# OpenTrust

**OpenTrust** is the proposed **official memory layer standard for OpenClaw**.

It is a local-first, operator-grade memory and traceability system designed to make OpenClaw data:
- reliably captured
- durably stored
- safely retrieved
- richly linked
- explainable
- measurable
- operationally useful

OpenTrust is not just a search feature.
It is the memory substrate that should let OpenClaw answer questions like:
- what happened?
- what evidence supports that answer?
- what tool, workflow, or event caused the outcome?
- what should be remembered long-term?
- what changed over time?
- what is stale, missing, uncertain, or risky?
- what insights can be derived from the full event stream?

## Product position

OpenTrust should be treated as:
- the **OpenClaw memory layer reference implementation**
- the **architecture blueprint for storage + retrieval + traceability**
- the **standard model for durable evidence, insights, lineage, and metrics**
- the foundation for future OpenClaw memory APIs, operator UX, and agent-facing retrieval

It should **not** be framed as a detached product thesis competing with OpenClaw.
Its primary purpose is to strengthen OpenClaw itself.

## Core standard goals

The OpenClaw memory layer should provide:

### 1. Reliable storage
- append-safe ingestion of events and evidence
- durable local system of record
- schema evolution and migration support
- reproducible IDs and stable references
- auditable persistence

### 2. Reliable retrieval
- lexical retrieval for exact matches
- semantic retrieval for fuzzy recall
- structured SQL and relational joins for investigations
- lineage-aware lookup across sessions, workflows, artifacts, and capabilities
- ranking that prefers evidence over unsupported summaries

### 3. Explainable traceability
- event lineage
- tool-call / tool-result pairing
- workflow step attribution
- artifact provenance
- ingestion freshness and cursor state
- clear distinction between observed evidence and inferred conclusions

### 4. Dynamic intelligence
- memory-aware search
- derived summaries
- anomaly surfacing
- change detection
- operator health views
- metrics and insight generation over time

### 5. OpenClaw integration
- interoperable with OpenClaw session traces
- interoperable with cron/workflow runs
- compatible with future agent memory APIs
- suitable for direct use by OpenClaw UI surfaces and agent tools
- extensible toward official memory contracts and retrieval services
- planned for first-class packaging as an OpenClaw plugin

## Current implementation status

OpenTrust already includes:
- polished dashboard-first UI shell
- local SQLite runtime
- explicit bootstrap / ingest / query architecture
- OpenClaw session ingestion
- cron/workflow ingestion
- ingestion state tracking
- FTS-backed investigation search
- artifact extraction and registry population
- trace detail pages
- workflow detail pages
- artifact explorer
- saved investigations
- semantic chunk indexing
- sqlite-vec activation
- secret-blocking pre-commit protection

## Strategic direction

The correct long-term direction is:

- keep **OpenTrust’s memory model, evidence framing, lineage, and operator UX**
- align all roadmap language around **OpenClaw memory infrastructure**
- treat any future backend shifts as implementation choices, not product redefinitions

That means:
- SQLite-first local durability remains valuable
- other runtimes or providers may be added later
- but the governing idea is the **OpenClaw memory layer standard**

## Current execution priority

OpenTrust is currently in a **pre-prerequisite holding pattern**.

The upstream priority order is:
1. Tauri
2. persistence
3. reliable run completion

Until those are dependable, OpenTrust should focus on:
- docs alignment
- scope guardrails
- low-risk cleanup
- preserving a truthful baseline

It should **not** pretend to outrank runtime reliability work.

## Principles

- **OpenClaw-first**
- **local-first durability**
- **evidence-backed answers**
- **progressive disclosure**
- **traceability over vibes**
- **operator-grade reliability**
- **memory as infrastructure, not garnish**

## Getting started

The fastest way to set up OpenTrust is the interactive setup script. It walks through every step, explains what each one does, detects prior work, and lets you skip anything:

```bash
./scripts/setup.sh
```

### Prerequisites

- **Node.js 18+**
- **pnpm** — install with `npm install -g pnpm` or see [pnpm.io](https://pnpm.io/installation)
- **git** — required for Husky pre-commit hooks

### Manual setup

If you prefer to run each step yourself:

```bash
pnpm install                  # install deps + set up Husky hooks
cp .env.example .env          # create local env (optional overrides)
pnpm run db:init              # create/migrate SQLite database
pnpm run ingest:openclaw      # import OpenClaw session transcripts
pnpm run ingest:cron          # import cron/workflow run history
pnpm run index:semantic       # build semantic chunk + vector index
pnpm dev                      # start the dev server on localhost:3000
```

### Environment variables

Optional overrides are documented in `.env.example`. The only current variable is:

| Variable | Purpose |
|----------|---------|
| `OPENTRUST_SQLITE_VEC_PATH` | Override path to the sqlite-vec extension. Leave unset unless auto-detection fails. |

### Available scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Next.js dev server |
| `pnpm run db:init` | Create/migrate the SQLite database |
| `pnpm run ingest:openclaw` | Import recent OpenClaw sessions |
| `pnpm run ingest:cron` | Import cron workflow run history |
| `pnpm run index:semantic` | Rebuild semantic chunks + vector index |
| `pnpm run typecheck` | Run `tsc --noEmit` |
| `pnpm run secrets:check` | Scan the repo for leaked secrets |

## Safety

This repo includes a pre-commit secret scan:
- Husky pre-commit hook
- Secretlint ruleset

OpenTrust is intended for localhost-only use. The `/api/memory/*` routes are unauthenticated by design and should not be exposed to untrusted networks.

Run manually with:

```bash
pnpm run secrets:check
```

## Docs

- `docs/ARCHITECTURE.md`
- `docs/FIELD-MANUAL.md`
- `docs/INGESTION.md`
- `docs/PHASES.md`
- `docs/EXECUTION-PIPELINE.md`
- `docs/SCOPE-GUARDRAILS.md`
- `docs/CONVEX-PRODUCT-SPEC.md`
- `docs/CONVEX-REPLACEMENT-BLUEPRINT.md`
- `docs/MEMORY-LAYER-STANDARD.md`
- `docs/MEMORY-API-CONTRACT.md`
- `docs/CURATED-MEMORY-DESIGN.md`
- `docs/PHASE-9-IMPLEMENTATION-PLAN.md`
- `docs/OPENCLAW-PLUGIN-PACKAGING.md`
- `docs/PLUGIN-READY-REFACTOR-PLAN.md`
- `docs/OPENCLAW-PLUGIN-DRAFT-ARTIFACTS.md`
- `docs/POST-PREREQUISITE-PR-BACKLOG.md`
- `docs/UI-UX-REVAMP-PLAN.md`
- `plugin-drafts/opentrust/`
- `docs/PLUGIN-DRAFT-RUNTIME-MAP.md`
- `docs/PLUGIN-PROMOTION-CHECKLIST.md`
- `docs/PLUGIN-CHANGE-TRACKER.md`
- `docs/DOCS-ALIGNMENT-NOTES.md`
- `db/0001_init.sql`
- `SECURITY.md`
