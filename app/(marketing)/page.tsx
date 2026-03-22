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

# Ingest OpenClaw sessions
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
            The Memory Layer
          </div>

          <h1 className="landing-hero-split__title">
            Build trust into every answer
          </h1>

          <p className="landing-hero-split__subtitle">
            Evidence-backed retrieval, inspectable lineage, and operator-grade memory.
            Built for agents, designed for trust.
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
            <span className="landing-hero-split__logo">4 API endpoints</span>
            <span className="landing-hero-split__logo">Evidence-backed retrieval</span>
            <span className="landing-hero-split__logo">Plugin-ready</span>
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
            label="Traces"
            title="Evidence-Backed Memory"
            description="Every answer traces back to source sessions, artifacts, and tool calls. No hallucinations, just provable lineage."
            visual={<TraceVisual />}
          />
          <FeatureShowcase
            label="Memory"
            title="Curated Long-Term Storage"
            description="Promote evidence to persistent memory with retention classes, review workflows, and explicit operator approval."
            visual={<MemoryVisual />}
          />
          <FeatureShowcase
            label="Retrieval"
            title="Hybrid Search Engine"
            description="Semantic vectors + lexical FTS5 with confidence scoring. Find what matters, ranked by trust."
            visual={<RetrievalVisual />}
          />
          <FeatureShowcase
            label="Health"
            title="Pipeline Monitoring"
            description="Track freshness, coverage gaps, and stale pipelines. Know when your memory layer needs attention."
            visual={<HealthVisual />}
          />
        </div>
      </section>

      <hr className="landing-divider" />

      {/* Features Grid */}
      <section id="features" className="landing-section">
        <div className="landing-section__eyebrow">Features</div>
        <h2 className="landing-section__title">
          Everything an operator needs
        </h2>
        <p className="landing-section__desc">
          From raw event capture to curated memory, OpenTrust provides
          a complete pipeline for agent traceability and memory management.
        </p>

        <div className="landing-features">
          <Feature
            icon={<Telescope size={18} />}
            title="Session Ingestion"
            desc="Imports OpenClaw session transcripts from JSONL with incremental cursor tracking."
          />
          <Feature
            icon={<Workflow size={18} />}
            title="Workflow Tracking"
            desc="Ingests cron jobs and workflow runs with step-level attribution and status tracking."
          />
          <Feature
            icon={<Search size={18} />}
            title="Semantic Search"
            desc="64-dimensional sqlite-vec embeddings with FTS5 fallback for hybrid lexical + semantic search."
          />
          <Feature
            icon={<FileSearch size={18} />}
            title="Lineage Tracking"
            desc="Parent-child trace edges, tool-call/tool-result pairing, and artifact provenance."
          />
          <Feature
            icon={<GitBranch size={18} />}
            title="Memory Curation"
            desc="Promote evidence to curated memory with retention classes, tags, and review workflows."
          />
          <Feature
            icon={<HeartPulse size={18} />}
            title="Health Monitoring"
            desc="Pipeline freshness, ingestion health, coverage gaps, and operator attention signals."
          />
        </div>
      </section>

      <hr className="landing-divider" />

      {/* Comparison Table */}
      <section id="comparison" className="landing-section">
        <div className="landing-section__eyebrow">Comparison</div>
        <h2 className="landing-section__title">
          OpenTrust vs other tools
        </h2>
        <p className="landing-section__desc">
          Most memory systems rely on vibes and embeddings.
          OpenTrust provides evidence, lineage, and trust.
        </p>

        <div className="landing-comparison">
          <div className="landing-comparison__header">
            <div className="landing-comparison__col"></div>
            <div className="landing-comparison__col landing-comparison__col--highlight">OpenTrust</div>
            <div className="landing-comparison__col">Other Tools</div>
          </div>
          <ComparisonRow label="Evidence-backed answers" us={true} them={false} />
          <ComparisonRow label="Full lineage tracking" us={true} them={false} />
          <ComparisonRow label="Operator inspection UI" us={true} them={false} />
          <ComparisonRow label="Health monitoring" us={true} them={false} />
          <ComparisonRow label="Retention control" us={true} them={false} />
          <ComparisonRow label="Hybrid search" us={true} them={true} />
          <ComparisonRow label="Vector embeddings" us={true} them={true} />
          <ComparisonRow label="Local-first storage" us={true} them={false} />
        </div>
      </section>

      <hr className="landing-divider" />

      {/* How It Works */}
      <section id="how-it-works" className="landing-section">
        <div className="landing-section__eyebrow">How it Works</div>
        <h2 className="landing-section__title">
          Four-step memory pipeline
        </h2>
        <p className="landing-section__desc">
          Data flows through a well-defined pipeline from OpenClaw sources
          into durable storage, indexed for retrieval, and served to agents.
        </p>

        <div className="landing-steps">
          <Step
            num={1}
            title="Ingest"
            desc="Import OpenClaw sessions, workflows, and artifacts from JSONL with cursor tracking."
          />
          <Step
            num={2}
            title="Store"
            desc="Persist to append-safe SQLite with stable IDs, schema migrations, and audit trails."
          />
          <Step
            num={3}
            title="Retrieve"
            desc="Query via FTS5 lexical + sqlite-vec semantic search with lineage-aware ranking."
          />
          <Step
            num={4}
            title="Trust"
            desc="Inspect evidence, traverse lineage, promote to memory, and monitor health."
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
            Get started in minutes with the OpenClaw plugin or standalone dashboard.
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

function ComparisonRow({ label, us, them }: { label: string; us: boolean; them: boolean }) {
  return (
    <div className="landing-comparison__row">
      <div className="landing-comparison__cell">{label}</div>
      <div className="landing-comparison__cell landing-comparison__cell--us">
        {us ? <Check size={18} className="landing-comparison__check" /> : <X size={18} className="landing-comparison__x" />}
      </div>
      <div className="landing-comparison__cell">
        {them ? <Check size={18} className="landing-comparison__check-muted" /> : <X size={18} className="landing-comparison__x" />}
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
          question="What is OpenTrust?"
          answer="OpenTrust is a memory layer for OpenClaw that provides evidence-backed retrieval, inspectable lineage, and operator-grade memory management. It ensures every answer can be traced back to its source."
        />
        <FAQItem
          number="02"
          question="How does evidence-backed memory work?"
          answer="Every memory entry in OpenTrust includes full lineage tracking back to the original source sessions, artifacts, and tool calls. This means you can always verify where information came from and how it was derived."
        />
        <FAQItem
          number="03"
          question="Can I use OpenTrust with existing agents?"
          answer="Yes! OpenTrust integrates seamlessly with OpenClaw and provides a plugin architecture. You can also use the standalone dashboard to inspect and manage memory independently."
        />
        <FAQItem
          number="04"
          question="What's the difference between traces and memory?"
          answer="Traces are raw session records imported from OpenClaw. Memory entries are curated, operator-approved knowledge promoted from traces with explicit retention policies and review workflows."
        />
        <FAQItem
          number="05"
          question="Is my data stored locally?"
          answer="Yes. OpenTrust uses local SQLite storage with append-safe guarantees. All data stays on your machine unless you explicitly configure remote backups."
        />
        <FAQItem
          number="06"
          question="How do I get started?"
          answer="Clone the repository, run pnpm install, initialize the database with pnpm run db:init, and start ingesting OpenClaw sessions with pnpm run ingest:openclaw. The dashboard launches with pnpm dev."
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
