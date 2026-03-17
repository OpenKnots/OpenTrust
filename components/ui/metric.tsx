export function MetricInline({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="metric-inline">
      <span className="metric-inline__label">{label}</span>
      <span className={`metric-inline__value${mono ? " metric-inline__value--mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
