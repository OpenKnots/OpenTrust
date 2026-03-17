import { Inbox } from "lucide-react";

export function EmptyState({
  message = "No data available.",
  icon,
}: {
  message?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon ?? <Inbox size={24} />}</div>
      <p>{message}</p>
    </div>
  );
}
