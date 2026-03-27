import { describe, it, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

/**
 * Tests for memory entry CRUD operations.
 * Uses standalone SQLite to avoid polluting the development database.
 */

const TEST_DIR = path.join(process.cwd(), "storage", "__test__");
const TEST_DB_PATH = path.join(TEST_DIR, "memory-entries-test.sqlite");
const MIGRATION_PATH = path.join(process.cwd(), "db", "0001_init.sql");

function setup() {
  if (!existsSync(TEST_DIR)) mkdirSync(TEST_DIR, { recursive: true });
  if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);

  const db = new Database(TEST_DB_PATH);
  db.exec("PRAGMA journal_mode=WAL;");
  db.exec("PRAGMA foreign_keys=ON;");
  db.exec(readFileSync(MIGRATION_PATH, "utf8"));

  // Apply memory-specific tables from ensureMigrated()
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
      reviewed_by TEXT,
      archived_at TEXT
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
  `);
  return db;
}

function insertMemoryEntry(db: Database.Database, overrides: Partial<Record<string, unknown>> = {}) {
  const defaults = {
    id: `mem_test_${Date.now()}`,
    kind: "memoryEntry",
    title: "Test Entry",
    body: "Test body content",
    summary: null,
    retention_class: "working",
    review_status: "draft",
    review_notes: null,
    confidence_score: null,
    confidence_reason: null,
    uncertainty_summary: null,
    author_type: "user",
    author_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    reviewed_at: null,
    reviewed_by: null,
    archived_at: null,
  };
  const entry = { ...defaults, ...overrides };

  db.prepare(`
    INSERT INTO memory_entries (
      id, kind, title, body, summary, retention_class, review_status,
      review_notes, confidence_score, confidence_reason, uncertainty_summary,
      author_type, author_id, created_at, updated_at, reviewed_at, reviewed_by, archived_at
    ) VALUES (
      :id, :kind, :title, :body, :summary, :retention_class, :review_status,
      :review_notes, :confidence_score, :confidence_reason, :uncertainty_summary,
      :author_type, :author_id, :created_at, :updated_at, :reviewed_at, :reviewed_by, :archived_at
    )
  `).run(entry);

  return entry;
}

describe("memory_entries table", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = setup();
  });

  afterEach(() => {
    db.close();
    if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);
  });

  it("inserts and retrieves a memory entry", () => {
    const entry = insertMemoryEntry(db, { id: "mem_crud_1", title: "My First Memory" });
    const row = db.prepare("SELECT * FROM memory_entries WHERE id = ?").get(entry.id) as Record<string, unknown>;

    expect(row).toBeTruthy();
    expect(row.title).toBe("My First Memory");
    expect(row.retention_class).toBe("working");
    expect(row.review_status).toBe("draft");
  });

  it("updates review status", () => {
    const entry = insertMemoryEntry(db, { id: "mem_review_1" });

    db.prepare("UPDATE memory_entries SET review_status = ?, reviewed_at = ? WHERE id = ?")
      .run("approved", new Date().toISOString(), entry.id);

    const row = db.prepare("SELECT review_status, reviewed_at FROM memory_entries WHERE id = ?")
      .get(entry.id) as Record<string, unknown>;
    expect(row.review_status).toBe("approved");
    expect(row.reviewed_at).toBeTruthy();
  });

  it("deletes entry cascades to origins and tags", () => {
    const entry = insertMemoryEntry(db, { id: "mem_cascade_1" });

    db.prepare("INSERT INTO memory_entry_origins (memory_entry_id, origin_type, origin_id, relationship) VALUES (?, ?, ?, ?)")
      .run(entry.id, "trace", "trace:1", "derived_from");
    db.prepare("INSERT INTO memory_entry_tags (memory_entry_id, tag) VALUES (?, ?)")
      .run(entry.id, "test-tag");

    // Verify they exist
    expect(db.prepare("SELECT COUNT(*) as c FROM memory_entry_origins WHERE memory_entry_id = ?").get(entry.id)).toEqual({ c: 1 });
    expect(db.prepare("SELECT COUNT(*) as c FROM memory_entry_tags WHERE memory_entry_id = ?").get(entry.id)).toEqual({ c: 1 });

    // Delete the entry
    db.prepare("DELETE FROM memory_entries WHERE id = ?").run(entry.id);

    // Cascaded
    expect(db.prepare("SELECT COUNT(*) as c FROM memory_entry_origins WHERE memory_entry_id = ?").get(entry.id)).toEqual({ c: 0 });
    expect(db.prepare("SELECT COUNT(*) as c FROM memory_entry_tags WHERE memory_entry_id = ?").get(entry.id)).toEqual({ c: 0 });
  });

  it("filters by review status", () => {
    insertMemoryEntry(db, { id: "mem_filter_1", review_status: "draft" });
    insertMemoryEntry(db, { id: "mem_filter_2", review_status: "approved" });
    insertMemoryEntry(db, { id: "mem_filter_3", review_status: "draft" });

    const drafts = db.prepare("SELECT id FROM memory_entries WHERE review_status = ?").all("draft") as { id: string }[];
    expect(drafts).toHaveLength(2);
    expect(drafts.map((r) => r.id)).toContain("mem_filter_1");
    expect(drafts.map((r) => r.id)).toContain("mem_filter_3");
  });

  it("filters by retention class", () => {
    insertMemoryEntry(db, { id: "mem_ret_1", retention_class: "ephemeral" });
    insertMemoryEntry(db, { id: "mem_ret_2", retention_class: "pinned" });
    insertMemoryEntry(db, { id: "mem_ret_3", retention_class: "ephemeral" });

    const ephemerals = db.prepare("SELECT id FROM memory_entries WHERE retention_class = ?").all("ephemeral") as { id: string }[];
    expect(ephemerals).toHaveLength(2);
  });

  it("respects LIMIT", () => {
    for (let i = 0; i < 10; i++) {
      insertMemoryEntry(db, { id: `mem_limit_${i}` });
    }

    const limited = db.prepare("SELECT id FROM memory_entries ORDER BY updated_at DESC LIMIT ?").all(3);
    expect(limited).toHaveLength(3);
  });
});

describe("memory_entry_origins", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = setup();
  });

  afterEach(() => {
    db.close();
    if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);
  });

  it("links multiple origins to a single entry", () => {
    const entry = insertMemoryEntry(db, { id: "mem_origins_1" });

    db.prepare("INSERT INTO memory_entry_origins (memory_entry_id, origin_type, origin_id, relationship) VALUES (?, ?, ?, ?)")
      .run(entry.id, "trace", "trace:abc", "derived_from");
    db.prepare("INSERT INTO memory_entry_origins (memory_entry_id, origin_type, origin_id, relationship) VALUES (?, ?, ?, ?)")
      .run(entry.id, "event", "event:xyz", "derived_from");

    const origins = db.prepare("SELECT * FROM memory_entry_origins WHERE memory_entry_id = ? ORDER BY origin_type").all(entry.id) as Record<string, unknown>[];
    expect(origins).toHaveLength(2);
    expect(origins[0].origin_type).toBe("event");
    expect(origins[1].origin_type).toBe("trace");
  });
});

describe("memory_entry_tags", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = setup();
  });

  afterEach(() => {
    db.close();
    if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);
  });

  it("attaches tags to entries", () => {
    const entry = insertMemoryEntry(db, { id: "mem_tags_1" });

    db.prepare("INSERT INTO memory_entry_tags (memory_entry_id, tag) VALUES (?, ?)").run(entry.id, "important");
    db.prepare("INSERT INTO memory_entry_tags (memory_entry_id, tag) VALUES (?, ?)").run(entry.id, "security");

    const tags = db.prepare("SELECT tag FROM memory_entry_tags WHERE memory_entry_id = ? ORDER BY tag").all(entry.id) as { tag: string }[];
    expect(tags.map((t) => t.tag)).toEqual(["important", "security"]);
  });

  it("enforces unique tag per entry", () => {
    const entry = insertMemoryEntry(db, { id: "mem_tag_dup_1" });

    db.prepare("INSERT INTO memory_entry_tags (memory_entry_id, tag) VALUES (?, ?)").run(entry.id, "dupe");
    expect(() =>
      db.prepare("INSERT INTO memory_entry_tags (memory_entry_id, tag) VALUES (?, ?)").run(entry.id, "dupe"),
    ).toThrow();
  });
});

describe("memory_entry_versions", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = setup();
  });

  afterEach(() => {
    db.close();
    if (existsSync(TEST_DB_PATH)) rmSync(TEST_DB_PATH);
  });

  it("tracks version history for an entry", () => {
    const entryId = "mem_versioned_1";
    insertMemoryEntry(db, { id: entryId, title: "v1 title", body: "v1 body" });

    // Snapshot version 1
    db.prepare(`
      INSERT INTO memory_entry_versions (id, version, title, body, summary, retention_class, review_status, changed_by_type, changed_by_id, changed_at, change_reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(entryId, 1, "v1 title", "v1 body", null, "working", "draft", "user", null, new Date().toISOString(), "Initial");

    // Snapshot version 2
    db.prepare(`
      INSERT INTO memory_entry_versions (id, version, title, body, summary, retention_class, review_status, changed_by_type, changed_by_id, changed_at, change_reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(entryId, 2, "v2 title", "v2 body", null, "working", "reviewed", "user", null, new Date().toISOString(), "Updated content");

    const versions = db.prepare("SELECT * FROM memory_entry_versions WHERE id = ? ORDER BY version").all(entryId) as Record<string, unknown>[];
    expect(versions).toHaveLength(2);
    expect(versions[0].version).toBe(1);
    expect(versions[1].version).toBe(2);
    expect(versions[1].title).toBe("v2 title");
  });
});
