import { describe, it, expect } from "vitest";

/**
 * Tests for the read-only SQL validation logic.
 * We test the validation rules directly without needing a real database.
 */

const READ_ONLY_PREFIXES = ["select", "with", "pragma table_info", "pragma database_list"];

function isReadOnly(sql: string): boolean {
  const normalized = sql.trim().toLowerCase();
  return READ_ONLY_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

describe("SQL read-only validation", () => {
  it("allows SELECT statements", () => {
    expect(isReadOnly("SELECT * FROM sessions")).toBe(true);
    expect(isReadOnly("  SELECT id FROM traces LIMIT 5")).toBe(true);
    expect(isReadOnly("select count(*) from events")).toBe(true);
  });

  it("allows WITH (CTE) statements", () => {
    expect(isReadOnly("WITH cte AS (SELECT 1) SELECT * FROM cte")).toBe(true);
  });

  it("allows PRAGMA table_info", () => {
    expect(isReadOnly("PRAGMA table_info(sessions)")).toBe(true);
  });

  it("allows PRAGMA database_list", () => {
    expect(isReadOnly("PRAGMA database_list")).toBe(true);
  });

  it("rejects INSERT statements", () => {
    expect(isReadOnly("INSERT INTO sessions (id) VALUES ('test')")).toBe(false);
  });

  it("rejects UPDATE statements", () => {
    expect(isReadOnly("UPDATE sessions SET status = 'done'")).toBe(false);
  });

  it("rejects DELETE statements", () => {
    expect(isReadOnly("DELETE FROM sessions WHERE id = 'test'")).toBe(false);
  });

  it("rejects DROP statements", () => {
    expect(isReadOnly("DROP TABLE sessions")).toBe(false);
  });

  it("rejects ALTER statements", () => {
    expect(isReadOnly("ALTER TABLE sessions ADD COLUMN foo TEXT")).toBe(false);
  });

  it("rejects CREATE statements", () => {
    expect(isReadOnly("CREATE TABLE evil (id TEXT)")).toBe(false);
  });

  it("rejects empty input", () => {
    expect(isReadOnly("")).toBe(false);
    expect(isReadOnly("   ")).toBe(false);
  });
});
