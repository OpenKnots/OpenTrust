# Phase 9 Implementation Plan

## Purpose

This document translates the memory API contract and curated-memory design into an implementation sequence against the current OpenTrust codebase.

It is intentionally grounded in the repo as it exists now.

Current relevant implementation surface:
- `lib/opentrust/db.ts`
- `lib/opentrust/bootstrap.ts`
- `lib/opentrust/search.ts`
- `lib/opentrust/overview.ts`
- `lib/opentrust/artifacts.ts`
- `lib/opentrust/trace-details.ts`
- `lib/opentrust/workflow-details.ts`
- `lib/opentrust/investigations.ts`
- `lib/types.ts`

## Goal of Phase 9

Add the first durable curated-memory layer on top of the existing evidence substrate.

By the end of Phase 9, OpenTrust should support:
- storing curated memory entries
- promoting evidence into curated memory
- reviewing and approving proposed memory
- including curated memory in retrieval
- exposing the first memory-health metrics related to curation

---

# Milestone 1 — Schema foundation

## Objective
Introduce curated-memory tables without destabilizing the current evidence model.

## Additions

### 1. `memory_entries`
Suggested columns:
- `id TEXT PRIMARY KEY`
- `kind TEXT NOT NULL`
- `title TEXT NOT NULL`
- `body TEXT NOT NULL`
- `summary TEXT`
- `retention_class TEXT NOT NULL`
- `review_status TEXT NOT NULL`
- `confidence_score REAL`
- `confidence_reason TEXT`
- `uncertainty_summary TEXT`
- `author_type TEXT NOT NULL`
- `author_id TEXT`
- `created_at TEXT NOT NULL`
- `updated_at TEXT NOT NULL`
- `reviewed_at TEXT`
- `reviewed_by TEXT`

### 2. `memory_entry_origins`
Suggested columns:
- `memory_entry_id TEXT NOT NULL`
- `origin_type TEXT NOT NULL`
- `origin_id TEXT NOT NULL`
- `relationship TEXT NOT NULL`

Suggested indexes:
- `(memory_entry_id)`
- `(origin_type, origin_id)`

### 3. `memory_entry_tags`
Suggested columns:
- `memory_entry_id TEXT NOT NULL`
- `tag TEXT NOT NULL`

Suggested indexes:
- `(memory_entry_id)`
- `(tag)`

## Code touchpoints
- `db/` migration SQL
- `lib/opentrust/bootstrap.ts`
- `lib/opentrust/db.ts`
- `lib/types.ts`

## Acceptance criteria
- schema bootstraps cleanly on a fresh DB
- migration path works on an existing DB
- no existing overview/search/detail surfaces regress

---

# Milestone 2 — Curated memory runtime module

## Objective
Create a dedicated module instead of scattering writeback logic.

## New module
- `lib/opentrust/memory-entries.ts`

## Responsibilities
- create memory entries
- attach origin refs
- attach tags
- list memory entries
- inspect a memory entry with origin refs
- update review state
- update retention class

## Suggested exported functions
- `createMemoryEntry(input)`
- `promoteToMemory(input)`
- `getMemoryEntry(id)`
- `listMemoryEntries(filters?)`
- `updateMemoryEntryReview(input)`
- `updateMemoryEntry(input)`
- `listMemoryReviewQueue()`

## Acceptance criteria
- write path is isolated in one runtime module
- types are explicit and reusable by routes/components
- origin refs are always persisted on creation

---

# Milestone 3 — Formal v1 API bindings

## Objective
Map the standard doc into actual internal interfaces.

## New module
- `lib/opentrust/memory-api.ts`

## Implement v1 functions
- `memorySearch(request)`
- `memoryInspect(ref)`
- `memoryHealth(request)`
- `memoryPromote(request)`

These do not need to be HTTP endpoints yet.
They should first exist as internal runtime functions matching the contract shape.

## Rules
- response shape should stay close to `docs/MEMORY-API-CONTRACT.md`
- source typing should be explicit
- provenance must never be optional for curated memory

## Acceptance criteria
- request/response mapping is deterministic
- curated memory can be promoted and then inspected through the API layer
- retrieval result shape includes provenance/confidence/freshness placeholders where needed

---

# Milestone 4 — Retrieval integration

## Objective
Include curated memory in OpenTrust search without degrading explainability.

## Code touchpoints
- `lib/opentrust/search.ts`
- optional support modules for ranking helpers

