'use client';

import { useState, type ReactNode } from 'react';

interface BorderGlowProps {
  children?: ReactNode;
  className?: string;
  active?: boolean;
  onToggle?: (active: boolean) => void;
}

export function BorderGlow({
  children,
  className,
  active: controlledActive,
  onToggle,
}: BorderGlowProps) {
  const [internalActive, setInternalActive] = useState(false);
  const isControlled = controlledActive !== undefined;
  const active = isControlled ? controlledActive : internalActive;

  function handleClick() {
    const next = !active;
    if (!isControlled) setInternalActive(next);
    onToggle?.(next);
  }

  return (
    <div
      className={`border-glow${active ? ' border-glow--active' : ''}${className ? ` ${className}` : ''}`}
      onClick={handleClick}
    >
      <div className="border-glow__blur" />
      <div className="border-glow__gradient" />
      <div className="border-glow__content">
        {children}
      </div>
    </div>
  );
}
