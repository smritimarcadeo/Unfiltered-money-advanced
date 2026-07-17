'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X, BookOpen, Plus } from 'lucide-react';
import { GLOSSARY, GLOSSARY_CATS } from '@/data/glossary';
import { cx } from '@/lib/format';

export default function GlossaryView() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [open, setOpen] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GLOSSARY.filter((g) => {
      if (cat !== 'All' && g.cat !== cat) return false;
      if (!q) return true;
      return (
        g.term.toLowerCase().includes(q) ||
        g.short.toLowerCase().includes(q) ||
        g.long.toLowerCase().includes(q)
      );
    });
  }, [search, cat]);

  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow"><BookOpen size={14} /> Jargon buster</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Money words, in plain English</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-3">
          The industry uses jargon to make simple things sound complicated. Here's what each term
          actually means — and why it matters to your wallet.
        </p>
      </div>

      {/* controls */}
      <div className="mt-8 card-surface p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a term… e.g. co-pay, CAGR, CIBIL"
            className="input-field pl-10 pr-9"
          />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear" className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
              <X size={16} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          {GLOSSARY_CATS.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={cx('shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold border transition',
                cat === c ? 'bg-brand-600 border-brand-600 text-white shadow-lift'
                  : 'border-ink-300 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:border-brand-400 hover:text-brand-600')}>
              {c}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-xs font-semibold text-ink-400 pl-2">{filtered.length} terms</span>
        </div>
      </div>

      {/* list */}
      {filtered.length === 0 ? (
        <div className="grid place-items-center py-20 text-center">
          <p className="font-display font-bold text-ink-800 dark:text-white">No term matches "{search}"</p>
          <p className="text-sm text-ink-500 mt-1">Try a shorter word, or clear the category filter.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3 mt-6">
          {filtered.map((g) => {
            const isOpen = open === g.term;
            return (
              <div key={g.term} className="card-surface overflow-hidden h-fit">
                <button onClick={() => setOpen(isOpen ? null : g.term)} className="w-full text-left p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="chip bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-300 mb-2">{g.cat}</span>
                      <h3 className="font-display font-bold text-ink-900 dark:text-white">{g.term}</h3>
                      <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{g.short}</p>
                    </div>
                    <span className={cx('grid place-items-center w-7 h-7 rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-600 shrink-0 transition-transform', isOpen && 'rotate-45')}>
                      <Plus size={15} />
                    </span>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-sm text-ink-600 dark:text-ink-300 leading-relaxed border-t border-ink-100 dark:border-ink-800 pt-4">
                        {g.long}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
