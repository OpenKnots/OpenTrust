"use client";

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DemoSectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: ReactNode;
  onRun?: () => Promise<unknown> | unknown;
  renderResult?: (result: unknown) => ReactNode;
  runLabel?: string;
  resetLabel?: string;
}

export const DemoSection = forwardRef<HTMLDivElement, DemoSectionProps>(
  (
    {
      className,
      title,
      description,
      icon,
      onRun,
      renderResult,
      runLabel = "Run",
      resetLabel = "Reset",
      children,
      ...props
    },
    ref,
  ) => {
    const [result, setResult] = useState<unknown>(null);
    const [running, setRunning] = useState(false);
    const [hasRun, setHasRun] = useState(false);

    async function handleRun() {
      if (!onRun || running) return;
      setRunning(true);
      try {
        const res = await onRun();
        setResult(res);
        setHasRun(true);
      } finally {
        setRunning(false);
      }
    }

    function handleReset() {
      setResult(null);
      setHasRun(false);
    }

    return (
      <div ref={ref} className={cn("demo-section", className)} {...props}>
        <div className="demo-section__header">
          <div className="demo-section__meta">
            {icon && <div className="demo-section__icon">{icon}</div>}
            <div>
              <div className="demo-section__title">{title}</div>
              {description && <div className="demo-section__description">{description}</div>}
            </div>
          </div>
          <div className="demo-section__actions">
            {hasRun && (
              <button className="btn btn--ghost btn--sm" onClick={handleReset} type="button">
                <RotateCcw size={12} />
                {resetLabel}
              </button>
            )}
            {onRun && (
              <button className="btn btn--primary btn--sm" onClick={handleRun} disabled={running} type="button">
                <Play size={12} />
                {running ? "Running…" : runLabel}
              </button>
            )}
          </div>
        </div>

        <div className="demo-section__body">{children}</div>

        {hasRun && renderResult && (
          <div className="demo-section__result">
            {renderResult(result)}
          </div>
        )}
      </div>
    );
  },
);

DemoSection.displayName = "DemoSection";
