# OpenClaw Memory Layer Standard

## Purpose

This document is the concise source of truth for what OpenTrust is supposed to standardize for OpenClaw.

## Standard definition

The OpenClaw memory layer must provide:
- durable storage of events and evidence
- reliable lexical, semantic, and relational retrieval
- provenance and lineage for explainability
- operator-visible freshness and health
- evidence-backed insight and metrics derivation
- safe promotion from raw evidence to curated memory

## Non-negotiable properties

### Reliability
- stable IDs
- migration-safe schema evolution
- append-safe ingestion
- repeatable imports
- clear failure modes

### Explainability
- source-aware results
- lineage edges
- tool/workflow attribution
- observed vs inferred distinction
- explicit uncertainty

### Retrieval quality
- exact retrieval
- semantic retrieval
- ranking tuned for evidence quality
- traceable reasons for surfaced results

### Operational trust
- freshness signals
- indexing status
- health views
- export and audit support
- backup-aware design

### OpenClaw integration
- compatible with OpenClaw retrieval tools
- suitable for agent memory search
- suitable for operator memory review
- suitable for future writeback APIs

## Current implementation baseline

OpenTrust already provides:
- durable local SQLite-backed evidence storage
- FTS5 lexical retrieval
- sqlite-vec semantic indexing activation
- session + workflow ingestion
- artifact extraction
- saved investigations
- lineage edges
- operator dashboard surfaces

## Next standardization work

- curated memory entities
- retrieval contracts
- memory writeback contracts
- retrieval-quality evaluation
- health and metrics surfaces
- export and audit bundles
- deeper OpenClaw integration APIs

## Relationship to the rest of the docs

- `README.md` — repository positioning
- `docs/ARCHITECTURE.md` — technical model
- `docs/INGESTION.md` — ingestion model
- `docs/PHASES.md` — roadmap
- `docs/MEMORY-API-CONTRACT.md` — formal interface contract
- `docs/CURATED-MEMORY-DESIGN.md` — Phase 9 implementation design
- `docs/PHASE-9-IMPLEMENTATION-PLAN.md` — concrete build sequence
- `docs/CONVEX-PRODUCT-SPEC.md` — product-level requirements
- `docs/CONVEX-REPLACEMENT-BLUEPRINT.md` — integration blueprint
