/** Strip common Markdown syntax for plain-text list previews. */
export function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim();
}

export function truncatePath(uri: string, levels = 4): string {
  const segments = uri.split("/").filter(Boolean);
  if (segments.length <= levels) return uri;
  return `…/${segments.slice(-levels).join("/")}`;
}

export function formatDuration(
  start: string | null | undefined,
  end: string | null | undefined,
): string | null {
  if (!start) return null;
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  if (Number.isNaN(s) || Number.isNaN(e)) return null;
  const ms = Math.max(0, e - s);
  if (ms < 1000) return `${ms}ms`;
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const remSec = sec % 60;
  if (min < 60) return remSec ? `${min}m ${remSec}s` : `${min}m`;
  const hr = Math.floor(min / 60);
  const remMin = min % 60;
  return remMin ? `${hr}h ${remMin}m` : `${hr}h`;
}

export function formatRelativeTime(input: string | null | undefined) {
  if (!input) return "unknown";
  const value = new Date(input).getTime();
  if (Number.isNaN(value)) return input;

  const diffMs = Date.now() - value;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return new Date(input).toLocaleString();
}
