"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type ReactElement,
} from "react";
import { createPortal } from "react-dom";

interface PreviewCardCtx {
  open: boolean;
  triggerEl: HTMLElement | null;
  setTriggerEl: (el: HTMLElement | null) => void;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  cancelClose: () => void;
  followCursor?: boolean | "x" | "y";
  cursorPos: { x: number; y: number };
  setCursorPos: (pos: { x: number; y: number }) => void;
}

const Ctx = createContext<PreviewCardCtx | null>(null);

function useCtx() {
  const c = useContext(Ctx);
  if (!c) throw new Error("PreviewCard context missing");
  return c;
}

export function PreviewCard({
  children,
  followCursor,
}: {
  children: ReactNode;
  followCursor?: boolean | "x" | "y";
}) {
  const [open, setOpen] = useState(false);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const openT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeT = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scheduleOpen = useCallback(() => {
    clearTimeout(closeT.current);
    clearTimeout(openT.current);
    openT.current = setTimeout(() => setOpen(true), 200);
  }, []);

  const scheduleClose = useCallback(() => {
    clearTimeout(openT.current);
    clearTimeout(closeT.current);
    closeT.current = setTimeout(() => setOpen(false), 120);
  }, []);

  const cancelClose = useCallback(() => {
    clearTimeout(closeT.current);
  }, []);

  return (
    <Ctx.Provider
      value={{
        open,
        triggerEl,
        setTriggerEl,
        scheduleOpen,
        scheduleClose,
        cancelClose,
        followCursor,
        cursorPos,
        setCursorPos,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function PreviewCardTrigger({
  render,
  children,
}: {
  render?: ReactElement;
  children?: ReactNode;
}) {
  const ctx = useCtx();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const child = wrapperRef.current.firstElementChild as HTMLElement | null;
    ctx.setTriggerEl(child ?? wrapperRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEnter = useCallback(
    (e: React.MouseEvent) => {
      ctx.scheduleOpen();
      if (ctx.followCursor) ctx.setCursorPos({ x: e.clientX, y: e.clientY });
    },
    [ctx],
  );

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (ctx.followCursor) ctx.setCursorPos({ x: e.clientX, y: e.clientY });
    },
    [ctx],
  );

  return (
    <div
      ref={wrapperRef}
      className="preview-card-trigger"
      onMouseEnter={handleEnter}
      onMouseLeave={ctx.scheduleClose}
      onMouseMove={ctx.followCursor ? handleMove : undefined}
    >
      {render ?? children}
    </div>
  );
}

function computePosition(
  triggerRect: DOMRect,
  panelRect: DOMRect,
  side: "top" | "bottom" | "left" | "right",
  sideOffset: number,
  align: "start" | "center" | "end",
  alignOffset: number,
) {
  let top = 0;
  let left = 0;

  switch (side) {
    case "top":
      top = triggerRect.top - panelRect.height - sideOffset;
      break;
    case "bottom":
      top = triggerRect.bottom + sideOffset;
      break;
    case "left":
      left = triggerRect.left - panelRect.width - sideOffset;
      break;
    case "right":
      left = triggerRect.right + sideOffset;
      break;
  }

  if (side === "top" || side === "bottom") {
    switch (align) {
      case "start":
        left = triggerRect.left + alignOffset;
        break;
      case "center":
        left =
          triggerRect.left +
          triggerRect.width / 2 -
          panelRect.width / 2 +
          alignOffset;
        break;
      case "end":
        left = triggerRect.right - panelRect.width + alignOffset;
        break;
    }
  } else {
    switch (align) {
      case "start":
        top = triggerRect.top + alignOffset;
        break;
      case "center":
        top =
          triggerRect.top +
          triggerRect.height / 2 -
          panelRect.height / 2 +
          alignOffset;
        break;
      case "end":
        top = triggerRect.bottom - panelRect.height + alignOffset;
        break;
    }
  }

  left = Math.max(8, Math.min(left, window.innerWidth - panelRect.width - 8));
  top = Math.max(8, Math.min(top, window.innerHeight - panelRect.height - 8));

  return { top, left };
}

export function PreviewCardPanel({
  children,
  side = "bottom",
  sideOffset = 8,
  align = "start",
  alignOffset = 0,
  className,
}: {
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
  className?: string;
}) {
  const { open, triggerEl, scheduleClose, cancelClose, scheduleOpen } =
    useCtx();
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    if (!triggerEl) return;

    const frame = requestAnimationFrame(() => {
      if (!panelRef.current || !triggerEl) return;
      const tr = triggerEl.getBoundingClientRect();
      const pr = panelRef.current.getBoundingClientRect();
      setPos(computePosition(tr, pr, side, sideOffset, align, alignOffset));
    });

    return () => cancelAnimationFrame(frame);
  }, [open, triggerEl, side, sideOffset, align, alignOffset]);

  useEffect(() => {
    if (!open) return;
    const handleScroll = () => scheduleClose();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open, scheduleClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      ref={panelRef}
      className={`preview-card-panel${pos ? " preview-card-panel--visible" : ""}${className ? ` ${className}` : ""}`}
      style={
        pos
          ? { top: pos.top, left: pos.left }
          : { top: -9999, left: -9999 }
      }
      onMouseEnter={() => {
        cancelClose();
        scheduleOpen();
      }}
      onMouseLeave={scheduleClose}
    >
      {children}
    </div>,
    document.body,
  );
}
