import Link from "next/link";
import { ensureBootstrapped } from "@/lib/opentrust/bootstrap";
import { getSavedInvestigations } from "@/lib/opentrust/investigations";

export const dynamic = "force-dynamic";

export default function InvestigationsPage() {
  ensureBootstrapped();
  const investigations = getSavedInvestigations();

  return (
    <main className="shell shell--detail">
      <div className="content">
        <section className="card hero">
          <div className="hero__badge">Saved investigations</div>
          <h2>Reusable SQL investigations for common operator questions.</h2>
          <p className="hero__lede">
            These are local-first investigation presets meant to speed up incident review, workflow debugging, and evidence-driven tracing.
          </p>
          <div className="detail-actions">
            <Link href="/" className="search-form__button">Back to field manual</Link>
          </div>
        </section>

        <section className="stack">
          {investigations.map((investigation) => (
            <article key={investigation.id} className="card card--soft">
              <div className="meta-row">
                <span className="pill pill--outline">saved</span>
                <span className="muted">{investigation.id}</span>
              </div>
              <h3>{investigation.title}</h3>
              <p>{investigation.description ?? "No description."}</p>
              <pre>{investigation.sql_text}</pre>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
