# OpenTrust Scope Guardrails

This document exists to keep OpenTrust on-mission.

OpenTrust is the **official OpenClaw memory layer reference implementation**.
Its scope is substantial, but it is not unlimited.

---

## In scope

OpenTrust should directly own and improve:

### 1. Durable evidence storage
- local-first persistence
- schema evolution
- append-safe ingestion
- stable IDs and references
- auditability and reproducibility

### 2. Retrieval and investigation
- lexical retrieval
- semantic retrieval
- structured investigation queries
- provenance-aware ranking
- evidence inspection and traceability

### 3. Memory curation
- promotion from raw evidence to curated memory
- review states and retention labels
- writeback contracts for future OpenClaw memory APIs
- distinction between observed evidence and curated memory

### 4. Lineage and provenance
- trace and workflow linkage
- artifact provenance
- cause/effect visibility
- source attribution and freshness

### 5. Memory health and operator trust
- ingestion freshness
- degraded-state indicators
- indexing health
- audit/export/report support
- operator-facing diagnostics

### 6. OpenClaw integration
- tool contracts
- route contracts
- plugin packaging readiness
- config schema
- official integration conventions

### 7. Desktop application packaging
- Tauri v2 native shell
- cross-platform distributable builds (macOS, Windows, Linux)
- system tray and native OS integration
- auto-update distribution
- desktop-appropriate database and storage paths
- first-run onboarding and setup flow

---

## Out of scope for now

These may become adjacent concerns later, but they should not drive current execution:

### 1. General-purpose team collaboration productization
Not the priority.
OpenTrust is not currently trying to become a broad multi-tenant enterprise collaboration suite.

### 2. Abstract AI knowledge platform expansion
Avoid vague platform language unless it maps directly to:
- memory reliability
- retrieval quality
- operator trust
- OpenClaw integration

### 3. Large speculative backend rewrites
Do not restart the architecture unless the current approach clearly fails.
Backend swaps are implementation choices, not strategic identity shifts.

### 4. Fancy dashboards without operational value
A screen is only worth shipping if it helps an operator:
- inspect evidence
- judge health
- act on memory
- understand provenance
- make decisions faster

### 5. Unbounded workflow automation
OpenTrust can illuminate workflows, but it should not drift into becoming an all-purpose workflow engine.

### 6. Premature public-cloud assumptions
Current scope is local-first and operator-grade.
Cloud or hosted variants may come later, but should not distort present design.

---

## Scope tests

A proposed feature is in scope if it clearly improves one or more of these:
- durable memory storage
- evidence-backed retrieval
- curated memory workflows
- provenance and lineage
- memory health and trust
- OpenClaw-native integration
- desktop application packaging and distribution

A proposed feature is likely out of scope if it is primarily about:
- generic team collaboration
- speculative product breadth
- cosmetic UX without operator leverage
- unrelated workflow automation
- rebranding the project instead of strengthening it

---

## Guardrails for the current pre-prerequisite window

Until persistence and reliable run completion are dependable, prefer memory-layer work that improves:
- documentation alignment
- scope clarity
- baseline stability
- architecture clarity
- low-risk cleanup that keeps the current implementation honest

Desktop scaffold work (Tauri) can proceed independently during this window.

Defer memory-layer work that primarily adds:
- broad new entity types
- expansive new product surfaces
- major backend swaps
- deep plugin extraction work
- marketing-layer abstractions without implementation need

## Guardrails for V1.1

After the upstream prerequisites are solid, prefer work that improves:
- review actions
- explorer filters/navigation
- provenance display
- memory health visibility
- retrieval explanation/confidence

Defer work that primarily adds:
- broad new entity types
- expansive new product surfaces
- major backend swaps
- marketing-layer abstractions without implementation need

---

## Definition of scope creep

Work counts as scope creep when it:
- expands the product story faster than the implementation warrants
- introduces new categories of product behavior before core trust gaps are closed
- mixes multiple unfinished bets into one milestone
- increases conceptual breadth while reducing operational clarity
- ignores the prerequisite ordering of persistence → reliable run completion (desktop scaffold is independent)

If a change makes the roadmap feel bigger but the system feel less trustworthy, that is scope creep.

---

## Preferred bias

When choosing between two directions, prefer the one that is:
- more evidence-backed
- more operationally useful
- easier to verify
- closer to plugin-readiness
- smaller in surface area
- stronger in trust and provenance
- better aligned with the current phase ordering

That bias should keep the project sharp.
