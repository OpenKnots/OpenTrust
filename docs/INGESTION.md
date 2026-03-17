# OpenTrust — Phase 2 Ingestion Foundation

## What Phase 2 adds

Phase 2 introduces a real local runtime foundation:
- SQLite database file under `storage/opentrust.sqlite`
- automatic schema migration from `db/0001_init.sql`
- capability sync from the current OpenClaw environment
- first seeded traces / workflows / artifacts / tool calls
- live dashboard summaries rendered from the local database

## Bootstrap behavior

`ensureBootstrapped()` performs:
1. schema migration
2. skill sync from workspace skill folders
3. skill sync from built-in OpenClaw skill folders
4. plugin sync from `~/.openclaw/openclaw.json`
5. soul sync from `~/.openclaw/workspace/IDENTITY.md`
6. bundle seed for the OpenTrust starter bundle
7. initial trace/workflow seed when the database is empty

## Why this matters

This turns OpenTrust from a static shell into a local-first runtime that can now support:
- real ingestion
- trace projections
- capability lineage
- hybrid search later in Phase 3

## Next ingestion steps

- ingest actual OpenClaw session history
- map workflow events into `workflow_runs` + `workflow_steps`
- index tool calls from real traces
- normalize artifacts from repo/file/message outputs
- create chunking + embedding jobs for sqlite-vec
