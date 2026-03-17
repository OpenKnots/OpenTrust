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
