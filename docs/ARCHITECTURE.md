# OpenTrust — Architecture

## Goal

Build a local-first traceability and intelligence layer for OpenClaw that makes sessions, workflows, skills, plugins, souls, bundles, and artifacts queryable and explainable.

## Core architecture

### 1. Local evidence store
- SQLite as the system of record
- append-only event capture
- stable IDs for sessions, traces, workflows, capabilities, and artifacts
- dedicated runtime access layer via Node SQLite runtime
- schema repair/migration support for evolving local databases

### 2. Retrieval layers
- FTS5 for exact / lexical search
- sqlite-vec planned for semantic search over normalized evidence chunks
- relational SQL for joins, lineage traversal, and operator investigations

### 3. Data model layers
- raw events
- derived traces
- workflow summaries
- capability registry
- artifact registry
- ingestion state / cursors
- graph edges for lineage

### 4. Operator UX layers
- briefing layer
- trace explorer
- workflow ledger
- capability explorer
- SQL / investigation studio
- artifact visibility in overview + trace drill-down
- expandable raw evidence panes

## Current schema domains
- `sessions`
- `traces`
- `events`
- `workflow_runs`
- `workflow_steps`
- `capabilities`
- `trace_capabilities`
- `tool_calls`
- `artifacts`
- `run_artifacts`
- `trace_edges`
- `ingestion_state`
- `search_chunks` (FTS5)
- `embedding_chunks_vec` (planned sqlite-vec runtime table)

## Why SQLite + sqlite-vec

This stack is local-first, portable, auditable, and operationally simple.

It avoids the complexity tax of a remote database while still supporting:
- real SQL joins
- event journaling
- hybrid search
- provenance-first querying
- exportable single-file storage

## What is implemented today

### Implemented
- local SQLite runtime
- explicit bootstrap / ingest / query separation
- session transcript ingestion
- cron/workflow ingestion
- ingestion state tracking
- artifact extraction from imported evidence
- investigation search with FTS5
- trace detail route
- secret-blocking pre-commit hook

### Not yet implemented
- sqlite-vec embedding pipeline
- saved investigations
- dedicated artifact explorer page
- deep workflow detail pages
- richer tool-result pairing and full parent-child event lineage

## Phase map

See `docs/PHASES.md` for the shipped phases and remaining roadmap.
