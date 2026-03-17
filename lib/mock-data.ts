import type { CapabilityCardData, ManualSection, QueryExample, TraceCardData } from "@/lib/types";

export const manualSections: ManualSection[] = [
  {
    id: "briefing",
    title: "Briefing",
    summary: "Why OpenTrust exists and what it makes obvious for a human operator.",
  },
  {
    id: "traces",
    title: "Trace Atlas",
    summary: "Session, message, tool, workflow, and artifact lineage in one local system.",
  },
  {
    id: "capabilities",
    title: "Capability Registry",
    summary: "Trace skills, plugins, souls, and bundles with provenance instead of guesswork.",
  },
  {
    id: "queries",
    title: "Investigation Studio",
    summary: "Real SQL + semantic search + progressive disclosure, not a toy query language.",
  },
  {
    id: "storage",
    title: "Storage & Trust",
    summary: "SQLite, sqlite-vec, FTS5, and append-only evidence designed for local-first operation.",
  },
];

export const traceCards: TraceCardData[] = [
  {
    title: "Session trace",
    badge: "operator view",
    summary: "A single OpenClaw session rendered as an explainable timeline with messages, tool calls, workflow steps, and downstream artifacts.",
    bullets: [
      "message lineage from prompt to final reply",
      "tool execution evidence with timing and outcome",
      "workflow step correlation across sessions",
      "artifact and repo references attached to the same trace",
    ],
  },
  {
    title: "Workflow ledger",
    badge: "traceability",
    summary: "Track long-running workflows as first-class runs with parent-child edges, checkpoints, retries, and handoffs.",
    bullets: [
      "append-only run events",
      "step state, ownership, and retry metadata",
      "session-to-workflow cross references",
      "saved summaries for fast operator review",
    ],
  },
  {
    title: "Evidence-backed answers",
    badge: "progressive disclosure",
    summary: "Start with a crisp human summary, then reveal SQL, embeddings, raw events, and provenance only when needed.",
    bullets: [
      "beginner-friendly defaults",
      "expand into raw records and JSON payloads",
      "trace graph traversal for why/where questions",
      "semantic retrieval plus exact-match filtering",
    ],
  },
];

export const capabilityCards: CapabilityCardData[] = [
  {
    name: "Skills",
    kind: "skill",
    summary: "Index installed and referenced skills with version, source, and trace impact.",
    evidence: "Which sessions used a skill, what it changed, and what artifacts it influenced.",
  },
  {
    name: "Plugins",
    kind: "plugin",
    summary: "Track plugin activation, data access boundaries, and runtime usage across sessions.",
    evidence: "Which plugin emitted which event and how that shaped the operator outcome.",
  },
  {
    name: "Souls",
    kind: "soul",
    summary: "Capture persona-level configuration and behavior influence without flattening it into generic metadata.",
    evidence: "What identity instructions were active and which traces they affected.",
  },
  {
    name: "Bundles",
    kind: "bundle",
    summary: "Represent curated capability sets as installable, auditable units with lineage.",
    evidence: "How a bundle expands into underlying skills, plugins, policies, and resulting traces.",
  },
];

export const queryExamples: QueryExample[] = [
  {
    title: "Find workflows that touched a given repo and ended with errors",
    sql: `SELECT workflow_runs.id, workflow_runs.name, workflow_runs.status, artifacts.uri\nFROM workflow_runs\nJOIN run_artifacts ON run_artifacts.run_id = workflow_runs.id\nJOIN artifacts ON artifacts.id = run_artifacts.artifact_id\nWHERE artifacts.uri LIKE '%OpenClaw%'\n  AND workflow_runs.status = 'error'\nORDER BY workflow_runs.updated_at DESC;`,
  },
  {
    title: "List sessions that invoked a specific plugin and required operator attention",
    sql: `SELECT sessions.id, sessions.label, traces.status, capabilities.name\nFROM traces\nJOIN sessions ON sessions.id = traces.session_id\nJOIN trace_capabilities ON trace_capabilities.trace_id = traces.id\nJOIN capabilities ON capabilities.id = trace_capabilities.capability_id\nWHERE capabilities.kind = 'plugin'\n  AND capabilities.name = 'diffs'\n  AND traces.status = 'attention';`,
  },
  {
    title: "Hybrid search entry point for semantic evidence",
    sql: `SELECT chunk_id, source_kind, source_id, distance\nFROM embedding_chunks_vec\nWHERE embedding MATCH :query_embedding\nORDER BY distance\nLIMIT 12;`,
  },
];
