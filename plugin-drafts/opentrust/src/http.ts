import type { IncomingMessage, ServerResponse } from "node:http";
import { OpenTrustClient } from "./client.js";
import type { ResolvedOpenTrustPluginConfig } from "./config.js";

const PREFIX = "/plugins/opentrust";

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("cache-control", "no-store, max-age=0");
  res.end(JSON.stringify(body));
}

export function createOpenTrustHttpHandler(config: ResolvedOpenTrustPluginConfig) {
  const client = new OpenTrustClient(config);

  return async (req: IncomingMessage, res: ServerResponse): Promise<boolean> => {
    const rawUrl = req.url ?? "";
    const url = new URL(rawUrl, "http://127.0.0.1");
    if (!url.pathname.startsWith(PREFIX)) return false;

    try {
      if (url.pathname === `${PREFIX}/health`) {
        const result = await client.health({
          scope: url.searchParams.get("scope") ?? "global",
          sourceId: url.searchParams.get("sourceId") ?? undefined,
        });
        sendJson(res, 200, { ok: true, data: result });
        return true;
      }

      if (req.method !== "POST") {
        sendJson(res, 405, { ok: false, error: { code: "method_not_allowed", message: "Method not allowed", details: null } });
        return true;
      }

      const rawBody = await readRequestBody(req);
      const body = rawBody ? JSON.parse(rawBody) : {};

      if (url.pathname === `${PREFIX}/search`) {
        sendJson(res, 200, { ok: true, data: await client.search(body) });
        return true;
      }
      if (url.pathname === `${PREFIX}/inspect`) {
        sendJson(res, 200, { ok: true, data: await client.inspect(body) });
        return true;
      }
      if (url.pathname === `${PREFIX}/promote`) {
        sendJson(res, 200, { ok: true, data: await client.promote(body) });
        return true;
      }

      sendJson(res, 404, { ok: false, error: { code: "not_found", message: "Route not found", details: null } });
      return true;
    } catch (error) {
      sendJson(res, 500, { ok: false, error: { code: "proxy_error", message: error instanceof Error ? error.message : "Unexpected proxy error", details: null } });
      return true;
    }
  };
}
