"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Cloud,
  Database,
  FileSearch,
  FileText,
  FolderArchive,
  GitBranch,
  HeartPulse,
  Layers3,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Telescope,
  Users,
  Workflow,
  X,
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
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <img src={MOLTY_ICON} alt="Molty" className="landing-nav__icon" />
          <span>OpenTrust</span>
        </div>
        <div className="landing-nav__links">
          <a href="#features" className="landing-nav__link">Features</a>
          <a href="#architecture" className="landing-nav__link">Architecture</a>
          <a href="#comparison" className="landing-nav__link">Comparison</a>
          <Link href="/dashboard" className="landing-nav__cta">
            Open Dashboard
          </Link>
        </div>
      </nav>

      <section className="landing-hero-minimal">
        <MeshGradientBg
          colors={["#000000", "#0a0000", "#100000", "#050000"]}
          speed={0.15}
          className="landing-shader landing-shader--hero"
        />

        <div className="landing-hero-minimal__inner">
          <div className="landing-hero-minimal__kicker">
            OpenClaw remembers.
          </div>

          <h1 className="landing-hero-minimal__title">
            <span className="landing-hero-minimal__title-gradient">OpenTrust Clarifies.</span>
          </h1>

          <p className="landing-hero-minimal__subtitle">
            0 memories shaped into a cleaner operational layer across 60 traces and 6 workflows.
          </p>

          <div className="landing-hero-minimal__actions">
            <Link href="/dashboard" className="landing-btn landing-btn--primary landing-btn--lg">
              Open Dashboard
              <ArrowRight size={18} />
            </Link>
            <a href="#comparison" className="landing-btn landing-btn--ghost landing-btn--lg">
              See Comparison
            </a>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section--shader">
        <NeuroNoiseBg
          colorBack="#000000"
          colorMid="#0c0000"
          colorFront="#120000"
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

      <section id="features" className="landing-section">
        <div className="landing-section__eyebrow">Features</div>
        <h2 className="landing-section__title">
          What OpenTrust adds on top of OpenClaw’s memory model
        </h2>
        <p className="landing-section__desc">
          OpenClaw already captures memory in workspace Markdown. OpenTrust should ingest that source first, then add structure, provenance, recommendations, backups, and operator tooling around it.
        </p>

        <div className="landing-features">
          <Feature icon={<Database size={18} />} title="Truthful Source Import" desc="Import the real OpenClaw memory source today: MEMORY.md, memory/YYYY-MM-DD.md, and related workspace Markdown files." />
          <Feature icon={<Workflow size={18} />} title="Daily Summary Recommendations" desc="Generate intelligent prompts and drafts for daily summaries, unresolved threads, and meaningful moments worth preserving." />
          <Feature icon={<Search size={18} />} title="Semantic + Exact Recall" desc="Keep OpenClaw’s searchable memory feel while adding stronger structure, indexing, and operator review." />
          <Feature icon={<FileSearch size={18} />} title="Lineage Tracking" desc="Connect long-term memory back to workspace files, traces, artifacts, workflows, and future writeback sources." />
          <Feature icon={<Layers3 size={18} />} title="Backup-Aware Storage" desc="Recommend git-backed history, encrypted cloud backups, export bundles, and dual-store strategies for durable memory archives." />
          <Feature icon={<GitBranch size={18} />} title="CRM-Ready Scaffolding" desc="Plan for relationship memory, contacts, interactions, and follow-up queues in docs first before runtime implementation." />
        </div>
      </section>

      <hr className="landing-divider" />

      <section id="comparison" className="landing-section landing-section--shader">
        <NeuroNoiseBg
          colorBack="#000000"
          colorMid="#0a0000"
          colorFront="#100000"
          speed={0.12}
          className="landing-shader landing-shader--comparison"
        />
        <div className="landing-section__eyebrow">Comparison</div>
        <h2 className="landing-vs__headline">
          Same memory source.
          <br />
          <span className="landing-vs__headline-accent">New operational power.</span>
        </h2>
        <p className="landing-section__desc">
          OpenClaw already has real memory. OpenTrust doesn{"'"}t replace it — it makes it reviewable, traceable, and durable.
        </p>

        <div className="landing-vs">
          <div className="landing-vs__hero">
            <div className="landing-vs__panel landing-vs__panel--before">
              <div className="landing-vs__panel-eyebrow">OpenClaw today</div>
              <h3 className="landing-vs__panel-title">Memory exists</h3>
              <p className="landing-vs__panel-desc">Workspace Markdown is already the canonical authored memory source.</p>
              <div className="landing-vs__panel-features">
                <div className="landing-vs__feat landing-vs__feat--has"><Check size={14} /> MEMORY.md authored source</div>
                <div className="landing-vs__feat landing-vs__feat--has"><Check size={14} /> Daily notes in memory/</div>
                <div className="landing-vs__feat landing-vs__feat--has"><Check size={14} /> memory_search recall</div>
                <div className="landing-vs__feat landing-vs__feat--gap"><X size={14} /> No structured review</div>
                <div className="landing-vs__feat landing-vs__feat--gap"><X size={14} /> No timeline or calendar</div>
                <div className="landing-vs__feat landing-vs__feat--gap"><X size={14} /> No backup strategy UI</div>
              </div>
            </div>

            <div className="landing-vs__divider">
              <div className="landing-vs__divider-glow" />
              <div className="landing-vs__divider-badge">+</div>
            </div>

            <div className="landing-vs__panel landing-vs__panel--after">
              <div className="landing-vs__panel-eyebrow">With OpenTrust</div>
              <h3 className="landing-vs__panel-title">Memory becomes operational</h3>
              <p className="landing-vs__panel-desc">Same source, now with structure, review, provenance, and durability.</p>
              <div className="landing-vs__panel-features">
                <div className="landing-vs__feat landing-vs__feat--has"><Check size={14} /> Same Markdown truth, ingested</div>
                <div className="landing-vs__feat landing-vs__feat--has"><Check size={14} /> Review queue & approval</div>
                <div className="landing-vs__feat landing-vs__feat--has"><Check size={14} /> Provenance tracking</div>
                <div className="landing-vs__feat landing-vs__feat--has"><Check size={14} /> Timeline & calendar views</div>
                <div className="landing-vs__feat landing-vs__feat--has"><Check size={14} /> Backup-aware storage</div>
                <div className="landing-vs__feat landing-vs__feat--has"><Check size={14} /> Health & coverage monitoring</div>
              </div>
            </div>
          </div>

          <div className="landing-vs__details">
            <ComparisonRow
              icon={<ShieldCheck size={20} />}
              title="Source of truth preserved"
              before="MEMORY.md and daily notes already work. Agents read and write workspace memory files with memory_search recall."
              after="OpenTrust ingests those same files. No replacement, no fake abstraction — just operational structure on top of authored truth."
            />
            <ComparisonRow
              icon={<Layers3 size={20} />}
              title="Review & retention become first-class"
              before="Memory capture exists, but no dedicated review queue, retention lifecycle, or structured approval workflow."
              after="Every memory candidate gets review status, retention class, provenance links, and operator visibility."
            />
            <ComparisonRow
              icon={<Telescope size={20} />}
              title="Timelines & backups become visible"
              before="Memory truth exists in files, but backup strategy, timeline surfaces, and operational health are mostly implied."
              after="Calendar views, health monitoring, export flows, and backup-aware storage recommendations become first-class."
            />
            <ComparisonRow
              icon={<Sparkles size={20} />}
              title="Intelligent capture recommendations"
              before="Users can write summaries manually, but no built-in guidance about what deserves durable capture."
              after="Daily summary drafts, meaningful moment detection, and promotion suggestions based on actual activity."
            />
          </div>
        </div>
      </section>

      <hr className="landing-divider" />

      <section id="architecture" className="landing-section">
        <div className="landing-section__eyebrow">Architecture</div>
        <h2 className="landing-section__title">
          A visual current-vs-plugin architecture diagram
        </h2>
        <p className="landing-section__desc">
          OpenTrust should begin by respecting the memory system OpenClaw already uses today, then layer operational structure and user-facing capabilities on top.
        </p>

        <ArchitectureDiagram />
      </section>

      <hr className="landing-divider" />

      <section className="landing-section">
        <div className="landing-section__eyebrow">Storage Strategy</div>
        <h2 className="landing-section__title">
          Your memory, two layers deep
        </h2>
        <p className="landing-section__desc">
          Markdown stays yours and human-readable. OpenTrust adds structure, search, exports, and backups around it &mdash; never instead of it.
        </p>

        <StorageStrategySection />
      </section>

      <hr className="landing-divider" />

      <section id="how-it-works" className="landing-section">
        <div className="landing-section__eyebrow">How it Works</div>
        <h2 className="landing-section__title">
          From raw workspace files to structured memory ops
        </h2>
        <p className="landing-section__desc">
          Four steps. Start from what OpenClaw already stores today, then layer in structure, recommendations, and full plugin-grade operations.
        </p>

        <HowItWorksSection />
      </section>

      <hr className="landing-divider" />

      <section className="landing-section">
        <div className="landing-section__eyebrow">Recommendations</div>
        <h2 className="landing-section__title">
          Daily summaries and meaningful moments
        </h2>
        <p className="landing-section__desc">
          OpenTrust doesn't just store memories — it intelligently suggests what deserves durable capture, when to summarize your day, and when a moment looks historically meaningful.
        </p>

        <RecommendationMockSection />
      </section>

      <hr className="landing-divider" />

      <section className="landing-section">
        <div className="landing-section__eyebrow">FAQs</div>
        <FAQSection />
      </section>

      <hr className="landing-divider" />

      <section className="landing-section landing-cta-final landing-section--shader">
        <MeshGradientBg
          colors={["#000000", "#0a0000", "#080000", "#030000"]}
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
              <a href="https://github.com/OpenKnots/OpenTrust" target="_blank" rel="noopener noreferrer" className="footer-col__link">GitHub</a>
              <a href="https://x.com/OpenKnot" target="_blank" rel="noopener noreferrer" className="footer-col__link">Twitter</a>
              <a href="https://discord.gg/openknot" target="_blank" rel="noopener noreferrer" className="footer-col__link">Discord</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col__title">Quick Menu</div>
            <div className="footer-col__links">
              <Link href="/dashboard" className="footer-col__link">Dashboard</Link>
              <a href="#features" className="footer-col__link">Features</a>
              <a href="#architecture" className="footer-col__link">Architecture</a>
              <a href="#comparison" className="footer-col__link">Comparison</a>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col__title">Information</div>
            <div className="footer-col__links">
              <a href="https://docs.openclaw.ai/plugins" target="_blank" rel="noopener noreferrer" className="footer-col__link">Documentation</a>
              <a href="https://github.com/OpenKnots/OpenTrust#readme" target="_blank" rel="noopener noreferrer" className="footer-col__link">README</a>
              <a href="https://github.com/OpenKnots/OpenTrust/issues" target="_blank" rel="noopener noreferrer" className="footer-col__link">Support</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 OpenKnot. All rights reserved.</span>
          <span>Threaded by <a href="https://openknot.ai" style={{ color: "rgba(255,255,255,0.35)" }}>OpenKnot</a></span>
        </div>
      </footer>
    </div>
  );
}

