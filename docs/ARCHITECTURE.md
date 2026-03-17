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
- sqlite-vec for vector search over locally staged semantic chunks
- relational SQL for joins, lineage traversal, and operator investigations

### 3. Data model layers
- raw events
- derived traces
- workflow summaries
- capability registry
- artifact registry
- ingestion state / cursors
- saved investigations
- graph edges for lineage
- semantic chunk + vector layer

### 4. Operator UX layers
- briefing layer
- trace explorer
- workflow explorer
- capability explorer
- SQL / investigation studio
- artifact explorer
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
- `saved_investigations`
- `search_chunks` (FTS5)
- `semantic_chunks`
- `semantic_index_state`
- `semantic_vec` / `semantic_vec_map` (runtime-managed when sqlite-vec loads)

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
- workflow detail route
- artifact explorer route
- saved investigations route
- tool-call/result pairing
- event lineage edges for parent/result relationships
- incremental-style ingestion through cursor checks
- sqlite-vec activation and semantic chunk indexing
- secret-blocking pre-commit hook

## Phase map

See `docs/PHASES.md` for the completed phase map and optional next expansions.
