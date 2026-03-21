# Docs Alignment Notes

## Why these docs changed

The repository previously contained a strategic split:
- OpenTrust as a local-first OpenClaw traceability layer
- OpenTrust as a prototype to replace with a separate Convex-native product

That split made planning ambiguous.

## New alignment

The docs now align around one decision:

**OpenTrust is the reference implementation for the OpenClaw memory layer standard.**

This means:
- future backend/runtime changes are implementation choices
- the memory model, retrieval model, provenance expectations, and operator trust guarantees are the durable product standard
- roadmap work should strengthen OpenClaw memory rather than fork into an unrelated product thesis

## Scope guardrails

OpenTrust should focus on:
- durable evidence storage
- retrieval quality
- lineage and provenance
- insight and metrics
- memory health
- agent/operator integration
- first-class OpenClaw plugin packaging readiness

OpenTrust should avoid drifting into:
- generic database admin tooling
- broad data-ops product sprawl detached from OpenClaw
- backend-driven redesigns that discard the memory model
andard and provenance guarantees
