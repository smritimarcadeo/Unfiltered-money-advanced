'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, CornerDownLeft } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { BLOGS } from '@/data/blog';
import { GLOSSARY } from '@/data/glossary';
import { getSlug, unfilteredScore } from '@/lib/engine';
import { cx } from '@/lib/format';

// One flat, searchable index over everything on the site.
function buildIndex() {
  const items = [];

  for (const p of PRODUCTS) {
    items.push({
      kind: 'Product', label: p.name, hint: `${p.provider} · ${p.bestFor}`,
      href: `/${p.category}/${getSlug(p)}`, badge: `${unfilteredScore(p)}/100`,
      terms: `${p.name} ${p.provider} ${p.bestFor} ${p.subtype} ${p.tags.join(' ')}`,
    });
  }
  for (const b of BLOGS) {
    items.push({ kind: 'Guide', label: b.title, hint: `${b.category} · ${b.readTime}`, href: `/blog/${b.slug}`, terms: `${b.title} ${b.excerpt} ${b.category}` });
  }
  for (const g of GLOSSARY) {
    items.push({ kind: 'Term', label: g.term, hint: g.short, href: '/glossary', terms: `${g.term} ${g.short} ${g.cat}` });
  }
  const pages = [
    ['Spending Simulator', 'Rank cards by your real spend', '/tools/spending-simulator'],
    ['Wallet Optimizer', 'Keep, replace or remove your cards', '/tools/wallet-optimizer'],
    ['Offer Watch', 'Countdowns & fine-print change alerts', '/tools/offer-watch'],
    ['Eligibility Wizard', 'Your approval odds before you apply', '/eligibility'],
    ['Compare', 'Side by side with a live spend simulator', '/compare'],
    ['Offers', 'Live offers, with the catch attached', '/offers'],
    ['Insurance Finder', 'Get matched in 30 seconds', '/insurance/finder'],
    ['Credit Card Finder', 'Match a card to how you spend', '/credit-cards/finder'],
    ['Investment Finder', 'Match funds to your goal', '/investments/finder'],
    ['Loan Finder', 'The cheapest sensible way to borrow', '/loans/finder'],
    ['Calculators', 'SIP, EMI, FD, tax, GST, retirement…', '/tools'],
    ['How we rate', 'Our methodology & how we get paid', '/methodology'],
    ['Glossary', 'Money jargon in plain English', '/glossary'],
    ['Saved', 'Your shortlist', '/saved'],
    ['Privacy Policy', 'What we store (almost nothing)', '/privacy-policy'],
  ];
  for (const [label, hint, href] of pages) {
    items.push({ kind: 'Page', label, hint, href, terms: `${label} ${hint}` });
  }
  return items;
}

const KIND_CLS = {
  Product: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300',
  Guide: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300',
  Term: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Page: 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-300',
};

export default function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const router = useRouter();
  const inputRef = useRef(null);
  const index = useMemo(buildIndex, []);

  // ⌘K / Ctrl+K to open, Esc to close
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ(''); setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return index.filter((i) => i.kind === 'Page').slice(0, 6);
    return index
      .map((i) => {
        const hay = i.terms.toLowerCase();
        if (!hay.includes(term)) return null;
        // exact label prefix ranks highest
        const score = i.label.toLowerCase().startsWith(term) ? 0 : i.label.toLowerCase().includes(term) ? 1 : 2;
        return { ...i, score };
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score)
      .slice(0, 8);
  }, [q, index]);

  const go = (item) => { setOpen(false); router.push(item.href); };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && results[active]) { e.preventDefault(); go(results[active]); }
  };

  return (
    <>
      {/* trigger */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="flex items-center gap-2 rounded-full border border-ink-300 dark:border-ink-600 text-ink-400 hover:border-brand-400 hover:text-brand-600 transition h-9 px-3 xl:pr-2"
      >
        <Search size={16} />
        <span className="hidden xl:inline text-xs font-medium">Search…</span>
        <kbd className="hidden xl:inline text-[10px] font-bold border border-ink-300 dark:border-ink-600 rounded px-1.5 py-0.5">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: -14, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -14, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-xl bg-white dark:bg-ink-900 rounded-2xl shadow-2xl border border-ink-200 dark:border-ink-700 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 border-b border-ink-100 dark:border-ink-800">
                <Search size={17} className="text-ink-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setActive(0); }}
                  onKeyDown={onKeyDown}
                  placeholder="Search cards, plans, guides, jargon…"
                  className="flex-1 bg-transparent py-4 text-sm text-ink-800 dark:text-ink-100 placeholder:text-ink-400 focus:outline-none"
                />
                <kbd className="text-[10px] font-bold text-ink-400 border border-ink-200 dark:border-ink-700 rounded px-1.5 py-0.5 shrink-0">ESC</kbd>
              </div>

              <div className="max-h-[54vh] overflow-y-auto no-scrollbar p-2">
                {results.length === 0 ? (
                  <p className="text-sm text-ink-400 text-center py-10">No match for “{q}”</p>
                ) : (
                  results.map((r, i) => (
                    <button key={r.href + r.label} onClick={() => go(r)} onMouseEnter={() => setActive(i)}
                      className={cx('w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                        i === active ? 'bg-brand-50 dark:bg-brand-500/10' : 'hover:bg-ink-50 dark:hover:bg-ink-800')}>
                      <span className={cx('chip shrink-0 !text-[10px]', KIND_CLS[r.kind])}>{r.kind}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink-900 dark:text-white truncate">{r.label}</span>
                        <span className="block text-xs text-ink-400 truncate">{r.hint}</span>
                      </span>
                      {r.badge && (
                        <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 shrink-0 !text-[10px]">
                          {r.badge}
                        </span>
                      )}
                      {i === active && <CornerDownLeft size={14} className="text-ink-400 shrink-0" />}
                    </button>
                  ))
                )}
              </div>

              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-ink-100 dark:border-ink-800 text-[11px] text-ink-400">
                <span>↑↓ navigate</span><span>↵ open</span><span className="ml-auto">{results.length} results</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
