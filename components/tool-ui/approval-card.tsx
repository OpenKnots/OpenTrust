"use client";

import { icons, type LucideProps } from "lucide-react";

type IconName = keyof typeof icons;

function resolveIcon(icon: string | React.ReactNode): React.ReactNode {
  if (typeof icon !== "string") return icon;

  const pascal = icon
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("") as IconName;

  const Icon = icons[pascal] as React.ComponentType<LucideProps> | undefined;
  return Icon ? <Icon size={18} /> : null;
}

export function ApprovalCard({
  id,
  title,
  description,
  icon,
  confirmLabel = "Confirm",
  cancelLabel = "Deny",
  onConfirm,
  onCancel,
  className,
}: {
  id?: string;
  title: string;
  description?: string;
  icon?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}) {
  return (
    <div id={id} className={`approval-card ${className ?? ""}`.trim()}>
      <div className="approval-card__body">
        {icon && (
          <span className="approval-card__icon">{resolveIcon(icon)}</span>
        )}
        <div className="approval-card__content">
          <p className="approval-card__title">{title}</p>
          {description && (
            <p className="approval-card__description">{description}</p>
          )}
        </div>
      </div>

      <div className="approval-card__actions">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={onCancel}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="btn approval-card__confirm"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
