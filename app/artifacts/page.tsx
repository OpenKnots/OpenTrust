import Link from "next/link";
import { ArrowLeft, Layers3, Sparkles } from "lucide-react";
import { getRecentArtifacts } from "@/lib/opentrust/artifacts";

export const dynamic = "force-dynamic";

export default function ArtifactsPage() {
  const artifacts = getRecentArtifacts(200);

  return (
    <main className="dashboard-shell">
      <div className="dashboard-bg" />
      <div className="dashboard-container">
        <section className="status-strip card">
          <StatusStripItem label="artifacts" value={String(artifacts.length)} tone="accent" />
          <StatusStripItem label="mode" value="registry" tone="neutral" />
          <StatusStripItem label="source" value="real data" tone="success" />
          <StatusStripItem label="view" value="explorer" tone="neutral" />
        </section>

        <section className="detail-hero card">
          <div className="hero__badge">Artifact explorer / registry</div>
          <div className="detail-hero__top">
            <div>
              <h1>Browse the concrete things your traces and workflows reference.</h1>
              <p>
                URLs, docs, repos, and file-like references extracted from real imported evidence and surfaced as a local-first registry.
              </p>
            </div>
            <div className="detail-actions">
              <Link href="/" className="action-link"><ArrowLeft size={16} /><span>Back to dashboard</span></Link>
              <Link href="/investigations" className="action-link"><Sparkles size={16} /><span>Investigations</span></Link>
            </div>
          </div>
        </section>

        <section className="dash-panel card">
          <header className="dash-panel__header">
            <div className="section-header__title">
              <span className="section-header__icon"><Layers3 size={18} /></span>
              <div>
                <h2>Artifact stream</h2>
                <p>Newest indexed artifacts across traces and workflows.</p>
              </div>
            </div>
          </header>
          <div className="bento-grid">
            {artifacts.length > 0 ? artifacts.map((artifact) => (
              <article key={artifact.id} className="dash-panel card panel-span-4 compact-panel">
                <div className="entity-row__meta">
                  <StatusPill label={artifact.kind} tone="neutral" />
                  <span className="muted">{artifact.created_at}</span>
                </div>
                <div className="entity-row__content">
                  <strong>{artifact.title ?? artifact.id}</strong>
                  <p>{artifact.uri}</p>
                </div>
              </article>
            )) : <div className="search-empty">No artifacts have been indexed yet.</div>}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "accent" | "neutral" | "danger" | "success" }) {
  return <span className={`pill pill--${tone}`}>{label}</span>;
}

function StatusStripItem({ label, value, tone }: { label: string; value: string; tone: "accent" | "neutral" | "danger" | "success" }) {
  return (
    <div className="status-strip__item">
      <span>{label}</span>
      <div className="status-strip__value"><StatusPill label={value} tone={tone} /></div>
    </div>
  );
}
