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
  Sparkles,
  Telescope,
  Workflow,
  Zap,
} from "lucide-react";
import { BorderGlow } from "@/components/border-glow";
import { CardGrid } from "@/components/ui/card-grid";
import { CodeBlock, type CodeHighlight } from "@/components/code-block";
import { CodeDemo } from "@/components/code-demo";

const MOLTY_ICON = "https://openclaw.ai/favicon.svg";

const SEARCH_CODE = `{
  "query": "deployment regression after queue changes",
  "scope": {
    "sources": ["sessions", "memoryEntries", "artifacts"],
    "timeRange": { "from": "2026-03-01" }
  },
  "mode": "hybrid",
  "limit": 10,
  "minConfidence": 0.72
}`;

const INSPECT_CODE = `{
  "ref": {
    "type": "memoryEntry",
    "id": "mem_queue_regression"
  },
  "includeLineage": true,
  "includeRelated": true,
  "includeRaw": true
}`;

const PROMOTE_CODE = `{
  "title": "Queue backlog regression",
  "body": "Consumer timing shifted after deployment and delayed downstream checks.",
  "originRefs": [
    { "type": "trace", "id": "trace_queue_abc" }
  ],
  "retentionClass": "longTerm",
  "review": { "status": "draft" }
}`;

const HEALTH_CODE = `{
  "scope": "global",
  "status": "healthy",
  "signals": [{
    "kind": "ingestion_freshness",
    "status": "fresh",
    "metric": { "hours_since_ingest": 1 }
  }],
  "stats": { "stalePipelines": 0 }
}`;

const HERO_CODE = `memory_search("deployment regression after queue changes")
  ↳ 3 evidence-backed matches
  ↳ confidence: 0.93
  ↳ lineage attached

memory_inspect("mem_queue_regression")
  ↳ trace_queue_abc → workflow_run_42 → artifact_diff
  ↳ raw evidence + provenance loaded

memory_promote("Queue backlog regression")
  ↳ review: draft
  ↳ retention: longTerm

memory_health()
  ↳ ingestion fresh · stalePipelines: 0`;

const PLUGIN_CODE = `export default definePluginEntry({
  id: "opentrust",
  name: "OpenTrust",

  register(api) {
    api.registerTool({ name: "memory_search" /* ... */ })
    api.registerTool({ name: "memory_inspect" /* ... */ })
    api.registerTool({ name: "memory_promote" /* ... */ })
    api.registerTool({ name: "memory_health" /* ... */ })

    api.registerHttpRoute({
      path: "/plugins/opentrust",
      auth: "plugin",
      match: "prefix",
      handler: createMemoryHttpHandler(),
    })
  },
})`;

const heroHighlights: CodeHighlight[] = [
  { line: 1, variant: "search", start: 2, width: 72, label: "query" },
  { line: 2, variant: "search", start: 16, width: 44, label: "evidence" },
  { line: 6, variant: "inspect", start: 2, width: 56, label: "inspect" },
  { line: 7, variant: "inspect", start: 8, width: 76, label: "lineage" },
  { line: 10, variant: "promote", start: 2, width: 58, label: "writeback" },
  { line: 11, variant: "promote", start: 16, width: 28, label: "review" },
  { line: 14, variant: "health", start: 2, width: 36, label: "health" },
  { line: 15, variant: "health", start: 10, width: 54, label: "fresh" },
];

const searchHighlights: CodeHighlight[] = [
  { line: 2, variant: "search", start: 16, width: 56, label: "query" },
  { line: 4, variant: "search", start: 17, width: 52 },
  { line: 8, variant: "search", start: 17, width: 28, label: "confidence" },
];

const inspectHighlights: CodeHighlight[] = [
  { line: 2, variant: "inspect", start: 12, width: 40, label: "entity" },
  { line: 5, variant: "inspect", start: 17, width: 42, label: "lineage" },
  { line: 7, variant: "inspect", start: 17, width: 34, label: "raw evidence" },
];

const promoteHighlights: CodeHighlight[] = [
  { line: 2, variant: "promote", start: 12, width: 46, label: "memory title" },
  { line: 5, variant: "promote", start: 8, width: 54, label: "origin" },
  { line: 7, variant: "promote", start: 21, width: 24, label: "retention" },
  { line: 8, variant: "promote", start: 16, width: 28, label: "review" },
];

const healthHighlights: CodeHighlight[] = [
  { line: 3, variant: "health", start: 15, width: 28, label: "healthy" },
  { line: 5, variant: "health", start: 15, width: 24, label: "fresh" },
  { line: 6, variant: "health", start: 18, width: 34, label: "metric" },
  { line: 8, variant: "health", start: 13, width: 34, label: "trust signal" },
];