## Changes
- add curated-memory retrieval path
- support `sourceType = memoryEntry`
- include retention-class-aware ranking boost
- include review-state-aware ranking boost
- include `whyMatched` explanation fields
- keep raw evidence retrievable alongside curated memory

## Recommended initial ranking heuristics
- approved > reviewed > draft
- pinned > longTerm > working > ephemeral
- multiple origin refs > single origin ref
- artifact + trace support > single weak support
- fresher entries receive modest boost

## Acceptance criteria
- curated memory surfaces in search results
- results preserve provenance
- raw evidence remains visible and inspectable
- retrieval ranking is understandable and debuggable

---

# Milestone 5 — UI: promote and review

## Objective
Give operators visible control over curated memory.

## New routes/components

### Route A — `/memory`
Curated memory explorer.

Should show:
- title
- kind
- retention class
- review state
- confidence
- freshness
- linked origins

### Route B — `/memory/review`
Review queue for:
- draft entries
- agent-proposed entries
- stale working memory
- rejected/needs-revision items if desired

### Add actions to existing surfaces
From:
- trace detail page
- workflow detail page
- artifact explorer/detail areas
- saved investigation results

Add a **Promote to memory** action.

## Code touchpoints
- `app/` routes
- existing trace/workflow/artifact components
- new memory explorer components

## Acceptance criteria
- operator can promote evidence into curated memory from at least one existing detail surface
- operator can review and approve entries
- curated memory is explorable in its own route

---

# Milestone 6 — Health and metrics integration

## Objective
Make curated memory operationally visible.

## Add metrics to overview / health logic
Suggested metrics:
- total curated memory entries
- drafts awaiting review
- approved entries
- stale working memory count
- entries with weak or missing origin coverage
- percent of memory entries surfaced in retrieval recently (optional later)

## Code touchpoints
- `lib/opentrust/health.ts`
- `lib/opentrust/overview.ts`
- dashboard route/components

## Acceptance criteria
- overview can report curated-memory state
- review debt is visible
- weak-provenance memory can be identified

---

# Milestone 7 — Type system alignment

## Objective
Avoid contract drift between docs and code.

## Suggested additions to `lib/types.ts`
- `MemoryEntry`
- `MemoryEntryOrigin`
- `MemoryRetentionClass`
- `MemoryReviewStatus`
- `MemorySourceType`
- `MemorySearchRequest`
- `MemorySearchResponse`
- `MemoryPromoteRequest`
- `MemoryHealthResponse`

## Acceptance criteria
- code compiles against shared types
- contract docs map cleanly to implementation types

---

# Ordered implementation sequence

## Step 1
Schema + bootstrap + types

## Step 2
`memory-entries.ts` runtime module

## Step 3
`memory-api.ts` contract-facing wrapper

## Step 4
retrieval integration in `search.ts`

## Step 5
UI promote action on one surface first

## Step 6
`/memory` explorer

## Step 7
`/memory/review` queue

## Step 8
overview/health integration

## Step 9
memory-entry inspect/provenance UI depth

---

# Recommended first PR scope

Keep the first implementation PR intentionally narrow.

## PR 1
- schema additions
- types
- `memory-entries.ts`
- `memory-api.ts` with `memoryPromote` + `memoryInspect`
- no UI yet

## PR 2
- retrieval integration
- minimal `/memory` route

## PR 3
- promote action from one detail surface
- review queue
- health metrics

This keeps the rollout safer and easier to validate.

---

# Risks to manage

## 1. Curated memory becoming ungrounded
Mitigation:
- require origin refs
- require provenance fields
- expose review state clearly

## 2. Search becoming opaque
Mitigation:
- preserve `whyMatched`
- keep ranking heuristics inspectable
- avoid hiding raw evidence behind curated memory

## 3. Scope explosion
Mitigation:
- Phase 9 should stop at curated memory + promotion + review + retrieval integration
- do not fold in full insight/metrics ambitions too early

## 4. Agent-authored garbage memory
Mitigation:
- default agent proposals to `draft`
- require review metadata
- add health metrics for review debt

---

# Definition of done for Phase 9

Phase 9 is done when:
- curated memory has first-class tables and types
- the writeback contract exists in code
- evidence can be promoted to curated memory
- origin refs are preserved
- review state and retention class are visible
- curated memory appears in retrieval
- operators can inspect and review entries

## Decision

This plan is the recommended implementation path for the next build phase of OpenTrust as the OpenClaw memory layer standard.
