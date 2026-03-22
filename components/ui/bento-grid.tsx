"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
}

export const BentoGrid = forwardRef<HTMLDivElement, BentoGridProps>(
  ({ className, columns = 3, gap = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bento-grid",
          `bento-grid--cols-${columns}`,
          `bento-grid--gap-${gap}`,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

BentoGrid.displayName = "BentoGrid";

export interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  variant?: "default" | "feature" | "hero" | "compact";
  icon?: ReactNode;
  title?: string;
  description?: string;
  footer?: ReactNode;
  hoverable?: boolean;
}

export const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(
  (
    {
      className,
      colSpan = 1,
      rowSpan = 1,
      variant = "default",
      icon,
      title,
      description,
      footer,
      hoverable = true,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bento-card",
          `bento-card--${variant}`,
          colSpan > 1 && `bento-card--col-${colSpan}`,
          rowSpan > 1 && `bento-card--row-${rowSpan}`,
          hoverable && "bento-card--hoverable",
          className,
        )}
        {...props}
      >
        {(icon || title) && (
          <div className="bento-card__header">
            {icon && <div className="bento-card__icon">{icon}</div>}
            {title && <h3 className="bento-card__title">{title}</h3>}
          </div>
        )}
        {description && <p className="bento-card__description">{description}</p>}
        {children && <div className="bento-card__content">{children}</div>}
        {footer && <div className="bento-card__footer">{footer}</div>}
      </div>
    );
  },
);

BentoCard.displayName = "BentoCard";