const pluginHighlights: CodeHighlight[] = [
  { line: 1, variant: "plugin", start: 34, width: 28, label: "entry" },
  { line: 6, variant: "plugin", start: 38, width: 26, label: "tools" },
  { line: 10, variant: "plugin", start: 42, width: 24, label: "route" },
  { line: 11, variant: "plugin", start: 70, width: 16, label: "path" },
];

export default function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <div className="landing-nav__logo">
            <img src={MOLTY_ICON} alt="Molty" className="landing-molty landing-molty--nav" />
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

      <section className="landing-hero">
        <div className="landing-hero__glow" />
        <div className="landing-hero__glow landing-hero__glow--secondary" />
        <div className="landing-hero__grid">
          <div className="landing-hero__copy">
            <div className="landing-hero__badge">
              <img src={MOLTY_ICON} alt="Molty" className="landing-molty landing-molty--inline" />
              <Plug size={12} />
              Official OpenClaw Memory Plugin
            </div>
            <h1 className="landing-hero__title">
              The <span>Memory Layer</span> that makes every OpenClaw answer feel earned
            </h1>
            <p className="landing-hero__subtitle">
              OpenTrust turns raw sessions, workflows, and artifacts into evidence-backed memory with
              inspectable lineage, retrieval you can defend, and operator-grade trust signals built for OpenClaw.
            </p>
            <div className="landing-hero__actions">
              <Link href="/dashboard" className="landing-btn landing-btn--primary">
                Open Dashboard <ArrowRight size={16} />
              </Link>
              <a href="#api" className="landing-btn">
                Explore Memory API <ChevronRight size={16} />
              </a>
            </div>
            <div className="landing-proof-strip">
              <ProofPill title="Evidence first" value="Traces • artifacts • lineage" />
              <ProofPill title="Retrieval" value="FTS5 + sqlite-vec hybrid" />
              <ProofPill title="Operator trust" value="Health, review, provenance" />
            </div>
          </div>

          <div className="landing-hero__stage">
            <BorderGlow className="landing-surface-card landing-surface-card--hero" active>
              <div className="landing-console__topline">
                <div>
                  <div className="landing-console__eyebrow">Live retrieval choreography</div>
                  <div className="landing-console__title">Watch the system find signal, inspect lineage, and prove freshness</div>
                </div>
                <div className="landing-console__live">
                  <span className="landing-console__dot" />
                  Active memory substrate
                </div>
              </div>
              <div className="landing-console__query">“Why did the deployment regress after the queue change?”</div>
              <CodeBlock
                language="bash"
                filename="memory.runtime"
                code={HERO_CODE}
                showLineNumbers={false}
                highlights={heroHighlights}
              />
              <div className="landing-console__signals">
                <SignalChip tone="search" label="Hybrid retrieval" value="semantic + lexical" />
                <SignalChip tone="inspect" label="Evidence graph" value="trace → workflow → artifact" />
                <SignalChip tone="promote" label="Writeback" value="review + retention" />
                <SignalChip tone="health" label="Health" value="fresh pipelines" />
              </div>
            </BorderGlow>

            <div className="landing-stage-grid">
              <BorderGlow className="landing-surface-card landing-surface-card--compact" active>
                <div className="landing-surface-card__eyebrow">Why it feels trustworthy</div>
                <ul className="landing-trust-list">
                  <li><span /> Answers link back to source evidence</li>
                  <li><span /> Retrieval explains why results surfaced</li>
                  <li><span /> Memory promotion stays reviewable</li>
                </ul>
              </BorderGlow>
              <div className="landing-code-demo">
                <CodeDemo />
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="landing-divider" />

      <section className="landing-section">
        <div className="landing-section__label">
          <Sparkles size={12} />
          Why OpenTrust
        </div>
        <h2 className="landing-section__title">
          What becomes possible when memory is inspectable?
        </h2>
        <p className="landing-section__desc">
          OpenTrust turns raw OpenClaw sessions, workflows, and events into a structured memory layer
          with provenance, lineage, and operator-grade explainability — so answers are attributable, reviewable, and useful.
        </p>
        <CardGrid tone="accent" storageKey="landing-values" className="landing-values-wrap">
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
        </CardGrid>
      </section>

      <hr className="landing-divider" />

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
        <CardGrid tone="neutral" storageKey="landing-arch" className="landing-arch-wrap">
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
        </CardGrid>
      </section>

      <hr className="landing-divider" />

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
        <CardGrid tone="info" storageKey="landing-features" className="landing-features-wrap">
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
        </CardGrid>
      </section>

      <hr className="landing-divider" />

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
          lineage, explicit writeback, and operational health — all with stable
          envelopes safe for agent consumption.
        </p>
        <CardGrid tone="accent" storageKey="landing-api" className="landing-api-wrap">
          <ApiCard
            method="POST"
            methodTone="post"
            name="memory_search"
            desc="Query with scope and confidence"
            code={SEARCH_CODE}
            language="json"
            highlights={searchHighlights}
            variant="search"
          />
          <ApiCard
            method="POST"
            methodTone="post"
            name="memory_inspect"
            desc="Traverse lineage and raw evidence"
            code={INSPECT_CODE}
            language="json"
            highlights={inspectHighlights}
            variant="inspect"
          />
          <ApiCard
            method="POST"
            methodTone="post"
            name="memory_promote"
            desc="Writeback with review and retention"
            code={PROMOTE_CODE}
            language="json"
            highlights={promoteHighlights}
            variant="promote"
          />
          <ApiCard
            method="GET"
            methodTone="get"
            name="memory_health"
            desc="Freshness and pipeline status"
            code={HEALTH_CODE}
            language="json"
            highlights={healthHighlights}
            variant="health"
          />
        </CardGrid>
      </section>

      <hr className="landing-divider" />

      <section id="plugin" className="landing-section landing-section--wide">
        <div className="landing-section__label">
          <Package size={12} />
          OpenClaw Plugin
        </div>
        <h2 className="landing-section__title">
          Native OpenClaw plugin integration
        </h2>
        <p className="landing-section__desc">
          OpenTrust packages as a first-class native OpenClaw plugin using{" "}
          <code>definePluginEntry</code>, conforming to the official plugin manifest,
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
                <code> memory_promote</code>, and <code>memory_health</code> as
                typed tools callable by the LLM agent via <code>api.registerTool()</code>.
              </div>
            </div>
            <div className="landing-plugin-item">
              <div className="landing-plugin-item__title">
                <Plug size={14} />
                HTTP Routes
              </div>
              <div className="landing-plugin-item__desc">
                Exposes <code>/plugins/opentrust/search</code>, <code>/inspect</code>,
                <code>/promote</code>, and <code>/health</code> via <code>api.registerHttpRoute()</code>
                with prefix matching.
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
          <BorderGlow className="landing-plugin-code" active>
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
              <CodeBlock language="typescript" code={PLUGIN_CODE} highlights={pluginHighlights} />
            </div>
          </BorderGlow>
        </div>
      </section>

      <hr className="landing-divider" />

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
                <div className="landing-start__step-title">Initialize durable storage</div>
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
                <div className="landing-start__step-title">Open the operator dashboard</div>
                <div className="landing-start__step-desc">
                  Start the Next.js dev server and open the operator dashboard
                  at localhost.
                </div>
              </div>
            </div>
          </div>
          <div className="landing-start__code">
            <CodeBlock language="bash" filename="terminal" code={`# Clone and install
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
pnpm dev`} />
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <img src={MOLTY_ICON} alt="Molty" className="landing-molty landing-molty--footer" />
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

