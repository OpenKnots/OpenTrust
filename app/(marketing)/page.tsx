"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Database,
  FileSearch,
  GitBranch,
  HeartPulse,
  Layers3,
  Search,
  Telescope,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { MeshGradientBg, NeuroNoiseBg } from "@/components/shader-background";

const MOLTY_ICON = "https://openclaw.ai/favicon.svg";

const INSTALL_CODE = `# Clone and install
git clone https://github.com/OpenKnots/OpenTrust
cd OpenTrust
pnpm install

# Initialize database
pnpm run db:init

# Ingest OpenClaw evidence + memory files
pnpm run ingest:openclaw

# Launch dashboard
pnpm dev`;

export default function LandingPage() {
  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <img src={MOLTY_ICON} alt="Molty" className="landing-nav__icon" />
          <span>OpenTrust</span>
        </div>
        <div className="landing-nav__links">
          <a href="#features" className="landing-nav__link">Features</a>
          <a href="#how-it-works" className="landing-nav__link">How it Works</a>
          <a href="#comparison" className="landing-nav__link">Comparison</a>
          <Link href="/dashboard" className="landing-nav__cta">
            Open Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero - Nexflow Split Layout */}
      <section className="landing-hero-split">
        <MeshGradientBg
          colors={["#0a0a0a", "#1a0808", "#0a0a1a", "#111111"]}
          speed={0.3}
          className="landing-shader landing-shader--hero"
        />
        <div className="landing-hero-split__left">
          <div className="landing-hero-split__badge">
            OpenClaw Memory, Truthfully Extended
          </div>

          <h1 className="landing-hero-split__title">
            OpenClaw already has memory. OpenTrust turns it into a true memory layer.
          </h1>

          <p className="landing-hero-split__subtitle">
            Today, OpenClaw memory lives in workspace Markdown like <code>MEMORY.md</code> and <code>memory/YYYY-MM-DD.md</code>.
            OpenTrust ingests that real source of truth, then adds structure, lineage, health, timelines, backups, and operator review.
          </p>

          <div className="landing-hero-split__actions">
            <Link href="/dashboard" className="landing-btn landing-btn--primary landing-btn--lg">
              Open Dashboard
              <ArrowRight size={18} />
            </Link>
            <a href="#api" className="landing-btn landing-btn--lg">
              Explore API
            </a>
          </div>

          <div className="landing-hero-split__logos">
            <span className="landing-hero-split__logo">Current source: workspace Markdown</span>
            <span className="landing-hero-split__logo">Future shape: plugin-backed memory ops</span>
            <span className="landing-hero-split__logo">Backups, summaries, and historical recall</span>
          </div>
        </div>

        <div className="landing-hero-split__right">
          <ProductPreviewCard />
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="landing-section landing-section--shader">
        <NeuroNoiseBg
          colorBack="#0a0a0a"
          colorMid="#150a0a"
          colorFront="#201010"
          speed={0.2}
          className="landing-shader landing-shader--features"
        />
        <div className="landing-showcase">
          <FeatureShowcase
            label="OpenClaw today"
            title="Markdown Is The Real Memory Source"
            description="OpenClaw memory already lives in workspace files like MEMORY.md and memory/YYYY-MM-DD.md. OpenTrust starts from that authored truth instead of inventing a fake replacement story."
            visual={<TraceVisual />}
          />
          <FeatureShowcase
            label="Plugin layer"
            title="Structured, Reviewable, Backup-Aware Memory"
            description="Ingest the existing memory files, then add retention classes, provenance, review workflows, historical timelines, and exportable backup paths."
            visual={<MemoryVisual />}
          />
          <FeatureShowcase
            label="Recommendations"
            title="Daily Summaries + Meaningful Moments"
            description="Guide users toward daily summaries, long-term profile memory, project memory, and meaningful life moments that deserve durable storage beyond chat history."
            visual={<RetrievalVisual />}
          />
          <FeatureShowcase
            label="Operations"
            title="Health, Storage, and Future Plugin UX"
            description="Track freshness, search quality, and coverage while preparing a first-class OpenClaw plugin with operator surfaces, backups, and future CRM-style relationship memory."
            visual={<HealthVisual />}
          />
        </div>
      </section>

      <hr className="landing-divider" />

      {/* Features Grid */}
      <section id="features" className="landing-section">
        <div className="landing-section__eyebrow">Features</div>
        <h2 className="landing-section__title">
          What OpenTrust adds on top of OpenClaw’s memory model
        </h2>
        <p className="landing-section__desc">
          OpenClaw already captures memory in workspace Markdown. OpenTrust should ingest that source first, then add structure, provenance, recommendations, backups, and operator tooling around it.
        </p>

        <div className="landing-features">
          <Feature
            icon={<Database size={18} />}
            title="Truthful Source Import"
            desc="Import the real OpenClaw memory source today: MEMORY.md, memory/YYYY-MM-DD.md, and related workspace Markdown files."
          />
          <Feature
            icon={<Workflow size={18} />}
            title="Daily Summary Recommendations"
            desc="Generate intelligent prompts and drafts for daily summaries, unresolved threads, and meaningful moments worth preserving."
          />
          <Feature
            icon={<Search size={18} />}
            title="Semantic + Exact Recall"
            desc="Keep OpenClaw’s searchable memory feel while adding stronger structure, indexing, and operator review."
          />
          <Feature
            icon={<FileSearch size={18} />}
            title="Lineage Tracking"
            desc="Connect long-term memory back to workspace files, traces, artifacts, workflows, and future writeback sources."
          />
          <Feature
            icon={<Layers3 size={18} />}
            title="Backup-Aware Storage"
            desc="Recommend git-backed history, encrypted cloud backups, export bundles, and dual-store strategies for durable memory archives."
          />
          <Feature
            icon={<GitBranch size={18} />}
            title="CRM-Ready Scaffolding"
            desc="Plan for relationship memory, contacts, interactions, and follow-up queues in docs first before runtime implementation."
          />
        </div>
      </section>

      <hr className="landing-divider" />

      {/* Comparison Table */}
      <section id="comparison" className="landing-section">
        <div className="landing-section__eyebrow">Comparison</div>
        <h2 className="landing-section__title">
          OpenClaw today vs OpenTrust plugin model
        </h2>
        <p className="landing-section__desc">
          The honest comparison is not “memory vs no memory.” OpenClaw already has real memory today. OpenTrust should extend it by ingesting the current source of truth and making it operational.
        </p>

        <div className="landing-comparison">
          <div className="landing-comparison__header">
            <div className="landing-comparison__col"></div>
            <div className="landing-comparison__col">OpenClaw today</div>
            <div className="landing-comparison__col landing-comparison__col--highlight">OpenTrust plugin layer</div>
          </div>
          <ComparisonRow label="Canonical memory source is workspace Markdown" us={true} them={true} reverse />
          <ComparisonRow label="MEMORY.md + daily notes already work today" us={true} them={true} reverse />
          <ComparisonRow label="Structured review queue and retention entities" us={false} them={true} reverse />
          <ComparisonRow label="Timeline and calendar memory surfaces" us={false} them={true} reverse />
          <ComparisonRow label="Backup/export recommendations and flows" us={false} them={true} reverse />
          <ComparisonRow label="Operator health and provenance views" us={false} them={true} reverse />
          <ComparisonRow label="Daily summary recommendations" us={false} them={true} reverse />
          <ComparisonRow label="CRM / relationship memory scaffolding" us={false} them={true} reverse />
        </div>
      </section>

      <hr className="landing-divider" />

      {/* How It Works */}
      <section id="how-it-works" className="landing-section">
        <div className="landing-section__eyebrow">How it Works</div>
        <h2 className="landing-section__title">
          Four-step upgrade path from current OpenClaw memory to plugin memory ops
        </h2>
        <p className="landing-section__desc">
          Start from the memory system OpenClaw already has today, then layer in ingestion, structure, retrieval, and user-facing recommendations for summaries, backups, and durable recall.
        </p>

        <div className="landing-steps">
          <Step
            num={1}
            title="Read current memory"
            desc="Import MEMORY.md, memory/YYYY-MM-DD.md, and optional session-memory snapshots from the OpenClaw workspace."
          />
          <Step
            num={2}
            title="Structure it"
            desc="Persist those authored notes into a richer store with review state, provenance, retention, and timeline semantics."
          />
          <Step
            num={3}
            title="Recommend better capture"
            desc="Suggest daily summaries, project memory, meaningful moments, backup flows, and long-term promotion opportunities."
          />
          <Step
            num={4}
            title="Operate it"
            desc="Expose plugin-grade search, calendar/timeline, health, exports, and future relationship-memory scaffolding."
          />
        </div>
      </section>

      <hr className="landing-divider" />

      {/* FAQ - Nexflow Split Layout */}
      <section className="landing-section">
        <div className="landing-section__eyebrow">FAQs</div>
        <FAQSection />
      </section>

      <hr className="landing-divider" />

      {/* Final CTA */}
      <section className="landing-section landing-cta-final landing-section--shader">
        <MeshGradientBg
          colors={["#0a0a0a", "#180a0a", "#0a0a18", "#0f0f0f"]}
          speed={0.25}
          className="landing-shader landing-shader--cta"
        />
        <div className="landing-cta-final__content">
          <h2 className="landing-cta-final__title">
            Ready to build trust into your agent?
          </h2>
          <p className="landing-cta-final__desc">
            Start from the memory OpenClaw already stores today, then layer in review, provenance, backups, summaries, and future plugin-grade memory operations.
          </p>
          <div className="landing-cta-final__actions">
            <Link href="/dashboard" className="landing-btn landing-btn--primary landing-btn--lg">
              Open Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="landing-cta-final__code">
          <CodeBlock language="bash" code={INSTALL_CODE} filename="terminal" />
        </div>
      </section>

      {/* Footer - Nexflow 4-Column Layout */}
      <footer>
        <div className="footer-grid">
          <div className="footer-col">
            <div className="landing-footer__brand">
              <img src={MOLTY_ICON} alt="OpenTrust" style={{ width: 24, height: 24, borderRadius: 4 }} />
              <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>OpenTrust</span>
            </div>
            <div className="footer-col__tagline">
              The memory layer for OpenClaw. Evidence-backed retrieval and operator-grade traceability.
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col__title">Social</div>
            <div className="footer-col__links">
              <a href="https://github.com/OpenKnots/OpenTrust" target="_blank" rel="noopener noreferrer" className="footer-col__link">
                GitHub
              </a>
              <a href="https://x.com/OpenKnot" target="_blank" rel="noopener noreferrer" className="footer-col__link">
                Twitter
              </a>
              <a href="https://discord.gg/openknot" target="_blank" rel="noopener noreferrer" className="footer-col__link">
                Discord
              </a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col__title">Quick Menu</div>
            <div className="footer-col__links">
              <Link href="/dashboard" className="footer-col__link">Dashboard</Link>
              <a href="#features" className="footer-col__link">Features</a>
              <a href="#how-it-works" className="footer-col__link">How it Works</a>
              <a href="#comparison" className="footer-col__link">Comparison</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col__title">Information</div>
            <div className="footer-col__links">
              <a href="https://docs.openclaw.ai/plugins" target="_blank" rel="noopener noreferrer" className="footer-col__link">
                Documentation
              </a>
              <a href="https://github.com/OpenKnots/OpenTrust#readme" target="_blank" rel="noopener noreferrer" className="footer-col__link">
                README
              </a>
              <a href="https://github.com/OpenKnots/OpenTrust/issues" target="_blank" rel="noopener noreferrer" className="footer-col__link">
                Support
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 OpenKnot. All rights reserved.</span>
          <span>Threaded by <a href="https://openknot.ai" style={{ color: "rgba(255,255,255,0.5)" }}>OpenKnot</a></span>
        </div>
      </footer>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Components
