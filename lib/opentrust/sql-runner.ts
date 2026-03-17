import { getDb } from "@/lib/opentrust/db";

const READ_ONLY_PREFIXES = ["select", "with", "pragma table_info", "pragma database_list"];

export function runReadOnlySql(sql: string) {
  const normalized = sql.trim().toLowerCase();
  if (!READ_ONLY_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
    throw new Error("Only read-only SQL is allowed in investigation previews.");
  }

  const statement = getDb().prepare(sql);
  return statement.all() as Record<string, unknown>[];
}
