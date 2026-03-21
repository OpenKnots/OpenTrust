# OpenTrust → OpenClaw Integration Blueprint

## Executive summary

OpenTrust should be integrated into OpenClaw as the **official memory layer reference implementation**.

This document replaces the earlier “replacement blueprint” framing with an integration blueprint.
The central question is no longer:
- should OpenTrust be discarded for a separate product?

The central question is now:
- how should OpenTrust evolve into OpenClaw’s standard memory infrastructure?

## Strategic position

OpenTrust should serve four roles at once:
- **reference implementation** for OpenClaw memory
- **product UX model** for memory health, traceability, and investigations
- **schema and retrieval blueprint** for durable evidence storage
- **integration target** for future OpenClaw agent and operator memory APIs

## What to preserve

### Preserve as core standard ideas
- dashboard-first information architecture
- local-first durable evidence storage
- saved investigations concept
- artifact explorer concept
- trace/workflow drill-down patterns
- lineage and provenance framing
- semantic + lexical + relational retrieval stack
- operator-first health and attention surfaces

### Preserve as integration qualities
- stable IDs and durable references
- incremental ingestion state
- explainable retrieval
- explicit distinction between raw evidence and derived insights
- auditability and export potential

## What to change from earlier framing

### Remove the detached-product posture
OpenTrust should not be framed as a separate data-ops product competing for scope with OpenClaw.

### Remove the “prototype to discard” assumption
OpenTrust should not be treated as a UX sketch whose technical model is irrelevant.

### Replace backend-driven narrative with standards-driven narrative
Runtime choices may evolve.
What must remain stable is:
- the memory model
- the retrieval contract
- provenance expectations
- operator trust guarantees

## Integration layers

### 1. Evidence ingestion layer
Feeds OpenTrust from OpenClaw runtime evidence:
- sessions
- traces
- workflows
- tool calls/results
- artifacts
- future curated memory entries

### 2. Storage layer
Durable local system of record with:
- schema migrations
- append-safe ingestion behavior
- stable references
- lineage edges
- freshness metadata

### 3. Retrieval layer
Supports OpenClaw-facing retrieval through:
- SQL / relational lookup
- FTS5 lexical recall
- semantic search
- ranking and provenance annotations

### 4. Insight layer
Supports derived outputs such as:
- anomaly surfacing
- drift detection
- freshness summaries
- evidence-backed insight cards
- operator metrics

### 5. API / interface layer
Future OpenClaw integration should expose:
- agent retrieval contracts
- operator search contracts
- writeback/promotion contracts
- health and indexing status endpoints
- reproducible artifact/reference handles

## Recommended integration roadmap

### Phase A — Stabilize the reference implementation
- keep current SQLite-based memory layer healthy
- harden ingestion and indexing flows
- improve docs, health views, and export safety

### Phase B — Define OpenClaw memory contracts
- retrieval response shape
- provenance metadata requirements
- confidence / uncertainty fields
- writeback and promotion contract
- health signal contract

### Phase C — Add curated memory and insight support
- curated memory entries
- retention classes
- review metadata
- derived insights with evidence links
- metrics and anomaly surfaces

### Phase D — Embed into OpenClaw UX and agent flows
- integrate retrieval into OpenClaw memory search
- integrate health and traceability surfaces into operator dashboards
- expose memory writeback/promote flows where appropriate
- package the memory layer under OpenClaw plugin conventions as a first-class plugin

## Proposed standards to formalize

### Retrieval response standard
Every retrieval result should eventually include:
- `id`
- `sourceType`
- `sourceRef`
- `title` or summary
- `snippet`
- `provenance`
- `confidence`
- `freshness`
- `whyMatched`
- `relatedRefs`

### Memory writeback standard
Every promoted memory item should eventually include:
- origin reference(s)
- author / system origin
- promotion reason
- retention class
- confidence / review metadata
- timestamps

### Health signal standard
Memory health should eventually track:
- ingestion freshness
- index freshness
- retrieval degradation
- source coverage
- stale pipelines
- failures and partial import state

## Decision

OpenTrust should be advanced as the OpenClaw memory layer standard.

The priority is not to replace it with a separate product thesis.
The priority is to:
- align scope
- formalize interfaces
- deepen reliability
- improve insight quality
- make it directly useful to OpenClaw itself
