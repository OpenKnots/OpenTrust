# OpenTrust Execution Pipeline

This document defines the **professional delivery pipeline** for OpenTrust as the official OpenClaw memory layer standard.

Its job is simple:
- keep execution focused
- keep quality high
- keep phases small enough to finish cleanly
- prevent architecture drift and scope creep
- keep OpenTrust sequenced behind the runtime prerequisites it depends on

---

## 1. Delivery posture

OpenTrust is no longer in the "big idea" stage.
It is in the **reference implementation hardening and integration-prep** stage.

However, OpenTrust is **not the current top delivery priority**.
Its main execution window comes **after three upstream prerequisites are dependable**:
- Tauri
- persistence
- reliable run completion

That means the default operating mode should be:
- protect and align the existing memory-layer baseline
- avoid overbuilding ahead of runtime reliability
- ship only low-risk, thin-slice preparation work until prerequisites are solid
- strengthen reliability, provenance, and operator trust when the host substrate is ready

OpenTrust should be run like infrastructure, not like an endless concept lab.

---

## 2. Current recommended operating sequence

## Stage 0 — Upstream prerequisites
Goal: wait for the host substrate to become dependable enough that memory-layer hardening will compound instead of churn.

The prerequisites are:
1. **Tauri**
2. **persistence**
3. **reliable run completion**

Until these are in a trustworthy state, OpenTrust should bias toward:
- doc alignment
- scope control
- low-risk cleanup
- architecture clarification
- preserving the current V1-capable baseline

OpenTrust should not try to outrun the runtime it depends on.

## Stage A — Stabilize the baseline
Goal: preserve the current V1-capable state while prerequisites are still being finished upstream.

Required outcomes:
- green typecheck
- green build
- no broken routes
- no placeholder UI paths that imply missing behavior is complete
- docs aligned with actual repo state

This stage treats the current implementation as something worth protecting, not expanding aggressively.

## Stage B — V1.1 hardening
Goal: make the baseline operationally trustworthy **after** Tauri, persistence, and reliable run completion are in good shape.

Recommended focus areas:
1. **review actions**
   - complete the review queue flows
   - make approve/reject/defer actions explicit
   - ensure promoted memory has visible status and auditability
2. **explorer quality**
   - filtering, sorting, and navigation improvements in memory explorer surfaces
   - better provenance visibility and source context
3. **memory health**
   - a dedicated health page for ingestion freshness, semantic index status, and degraded states
   - clear operator-facing warning states
4. **retrieval confidence**
   - visible rationale for why results surfaced
   - stronger provenance-weighted ranking rules

This becomes the highest-leverage milestone once the upstream runtime is dependable.

## Stage C — Plugin-readiness by extraction
Goal: prepare OpenTrust for first-class OpenClaw plugin packaging **without prematurely forcing the whole repo into plugin form**.

Recommended order:
1. isolate core runtime modules
2. thin the HTTP adapters
3. define stable tool wrappers
4. make config explicit
5. draft plugin entrypoint and packaging artifacts
6. validate packaging through E2E tests

This work should follow hardening, not replace it.

## Stage D — Official integration track
Goal: move from plugin-ready architecture to OpenClaw-native deployment.

Required outcomes:
- plugin discovery succeeds
- routes/tools/config load under real OpenClaw conventions
- contracts hold under E2E verification
- operator UX remains evidence-first

---

## 3. Pipeline rules

## Rule 1 — Thin-slice delivery only
Every implementation PR should fit one of these buckets:
- docs alignment
- scope control
- baseline cleanup
- hardening
- retrieval quality
- memory health
- plugin extraction
- contract definition
- operator UX completion

If a proposed change does not clearly fit one bucket, it is probably too broad.

## Rule 2 — Docs-first for structural changes
Before any large architectural shift:
- update the relevant design doc
- define what is changing
- define what is explicitly *not* changing
- define success criteria

This reduces accidental rework and vague ambition drift.

## Rule 3 — No mixed milestone PRs
Do not combine these in one PR unless the change is tiny:
- new data model + new UX + plugin packaging
- retrieval ranking work + health UI + authoring flows
- infrastructure refactor + product reframing

One PR should answer one primary question.

