export interface OpenTrustPluginConfig {
  service?: {
    baseUrl?: string;
    apiPrefix?: string;
    timeoutMs?: number;
  };
  defaults?: {
    retentionClass?: "ephemeral" | "working" | "longTerm" | "pinned";
  };
}

export interface ResolvedOpenTrustPluginConfig {
  service: {
    baseUrl: string;
    apiPrefix: string;
    timeoutMs: number;
  };
  defaults: {
    retentionClass: "ephemeral" | "working" | "longTerm" | "pinned";
  };
}

export function resolveOpenTrustConfig(input: unknown): ResolvedOpenTrustPluginConfig {
  const cfg = (input ?? {}) as OpenTrustPluginConfig;
  return {
    service: {
      baseUrl: cfg.service?.baseUrl ?? "http://127.0.0.1:3000",
      apiPrefix: cfg.service?.apiPrefix ?? "/api/memory",
      timeoutMs: cfg.service?.timeoutMs ?? 10000,
    },
    defaults: {
      retentionClass: cfg.defaults?.retentionClass ?? "working",
    },
  };
}
