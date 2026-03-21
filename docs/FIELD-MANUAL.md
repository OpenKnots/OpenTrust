# OpenTrust — Design Blueprint

## Product stance

OpenTrust should feel calm, legible, and capable.

It is not a noisy observability console.
It is not a toy memory browser.
It should feel like a **clear operational dashboard for OpenClaw memory** — a place where an operator can understand:
- what happened
- what was stored
- what is retrievable
- what is missing
- what changed
- what can be trusted
- what needs attention

## UX principles

### 1. Beginner-friendly first screen
The first screen should answer:
- what is this memory layer for?
- what kinds of evidence are stored?
- what is fresh vs stale?
- what can I inspect first?
- what needs attention now?

### 2. Progressive disclosure
Every major view should unfold in layers:
1. summary
2. evidence snippets
3. lineage and related entities
4. raw payloads / SQL / full JSON

### 3. Minimalist but not sterile
Use:
- dark glassmorphic surfaces
- clean typography
- strong spacing rhythm
- restrained accent color
- low-noise borders
- no dashboard clutter

### 4. Traceability over vibes
Every important view should show provenance:
- source session
- workflow run
- capabilities involved
- tools invoked
- artifacts created
- evidence rows available
- ingestion freshness when relevant
- whether the result is observed, derived, or inferred

### 5. Local-first confidence
The operator should always understand:
- where data lives
- what remains local
- what is indexed semantically
- what has been ingested vs not yet ingested
- how to inspect or export raw evidence

### 6. Memory health must be visible
The UI should make it easy to see:
- stale pipelines
- failed ingestion
- missing vectors
- weak retrieval coverage
- unsupported conclusions
- low-confidence summaries

### 7. Insight must remain evidence-backed
OpenTrust should expose dynamic intelligence, but never as disconnected magic.
Insight surfaces should always make it easy to inspect:
- supporting evidence
- freshness
- related traces/workflows
- uncertainty
- source provenance

## Current UX surfaces

Implemented today:
- Home / briefing dashboard
- Trace atlas
- Imported OpenClaw sessions
- Workflow ledger cards
- Capability registry
- Investigation studio
- Runtime / ingestion status cards
- Trace detail pages with tools, events, and artifacts

Needed to fulfill the memory-layer standard:
- explicit memory health view
- better retrieval quality / freshness views
- stronger artifact filtering and grouping
- richer workflow analytics
- editable investigation presets and authoring flows
- clearer insight derivation surfaces
- better export/audit views
- stronger memory promotion and retention UX

## Language style

Avoid heavy platform jargon in the first layer.
Use human labels like:
- trace
- workflow
- capability
- evidence
- lineage
- investigation
- artifact
- memory health
- retrieval quality
- insight

Reveal lower-level terms only as users drill deeper.

## Mental model for operators

The UI should reinforce this sequence:

1. **Observe** what happened
2. **Trace** where it came from
3. **Inspect** the evidence and artifacts
4. **Retrieve** related memory
5. **Judge** confidence and uncertainty
6. **Act** on what needs review or repair

## Note on naming

“Field manual” is still a useful design inspiration, but the user-facing identity should remain:
- dashboard-first
- operator-grade
- evidence-backed
- OpenClaw-native

This is the memory layer for OpenClaw, not a detached manual or generic admin panel.
