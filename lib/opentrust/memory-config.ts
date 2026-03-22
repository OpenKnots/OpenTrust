import type { MemoryRetentionClass } from "@/lib/types";

export interface RetentionPolicy {
  maxEntries: number;
  ageOutDays: number | null;
  archiveAfterDays: number | null;
}

export interface ArchivePolicy {
  rotationSchedule: "weekly" | "monthly" | "quarterly";
  compressAfterDays: number;
  maxArchivedEntries: number;
  retentionPeriodDays: number;
}

export interface WorkingSnapshotPolicy {
  maxTokens: number;
  includeRetentionClasses: MemoryRetentionClass[];
  requireReviewStatus: ("approved" | "reviewed")[];
  refreshOnAccess: boolean;
}

export interface MemoryLifecycleHooks {
  onSessionStart: boolean;
  onSessionEnd: boolean;
  onExplicitSave: boolean;
}

export interface MemoryConfig {
  retention: Record<MemoryRetentionClass, RetentionPolicy>;
  archive: ArchivePolicy;
  workingSnapshot: WorkingSnapshotPolicy;
  lifecycle: MemoryLifecycleHooks;
}

const DEFAULT_MEMORY_CONFIG: MemoryConfig = {
  retention: {
    ephemeral: {
      maxEntries: 200,
      ageOutDays: 30,
      archiveAfterDays: null,
    },
    working: {
      maxEntries: 500,
      ageOutDays: null,
      archiveAfterDays: 90,
    },
    longTerm: {
      maxEntries: 2000,
      ageOutDays: null,
      archiveAfterDays: 365,
    },
    pinned: {
      maxEntries: 100,
      ageOutDays: null,
      archiveAfterDays: null,
    },
  },
  archive: {
    rotationSchedule: "monthly",
    compressAfterDays: 90,
    maxArchivedEntries: 5000,
    retentionPeriodDays: 7 * 365,
  },
  workingSnapshot: {
    maxTokens: 4000,
    includeRetentionClasses: ["pinned", "longTerm", "working"],
    requireReviewStatus: ["approved", "reviewed"],
    refreshOnAccess: true,
  },
  lifecycle: {
    onSessionStart: true,
    onSessionEnd: true,
    onExplicitSave: true,
  },
};

let activeConfig: MemoryConfig = structuredClone(DEFAULT_MEMORY_CONFIG);

export function getMemoryConfig(): MemoryConfig {
  return activeConfig;
}

export function updateMemoryConfig(overrides: Partial<MemoryConfig>): MemoryConfig {
  activeConfig = {
    ...activeConfig,
    ...overrides,
    retention: overrides.retention
      ? { ...activeConfig.retention, ...overrides.retention }
      : activeConfig.retention,
    archive: overrides.archive
      ? { ...activeConfig.archive, ...overrides.archive }
      : activeConfig.archive,
    workingSnapshot: overrides.workingSnapshot
      ? { ...activeConfig.workingSnapshot, ...overrides.workingSnapshot }
      : activeConfig.workingSnapshot,
    lifecycle: overrides.lifecycle
      ? { ...activeConfig.lifecycle, ...overrides.lifecycle }
      : activeConfig.lifecycle,
  };
  return activeConfig;
}

export function resetMemoryConfig(): MemoryConfig {
  activeConfig = structuredClone(DEFAULT_MEMORY_CONFIG);
  return activeConfig;
}

export function getRetentionPolicy(retentionClass: MemoryRetentionClass): RetentionPolicy {
  return activeConfig.retention[retentionClass];
}
