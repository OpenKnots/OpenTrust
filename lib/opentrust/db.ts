import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const storageDir = path.join(repoRoot, "storage");
const dbPath = path.join(storageDir, "opentrust.sqlite");
const migrationPath = path.join(repoRoot, "db", "0001_init.sql");

const globalForDb = globalThis as unknown as {
  __opentrustDb: Database.Database | undefined;
};

function ensureStorageDir() {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir, { recursive: true });
  }
}

/** Return the absolute path to the SQLite database file. */
export function getDatabasePath() {
  ensureStorageDir();
  return dbPath;
}

/** Return the shared SQLite database instance, creating it on first access. */
export function getDb() {
  if (globalForDb.__opentrustDb) return globalForDb.__opentrustDb;

  ensureStorageDir();
  const db = new Database(dbPath);
  db.exec("PRAGMA journal_mode=WAL;");
  db.exec("PRAGMA foreign_keys=ON;");
  globalForDb.__opentrustDb = db;
  return db;
}

/** Execute a raw SQL string (no parameter binding). */
export function runSql(sql: string) {
  getDb().exec(sql);
}

/** Execute a SQL query and return all matching rows as typed objects. */
export function queryJson<T>(sql: string, params?: Record<string, unknown>) {
  const statement = getDb().prepare(sql);
  return (params ? statement.all(params as never) : statement.all()) as T[];
}

/** Execute a SQL query and return the first row, or null if none match. */
export function queryOne<T>(sql: string, params?: Record<string, unknown>) {
  const statement = getDb().prepare(sql);
  const row = (params ? statement.get(params as never) : statement.get()) as T | undefined;
  return row ?? null;
}

/** Execute a SQL statement with optional named parameters and return the run result. */
export function execute(sql: string, params?: Record<string, unknown>) {
  const statement = getDb().prepare(sql);
  return params ? statement.run(params as never) : statement.run();
}

/**
 * Execute a callback inside a SQLite transaction. If the callback throws,
 * the transaction is rolled back automatically. Returns the callback's result.
 */
export function withTransaction<T>(fn: () => T): T {
  const db = getDb();
  const wrapped = db.transaction(fn);
  return wrapped();
}

/** Escape a string for safe inclusion in a raw SQL literal (single-quote wrapping). */
export function escapeSqlString(value: string) {
  return `'${value.replaceAll("'", "''")}'`;
}

/**
 * Run all database migrations to bring the schema up to date.
 * Safe to call repeatedly; uses IF NOT EXISTS and column checks.
 */
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

    CREATE TABLE IF NOT EXISTS memory_entries (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      summary TEXT,
      retention_class TEXT NOT NULL,
      review_status TEXT NOT NULL,
      review_notes TEXT,
      confidence_score REAL,
      confidence_reason TEXT,
      uncertainty_summary TEXT,
      author_type TEXT NOT NULL,
      author_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      reviewed_at TEXT,
      reviewed_by TEXT
    );

    CREATE TABLE IF NOT EXISTS memory_entry_origins (
      memory_entry_id TEXT NOT NULL REFERENCES memory_entries(id) ON DELETE CASCADE,
      origin_type TEXT NOT NULL,
      origin_id TEXT NOT NULL,
      relationship TEXT NOT NULL,
      PRIMARY KEY (memory_entry_id, origin_type, origin_id, relationship)
    );

    CREATE TABLE IF NOT EXISTS memory_entry_tags (
      memory_entry_id TEXT NOT NULL REFERENCES memory_entries(id) ON DELETE CASCADE,
      tag TEXT NOT NULL,
      PRIMARY KEY (memory_entry_id, tag)
    );

    CREATE INDEX IF NOT EXISTS idx_memory_entry_origins_origin ON memory_entry_origins(origin_type, origin_id);
    CREATE INDEX IF NOT EXISTS idx_memory_entry_tags_tag ON memory_entry_tags(tag);
    CREATE INDEX IF NOT EXISTS idx_memory_entries_review_status ON memory_entries(review_status);
    CREATE INDEX IF NOT EXISTS idx_memory_entries_retention_class ON memory_entries(retention_class);
    CREATE INDEX IF NOT EXISTS idx_memory_entries_updated_at ON memory_entries(updated_at DESC);
  `);

  const memoryEntryColumns = queryJson<{ name: string }>("PRAGMA table_info(memory_entries);");
  const hasReviewNotes = memoryEntryColumns.some((column) => column.name === "review_notes");
  if (!hasReviewNotes) {
    runSql("ALTER TABLE memory_entries ADD COLUMN review_notes TEXT;");
  }

  const hasArchivedAt = memoryEntryColumns.some((column) => column.name === "archived_at");
  if (!hasArchivedAt) {
    runSql("ALTER TABLE memory_entries ADD COLUMN archived_at TEXT;");
  }

  runSql(`
    CREATE TABLE IF NOT EXISTS memory_entry_versions (
      id TEXT NOT NULL,
      version INTEGER NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      summary TEXT,
      retention_class TEXT NOT NULL,
      review_status TEXT NOT NULL,
      changed_by_type TEXT NOT NULL,
      changed_by_id TEXT,
      changed_at TEXT NOT NULL,
      change_reason TEXT,
      PRIMARY KEY (id, version)
    );

    CREATE INDEX IF NOT EXISTS idx_memory_entry_versions_id ON memory_entry_versions(id);
  `);
}
