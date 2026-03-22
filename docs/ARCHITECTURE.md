# OpenTrust — Architecture

## Goal

Build the **official OpenClaw memory layer standard**:
- a durable evidence store
- a reliable retrieval system
- a lineage and provenance graph
- an insight and metrics layer
- an operator interface for memory health, investigations, and traceability

OpenTrust is the memory substrate for OpenClaw.
It should make stored data and events reliably available to:
- operators
- product surfaces
- retrieval APIs
- agents
- investigations
- metrics and health systems

## Architectural thesis

A world-class memory layer for OpenClaw must support five capabilities at once:

1. **Capture** — ingest events, workflows, artifacts, and state changes safely
2. **Store** — preserve evidence durably with stable identifiers and migration support
3. **Retrieve** — support lexical, semantic, and relational retrieval
4. **Explain** — preserve provenance, lineage, and uncertainty
5. **Optimize** — derive health, insights, metrics, and dynamic intelligence over time

## Core architecture

### 1. Local Evidence Store
- SQLite as the current system of record
- append-safe event capture
- stable IDs for sessions, traces, workflows, capabilities, and artifacts
- dedicated runtime access layer via Node SQLite runtime
- schema repair and migration support for evolving local databases

Why this matters:
- local durability is essential for trustworthy memory
- replayability and auditability matter more than glossy abstractions
- memory should survive agent/session resets

### 2. Retrieval layers
- FTS5 for exact and lexical retrieval
- sqlite-vec for vector search over semantic chunks
- relational SQL for joins, filters, lineage traversal, and investigations

The standard should assume all three retrieval modes are necessary:
- lexical alone misses fuzzy recall
- semantic alone hides precise grounding
- SQL alone is too raw for most recall workflows

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
- health and metrics derivations
- insight surfaces derived from evidence, not free-floating narrative

### 4. OpenClaw integration layers
- session transcript ingestion
- cron/workflow ingestion
- memory-search support layer
- future agent-facing retrieval APIs
- future writeback flows for curated memory and promoted insights
- operator-facing dashboard routes

### 5. Operator UX layers
- briefing layer
- trace explorer
- workflow explorer
- saved investigations
- artifact explorer
- memory health view
- lineage and provenance panes
- insight and metrics surfaces
- expandable raw evidence panes

### 6. Desktop application shell
- Tauri v2 native wrapper around the Next.js frontend
- sidecar Node process for the memory runtime (migration path to native Rust runtime)
- platform-appropriate database path resolution
- system tray with health status and quick actions
- native OS notifications for ingestion and health events
- auto-update distribution via `tauri-plugin-updater`
- cross-platform builds: macOS `.dmg`, Windows `.msi`/`.exe`, Linux `.AppImage`/`.deb`

See `docs/DESKTOP-APPLICATION-PLAN.md` for the full plan.

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

### Implemented baseline
- local SQLite runtime
- explicit bootstrap / ingest / query separation
- real-data-only evidence flow
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

## Standard-level capabilities still needed

To become the full OpenClaw memory standard, OpenTrust should add or harden:

### A. Memory write paths
- promotion of important derived insights into curated memory layers
- durable labeling of memory importance and retention class
- support for agent-authored memory writebacks with review controls

### B. Retrieval contracts
- a stable API contract for OpenClaw memory search
- source-aware retrieval results
- confidence / provenance metadata in responses
- support for “why this result surfaced” explanations

### C. Health and metrics
- ingestion freshness metrics
- semantic indexing freshness metrics
- retrieval quality tracking
- stale-source detection
- coverage metrics by evidence type and source
- operator-facing alerts for memory degradation

### D. Insight derivation
- anomaly and drift detection
- summary and claim derivation tied to evidence provenance
- cluster- and timeline-aware exploration
- repeatable insight generation over traces/workflows/events

### E. Export and auditability
- backup/export flows
- audit/report generation
- reproducible evidence bundles
- safe sharing of non-secret operational memory outputs

## Design constraints

The OpenClaw memory layer must:
- remain explainable
- avoid hallucinated authority
- expose provenance clearly
- distinguish observation from interpretation
- make uncertainty visible
- keep local durability a first-class concern
- support future backends without discarding the memory model

## Desktop application architecture

OpenTrust is designed to run as a **native desktop application** via Tauri v2.

The architecture supports two runtime strategies:

### Sidecar strategy (initial)
The existing Node.js memory runtime runs as a sidecar process launched by Tauri. The frontend communicates with it via localhost HTTP, preserving the existing API route contracts. This requires no changes to the memory layer.

### Native Rust strategy (future)
The SQLite access layer is rewritten in Rust using `rusqlite`. Memory operations are exposed as Tauri IPC commands. The frontend calls `invoke()` instead of `fetch()`. This eliminates the Node dependency and reduces bundle size.

The sidecar strategy should ship first. The native Rust strategy is an optimization to evaluate once the desktop app is proven.

## Architectural position on future backends

Implementation details may evolve.
The memory standard should not.

That means:
- SQLite is the current durable local substrate
- additional runtimes or sync layers may be introduced later
- any future provider must preserve:
  - stable references
  - evidence provenance
  - queryability
  - lineage
  - retrieval quality
  - operator auditability

## Phase map

See `docs/PHASES.md` for the aligned roadmap from completed baseline to full OpenClaw memory standard.
