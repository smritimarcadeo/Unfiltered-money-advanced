'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cx } from '@/lib/format';

const SORTS = [
  { id: 'score', label: 'Top score' },
  { id: 'price-low', label: 'Price: low to high' },
  { id: 'price-high', label: 'Price: high to low' },
];

export default function FilterBar({ subtypes, subtype, setSubtype, search, setSearch, sort, setSort, count }) {
  return (
    <div className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="card-surface p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* search */}
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, provider…"
              className="input-field pl-10 pr-9"
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
                <X size={16} />
              </button>
            )}
          </div>

          {/* sort */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={16} className="text-ink-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input-field !py-2 !w-auto pr-8 cursor-pointer"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* subtype pills */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          {subtypes.map((s) => {
            const active = subtype === s.slug;
            return (
              <button
                key={s.slug}
                onClick={() => setSubtype(s.slug)}
                className={cx(
                  'shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold border transition',
                  active
                    ? 'bg-brand-600 border-brand-600 text-white shadow-lift'
                    : 'bg-transparent border-ink-300 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:border-brand-400 hover:text-brand-600'
                )}
              >
                {s.label}
              </button>
            );
          })}
          <span className="ml-auto shrink-0 text-xs font-semibold text-ink-400 pl-2">{count} results</span>
        </div>
      </div>
    </div>
  );
}
