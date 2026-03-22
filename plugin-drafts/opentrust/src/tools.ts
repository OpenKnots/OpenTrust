import { OpenTrustClient } from "./client.js";
import type { ResolvedOpenTrustPluginConfig } from "./config.js";

type JsonSchema = Record<string, unknown>;

interface AnyAgentTool {
  name: string;
  description: string;
  parameters: JsonSchema;
  execute(toolCallId: string, params: unknown): Promise<{ content: Array<{ type: string; text: string }>; details?: unknown }>;
}

function typeString() { return { type: "string" } as const; }
function typeNumber() { return { type: "number" } as const; }
function typeOptional<T extends Record<string, unknown>>(schema: T) { return { ...schema, optional: true } as const; }
function typeObject(properties: Record<string, Record<string, unknown>>): JsonSchema {
  const required = Object.entries(properties).filter(([, v]) => !("optional" in v)).map(([k]) => k);
  const cleaned: Record<string, Record<string, unknown>> = {};
  for (const [k, v] of Object.entries(properties)) {
    const { optional: _, ...rest } = v as Record<string, unknown> & { optional?: boolean };
    cleaned[k] = rest;
  }
  return { type: "object", properties: cleaned, ...(required.length > 0 ? { required } : {}) };
}

export function createOpenTrustTools(config: ResolvedOpenTrustPluginConfig) {
  const client = new OpenTrustClient(config);

  const memorySearch: AnyAgentTool = {
    name: "memory_search",
    description: "Search curated OpenTrust memory entries through the OpenTrust memory service.",
    parameters: typeObject({ query: typeString(), limit: typeOptional(typeNumber()), minConfidence: typeOptional(typeNumber()) }),
    async execute(_toolCallId, params) {
      const result = await client.search(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], details: result };
    },
  };

  const memoryInspect: AnyAgentTool = {
    name: "memory_inspect",
    description: "Inspect a memory reference and return lineage, related refs, and raw availability.",
    parameters: typeObject({ id: typeString(), type: typeOptional(typeString()) }),
    async execute(_toolCallId, params) {
      const typed = params as { id: string; type?: string };
      const result = await client.inspect({ ref: { id: typed.id, type: typed.type ?? "memoryEntry" }, includeLineage: true, includeRelated: true, includeRaw: true });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], details: result };
    },
  };

  const memoryPromote: AnyAgentTool = {
    name: "memory_promote",
    description: "Promote evidence into curated OpenTrust memory.",
    parameters: typeObject({ title: typeString(), body: typeString(), summary: typeOptional(typeString()), originType: typeString(), originId: typeString(), retentionClass: typeOptional(typeString()) }),
    async execute(_toolCallId, params) {
      const typed = params as { title: string; body: string; summary?: string; originType: string; originId: string; retentionClass?: string };
      const result = await client.promote({ kind: "memoryEntry", title: typed.title, body: typed.body, summary: typed.summary, originRefs: [{ type: typed.originType, id: typed.originId }], retentionClass: typed.retentionClass ?? config.defaults.retentionClass, author: { type: "agent", id: "openclaw-opentrust-plugin" }, review: { status: "draft" } });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], details: result };
    },
  };

  const memoryHealth: AnyAgentTool = {
    name: "memory_health",
    description: "Query OpenTrust memory health signals.",
    parameters: typeObject({ scope: typeOptional(typeString()), sourceId: typeOptional(typeString()) }),
    async execute(_toolCallId, params) {
      const typed = params as { scope?: string; sourceId?: string };
      const result = await client.health({ scope: typed.scope ?? "global", sourceId: typed.sourceId });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], details: result };
    },
  };

  return [memorySearch, memoryInspect, memoryPromote, memoryHealth];
}
