import { randomUUID } from "node:crypto";
import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { execute, queryJson, queryOne } from "@/lib/opentrust/db";
import type {
  MemoryEntry,
  MemoryEntryOrigin,
  MemoryEntryTag,
  MemoryPromoteRequest,
  MemoryPromoteResponse,
  MemoryReviewStatus,
} from "@/lib/types";

export interface MemoryEntryWithOrigins extends MemoryEntry {
  origins: MemoryEntryOrigin[];
  tags: MemoryEntryTag[];
}

export interface MemoryReviewQueueItem extends MemoryEntryWithOrigins {}

function nowIso() {
  return new Date().toISOString();
}

function normalizeSummary(summary?: string | null) {
  const value = summary?.trim();
  return value ? value : null;
}

function normalizeOptional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function loadOrigins(memoryEntryId: string) {
  return queryJson<MemoryEntryOrigin>(
    `
      SELECT memory_entry_id, origin_type, origin_id, relationship
      FROM memory_entry_origins
      WHERE memory_entry_id = :memoryEntryId
      ORDER BY origin_type ASC, origin_id ASC;
    `,
    { memoryEntryId },
  );
}

function loadTags(memoryEntryId: string) {
  return queryJson<MemoryEntryTag>(
    `
      SELECT memory_entry_id, tag
      FROM memory_entry_tags
      WHERE memory_entry_id = :memoryEntryId
      ORDER BY tag ASC;
    `,
    { memoryEntryId },
  );
}

export function createMemoryEntry(input: MemoryPromoteRequest): MemoryPromoteResponse {
  ensureBootstrapped();

  const id = `mem_${randomUUID()}`;
  const now = nowIso();
  const reviewStatus = input.review?.status ?? "draft";
  const reviewedAt = reviewStatus === "reviewed" || reviewStatus === "approved" ? now : null;
  const reviewedBy = normalizeOptional(input.review?.reviewerId);

  execute(
    `
      INSERT INTO memory_entries (
        id,
        kind,
        title,
        body,
        summary,
        retention_class,
        review_status,
        confidence_score,
        confidence_reason,
        uncertainty_summary,
        author_type,
        author_id,
        created_at,
        updated_at,
        reviewed_at,
        reviewed_by
      ) VALUES (
        :id,
        :kind,
        :title,
        :body,
        :summary,
        :retentionClass,
        :reviewStatus,
        :confidenceScore,
        :confidenceReason,
        :uncertaintySummary,
        :authorType,
        :authorId,
        :createdAt,
        :updatedAt,
        :reviewedAt,
        :reviewedBy
      );
    `,
    {
      id,
      kind: input.kind,
      title: input.title.trim(),
      body: input.body.trim(),
      summary: normalizeSummary(input.summary),
      retentionClass: input.retentionClass,
      reviewStatus,
      confidenceScore: input.confidence?.score ?? null,
      confidenceReason: normalizeOptional(input.confidence?.reason),
      uncertaintySummary: normalizeOptional(input.uncertaintySummary),
      authorType: input.author.type,
      authorId: normalizeOptional(input.author.id),
      createdAt: now,
      updatedAt: now,
      reviewedAt,
      reviewedBy,
    },
  );

  for (const originRef of input.originRefs) {
    execute(
      `
        INSERT INTO memory_entry_origins (
          memory_entry_id,
          origin_type,
          origin_id,
          relationship
        ) VALUES (
          :memoryEntryId,
          :originType,
          :originId,
          'derived_from'
        );
      `,
      {
        memoryEntryId: id,
        originType: originRef.type,
        originId: originRef.id,
      },
    );
  }

  for (const tag of (input.tags ?? []).map((item) => item.trim()).filter(Boolean)) {
    execute(
      `
        INSERT INTO memory_entry_tags (memory_entry_id, tag)
        VALUES (:memoryEntryId, :tag);
      `,
      { memoryEntryId: id, tag },
    );
  }

  return {
    ok: true,
    entry: {
      id,
      kind: "memoryEntry",
      retentionClass: input.retentionClass,
      createdAt: now,
      updatedAt: now,
    },
  };
}

