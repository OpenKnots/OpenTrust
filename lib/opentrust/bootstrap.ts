import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { ensureMigrated, escapeSqlString, runSql } from "@/lib/opentrust/db";

function sqlJson(value: unknown) {
  return escapeSqlString(JSON.stringify(value));
}

function syncCapability(kind: "skill" | "plugin" | "soul" | "bundle", name: string, metadata: Record<string, unknown> = {}) {
  const id = `${kind}:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  runSql(`
    INSERT INTO capabilities (id, kind, name, metadata_json)
    VALUES (${escapeSqlString(id)}, ${escapeSqlString(kind)}, ${escapeSqlString(name)}, ${sqlJson(metadata)})
    ON CONFLICT(id) DO UPDATE SET metadata_json=excluded.metadata_json;
  `);
}

function syncSkillsFromDirectory(directory: string, sourceLabel: string) {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    syncCapability("skill", entry.name, { source: sourceLabel, path: path.join(directory, entry.name) });
  }
}

function syncPluginsFromConfig() {
  const configPath = path.join(process.env.HOME ?? "", ".openclaw", "openclaw.json");
  if (!existsSync(configPath)) return;

  try {
    const parsed = JSON.parse(readFileSync(configPath, "utf8")) as {
      plugins?: { entries?: Record<string, { enabled?: boolean }> };
    };
    for (const [name, config] of Object.entries(parsed.plugins?.entries ?? {})) {
      if (config?.enabled) {
        syncCapability("plugin", name, { source: "openclaw.json", enabled: true });
      }
    }
  } catch {
    // Keep bootstrap resilient.
  }
}

function syncSoulFromIdentity() {
  const identityPath = path.join(process.env.HOME ?? "", ".openclaw", "workspace", "IDENTITY.md");
  if (!existsSync(identityPath)) return;
  const text = readFileSync(identityPath, "utf8");
  const match = text.match(/- \*\*Name:\*\*\s*(.+)/);
  const name = match?.[1]?.trim() || "Nova";
  syncCapability("soul", name, { source: "IDENTITY.md" });
}

function syncSystemBundleCapability() {
  syncCapability("bundle", "OpenTrust Dashboard Core", {
    source: "system",
    description: "Starter bundle for local-first OpenClaw investigations.",
  });
}

let warnedAboutMissingBuiltinSkills = false;

function getBuiltinSkillsDirectory() {
  const executableDir = path.dirname(process.execPath);
  const nodePrefix = path.dirname(executableDir);
  const candidates = [
    path.join(nodePrefix, "lib", "node_modules", "openclaw", "skills"),
    path.join(executableDir, "node_modules", "openclaw", "skills"),
    ...(process.env.APPDATA ? [path.join(process.env.APPDATA, "npm", "node_modules", "openclaw", "skills")] : []),
  ];

  for (const directory of candidates) {
    if (existsSync(directory)) {
      return directory;
    }
  }

  return null;
}

export function ensureBootstrapped() {
  ensureMigrated();
  syncSkillsFromDirectory(path.join(process.env.HOME ?? "", ".openclaw", "workspace", "skills"), "workspace-skills");
  const builtinSkillsDirectory = getBuiltinSkillsDirectory();
  if (builtinSkillsDirectory) {
    syncSkillsFromDirectory(builtinSkillsDirectory, "builtin-skills");
  } else if (!warnedAboutMissingBuiltinSkills) {
    warnedAboutMissingBuiltinSkills = true;
    console.warn("OpenTrust could not locate builtin OpenClaw skills; skipping builtin skill sync.");
  }
  syncPluginsFromConfig();
  syncSoulFromIdentity();
  syncSystemBundleCapability();
}
