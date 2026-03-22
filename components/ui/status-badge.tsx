"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
  status?: "healthy" | "attention" | "degraded" | "unknown" | "active" | "idle";
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
  dot?: boolean;
  pulse?: boolean;
  size?: "sm" | "md";
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, label, status, tone, dot = true, pulse, size = "sm", ...props }, ref) => {
    const resolvedTone = tone ?? statusToTone(status);

    return (
      <span
        ref={ref}
        className={cn(
          "status-badge",
          `status-badge--${resolvedTone}`,
          `status-badge--${size}`,
          className,
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "status-badge__dot",
              `status-badge__dot--${resolvedTone}`,
              pulse && "status-badge__dot--pulse",
            )}
          />
        )}
        <span className="status-badge__label">{label}</span>
      </span>
    );
  },
);

StatusBadge.displayName = "StatusBadge";

function statusToTone(status?: string): StatusBadgeProps["tone"] {
  switch (status) {
    case "healthy":
    case "active":
      return "success";
    case "attention":
      return "warning";
    case "degraded":
      return "danger";
    default:
      return "neutral";
  }
}
