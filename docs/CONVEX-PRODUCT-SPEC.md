# OpenClaw Memory Layer Standard — Product Spec

## Working status

This document defines the **product-level standard** for OpenTrust as OpenClaw’s memory layer.

It supersedes the earlier idea of a separate Convex-native replacement product as the primary strategic direction.
Backend/runtime changes may still happen later, but the product contract should stay centered on OpenClaw memory.

## 1. Product thesis

Build a **world-class memory layer for OpenClaw** that:
- stores events and evidence reliably
- retrieves them accurately
- preserves lineage and provenance
- exposes health, freshness, and uncertainty
- derives actionable insights and metrics
- supports both operators and agents

This should feel:
- operator-grade
- trustworthy
- explainable
- dynamic
- dashboard-first
- evidence-backed

## 2. Primary audience

### Core audiences
- OpenClaw operators
- developers working on OpenClaw features and tooling
- agent builders
- technical investigators and maintainers
- advanced users who need reliable recall and traceability

### Usage modes
- inspecting what happened in sessions or workflows
- diagnosing agent/tool behavior
- retrieving past context safely
- investigating incidents or regressions
- promoting important information into durable memory
- understanding health, freshness, and confidence of stored memory

## 3. MVP standard promise

A user or agent should be able to:
- ingest OpenClaw evidence safely
- search and retrieve it reliably
- inspect lineage and provenance
- review artifacts and workflows
- see freshness and health state
- run saved investigations
- begin deriving trustworthy insights from stored evidence

## 4. Product pillars

### A. Durable first
If memory is not durable, it is not memory.

### B. Retrieval must be evidence-backed
Every surfaced result should preserve grounding and explainability.

### C. Lineage matters
The system should show what caused what, not just list records.

### D. Insight must stay honest
Derived summaries and metrics should expose uncertainty and provenance.

### E. OpenClaw-native integration
The memory layer should fit naturally into OpenClaw’s agent and operator workflows.

## 5. Core user stories

### Storage
- As an operator, I want OpenClaw events and evidence stored durably with stable identifiers.

### Retrieval
- As an agent, I want to retrieve relevant prior evidence with clear provenance and confidence.

### Traceability
- As an operator, I want to know which tool, workflow, or event produced an outcome.

### Insight
- As an operator, I want to surface changes, anomalies, and useful patterns from stored evidence.

### Health
- As an operator, I want to see if ingestion, indexing, or retrieval quality is degraded.

### Curation
- As an operator, I want to promote important evidence into longer-lived memory intentionally.

## 6. Information architecture

## Primary routes
- `/` — overview / briefing
- `/traces` — session and trace explorer
- `/traces/[id]` — trace detail
- `/workflows` — workflow ledger
- `/workflows/[id]` — workflow detail
- `/artifacts` — artifact explorer
- `/investigations` — saved investigations
- `/health` — memory health and freshness
- `/insights` — derived insights and metrics
- `/admin/memory` — future operator administration / maintenance surface

## Dashboard modules
- ingestion freshness
- retrieval health
- recent traces
- risky workflows
- recent artifacts
- attention panel
- saved investigations preview
- semantic index status
- derived insight pulse

## 7. Domain model

### Core entities
- `sessions`
- `traces`
- `events`
- `workflowRuns`
- `workflowSteps`
- `capabilities`
- `toolCalls`
- `artifacts`
- `traceEdges`
- `savedInvestigations`
- `ingestionState`
- `semanticChunks`
- `semanticIndexState`
- `memoryEntries` (future curated memory)
- `insights` (future derived insight layer)
- `healthSignals` (future operational memory health layer)

## 8. Retrieval model

The standard retrieval stack should include:
- relational lookup
- lexical search
- semantic retrieval
- provenance-weighted ranking
- lineage-aware context expansion
- confidence / uncertainty annotations

## 9. Integration requirements for OpenClaw

The memory layer should be designed to support:
- agent memory search
- operator memory inspection
- structured writeback / promotion flows
- durable event and artifact references
- health and diagnostic surfaces inside OpenClaw
- future memory APIs and tooling contracts

## 10. What counts as success

OpenTrust succeeds as the OpenClaw memory layer standard when:
- agents can retrieve past evidence reliably
- operators can verify what was retrieved and why
- important events can be promoted into durable memory intentionally
- freshness, drift, and degradation are visible
- insights and metrics emerge from stored evidence without losing provenance
- the system makes OpenClaw meaningfully more reliable, explainable, and useful over time
