import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

/**
 * Tests for FTS5 search and query handling.
 * Uses standalone SQLite to avoid polluting the development database.
 */

const TEST_DIR = path.join(process.cwd(), "storage", "__test__");
const TEST_DB_PATH = path.join(TEST_DIR, "search-test.sqlite");
const MIGRATION_PATH = path.join(process.cwd(), "db", "0001_init.sql");

function fts5Escape(raw: string): string {
  const tokens = raw.match(/\S+/g);
  if (!tokens) return '""';
  return tokens.map((t) => `"${t.replace(/"/g, '""')}"`).join(" ");
}

function setup() {
  if (!existsSync(TEST_DIR)) mkdirSync(TEST_DIR, { recursive: true });
  if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);

  const db = new Database(TEST_DB_PATH);
  db.exec("PRAGMA journal_mode=WAL;");
  db.exec("PRAGMA foreign_keys=ON;");
  db.exec(readFileSync(MIGRATION_PATH, "utf8"));
  return db;
}

function insertSearchChunk(db: Database.Database, sourceKind: string, sourceId: string, title: string, body: string) {
  db.prepare("INSERT INTO search_chunks (source_kind, source_id, title, body) VALUES (?, ?, ?, ?)")
    .run(sourceKind, sourceId, title, body);
}

describe("FTS5 search_chunks", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = setup();
  });

  afterEach(() => {
    db.close();
    if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);
  });

  it("indexes and retrieves by keyword match", () => {
    insertSearchChunk(db, "trace", "trace:1", "Deploy script", "Deployed the production environment successfully");
    insertSearchChunk(db, "trace", "trace:2", "Bug fix", "Fixed a null pointer exception in the auth module");

    const results = db.prepare(
      "SELECT source_id, title FROM search_chunks WHERE search_chunks MATCH ? LIMIT 10",
    ).all(fts5Escape("deploy")) as { source_id: string; title: string }[];

    expect(results).toHaveLength(1);
    expect(results[0].source_id).toBe("trace:1");
  });

  it("returns empty for no-match queries", () => {
    insertSearchChunk(db, "trace", "trace:1", "Test", "Some content here");

    const results = db.prepare(
      "SELECT source_id FROM search_chunks WHERE search_chunks MATCH ? LIMIT 10",
    ).all(fts5Escape("zzzznonexistent"));

    expect(results).toHaveLength(0);
  });

  it("matches across title and body", () => {
    insertSearchChunk(db, "trace", "trace:1", "Important deployment", "Routine maintenance task");

    const titleMatch = db.prepare(
      "SELECT source_id FROM search_chunks WHERE search_chunks MATCH ? LIMIT 10",
    ).all(fts5Escape("deployment"));

    const bodyMatch = db.prepare(
      "SELECT source_id FROM search_chunks WHERE search_chunks MATCH ? LIMIT 10",
    ).all(fts5Escape("maintenance"));

    expect(titleMatch).toHaveLength(1);
    expect(bodyMatch).toHaveLength(1);
  });

  it("supports multi-word queries", () => {
    insertSearchChunk(db, "trace", "trace:1", "Auth module", "Updated the login rate limiting logic");
    insertSearchChunk(db, "trace", "trace:2", "UI fix", "Fixed the login button styling");

    const results = db.prepare(
      "SELECT source_id FROM search_chunks WHERE search_chunks MATCH ? LIMIT 10",
    ).all(fts5Escape("login rate")) as { source_id: string }[];

    // Should match trace:1 which has both "login" and "rate"
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some((r) => r.source_id === "trace:1")).toBe(true);
  });

  it("respects LIMIT", () => {
    for (let i = 0; i < 20; i++) {
      insertSearchChunk(db, "trace", `trace:${i}`, `Session ${i}`, `Common keyword appears in session ${i}`);
    }

    const results = db.prepare(
      "SELECT source_id FROM search_chunks WHERE search_chunks MATCH ? LIMIT 5",
    ).all(fts5Escape("common"));

    expect(results).toHaveLength(5);
  });
});

describe("fts5Escape", () => {
  it("wraps tokens in quotes", () => {
    expect(fts5Escape("hello world")).toBe('"hello" "world"');
  });

  it("escapes quotes within tokens", () => {
    expect(fts5Escape('say "hi"')).toBe('"say" """hi"""');
  });

  it("returns empty-string literal for blank input", () => {
    expect(fts5Escape("")).toBe('""');
    expect(fts5Escape("   ")).toBe('""');
  });

  it("handles single token", () => {
    expect(fts5Escape("deploy")).toBe('"deploy"');
  });
});
