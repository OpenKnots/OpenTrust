import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const storageDir = path.join(repoRoot, "storage");
const dbPath = path.join(storageDir, "opentrust.sqlite");
const migrationPath = path.join(repoRoot, "db", "0001_init.sql");

function ensureStorageDir() {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir, { recursive: true });
  }
}

export function getDatabasePath() {
  ensureStorageDir();
  return dbPath;
}

export function runSql(sql: string) {
  const target = getDatabasePath();
  execFileSync("sqlite3", [target], {
    input: sql,
    stdio: ["pipe", "pipe", "pipe"],
    encoding: "utf8",
  });
}

export function queryJson<T>(sql: string): T[] {
  const target = getDatabasePath();
  const output = execFileSync("sqlite3", ["-json", target], {
    input: sql,
    stdio: ["pipe", "pipe", "pipe"],
    encoding: "utf8",
  }).trim();

  if (!output) return [];
  return JSON.parse(output) as T[];
}

export function queryOne<T>(sql: string): T | null {
  return queryJson<T>(sql)[0] ?? null;
}

export function escapeSqlString(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

export function ensureMigrated() {
  ensureStorageDir();
  const migrationSql = readFileSync(migrationPath, "utf8");
  runSql(migrationSql);
}
