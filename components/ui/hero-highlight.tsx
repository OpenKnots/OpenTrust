"use client";

import {
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";

export interface HeroHighlightProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  containerClassName?: string;
}

export function HeroHighlight({
  children,
  className,
  containerClassName,
  ...props
}: HeroHighlightProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(32rem 32rem at ${mouseX}px ${mouseY}px, rgba(220, 38, 38, 0.18), transparent 70%)`;

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = event;
    const rect = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - rect.left);
    mouseY.set(clientY - rect.top);
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8",
        containerClassName,
      )}
      onPointerMove={handlePointerMove}
      {...props}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 sm:opacity-100"
        style={{ background: spotlight }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:56px_56px] opacity-[0.14] [mask-image:radial-gradient(circle_at_center,white,transparent_82%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/70 to-transparent blur-sm"
      />
      <div className={cn("relative z-10 mx-auto w-full max-w-5xl", className)}>{children}</div>
    </div>
  );
}

export interface HighlightProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export function Highlight({ children, className, ...props }: HighlightProps) {
  return (
    <span
      className={cn(
        "relative inline-block rounded-md bg-gradient-to-r from-red-600/20 via-red-500/25 to-neutral-900/30 px-2 py-1 font-semibold text-foreground",
        "shadow-[inset_0_-1px_0_rgba(255,255,255,0.22)] ring-1 ring-red-500/20",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-0 rounded-md bg-gradient-to-r from-red-500/12 via-transparent to-neutral-800/12 blur-sm" aria-hidden="true" />
      <span className="relative z-10">{children}</span>
    </span>
  );
}
