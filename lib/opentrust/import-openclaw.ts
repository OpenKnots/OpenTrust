import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { escapeSqlString, execute, runSql } from "@/lib/opentrust/db";
import { recordIngestionState } from "@/lib/opentrust/ingestion-state";
import { upsertArtifactsForTrace } from "@/lib/opentrust/artifact-extract";
import { makeToolCallDraft, maybeBuildToolResultUpdate } from "@/lib/opentrust/tool-results";

type SessionIndexEntry = {
  sessionId?: string;
  updatedAt?: number;
  label?: string;
  systemSent?: boolean;
  abortedLastRun?: boolean;
  lastChannel?: string;
  channel?: string;
  sessionFile?: string;
  deliveryContext?: { channel?: string };
  origin?: { label?: string; provider?: string; surface?: string; chatType?: string };
};

type JsonlRecord = {
  type?: string;
  id?: string;
  timestamp?: string;
  message?: {
    role?: string;
    timestamp?: number;
    content?: Array<Record<string, unknown>>;
  };
};

function sqlJson(value: unknown) {
  return escapeSqlString(JSON.stringify(value));
}

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function extractTextSnippet(content: Record<string, unknown>): string {
  if (typeof content.text === "string") return cleanText(content.text);
  if (typeof content.thinking === "string") return cleanText(content.thinking);
  if (typeof content.name === "string") return cleanText(content.name);
  return cleanText(JSON.stringify(content).slice(0, 600));
}

function sessionRoot() {
  return path.join(process.env.HOME ?? "", ".openclaw", "agents", "main", "sessions");
}

function loadSessionIndex(): Array<{ sessionKey: string; entry: SessionIndexEntry }> {
  const file = path.join(sessionRoot(), "sessions.json");
  if (!existsSync(file)) return [];

  const parsed = JSON.parse(readFileSync(file, "utf8")) as Record<string, SessionIndexEntry>;
  return Object.entries(parsed)
    .map(([sessionKey, entry]) => ({ sessionKey, entry }))
    .filter(({ entry }) => typeof entry.sessionId === "string" && !!entry.sessionId && typeof entry.sessionFile === "string")
    .sort((a, b) => (b.entry.updatedAt ?? 0) - (a.entry.updatedAt ?? 0));
}

function loadJsonlRecords(file: string): JsonlRecord[] {
  if (!existsSync(file)) return [];
  const lines = readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  const records: JsonlRecord[] = [];
  for (const line of lines.slice(-400)) {
    try {
      records.push(JSON.parse(line) as JsonlRecord);
    } catch {
      // ignore malformed lines
    }
  }
  return records;
}