function ProofPill({ title, value }: { title: string; value: string }) {
  return (
    <div className="landing-proof-pill">
      <img src={MOLTY_ICON} alt="Molty" className="landing-molty landing-molty--proof" />
      <div className="landing-proof-pill__copy">
        <span className="landing-proof-pill__title">{title}</span>
        <span className="landing-proof-pill__value">{value}</span>
      </div>
    </div>
  );
}

function SignalChip({ label, value, tone }: { label: string; value: string; tone: "search" | "inspect" | "promote" | "health" }) {
  return (
    <div className={`landing-signal-chip landing-signal-chip--${tone}`}>
      <img src={MOLTY_ICON} alt="Molty" className="landing-molty landing-molty--signal" />
      <div className="landing-signal-chip__copy">
        <span className="landing-signal-chip__label">{label}</span>
        <span className="landing-signal-chip__value">{value}</span>
      </div>
    </div>
  );
}

function ApiCard({
  method,
  methodTone,
  name,
  desc,
  code,
  language,
  highlights,
  variant,
}: {
  method: string;
  methodTone: "post" | "get";
  name: string;
  desc: string;
  code: string;
  language: "json" | "typescript" | "bash";
  highlights: CodeHighlight[];
  variant: "search" | "inspect" | "promote" | "health";
}) {
  return (
    <BorderGlow className={`landing-api-card landing-api-card--${variant}`} active>
      <div className="landing-api-card__header">
        <img src={MOLTY_ICON} alt="Molty" className="landing-molty landing-molty--api" />
        <span className={`landing-api-card__method landing-api-card__method--${methodTone}`}>{method}</span>
        <span className="landing-api-card__name">{name}</span>
        <span className="landing-api-card__desc">{desc}</span>
      </div>
      <div className="landing-api-card__body">
        <CodeBlock language={language} showLineNumbers={false} code={code} highlights={highlights} />
      </div>
    </BorderGlow>
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
