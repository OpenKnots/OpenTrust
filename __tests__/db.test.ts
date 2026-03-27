import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

/**
 * These tests exercise the database layer against a real SQLite instance
 * using a temporary directory, bypassing the singleton to avoid polluting
 * the development database.
 */

const TEST_DIR = path.join(process.cwd(), "storage", "__test__");
const TEST_DB_PATH = path.join(TEST_DIR, "test.sqlite");
const MIGRATION_PATH = path.join(process.cwd(), "db", "0001_init.sql");

function freshDb() {
  if (!existsSync(TEST_DIR)) mkdirSync(TEST_DIR, { recursive: true });
  if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);

  const db = new Database(TEST_DB_PATH);
  db.exec("PRAGMA journal_mode=WAL;");
  db.exec("PRAGMA foreign_keys=ON;");
  return db;
}

describe("database initialization", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = freshDb();
  });

  afterEach(() => {
    db.close();
    if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);
  });

  it("enables WAL journal mode", () => {
    const row = db.prepare("PRAGMA journal_mode;").get() as { journal_mode: string };
    expect(row.journal_mode).toBe("wal");
  });

  it("enables foreign keys", () => {
    const row = db.prepare("PRAGMA foreign_keys;").get() as { foreign_keys: number };
    expect(row.foreign_keys).toBe(1);
  });

  it("applies the init migration without errors", () => {
    const migrationSql = readFileSync(MIGRATION_PATH, "utf8");
    expect(() => db.exec(migrationSql)).not.toThrow();
  });

  it("creates expected core tables after migration", () => {
    const migrationSql = readFileSync(MIGRATION_PATH, "utf8");
    db.exec(migrationSql);

    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name;")
      .all() as { name: string }[];

    const tableNames = tables.map((t) => t.name);

    expect(tableNames).toContain("sessions");
    expect(tableNames).toContain("traces");
    expect(tableNames).toContain("events");
    expect(tableNames).toContain("tool_calls");
    expect(tableNames).toContain("workflow_runs");
    expect(tableNames).toContain("workflow_steps");
    expect(tableNames).toContain("artifacts");
    expect(tableNames).toContain("capabilities");
  });

  it("migration is idempotent — running twice does not error", () => {
    const migrationSql = readFileSync(MIGRATION_PATH, "utf8");
    db.exec(migrationSql);
    expect(() => db.exec(migrationSql)).not.toThrow();
  });
});

describe("transaction support", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = freshDb();
    const migrationSql = readFileSync(MIGRATION_PATH, "utf8");
    db.exec(migrationSql);
  });

  afterEach(() => {
    db.close();
    if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);
  });

  it("commits all writes on success", () => {
    const run = db.transaction(() => {
      db.prepare(
        "INSERT INTO capabilities (id, kind, name, metadata_json) VALUES (?, ?, ?, ?)",
      ).run("test:a", "skill", "a", "{}");
      db.prepare(
        "INSERT INTO capabilities (id, kind, name, metadata_json) VALUES (?, ?, ?, ?)",
      ).run("test:b", "skill", "b", "{}");
    });

    run();

    const rows = db.prepare("SELECT id FROM capabilities WHERE id LIKE 'test:%'").all() as { id: string }[];
    expect(rows).toHaveLength(2);
  });

  it("rolls back all writes on failure", () => {
    const run = db.transaction(() => {
      db.prepare(
        "INSERT INTO capabilities (id, kind, name, metadata_json) VALUES (?, ?, ?, ?)",
      ).run("test:c", "skill", "c", "{}");
      throw new Error("deliberate failure");
    });

    expect(() => run()).toThrow("deliberate failure");

    const rows = db.prepare("SELECT id FROM capabilities WHERE id = 'test:c'").all();
    expect(rows).toHaveLength(0);
  });
});
