import Link from "next/link";
import { IconCalendarMonth, IconChevronLeft, IconChevronRight, IconClock, IconSparkles } from "@tabler/icons-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calendarDays, dateKey, getCalendarEvents, type CalendarView } from "@/lib/opentrust/calendar";

export const dynamic = "force-dynamic";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string; anchor?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const view: CalendarView = params.view === "month" ? "month" : "week";
  const anchor = params.anchor ? new Date(params.anchor) : new Date();
  const safeAnchor = Number.isNaN(anchor.getTime()) ? new Date() : anchor;
  const days = calendarDays(safeAnchor, view);
  const events = getCalendarEvents(safeAnchor, view);
  const grouped = new Map<string, typeof events>();
  for (const event of events) {
    const list = grouped.get(event.date);
    if (list) list.push(event);
    else grouped.set(event.date, [event]);
  }
  const prevAnchor = addDays(safeAnchor, view === "week" ? -7 : -30);
  const nextAnchor = addDays(safeAnchor, view === "week" ? 7 : 30);

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle="A claw-dash-style operational calendar for recurring schedule context and memory activity."
        breadcrumbs={[{ label: "Overview", href: "/dashboard" }, { label: "Calendar" }]}
        actions={
          <div className="flex gap-2">
            <Button asChild size="sm" variant={view === "week" ? "default" : "outline"}>
              <Link href={`/calendar?view=week&anchor=${dateKey(safeAnchor)}`}>Week</Link>
            </Button>
            <Button asChild size="sm" variant={view === "month" ? "default" : "outline"}>
              <Link href={`/calendar?view=month&anchor=${dateKey(safeAnchor)}`}>Month</Link>
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>{safeAnchor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</CardTitle>
              <CardDescription>
                Schedule events are recurring reference items; memory events are real promoted entries.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/calendar?view=${view}&anchor=${dateKey(prevAnchor)}`}><IconChevronLeft /> Prev</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/calendar?view=${view}&anchor=${dateKey(nextAnchor)}`}>Next <IconChevronRight /></Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-7">
            {days.map((day) => {
              const key = dateKey(day);
              const dayEvents = grouped.get(key) ?? [];
              const isToday = key === dateKey(new Date());
              return (
                <div key={key} className="rounded-xl border bg-background/60 p-3 min-h-40">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        {day.toLocaleDateString(undefined, { weekday: "short" })}
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        {day.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </div>
                    </div>
                    {isToday ? <Badge variant="outline">Today</Badge> : null}
                  </div>

                  <div className="space-y-2">
                    {dayEvents.length > 0 ? dayEvents.map((event) => (
                      <div key={event.id} className="rounded-lg border px-2.5 py-2 text-xs bg-muted/40">
                        <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                          {event.kind === "schedule" ? <IconClock className="size-3" /> : <IconSparkles className="size-3" />}
                          <span>{event.kind === "schedule" ? (event.time ?? "Scheduled") : "Promoted memory"}</span>
                        </div>
                        <div className="font-medium text-foreground">
                          {event.href ? <Link href={event.href} className="hover:underline">{event.title}</Link> : event.title}
                        </div>
                        {event.detail ? <div className="mt-1 text-muted-foreground">{event.detail}</div> : null}
                      </div>
                    )) : (
                      <div className="rounded-lg border border-dashed px-2.5 py-3 text-xs text-muted-foreground">
                        No items for this day.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><IconCalendarMonth className="size-4" /> Memory promotion path</CardTitle>
          <CardDescription>
            To populate this calendar with real memory activity, use the existing promote routes from traces, artifacts, workflows, or investigations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline"><Link href="/traces">Open traces</Link></Button>
          <Button asChild size="sm" variant="outline"><Link href="/artifacts/promote">Promote artifacts</Link></Button>
          <Button asChild size="sm" variant="outline"><Link href="/investigations/promote">Promote investigations</Link></Button>
          <Button asChild size="sm" variant="outline"><Link href="/memory">View memory</Link></Button>
        </CardContent>
      </Card>
    </>
  );
}
