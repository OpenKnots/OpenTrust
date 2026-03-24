# OpenTrust Plugin Promotion Checklist

## Purpose

This checklist tracks what must be true before `plugin-drafts/opentrust/` should be promoted into a real OpenClaw plugin PR.

## Promotion gate

Do **not** promote the draft package until the items below are reviewed.

---

## 1. Canonical runtime alignment
- [ ] `lib/opentrust/memory-api.ts` still matches the intended plugin bridge behavior
- [ ] `lib/opentrust/api-contract.ts` still matches the draft tool/HTTP payload shapes
- [ ] `app/api/memory/search/route.ts` still maps cleanly to draft `src/client.ts`
- [ ] `app/api/memory/inspect/route.ts` still maps cleanly to draft `src/client.ts`
- [ ] `app/api/memory/health/route.ts` still maps cleanly to draft `src/client.ts`
- [ ] `app/api/memory/promote/route.ts` still maps cleanly to draft `src/client.ts`

## 2. Draft package alignment
- [ ] `plugin-drafts/opentrust/package.json` still reflects intended OpenClaw extension packaging
- [ ] `plugin-drafts/opentrust/openclaw.plugin.json` still reflects the intended config shape
- [ ] `plugin-drafts/opentrust/index.ts` still matches the intended tool/route registration shape
- [ ] `plugin-drafts/opentrust/src/config.ts` still reflects current config assumptions
- [ ] `plugin-drafts/opentrust/src/tools.ts` still mirrors the current memory contract
- [ ] `plugin-drafts/opentrust/src/http.ts` still mirrors the current HTTP bridge shape

## 3. Contract integrity
- [ ] `docs/MEMORY-API-CONTRACT.md` reviewed
- [ ] request/response envelopes still match draft package expectations
- [ ] provenance fields still match current intent
- [ ] confidence/freshness/error semantics remain aligned

## 4. Packaging readiness
- [ ] plugin config path remains `plugins.entries.opentrust.config.*`
- [ ] plugin id remains `opentrust`
- [ ] plugin kind remains correct for OpenClaw conventions
- [ ] package metadata remains compatible with current OpenClaw plugin discovery

## 5. Test readiness
- [ ] draft package has updated bridge behavior where needed
- [ ] promotion PR plan includes registration tests
- [ ] promotion PR plan includes tool bridge tests
- [ ] promotion PR plan includes HTTP route tests
- [ ] promotion PR plan includes at least one live/proxy integration check

## 6. Documentation readiness
- [ ] `docs/OPENCLAW-PLUGIN-PACKAGING.md` reviewed
- [ ] `docs/PLUGIN-READY-REFACTOR-PLAN.md` reviewed
- [ ] `docs/OPENCLAW-PLUGIN-DRAFT-ARTIFACTS.md` reviewed
- [ ] `docs/PLUGIN-DRAFT-RUNTIME-MAP.md` reviewed
- [ ] draft-vs-canonical boundaries remain explicit

## 7. Final promotion decision
- [ ] draft package is stable enough to move into `extensions/opentrust/`
- [ ] promotion PR scope is defined
- [ ] promotion PR avoids mixing unrelated runtime/product changes

## Notes

Use this checklist as the final review gate before opening the real OpenClaw plugin PR.
