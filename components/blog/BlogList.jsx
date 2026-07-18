'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SearchX } from 'lucide-react';
import { BLOGS, BLOG_CATS } from '@/data/blog';
import { cx } from '@/lib/format';
import BlogCard from './BlogCard';

export default function BlogList() {
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');

  const sorted = useMemo(() => [...BLOGS].sort((a, b) => new Date(b.date) - new Date(a.date)), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sorted.filter((b) => {
      if (cat !== 'All' && b.category !== cat) return false;
      if (!q) return true;
      return b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q) || b.tags?.some((t) => t.toLowerCase().includes(q));
    });
  }, [sorted, cat, search]);

  const isFiltered = cat !== 'All' || search.trim() !== '';
  const grid = filtered;

  return (
    <>
      {/* sticky filter bar */}
      <div className="sticky top-16 z-20 -mx-4 sm:mx-0 px-4 sm:px-0 py-3 bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="card-surface p-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1">
            {BLOG_CATS.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={cx('shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold border transition',
                  cat === c ? 'bg-brand-600 border-brand-600 text-white shadow-lift'
                    : 'border-ink-300 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:border-brand-400 hover:text-brand-600')}>
                {c}
              </button>
            ))}
          </div>
          <div className="relative sm:w-64 shrink-0">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles…" className="input-field pl-10 pr-9 !py-2" />
            {search && (
              <button onClick={() => setSearch('')} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"><X size={16} /></button>
            )}
          </div>
        </div>
      </div>

      {/* section header */}
      <div className="flex items-center gap-3 pt-8 pb-5">
      
        <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
        {isFiltered && (
          <button onClick={() => { setCat('All'); setSearch(''); }} className="text-xs font-semibold text-brand-600 hover:underline shrink-0">Clear</button>
        )}
      </div>

      {/* grid */}
      <AnimatePresence mode="wait">
        {grid.length > 0 ? (
          <motion.div key={cat + search} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {grid.map((b, i) => <BlogCard key={b.slug} blog={b} index={i} />)}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid place-items-center text-center py-20">
            <span className="grid place-items-center w-16 h-16 rounded-2xl bg-ink-100 dark:bg-ink-800 text-ink-400 mb-4"><SearchX size={28} /></span>
            <p className="font-display font-bold text-ink-800 dark:text-white">No articles found</p>
            <button onClick={() => { setCat('All'); setSearch(''); }} className="mt-3 text-sm font-semibold text-brand-600 hover:underline">Clear filters</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
