"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface MetricCardProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "stable";
  subtitle?: string;
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
}

export const MetricCard = forwardRef<HTMLDivElement, MetricCardProps>(
  ({ className, label, value, icon, trend, subtitle, tone = "neutral", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("metric-card", `metric-card--${tone}`, className)}
        {...props}
      >
        {icon && <div className="metric-card__icon">{icon}</div>}
        <div className="metric-card__content">
          <div className="metric-card__value">
            {value}
            {trend && (
              <span className={cn("metric-card__trend", `metric-card__trend--${trend}`)}>
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
              </span>
            )}
          </div>
          <div className="metric-card__label">{label}</div>
          {subtitle && <div className="metric-card__subtitle">{subtitle}</div>}
        </div>
      </div>
    );
  },
);

MetricCard.displayName = "MetricCard";