function upsertSessionAndTrace(sessionKey: string, entry: SessionIndexEntry, records: JsonlRecord[]) {
  const sessionId = entry.sessionId as string;
  const traceId = `trace:session:${sessionId}`;
  const startedAt = records.find((record) => record.type === "session")?.timestamp ?? new Date(entry.updatedAt ?? Date.now()).toISOString();
  const updatedAt = new Date(entry.updatedAt ?? Date.now()).toISOString();
  const label = entry.label ?? entry.origin?.label ?? sessionKey;
  const channel = entry.deliveryContext?.channel ?? entry.lastChannel ?? entry.channel ?? entry.origin?.provider ?? null;

  const messageSnippets = records
    .filter((record) => record.type === "message")
    .flatMap((record) => record.message?.content ?? [])
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map(extractTextSnippet)
    .filter(Boolean);

  const summary = messageSnippets.at(-1) ?? `Imported OpenClaw session ${label}`;

  runSql(`
    INSERT INTO sessions (id, channel, agent_id, label, started_at, ended_at, status, metadata_json)
    VALUES (
      ${escapeSqlString(sessionKey)},
      ${channel ? escapeSqlString(channel) : "NULL"},
      'main',
      ${escapeSqlString(label)},
      ${escapeSqlString(startedAt)},
      NULL,
      ${escapeSqlString(entry.abortedLastRun ? "attention" : "complete")},
      ${sqlJson({
        sessionId,
        systemSent: entry.systemSent ?? false,
        abortedLastRun: entry.abortedLastRun ?? false,
        sessionFile: entry.sessionFile,
        origin: entry.origin ?? null,
      })}
    )
    ON CONFLICT(id) DO UPDATE SET
      channel=excluded.channel,
      label=excluded.label,
      status=excluded.status,
      metadata_json=excluded.metadata_json;

    INSERT INTO traces (id, session_id, title, status, summary, started_at, updated_at, metadata_json)
    VALUES (
      ${escapeSqlString(traceId)},
      ${escapeSqlString(sessionKey)},
      ${escapeSqlString(label)},
      ${escapeSqlString(entry.abortedLastRun ? "attention" : "idle")},
      ${escapeSqlString(summary)},
      ${escapeSqlString(startedAt)},
      ${escapeSqlString(updatedAt)},
      ${sqlJson({ source: "openclaw-session", sessionFile: entry.sessionFile })}
    )
    ON CONFLICT(id) DO UPDATE SET
      title=excluded.title,
      status=excluded.status,
      summary=excluded.summary,
      updated_at=excluded.updated_at,
      metadata_json=excluded.metadata_json;

    DELETE FROM events WHERE trace_id = ${escapeSqlString(traceId)};
    DELETE FROM tool_calls WHERE trace_id = ${escapeSqlString(traceId)};
    DELETE FROM trace_capabilities WHERE trace_id = ${escapeSqlString(traceId)};
    DELETE FROM search_chunks WHERE source_kind = 'trace' AND source_id = ${escapeSqlString(traceId)};
  `);

  let sequenceNo = 0;
  for (const record of records) {
    if (record.type !== "message") continue;
    const role = record.message?.role ?? "unknown";
    const contentItems = (record.message?.content ?? []).filter((item): item is Record<string, unknown> => !!item && typeof item === "object");

    for (const item of contentItems) {
      sequenceNo += 1;
      const contentType = typeof item.type === "string" ? item.type : "unknown";
      const preview = extractTextSnippet(item).slice(0, 1200);
      const eventId = `${traceId}:event:${sequenceNo}`;

      runSql(`
        INSERT INTO events (id, trace_id, session_id, kind, sequence_no, created_at, payload_json, text_preview)
        VALUES (
          ${escapeSqlString(eventId)},
          ${escapeSqlString(traceId)},
          ${escapeSqlString(sessionKey)},
          ${escapeSqlString(`message.${role}.${contentType}`)},
          ${sequenceNo},
          ${escapeSqlString(record.timestamp ?? startedAt)},
          ${sqlJson(item)},
          ${escapeSqlString(preview)}
        );
      `);

      if (contentType === "toolCall") {
        const toolDraft = makeToolCallDraft(item, `${traceId}:tool:${sequenceNo}`, record.timestamp ?? startedAt);
        execute(
          `
            INSERT OR REPLACE INTO tool_calls (id, trace_id, session_id, tool_name, arguments_json, status, started_at)
            VALUES (:id, :traceId, :sessionId, :toolName, :argumentsJson, :status, :startedAt)
          `,
          {
            id: toolDraft.id,
            traceId,
            sessionId: sessionKey,
            toolName: toolDraft.toolName,
            argumentsJson: toolDraft.argumentsJson,
            status: toolDraft.status,
            startedAt: toolDraft.startedAt,
          },
        );
      }
    }

    if (role === "tool") {
      const toolResult = maybeBuildToolResultUpdate(contentItems, record.timestamp ?? startedAt);
      if (toolResult) {
        execute(
          `
            UPDATE tool_calls
            SET result_json = :resultJson,
                status = :status,
                finished_at = :finishedAt,
                error_text = :errorText
            WHERE id = :id
          `,
          {
            id: toolResult.id,
            resultJson: toolResult.resultJson,
            status: toolResult.status,
            finishedAt: toolResult.finishedAt,
            errorText: toolResult.errorText,
          },
        );
      }
    }
  }

  const searchBody = messageSnippets.slice(-12).join("\n\n").slice(0, 12000);

  runSql(`
    INSERT INTO search_chunks (source_kind, source_id, title, body)
    VALUES (
      'trace',
      ${escapeSqlString(traceId)},
      ${escapeSqlString(label)},
      ${escapeSqlString(searchBody)}
    );
  `);

  upsertArtifactsForTrace(traceId, `${label}\n\n${searchBody}`, updatedAt);
}

export function importRecentOpenClawSessions(limit = 24) {
  const items = loadSessionIndex().slice(0, limit);
  for (const { sessionKey, entry } of items) {
    const file = entry.sessionFile;
    if (!file) continue;
    const records = loadJsonlRecords(file);
    if (records.length === 0) continue;
    upsertSessionAndTrace(sessionKey, entry, records);
  }

  recordIngestionState({
    sourceKey: "openclaw:sessions:main",
    sourceKind: "session-index",
    cursorText: items[0]?.entry.sessionId ?? null,
    cursorNumber: items[0]?.entry.updatedAt ?? null,
    lastRunAt: new Date().toISOString(),
    lastStatus: "ok",
    importedCount: items.length,
    metadata: {
      limit,
      newestSessionKey: items[0]?.sessionKey ?? null,
      oldestSessionKey: items.at(-1)?.sessionKey ?? null,
    },
  });

  return items.length;
}
