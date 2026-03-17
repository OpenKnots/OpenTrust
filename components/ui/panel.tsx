export function Panel({
  title,
  icon,
  children,
  className,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`panel ${className ?? ""}`.trim()}>
      <div className="panel__header">
        {icon && <span className="panel__icon">{icon}</span>}
        <h3 className="panel__title">{title}</h3>
      </div>
      {children}
    </div>
  );
}
