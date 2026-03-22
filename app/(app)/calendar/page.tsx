import Link from "next/link";
import {
  IconCalendarMonth,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconList,
  IconPlayerPlay,
  IconSparkles,
} from "@tabler/icons-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isDemoMode } from "@/lib/opentrust/demo";
import { getDemoCronCalendarEvents } from "@/lib/opentrust/demo-data";
import {
  appendWorkflowEvents,
  calendarDays,
  dateKey,
  getCalendarEvents,
  type CalendarEventKind,
  type CalendarView,
} from "@/lib/opentrust/calendar";

export const dynamic = "force-dynamic";

type DisplayMode = "grid" | "agenda";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function eventClasses(kind: CalendarEventKind) {
  switch (kind) {
    case "schedule": return "border-sky-500/20 bg-sky-500/10";
    case "memory": return "border-violet-500/20 bg-violet-500/10";
    case "workflow": return "border-amber-500/20 bg-amber-500/10";
  }
}

function eventBadge(kind: CalendarEventKind) {
  switch (kind) {
    case "schedule":
      return <Badge variant="outline" className="border-sky-500/30 bg-sky-500/10 text-sky-200">Schedule</Badge>;
    case "memory":
      return <Badge variant="outline" className="border-violet-500/30 bg-violet-500/10 text-violet-200">Memory</Badge>;
    case "workflow":
      return <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-200">Scheduled</Badge>;
  }
}

function eventIcon(kind: CalendarEventKind) {
  switch (kind) {
    case "schedule": return <IconClock className="size-3 text-sky-300" />;
    case "memory": return <IconSparkles className="size-3 text-violet-300" />;
    case "workflow": return <IconPlayerPlay className="size-3 text-amber-300" />;
  }
}

function eventLabel(kind: CalendarEventKind, time?: string) {
  switch (kind) {
    case "schedule": return time ?? "Scheduled";
    case "memory": return "Promoted memory";
    case "workflow": return "Workflow run";
  }
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string; anchor?: string; mode?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const view: CalendarView = params.view === "month" ? "month" : "week";
  const mode: DisplayMode = params.mode === "agenda" ? "agenda" : "grid";
  const anchor = params.anchor ? new Date(params.anchor) : new Date();
  const safeAnchor = Number.isNaN(anchor.getTime()) ? new Date() : anchor;
  const demo = await isDemoMode();
  const days = calendarDays(safeAnchor, view);
  const keys = new Set(days.map(dateKey));
  let events = getCalendarEvents(safeAnchor, view);
  if (demo) {
    events = appendWorkflowEvents(events, getDemoCronCalendarEvents(), keys);
  }
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
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant={view === "week" ? "default" : "outline"}>
              <Link href={`/calendar?view=week&mode=${mode}&anchor=${dateKey(safeAnchor)}`}>Week</Link>
            </Button>
            <Button asChild size="sm" variant={view === "month" ? "default" : "outline"}>
              <Link href={`/calendar?view=month&mode=${mode}&anchor=${dateKey(safeAnchor)}`}>Month</Link>
            </Button>
            <Button asChild size="sm" variant={mode === "grid" ? "default" : "outline"}>
              <Link href={`/calendar?view=${view}&mode=grid&anchor=${dateKey(safeAnchor)}`}>Grid</Link>
            </Button>
            <Button asChild size="sm" variant={mode === "agenda" ? "default" : "outline"}>
              <Link href={`/calendar?view=${view}&mode=agenda&anchor=${dateKey(safeAnchor)}`}><IconList /> Agenda</Link>
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
                Schedule events are recurring reference items; memory events are promoted entries; workflow events are real workflow runs placed on their actual run days.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/calendar?view=${view}&mode=${mode}&anchor=${dateKey(prevAnchor)}`}><IconChevronLeft /> Prev</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/calendar?view=${view}&mode=${mode}&anchor=${dateKey(nextAnchor)}`}>Next <IconChevronRight /></Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {mode === "grid" ? (
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
                        <div key={event.id} className={`rounded-lg border px-2.5 py-2 text-xs ${eventClasses(event.kind)}`}>
                          <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                            {eventIcon(event.kind)}
                            <span>{eventLabel(event.kind, event.time)}</span>
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
          ) : (
            <div className="space-y-4">
              {days.map((day) => {
                const key = dateKey(day);
                const dayEvents = grouped.get(key) ?? [];
                return (
                  <div key={key} className="rounded-xl border bg-background/60 p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground">{day.toLocaleDateString(undefined, { weekday: "long" })}</div>
                        <div className="text-sm font-medium text-foreground">{day.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</div>
                      </div>
                      <Badge variant="outline">{dayEvents.length} item{dayEvents.length === 1 ? "" : "s"}</Badge>
                    </div>
                    <div className="space-y-2">
                      {dayEvents.length > 0 ? dayEvents.map((event) => (
                        <div key={event.id} className={`flex flex-wrap items-start justify-between gap-3 rounded-xl border px-3 py-3 ${eventClasses(event.kind)}`}>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              {eventBadge(event.kind)}
                              <span className="text-xs text-muted-foreground">{eventLabel(event.kind, event.time)}</span>
                            </div>
                            <div className="font-medium text-foreground">
                              {event.href ? <Link href={event.href} className="hover:underline">{event.title}</Link> : event.title}
                            </div>
                            {event.detail ? <div className="mt-1 text-sm text-muted-foreground">{event.detail}</div> : null}
                          </div>
                          {event.href ? (
                            <Button asChild size="sm" variant="outline">
                              <Link href={event.href}>Open</Link>
                            </Button>
                          ) : null}
                        </div>
                      )) : (
                        <div className="rounded-lg border border-dashed px-3 py-3 text-sm text-muted-foreground">
                          No items for this day.
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
          <Button asChild size="sm" variant="outline"><Link href="/workflows">Open workflows</Link></Button>
          <Button asChild size="sm" variant="outline"><Link href="/artifacts/promote">Promote artifacts</Link></Button>
          <Button asChild size="sm" variant="outline"><Link href="/investigations/promote">Promote investigations</Link></Button>
          <Button asChild size="sm" variant="outline"><Link href="/memory">View memory</Link></Button>
        </CardContent>
      </Card>
    </>
  );
}
