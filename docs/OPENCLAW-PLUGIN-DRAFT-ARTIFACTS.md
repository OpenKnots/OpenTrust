# OpenTrust Plugin Draft Artifacts

## Purpose

This document captures the first concrete draft artifacts for packaging OpenTrust as a first-class OpenClaw plugin.

These are **drafts**, not yet committed into the `openclaw/openclaw` repo.
They exist to reduce ambiguity before the first packaging PR.

## 1. Draft plugin package shape

```text
extensions/opentrust/
  package.json
  openclaw.plugin.json
  index.ts
  api.ts
  src/
    config.ts
    tools/
      memory-search.ts
      memory-inspect.ts
      memory-promote.ts
      memory-health.ts
    http/
      search.ts
      inspect.ts
      promote.ts
      health.ts
```

## 2. Draft `package.json`

```json
{
  "name": "@openclaw/opentrust",
  "version": "0.1.0",
  "private": true,
  "description": "OpenClaw memory layer plugin",
  "type": "module",
  "openclaw": {
    "extensions": ["./index.ts"]
  },
  "dependencies": {
    "better-sqlite3": "^12.4.1"
  }
}
```

## 3. Draft `openclaw.plugin.json`

```json
{
  "id": "opentrust",
  "name": "OpenTrust",
  "description": "Official OpenClaw memory layer plugin for durable evidence, retrieval, lineage, and memory health.",
  "configSchema": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "storage": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "path": {
            "type": "string",
            "default": "~/.openclaw/opentrust.sqlite"
          },
          "mode": {
            "type": "string",
            "enum": ["local"],
            "default": "local"
          }
        }
      },
      "ingestion": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "sessions": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "enabled": { "type": "boolean", "default": true }
            }
          },
          "workflows": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "enabled": { "type": "boolean", "default": true }
            }
          }
        }
      },
      "indexing": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "semantic": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
              "enabled": { "type": "boolean", "default": true }
            }
          }
        }
      },
      "retention": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "defaultClass": {
            "type": "string",
            "enum": ["ephemeral", "working", "longTerm", "pinned"],
            "default": "working"
          }
        }
      },
      "health": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "stalePipelineHours": {
            "type": "number",
            "minimum": 1,
            "maximum": 168,
            "default": 8
          }
        }
      },
      "api": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "enableRoutes": { "type": "boolean", "default": true },
          "enableTools": { "type": "boolean", "default": true }
        }
      }
    }
  }
}
```

## 4. Draft plugin entrypoint

```ts
import { definePluginEntry, type OpenClawPluginApi } from "./api.js";
import { createMemorySearchTool } from "./src/tools/memory-search.js";
import { createMemoryInspectTool } from "./src/tools/memory-inspect.js";
import { createMemoryPromoteTool } from "./src/tools/memory-promote.js";
import { createMemoryHealthTool } from "./src/tools/memory-health.js";
import { createMemoryHttpHandler } from "./src/http/index.js";
import { opentrustPluginConfigSchema } from "./src/config.js";

export default definePluginEntry({
  id: "opentrust",
  name: "OpenTrust",
  description: "Official OpenClaw memory layer plugin.",
  configSchema: opentrustPluginConfigSchema,
  register(api: OpenClawPluginApi) {
    api.registerTool((ctx) => createMemorySearchTool({ api, context: ctx }), { name: "memory_search" });
    api.registerTool((ctx) => createMemoryInspectTool({ api, context: ctx }), { name: "memory_inspect" });
    api.registerTool((ctx) => createMemoryPromoteTool({ api, context: ctx }), { name: "memory_promote" });
    api.registerTool((ctx) => createMemoryHealthTool({ api, context: ctx }), { name: "memory_health" });

    api.registerHttpRoute({
      path: "/plugins/opentrust",
      auth: "plugin",
      match: "prefix",
      handler: createMemoryHttpHandler({ api }),
    });
  },
});
```

## 5. Route/tool ownership map

### Plugin-owned tools
- `memory_search`
- `memory_inspect`
- `memory_promote`
- `memory_health`

### Plugin-owned HTTP paths
- `/plugins/opentrust/search`
- `/plugins/opentrust/inspect`
- `/plugins/opentrust/promote`
- `/plugins/opentrust/health`

### Optional operator routes later
- `/plugins/opentrust/ui/memory`
- `/plugins/opentrust/ui/review`
- `/plugins/opentrust/ui/health`

## 6. E2E integration checklist

### First packaging E2E target
Verify that a draft `opentrust` plugin can:
- load successfully in OpenClaw plugin discovery
- register all four memory tools
- register plugin-owned HTTP routes
- answer a health request
- answer a search request
- reject malformed promote requests with stable envelopes

### Specific E2E assertions
- plugin shows as `loaded` in `plugins list --json`
- tools include:
  - `memory_search`
  - `memory_inspect`
  - `memory_promote`
  - `memory_health`
- GET `/plugins/opentrust/health` returns envelope `{ ok: true, data: ... }`
- POST `/plugins/opentrust/promote` rejects malformed payload with `{ ok: false, error: ... }`
- config keys resolve under `plugins.entries.opentrust.config.*`

## 7. Recommended next implementation PR sequence

### PR A — draft packaging artifacts
- create plugin manifest draft
- create package draft
- create entrypoint draft
- create config schema draft

### PR B — route/tool adapter extraction
- extract route handlers to plugin-reusable modules
- add tool wrappers around runtime

### PR C — OpenClaw E2E test
- load draft plugin in OpenClaw test runtime
- verify tools/routes/config

## Decision

These draft artifacts are the recommended bridge between planning and the first real plugin packaging PR.
