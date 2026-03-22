import { definePluginEntry } from "./src/plugin-sdk.js";
import { resolveOpenTrustConfig } from "./src/config.js";
import { createOpenTrustHttpHandler } from "./src/http.js";
import { createOpenTrustTools } from "./src/tools.js";

export default definePluginEntry({
  id: "opentrust",
  name: "OpenTrust",
  description: "Draft OpenTrust memory layer plugin that bridges OpenClaw tools and plugin routes to the OpenTrust service.",
  kind: "memory",
  register(api) {
    const config = resolveOpenTrustConfig(api.pluginConfig);
    for (const tool of createOpenTrustTools(config)) api.registerTool(tool);
    api.registerHttpRoute({
      path: "/plugins/opentrust",
      auth: "plugin",
      match: "prefix",
      handler: createOpenTrustHttpHandler(config),
    });
  },
});
