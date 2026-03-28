import { randomUUID } from "node:crypto";
import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { execute, queryJson, queryOne, withTransaction } from "@/lib/opentrust/db";
import { getMemoryConfig } from "@/lib/opentrust/memory-config";
import type {
  MemoryEntry,
  MemoryEntryOrigin,
  MemoryEntryTag,
  MemoryPromoteRequest,
  MemoryPromoteResponse,
  MemoryRetentionClass,
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

/** Create a new memory entry with origins, tags, and optional review metadata. */
export function createMemoryEntry(input: MemoryPromoteRequest): MemoryPromoteResponse {
  ensureBootstrapped();
  return withTransaction(() => {
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
        review_notes,
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
        :reviewNotes,
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
      reviewNotes: normalizeOptional(input.review?.notes),
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
  });
}

/** Alias for {@link createMemoryEntry}. Promotes source material into a memory entry. */
export function promoteToMemory(input: MemoryPromoteRequest) {
  return createMemoryEntry(input);
}

/** Fetch a single memory entry by ID, including its origins and tags. */
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
        review_notes,
        confidence_score,
        confidence_reason,
        uncertainty_summary,
        author_type,
        author_id,
        created_at,
        updated_at,
        reviewed_at,
        reviewed_by,
        archived_at
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

/** List memory entries with optional filters for review status and retention class. */
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
        review_notes,
        confidence_score,
        confidence_reason,
        uncertainty_summary,
        author_type,
        author_id,
        created_at,
        updated_at,
        reviewed_at,
        reviewed_by,
        archived_at
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

/** Return memory entries in "draft" status that are awaiting human review. */
export function listMemoryReviewQueue(limit = 50): MemoryReviewQueueItem[] {
  return listMemoryEntries({ reviewStatus: "draft", limit });
}

// ---------------------------------------------------------------------------
// Version Tracking
// ---------------------------------------------------------------------------

export interface MemoryEntryVersion {
  id: string;
  version: number;
  title: string;
  body: string;
  summary: string | null;
  retention_class: MemoryRetentionClass;
  review_status: MemoryReviewStatus;
  changed_by_type: string;
  changed_by_id: string | null;
  changed_at: string;
  change_reason: string | null;
}

function getNextVersion(entryId: string): number {
  const row = queryOne<{ max_version: number | null }>(
    "SELECT MAX(version) as max_version FROM memory_entry_versions WHERE id = :id;",
    { id: entryId },
  );
  return (row?.max_version ?? 0) + 1;
}

function snapshotVersion(
  entry: MemoryEntry,
  changedByType: string,
  changedById: string | null,
  changeReason: string | null,
) {
  const version = getNextVersion(entry.id);
  execute(
    `
      INSERT INTO memory_entry_versions (
        id, version, title, body, summary, retention_class,
        review_status, changed_by_type, changed_by_id,
        changed_at, change_reason
      ) VALUES (
        :id, :version, :title, :body, :summary, :retentionClass,
        :reviewStatus, :changedByType, :changedById,
        :changedAt, :changeReason
      );
    `,
    {
      id: entry.id,
      version,
      title: entry.title,
      body: entry.body,
      summary: entry.summary,
      retentionClass: entry.retention_class,
      reviewStatus: entry.review_status,
      changedByType,
      changedById,
      changedAt: nowIso(),
      changeReason,
    },
  );
  return version;
}

/** List all version snapshots for a memory entry, newest first. */
export function listMemoryEntryVersions(entryId: string): MemoryEntryVersion[] {
  ensureBootstrapped();
  return queryJson<MemoryEntryVersion>(
    `
      SELECT id, version, title, body, summary, retention_class,
             review_status, changed_by_type, changed_by_id,
             changed_at, change_reason
      FROM memory_entry_versions
      WHERE id = :id
      ORDER BY version DESC;
    `,
    { id: entryId },
  );
}

/** Fetch a specific version snapshot of a memory entry. */
export function getMemoryEntryVersion(entryId: string, version: number): MemoryEntryVersion | null {
  ensureBootstrapped();
  return queryOne<MemoryEntryVersion>(
    `
      SELECT id, version, title, body, summary, retention_class,
             review_status, changed_by_type, changed_by_id,
             changed_at, change_reason
      FROM memory_entry_versions
      WHERE id = :id AND version = :version;
    `,
    { id: entryId, version },
  );
}

/**
 * Revert a memory entry to a previous version. Creates a new version record
 * for the rollback itself, preserving full audit trail.
 */
export function rollbackMemoryEntry(entryId: string, toVersion: number): MemoryEntryWithOrigins | null {
  ensureBootstrapped();
  return withTransaction(() => {
  const target = getMemoryEntryVersion(entryId, toVersion);
  if (!target) return null;

  const current = getMemoryEntry(entryId);
  if (!current) return null;

  snapshotVersion(current, "system", null, `Rollback to version ${toVersion}`);

  execute(
    `
      UPDATE memory_entries
      SET title = :title,
          body = :body,
          summary = :summary,
          retention_class = :retentionClass,
          review_status = :reviewStatus,
          updated_at = :now
      WHERE id = :id;
    `,
    {
      id: entryId,
      title: target.title,
      body: target.body,
      summary: target.summary,
      retentionClass: target.retention_class,
      reviewStatus: target.review_status,
      now: nowIso(),
    },
  );

  return getMemoryEntry(entryId);
  });
}

// ---------------------------------------------------------------------------
// Update Operations (with version tracking)
// ---------------------------------------------------------------------------

/** Update the review status of a memory entry, snapshotting the previous state. */
export function updateMemoryEntryReview(input: {
  id: string;
  reviewStatus: MemoryReviewStatus;
  reviewedBy?: string;
  reviewNotes?: string | null;
}) {
  ensureBootstrapped();
  return withTransaction(() => {
  const existing = getMemoryEntry(input.id);
  if (existing) {
    snapshotVersion(
      existing,
      input.reviewedBy ? "user" : "system",
      normalizeOptional(input.reviewedBy),
      `Review status changed to ${input.reviewStatus}`,
    );
  }

  const now = nowIso();
  execute(
    `
      UPDATE memory_entries
      SET review_status = :reviewStatus,
          review_notes = :reviewNotes,
          reviewed_at = :reviewedAt,
          reviewed_by = :reviewedBy,
          updated_at = :updatedAt
      WHERE id = :id;
    `,
    {
      id: input.id,
      reviewStatus: input.reviewStatus,
      reviewNotes: normalizeOptional(input.reviewNotes),
      reviewedAt:
        input.reviewStatus === "reviewed" || input.reviewStatus === "approved" ? now : null,
      reviewedBy: normalizeOptional(input.reviewedBy),
      updatedAt: now,
    },
  );

  return getMemoryEntry(input.id);
  });
}

/** Update a memory entry's content or metadata, creating a version snapshot first. */
export function updateMemoryEntry(input: {
  id: string;
  title?: string;
  body?: string;
  summary?: string | null;
  retentionClass?: MemoryEntry["retention_class"];
  uncertaintySummary?: string | null;
  reviewNotes?: string | null;
  changedByType?: string;
  changedById?: string;
  changeReason?: string;
}) {
  ensureBootstrapped();
  return withTransaction(() => {
  const existing = getMemoryEntry(input.id);
  if (!existing) return null;

  snapshotVersion(
    existing,
    input.changedByType ?? existing.author_type,
    input.changedById ?? existing.author_id,
    input.changeReason ?? null,
  );

  const now = nowIso();
  execute(
    `
      UPDATE memory_entries
      SET title = :title,
          body = :body,
          summary = :summary,
          retention_class = :retentionClass,
          uncertainty_summary = :uncertaintySummary,
          review_notes = :reviewNotes,
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
      reviewNotes:
        input.reviewNotes === undefined ? existing.review_notes : normalizeOptional(input.reviewNotes),
      updatedAt: now,
    },
  );

  return getMemoryEntry(input.id);
  });
}

// ---------------------------------------------------------------------------
// Archive & Rotation
// ---------------------------------------------------------------------------

export interface ArchiveResult {
  agedOut: number;
  archived: number;
  overflowPurged: number;
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

/**
 * Age out ephemeral entries older than their configured threshold by marking
 * them as rejected (soft-delete). Returns count of entries aged out.
 */
function ageOutEntries(): number {
  const config = getMemoryConfig();
  let total = 0;

  for (const [retentionClass, policy] of Object.entries(config.retention) as [MemoryRetentionClass, typeof config.retention.ephemeral][]) {
    if (policy.ageOutDays == null) continue;

    const cutoff = daysAgo(policy.ageOutDays);
    const result = execute(
      `
        UPDATE memory_entries
        SET review_status = 'rejected',
            review_notes = COALESCE(review_notes || ' | ', '') || 'Auto aged-out by retention policy',
            updated_at = :now
        WHERE retention_class = :retentionClass
          AND review_status != 'rejected'
          AND archived_at IS NULL
          AND updated_at < :cutoff;
      `,
      { retentionClass, cutoff, now: nowIso() },
    );
    total += result.changes;
  }

  return total;
}

/**
 * Mark entries as archived when they exceed their retention class's
 * archiveAfterDays threshold. Archived entries remain queryable but are
 * excluded from the working snapshot.
 */
function archiveStaleEntries(): number {
  const config = getMemoryConfig();
  let total = 0;

  for (const [retentionClass, policy] of Object.entries(config.retention) as [MemoryRetentionClass, typeof config.retention.ephemeral][]) {
    if (policy.archiveAfterDays == null) continue;

    const cutoff = daysAgo(policy.archiveAfterDays);
    const result = execute(
      `
        UPDATE memory_entries
        SET archived_at = :now,
            updated_at = :now
        WHERE retention_class = :retentionClass
          AND archived_at IS NULL
          AND review_status IN ('approved', 'reviewed')
          AND updated_at < :cutoff;
      `,
      { retentionClass, cutoff, now: nowIso() },
    );
    total += result.changes;
  }

  return total;
}

/**
 * Enforce max entry limits per retention class by archiving the oldest
 * entries that exceed the cap.
 */
function purgeOverflowEntries(): number {
  const config = getMemoryConfig();
  let total = 0;

  for (const [retentionClass, policy] of Object.entries(config.retention) as [MemoryRetentionClass, typeof config.retention.ephemeral][]) {
    const overflowRows = queryJson<{ id: string }>(
      `
        SELECT id FROM memory_entries
        WHERE retention_class = :retentionClass
          AND archived_at IS NULL
          AND review_status != 'rejected'
        ORDER BY updated_at DESC
        LIMIT -1 OFFSET :maxEntries;
      `,
      { retentionClass, maxEntries: policy.maxEntries },
    );

    for (const row of overflowRows) {
      execute(
        `
          UPDATE memory_entries
          SET archived_at = :now,
              updated_at = :now
          WHERE id = :id;
        `,
        { id: row.id, now: nowIso() },
      );
    }
    total += overflowRows.length;
  }

  return total;
}

/**
 * Run the full archive maintenance cycle: age-out, archive stale entries,
 * and purge overflow. Call from a cron job or manual trigger.
 */
export function archiveMemory(): ArchiveResult {
  ensureBootstrapped();
  return withTransaction(() => {
  const agedOut = ageOutEntries();
  const archived = archiveStaleEntries();
  const overflowPurged = purgeOverflowEntries();

  return { agedOut, archived, overflowPurged };
  });
}

/**
 * Return archive health metrics for the health API.
 */
export function getArchiveStats() {
  ensureBootstrapped();

  const totalArchived = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM memory_entries WHERE archived_at IS NOT NULL;",
  );
  const totalActive = queryOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM memory_entries WHERE archived_at IS NULL AND review_status != 'rejected';",
  );
  const oldestUnarchived = queryOne<{ oldest: string | null }>(
    "SELECT MIN(created_at) as oldest FROM memory_entries WHERE archived_at IS NULL AND review_status != 'rejected';",
  );

  return {
    archivedCount: totalArchived?.count ?? 0,
    activeCount: totalActive?.count ?? 0,
    oldestUnarchived: oldestUnarchived?.oldest ?? null,
  };
}
