# OpenTrust

**OpenTrust** is a local-first traceability and intelligence layer for OpenClaw.

It is designed to answer questions like:
- what happened in this session?
- which workflow step caused this outcome?
- which skills or plugins influenced the trace?
- what artifacts were produced?
- what evidence supports this summary?

## Current status

OpenTrust now includes:
- polished field-manual UI shell
- local SQLite runtime
- explicit bootstrap / ingest / query architecture
- local OpenClaw session ingestion
- cron/workflow ingestion
- ingestion state tracking
- FTS-backed investigation search
- artifact extraction and registry population
- trace detail pages
- secret-blocking pre-commit protection

## Principles

- **local-first**
- **progressive disclosure**
- **beginner-friendly default UX**
- **real SQL, not toy query syntax**
- **evidence-backed traceability**

## Stack

- Next.js 16
- React 19
- TypeScript
- SQLite
- FTS5
- sqlite-vec (planned)

## Development

```bash
pnpm install
pnpm run db:init
pnpm run ingest:openclaw
pnpm run ingest:cron
pnpm dev
```

## Safety

This repo includes a pre-commit secret scan:
- Husky pre-commit hook
- Secretlint ruleset

Run manually with:

```bash
pnpm run secrets:check
```

## Docs

- `docs/ARCHITECTURE.md`
- `docs/FIELD-MANUAL.md`
- `docs/INGESTION.md`
- `docs/PHASES.md`
- `db/0001_init.sql`