export function promoteToMemory(input: MemoryPromoteRequest) {
  return createMemoryEntry(input);
}

export function getMemoryEntry(id: string): MemoryEntryWithOrigins | null {
  ensureBootstrapped();

  const entry = queryOne<MemoryEntry>(
    `
      SELECT
        id,
        kind,
        title,
        body,
        summary,
        retention_class,
        review_status,
        confidence_score,
        confidence_reason,
        uncertainty_summary,
        author_type,
        author_id,
        created_at,
        updated_at,
        reviewed_at,
        reviewed_by
      FROM memory_entries
      WHERE id = :id
      LIMIT 1;
    `,
    { id },
  );

  if (!entry) return null;

  return {
    ...entry,
    origins: loadOrigins(id),
    tags: loadTags(id),
  };
}

export function listMemoryEntries(filters?: {
  reviewStatus?: MemoryReviewStatus;
  retentionClass?: MemoryEntry["retention_class"];
  limit?: number;
}) {
  ensureBootstrapped();

  const where: string[] = [];
  const params: Record<string, unknown> = { limit: filters?.limit ?? 50 };

  if (filters?.reviewStatus) {
    where.push("review_status = :reviewStatus");
    params.reviewStatus = filters.reviewStatus;
  }

  if (filters?.retentionClass) {
    where.push("retention_class = :retentionClass");
    params.retentionClass = filters.retentionClass;
  }

  const rows = queryJson<MemoryEntry>(
    `
      SELECT
        id,
        kind,
        title,
        body,
        summary,
        retention_class,
        review_status,
        confidence_score,
        confidence_reason,
        uncertainty_summary,
        author_type,
        author_id,
        created_at,
        updated_at,
        reviewed_at,
        reviewed_by
      FROM memory_entries
      ${where.length > 0 ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY updated_at DESC
      LIMIT :limit;
    `,
    params,
  );

  return rows.map((row) => ({
    ...row,
    origins: loadOrigins(row.id),
    tags: loadTags(row.id),
  }));
}

export function listMemoryReviewQueue(limit = 50): MemoryReviewQueueItem[] {
  return listMemoryEntries({ reviewStatus: "draft", limit });
}

export function updateMemoryEntryReview(input: {
  id: string;
  reviewStatus: MemoryReviewStatus;
  reviewedBy?: string;
}) {
  ensureBootstrapped();

  const now = nowIso();
  execute(
    `
      UPDATE memory_entries
      SET review_status = :reviewStatus,
          reviewed_at = :reviewedAt,
          reviewed_by = :reviewedBy,
          updated_at = :updatedAt
      WHERE id = :id;
    `,
    {
      id: input.id,
      reviewStatus: input.reviewStatus,
      reviewedAt:
        input.reviewStatus === "reviewed" || input.reviewStatus === "approved" ? now : null,
      reviewedBy: normalizeOptional(input.reviewedBy),
      updatedAt: now,
    },
  );

  return getMemoryEntry(input.id);
}

export function updateMemoryEntry(input: {
  id: string;
  title?: string;
  body?: string;
  summary?: string | null;
  retentionClass?: MemoryEntry["retention_class"];
  uncertaintySummary?: string | null;
}) {
  ensureBootstrapped();

  const existing = getMemoryEntry(input.id);
  if (!existing) return null;

  const now = nowIso();
  execute(
    `
      UPDATE memory_entries
      SET title = :title,
          body = :body,
          summary = :summary,
          retention_class = :retentionClass,
          uncertainty_summary = :uncertaintySummary,
          updated_at = :updatedAt
      WHERE id = :id;
    `,
    {
      id: input.id,
      title: input.title?.trim() || existing.title,
      body: input.body?.trim() || existing.body,
      summary: input.summary === undefined ? existing.summary : normalizeSummary(input.summary),
      retentionClass: input.retentionClass || existing.retention_class,
      uncertaintySummary:
        input.uncertaintySummary === undefined
          ? existing.uncertainty_summary
          : normalizeOptional(input.uncertaintySummary),
      updatedAt: now,
    },
  );

  return getMemoryEntry(input.id);
}
