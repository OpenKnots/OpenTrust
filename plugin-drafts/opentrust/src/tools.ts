import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "openclaw/plugin-sdk/plugin-entry";
import { OpenTrustClient } from "./client.js";
import type { OpenTrustPluginConfig } from "./config.js";

export function createOpenTrustTools(config: Required<OpenTrustPluginConfig>) {
  const client = new OpenTrustClient(config);

  const memorySearch: AnyAgentTool = {
    name: "memory_search",
    description: "Search curated OpenTrust memory entries through the OpenTrust memory service.",
    parameters: Type.Object({ query: Type.String(), limit: Type.Optional(Type.Number()), minConfidence: Type.Optional(Type.Number()) }),
    async execute(_toolCallId, params) {
      const result = await client.search(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], details: result };
    },
  };

  const memoryInspect: AnyAgentTool = {
    name: "memory_inspect",
    description: "Inspect a memory reference and return lineage, related refs, and raw availability.",
    parameters: Type.Object({ id: Type.String(), type: Type.Optional(Type.String()) }),
    async execute(_toolCallId, params) {
      const typed = params as { id: string; type?: string };
      const result = await client.inspect({ ref: { id: typed.id, type: typed.type ?? "memoryEntry" }, includeLineage: true, includeRelated: true, includeRaw: true });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], details: result };
    },
  };

  const memoryPromote: AnyAgentTool = {
    name: "memory_promote",
    description: "Promote evidence into curated OpenTrust memory.",
    parameters: Type.Object({ title: Type.String(), body: Type.String(), summary: Type.Optional(Type.String()), originType: Type.String(), originId: Type.String(), retentionClass: Type.Optional(Type.String()) }),
    async execute(_toolCallId, params) {
      const typed = params as { title: string; body: string; summary?: string; originType: string; originId: string; retentionClass?: string };
      const result = await client.promote({ kind: "memoryEntry", title: typed.title, body: typed.body, summary: typed.summary, originRefs: [{ type: typed.originType, id: typed.originId }], retentionClass: typed.retentionClass ?? config.defaults.retentionClass, author: { type: "agent", id: "openclaw-opentrust-plugin" }, review: { status: "draft" } });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], details: result };
    },
  };

  const memoryHealth: AnyAgentTool = {
    name: "memory_health",
    description: "Query OpenTrust memory health signals.",
    parameters: Type.Object({ scope: Type.Optional(Type.String()), sourceId: Type.Optional(Type.String()) }),
    async execute(_toolCallId, params) {
      const typed = params as { scope?: string; sourceId?: string };
      const result = await client.health({ scope: typed.scope ?? "global", sourceId: typed.sourceId });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }], details: result };
    },
  };

  return [memorySearch, memoryInspect, memoryPromote, memoryHealth];
}
