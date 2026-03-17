# OpenTrust — V1 Architecture

## Goal

Build a local-first traceability and intelligence layer for OpenClaw that makes sessions, workflows, skills, plugins, souls, bundles, and artifacts queryable and explainable.

## Core architecture

### 1. Local evidence store
- SQLite as the system of record
- append-only event capture
- stable IDs for sessions, traces, workflows, capabilities, and artifacts

### 2. Retrieval layers
- FTS5 for exact / lexical search
- sqlite-vec for semantic search over normalized evidence chunks
- relational SQL for joins, lineage traversal, and operator investigations

### 3. Data model layers
- raw events
- derived traces
- workflow summaries
- capability registry
- artifact registry
- graph edges for lineage

### 4. Operator UX layers
- briefing layer
- trace explorer
- workflow ledger
- capability explorer
- SQL / investigation studio
- expandable raw evidence panes

## Why SQLite + sqlite-vec

This stack is local-first, portable, auditable, and operationally simple.

It avoids the complexity tax of a remote database while still supporting:
- real SQL joins
- event journaling
- hybrid search
- provenance-first querying
- exportable single-file storage

## Initial schema domains
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
- `search_chunks` (FTS5)
- `embedding_chunks_vec` (sqlite-vec runtime table)

## V1 roadmap

### Phase 1
- shell UI
- schema
- mock investigations
- architecture docs

### Phase 2
- OpenClaw session ingestion
- workflow ingestion
- skill/plugin registry sync
- trace projections

### Phase 3
- semantic indexing
- saved investigations
- evidence-backed summaries
- artifact lineage explorer
