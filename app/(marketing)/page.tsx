import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Database,
  FileSearch,
  GitBranch,
  HeartPulse,
  Layers3,
  Package,
  Play,
  Plug,
  Search,
  Sparkles,
  Telescope,
  TrendingUp,
  TrendingDown,
  Workflow,
  Zap,
} from "lucide-react";
import { CardGrid } from "@/components/ui/card-grid";
import { CodeBlock, type CodeHighlight } from "@/components/code-block";
import { CodeDemo } from "@/components/code-demo";
import { CodeTabs } from "@/components/animate-ui/components/animate/code-tabs";
import { ApiCard } from "@/components/landing/api-card";

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

const PLUGIN_MANIFEST = `{
  "name": "opentrust",
  "version": "1.0.0",
  "displayName": "OpenTrust Memory",
  "description": "Evidence-backed memory layer for OpenClaw",
  "entry": "./index.ts",
  "slots": { "memory": "exclusive" },
  "config": {
    "storagePath": { "type": "string", "default": "./storage" },
    "enableSemantic": { "type": "boolean", "default": true },
    "retentionDefault": { "type": "string", "default": "longTerm" },
    "healthThreshold": { "type": "number", "default": 24 }
  }
}`;

const PLUGIN_CONFIG = `{
  "plugins": {
    "opentrust": {
      "enabled": true,
      "config": {
        "storagePath": "./storage/opentrust.db",
        "enableSemantic": true,
        "retentionDefault": "longTerm",
        "healthThreshold": 24
      }
    }
  },
  "slots": {
    "memory": "opentrust"
  }
}`;

const PLUGIN_TABS: Record<string, string> = {
  "index.ts": PLUGIN_CODE,
  "openclaw.plugin.json": PLUGIN_MANIFEST,
  "config": PLUGIN_CONFIG,
};

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
        <div className="landing-hero__badge">
          <img src={MOLTY_ICON} alt="Molty" className="landing-molty landing-molty--inline" />
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
          <a href="#api" className="landing-btn">
            Explore Memory API <ChevronRight size={16} />
          </a>
        </div>
        <div className="landing-hero__demo">
          <CodeDemo />
        </div>
      </section>

      <hr className="landing-divider" />

      <section className="landing-section landing-section--wide">
        <div className="landing-showcase-header">
          <div className="landing-showcase-header__text">
            <h2 className="landing-showcase-header__title">We ship, a lot.</h2>
          </div>
          <a href="#features" className="landing-showcase-header__cta">
            View all features
          </a>
        </div>

        <div className="landing-showcase-grid">
          <ShowcaseCard
            label="Memory"
            title="Evidence-Backed Memory"
          >
            <div className="sc-mock">
              <div className="sc-memory-panel">
                <div className="sc-memory-panel__header">
                  <span className="sc-memory-panel__date">Today&apos;s Traces, 3/22/2026</span>
                  <span className="sc-memory-panel__badge">
                    <span className="sc-memory-panel__count-num">2</span>
                  </span>
                </div>
                <div className="sc-memory-entries">
                  <div className="sc-memory-entry">
                    <div className="sc-memory-entry__title">Queue backlog regression</div>
                    <div className="sc-memory-entry__meta">trace_queue_abc · 3 evidence refs</div>
                  </div>
                  <div className="sc-memory-entry">
                    <div className="sc-memory-entry__title">Deployment timing shift</div>
                    <div className="sc-memory-entry__meta">trace_deploy_xyz · 5 evidence refs</div>
                  </div>
                </div>
                <div className="sc-promote-btn">
                  <Play size={10} /> Promote
                </div>
                <div className="sc-memory-panel__footer">
                  <span className="sc-memory-panel__count">
                    <span className="sc-memory-panel__count-num">3</span>
                    pending review
                  </span>
                  <Check size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
                </div>
              </div>
            </div>
          </ShowcaseCard>

          <ShowcaseCard
            label="Ingestion"
            title="Multi-Source Ingestion"
          >
            <div className="sc-mock">
              <div className="sc-sources-panel">
                <div className="sc-sources-search">
                  <div className="sc-sources-search__input">Search sources...</div>
                  <div className="sc-sources-search__btn">Ingest</div>
                </div>
                <div className="sc-sources-list">
                  <div className="sc-sources-item">
                    <span className="sc-sources-item__name">Session Transcripts</span>
                    <TrendingUp size={14} className="sc-sources-item__icon" />
                  </div>
                  <div className="sc-sources-item">
                    <span className="sc-sources-item__name">Cron Workflows</span>
                    <TrendingUp size={14} className="sc-sources-item__icon" />
                  </div>
                  <div className="sc-sources-item">
                    <span className="sc-sources-item__name">Tool Call Artifacts</span>
                    <TrendingUp size={14} className="sc-sources-item__icon" />
                  </div>
                  <div className="sc-sources-item">
                    <span className="sc-sources-item__name">Workflow Runs</span>
                    <TrendingUp size={14} className="sc-sources-item__icon" />
                  </div>
                </div>
              </div>
            </div>
          </ShowcaseCard>

          <ShowcaseCard
            label="Retrieval"
            title="Trust & Confidence Scoring"
          >
            <div className="sc-mock">
              <div className="sc-confidence-panel">
                <div className="sc-donut-wrap">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10"
                      strokeDasharray="157 314" strokeDashoffset="0" strokeLinecap="round"
                      transform="rotate(-90 60 60)" />
                    <circle cx="60" cy="60" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                    <circle cx="60" cy="60" r="38" fill="none" stroke="rgba(229,57,53,0.7)" strokeWidth="8"
                      strokeDasharray="215 239" strokeDashoffset="0" strokeLinecap="round"
                      transform="rotate(-90 60 60)" />
                  </svg>
                  <div className="sc-donut-inner-label">
                    <span className="sc-donut-inner-label__name">OpenTrust</span>
                    <span className="sc-donut-inner-label__value">94%</span>
                  </div>
                  <div className="sc-donut-outer" style={{ width: 64, height: 64 }}>
                    <svg width="64" height="64" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="24" fill="rgba(18,18,24,0.95)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                      <circle cx="32" cy="32" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                      <circle cx="32" cy="32" r="20" fill="none" stroke="rgba(0,229,255,0.6)" strokeWidth="6"
                        strokeDasharray="113 126" strokeDashoffset="0" strokeLinecap="round"
                        transform="rotate(-90 32 32)" />
                    </svg>
                    <div className="sc-donut-outer-label">
                      <span className="sc-donut-outer-label__name">others</span>
                      <span className="sc-donut-outer-label__value">50%</span>
                    </div>
                  </div>
                </div>
                <div className="sc-confidence-labels">
                  <span className="sc-confidence-label">Lineage</span>
                  <span className="sc-confidence-label">Evidence</span>
                  <span className="sc-confidence-label">Semantic</span>
                  <span className="sc-confidence-label">Coverage</span>
                </div>
              </div>
            </div>
          </ShowcaseCard>
        </div>
      </section>

      <hr className="landing-divider" />

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

      <section className="landing-section">
        <div className="landing-section__label">
          <TrendingUp size={12} />
          By the Numbers
        </div>
        <h2 className="landing-section__title">
          Trusted at scale
        </h2>
        <p className="landing-section__desc">
          OpenTrust processes raw agent activity into structured, evidence-backed
          memory — here's what the pipeline handles.
        </p>

        <div className="landing-stats-grid">
          <StatCard
            label="Sessions Ingested"
            value="142,847"
            change="+12.4%"
            changeType="positive"
            sparkData={[28, 34, 42, 38, 52, 61, 58, 72, 68, 84, 91, 96]}
          />
          <StatCard
            label="Memory Entries"
            value="38,291"
            change="+24.1%"
            changeType="positive"
            sparkData={[12, 18, 22, 28, 34, 31, 42, 48, 56, 62, 71, 78]}
          />
          <StatCard
            label="Evidence Traces"
            value="891,204"
            change="+8.7%"
            changeType="positive"
            sparkData={[60, 62, 68, 64, 72, 78, 74, 82, 86, 84, 92, 96]}
          />
          <StatCard
            label="Avg Confidence"
            value="94.2%"
            change="+2.1%"
            changeType="positive"
            sparkData={[82, 84, 86, 88, 86, 90, 88, 92, 90, 94, 92, 94]}
          />
        </div>

        <div className="landing-stats-progress-row">
          <ProgressStat
            label="Semantic Index"
            value="38,291"
            limit="50,000"
            percentage={76}
            color="accent"
          />
          <ProgressStat
            label="Storage Used"
            value="2.1 GB"
            limit="10 GB"
            percentage={21}
            color="info"
          />
          <ProgressStat
            label="Pipeline Coverage"
            value="47"
            limit="50 pipelines"
            percentage={94}
            color="warning"
          />
        </div>
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
          lineage, explicit writeback, and operational health &mdash; all with stable
          envelopes safe for agent consumption.
        </p>
        <div className="landing-section__cta">
          <Link href="/api-playground" className="landing-btn landing-btn--primary">
            Open API Playground <ArrowRight size={16} />
          </Link>
        </div>
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
          <CodeTabs
            className="landing-plugin-code"
            codes={PLUGIN_TABS}
            lang="typescript"
          />
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

function ShowcaseCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="landing-showcase-card">
      <div className="landing-showcase-card__preview">{children}</div>
      <div className="landing-showcase-card__body">
        <div className="landing-showcase-card__label">{label}</div>
        <div className="landing-showcase-card__title">{title}</div>
      </div>
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

function StatCard({
  label,
  value,
  change,
  changeType,
  sparkData,
}: {
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  sparkData: number[];
}) {
  const max = Math.max(...sparkData);
  const min = Math.min(...sparkData);
  const range = max - min || 1;
  const w = 120;
  const h = 40;
  const points = sparkData
    .map((v, i) => {
      const x = (i / (sparkData.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <div className="landing-stat-card">
      <div className="landing-stat-card__top">
        <span className="landing-stat-card__label">{label}</span>
        <span className={`landing-stat-card__change landing-stat-card__change--${changeType}`}>
          {changeType === "positive" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {change}
        </span>
      </div>
      <div className="landing-stat-card__value">{value}</div>
      <svg
        className="landing-stat-card__spark"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`spark-fill-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={changeType === "positive" ? "rgba(52,211,153,0.3)" : "rgba(248,113,113,0.3)"} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon
          points={areaPoints}
          fill={`url(#spark-fill-${label.replace(/\s/g, "")})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke={changeType === "positive" ? "rgba(52,211,153,0.9)" : "rgba(248,113,113,0.9)"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ProgressStat({
  label,
  value,
  limit,
  percentage,
  color,
}: {
  label: string;
  value: string;
  limit: string;
  percentage: number;
  color: "accent" | "info" | "warning";
}) {
  return (
    <div className="landing-progress-stat">
      <div className="landing-progress-stat__top">
        <span className="landing-progress-stat__label">{label}</span>
        <span className="landing-progress-stat__values">
          <span className="landing-progress-stat__value">{value}</span>
          {" / "}
          <span className="landing-progress-stat__limit">{limit}</span>
        </span>
      </div>
      <div className="landing-progress-stat__bar">
        <div
          className={`landing-progress-stat__fill landing-progress-stat__fill--${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="landing-progress-stat__pct">{percentage}%</div>
    </div>
  );
}
