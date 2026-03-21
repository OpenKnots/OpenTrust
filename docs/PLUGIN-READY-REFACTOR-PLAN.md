# OpenTrust Plugin-Ready Refactor Plan

## Purpose

This document translates the plugin-packaging goal into a concrete refactor plan based on **actual OpenClaw plugin conventions**.

Ground truth from OpenClaw:
- user-facing term: **plugin**
- internal package location for bundled plugins: `extensions/<id>`
- manifest file: `openclaw.plugin.json`
- config path: `plugins.entries.<id>.*`
- package metadata typically includes:
  - `name`
  - `type: "module"`
  - `openclaw.extensions: ["./index.ts"]`
- runtime registration typically happens via a plugin entry using `definePluginEntry(...).register(api)`

## End-state goal

OpenTrust should be refactored so it can be packaged as:
- `extensions/opentrust/`
- with `openclaw.plugin.json`
- with a plugin runtime entrypoint
- with plugin-owned config schema
- with plugin-owned tools/routes for the memory layer contract

This plan is about getting there **without losing the current memory standard**.

---

# Refactor objective

Make OpenTrust separable into four clean layers:

1. **Core memory runtime**
2. **HTTP/route adapters**
3. **Operator UI surfaces**
4. **OpenClaw plugin wrapper**

Today these concerns are mixed inside a standalone app repo.
Plugin-ready refactoring means making them composable.

---

# Current shape vs target shape

## Current shape
- standalone Next.js app
- app routes directly call local runtime modules
- memory APIs exposed through app routes
- config is implicit / app-local
- no plugin entrypoint or manifest yet

## Target shape
- memory core can run independent of the web app
- HTTP handlers can be mounted by a plugin runtime
- routes/tools map cleanly onto plugin-owned capabilities
- config schema is explicit and plugin-scoped
- packaging into `extensions/opentrust` becomes straightforward

---

# Required refactor tracks

## Track 1 — Isolate the core runtime

### Goal
Ensure the memory runtime is host-agnostic.

### What should belong in core runtime
- DB bootstrap and migrations
- ingestion logic
- retrieval logic
- curated memory writeback logic
- memory health logic
- provenance/lineage logic
- shared types and contract validation

### Current likely modules
- `lib/opentrust/db.ts`
- `lib/opentrust/bootstrap.ts`
- `lib/opentrust/search.ts`
- `lib/opentrust/memory-entries.ts`
- `lib/opentrust/memory-api.ts`
- `lib/opentrust/api-contract.ts`
- `lib/opentrust/overview.ts`
- related trace/workflow/artifact modules

### Requirement
These modules should not depend on:
- Next page components
- UI primitives
- route-only assumptions

### Deliverable
A clearly scoped runtime layer that could be imported by either:
- the current Next app
- a future OpenClaw plugin entrypoint

---

## Track 2 — Separate HTTP adapters from core logic

### Goal
Make route handlers thin adapters around the runtime.

### Current status
This has already started with:
- `/api/memory/search`
- `/api/memory/inspect`
- `/api/memory/health`
- `/api/memory/promote`

### Refactor target
Move route-specific behavior into a dedicated adapter layer, such as:
- `lib/opentrust/http/search.ts`
- `lib/opentrust/http/inspect.ts`
- `lib/opentrust/http/health.ts`
- `lib/opentrust/http/promote.ts`

The Next routes should become tiny wrappers.
Later, the same handlers can be mounted by plugin-owned HTTP route registration.

### Deliverable
A reusable HTTP adapter layer independent of Next route file structure.

---

## Track 3 — Define plugin-owned tools

### Goal
Map the memory contract to OpenClaw tool registration.

### First-class tool targets
- `memory_search`
- `memory_inspect`
- `memory_promote`
- `memory_health`

### Requirement
Each tool should:
- delegate to the core runtime
- preserve provenance/confidence/freshness structure
- align with `docs/MEMORY-API-CONTRACT.md`

### Deliverable
A tool module layer, e.g.:
- `src/tool-memory-search.ts`
- `src/tool-memory-inspect.ts`
- `src/tool-memory-promote.ts`
- `src/tool-memory-health.ts`

or equivalent grouping under a plugin `src/` tree.

---

## Track 4 — Define plugin config schema

### Goal
Make configuration explicit and portable into OpenClaw plugin config.

## Required config areas
Suggested path:
- `plugins.entries.opentrust.config.*`

