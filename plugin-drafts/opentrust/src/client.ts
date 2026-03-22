import type { ResolvedOpenTrustPluginConfig } from "./config.js";

export class OpenTrustClient {
  constructor(private readonly config: ResolvedOpenTrustPluginConfig) {}

  private buildUrl(path: string) {
    return `${this.config.service.baseUrl.replace(/\/$/, "")}${this.config.service.apiPrefix}${path}`;
  }

  private async request(path: string, init?: RequestInit) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.service.timeoutMs);
    try {
      const response = await fetch(this.buildUrl(path), {
        ...init,
        signal: controller.signal,
        headers: {
          "content-type": "application/json",
          ...(init?.headers ?? {}),
        },
      });
      const json = await response.json();
      if (!response.ok || json?.ok === false) {
        const message = json?.error?.message ?? `Request failed with ${response.status}`;
        throw new Error(message);
      }
      return json?.data ?? json;
    } finally {
      clearTimeout(timeout);
    }
  }

  search(body: unknown) { return this.request("/search", { method: "POST", body: JSON.stringify(body) }); }
  inspect(body: unknown) { return this.request("/inspect", { method: "POST", body: JSON.stringify(body) }); }
  promote(body: unknown) { return this.request("/promote", { method: "POST", body: JSON.stringify(body) }); }
  health(body: unknown) { return this.request("/health", { method: "POST", body: JSON.stringify(body) }); }
}