## Rule 4 — Every PR needs an exit test
Each PR should have a short verification block such as:
- `pnpm run typecheck`
- `pnpm run build`
- targeted route or page smoke check
- targeted manual verification note

If a change cannot be verified cheaply, scope it down until it can.

## Rule 5 — Preserve evidence-first semantics
Any feature that weakens provenance, lineage, or evidence visibility should be rejected or redesigned.

OpenTrust wins by being:
- inspectable
- attributable
- explainable
- operationally trustworthy

Not by generating prettier but less defensible summaries.

## Rule 6 — Respect prerequisite ordering
If a proposed OpenTrust change assumes stable Tauri behavior, durable persistence, or dependable run completion, it belongs in the **post-prerequisite** sequence unless it is strictly preparatory.

---

## 4. Recommended PR sequence from here

## Pre-prerequisite PRs only
Until Tauri, persistence, and reliable run completion are dependable, OpenTrust PRs should stay limited to:
- docs alignment
- scope clarification
- low-risk cleanup
- preserving green build/typecheck status
- small prep work that does not assume the host substrate is stable

Recommended pre-prerequisite PR examples:

### PR P1 — Documentation alignment
Target:
- keep README and phase docs aligned
- clarify OpenTrust’s role relative to upstream runtime work
- reduce ambiguity about current vs later priorities

### PR P2 — Scope guardrail refinement
Target:
- define what should wait until after runtime reliability
- explicitly defer speculative expansion
- preserve a crisp decision filter for new work

### PR P3 — Low-risk baseline cleanup
Target:
- remove ambiguity, dead wording, or misleading placeholders
- keep the current implementation stable and honest

## Post-prerequisite main sequence
Once Tauri, persistence, and reliable run completion are solid, the recommended sequence is:

### PR 1 — Review queue completion
Target:
- finish memory review actions
- make draft/approved/rejected/deferred states visible
- ensure audit metadata is preserved

Done when:
- operator can review and act on promoted memory without ambiguity
- status changes are visible in UI and data model

### PR 2 — Memory explorer hardening
Target:
- add useful filters
- improve provenance display
- improve navigation from trace → memory → source evidence

Done when:
- an operator can answer "why is this here?" quickly

### PR 3 — Memory health page
Target:
- dedicated health surface
- ingestion freshness indicators
- indexing/degraded-state warnings
- simple trust signals

Done when:
- operator can tell whether memory is healthy without digging into raw tables

### PR 4 — Retrieval quality pass
Target:
- stronger source-aware ranking
- confidence/explanation metadata
- better result explanation

Done when:
- retrieval outputs are more defensible and easier to trust

### PR 5 — Plugin extraction pass
Target:
- runtime isolation
- route adapter extraction
- tool wrapper definition
- config normalization

Done when:
- packaging work becomes mechanical instead of conceptual

### PR 6 — Packaging + E2E validation
Target:
- plugin draft loads in OpenClaw-compatible form
- routes/tools/config behave correctly end to end

Done when:
- the integration story is proven, not merely documented

---

## 5. Decision filter for new work

Before starting any feature, ask:

1. Does this improve the memory layer standard directly?
2. Does this strengthen evidence, retrieval, curation, health, or integration?
3. Can this ship as a thin, verified slice?
4. Does this create operator trust instead of novelty theater?
5. Is now the right phase for it?
6. Does it respect the current prerequisite ordering?

If two or more answers are "no", defer it.

---

## 6. Anti-patterns to avoid

Avoid these common failure modes:
- adding speculative platform features before runtime prerequisites are dependable
- bundling plugin packaging, UX redesign, and schema changes into one move
- writing roadmap language broader than the implementation can support
- building new surfaces before provenance and health are clear
- treating "AI memory" as branding instead of infrastructure
- optimizing for demo breadth over operational trust
- trying to solve downstream memory ergonomics before upstream runtime completion is trustworthy

---

## 7. Working definition of professional quality

A professional OpenTrust change should be:
- clear in scope
- documented before structural expansion
- evidence-preserving
- testable in minutes
- reversible when possible
- aligned with the current phase
- honest about what is still unfinished
- sequenced correctly relative to upstream runtime work

That is the standard.
