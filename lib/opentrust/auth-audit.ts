import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

function auditPath() {
  const root = process.cwd();
  const dir = path.join(root, "storage", "audit");
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return path.join(dir, "auth.log");
}

/** Append a JSON-line auth event to the audit log file (best-effort, swallows FS errors). */
export function writeAuthAudit(event: {
  action: "login_success" | "login_failure" | "logout";
  ip?: string | null;
  userAgent?: string | null;
  detail?: string | null;
}) {
  try {
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      ...event,
    });
    appendFileSync(auditPath(), `${line}\n`, "utf8");
  } catch {
    // Filesystem may be read-only in serverless environments (e.g. Vercel).
    // Audit is best-effort; swallow the error to avoid crashing the request.
  }
}
