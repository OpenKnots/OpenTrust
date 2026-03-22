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

## Stage 0 — Upstream prerequisites and desktop scaffold
Goal: wait for the host substrate to become dependable enough that memory-layer hardening will compound instead of churn — while simultaneously building the desktop application shell.

The prerequisites are:
1. **Tauri desktop scaffold** — can proceed now (see `docs/DESKTOP-APPLICATION-PLAN.md`)
2. **persistence**
3. **reliable run completion**

The Tauri desktop scaffold is no longer a blocking prerequisite — it is **active work** that can proceed in parallel with persistence and run completion. The desktop shell wraps the existing app without changing the memory runtime.

Until persistence and reliable run completion are in a trustworthy state, memory-layer expansion should bias toward:
- doc alignment
- scope control
- low-risk cleanup
- architecture clarification
- preserving the current V1-capable baseline

OpenTrust should not try to outrun the runtime it depends on — but it can build the desktop container around it.

## Stage 0.5 — Desktop application scaffold
Goal: wrap the existing Next.js app in a Tauri v2 native shell.

This stage runs **in parallel** with Stage A and can begin immediately.

Required outcomes:
- Tauri v2 project scaffolded (`src-tauri/`)
- Next.js static export configured and working
- Sidecar Node process hosts the memory runtime
- Desktop-appropriate database paths configured
- Basic macOS `.dmg` build succeeds
- Basic Windows `.msi` / `.exe` build succeeds
- Basic Linux `.AppImage` / `.deb` build succeeds

This stage does not require changes to the memory layer.
It wraps the existing app as-is inside a native window.

See `docs/DESKTOP-APPLICATION-PLAN.md` for the full plan.

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

## Stage E — Desktop distribution and native experience
Goal: make the desktop application production-grade.

Required outcomes:
- auto-update delivers new versions without manual reinstallation
- builds are code-signed and notarized for macOS
- system tray provides health status and quick actions
- background ingestion runs without the main window open
- CI pipeline produces cross-platform builds automatically
- first-run onboarding guides users through setup
- native OS notifications surface health alerts and ingestion events

This stage follows the desktop scaffold (Stage 0.5) and can run in parallel with Stages B–D.

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
- desktop application scaffold or native integration

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
If a proposed OpenTrust change assumes durable persistence or dependable run completion, it belongs in the **post-prerequisite** sequence unless it is strictly preparatory. Desktop scaffold work (Tauri) can proceed independently.

---

## 4. Recommended PR sequence from here

## Pre-prerequisite PRs
Until persistence and reliable run completion are dependable, memory-layer PRs should stay limited to:
- docs alignment
- scope clarification
- low-risk cleanup
- preserving green build/typecheck status
- small prep work that does not assume the host substrate is stable

Desktop scaffold PRs can proceed now — they do not depend on persistence or run completion.

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

## Desktop scaffold PRs (can proceed now)
These PRs build the Tauri desktop shell around the existing app. See `docs/DESKTOP-APPLICATION-PLAN.md`.

### PR D1 — Tauri v2 project scaffold
Target:
- initialize `src-tauri/` with Tauri v2
- configure `tauri.conf.json` for window title, size, platform targets
- configure Next.js static export (`output: 'export'`)
- verify the app loads in a Tauri dev window

Done when:
- `pnpm tauri dev` opens the OpenTrust dashboard in a native window

### PR D2 — Sidecar runtime and database paths
Target:
- configure sidecar Node process for the memory runtime
- resolve database path to platform-appropriate location
- ensure ingestion and search work in the desktop context

Done when:
- memory operations work identically in the desktop app and localhost

### PR D3 — Platform builds
Target:
- macOS `.dmg` build
- Windows `.msi` / `.exe` build
- Linux `.AppImage` / `.deb` build
- basic CI configuration for cross-platform builds

Done when:
- a distributable installer can be produced for each platform

### PR D4 — Native integrations
Target:
- system tray icon with health status
- tray menu (open, ingest, check health, quit)
- native OS notifications
- global keyboard shortcut

Done when:
- the desktop app feels native, not like a framed browser tab

## Post-prerequisite main sequence
Once persistence and reliable run completion are solid, the recommended sequence is:

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
- adding speculative platform features before runtime prerequisites are dependable (desktop scaffold is explicitly not speculative)
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
