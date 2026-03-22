import type { IncomingMessage, ServerResponse } from "node:http";

export interface PluginTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute(toolCallId: string, params: unknown): Promise<{ content: Array<{ type: string; text: string }>; details?: unknown }>;
}

export interface PluginHttpRoute {
  path: string;
  auth: string;
  match: string;
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;
}

export interface PluginApi {
  pluginConfig: unknown;
  registerTool(tool: PluginTool): void;
  registerHttpRoute(route: PluginHttpRoute): void;
}

export interface PluginEntry {
  id: string;
  name: string;
  description: string;
  kind: string;
  register(api: PluginApi): void;
}

export function definePluginEntry(entry: PluginEntry): PluginEntry {
  return entry;
}
