import { notFound, redirect } from "next/navigation";
import { getTraceDetail } from "@/lib/opentrust/trace-details";
import { memoryPromote } from "@/lib/opentrust/memory-api";
import { PageHeader } from "@/components/ui/page-header";

export const dynamic = "force-dynamic";

export default async function PromoteTraceMemoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ create?: string }>;
}) {
  const { id } = await params;
  const traceId = decodeURIComponent(id);
  const trace = getTraceDetail(traceId);
  const query = (await searchParams) ?? {};

  if (!trace) notFound();

  if (query.create === "1") {
    memoryPromote({
      kind: "memoryEntry",
      title: trace.title ?? `Trace ${trace.id}`,
      body: [trace.summary ?? "No trace summary available.", ...trace.events.slice(0, 5).map((event) => event.text_preview ?? event.kind)].join("\n\n"),
      summary: trace.summary ?? undefined,
      originRefs: [{ type: "trace", id: trace.id }],
      retentionClass: "working",
      tags: ["trace", trace.status],
      review: { status: "draft" },
      author: { type: "system", id: "trace-promote-route" },
      confidence: {
        score: 0.6,
        reason: "Promoted directly from a trace detail surface with linked evidence.",
      },
      uncertaintySummary: "This memory entry was auto-seeded from trace detail and should be reviewed by an operator.",
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
          { label: "Traces", href: "/" },
          { label: trace.title ?? trace.id, href: `/traces/${encodeURIComponent(trace.id)}` },
          { label: "Promote" },
        ]}
      />

      <div className="section">
        <div className="section__header">
          <span className="section__title">Ready to promote</span>
          <span className="section__description">This will create a draft memory entry with this trace as its origin reference.</span>
        </div>
        <div className="artifact-card">
          <div className="artifact-card__title">{trace.title ?? trace.id}</div>
          <div className="list-item__subtitle">{trace.summary ?? "No summary available."}</div>
          <div style={{ marginTop: 16 }}>
            <a className="btn btn--primary" href={`?create=1`}>Create draft memory entry</a>
          </div>
        </div>
      </div>
    </>
  );
}
