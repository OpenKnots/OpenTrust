import { notFound, redirect } from "next/navigation";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getTraceDetail } from "@/lib/opentrust/trace-details";
import { memoryPromote } from "@/lib/opentrust/memory-api";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { PromoteButton } from "@/components/promote-button";
import { PiiSafe } from "@/components/pii-safe";
import { MarkdownPreview } from "@/components/markdown-preview";

export const dynamic = "force-dynamic";

export default async function PromoteTraceMemoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ create?: string }>;
}) {
  if (await isDemoMode()) {
    return (
      <>
        <PageHeader title="Promote trace" subtitle="Promotion is not available in demo mode." breadcrumbs={[{ label: "Traces", href: "/traces" }, { label: "Demo" }]} />
        <EmptyState message="Switch off demo mode to promote traces to memory." />
      </>
    );
  }

  const { id } = await params;
  const query = (await searchParams) ?? {};
  const traceId = decodeURIComponent(id);
  const trace = getTraceDetail(traceId);

  if (!trace) notFound();

  const detail = trace;

  if (query.create === "1") {
    memoryPromote({
      kind: "memoryEntry",
      title: detail.title ?? `Trace ${detail.id}`,
      body: [detail.summary ?? "No trace summary available.", ...detail.events.slice(0, 5).map((event) => event.text_preview ?? event.kind)].join("\n\n"),
      summary: detail.summary ?? undefined,
      originRefs: [{ type: "trace", id: detail.id }],
      retentionClass: "working",
      tags: ["trace", detail.status],
      review: { status: "draft" },
      author: { type: "system", id: "trace-promote-route" },
      confidence: {
        score: 0.6,
        reason: "Promoted directly from a trace detail surface with linked evidence.",
      },
      uncertaintySummary: "This memory entry was promoted from trace detail and still requires operator review.",
    });
    redirect("/memory/review");
  }

  return (
    <>
      <PageHeader
        title="Promote trace to memory"
        subtitle="Create a draft curated memory entry from this trace and send it to the review queue."
        breadcrumbs={[
          { label: "Overview", href: "/" },
          { label: "Traces", href: "/traces" },
          { label: <PiiSafe>{detail.title ?? detail.id}</PiiSafe>, href: `/traces/${encodeURIComponent(detail.id)}` },
          { label: "Promote" },
        ]}
      />

      <div className="section">
        <div className="section__header">
          <span className="section__title">Ready to promote</span>
          <span className="section__description">This will create a draft memory entry with this trace as its origin reference.</span>
        </div>
        <div className="artifact-card">
          <div className="artifact-card__title"><PiiSafe>{detail.title ?? detail.id}</PiiSafe></div>
          <div className="list-item__subtitle"><MarkdownPreview content={detail.summary ?? "No summary available."} /></div>
          <div style={{ marginTop: 16 }}>
            <PromoteButton
              href={`/traces/${encodeURIComponent(detail.id)}/promote?create=1`}
              itemTitle={detail.title ?? detail.id}
              label="Create draft memory entry"
            />
          </div>
        </div>
      </div>
    </>
  );
}
