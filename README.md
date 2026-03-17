# OpenTrust

**OpenTrust** is a local-first traceability and intelligence layer for OpenClaw.

It is designed to answer questions like:
- what happened in this session?
- which workflow step caused this outcome?
- which skills or plugins influenced the trace?
- what artifacts were produced?
- what evidence supports this summary?

## V1 scaffold

This repository starts with:
- a polished Next.js shell
- a field-manual UI blueprint
- a local-first SQLite schema
- sqlite-vec + FTS5 architecture guidance
- a capability model covering skills, plugins, souls, and bundles

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
- sqlite-vec
- FTS5

## Development

```bash
pnpm install
pnpm run db:init
pnpm run ingest:openclaw
pnpm dev
```

## Database blueprint

See:
- `db/0001_init.sql`
- `docs/ARCHITECTURE.md`
- `docs/FIELD-MANUAL.md`
