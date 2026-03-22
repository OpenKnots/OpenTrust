'use client';

import { useEffect, useState } from 'react';
import { LayoutGrid, LayoutList } from 'lucide-react';

type ViewMode = 'grid' | 'row';
type Tone = 'accent' | 'info' | 'success' | 'warning' | 'neutral';

interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  defaultView?: ViewMode;
  tone?: Tone;
  storageKey?: string;
}

const STORAGE_PREFIX = 'card-grid-view:';

export function CardGrid({
  children,
  className,
  defaultView = 'grid',
  tone = 'neutral',
  storageKey,
}: CardGridProps) {
  const [view, setView] = useState<ViewMode>(defaultView);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + storageKey);
      if (saved === 'grid' || saved === 'row') setView(saved);
    } catch {}
  }, [storageKey]);

  function toggle(next: ViewMode) {
    setView(next);
    if (storageKey) {
      try { localStorage.setItem(STORAGE_PREFIX + storageKey, next); } catch {}
    }
  }

  return (
    <div className={`card-group card-group--${tone}${className ? ` ${className}` : ''}`}>
      <div className="card-group__toolbar">
        <button
          type="button"
          className={`card-group__toggle${view === 'grid' ? ' card-group__toggle--active' : ''}`}
          onClick={() => toggle('grid')}
          aria-label="Grid view"
        >
          <LayoutGrid size={14} />
        </button>
        <button
          type="button"
          className={`card-group__toggle${view === 'row' ? ' card-group__toggle--active' : ''}`}
          onClick={() => toggle('row')}
          aria-label="Row view"
        >
          <LayoutList size={14} />
        </button>
      </div>
      <div className={view === 'grid' ? 'card-grid' : 'card-row'}>
        {children}
      </div>
    </div>
  );
}
