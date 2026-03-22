import Link from "next/link";
import { getRecentArtifacts } from "@/lib/opentrust/artifacts";
import { groupArtifactsByPath } from "@/lib/opentrust/artifact-groups";
import { formatRelativeTime, truncatePath } from "@/lib/opentrust/format";
import { CardGrid } from "@/components/ui/card-grid";
import { PageHeader } from "@/components/ui/page-header";
import { Pill } from "@/components/ui/pill";
import { EmptyState } from "@/components/ui/empty-state";
import { PiiSafe } from "@/components/pii-safe";
import { ArtifactLink } from "@/components/artifact-link";

export const dynamic = "force-dynamic";

function ArtifactCard({
  artifact,
}: {
  artifact: ReturnType<typeof getRecentArtifacts>[number];
}) {
  return (
    <div className="artifact-card">
      <div className="artifact-card__kind">
        <Pill label={artifact.kind} tone="neutral" />
        <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginLeft: 8 }}>
          {formatRelativeTime(artifact.created_at)}
        </span>
      </div>
      <div className="artifact-card__title"><PiiSafe>{artifact.title ?? artifact.id}</PiiSafe></div>
      <ArtifactLink href={artifact.uri} className="artifact-card__uri">
        {truncatePath(artifact.uri)}
      </ArtifactLink>
    </div>
  );
}

export default async function ArtifactsPage({
  searchParams,
}: {
  searchParams?: Promise<{ kind?: string; sort?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const kind = typeof params.kind === "string" ? params.kind : undefined;
  const sort = !kind && params.sort === "kind" ? "kind" : params.sort === "path" ? "path" : "newest";
  const showSortOptions = !kind;
  const artifacts = getRecentArtifacts(200, { kind, sort: sort === "kind" ? "kind" : "newest" });
  const groupedByPath = groupArtifactsByPath(artifacts);
  const kinds = ["url", "doc", "repo", "note"];

  return (
    <>
      <PageHeader
        title="Artifacts"
        subtitle="URLs, docs, repos, code paths, images, and other references extracted from imported evidence."
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
            <Link
              href="/artifacts?sort=path"
              className={`filter-chip${sort === "path" ? " filter-chip--active" : ""}`}
            >
              Smart groups
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
                      <ArtifactCard key={artifact.id} artifact={artifact} />
                    ))}
                  </CardGrid>
                </div>
              </details>
            ));
          })()
        ) : sort === "path" ? (
          groupedByPath.map((group) => (
            <details key={group.key} className="expandable" style={{ marginBottom: 12 }} open>
              <summary>
                <span>{group.label}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 400, marginLeft: 10 }}>
                  {group.description}
                </span>
                <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", fontWeight: 400, marginLeft: "auto" }}>
                  {group.items.length} artifact{group.items.length !== 1 ? "s" : ""}
                </span>
              </summary>
              <div className="expandable__content">
                <CardGrid tone="accent" storageKey={`artifacts-path-${group.key}`}>
                  {group.items.map((artifact) => (
                    <ArtifactCard key={artifact.id} artifact={artifact} />
                  ))}
                </CardGrid>
              </div>
            </details>
          ))
        ) : (
          <CardGrid tone="neutral" storageKey="artifacts-flat">
            {artifacts.map((artifact) => (
              <ArtifactCard key={artifact.id} artifact={artifact} />
            ))}
          </CardGrid>
        )
      ) : (
        <EmptyState message="No artifacts match the current filter." />
      )}
    </>
  );
}
