# Phase 9 — Curated Memory and Writeback Design

## Purpose

This document turns Phase 9 from a roadmap bullet into an implementation-ready design direction.

Phase 9 is about one core capability:

> Promote selected raw evidence into durable curated memory without losing provenance.

This is the bridge between:
- raw event storage
- useful long-term memory
- reliable agent recall
- operator-guided knowledge curation

## Why this phase matters

OpenTrust already stores evidence well.
But a memory layer is incomplete if it cannot distinguish between:
- everything that happened
- what still matters
- what has been reviewed
- what should be kept long-term

Without curation, retrieval gets noisy.
Without provenance, curation becomes untrustworthy.
Without writeback, important derived knowledge stays trapped in transient summaries.

## Phase 9 goals

### 1. Create first-class curated memory entities
The system needs durable entities for reviewed memory, not just raw traces and artifacts.

### 2. Support explicit promotion flows
Operators and future agent workflows should be able to promote evidence into memory intentionally.

### 3. Preserve provenance and review state
Every curated memory item should explain where it came from and how trustworthy it is.

### 4. Introduce retention semantics
Not all memory should live forever or be treated equally.

### 5. Prepare for OpenClaw-native writeback APIs
This phase should align implementation with the formal API contract in `docs/MEMORY-API-CONTRACT.md`.

---

# 1. Proposed domain additions

## New entity: `memory_entries`

Suggested fields:
- `id`
- `kind` (`fact`, `summary`, `decision`, `preference`, `timeline`, `insight`, `note`)
- `title`
- `body`
- `summary`
- `retention_class` (`ephemeral`, `working`, `longTerm`, `pinned`)
- `review_status` (`draft`, `reviewed`, `approved`, `rejected`)
- `confidence_score`
- `confidence_reason`
- `uncertainty_summary`
- `author_type` (`user`, `agent`, `system`)
- `author_id`
- `created_at`
- `updated_at`
- `reviewed_at`
- `reviewed_by`

## New entity: `memory_entry_origins`

Maps curated memory to its supporting evidence.

Suggested fields:
- `memory_entry_id`
- `origin_type` (`trace`, `event`, `workflowRun`, `artifact`, `savedInvestigation`, `memoryEntry`)
- `origin_id`
- `relationship` (`derived_from`, `supports`, `contradicts`, `supersedes`)

## New entity: `memory_entry_tags`

Suggested fields:
- `memory_entry_id`
- `tag`

## Optional future entity: `memory_entry_versions`

Useful if writeback/edit history becomes important.
Not required for the first implementation.

---

# 2. Curated memory kinds

## `fact`
Observed or strongly supported stable information.

## `summary`
Condensed synthesis backed by multiple sources.

## `decision`
A chosen direction, policy, or conclusion.

## `preference`
Stable user or operator preference worth recalling.

## `timeline`
Time-anchored noteworthy event or period.

## `insight`
A derived pattern or observation from multiple evidence sources.

## `note`
A lightweight curated note that still deserves durability.

---

# 3. Retention classes

## `ephemeral`
Useful briefly. Eligible for aging out or lower retrieval priority.

## `working`
Relevant for active projects/investigations.

## `longTerm`
Should remain durable and retrievable by default.

## `pinned`
Very high importance. Should remain prominent and protected.

## Retrieval effect of retention
Retention class should influence ranking, not overwrite provenance.
For example:
- `pinned` gets retrieval boost
- `ephemeral` decays faster in ranking
- `working` boosts in active contexts

---

# 4. Review states

## `draft`
Promoted but not yet reviewed.

## `reviewed`
Inspected and considered usable.

## `approved`
Trusted enough for broad retrieval and operator use.

## `rejected`
Not suitable as curated memory, but preserved for audit trail if desired.

## Rule
Agents may propose memory.
Operators should be able to review and approve memory that carries lasting significance.

---

# 5. Promotion flows

## Flow A — operator promotion from trace or artifact
1. Operator inspects evidence
2. Operator chooses “Promote to memory”
3. Operator selects:
   - kind
   - title/body
   - retention class
   - review notes
4. System stores origin references automatically

## Flow B — agent-suggested promotion
1. Agent identifies high-value memory candidate
2. Agent submits writeback proposal
3. System records it as `draft`
4. Operator approves or edits later

## Flow C — derived insight promotion
1. Insight layer detects pattern/trend
2. Operator confirms it is worth preserving
3. System stores the curated insight with supporting lineage

---

# 6. Retrieval behavior for curated memory

Curated memory should:
- be searchable alongside raw evidence
- preserve provenance and uncertainty
- rank higher when well-supported and approved
- remain inspectable back to origin traces/artifacts

Curated memory should not:
- hide raw evidence
- replace provenance
- appear as unsupported truth claims

---

# 7. UI requirements for Phase 9

## Minimum UI surfaces

### A. Promote-to-memory action
From:
- trace detail
- artifact detail
- workflow detail
- investigation results

### B. Curated memory explorer
A route or panel to review:
- memory entries
- retention class
- review state
- origin links
- confidence / uncertainty

### C. Review queue
A surface for:
- draft entries
- agent-proposed entries
- stale working memory
- items needing approval or rejection

---

# 8. Implementation steps

## Step 1 — schema
Add:
- `memory_entries`
- `memory_entry_origins`
- optional tag support

## Step 2 — writeback runtime
Implement create/promote operations aligned to `docs/MEMORY-API-CONTRACT.md`.

## Step 3 — retrieval integration
Include curated memory in search/retrieval with provenance-aware ranking.

## Step 4 — UI
Add:
- promote action
- review queue
- memory explorer

## Step 5 — ranking and health integration
Track:
- number of draft vs approved entries
- stale working memory
- orphaned entries with weak provenance
- retrieval contribution from curated memory

---

# 9. Success criteria for Phase 9

Phase 9 succeeds when:
- important evidence can be promoted into durable memory
- every promoted memory item keeps origin references
- review status and retention class are explicit
- agents can propose memory safely
- operators can inspect and approve curated memory
- retrieval can use curated memory without losing explainability

## Decision

Phase 9 should be implemented as the first major expansion step after the current baseline.
It is the clearest path from “evidence store” to “real memory system.”
