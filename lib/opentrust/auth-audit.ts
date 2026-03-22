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

export function writeAuthAudit(event: {
  action: "login_success" | "login_failure" | "logout";
  ip?: string | null;
  userAgent?: string | null;
  detail?: string | null;
}) {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    ...event,
  });
  appendFileSync(auditPath(), `${line}\n`, "utf8");
}
