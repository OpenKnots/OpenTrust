"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "raised" | "inset" | "hero";
  glow?: boolean;
  hoverable?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", glow, hoverable = true, header, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card",
          variant !== "default" && `glass-card--${variant}`,
          glow && "glass-card--glow",
          hoverable && "glass-card--hoverable",
          className,
        )}
        {...props}
      >
        {header && <div className="glass-card__header">{header}</div>}
        <div className="glass-card__body">{children}</div>
        {footer && <div className="glass-card__footer">{footer}</div>}
      </div>
    );
  },
);

GlassCard.displayName = "GlassCard";
