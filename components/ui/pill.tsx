export type PillTone = "neutral" | "accent" | "success" | "danger" | "warning" | "info";

export function Pill({ label, tone = "neutral" }: { label: string; tone?: PillTone }) {
  return <span className={`pill pill--${tone}`}>{label}</span>;
}

export function StatusDot({ tone }: { tone: PillTone }) {
  return <span className={`status-dot status-dot--${tone}`} />;
}
