# OpenTrust as a First-Class OpenClaw Plugin

## Purpose

This document defines how OpenTrust should ultimately be packaged and delivered as a **first-class OpenClaw plugin**.

OpenClaw’s user-facing language is **plugin**.
Internally, bundled plugins live under `extensions/*` and are discovered through plugin manifests.

That means the end-state for OpenTrust is not merely:
- a standalone Next.js app
- a local DB with routes
- a set of memory docs

The end-state is:

> OpenTrust packaged as an OpenClaw plugin that exposes the memory layer as an official OpenClaw capability.

## Packaging target

OpenTrust should ultimately ship as:
- an OpenClaw plugin package
- rooted under `extensions/opentrust` when bundled into the OpenClaw repo
- with an `openclaw.plugin.json` manifest
- with config surfaced under `plugins.entries.opentrust.*`
- with plugin-owned runtime entrypoints, routes, and optional tools/hooks

## Plugin role

The OpenTrust plugin should provide:
- memory ingestion orchestration
- memory storage management
- retrieval APIs
- memory health APIs
- memory promotion / writeback APIs
- operator-facing memory UI surfaces
- future agent-facing memory tools

## Recommended plugin responsibilities

### 1. Runtime
Own the memory runtime surface for:
- search
- inspect
- promote
- health
- indexing status
- ingestion status

### 2. Routes / UI
Expose operator-facing routes for:
- memory overview
- review queue
- health
- traceability / provenance views
- future insights and metrics views

### 3. Config
Expose plugin config under:
- `plugins.entries.opentrust.enabled`
- `plugins.entries.opentrust.config.*`

Suggested config areas:
- database path / storage mode
- ingestion toggles
- indexing toggles
- retention defaults
- health thresholds
- API exposure controls

### 4. Tooling
Eventually expose tool surfaces for OpenClaw to call directly, such as:
- `memory_search`
- `memory_inspect`
- `memory_promote`
- `memory_health`

These should align with `docs/MEMORY-API-CONTRACT.md`.

## Manifest expectations

The plugin should eventually include an `openclaw.plugin.json` manifest describing:
- plugin id
- entrypoint
- config schema
- routes or tool capabilities
- optional hooks
- optional memory-slot role if OpenClaw formalizes one

The exact manifest fields should follow current OpenClaw plugin conventions.
The durable requirement is that OpenTrust be installable/discoverable as a proper plugin, not as an ad hoc sidecar.

## Migration path

OpenTrust does not need to start inside `extensions/opentrust` immediately.
The concrete refactor sequence is captured in `docs/PLUGIN-READY-REFACTOR-PLAN.md`.

This migration path is **post-prerequisite work** and should follow the upstream order:
1. Tauri
2. persistence
3. reliable run completion

A sane path is:

### Stage 1 — Reference implementation (current)
- standalone repo
- stable docs
- stable runtime layer
- stable API shapes
- stable operator UX

### Stage 2 — Plugin-ready refactor
- isolate runtime entrypoints
- isolate config schema
- isolate plugin-owned routes/tools
- remove assumptions that only a standalone Next app hosts the memory layer

### Stage 3 — Bundled plugin packaging
- move or mirror into `extensions/opentrust`
- add `openclaw.plugin.json`
- wire config under `plugins.entries.opentrust`
- expose official plugin-owned endpoints/tools

### Stage 4 — Official memory plugin
- ship as the standard memory layer plugin for OpenClaw
- integrate into operator and agent flows as the preferred memory substrate

## Scope guardrails

Packaging as a plugin should **not** erase the current standard.

The plugin package must preserve:
- durable evidence model
- provenance and lineage guarantees
- retrieval contract shape
- writeback model
- operator trust and health visibility

Plugin packaging is a delivery mechanism.
The memory standard remains the product contract.

## What must be true before packaging

Before OpenTrust is promoted into a bundled first-class plugin, it should have:
- stable schema/migrations
- stable memory API contracts
- stable writeback model
- stable review flow
- stable health surface
- clear config boundaries
- clear route/tool ownership

## Planned plugin artifacts

The plugin work should eventually produce:
- `extensions/opentrust/package.json`
- `extensions/opentrust/openclaw.plugin.json`
- plugin runtime entrypoint(s)
- plugin config schema
- plugin route registration or compatible route hosting strategy
- plugin tool registration for memory contracts
- docs explaining config and operator setup

## Decision

OpenTrust should be planned and evolved toward **first-class OpenClaw plugin packaging**.
That is now part of the standard, not a side note.
