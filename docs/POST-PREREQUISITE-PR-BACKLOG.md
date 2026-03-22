# OpenTrust Post-Prerequisite PR Backlog

This document turns the OpenTrust roadmap into an execution-ready backlog.

It should be read alongside:
- `docs/EXECUTION-PIPELINE.md`
- `docs/SCOPE-GUARDRAILS.md`
- `docs/PHASES.md`

---

## Current rule

OpenTrust is **not** the current top delivery priority.

Upstream prerequisite order remains:
1. Tauri
2. persistence
3. reliable run completion

Until those are dependable, OpenTrust work should stay limited to:
- docs alignment
- scope control
- low-risk cleanup
- preserving a truthful, buildable baseline

---

## Pre-prerequisite checklist

### P1 — Docs aligned with reality
- [ ] README reflects prerequisite ordering clearly
- [ ] plugin docs explicitly state packaging is post-prerequisite work
- [ ] roadmap language does not imply immediate pluginization
- [ ] current repo state and phase docs do not contradict one another

### P2 — Scope protected
- [ ] no speculative product expansion disguised as roadmap progress
- [ ] no broad new surface area added before trust gaps are closed upstream
- [ ] no mixed milestone work that bundles hardening + packaging + product expansion

### P3 — Baseline protected
- [ ] typecheck/build remain green
- [ ] no misleading placeholders implying incomplete flows are finished
- [ ] docs remain the primary vehicle for preparation while runtime prerequisites are underway

---

## Post-prerequisite main sequence

When Tauri, persistence, and reliable run completion are dependable, execute in this order.

### PR 1 — Review queue completion
**Goal:** complete the memory review workflow.

#### Scope
- [ ] explicit approve / reject / defer actions
- [ ] visible draft / reviewed / approved / rejected states
- [ ] audit metadata preserved on review actions
- [ ] UI removes ambiguity around operator actionability

#### Done when
- [ ] operator can move promoted memory through review without guesswork
- [ ] state changes are visible in both UI and data model

---

### PR 2 — Memory explorer hardening
**Goal:** make exploration faster and more defensible.

#### Scope
- [ ] useful filters
- [ ] stronger sorting/navigation
- [ ] better provenance display
- [ ] easier trace → memory → evidence traversal

#### Done when
- [ ] operator can answer “why is this here?” quickly
- [ ] source context is visible without digging through raw tables first

---

### PR 3 — Memory health page
**Goal:** make memory health visible as an operator concern.

#### Scope
- [ ] dedicated health surface
- [ ] ingestion freshness indicators
- [ ] semantic index status
- [ ] degraded-state warnings
- [ ] clear operator trust signals

#### Done when
- [ ] operator can tell whether memory is healthy at a glance
- [ ] degraded states are obvious and actionable

---

### PR 4 — Retrieval quality pass
**Goal:** improve answer quality and trustworthiness.

#### Scope
- [ ] stronger source-aware ranking
- [ ] confidence metadata
- [ ] explanation of why results surfaced
- [ ] better weighting of provenance and freshness

#### Done when
- [ ] retrieval results are easier to trust
- [ ] surfaced results are more defensible and inspectable

---

### PR 5 — Plugin extraction pass
**Goal:** make packaging mechanical instead of conceptual.

#### Scope
- [ ] isolate runtime modules
- [ ] thin route/HTTP adapters
- [ ] define stable tool wrappers
- [ ] normalize plugin-facing config

#### Done when
- [ ] plugin packaging feels like assembly, not reinvention
- [ ] core runtime is clearly separable from the standalone app shell

---

### PR 6 — Packaging + E2E validation
**Goal:** prove the integration story end to end.

#### Scope
- [ ] plugin draft loads in OpenClaw-compatible form
- [ ] routes/tools/config register correctly
- [ ] E2E verification covers core memory contract flows

#### Done when
- [ ] integration is proven, not just described in docs
- [ ] OpenTrust can credibly move toward first-class plugin status

---

## Decision rule

If a proposed OpenTrust change does **not** clearly improve one of these:
- evidence trust
- retrieval quality
- curation workflow
- memory health
- plugin-readiness
- documentation alignment during the pre-prerequisite window

…it probably should wait.
