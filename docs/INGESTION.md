# OpenTrust — Ingestion Foundation

## Purpose

Ingestion exists to make OpenClaw memory reliable.

The standard is not “import some data.”
The standard is:
- capture the right evidence
- preserve provenance
- avoid duplication and drift
- expose freshness and failures clearly
- make retrieved answers traceable back to stored facts

## Current ingestion coverage

OpenTrust currently ingests from these local OpenClaw sources:

### 1. Main session transcripts
- `~/.openclaw/agents/main/sessions/sessions.json`
- linked session `*.jsonl` transcript files

Imported into:
- `sessions`
- `traces`
- `events`
- `tool_calls`
- `search_chunks`
- `artifacts`
- `trace_edges`
- `ingestion_state`

### 2. Cron jobs and runs
- `~/.openclaw/cron/jobs.json`
- `~/.openclaw/cron/runs/*.jsonl`

Imported into:
- `workflow_runs`
- `workflow_steps`
- `artifacts`
- `run_artifacts`
- `ingestion_state`

### 3. Semantic indexing
Built from ingested local evidence into:
- `semantic_chunks`
- `semantic_index_state`
- `semantic_vec` / `semantic_vec_map` when sqlite-vec loads

## Runtime split

OpenTrust keeps these responsibilities separate:
- **bootstrap** — migrate schema and sync static capability metadata only
- **ingest** — pull in session/workflow evidence on demand or in background jobs
- **index** — build semantic chunks/vectors from ingested data
- **query** — render UI and investigations from already-ingested local data

OpenTrust runs in **real-data-only** mode. Dummy seeded traces/workflows/artifacts are not part of the durable memory model.

## Current commands

```bash
pnpm run db:init
pnpm run ingest:openclaw
pnpm run ingest:cron
pnpm run index:semantic
```

## Incremental behavior

OpenTrust tracks per-source and per-item ingestion state so repeated imports can skip unchanged sessions/jobs based on stored cursors.

This is foundational for a memory standard because it improves:
- correctness
- performance
- repeatability
- operator trust

## Current artifact extraction

Current artifact extraction is heuristic and local-first.

It infers and registers:
- URLs
- repos (`owner/repo`)
- docs / file paths
- lightweight document references

## Current lineage support

OpenTrust currently records lineage edges for:
- event parent relationships when detectable
- tool-result to tool-call relationships
- trace to artifact references
- workflow to artifact references

## Requirements for the OpenClaw memory standard

To serve as the official memory layer, ingestion must expand and harden in these directions:

### 1. Source coverage
Support clear, well-scoped ingestion from:
- sessions and traces
- cron/workflow runs
- artifacts and generated outputs
- curated memory layers
- future insight/metric derivations
- future task/reminder/event state when appropriate

### 2. Provenance preservation
Every ingested record should preserve:
- source type
- source path or origin identifier
- timestamps
- causality / linkage where available
- ingestion run metadata
- update freshness

### 3. Failure visibility
The system should expose:
- failed ingestion runs
- partial imports
- stale sources
- indexing lag
- schema drift or parse failures
- skipped records with reasons when possible

### 4. Retrieval readiness
Ingestion should explicitly support downstream retrieval by producing:
- stable references
- searchable chunks
- semantic-ready chunks
- lineage edges
- artifact links
- metrics and freshness state

### 5. Controlled writeback
Future ingestion and memory promotion flows should support:
- derived insights written with provenance
- curated memory entries with review metadata
- retention and lifecycle labels
- safe promotion from transient events to long-term memory

## Strategic note

Ingestion is not the whole product.
But it is the non-negotiable foundation for:
- trustworthy retrieval
- agent memory
- operator insights
- metrics
- traceability
- evidence-backed answers

## What remains from here

The baseline ingestion work is complete.

Next work should focus on:
- stronger artifact normalization
- richer lineage coverage
- memory promotion / writeback flows
- ingestion health reporting
- retrieval-quality instrumentation
- export, backup, and audit support
