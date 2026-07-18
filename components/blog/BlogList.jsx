'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CalendarDays, Clock, ArrowRight, SearchX } from 'lucide-react';
import { BLOGS, BLOG_CATS, catStyle, blogTint } from '@/data/blog';
import { cx } from '@/lib/format';
import BlogCard from './BlogCard';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

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
  const featured = !isFiltered ? filtered[0] : null;
  const grid = featured ? filtered.slice(1) : filtered;

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

      {/* featured */}
      {featured && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mt-8">
          <Link href={`/blog/${featured.slug}`} className="group block">
            <div className="relative rounded-3xl overflow-hidden bg-ink-900 dark:bg-ink-950 border border-ink-800 flex flex-col md:flex-row min-h-[260px]">
              <div className="w-full md:w-[55%] p-6 sm:p-8 md:p-10 flex flex-col justify-center order-1">
                <span className="inline-block w-fit bg-white/10 border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-[0.15em]">Featured</span>
                <h2 className="text-white font-display font-extrabold text-2xl sm:text-3xl leading-tight group-hover:text-brand-300 transition-colors">{featured.title}</h2>
                <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mt-3">{featured.excerpt}</p>
                <div className="flex items-center gap-3 text-white/40 text-[11px] mt-4">
                  <span className="flex items-center gap-1"><CalendarDays size={12} /> {fmtDate(featured.date)}</span>
                  <span>•</span><span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime}</span>
                </div>
                <div className="flex items-center justify-between mt-6 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-600 text-white text-xs font-bold shrink-0">{featured.author?.name?.[0] || 'U'}</span>
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-wider">Written by</p>
                      <p className="text-white font-bold text-sm">{featured.author?.name || 'UnfilteredMoney'}</p>
                    </div>
                  </div>
                  <span className="bg-white text-ink-900 text-xs font-bold px-5 py-2.5 rounded-full group-hover:bg-brand-600 group-hover:text-white transition-all shadow-md flex items-center gap-1.5">
                    Read Article <ArrowRight size={14} />
                  </span>
                </div>
              </div>
              <div className={cx('w-full md:w-[45%] min-h-[200px] md:min-h-0 grid place-items-center bg-gradient-to-br order-2 relative overflow-hidden', blogTint(featured.slug))}>
                <span className="font-display font-black text-8xl text-white/20 select-none">{featured.title.charAt(0)}</span>
                <span className={cx('absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full', catStyle(featured.category))}>{featured.category}</span>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* section header */}
      <div className="flex items-center gap-3 pt-10 pb-5">
        <h2 className="font-display font-extrabold text-ink-900 dark:text-white whitespace-nowrap">
          {isFiltered ? `Results (${filtered.length})` : 'Latest Articles'}
        </h2>
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
