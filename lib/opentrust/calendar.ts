import { listMemoryEntries } from "@/lib/opentrust/memory-entries";

export type CalendarView = "week" | "month";

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  time?: string;
  kind: "schedule" | "memory";
  href?: string;
  detail?: string;
}

const RECURRING_EVENTS = [
  { weekday: 1, title: "Eng Sync", time: "9:30 AM" },
  { weekday: 1, title: "Team Standup", time: "11:30 AM" },
  { weekday: 2, title: "Eng Sync", time: "9:30 AM" },
  { weekday: 2, title: "Sync with Camille", time: "2:30 PM" },
  { weekday: 3, title: "Eng Sync", time: "9:30 AM" },
  { weekday: 4, title: "Eng Sync", time: "9:30 AM" },
  { weekday: 4, title: "DevRel Office Hours", time: "11:30 AM" },
  { weekday: 5, title: "Eng Sync", time: "9:30 AM" },
] as const;

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(date: Date) {
  const day = date.getDay();
  return addDays(date, -day);
}

export function calendarDays(anchor: Date, view: CalendarView) {
  if (view === "week") {
    const start = startOfWeek(anchor);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = addDays(first, -first.getDay());
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

export function dateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getCalendarEvents(anchor = new Date(), view: CalendarView = "week") {
  const days = calendarDays(anchor, view);
  const keys = new Set(days.map(dateKey));
  const events: CalendarEvent[] = [];

  for (const day of days) {
    for (const event of RECURRING_EVENTS.filter((item) => item.weekday === day.getDay())) {
      events.push({
        id: `sched-${dateKey(day)}-${event.title}`,
        date: dateKey(day),
        title: event.title,
        time: event.time,
        kind: "schedule",
      });
    }
  }

  for (const entry of listMemoryEntries({ limit: 100 })) {
    const created = new Date(entry.created_at);
    const key = dateKey(created);
    if (!keys.has(key)) continue;

    events.push({
      id: `mem-${entry.id}`,
      date: key,
      title: entry.title,
      kind: "memory",
      href: `/memory/${encodeURIComponent(entry.id)}`,
      detail: entry.summary ?? `${entry.review_status} · ${entry.retention_class}`,
    });
  }

  return events.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return (a.time ?? "23:59").localeCompare(b.time ?? "23:59");
  });
}
