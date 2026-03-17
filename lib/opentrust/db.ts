import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const storageDir = path.join(repoRoot, "storage");
const dbPath = path.join(storageDir, "opentrust.sqlite");
const migrationPath = path.join(repoRoot, "db", "0001_init.sql");

let database: DatabaseSync | null = null;

function ensureStorageDir() {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir, { recursive: true });
  }
}

export function getDatabasePath() {
  ensureStorageDir();
  return dbPath;
}

export function getDb() {
  if (database) return database;

  ensureStorageDir();
  database = new DatabaseSync(dbPath);
  database.exec("PRAGMA journal_mode=WAL;");
  database.exec("PRAGMA foreign_keys=ON;");
  return database;
}

export function runSql(sql: string) {
  getDb().exec(sql);
}

export function queryJson<T>(sql: string, params?: Record<string, unknown>) {
  const statement = getDb().prepare(sql);
  return (params ? statement.all(params as never) : statement.all()) as T[];
}

export function queryOne<T>(sql: string, params?: Record<string, unknown>) {
  const statement = getDb().prepare(sql);
  const row = (params ? statement.get(params as never) : statement.get()) as T | undefined;
  return row ?? null;
}

export function execute(sql: string, params?: Record<string, unknown>) {
  const statement = getDb().prepare(sql);
  return params ? statement.run(params as never) : statement.run();
}

export function escapeSqlString(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

export function ensureMigrated() {
  const migrationSql = readFileSync(migrationPath, "utf8");
  runSql(migrationSql);
}
