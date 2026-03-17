# OpenTrust — Field Manual Blueprint

## Product stance

OpenTrust should feel calm, legible, and capable.

It is **not** a noisy observability console.
It is a **field manual** for understanding what happened inside OpenClaw and why.

## UX principles

### 1. Beginner-friendly first screen
The first screen should answer:
- what is this system for?
- what can I inspect?
- where do I click first?

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

### 5. Local-first confidence
The operator should always understand:
- where data lives
- what remains local
- what is indexed semantically
- how to inspect or export raw evidence

## Core V1 views

- Home / briefing
- Trace atlas
- Workflow ledger
- Capability registry
- Investigation studio
- Artifact explorer

## Language style

Avoid heavy platform jargon in the first layer.
Use human labels like:
- trace
- workflow
- capability
- evidence
- lineage
- investigation

Reveal lower-level terms only as users drill deeper.