Suggested config fields:
- `storage.path`
- `storage.mode` (`local` first, future extensible)
- `ingestion.sessions.enabled`
- `ingestion.workflows.enabled`
- `indexing.semantic.enabled`
- `indexing.semantic.provider` (future)
- `retention.defaultClass`
- `health.stalePipelineHours`
- `api.enableRoutes`
- `api.enableTools`

### Deliverable
- JSON-schema-compatible config shape
- documented defaults
- mapping from current implicit behavior to explicit config

---

## Track 5 — Introduce plugin runtime entrypoint

### Goal
Create the actual plugin wrapper expected by OpenClaw.

### Target files
Eventually something like:
- `extensions/opentrust/index.ts`
- `extensions/opentrust/api.ts`
- `extensions/opentrust/openclaw.plugin.json`
- `extensions/opentrust/package.json`

### Runtime responsibilities
The plugin entrypoint should:
- load config
- register tools
- register HTTP routes
- optionally register prompt/system guidance if needed
- initialize storage/runtime dependencies safely

### Model to follow
OpenClaw bundled plugins such as `extensions/diffs` show the correct pattern:
- manifest
- package metadata
- `definePluginEntry(...).register(api)`
- `api.registerTool(...)`
- `api.registerHttpRoute(...)`

### Deliverable
An initial plugin entrypoint design that can host the memory layer.

---

## Track 6 — Decide UI hosting strategy

### Goal
Clarify how the operator UI should live once plugin-packaged.

### Possible strategies

#### Strategy A — Plugin-owned HTTP routes + embedded UI pages
The plugin exposes its own HTTP routes and serves/operator-hosts UI views.

#### Strategy B — Core OpenClaw shell mounts plugin routes
The OpenTrust plugin provides handlers/data endpoints and OpenClaw hosts the UI shell.

#### Strategy C — Hybrid
- plugin owns runtime + APIs + route handlers
- operator UI is partially hosted through the plugin and partially mounted in a core shell

### Recommendation
Use **Hybrid** as the planning target.

Why:
- preserves current app investment
- keeps plugin runtime authoritative
- allows the operator UX to migrate incrementally
- avoids needing to fully solve all shell concerns before packaging

### Deliverable
A documented UI-hosting decision and migration path.

---

## Track 7 — Add plugin artifacts

### Goal
Make the packaging target explicit.

### Required artifacts
- `extensions/opentrust/package.json`
- `extensions/opentrust/openclaw.plugin.json`
- plugin config schema
- entrypoint file(s)
- route/tool registration modules
- plugin README for config/setup

### Minimal initial manifest fields
At minimum plan for:
- `id: "opentrust"`
- `name: "OpenTrust"`
- `description`
- `configSchema`
- optional `uiHints`
- optional `skills` if plugin guidance becomes useful

### Deliverable
A draft manifest and package shape.

---

# Recommended phased refactor sequence

## Phase A — Core/runtime separation
- isolate runtime from Next-specific code
- isolate HTTP adapters
- keep current app working unchanged

## Phase B — Tool + config layer
- define config schema
- define tool wrappers
- define route handler adapters suitable for plugin registration

## Phase C — Draft plugin package
- create plugin manifest draft
- create plugin package metadata
- create plugin entrypoint draft
- document config mapping under `plugins.entries.opentrust`

## Phase D — Packaging validation
- verify plugin can load in a real OpenClaw runtime
- verify routes and/or tools register successfully
- verify memory contract works through plugin-owned surfaces

## Phase E — Full first-class pluginization
- package under `extensions/opentrust`
- document installation and config
- integrate with OpenClaw operator/tool flows

---

# Concrete next docs/code artifacts to create

## Docs
- draft `openclaw.plugin.json` example in docs
- config schema draft
- plugin route/tool ownership map

## Code planning stubs
- plugin entrypoint draft
- tool registration stubs
- route adapter extraction plan

---

# Definition of plugin-ready

OpenTrust is plugin-ready when:
- memory runtime is host-agnostic
- HTTP handlers are reusable outside Next route files
- tool registration targets are defined
- config schema is explicit
- plugin manifest/package shape is drafted
- the current standalone app can be mapped cleanly onto a plugin host model

## Decision

The next planning/build step after this doc should be:
1. draft the plugin manifest and package shape
2. draft the plugin config schema
3. draft the plugin tool/route ownership map

That is the shortest path from “we want a first-class plugin” to “we know exactly how to package one.”
