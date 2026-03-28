import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

/**
 * Tests for ingestion state tracking — cursor management for incremental imports.
 * Uses a standalone SQLite instance to avoid polluting the development database.
 */

const TEST_DIR = path.join(process.cwd(), "storage", "__test__");
const TEST_DB_PATH = path.join(TEST_DIR, "ingestion-state-test.sqlite");

function setup() {
  if (!existsSync(TEST_DIR)) mkdirSync(TEST_DIR, { recursive: true });
  if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);

  const db = new Database(TEST_DB_PATH);
  db.exec("PRAGMA journal_mode=WAL;");
  db.exec("PRAGMA foreign_keys=ON;");
  db.exec(`
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
  `);
  return db;
}

describe("ingestion_state table", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = setup();
  });

  afterEach(() => {
    db.close();
    if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);
  });

  it("inserts a new ingestion state record", () => {
    db.prepare(`
      INSERT INTO ingestion_state (source_key, source_kind, cursor_text, cursor_number, last_run_at, last_status, imported_count, metadata_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run("test:source:1", "session-jsonl", "abc", 123, "2026-01-01T00:00:00Z", "ok", 5, "{}");

    const row = db.prepare("SELECT * FROM ingestion_state WHERE source_key = ?").get("test:source:1") as Record<string, unknown>;
    expect(row).toBeTruthy();
    expect(row.source_kind).toBe("session-jsonl");
    expect(row.cursor_number).toBe(123);
    expect(row.imported_count).toBe(5);
  });

  it("upserts on conflict — updates existing record", () => {
    db.prepare(`
      INSERT INTO ingestion_state (source_key, source_kind, cursor_number, last_status, imported_count)
      VALUES (?, ?, ?, ?, ?)
    `).run("test:source:2", "cron", 100, "ok", 3);

    db.prepare(`
      INSERT INTO ingestion_state (source_key, source_kind, cursor_number, last_status, imported_count)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(source_key) DO UPDATE SET
        cursor_number=excluded.cursor_number,
        last_status=excluded.last_status,
        imported_count=excluded.imported_count
    `).run("test:source:2", "cron", 200, "ok", 7);

    const row = db.prepare("SELECT * FROM ingestion_state WHERE source_key = ?").get("test:source:2") as Record<string, unknown>;
    expect(row.cursor_number).toBe(200);
    expect(row.imported_count).toBe(7);
  });

  it("handles null cursor values", () => {
    db.prepare(`
      INSERT INTO ingestion_state (source_key, source_kind, cursor_text, cursor_number, last_status, imported_count)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run("test:source:3", "manual", null, null, "ok", 0);

    const row = db.prepare("SELECT * FROM ingestion_state WHERE source_key = ?").get("test:source:3") as Record<string, unknown>;
    expect(row.cursor_text).toBeNull();
    expect(row.cursor_number).toBeNull();
  });
});