// ──────────────────────────────────────────────────────────────────────────────

function FeatureShowcase({
  label,
  title,
  description,
  visual,
}: {
  label: string;
  title: string;
  description: string;
  visual: React.ReactNode;
}) {
  return (
    <div className="landing-showcase__card">
      <div className="landing-showcase__visual">{visual}</div>
      <div className="landing-showcase__content">
        <div className="landing-showcase__label">{label}</div>
        <h3 className="landing-showcase__title">{title}</h3>
        <p className="landing-showcase__desc">{description}</p>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="landing-feature">
      <div className="landing-feature__icon">{icon}</div>
      <h3 className="landing-feature__title">{title}</h3>
      <p className="landing-feature__desc">{desc}</p>
    </div>
  );
}

function ComparisonRow({ label, us, them, reverse = false }: { label: string; us: boolean; them: boolean; reverse?: boolean }) {
  const left = reverse ? us : them;
  const right = reverse ? them : us;

  return (
    <div className="landing-comparison__row">
      <div className="landing-comparison__cell">{label}</div>
      <div className="landing-comparison__cell">
        {left ? <Check size={18} className="landing-comparison__check-muted" /> : <X size={18} className="landing-comparison__x" />}
      </div>
      <div className="landing-comparison__cell landing-comparison__cell--us">
        {right ? <Check size={18} className="landing-comparison__check" /> : <X size={18} className="landing-comparison__x" />}
      </div>
    </div>
  );
}

