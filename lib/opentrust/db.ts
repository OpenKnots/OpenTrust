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
  database = new DatabaseSync(dbPath, { allowExtension: true });
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

  const workflowRunColumns = queryJson<{ name: string }>("PRAGMA table_info(workflow_runs);");
  const hasSourceKind = workflowRunColumns.some((column) => column.name === "source_kind");
  if (!hasSourceKind) {
    runSql("ALTER TABLE workflow_runs ADD COLUMN source_kind TEXT;");
  }

  runSql(`
    CREATE TABLE IF NOT EXISTS ingestion_state (
      source_key TEXT PRIMARY KEY,
      source_kind TEXT NOT NULL,
      cursor_text TEXT,
      cursor_number INTEGER,
      last_run_at TEXT,
      last_status TEXT,
      imported_count INTEGER NOT NULL DEFAULT 0,
      metadata_json TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS saved_investigations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      sql_text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      metadata_json TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS semantic_chunks (
      chunk_id TEXT PRIMARY KEY,
      source_kind TEXT NOT NULL,
      source_id TEXT NOT NULL,
      title TEXT,
      body TEXT NOT NULL,
      token_estimate INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      metadata_json TEXT NOT NULL DEFAULT '{}'
    );

    CREATE TABLE IF NOT EXISTS semantic_index_state (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      vector_extension_path TEXT,
      last_chunk_run_at TEXT,
      metadata_json TEXT NOT NULL DEFAULT '{}'
    );
  `);
}
