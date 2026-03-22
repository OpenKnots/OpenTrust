import { notFound, redirect } from "next/navigation";
import { getTraceDetail } from "@/lib/opentrust/trace-details";
import { memoryPromote } from "@/lib/opentrust/memory-api";
import { PageHeader } from "@/components/ui/page-header";

export const dynamic = "force-dynamic";

export default async function PromoteTraceMemoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const traceId = decodeURIComponent(id);
  const trace = getTraceDetail(traceId);

  if (!trace) notFound();

  const detail = trace;

  async function createDraftAction() {
    "use server";

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
          { label: detail.title ?? detail.id, href: `/traces/${encodeURIComponent(detail.id)}` },
          { label: "Promote" },
        ]}
      />

      <div className="section">
        <div className="section__header">
          <span className="section__title">Ready to promote</span>
          <span className="section__description">This will create a draft memory entry with this trace as its origin reference.</span>
        </div>
        <div className="artifact-card">
          <div className="artifact-card__title">{detail.title ?? detail.id}</div>
          <div className="list-item__subtitle">{detail.summary ?? "No summary available."}</div>
          <div style={{ marginTop: 16 }}>
            <form action={createDraftAction}>
              <button className="btn btn--primary" type="submit">Create draft memory entry</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