function Step({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="landing-step">
      <div className="landing-step__num">{num}</div>
      <h3 className="landing-step__title">{title}</h3>
      <p className="landing-step__desc">{desc}</p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Visuals (simplified mockups)
// ──────────────────────────────────────────────────────────────────────────────

function TraceVisual() {
  return (
    <div className="visual-trace">
      <div className="visual-trace__item">
        <div className="visual-trace__dot" />
        <div className="visual-trace__label">session_abc_123</div>
      </div>
      <div className="visual-trace__item">
        <div className="visual-trace__dot" />
        <div className="visual-trace__label">trace_deployment_xyz</div>
      </div>
      <div className="visual-trace__item">
        <div className="visual-trace__dot" />
        <div className="visual-trace__label">artifact_config.json</div>
      </div>
    </div>
  );
}

function MemoryVisual() {
  return (
    <div className="visual-memory">
      <div className="visual-memory__badge">3 pending review</div>
      <div className="visual-memory__entry">Queue backlog regression</div>
      <div className="visual-memory__entry">Deployment timing shift</div>
    </div>
  );
}

function RetrievalVisual() {
  return (
    <div className="visual-retrieval">
      <div className="visual-retrieval__bar">
        <div className="visual-retrieval__fill" style={{ width: "94%" }} />
      </div>
      <div className="visual-retrieval__label">94% confidence</div>
    </div>
  );
}

function HealthVisual() {
  return (
    <div className="visual-health">
      <div className="visual-health__status">
        <div className="visual-health__dot" />
        <span>All pipelines healthy</span>
      </div>
      <div className="visual-health__metric">Last ingest: 1h ago</div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Nexflow-Inspired Components
// ──────────────────────────────────────────────────────────────────────────────

function ProductPreviewCard() {
  return (
    <div className="product-preview texture-diagonal">
      <div className="product-preview__breadcrumb">
        <span>OpenTrust</span>
        <span className="product-preview__breadcrumb-sep">/</span>
        <span>Memory</span>
        <span className="product-preview__breadcrumb-sep">/</span>
        <span>Evidence</span>
      </div>

      <div className="product-preview__tabs">
        <div className="product-preview__tab product-preview__tab--active">
          Traces <span style={{ opacity: 0.5 }}>12</span>
        </div>
        <div className="product-preview__tab">
          Memory <span style={{ opacity: 0.5 }}>8</span>
        </div>
        <div className="product-preview__tab">Health</div>
        <div className="product-preview__tab">API</div>
      </div>

      <div className="product-preview__table-row">
        <div className="product-preview__status-badge product-preview__status-badge--completed">
          Completed
        </div>
        <div className="product-preview__name">session_deploy_prod_v2</div>
        <div className="product-preview__progress">
          <div className="product-preview__progress-dot product-preview__progress-dot--active" />
          <div className="product-preview__progress-line" />
          <div className="product-preview__progress-dot product-preview__progress-dot--active" />
          <div className="product-preview__progress-line" />
          <div className="product-preview__progress-dot product-preview__progress-dot--active" />
        </div>
        <div className="product-preview__meta">operator</div>
        <div className="product-preview__meta">2m 14s</div>
      </div>

      <div className="product-preview__table-row">
        <div className="product-preview__status-badge product-preview__status-badge--running">
          Running
        </div>
        <div className="product-preview__name">workflow_memory_sync</div>
        <div className="product-preview__progress">
          <div className="product-preview__progress-dot product-preview__progress-dot--active" />
          <div className="product-preview__progress-line" />
          <div className="product-preview__progress-dot product-preview__progress-dot--active" />
          <div className="product-preview__progress-line" />
          <div className="product-preview__progress-dot" />
        </div>
        <div className="product-preview__meta">system</div>
        <div className="product-preview__meta">1m 32s</div>
      </div>

      <div className="product-preview__table-row">
        <div className="product-preview__status-badge product-preview__status-badge--completed">
          Completed
        </div>
        <div className="product-preview__name">trace_config_validation</div>
        <div className="product-preview__progress">
          <div className="product-preview__progress-dot product-preview__progress-dot--active" />
          <div className="product-preview__progress-line" />
          <div className="product-preview__progress-dot product-preview__progress-dot--active" />
          <div className="product-preview__progress-line" />
          <div className="product-preview__progress-dot product-preview__progress-dot--active" />
        </div>
        <div className="product-preview__meta">agent</div>
        <div className="product-preview__meta">45s</div>
      </div>

      <div className="product-preview__table-row">
        <div className="product-preview__status-badge product-preview__status-badge--failed">
          Failed
        </div>
        <div className="product-preview__name">artifact_ingestion_retry</div>
        <div className="product-preview__progress">
          <div className="product-preview__progress-dot product-preview__progress-dot--active" />
          <div className="product-preview__progress-line" />
          <div className="product-preview__progress-dot" />
          <div className="product-preview__progress-line" />
          <div className="product-preview__progress-dot" />
        </div>
        <div className="product-preview__meta">system</div>
        <div className="product-preview__meta">—</div>
      </div>
    </div>
  );
}


function FAQSection() {
  return (
    <div className="faq-grid">
      <div>
        <h2 className="faq-left__title">Got questions? We've got answers.</h2>
        <p className="faq-left__subtitle">
          Still have questions? Contact us at support@openknot.ai
        </p>
        <Link href="mailto:support@openknot.ai" className="landing-btn landing-btn--primary">
          Contact Us
        </Link>
      </div>

      <div className="faq-accordion">
        <FAQItem
          number="01"
          question="Where is memory stored in OpenClaw today?"
          answer="Today, OpenClaw memory is primarily stored as Markdown in the workspace: MEMORY.md for curated long-term memory and memory/YYYY-MM-DD.md for daily notes. Optional hook-generated memory snapshots also land under memory/. That workspace content is the right initial source for OpenTrust ingestion."
        />
        <FAQItem
          number="02"
          question="Does OpenClaw already have memory without OpenTrust?"
          answer="Yes. OpenClaw already has a real memory model today. Agents read and write workspace memory files, and memory_search indexes those Markdown files for semantic recall. OpenTrust should extend that system, not pretend it doesn’t exist."
        />
        <FAQItem
          number="03"
          question="What does the OpenTrust plugin add?"
          answer="OpenTrust adds structured storage, provenance, review workflows, timeline/calendar views, health surfaces, export and backup strategy, and richer operator tooling on top of the existing authored memory source."
        />
        <FAQItem
          number="04"
          question="What should users store besides daily notes?"
          answer="The strongest recommendations are daily summaries, long-term profile memory, project memory, meaningful life moments, and relationship/contact memory. These categories help preserve both operational continuity and personal continuity."
        />
        <FAQItem
          number="05"
          question="How should users back up their memory?"
          answer="Recommended options include a private git-backed archive, encrypted cloud folder sync, periodic export bundles, or a dual-store strategy where Markdown remains human-readable truth and OpenTrust SQLite provides structured operational views."
        />
        <FAQItem
          number="06"
          question="Is CRM support built yet?"
          answer="Not in runtime yet. For now, CRM-style relationship memory is docs-only scaffolding so the product can define people, interactions, follow-ups, and guardrails before implementing anything sensitive."
        />
      </div>
    </div>
  );
}

function FAQItem({ number, question, answer }: { number: string; question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
      <button
        className="faq-item__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="faq-item__number">{number}</span>
        <span className="faq-item__question">{question}</span>
        <X size={20} className="faq-item__icon" />
      </button>
      {isOpen && (
        <div className="faq-item__answer">
          {answer}
        </div>
      )}
    </div>
  );
}
