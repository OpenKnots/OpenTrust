import Link from "next/link";
import { getRecentArtifacts } from "@/lib/opentrust/artifacts";

export const dynamic = "force-dynamic";

export default function ArtifactsPage() {
  const artifacts = getRecentArtifacts(200);

  return (
    <main className="shell shell--detail">
      <div className="content">
        <section className="card hero">
          <div className="hero__badge">Artifact explorer</div>
          <h2>Browse the concrete things your traces and workflows reference.</h2>
          <p className="hero__lede">
            OpenTrust’s artifact registry currently captures inferred URLs, docs, files, and repo references from imported local evidence.
          </p>
          <div className="detail-actions">
            <Link href="/" className="search-form__button">Back to field manual</Link>
          </div>
        </section>

        <section className="grid grid--two">
          {artifacts.length > 0 ? artifacts.map((artifact) => (
            <article key={artifact.id} className="card card--soft">
              <div className="meta-row">
                <span className="pill pill--outline">{artifact.kind}</span>
                <span className="muted">{artifact.created_at}</span>
              </div>
              <h3>{artifact.title ?? artifact.id}</h3>
              <p>{artifact.uri}</p>
            </article>
          )) : <div className="search-empty">No artifacts have been indexed yet.</div>}
        </section>
      </div>
    </main>
  );
}
