# Plugin Draft → Runtime Mapping

## Purpose

This document maps the draft plugin package in:

- `plugin-drafts/opentrust/`

back to the current canonical OpenTrust runtime and app surfaces.

The goal is to reduce drift and make later promotion into `extensions/opentrust/` safer.

## Rule of truth

The **canonical implementation** remains the real OpenTrust app/runtime in this repo.

The files in `plugin-drafts/opentrust/` are:
- packaging-oriented projections
- not yet canonical runtime sources
- allowed to mirror behavior
- not allowed to silently diverge in meaning from the real runtime

---

# Mapping table

## 1. Plugin entrypoint

### Draft file
- `plugin-drafts/opentrust/index.ts`

### Canonical counterparts
- `docs/OPENCLAW-PLUGIN-PACKAGING.md`
- `docs/PLUGIN-READY-REFACTOR-PLAN.md`
- `docs/OPENCLAW-PLUGIN-DRAFT-ARTIFACTS.md`

### Notes
This file has no exact canonical runtime equivalent yet.
It is a packaging wrapper around existing runtime behavior.

---

## 2. Plugin manifest

### Draft file
- `plugin-drafts/opentrust/openclaw.plugin.json`

### Canonical counterparts
- `docs/OPENCLAW-PLUGIN-PACKAGING.md`
- `docs/MEMORY-LAYER-STANDARD.md`
- `docs/PHASES.md`

### Notes
This is documentation-backed packaging metadata, not runtime logic.

---

## 3. Plugin package metadata

### Draft file
- `plugin-drafts/opentrust/package.json`

### Canonical counterparts
- `package.json`
- `docs/OPENCLAW-PLUGIN-PACKAGING.md`

### Notes
This draft package exists only to model future OpenClaw extension packaging.

---

## 4. Config resolver

### Draft file
- `plugin-drafts/opentrust/src/config.ts`

### Canonical counterparts
- `docs/OPENCLAW-PLUGIN-PACKAGING.md`
- `docs/OPENCLAW-PLUGIN-DRAFT-ARTIFACTS.md`
- runtime assumptions currently embedded in:
  - `lib/opentrust/memory-api.ts`
  - app route defaults

### Notes
This file is the plugin-facing projection of configuration that is currently still implicit in the standalone app.

---

## 5. Bridge client

### Draft file
- `plugin-drafts/opentrust/src/client.ts`

### Canonical counterparts
- `app/api/memory/search/route.ts`
- `app/api/memory/inspect/route.ts`
- `app/api/memory/health/route.ts`
- `app/api/memory/promote/route.ts`
- `lib/opentrust/api-contract.ts`

### Notes
This client is not a new memory implementation.
It is only a proxy/bridge to the canonical OpenTrust API surface.

---

## 6. Tool wrappers

### Draft file
- `plugin-drafts/opentrust/src/tools.ts`

### Canonical counterparts
- `lib/opentrust/memory-api.ts`
- `docs/MEMORY-API-CONTRACT.md`

### Notes
The tools should continue to mirror the memory contract, not invent their own semantics.
The source of truth for request/response meaning remains the memory API contract and the canonical runtime.

---

## 7. Plugin-owned HTTP bridge

### Draft file
- `plugin-drafts/opentrust/src/http.ts`

### Canonical counterparts
- `app/api/memory/search/route.ts`
- `app/api/memory/inspect/route.ts`
- `app/api/memory/health/route.ts`
- `app/api/memory/promote/route.ts`
- `lib/opentrust/api-contract.ts`

### Notes
This HTTP layer should be treated as a plugin-facing adapter around the existing OpenTrust API routes.
It should not drift into a separate contract unless intentionally promoted.

---

## 8. Draft README

### Draft file
- `plugin-drafts/opentrust/README.md`

### Canonical counterparts
- `README.md`
- `docs/OPENCLAW-PLUGIN-PACKAGING.md`
- `docs/OPENCLAW-PLUGIN-DRAFT-ARTIFACTS.md`

### Notes
This README should remain explicit that the draft package is planning/prep, not the canonical runtime.

---

# Drift management rules

## Rule 1 — contract drift is not allowed
If the memory API contract changes, update both:
- canonical runtime/API docs
- plugin draft bridge surfaces

## Rule 2 — runtime logic should not fork here first
New memory behavior should land in the canonical runtime first, then be mirrored into the draft plugin package if needed.

## Rule 3 — packaging concerns belong in the draft package
Manifest shape, plugin config shape, and route/tool registration concerns belong in `plugin-drafts/opentrust/`.

## Rule 4 — canonical memory semantics belong outside the draft package
The draft package should not become the first place where memory semantics are defined.

---

# Promotion checklist for later

Before moving `plugin-drafts/opentrust/` into a real OpenClaw extension PR, verify:

- [ ] config keys still match current OpenTrust assumptions
- [ ] memory API contract has not drifted
- [ ] route paths still map correctly
- [ ] tool payloads still match the contract
- [ ] plugin-owned HTTP bridge still proxies the canonical routes correctly
- [ ] README still describes draft-vs-canonical boundaries accurately

## Decision

This mapping document should be maintained alongside the plugin draft package until the first real `extensions/opentrust/` promotion PR is ready.
