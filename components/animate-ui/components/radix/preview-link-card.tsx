'use client';

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
  type ComponentPropsWithoutRef,
} from 'react';
import { createPortal } from 'react-dom';

/* ─── Context ─── */

interface PreviewCtx {
  href: string;
  isOpen: boolean;
  requestOpen(): void;
  requestClose(): void;
  triggerRef: React.RefObject<HTMLAnchorElement | null>;
  followCursor: boolean | 'x' | 'y';
  pointer: React.MutableRefObject<{ x: number; y: number }>;
}

const Ctx = createContext<PreviewCtx | null>(null);

function useCtx() {
  const c = useContext(Ctx);
  if (!c)
    throw new Error(
      'PreviewLinkCard sub-components must be rendered inside <PreviewLinkCard>',
    );
  return c;
}

/* ─── PreviewLinkCard (root) ─── */

interface PreviewLinkCardProps {
  href: string;
  followCursor?: boolean | 'x' | 'y';
  children: ReactNode;
}

export function PreviewLinkCard({
  href,
  followCursor = false,
  children,
}: PreviewLinkCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestOpen = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setIsOpen(true);
  }, []);

  const requestClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 120);
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  return (
    <Ctx.Provider
      value={{
        href,
        isOpen,
        requestOpen,
        requestClose,
        triggerRef,
        followCursor,
        pointer,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

/* ─── Trigger ─── */

type TriggerProps = ComponentPropsWithoutRef<'a'>;

export function PreviewLinkCardTrigger({ children, ...props }: TriggerProps) {
  const { href, requestOpen, requestClose, triggerRef, followCursor, pointer } =
    useCtx();

  return (
    <a
      ref={triggerRef}
      href={href}
      onPointerEnter={(e) => {
        pointer.current = { x: e.clientX, y: e.clientY };
        requestOpen();
        props.onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        requestClose();
        props.onPointerLeave?.(e);
      }}
      onPointerMove={(e) => {
        if (followCursor) pointer.current = { x: e.clientX, y: e.clientY };
        props.onPointerMove?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

/* ─── Content ─── */

interface ContentProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
}

export function PreviewLinkCardContent({
  side = 'bottom',
  sideOffset = 10,
  align = 'center',
  alignOffset = 0,
  children,
  className,
  style,
  ...props
}: ContentProps) {
  const { href, isOpen, requestOpen, requestClose, triggerRef, followCursor, pointer } =
    useCtx();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => setHasMounted(true), []);

  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    const el = wrapperRef.current;
    if (!trigger || !el) return;

    const tr = trigger.getBoundingClientRect();
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const p = pointer.current;

    const usePointerX = followCursor === true || followCursor === 'x';
    const usePointerY = followCursor === true || followCursor === 'y';

    let x = 0;
    let y = 0;

    if (side === 'top' || side === 'bottom') {
      y =
        side === 'top'
          ? (usePointerY ? p.y : tr.top) - h - sideOffset
          : (usePointerY ? p.y : tr.bottom) + sideOffset;

      const anchorX = usePointerX ? p.x : tr.left + tr.width / 2;
      x =
        align === 'start'
          ? (usePointerX ? p.x : tr.left) + alignOffset
          : align === 'end'
            ? (usePointerX ? p.x : tr.right) - w + alignOffset
            : anchorX - w / 2 + alignOffset;
    } else {
      x =
        side === 'left'
          ? (usePointerX ? p.x : tr.left) - w - sideOffset
          : (usePointerX ? p.x : tr.right) + sideOffset;

      const anchorY = usePointerY ? p.y : tr.top + tr.height / 2;
      y =
        align === 'start'
          ? (usePointerY ? p.y : tr.top) + alignOffset
          : align === 'end'
            ? (usePointerY ? p.y : tr.bottom) - h + alignOffset
            : anchorY - h / 2 + alignOffset;
    }

    const pad = 8;
    x = Math.max(pad, Math.min(x, window.innerWidth - w - pad));
    y = Math.max(pad, Math.min(y, window.innerHeight - h - pad));

    el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
  }, [side, sideOffset, align, alignOffset, followCursor, triggerRef, pointer]);

  useEffect(() => {
    if (!isOpen) {
      setReady(false);
      return;
    }

    const id = requestAnimationFrame(() => {
      reposition();
      setReady(true);

      if (followCursor) {
        const loop = () => {
          reposition();
          raf.current = requestAnimationFrame(loop);
        };
        raf.current = requestAnimationFrame(loop);
      }
    });

    return () => {
      cancelAnimationFrame(id);
      cancelAnimationFrame(raf.current);
    };
  }, [isOpen, reposition, followCursor]);

  if (!hasMounted || !isOpen) return null;

  return createPortal(
    <div
      ref={wrapperRef}
      className="preview-link-card__positioner"
      onPointerEnter={requestOpen}
      onPointerLeave={requestClose}
    >
      <a
        href={href}
        className={`preview-link-card__content${ready ? ' preview-link-card__content--visible' : ''} ${className ?? ''}`.trim()}
        style={style}
        {...props}
      >
        {children}
      </a>
    </div>,
    document.body,
  );
}

/* ─── Image ─── */

interface ImageProps {
  alt?: string;
  src?: string;
  width?: number;
  height?: number;
}

export function PreviewLinkCardImage({
  alt = '',
  src,
  width,
  height,
}: ImageProps) {
  const { href } = useCtx();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imgSrc =
    src ??
    `https://api.microlink.io/?url=${encodeURIComponent(href)}&screenshot=true&meta=false&embed=screenshot.url`;

  return (
    <div className="preview-link-card__image-wrap">
      {!loaded && !error && (
        <div className="preview-link-card__skeleton" />
      )}
      {error ? (
        <div className="preview-link-card__fallback">
          <span className="preview-link-card__fallback-text">
            {new URL(href, 'https://example.com').hostname}
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={`preview-link-card__image${loaded ? ' preview-link-card__image--loaded' : ''}`}
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
