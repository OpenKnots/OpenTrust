import Link from "next/link";
import { getRecentArtifacts } from "@/lib/opentrust/artifacts";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoArtifacts } from "@/lib/opentrust/demo-data";
import { formatRelativeTime, truncatePath } from "@/lib/opentrust/format";
import { CardGrid } from "@/components/ui/card-grid";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardPanel,
} from "@/components/animate-ui/components/base/preview-card";

export const dynamic = "force-dynamic";

export default async function ArtifactsPage({
  searchParams,
}: {
  searchParams?: Promise<{ kind?: string; sort?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const kind = typeof params.kind === "string" ? params.kind : undefined;
  const sort = !kind && params.sort === "kind" ? "kind" : "newest";
  const showSortOptions = !kind;
  const demo = await isDemoMode();
  const allArtifacts = demo ? getDemoArtifacts() : getRecentArtifacts(200, { kind, sort });
  const artifacts = demo && kind ? allArtifacts.filter((a) => a.kind === kind) : allArtifacts;
  const kinds = ["url", "doc", "repo", "note"];

  return (
    <>
      <PageHeader
        title="Artifacts"
        subtitle="URLs, docs, repos, and references extracted from imported evidence."
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Artifacts" },
        ]}
      />

      <div className="filter-bar">
        <Link href="/artifacts" className={`filter-chip${!kind ? " filter-chip--active" : ""}`}>All</Link>
        {kinds.map((value) => (
          <Link
            key={value}
            href={`/artifacts?kind=${value}`}
            className={`filter-chip${kind === value ? " filter-chip--active" : ""}`}
          >
            {value}
          </Link>
        ))}
        {showSortOptions ? (
          <>
            <span className="filter-bar__divider" />
            <Link
              href="/artifacts?sort=newest"
              className={`filter-chip${sort === "newest" ? " filter-chip--active" : ""}`}
            >
              Newest
            </Link>
            <Link
              href="/artifacts?sort=kind"
              className={`filter-chip${sort === "kind" ? " filter-chip--active" : ""}`}
            >
              By kind
            </Link>
          </>
        ) : null}
      </div>

      {artifacts.length > 0 ? (
        sort === "kind" ? (
          (() => {
            const grouped = new Map<string, typeof artifacts>();
            for (const a of artifacts) {
              const list = grouped.get(a.kind);
              if (list) list.push(a);
              else grouped.set(a.kind, [a]);
            }
            return Array.from(grouped.entries()).map(([kindKey, items]) => (
              <details key={kindKey} className="expandable" style={{ marginBottom: 12 }}>
                <summary>
                  {kindKey}
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 400, marginLeft: "auto" }}>
                    {items.length} artifact{items.length !== 1 ? "s" : ""}
                  </span>
                </summary>
                <div className="expandable__content">
                  <CardGrid tone="accent" storageKey={`artifacts-grouped-${kindKey}`}>
                    {items.map((artifact) => (
                      <PreviewCard key={artifact.id}>
                        <PreviewCardTrigger
                          render={
                            <div className="artifact-card">
                              <div className="artifact-card__kind">
                                <Pill label={artifact.kind} tone="neutral" />
                                <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginLeft: 8 }}>
                                  {formatRelativeTime(artifact.created_at)}
                                </span>
                              </div>
                              <div className="artifact-card__title">{artifact.title ?? artifact.id}</div>
                              <div className="artifact-card__uri">{truncatePath(artifact.uri)}</div>
                            </div>
                          }
                        />
                        <PreviewCardPanel side="bottom" sideOffset={4} align="start">
                          <div className="preview-card__title">{artifact.title ?? artifact.id}</div>
                          <div className="preview-card__uri">{artifact.uri}</div>
                          <div className="preview-card__divider" />
                          <div className="preview-card__meta">
                            <Pill label={artifact.kind} tone="neutral" />
                            <span>{formatRelativeTime(artifact.created_at)}</span>
                          </div>
                        </PreviewCardPanel>
                      </PreviewCard>
                    ))}
                  </CardGrid>
                </div>
              </details>
            ));
          })()
        ) : (
          <CardGrid tone="neutral" storageKey="artifacts-flat">
            {artifacts.map((artifact) => (
              <PreviewCard key={artifact.id}>
                <PreviewCardTrigger
                  render={
                    <div className="artifact-card">
                      <div className="artifact-card__kind">
                        <Pill label={artifact.kind} tone="neutral" />
                        <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginLeft: 8 }}>
                          {formatRelativeTime(artifact.created_at)}
                        </span>
                      </div>
                      <div className="artifact-card__title">{artifact.title ?? artifact.id}</div>
                      <div className="artifact-card__uri">{artifact.uri}</div>
                    </div>
                  }
                />
                <PreviewCardPanel side="bottom" sideOffset={4} align="start">
                  <div className="preview-card__title">{artifact.title ?? artifact.id}</div>
                  <div className="preview-card__uri">{artifact.uri}</div>
                  <div className="preview-card__divider" />
                  <div className="preview-card__meta">
                    <Pill label={artifact.kind} tone="neutral" />
                    <span>{formatRelativeTime(artifact.created_at)}</span>
                  </div>
                </PreviewCardPanel>
              </PreviewCard>
            ))}
          </CardGrid>
        )
      ) : (
        <EmptyState message="No artifacts match the current filter." />
      )}
    </>
  );
}
