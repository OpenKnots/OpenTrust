# OpenTrust Plugin Draft Artifacts

## Purpose

This document captures the first concrete draft artifacts for packaging OpenTrust as a first-class OpenClaw plugin.

All draft artifacts now live in this repo under:

- `plugin-drafts/opentrust/`

These are **drafts**, not yet bundled into the `openclaw/openclaw` repo.
They exist to reduce ambiguity before the first real packaging PR.

## Draft package location

```text
plugin-drafts/opentrust/
  package.json
  openclaw.plugin.json
  index.ts
  api.ts
  README.md
  src/
    config.ts
    client.ts
    tools.ts
    http.ts
```

## What the draft currently models

- plugin package metadata
- plugin manifest
- plugin config shape
- plugin runtime entrypoint
- first-class memory tool registration
- plugin-owned HTTP route prefix (`/plugins/opentrust`)
- proxy bridge to the OpenTrust service endpoints

## Draft artifacts included

### `package.json`
Declares the extension package shape and `openclaw.extensions` entry.

### `openclaw.plugin.json`
Declares:
- plugin id
- plugin kind
- description
- config schema draft

### `index.ts`
Draft plugin entrypoint using:
- `definePluginEntry(...)`
- tool registration
- plugin-owned HTTP route registration

### `src/config.ts`
Draft config resolver for:
- `service.baseUrl`
- `service.apiPrefix`
- `service.timeoutMs`
- `defaults.retentionClass`

### `src/client.ts`
Draft bridge client that proxies to:
- `/api/memory/search`
- `/api/memory/inspect`
- `/api/memory/promote`
- `/api/memory/health`

### `src/tools.ts`
Draft first-class tools:
- `memory_search`
- `memory_inspect`
- `memory_promote`
- `memory_health`

### `src/http.ts`
Draft plugin-owned route bridge under:
- `/plugins/opentrust/*`

## Current scope guardrail

These draft files are planning/package artifacts only.
They should not be treated as the canonical runtime yet.

The canonical runtime remains the actual OpenTrust app/runtime in this repo.

See also:
- `docs/PLUGIN-DRAFT-RUNTIME-MAP.md`

## Recommended next step

When ready to move into the real OpenClaw repo, promote these draft files into:

- `extensions/opentrust/`

and then add focused plugin tests for:
- registration
- route registration
- bridge client behavior
- route proxy behavior
