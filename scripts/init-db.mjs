import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";

const repoRoot = process.cwd();
const storageDir = path.join(repoRoot, "storage");
const dbPath = path.join(storageDir, "opentrust.sqlite");
const migrationPath = path.join(repoRoot, "db", "0001_init.sql");

if (!existsSync(storageDir)) {
  mkdirSync(storageDir, { recursive: true });
}

const migrationSql = readFileSync(migrationPath, "utf8");
execFileSync("sqlite3", [dbPath], {
  input: migrationSql,
  stdio: ["pipe", "pipe", "pipe"],
  encoding: "utf8",
});

console.log(`Initialized OpenTrust database at ${dbPath}`);
