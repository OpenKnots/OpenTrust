# OpenTrust Plugin Change Tracker

## Purpose

This is the lightweight checklist for tracking work that affects the draft plugin package and its relationship to the canonical runtime.

Update this whenever plugin-draft-related changes land in the OpenTrust repo.

---

## Current status

### Completed
- [x] OpenTrust reframed as the official OpenClaw memory layer standard
- [x] plugin packaging goal documented
- [x] plugin-ready refactor plan documented
- [x] draft plugin artifacts documented
- [x] `plugin-drafts/opentrust/` created
- [x] draft package metadata added
- [x] draft plugin manifest added
- [x] draft runtime entrypoint added
- [x] draft config/client/tools/http bridge files added
- [x] plugin draft mapped back to canonical runtime via `docs/PLUGIN-DRAFT-RUNTIME-MAP.md`
- [x] plugin promotion gate checklist added
- [x] memory entry inspect/provenance route added (`/memory/[id]`)
- [x] provenance depth improved with resolved origin summaries for traces/workflows/artifacts/memory entries

### Next recommended tasks
- [ ] review whether draft config defaults still match current runtime assumptions
- [ ] review whether draft client still matches current `/api/memory/*` routes
- [ ] decide whether draft route prefix `/plugins/opentrust` should remain the preferred long-term plugin path
- [ ] decide whether tool names should remain `memory_*` or be plugin-prefixed in future
- [ ] define the exact minimum scope for the future `extensions/opentrust/` PR
- [ ] draft the future OpenClaw PR checklist / rollout notes

### Recent product progress
- [x] trace promotion surface added
- [x] artifact promotion surface added
- [x] workflow promotion surface added

### Deferred until real promotion
- [ ] move draft files into `openclaw/openclaw/extensions/opentrust/`
- [ ] add real OpenClaw plugin registration tests in the main repo
- [ ] add real OpenClaw plugin-owned route tests in the main repo
- [ ] add live proxy integration verification against a running OpenTrust service

---

## Change log

- 2026-03-21: Added first draft package under `plugin-drafts/opentrust/`
- 2026-03-21: Added plugin draft/runtime mapping doc
- 2026-03-21: Added promotion checklist and change tracker
