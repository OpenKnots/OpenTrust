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
  Sparkles,
  Telescope,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { CodeBlock } from "@/components/code-block";
import { CodeDemo } from "@/components/code-demo";

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

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero__stats">
          <div className="landing-hero__stat">4 API endpoints</div>
          <div className="landing-hero__stat">Evidence-backed</div>
          <div className="landing-hero__stat">Plugin-ready</div>
        </div>

        <h1 className="landing-hero__title">
          Build trust into every answer
        </h1>

        <p className="landing-hero__subtitle">
          The Memory Layer for OpenClaw. Evidence-backed retrieval, inspectable lineage,
          and operator-grade memory. Built for agents, designed for trust.
        </p>

        <div className="landing-hero__actions">
          <Link href="/dashboard" className="landing-btn landing-btn--primary">
            Open Dashboard
            <ArrowRight size={16} />
          </Link>
          <a href="#api" className="landing-btn">
            Explore API
          </a>
        </div>

        <div className="landing-hero__preview">
          <CodeDemo />
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="landing-section">
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

      {/* Testimonial */}
      <section className="landing-section">
        <div className="landing-testimonial">
          <div className="landing-testimonial__quote">
            "Finally, a memory layer I can trust. The lineage tracking alone is worth it —
            I know exactly where every answer came from."
          </div>
          <div className="landing-testimonial__author">
            <div className="landing-testimonial__avatar">
              <Sparkles size={18} />
            </div>
            <div className="landing-testimonial__meta">
              <div className="landing-testimonial__name">OpenClaw Operator</div>
              <div className="landing-testimonial__title">Production Deployment</div>
            </div>
          </div>
        </div>
      </section>

      <hr className="landing-divider" />

      {/* Final CTA */}
      <section className="landing-section landing-cta-final">
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
          <CodeBlock language="bash" code={INSTALL_CODE} />
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer__brand">
          <img src={MOLTY_ICON} alt="Molty" className="landing-footer__icon" />
          <span>OpenTrust by OpenKnots</span>
        </div>
        <div className="landing-footer__links">
          <a href="https://github.com/OpenKnots/OpenTrust" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://docs.openclaw.ai/plugins" target="_blank" rel="noopener noreferrer">
            Plugins
          </a>
          <Link href="/dashboard">Dashboard</Link>
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
