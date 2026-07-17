'use client';

import { History } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getById } from '@/data/products';
import { cx } from '@/lib/format';

export default function RecentlyViewed() {
  const { recent, openDetail, hydrated } = useStore();
  if (!hydrated) return null;
  const items = recent.map(getById).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <section className="container-page py-8">
      <h3 className="flex items-center gap-2 text-sm font-bold text-ink-500 dark:text-ink-300 mb-3">
        <History size={16} /> Recently viewed
      </h3>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {items.map((p) => (
          <button key={p.id} onClick={() => openDetail(p.id)}
            className="shrink-0 flex items-center gap-3 card-surface p-3 pr-5 hover:border-brand-300 transition text-left">
            <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-600 text-white text-xs font-bold">{p.logo}</span>
            <div>
              <p className="text-xs text-ink-400 font-semibold">{p.provider}</p>
              <p className={cx('text-sm font-bold text-ink-900 dark:text-white')}>{p.name.length > 22 ? p.name.slice(0, 22) + '…' : p.name}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
