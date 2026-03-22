import type { ArtifactRow } from "@/lib/opentrust/artifacts";
import type { HealthSummary } from "@/lib/opentrust/health";
import type { IngestionStateRow } from "@/lib/opentrust/ingestion-state";
import type {
  InvestigationTemplate,
  SavedInvestigationRow,
} from "@/lib/opentrust/investigations";
import type { MemoryEntryWithOrigins } from "@/lib/opentrust/memory-entries";
import type {
  CapabilitySummary,
  OpenTrustOverview,
  RecentTrace,
  WorkflowSummary,
} from "@/lib/opentrust/overview";
import type { SemanticStatus } from "@/lib/opentrust/semantic";
import type { SessionTraceGroup, TraceSummaryRow } from "@/lib/opentrust/trace-list";
import type { WorkflowKeyGroup, WorkflowRunSummary } from "@/lib/opentrust/workflow-list";

function ago(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------

export function getDemoOverview(): OpenTrustOverview {
  const recentTraces: RecentTrace[] = [
    { id: "demo_tr_001", title: "Refactor auth middleware", status: "completed", summary: "Applied token-refresh logic and updated session handling across 3 files.", session_label: "PR Review Agent", updated_at: ago(8) },
    { id: "demo_tr_002", title: "Investigate flaky CI test", status: "attention", summary: "Test runner timed out on integration suite; root cause unclear.", session_label: "PR Review Agent", updated_at: ago(22) },
    { id: "demo_tr_003", title: "Generate migration script", status: "completed", summary: "Created SQL migration for new user_preferences table.", session_label: "Code Migration", updated_at: ago(45) },
    { id: "demo_tr_004", title: "Update API docs", status: "streaming", summary: "Generating OpenAPI spec from route handlers…", session_label: "Documentation Refresh", updated_at: ago(2) },
    { id: "demo_tr_005", title: "Audit dependency versions", status: "completed", summary: "Bumped 4 outdated packages, no breaking changes detected.", session_label: "PR Review Agent", updated_at: ago(90) },
    { id: "demo_tr_006", title: "Review error handling patterns", status: "completed", summary: "Catalogued 12 try/catch blocks missing structured logging.", session_label: "Code Migration", updated_at: ago(130) },
  ];

  const recentWorkflows: WorkflowSummary[] = [
    { id: "demo_wf_001", name: "daily-review", status: "completed", summary: "Reviewed 6 PRs, approved 4, requested changes on 2.", source_kind: "cron" },
    { id: "demo_wf_002", name: "semantic-index", status: "completed", summary: "Indexed 142 new chunks across 8 source files.", source_kind: "cron" },
    { id: "demo_wf_003", name: "daily-review", status: "error", summary: "GitHub API rate limit exceeded during review batch.", source_kind: "cron" },
    { id: "demo_wf_004", name: "semantic-index", status: "completed", summary: "Re-indexed 23 updated chunks after schema change.", source_kind: "cron" },
    { id: "demo_wf_005", name: "nightly-backup", status: "completed", summary: "SQLite WAL checkpoint and backup completed in 2.1s.", source_kind: "cron" },
  ];

  const recentArtifacts: ArtifactRow[] = [
    { id: "demo_art_001", kind: "url", uri: "https://github.com/OpenKnots/OpenClaw/pull/47", title: "PR #47 — Add workspace skills loader", created_at: ago(12) },
    { id: "demo_art_002", kind: "doc", uri: "docs/architecture.md", title: "Architecture Overview", created_at: ago(35) },
    { id: "demo_art_003", kind: "repo", uri: "https://github.com/OpenKnots/OpenTrust", title: "OpenTrust repository", created_at: ago(60) },
    { id: "demo_art_004", kind: "url", uri: "https://nextjs.org/docs/app/building-your-application", title: "Next.js App Router docs", created_at: ago(90) },
    { id: "demo_art_005", kind: "note", uri: "inline:session-notes", title: "Session retrospective notes", created_at: ago(150) },
  ];

  const recentMemoryEntries: MemoryEntryWithOrigins[] = getDemoMemoryEntries().slice(0, 6);

  const capabilityBreakdown: CapabilitySummary[] = [
    { kind: "skill", count: 14 },
    { kind: "plugin", count: 3 },
    { kind: "soul", count: 1 },
    { kind: "bundle", count: 2 },
  ];

  const ingestionStates: IngestionStateRow[] = getDemoIngestionStates();
  const semanticStatus: SemanticStatus = {
    chunkCount: 284,
    vectorReady: true,
    vectorExtensionPath: "/usr/local/lib/vec0.dylib",
    lastChunkRunAt: ago(18),
  };

  return {
    counts: {
      sessions: 12,
      traces: 47,
      workflows: 8,
      capabilities: 20,
      artifacts: 23,
      memoryEntries: 14,
      memoryDrafts: 5,
      memoryApproved: 7,
    },
    recentTraces,
    capabilityBreakdown,
    recentWorkflows,
    recentArtifacts,
    recentMemoryEntries,
    ingestionStates,
    semanticStatus,
    localDatabasePath: "storage/opentrust-demo.sqlite",
  };
}

// ---------------------------------------------------------------------------
// Traces
// ---------------------------------------------------------------------------

function demoTrace(id: string, title: string, status: string, summary: string, minutesAgo: number): TraceSummaryRow {
  return { id, title, status, summary, updated_at: ago(minutesAgo) };
}

export function getDemoGroupedTraces(): SessionTraceGroup[] {
  return [
    {
      session_id: "agent:main:pr-review",
      session_label: "PR Review Agent",
      trace_count: 4,
      attention_count: 1,
      last_updated: ago(8),
      traces: [
        demoTrace("demo_tr_001", "Refactor auth middleware", "completed", "Applied token-refresh logic and updated session handling.", 8),
        demoTrace("demo_tr_002", "Investigate flaky CI test", "attention", "Test runner timed out on integration suite.", 22),
        demoTrace("demo_tr_005", "Audit dependency versions", "completed", "Bumped 4 outdated packages.", 90),
        demoTrace("demo_tr_007", "Lint config cleanup", "completed", "Removed 3 deprecated ESLint rules.", 200),
      ],
      children: [
        {
          session_id: "agent:main:pr-review:test-runner",
          session_label: "test-runner",
          trace_count: 2,
          attention_count: 0,
          last_updated: ago(25),
          traces: [
            demoTrace("demo_tr_sub_001", "Run unit tests", "completed", "All 148 unit tests passed in 12.3s.", 25),
            demoTrace("demo_tr_sub_002", "Run integration tests", "completed", "34 integration tests passed.", 28),
          ],
          children: [],
        },
      ],
    },
    {
      session_id: "agent:main:code-migration",
      session_label: "Code Migration",
      trace_count: 3,
      attention_count: 0,
      last_updated: ago(45),
      traces: [
        demoTrace("demo_tr_003", "Generate migration script", "completed", "Created SQL migration for user_preferences table.", 45),
        demoTrace("demo_tr_006", "Review error handling patterns", "completed", "Catalogued 12 try/catch blocks missing structured logging.", 130),
        demoTrace("demo_tr_008", "Migrate config to TOML", "completed", "Converted 5 JSON configs to TOML format.", 260),
      ],
      children: [],
    },
    {
      session_id: "agent:main:documentation",
      session_label: "Documentation Refresh",
      trace_count: 2,
      attention_count: 0,
      last_updated: ago(2),
      traces: [
        demoTrace("demo_tr_004", "Update API docs", "streaming", "Generating OpenAPI spec from route handlers…", 2),
        demoTrace("demo_tr_009", "Add README badges", "completed", "Added CI status, coverage, and license badges.", 180),
      ],
      children: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Workflows
// ---------------------------------------------------------------------------

export function getDemoGroupedWorkflows(): WorkflowKeyGroup[] {
  const dailyReviewRuns: WorkflowRunSummary[] = [
    { id: "demo_wf_001", name: "daily-review", status: "completed", summary: "Reviewed 6 PRs, approved 4, requested changes on 2.", source_kind: "cron", updated_at: ago(15) },
    { id: "demo_wf_003", name: "daily-review", status: "error", summary: "GitHub API rate limit exceeded during review batch.", source_kind: "cron", updated_at: ago(1455) },
    { id: "demo_wf_006", name: "daily-review", status: "completed", summary: "Reviewed 3 PRs, all approved.", source_kind: "cron", updated_at: ago(2895) },
  ];

  const semanticIndexRuns: WorkflowRunSummary[] = [
    { id: "demo_wf_002", name: "semantic-index", status: "completed", summary: "Indexed 142 new chunks across 8 source files.", source_kind: "cron", updated_at: ago(18) },
    { id: "demo_wf_004", name: "semantic-index", status: "completed", summary: "Re-indexed 23 updated chunks after schema change.", source_kind: "cron", updated_at: ago(1458) },
  ];

  const nightlyBackupRuns: WorkflowRunSummary[] = [
    { id: "demo_wf_005", name: "nightly-backup", status: "completed", summary: "SQLite WAL checkpoint and backup completed in 2.1s.", source_kind: "cron", updated_at: ago(480) },
    { id: "demo_wf_007", name: "nightly-backup", status: "completed", summary: "Backup completed, 4.2MB written.", source_kind: "cron", updated_at: ago(1920) },
  ];

  return [
    { workflow_key: "daily-review", run_count: 3, error_count: 1, last_updated: ago(15), runs: dailyReviewRuns },
    { workflow_key: "semantic-index", run_count: 2, error_count: 0, last_updated: ago(18), runs: semanticIndexRuns },
    { workflow_key: "nightly-backup", run_count: 2, error_count: 0, last_updated: ago(480), runs: nightlyBackupRuns },
  ];
}

// ---------------------------------------------------------------------------
// Calendar workflow events (for demo mode)
// ---------------------------------------------------------------------------

export function getDemoCronCalendarEvents(): { id: string; name: string; status: string; summary: string | null; started_at: string }[] {
  return [
    { id: "demo_wf_001", name: "daily-review", status: "completed", summary: "Reviewed 6 PRs, approved 4, requested changes on 2.", started_at: ago(15) },
    { id: "demo_wf_002", name: "semantic-index", status: "completed", summary: "Indexed 142 new chunks across 8 source files.", started_at: ago(18) },
    { id: "demo_wf_003", name: "daily-review", status: "error", summary: "GitHub API rate limit exceeded during review batch.", started_at: ago(1455) },
    { id: "demo_wf_004", name: "semantic-index", status: "completed", summary: "Re-indexed 23 updated chunks after schema change.", started_at: ago(1458) },
    { id: "demo_wf_005", name: "nightly-backup", status: "completed", summary: "SQLite WAL checkpoint and backup completed in 2.1s.", started_at: ago(480) },
    { id: "demo_wf_006", name: "daily-review", status: "completed", summary: "Reviewed 3 PRs, all approved.", started_at: ago(2895) },
    { id: "demo_wf_007", name: "nightly-backup", status: "completed", summary: "Backup completed, 4.2MB written.", started_at: ago(1920) },
  ];
}

// ---------------------------------------------------------------------------
// Artifacts
// ---------------------------------------------------------------------------

export function getDemoArtifacts(): ArtifactRow[] {
  return [
    { id: "demo_art_001", kind: "url", uri: "https://github.com/OpenKnots/OpenClaw/pull/47", title: "PR #47 — Add workspace skills loader", created_at: ago(12) },
    { id: "demo_art_002", kind: "doc", uri: "docs/architecture.md", title: "Architecture Overview", created_at: ago(35) },
    { id: "demo_art_003", kind: "repo", uri: "https://github.com/OpenKnots/OpenTrust", title: "OpenTrust repository", created_at: ago(60) },
    { id: "demo_art_004", kind: "url", uri: "https://nextjs.org/docs/app/building-your-application", title: "Next.js App Router docs", created_at: ago(90) },
    { id: "demo_art_005", kind: "note", uri: "inline:session-notes", title: "Session retrospective notes", created_at: ago(150) },
    { id: "demo_art_006", kind: "url", uri: "https://github.com/OpenKnots/OpenClaw/issues/12", title: "Issue #12 — Subagent session labels", created_at: ago(200) },
    { id: "demo_art_007", kind: "doc", uri: "docs/INGESTION.md", title: "Ingestion Pipeline Guide", created_at: ago(300) },
    { id: "demo_art_008", kind: "repo", uri: "https://github.com/OpenKnots/OpenClaw", title: "OpenClaw repository", created_at: ago(360) },
    { id: "demo_art_009", kind: "url", uri: "https://sqlite.org/fts5.html", title: "SQLite FTS5 Documentation", created_at: ago(420) },
    { id: "demo_art_010", kind: "doc", uri: "docs/PHASES.md", title: "Roadmap Phases", created_at: ago(500) },
    { id: "demo_art_011", kind: "note", uri: "inline:review-checklist", title: "PR review checklist template", created_at: ago(600) },
    { id: "demo_art_012", kind: "url", uri: "https://docs.github.com/en/rest", title: "GitHub REST API reference", created_at: ago(720) },
  ];
}

// ---------------------------------------------------------------------------
// Memory entries
// ---------------------------------------------------------------------------

export function getDemoMemoryEntries(): MemoryEntryWithOrigins[] {
  return [
    {
      id: "demo_mem_001", kind: "fact", title: "React Testing Best Practices",
      body: "Prefer testing user-visible behavior over implementation details. Use screen queries (getByRole, getByText) instead of container queries. Avoid testing internal state directly.",
      summary: "Key principles for writing maintainable React component tests.", retention_class: "longTerm", review_status: "approved",
      review_notes: "Well-sourced from multiple PR reviews.", confidence_score: 0.92, confidence_reason: "Derived from 6 successful PR review sessions.",
      uncertainty_summary: null, author_type: "agent", author_id: "pr-review-agent",
      created_at: ago(500), updated_at: ago(120), reviewed_at: ago(120), reviewed_by: "operator",
      origins: [{ memory_entry_id: "demo_mem_001", origin_type: "trace", origin_id: "demo_tr_001", relationship: "derived_from" }],
      tags: [{ memory_entry_id: "demo_mem_001", tag: "testing" }, { memory_entry_id: "demo_mem_001", tag: "react" }],
    },
    {
      id: "demo_mem_002", kind: "decision", title: "API Rate Limiting Pattern",
      body: "Use token-bucket with per-endpoint limits. Default: 100 req/min for authenticated, 20 req/min for anonymous. Store counters in Redis with TTL-based expiry.",
      summary: "Adopted rate limiting strategy for all public API endpoints.", retention_class: "pinned", review_status: "approved",
      review_notes: null, confidence_score: 0.88, confidence_reason: "Validated by production traffic analysis.",
      uncertainty_summary: null, author_type: "agent", author_id: "code-migration-agent",
      created_at: ago(800), updated_at: ago(300), reviewed_at: ago(300), reviewed_by: "operator",
      origins: [{ memory_entry_id: "demo_mem_002", origin_type: "workflowRun", origin_id: "demo_wf_001", relationship: "derived_from" }],
      tags: [{ memory_entry_id: "demo_mem_002", tag: "api" }, { memory_entry_id: "demo_mem_002", tag: "security" }],
    },
    {
      id: "demo_mem_003", kind: "insight", title: "SQLite FTS5 vs Semantic Search Trade-offs",
      body: "FTS5 is fast and deterministic but struggles with synonym matching. Semantic search handles meaning better but adds latency and requires embedding generation. Hybrid approach recommended for production.",
      summary: "Analysis of search strategies for the investigation engine.", retention_class: "longTerm", review_status: "reviewed",
      review_notes: "Needs benchmark data before promotion.", confidence_score: 0.75, confidence_reason: "Based on qualitative observation, not benchmarked.",
      uncertainty_summary: "Latency numbers are estimates, not measured.", author_type: "agent", author_id: "documentation-agent",
      created_at: ago(600), updated_at: ago(200), reviewed_at: ago(200), reviewed_by: "operator",
      origins: [
        { memory_entry_id: "demo_mem_003", origin_type: "artifact", origin_id: "demo_art_009", relationship: "derived_from" },
        { memory_entry_id: "demo_mem_003", origin_type: "trace", origin_id: "demo_tr_006", relationship: "supports" },
      ],
      tags: [{ memory_entry_id: "demo_mem_003", tag: "search" }, { memory_entry_id: "demo_mem_003", tag: "sqlite" }],
    },
    {
      id: "demo_mem_004", kind: "preference", title: "Commit Message Convention",
      body: "Use conventional commits format: type(scope): description. Types: feat, fix, refactor, docs, test, chore. Scope is optional but encouraged for multi-package repos.",
      summary: "Team-agreed commit message format.", retention_class: "working", review_status: "approved",
      review_notes: null, confidence_score: 0.95, confidence_reason: "Explicitly configured in repository.",
      uncertainty_summary: null, author_type: "user", author_id: "operator",
      created_at: ago(1200), updated_at: ago(400), reviewed_at: ago(400), reviewed_by: "operator",
      origins: [],
      tags: [{ memory_entry_id: "demo_mem_004", tag: "conventions" }, { memory_entry_id: "demo_mem_004", tag: "git" }],
    },
    {
      id: "demo_mem_005", kind: "summary", title: "Ingestion Pipeline Architecture",
      body: "Sessions are imported from ~/.openclaw/agents/main/sessions/ via ingest:openclaw. Cron workflows from ~/.openclaw/cron via ingest:cron. Semantic chunks built separately via index:semantic. All use cursor-based deduplication.",
      summary: "How the three ingestion pipelines work together.", retention_class: "longTerm", review_status: "approved",
      review_notes: "Verified against INGESTION.md spec.", confidence_score: 0.9, confidence_reason: "Matches documented architecture.",
      uncertainty_summary: null, author_type: "agent", author_id: "documentation-agent",
      created_at: ago(900), updated_at: ago(350), reviewed_at: ago(350), reviewed_by: "operator",
      origins: [{ memory_entry_id: "demo_mem_005", origin_type: "artifact", origin_id: "demo_art_007", relationship: "derived_from" }],
      tags: [{ memory_entry_id: "demo_mem_005", tag: "ingestion" }, { memory_entry_id: "demo_mem_005", tag: "architecture" }],
    },
    {
      id: "demo_mem_006", kind: "note", title: "Error handling gaps in API routes",
      body: "Several API route handlers catch errors but return generic 500 responses without structured error codes. Should adopt a consistent error envelope: { ok: false, error: { code, message, details } }.",
      summary: "Identified pattern for improving API error responses.", retention_class: "working", review_status: "draft",
      review_notes: null, confidence_score: 0.7, confidence_reason: "Observed in 4 route files, not exhaustively audited.",
      uncertainty_summary: "May miss some routes added recently.", author_type: "agent", author_id: "pr-review-agent",
      created_at: ago(130), updated_at: ago(130), reviewed_at: null, reviewed_by: null,
      origins: [{ memory_entry_id: "demo_mem_006", origin_type: "trace", origin_id: "demo_tr_006", relationship: "derived_from" }],
      tags: [{ memory_entry_id: "demo_mem_006", tag: "api" }, { memory_entry_id: "demo_mem_006", tag: "error-handling" }],
    },
    {
      id: "demo_mem_007", kind: "fact", title: "Next.js 16 Server Component Patterns",
      body: "Server components in Next.js 16 can directly call async functions without useEffect. Data fetching happens at render time. Use 'use client' directive only for interactive components.",
      summary: "Core mental model for Next.js server components.", retention_class: "longTerm", review_status: "approved",
      review_notes: null, confidence_score: 0.93, confidence_reason: "Verified against official Next.js documentation.",
      uncertainty_summary: null, author_type: "agent", author_id: "documentation-agent",
      created_at: ago(1000), updated_at: ago(450), reviewed_at: ago(450), reviewed_by: "operator",
      origins: [{ memory_entry_id: "demo_mem_007", origin_type: "artifact", origin_id: "demo_art_004", relationship: "derived_from" }],
      tags: [{ memory_entry_id: "demo_mem_007", tag: "nextjs" }, { memory_entry_id: "demo_mem_007", tag: "react" }],
    },
    {
      id: "demo_mem_008", kind: "timeline", title: "OpenTrust Phase 1 Milestones",
      body: "Phase 1 completed: SQLite schema, session/trace ingestion, FTS5 search, basic dashboard. Phase 2 in progress: semantic search, memory promotion, investigation templates.",
      summary: "Progress tracker for OpenTrust development phases.", retention_class: "working", review_status: "draft",
      review_notes: null, confidence_score: 0.85, confidence_reason: "Aligned with PHASES.md but may be slightly out of date.",
      uncertainty_summary: "Phase 2 completion percentage is estimated.", author_type: "agent", author_id: "documentation-agent",
      created_at: ago(700), updated_at: ago(100), reviewed_at: null, reviewed_by: null,
      origins: [{ memory_entry_id: "demo_mem_008", origin_type: "artifact", origin_id: "demo_art_010", relationship: "derived_from" }],
      tags: [{ memory_entry_id: "demo_mem_008", tag: "roadmap" }, { memory_entry_id: "demo_mem_008", tag: "phases" }],
    },
    {
      id: "demo_mem_009", kind: "decision", title: "Use pnpm as package manager",
      body: "Standardized on pnpm for all package management. Faster installs, strict node_modules structure, and workspace support. Added .npmrc with strict-peer-dependencies=true.",
      summary: "Package manager decision for the monorepo.", retention_class: "pinned", review_status: "approved",
      review_notes: "Enforced via workspace rule.", confidence_score: 0.99, confidence_reason: "Explicit team decision, enforced in CI.",
      uncertainty_summary: null, author_type: "user", author_id: "operator",
      created_at: ago(2000), updated_at: ago(800), reviewed_at: ago(800), reviewed_by: "operator",
      origins: [],
      tags: [{ memory_entry_id: "demo_mem_009", tag: "tooling" }, { memory_entry_id: "demo_mem_009", tag: "conventions" }],
    },
    {
      id: "demo_mem_010", kind: "insight", title: "Subagent session nesting depth",
      body: "Observed up to 3 levels of subagent nesting in complex PR reviews. Deeper nesting correlates with longer execution times but not necessarily better outcomes. Consider limiting to 2 levels for routine tasks.",
      summary: "Observation on subagent depth vs effectiveness.", retention_class: "working", review_status: "draft",
      review_notes: null, confidence_score: 0.6, confidence_reason: "Based on 8 sessions, small sample size.",
      uncertainty_summary: "Correlation may not hold with larger sample.", author_type: "agent", author_id: "pr-review-agent",
      created_at: ago(350), updated_at: ago(350), reviewed_at: null, reviewed_by: null,
      origins: [{ memory_entry_id: "demo_mem_010", origin_type: "trace", origin_id: "demo_tr_005", relationship: "derived_from" }],
      tags: [{ memory_entry_id: "demo_mem_010", tag: "subagents" }, { memory_entry_id: "demo_mem_010", tag: "performance" }],
    },
  ];
}

// ---------------------------------------------------------------------------
// Ingestion states
// ---------------------------------------------------------------------------

export function getDemoIngestionStates(): IngestionStateRow[] {
  return [
    { source_key: "openclaw-sessions", source_kind: "openclaw", cursor_text: "2026-03-21T10:00:00Z", cursor_number: null, last_run_at: ago(15), last_status: "ok", imported_count: 47, metadata_json: "{}" },
    { source_key: "cron-workflows", source_kind: "cron", cursor_text: null, cursor_number: 8, last_run_at: ago(18), last_status: "ok", imported_count: 8, metadata_json: "{}" },
    { source_key: "semantic-chunks", source_kind: "semantic", cursor_text: null, cursor_number: 284, last_run_at: ago(18), last_status: "ok", imported_count: 284, metadata_json: "{}" },
  ];
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

export function getDemoHealthSummary(): HealthSummary {
  return {
    attentionTraces: 1,
    riskyWorkflows: 1,
    stalePipelines: 0,
    latestActivityLabel: "15 minutes ago",
  };
}

// ---------------------------------------------------------------------------
// Investigations
// ---------------------------------------------------------------------------

export function getDemoSavedInvestigations(): SavedInvestigationRow[] {
  return [
    {
      id: "demo_inv_001",
      title: "Traces with tool errors this week",
      description: "Find traces where tool calls produced errors in the last 7 days.",
      sql_text: "SELECT traces.id, traces.title, tool_calls.tool_name, tool_calls.error_text FROM tool_calls JOIN traces ON traces.id = tool_calls.trace_id WHERE tool_calls.status = 'error' AND tool_calls.started_at > datetime('now', '-7 days') ORDER BY tool_calls.started_at DESC;",
      created_at: ago(500),
      updated_at: ago(120),
    },
    {
      id: "demo_inv_002",
      title: "Memory entries pending review",
      description: "List all draft memory entries ordered by confidence score.",
      sql_text: "SELECT id, title, confidence_score, created_at FROM memory_entries WHERE review_status = 'draft' ORDER BY confidence_score DESC;",
      created_at: ago(300),
      updated_at: ago(300),
    },
  ];
}

export function getDemoInvestigationTemplates(): InvestigationTemplate[] {
  return [
    {
      id: "demo_template:cron-attention",
      title: "Cron runs needing attention",
      description: "Find cron-origin workflows that ended in error or attention states.",
      sql_text: "SELECT id, name, status, updated_at FROM workflow_runs WHERE source_kind = 'cron' AND status IN ('error', 'attention') ORDER BY updated_at DESC LIMIT 50;",
    },
    {
      id: "demo_template:recent-tool-errors",
      title: "Recent tool errors",
      description: "List traces with tool calls that produced errors.",
      sql_text: "SELECT traces.id, traces.title, tool_calls.tool_name, tool_calls.error_text FROM tool_calls JOIN traces ON traces.id = tool_calls.trace_id WHERE tool_calls.status = 'error' ORDER BY tool_calls.started_at DESC LIMIT 50;",
    },
    {
      id: "demo_template:artifact-heavy-traces",
      title: "Artifact-heavy traces",
      description: "Find traces that reference multiple artifacts.",
      sql_text: "SELECT trace_edges.from_id AS trace_id, COUNT(*) AS artifact_count FROM trace_edges WHERE trace_edges.from_kind = 'trace' AND trace_edges.to_kind = 'artifact' GROUP BY trace_edges.from_id ORDER BY artifact_count DESC LIMIT 50;",
    },
  ];
}

// ---------------------------------------------------------------------------
// Search results (for dashboard search in demo mode)
// ---------------------------------------------------------------------------

export function getDemoSearchResults() {
  return [
    { source_id: "demo_tr_001", title: "Refactor auth middleware", snippet: "Applied token-refresh logic…", mode: "fts", sourceType: "trace" },
    { source_id: "demo_mem_001", title: "React Testing Best Practices", snippet: "Prefer testing user-visible behavior…", mode: "memory-entry", sourceType: "memory" },
  ];
}