function FeatureShowcase({ label, title, description, visual }: { label: string; title: string; description: string; visual: React.ReactNode }) {
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

function ComparisonRow({ icon, title, before, after }: { icon: React.ReactNode; title: string; before: string; after: string }) {
  return (
    <div className="landing-vs__row">
      <div className="landing-vs__row-header">
        <div className="landing-vs__row-icon">{icon}</div>
        <h4 className="landing-vs__row-title">{title}</h4>
      </div>
      <div className="landing-vs__row-cols">
        <div className="landing-vs__row-col landing-vs__row-col--before">
          <div className="landing-vs__row-label">Today</div>
          <p>{before}</p>
        </div>
        <div className="landing-vs__row-col landing-vs__row-col--after">
          <div className="landing-vs__row-label">With plugin</div>
          <p>{after}</p>
        </div>
      </div>
    </div>
  );
}

const HOW_STEPS = [
  {
    num: 1,
    title: "Read current memory",
    summary: "Import workspace files",
    icon: FileSearch,
    color: "blue" as const,
    desc: "Import MEMORY.md, memory/YYYY-MM-DD.md, and optional session-memory snapshots from the OpenClaw workspace.",
    details: [
      { icon: FileText, text: "MEMORY.md for curated long-term memory" },
      { icon: FileText, text: "memory/YYYY-MM-DD.md daily notes" },
      { icon: FileText, text: "Optional session-memory snapshots" },
    ],
  },
  {
    num: 2,
    title: "Structure it",
    summary: "Add provenance and review state",
    icon: Database,
    color: "purple" as const,
    desc: "Persist those authored notes into a richer store with review state, provenance, retention, and timeline semantics.",
    details: [
      { icon: ShieldCheck, text: "Review state tracks what's verified" },
      { icon: GitBranch, text: "Provenance links every entry to its source" },
      { icon: Layers3, text: "Timeline semantics for calendar views" },
    ],
  },
  {
    num: 3,
    title: "Recommend better capture",
    summary: "Surface what deserves keeping",
    icon: Sparkles,
    color: "amber" as const,
    desc: "Suggest daily summaries, project memory, meaningful moments, backup flows, and long-term promotion opportunities.",
    details: [
      { icon: Sparkles, text: "Daily summaries from raw notes" },
      { icon: HeartPulse, text: "Meaningful moments flagged automatically" },
      { icon: Shield, text: "Backup flow recommendations" },
    ],
  },
  {
    num: 4,
    title: "Operate it",
    summary: "Full plugin-grade memory ops",
    icon: Telescope,
    color: "green" as const,
    desc: "Expose plugin-grade search, calendar/timeline, health, exports, and future relationship-memory scaffolding.",
    details: [
      { icon: Search, text: "Semantic search across all memory" },
      { icon: HeartPulse, text: "Health dashboard and coverage gaps" },
      { icon: Users, text: "Relationship-memory scaffolding" },
    ],
  },
];

function HowItWorksSection() {
  const [activeStep, setActiveStep] = React.useState(0);
  const step = HOW_STEPS[activeStep];

  return (
    <div className="hiw-root">
      {/* Step rail */}
      <div className="hiw-rail">
        {HOW_STEPS.map((s, i) => (
          <button
            key={s.num}
            className={`hiw-step ${activeStep === i ? "hiw-step--active" : ""} hiw-step--${s.color}`}
            onClick={() => setActiveStep(i)}
            aria-pressed={activeStep === i}
          >
            <div className="hiw-step__connector">
              <div className={`hiw-step__dot ${activeStep === i ? "hiw-step__dot--active" : ""}`}>
                {s.num}
              </div>
              {i < HOW_STEPS.length - 1 && <div className="hiw-step__line" />}
            </div>
            <div className="hiw-step__text">
              <span className="hiw-step__title">{s.title}</span>
              <span className="hiw-step__summary">{s.summary}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Active step detail panel */}
      <div className={`hiw-panel hiw-panel--${step.color}`} key={activeStep}>
        <div className="hiw-panel__header">
          <div className={`hiw-panel__icon hiw-panel__icon--${step.color}`}>
            <step.icon size={24} />
          </div>
          <div>
            <div className="hiw-panel__eyebrow">Step {step.num} of 4</div>
            <h3 className="hiw-panel__title">{step.title}</h3>
          </div>
        </div>
        <p className="hiw-panel__desc">{step.desc}</p>
        <div className="hiw-panel__details">
          {step.details.map((d, i) => (
            <div className="hiw-panel__detail" key={i}>
              <d.icon size={16} />
              <span>{d.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TraceVisual() {
  return (
    <div className="visual-trace">
      <div className="visual-trace__item"><div className="visual-trace__dot" /><div className="visual-trace__label">MEMORY.md</div></div>
      <div className="visual-trace__item"><div className="visual-trace__dot" /><div className="visual-trace__label">memory/2026-03-22.md</div></div>
      <div className="visual-trace__item"><div className="visual-trace__dot" /><div className="visual-trace__label">memory/session-reset.md</div></div>
    </div>
  );
}

function MemoryVisual() {
  return (
    <div className="visual-memory">
      <div className="visual-memory__badge">3 pending review</div>
      <div className="visual-memory__entry">Approved: deployment timing shift</div>
      <div className="visual-memory__entry">Draft: meaningful milestone recap</div>
    </div>
  );
}

function RetrievalVisual() {
  return (
    <div className="visual-retrieval">
      <div className="visual-retrieval__bar"><div className="visual-retrieval__fill" style={{ width: "94%" }} /></div>
      <div className="visual-retrieval__label">Generate Daily Summary</div>
    </div>
  );
}

function HealthVisual() {
  return (
    <div className="visual-health">
      <div className="visual-health__status"><div className="visual-health__dot" /><span>Source memory synced</span></div>
      <div className="visual-health__metric">Backup strategy: dual-store active</div>
    </div>
  );
}

function TransformationPreviewCard() {
  return (
    <div className="transform-preview texture-diagonal">
      <div className="transform-preview__header transform-preview__header--compact">
        <div>
          <div className="transform-preview__eyebrow">Current → Plugin layer</div>
          <div className="transform-preview__title">From authored memory to operational memory</div>
        </div>
        <div className="transform-preview__pill">grounded in current OpenClaw</div>
      </div>

      <div className="transform-preview__rail">
        <div className="transform-preview__rail-stage">
          <div className="transform-preview__rail-label">Current source</div>
          <div className="transform-preview__rail-card">
            <div className="transform-preview__file-name">MEMORY.md</div>
            <div className="transform-preview__file-meta">curated long-term memory</div>
          </div>
          <div className="transform-preview__rail-card">
            <div className="transform-preview__file-name">memory/YYYY-MM-DD.md</div>
            <div className="transform-preview__file-meta">daily notes and short-term capture</div>
          </div>
        </div>

        <div className="transform-preview__rail-center">
          <div className="transform-preview__arrow-pill">ingest</div>
          <div className="transform-preview__arrow-line transform-preview__arrow-line--horizontal" />
          <div className="transform-preview__arrow-pill">review</div>
          <div className="transform-preview__arrow-line transform-preview__arrow-line--horizontal" />
          <div className="transform-preview__arrow-pill">operate</div>
        </div>

        <div className="transform-preview__rail-stage transform-preview__rail-stage--accent">
          <div className="transform-preview__rail-label">Plugin layer</div>
          <div className="transform-preview__memory-card">
            <div className="transform-preview__memory-top">
              <span className="transform-preview__badge transform-preview__badge--violet">approved</span>
              <span className="transform-preview__badge transform-preview__badge--sky">from daily note</span>
            </div>
            <div className="transform-preview__memory-title">Durable memory with context attached</div>
            <div className="transform-preview__memory-desc">Provenance, timeline placement, review state, backup readiness, and operator visibility.</div>
            <div className="transform-preview__memory-grid">
              <div className="transform-preview__mini">provenance</div>
              <div className="transform-preview__mini">timeline</div>
              <div className="transform-preview__mini">backups</div>
              <div className="transform-preview__mini">health</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div className="landing-architecture-grid">
      <div className="landing-arch-stage">
        <div className="landing-arch-stage__label">1. Authored memory</div>
        <div className="landing-arch-stage__title">Workspace Markdown</div>
        <div className="landing-arch-stage__list">
          <div className="landing-arch-node">MEMORY.md</div>
          <div className="landing-arch-node">memory/YYYY-MM-DD.md</div>
          <div className="landing-arch-node">session-memory snapshots</div>
        </div>
      </div>
      <div className="landing-arch-arrow">→</div>
      <div className="landing-arch-stage">
        <div className="landing-arch-stage__label">2. Search / import</div>
        <div className="landing-arch-stage__title">Current OpenClaw recall + OpenTrust ingest</div>
        <div className="landing-arch-stage__list">
          <div className="landing-arch-node">memory_search index</div>
          <div className="landing-arch-node">source parsing</div>
          <div className="landing-arch-node">provenance capture</div>
        </div>
      </div>
      <div className="landing-arch-arrow">→</div>
      <div className="landing-arch-stage landing-arch-stage--highlight">
        <div className="landing-arch-stage__label">3. Plugin memory ops</div>
        <div className="landing-arch-stage__title">Operational memory layer</div>
        <div className="landing-arch-stage__list">
          <div className="landing-arch-node">review queue</div>
          <div className="landing-arch-node">timeline + calendar</div>
          <div className="landing-arch-node">health + backups + recommendations</div>
        </div>
      </div>
    </div>
  );
}

function StorageStrategySection() {
  const [expandedCard, setExpandedCard] = React.useState<number>(0);

  const toggle = (idx: number) =>
    setExpandedCard(prev => (prev === idx ? -1 : idx));

  return (
    <div className="ss-root">
      {/* Visual layer diagram */}
      <div className="ss-layers">
        <div className="ss-layer ss-layer--md">
          <FileText size={20} />
          <div className="ss-layer__text">
            <span className="ss-layer__label">Your Markdown</span>
            <span className="ss-layer__sub">MEMORY.md &middot; daily notes &middot; project docs</span>
          </div>
          <span className="ss-layer__badge ss-layer__badge--you">You own this</span>
        </div>
        <div className="ss-layer-connector">
          <div className="ss-layer-connector__line" />
          <span className="ss-layer-connector__label">reads &amp; enriches</span>
          <div className="ss-layer-connector__line" />
        </div>
        <div className="ss-layer ss-layer--ot">
          <Database size={20} />
          <div className="ss-layer__text">
            <span className="ss-layer__label">OpenTrust structured store</span>
            <span className="ss-layer__sub">SQLite &middot; provenance &middot; review state &middot; timeline</span>
          </div>
          <span className="ss-layer__badge ss-layer__badge--auto">Automatic</span>
        </div>
        <div className="ss-layer-connector">
          <div className="ss-layer-connector__line" />
          <span className="ss-layer-connector__label">exports &amp; backs up</span>
          <div className="ss-layer-connector__line" />
        </div>
        <div className="ss-layer ss-layer--export">
          <FolderArchive size={20} />
          <div className="ss-layer__text">
            <span className="ss-layer__label">Durable exports</span>
            <span className="ss-layer__sub">Git archive &middot; cloud sync &middot; ZIP bundles</span>
          </div>
          <span className="ss-layer__badge ss-layer__badge--safe">Offline-safe</span>
        </div>
      </div>

      {/* Expandable strategy cards */}
      <div className="ss-cards">
        <button
          className={`ss-card ${expandedCard === 0 ? "ss-card--open" : ""} ss-card--recommended`}
          onClick={() => toggle(0)}
          aria-expanded={expandedCard === 0}
        >
          <div className="ss-card__head">
            <div className="ss-card__icon ss-card__icon--blue">
              <Layers3 size={20} />
            </div>
            <div className="ss-card__titles">
              <span className="ss-card__eyebrow">Recommended default</span>
              <span className="ss-card__title">Dual-store strategy</span>
            </div>
            <span className="ss-card__rec-pill">Recommended</span>
            <ChevronDown size={18} className="ss-card__chevron" />
          </div>
          {expandedCard === 0 && (
            <div className="ss-card__body">
              <p className="ss-card__desc">
                Markdown stays as the human-readable source of truth. OpenTrust adds structured operational views, review, export, and historical recall on top.
              </p>
              <div className="ss-card__details">
                <div className="ss-detail">
                  <FileText size={16} />
                  <span>Workspace Markdown remains your authored source</span>
                </div>
                <div className="ss-detail">
                  <Database size={16} />
                  <span>SQLite stores structured operational state</span>
                </div>
                <div className="ss-detail">
                  <FolderArchive size={16} />
                  <span>Weekly export bundles protect the structured layer</span>
                </div>
              </div>
            </div>
          )}
        </button>

        <button
          className={`ss-card ${expandedCard === 1 ? "ss-card--open" : ""}`}
          onClick={() => toggle(1)}
          aria-expanded={expandedCard === 1}
        >
          <div className="ss-card__head">
            <div className="ss-card__icon ss-card__icon--green">
              <Shield size={20} />
            </div>
            <div className="ss-card__titles">
              <span className="ss-card__eyebrow">Backup options</span>
              <span className="ss-card__title">Layered durability</span>
            </div>
            <ChevronDown size={18} className="ss-card__chevron" />
          </div>
          {expandedCard === 1 && (
            <div className="ss-card__body">
              <p className="ss-card__desc">
                Different users need different backup depth. OpenTrust recommends practical presets instead of pretending one storage style fits everyone.
              </p>
              <div className="ss-card__details">
                <div className="ss-detail">
                  <GitBranch size={16} />
                  <span>Private git archive for diffable Markdown history</span>
                </div>
                <div className="ss-detail">
                  <Cloud size={16} />
                  <span>Encrypted cloud sync for off-machine backup</span>
                </div>
                <div className="ss-detail">
                  <FolderArchive size={16} />
                  <span>Periodic JSONL / SQLite / ZIP export bundles</span>
                </div>
              </div>
            </div>
          )}
        </button>

        <button
          className={`ss-card ${expandedCard === 2 ? "ss-card--open" : ""}`}
          onClick={() => toggle(2)}
          aria-expanded={expandedCard === 2}
        >
          <div className="ss-card__head">
            <div className="ss-card__icon ss-card__icon--amber">
              <BookOpen size={20} />
            </div>
            <div className="ss-card__titles">
              <span className="ss-card__eyebrow">What to keep</span>
              <span className="ss-card__title">Store more than work notes</span>
            </div>
            <ChevronDown size={18} className="ss-card__chevron" />
          </div>
          {expandedCard === 2 && (
            <div className="ss-card__body">
              <p className="ss-card__desc">
                The strongest memory system preserves work continuity and life continuity together.
              </p>
              <div className="ss-card__details">
                <div className="ss-detail">
                  <Sparkles size={16} />
                  <span>Daily summaries</span>
                </div>
                <div className="ss-detail">
                  <Workflow size={16} />
                  <span>Project memory</span>
                </div>
                <div className="ss-detail">
                  <HeartPulse size={16} />
                  <span>Meaningful moments and milestones</span>
                </div>
                <div className="ss-detail">
                  <Users size={16} />
                  <span>Relationship / contact memory</span>
                </div>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

function RecommendationMockSection() {
  return (
    <div className="landing-rec-grid">
      <div className="landing-rec-shell">
        <div className="landing-rec-shell__header">
          <div>
            <div className="landing-rec-shell__eyebrow">Recommendation center</div>
            <div className="landing-rec-shell__title">What should be remembered today?</div>
          </div>
          <div className="landing-rec-shell__badge">dynamic suggestions</div>
        </div>
        <div className="landing-rec-list">
          <div className="landing-rec-item landing-rec-item--primary">
            <div className="landing-rec-item__icon"><Workflow size={16} /></div>
            <div className="landing-rec-item__body">
              <div className="landing-rec-item__title">Generate today’s daily summary</div>
              <div className="landing-rec-item__desc">14 traces, 3 promoted memories, and 2 unresolved investigations suggest enough activity for a durable daily recap.</div>
            </div>
            <div className="landing-rec-item__action">Draft summary</div>
          </div>
          <div className="landing-rec-item">
            <div className="landing-rec-item__icon"><Sparkles size={16} /></div>
            <div className="landing-rec-item__body">
              <div className="landing-rec-item__title">This looks like a meaningful moment</div>
              <div className="landing-rec-item__desc">A milestone-sized event appears across multiple notes. Save it to long-term memory or life log?</div>
            </div>
            <div className="landing-rec-item__action">Promote moment</div>
          </div>
          <div className="landing-rec-item">
            <div className="landing-rec-item__icon"><HeartPulse size={16} /></div>
            <div className="landing-rec-item__body">
              <div className="landing-rec-item__title">No backup snapshot this week</div>
              <div className="landing-rec-item__desc">Recommend exporting a weekly bundle so authored Markdown and structured memory stay recoverable together.</div>
            </div>
            <div className="landing-rec-item__action">Create export</div>
          </div>
        </div>
      </div>
      <div className="landing-rec-side">
        <div className="landing-rec-side__card">
          <div className="landing-rec-side__label">Meaningful memory types</div>
          <div className="landing-rec-side__chips">
            <span>daily summary</span>
            <span>project update</span>
            <span>important person</span>
            <span>milestone</span>
            <span>preference</span>
            <span>follow-up</span>
          </div>
        </div>
        <div className="landing-rec-side__card">
          <div className="landing-rec-side__label">Future CRM direction</div>
          <p>Docs-only for now: people, interactions, relationship memory, and follow-up queues with explicit privacy guardrails.</p>
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <div className="faq-grid">
      <div>
        <h2 className="faq-left__title">Got questions? We’ve got answers.</h2>
        <p className="faq-left__subtitle">
          Still have questions? Contact us at support@openknot.ai
        </p>
        <Link href="mailto:support@openknot.ai" className="landing-btn landing-btn--primary">
          Contact Us
        </Link>
      </div>

      <div className="faq-accordion">
        <FAQItem number="01" question="Where is memory stored in OpenClaw today?" answer="Today, OpenClaw memory is primarily stored as Markdown in the workspace: MEMORY.md for curated long-term memory and memory/YYYY-MM-DD.md for daily notes. Optional hook-generated memory snapshots also land under memory/. That workspace content is the right initial source for OpenTrust ingestion." />
        <FAQItem number="02" question="Does OpenClaw already have memory without OpenTrust?" answer="Yes. OpenClaw already has a real memory model today. Agents read and write workspace memory files, and memory_search indexes those Markdown files for semantic recall. OpenTrust should extend that system, not pretend it doesn’t exist." />
        <FAQItem number="03" question="What does the OpenTrust plugin add?" answer="OpenTrust adds structured storage, provenance, review workflows, timeline/calendar views, health surfaces, export and backup strategy, and richer operator tooling on top of the existing authored memory source." />
        <FAQItem number="04" question="What should users store besides daily notes?" answer="The strongest recommendations are daily summaries, long-term profile memory, project memory, meaningful life moments, and relationship/contact memory. These categories help preserve both operational continuity and personal continuity." />
        <FAQItem number="05" question="How should users back up their memory?" answer="Recommended options include a private git-backed archive, encrypted cloud folder sync, periodic export bundles, or a dual-store strategy where Markdown remains human-readable truth and OpenTrust SQLite provides structured operational views." />
        <FAQItem number="06" question="Is CRM support built yet?" answer="Not in runtime yet. For now, CRM-style relationship memory is docs-only scaffolding so the product can define people, interactions, follow-ups, and guardrails before implementing anything sensitive." />
      </div>
    </div>
  );
}

function FAQItem({ number, question, answer }: { number: string; question: string; answer: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
      <button className="faq-item__trigger" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
        <span className="faq-item__number">{number}</span>
        <span className="faq-item__question">{question}</span>
        <X size={20} className="faq-item__icon" />
      </button>
      {isOpen && <div className="faq-item__answer">{answer}</div>}
    </div>
  );
}
