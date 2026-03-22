# OpenClaw Memory Sources, Backups, and Recommendation Model

## Purpose

This document captures the truthful baseline for how OpenClaw memory works **today**, what OpenTrust should ingest first, and what additional storage/backup options should be recommended to users as the memory layer matures.

## How OpenClaw memory works today

OpenClaw memory is **Markdown-first**.

The current source-of-truth files live in the agent workspace (usually `~/.openclaw/workspace`):

- `MEMORY.md`
  - curated long-term memory
  - durable facts, preferences, decisions, stable context
- `memory/YYYY-MM-DD.md`
  - daily capture layer
  - temporary notes, events, running context, candidate learnings
- optional extra memory files created by hooks/workflows, for example:
  - `memory/YYYY-MM-DD-slug.md`
  - session memory snapshots created on `/new` or `/reset`

## Important distinction

These Markdown files are the **real memory source**.

OpenClaw’s memory tools (`memory_search`, `memory_get`) search and read these files. The semantic/vector index is an acceleration layer, not the canonical memory store.

Current indexed recall in OpenClaw typically works like this:

1. user/agent writes Markdown memory files in the workspace
2. OpenClaw watches `MEMORY.md` + `memory/**/*.md`
3. memory search indexes those Markdown chunks
4. agent tools search/read the indexed content

Index storage today:

- per-agent SQLite index, typically under `~/.openclaw/memory/<agentId>.sqlite`
- this is a search/index artifact, **not** the primary authored memory source

## What OpenTrust should ingest first

For an honest plugin-backed memory layer, OpenTrust should start by ingesting:

1. `MEMORY.md`
2. `memory/**/*.md`
3. optional hook-generated memory snapshots
4. later: selected session transcripts, workflow artifacts, and curated promotions

This gives OpenTrust a truthful initial comparison:

- **OpenClaw today:** authored memory lives in Markdown files
- **OpenTrust plugin:** preserves that authored layer while adding structure, lineage, review, health, and export/backup workflows

## Recommended source mapping into OpenTrust

### Tier 1 — authored human/agent memory

Highest trust, should be ingested first:

- `MEMORY.md`
- `memory/YYYY-MM-DD.md`
- `memory/**/*.md` project or archived memory files

Suggested import treatment:

- `MEMORY.md` → long-term curated entries
- `memory/YYYY-MM-DD.md` → daily timeline entries
- project files → scoped/project memory records
- session snapshot files → provenance-rich episodic memory items

### Tier 2 — derived but reviewable operational context

Good next-step sources:

- promoted traces
- promoted artifacts
- promoted investigation outputs
- workflow-run summaries
- daily summary digests

Suggested import treatment:

- mark as derived/promoted
- require provenance links
- keep review status explicit

### Tier 3 — optional future extensions

- selected transcript summaries
- external calendar events
- personal journaling exports
- CRM/contact memory
- media/photo moment summaries

These should remain opt-in.

## Intelligent recommendation model for users

OpenTrust should not only store memory; it should **coach users toward useful memory habits**.

### Recommended default memory types

#### 1. Daily summaries

Strong default recommendation.

Store:
- what happened today
- key decisions
- unresolved threads
- meaningful moments
- follow-ups for tomorrow

Why:
- easiest habit to sustain
- best source for later promotion
- natural bridge between short-term and durable memory

Suggested OpenTrust recommendation copy:
- "Capture a short daily summary each evening so your meaningful moments don’t disappear into chat history."

#### 2. Long-term profile memory

Store:
- preferences
- life context
- stable relationships
- recurring schedule truths
- personal operating norms

Why:
- high leverage for future assistant usefulness
- low churn, high value

#### 3. Project memory

Store:
- project status
- key decisions
- risks
- handoffs
- links/bookmarks/bookkeeping

Why:
- makes memory operational, not sentimental only

#### 4. Meaningful moments / life log

Store:
- milestones
- emotionally important days
- wins
- trips
- health/life updates
- family or relationship notes the user explicitly wants retained

Why:
- supports personal continuity rather than only work continuity

#### 5. Contact / relationship memory

Store:
- important people
- how the user knows them
- preferences and context
- last meaningful interaction
- follow-up reminders

Why:
- this becomes the bridge into future CRM-like memory

## Backup and storage recommendations

OpenTrust should recommend multiple backup modes depending on user posture.

### Option A — Git-backed private repo

Best for technical users.

Store:
- Markdown memory files
- exported OpenTrust bundles
- selected snapshots

Pros:
- version history
- diffable
- easy restores
- transparent

Cons:
- requires discipline
- not ideal for binary-heavy archives

### Option B — encrypted cloud folder

Examples:
- iCloud Drive
- Dropbox
- Google Drive
- Syncthing-backed folder
- encrypted disk images / vaults

Pros:
- easy off-machine backup
- good for non-technical users

Cons:
- weaker audit/version semantics unless combined with snapshots

### Option C — periodic OpenTrust export bundles

Recommended long-term product feature.

Export:
- curated memory entries
- provenance metadata
- tags/retention/review status
- daily summary archive
- optional attachment manifest

Formats:
- Markdown bundle
- JSONL
- SQLite backup
- ZIP archive

Pros:
- portable
- re-importable
- ideal for migration

### Option D — dual-store strategy

Best default recommendation for serious users:

- authored Markdown remains primary human-readable source
- OpenTrust SQLite/plugin store remains structured operational layer
- scheduled export snapshots back up the structured layer

This is the strongest combined model.

## Daily summary recommendation engine ideas

OpenTrust should eventually provide dynamic suggestions such as:

- "You had 14 traces, 3 promoted memories, and 2 unresolved investigations today. Generate a daily summary?"
- "No daily note exists for today. Want a 5-bullet summary draft?"
- "This week has 4 promoted memories but no long-term promotion. Review candidates?"
- "You mentioned the same person across 3 notes. Create a relationship memory?"
- "This looks like a meaningful milestone. Save it to long-term memory or life log?"

## Proposed backup presets

### Minimal
- local Markdown only
- no structured export

### Safe default
- local Markdown
- OpenTrust SQLite
- weekly export bundle

### Durable personal archive
- local Markdown
- OpenTrust SQLite
- weekly export bundle
- encrypted cloud backup
- monthly human-readable life summary

### Operator / power user
- local Markdown
- OpenTrust SQLite
- git-backed history
- weekly JSONL/SQLite export
- project memory files
- CRM/contact memory files

## Honest comparison language for the landing page

Recommended framing:

### OpenClaw today
- memory is authored in Markdown files
- semantic search indexes those files
- daily notes + `MEMORY.md` are the canonical memory source
- good for direct capture and lightweight continuity

### OpenTrust plugin
- ingests the same authored memory source
- adds structured entities, provenance, review, timeline, health, and backup/export workflows
- makes memory inspectable and operational without replacing the user’s authored Markdown truth

## Guidance for product positioning

OpenTrust should not claim:
- that OpenClaw has no memory today
- that plugin storage replaces the workspace memory model

OpenTrust should claim:
- OpenClaw already has a real memory substrate today
- OpenTrust makes that substrate structured, reviewable, explorable, and backup-aware
