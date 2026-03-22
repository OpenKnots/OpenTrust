import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Database,
  FileSearch,
  GitBranch,
  HeartPulse,
  Layers3,
  Package,
  Plug,
  Search,
  Shield,
  Sparkles,
  Telescope,
  Workflow,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="landing">
      {/* ── Nav ── */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <div className="landing-nav__logo">
            <Shield size={16} />
          </div>
          <span>OpenTrust</span>
        </div>
        <div className="landing-nav__links">
          <a href="#features" className="landing-nav__link">Features</a>
          <a href="#architecture" className="landing-nav__link">Architecture</a>
          <a href="#api" className="landing-nav__link">API</a>
          <a href="#plugin" className="landing-nav__link">Plugin</a>
          <a href="#start" className="landing-nav__link">Get Started</a>
          <Link href="/dashboard" className="landing-nav__cta">
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero__glow" />
        <div className="landing-hero__badge">
          <Plug size={12} />
          Official OpenClaw Memory Plugin
        </div>
        <h1 className="landing-hero__title">
          The <span>Memory Layer</span> for OpenClaw
        </h1>
        <p className="landing-hero__subtitle">
          Local-first, operator-grade memory and traceability.
          Evidence-backed answers. Explainable retrieval.
          Built for agents, inspectable by operators.
        </p>
        <div className="landing-hero__actions">
          <Link href="/dashboard" className="landing-btn landing-btn--primary">
            Open Dashboard <ArrowRight size={16} />
          </Link>
          <a href="#architecture" className="landing-btn">
            Explore Architecture <ChevronRight size={16} />
          </a>
        </div>
      </section>

      <hr className="landing-divider" />

      {/* ── Value propositions ── */}
      <section className="landing-section">
        <div className="landing-section__label">
          <Sparkles size={12} />
          Why OpenTrust
        </div>
        <h2 className="landing-section__title">
          What can OpenTrust answer?
        </h2>
        <p className="landing-section__desc">
          OpenTrust turns raw OpenClaw sessions, workflows, and events
          into a structured memory layer with provenance, lineage, and
          operator-grade explainability.
        </p>
        <div className="landing-values">
          <ValueCard
            icon={<Telescope size={16} />}
            title="What happened?"
            desc="Full session and workflow traceability with event-level granularity."
          />
          <ValueCard
            icon={<FileSearch size={16} />}
            title="What evidence supports that?"
            desc="Every answer links back to source traces, artifacts, and tool calls."
          />
          <ValueCard
            icon={<GitBranch size={16} />}
            title="What caused the outcome?"
            desc="Lineage edges connect parent traces, tool results, and workflow steps."
          />
          <ValueCard
            icon={<BookOpen size={16} />}
            title="What should be remembered?"
            desc="Curated memory with explicit promotion, retention classes, and review."
          />
          <ValueCard
            icon={<Layers3 size={16} />}
            title="What changed over time?"
            desc="Incremental ingestion with cursors tracks evolution across sessions."
          />
          <ValueCard
            icon={<HeartPulse size={16} />}
            title="What is stale, missing, or risky?"
            desc="Health signals surface stale pipelines, failed ingestions, and coverage gaps."
          />
          <ValueCard
            icon={<Zap size={16} />}
            title="What insights can be derived?"
            desc="Semantic and lexical search across the full evidence graph for deep investigations."
          />
        </div>
      </section>

      <hr className="landing-divider" />

      {/* ── Architecture ── */}
      <section id="architecture" className="landing-section">
        <div className="landing-section__label">
          <Database size={12} />
          Architecture
        </div>
        <h2 className="landing-section__title">
          Three layers of trust
        </h2>
        <p className="landing-section__desc">
          OpenTrust is built as a layered system: durable storage at the bottom,
          multi-modal retrieval in the middle, and OpenClaw integration at the top.
        </p>
        <div className="landing-arch">
          <div className="landing-arch-card landing-arch-card--store">
            <div className="landing-arch-card__num">Layer 1</div>
            <div className="landing-arch-card__title">Evidence Store</div>
            <div className="landing-arch-card__desc">
              Append-safe local SQLite database with stable IDs, schema migrations,
              and auditable persistence. Every event, trace, workflow run, and artifact
              gets a reproducible reference.
            </div>
            <div className="landing-arch-card__tags">
              <span className="landing-arch-tag">SQLite</span>
              <span className="landing-arch-tag">better-sqlite3</span>
              <span className="landing-arch-tag">Migrations</span>
              <span className="landing-arch-tag">Stable IDs</span>
            </div>
          </div>
          <div className="landing-arch-card landing-arch-card--retrieval">
            <div className="landing-arch-card__num">Layer 2</div>
            <div className="landing-arch-card__title">Retrieval Layer</div>
            <div className="landing-arch-card__desc">
              Multi-modal retrieval combining FTS5 lexical search, sqlite-vec
              semantic vectors, and structured SQL joins. Lineage-aware ranking
              prefers evidence over unsupported summaries.
            </div>
            <div className="landing-arch-card__tags">
              <span className="landing-arch-tag">FTS5</span>
              <span className="landing-arch-tag">sqlite-vec</span>
              <span className="landing-arch-tag">Semantic</span>
              <span className="landing-arch-tag">Lineage joins</span>
            </div>
          </div>
          <div className="landing-arch-card landing-arch-card--integration">
            <div className="landing-arch-card__num">Layer 3</div>
            <div className="landing-arch-card__title">Integration Layer</div>
            <div className="landing-arch-card__desc">
              Native OpenClaw session ingestion, cron workflow tracking,
              Memory API surface, and first-class plugin packaging. Designed
              for agent consumption and operator inspection.
            </div>
            <div className="landing-arch-card__tags">
              <span className="landing-arch-tag">Sessions</span>
              <span className="landing-arch-tag">Workflows</span>
              <span className="landing-arch-tag">Memory API</span>
              <span className="landing-arch-tag">Plugin</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="landing-divider" />

      {/* ── Features ── */}
      <section id="features" className="landing-section">
        <div className="landing-section__label">
          <Layers3 size={12} />
          Core Features
        </div>
        <h2 className="landing-section__title">
          Everything an operator needs
        </h2>
        <p className="landing-section__desc">
          From raw event capture to curated memory, OpenTrust provides
          a complete pipeline for agent traceability and memory management.
        </p>
        <div className="landing-features">
          <FeatureCard
            icon={<Telescope size={15} />}
            title="Session Ingestion"
            desc="Imports OpenClaw session transcripts from JSONL with incremental cursor tracking."
          />
          <FeatureCard
            icon={<Workflow size={15} />}
            title="Workflow Tracking"
            desc="Ingests cron jobs and workflow runs with step-level attribution and status tracking."
          />
          <FeatureCard
            icon={<Layers3 size={15} />}
            title="Artifact Extraction"
            desc="Extracts and catalogs artifacts from traces and workflows with kind classification."
          />
          <FeatureCard
            icon={<Search size={15} />}
            title="Semantic Search"
            desc="64-dimensional sqlite-vec embeddings with FTS5 fallback for hybrid lexical + semantic search."
          />
          <FeatureCard
            icon={<BookOpen size={15} />}
            title="Memory Curation"
            desc="Promote evidence to curated memory with retention classes, tags, and review workflows."
          />
          <FeatureCard
            icon={<FileSearch size={15} />}
            title="Investigation System"
            desc="Saved SQL investigations, starter templates, and full-text search across all evidence."
          />
          <FeatureCard
            icon={<HeartPulse size={15} />}
            title="Health Monitoring"
            desc="Pipeline freshness, ingestion health, coverage gaps, and operator attention signals."
          />
          <FeatureCard
            icon={<GitBranch size={15} />}
            title="Lineage Tracking"
            desc="Parent-child trace edges, tool-call/tool-result pairing, and artifact provenance."
          />
        </div>
      </section>

      <hr className="landing-divider" />

      {/* ── Memory API ── */}
      <section id="api" className="landing-section landing-section--wide">
        <div className="landing-section__label">
          <Zap size={12} />
          Memory API
        </div>
        <h2 className="landing-section__title">
          Four operations, full provenance
        </h2>
        <p className="landing-section__desc">
          The Memory API contract provides evidence-backed retrieval, inspectable
          lineage, explicit writeback, and operational health -- all with stable
          envelopes safe for agent consumption.
        </p>
        <div className="landing-api-grid">
          <div className="landing-api-card">
            <div className="landing-api-card__header">
              <span className="landing-api-card__method landing-api-card__method--post">POST</span>
              <span className="landing-api-card__name">memory_search</span>
              <span className="landing-api-card__desc">Query with scope and confidence</span>
            </div>
            <div className="landing-api-card__body">
              <pre>{`{
  "query": "deployment regression",
  "scope": {
    "sources": ["sessions", "memoryEntries"],
    "timeRange": { "from": "2026-03-01" }
  },
  "mode": "hybrid",
  "limit": 10,
  "minConfidence": 0.5
}`}</pre>
            </div>
          </div>
          <div className="landing-api-card">
            <div className="landing-api-card__header">
              <span className="landing-api-card__method landing-api-card__method--post">POST</span>
              <span className="landing-api-card__name">memory_inspect</span>
              <span className="landing-api-card__desc">Traverse lineage and raw evidence</span>
            </div>
            <div className="landing-api-card__body">
              <pre>{`{
  "ref": {
    "type": "memoryEntry",
    "id": "mem_abc123"
  },
  "includeLineage": true,
  "includeRelated": true,
  "includeRaw": true
}`}</pre>
            </div>
          </div>
          <div className="landing-api-card">
            <div className="landing-api-card__header">
              <span className="landing-api-card__method landing-api-card__method--post">POST</span>
              <span className="landing-api-card__name">memory_promote</span>
              <span className="landing-api-card__desc">Writeback with review and retention</span>
            </div>
            <div className="landing-api-card__body">
              <pre>{`{
  "title": "Queue backlog regression",
  "body": "Consumer timing shifted ...",
  "originRefs": [
    { "type": "trace", "id": "trace_abc" }
  ],
  "retentionClass": "longTerm",
  "review": { "status": "draft" }
}`}</pre>
            </div>
          </div>
          <div className="landing-api-card">
            <div className="landing-api-card__header">
              <span className="landing-api-card__method landing-api-card__method--get">GET</span>
              <span className="landing-api-card__name">memory_health</span>
              <span className="landing-api-card__desc">Freshness and pipeline status</span>
            </div>
            <div className="landing-api-card__body">
              <pre>{`{
  "scope": "global",
  "status": "healthy",
  "signals": [{
    "kind": "ingestion_freshness",
    "status": "fresh",
    "metric": { "hours_since_ingest": 1 }
  }],
  "stats": { "stalePipelines": 0 }
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      <hr className="landing-divider" />

      {/* ── Plugin ── */}
      <section id="plugin" className="landing-section landing-section--wide">
        <div className="landing-section__label">
          <Package size={12} />
          OpenClaw Plugin
        </div>
        <h2 className="landing-section__title">
          Native OpenClaw plugin integration
        </h2>
        <p className="landing-section__desc">
          OpenTrust packages as a first-class native OpenClaw plugin using
          {" "}<code>definePluginEntry</code>, conforming to the official plugin manifest,
          tool registration, and HTTP route conventions.
        </p>
        <div className="landing-plugin-grid">
          <div className="landing-plugin-info">
            <div className="landing-plugin-item">
              <div className="landing-plugin-item__title">
                <Package size={14} />
                Plugin Manifest
              </div>
              <div className="landing-plugin-item__desc">
                Ships <code>openclaw.plugin.json</code> with a full JSON Schema
                config covering storage path, ingestion toggles, semantic indexing,
                retention defaults, health thresholds, and API enablement.
              </div>
            </div>
            <div className="landing-plugin-item">
              <div className="landing-plugin-item__title">
                <Zap size={14} />
                Four Agent Tools
              </div>
              <div className="landing-plugin-item__desc">
                Registers <code>memory_search</code>, <code>memory_inspect</code>,
                {" "}<code>memory_promote</code>, and <code>memory_health</code> as
                typed tools callable by the LLM agent via <code>api.registerTool()</code>.
              </div>
            </div>
            <div className="landing-plugin-item">
              <div className="landing-plugin-item__title">
                <Plug size={14} />
                HTTP Routes
              </div>
              <div className="landing-plugin-item__desc">
                Exposes <code>/plugins/opentrust/search</code>,
                {" "}<code>/inspect</code>, <code>/promote</code>,
                and <code>/health</code> via <code>api.registerHttpRoute()</code> with
                prefix matching.
              </div>
            </div>
            <div className="landing-plugin-item">
              <div className="landing-plugin-item__title">
                <Database size={14} />
                Exclusive Memory Slot
              </div>
              <div className="landing-plugin-item__desc">
                Integrates with the <code>plugins.slots.memory</code> exclusive
                slot system. Set <code>{`"memory": "opentrust"`}</code> to make
                OpenTrust the active memory plugin for the gateway.
              </div>
            </div>
          </div>
          <div className="landing-plugin-code">
            <div className="landing-plugin-code__tab">
              <span className="landing-plugin-code__tab-item landing-plugin-code__tab-item--active">
                index.ts
              </span>
              <span className="landing-plugin-code__tab-item">
                openclaw.plugin.json
              </span>
              <span className="landing-plugin-code__tab-item">
                config
              </span>
            </div>
            <div className="landing-plugin-code__body">
              <pre>{`import { definePluginEntry } from
  "openclaw/plugin-sdk/plugin-entry";

export default definePluginEntry({
  id: "opentrust",
  name: "OpenTrust",
  description:
    "Official OpenClaw memory layer plugin.",

  register(api) {
    // Agent tools
    api.registerTool({
      name: "memory_search",
      description: "Search curated memory",
      parameters: Type.Object({
        query: Type.String(),
        scope: Type.Optional(ScopeSchema),
      }),
      execute: (_id, params) =>
        memorySearch(params),
    });

    api.registerTool({
      name: "memory_inspect", /* ... */ });
    api.registerTool({
      name: "memory_promote", /* ... */ });
    api.registerTool({
      name: "memory_health",  /* ... */ });

    // HTTP surface
    api.registerHttpRoute({
      path: "/plugins/opentrust",
      auth: "plugin",
      match: "prefix",
      handler: createMemoryHttpHandler(),
    });
  },
});`}</pre>
            </div>
          </div>
        </div>
      </section>

      <hr className="landing-divider" />

      {/* ── Data flow ── */}
      <section className="landing-section landing-section--wide">
        <div className="landing-section__label">
          <Workflow size={12} />
          Data Flow
        </div>
        <h2 className="landing-section__title">
          From raw events to agent memory
        </h2>
        <p className="landing-section__desc">
          Data flows through a well-defined pipeline from OpenClaw sources
          into durable storage, indexed for retrieval, and served through
          the Memory API to both agents and operators.
        </p>
        <div className="landing-flow">
          <FlowStep icon={<Telescope size={16} />} label="OpenClaw" sub="Sessions & Cron" />
          <FlowArrow />
          <FlowStep icon={<Zap size={16} />} label="Ingestion" sub="JSONL Cursors" />
          <FlowArrow />
          <FlowStep icon={<Database size={16} />} label="SQLite Store" sub="Events & Traces" />
          <FlowArrow />
          <FlowStep icon={<Search size={16} />} label="Index" sub="FTS5 + sqlite-vec" />
          <FlowArrow />
          <FlowStep icon={<Layers3 size={16} />} label="Memory API" sub="Search & Inspect" />
          <FlowArrow />
          <FlowStep icon={<Sparkles size={16} />} label="Consumers" sub="Agent Tools & UI" />
        </div>
      </section>

      <hr className="landing-divider" />

      {/* ── Getting started ── */}
      <section id="start" className="landing-section">
        <div className="landing-section__label">
          <Zap size={12} />
          Get Started
        </div>
        <h2 className="landing-section__title">
          Up and running in minutes
        </h2>
        <p className="landing-section__desc">
          OpenTrust runs locally alongside OpenClaw. Install, initialize
          the database, ingest your sessions, and launch the dashboard.
        </p>
        <div className="landing-start">
          <div className="landing-start__steps">
            <div className="landing-start__step">
              <span className="landing-start__step-num">1</span>
              <div className="landing-start__step-text">
                <div className="landing-start__step-title">Install dependencies</div>
                <div className="landing-start__step-desc">
                  Clone the repo and install with pnpm. Requires Node 22+ and
                  an existing OpenClaw installation.
                </div>
              </div>
            </div>
            <div className="landing-start__step">
              <span className="landing-start__step-num">2</span>
              <div className="landing-start__step-text">
                <div className="landing-start__step-title">Initialize the database</div>
                <div className="landing-start__step-desc">
                  Creates the SQLite database with all schema migrations
                  under the <code>storage/</code> directory.
                </div>
              </div>
            </div>
            <div className="landing-start__step">
              <span className="landing-start__step-num">3</span>
              <div className="landing-start__step-text">
                <div className="landing-start__step-title">Ingest OpenClaw data</div>
                <div className="landing-start__step-desc">
                  Imports session transcripts and cron workflows from
                  your <code>~/.openclaw/</code> directory with cursor tracking.
                </div>
              </div>
            </div>
            <div className="landing-start__step">
              <span className="landing-start__step-num">4</span>
              <div className="landing-start__step-text">
                <div className="landing-start__step-title">Launch the dashboard</div>
                <div className="landing-start__step-desc">
                  Start the Next.js dev server and open the operator dashboard
                  at localhost.
                </div>
              </div>
            </div>
          </div>
          <div className="landing-start__code">
            <pre>{`# Clone and install
git clone https://github.com/OpenKnots/OpenTrust
cd OpenTrust
pnpm install

# Initialize database
pnpm run db:init

# Ingest OpenClaw sessions and workflows
pnpm run ingest:openclaw
pnpm run ingest:cron

# Build semantic index (optional)
pnpm run index:semantic

# Launch the dashboard
pnpm dev`}</pre>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer__brand">
          OpenTrust by OpenKnots
        </div>
        <div className="landing-footer__links">
          <a
            href="https://github.com/OpenKnots/OpenTrust"
            className="landing-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://docs.openclaw.ai/plugins"
            className="landing-footer__link"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenClaw Plugins
          </a>
          <Link href="/dashboard" className="landing-footer__link">
            Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="landing-value-card">
      <div className="landing-value-card__icon">{icon}</div>
      <div className="landing-value-card__title">{title}</div>
      <div className="landing-value-card__desc">{desc}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="landing-feature">
      <div className="landing-feature__icon">{icon}</div>
      <div className="landing-feature__title">{title}</div>
      <div className="landing-feature__desc">{desc}</div>
    </div>
  );
}

function FlowStep({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) {
  return (
    <div className="landing-flow__step">
      <div className="landing-flow__step-icon">{icon}</div>
      <div className="landing-flow__step-label">{label}</div>
      <div className="landing-flow__step-sub">{sub}</div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="landing-flow__arrow">
      <ChevronRight size={16} />
    </div>
  );
}
