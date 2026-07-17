'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trophy, Star, Check, Scale, ChevronRight, Info, Gauge } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PRODUCTS, getById, CATEGORIES } from '@/data/products';
import { getXray, SPEND_CATEGORIES } from '@/data/xray';
import { unfilteredScore, yearlyValue, defaultSpend, totalMonthlySpend, getSlug } from '@/lib/engine';
import { inr, cx } from '@/lib/format';

// Rows are built from whatever the selected products actually have,
// so this works for any category — not just cards.
function buildRows(items, values) {
  const rows = [
    { key: 'score', label: 'Unfiltered Score', get: (p) => unfilteredScore(p), best: 'max', render: (v) => `${v}/100` },
    { key: 'decision', label: 'Our decision', get: (p) => getXray(p.id)?.decision?.call || '—' },
    { key: 'rating', label: 'Rating', get: (p) => p.rating, best: 'max' },
    { key: 'bestFor', label: 'Best for', get: (p) => p.bestFor },
  ];

  const labels = [];
  items.forEach((p) => p.highlights.forEach((h) => { if (!labels.includes(h.label)) labels.push(h.label); }));
  labels.forEach((label) => {
    rows.push({ key: 'h-' + label, label, get: (p) => p.highlights.find((h) => h.label === label)?.value || '—' });
  });

  rows.push({
    key: 'cost', label: 'Cost',
    get: (p) => (p.attrs.price ? `₹${p.attrs.price.toLocaleString('en-IN')}${p.attrs.priceUnit}` : 'Free'),
    num: (p) => p.attrs.price,
  });

  // Live net value — only when every selected product is a card.
  if (values) {
    rows.push({
      key: 'net', label: 'Net value / year (your spend)',
      get: (p) => inr(values[p.id]?.net ?? 0),
      numMax: (p) => values[p.id]?.net ?? 0,
      highlight: true,
    });
    rows.push({
      key: 'eff', label: 'Effective rate',
      get: (p) => `${(values[p.id]?.effectiveRate ?? 0).toFixed(2)}%`,
      numMax: (p) => values[p.id]?.effectiveRate ?? 0,
    });
  }

  rows.push({ key: 'catch', label: 'The main catch', get: (p) => p.exclusions?.[0] || '—', wrap: true });
  return rows;
}

export default function CompareWorkspace() {
  const { compare, toggleCompare, clearCompare, hydrated, MAX_COMPARE } = useStore();
  const [picker, setPicker] = useState(false);
  const [spend, setSpend] = useState(defaultSpend);
  const [showSim, setShowSim] = useState(true);

  const items = useMemo(() => (hydrated ? compare.map(getById).filter(Boolean) : []), [compare, hydrated]);

  const allCards = items.length > 0 && items.every((p) => p.category === 'credit-cards');
  const values = useMemo(() => {
    if (!allCards) return null;
    return Object.fromEntries(items.map((p) => [p.id, yearlyValue(p, spend)]));
  }, [allCards, items, spend]);

  const rows = useMemo(() => (items.length ? buildRows(items, values) : []), [items, values]);

  // Winner = best net value if we can compute it, else best score.
  const winner = useMemo(() => {
    if (!items.length) return null;
    if (values) return [...items].sort((a, b) => values[b.id].net - values[a.id].net)[0];
    return [...items].sort((a, b) => unfilteredScore(b) - unfilteredScore(a))[0];
  }, [items, values]);

  if (!hydrated) return null;

  if (!items.length) {
    return (
      <>
        <div className="card-surface grid place-items-center text-center py-20">
          <span className="grid place-items-center w-16 h-16 rounded-2xl bg-ink-100 dark:bg-ink-800 text-ink-400 mb-4"><Scale size={28} /></span>
          <p className="font-display font-bold text-ink-800 dark:text-white">Nothing to compare yet</p>
          <p className="text-sm text-ink-500 mt-1 max-w-sm">Add up to {MAX_COMPARE} products and we'll line them up — winner marked on every row.</p>
          <button onClick={() => setPicker(true)} className="btn-primary mt-5 text-sm"><Plus size={15} /> Add products</button>
        </div>
        <Picker open={picker} onClose={() => setPicker(false)} items={items} toggle={toggleCompare} max={MAX_COMPARE} />
      </>
    );
  }

  return (
    <>
      {/* spend simulator (cards only) */}
      {allCards && (
        <div className="card-surface p-5 mb-4">
          <button onClick={() => setShowSim((s) => !s)} className="flex items-center gap-2 w-full text-left">
            <Gauge size={17} className="text-brand-600" />
            <span className="font-display font-bold text-ink-900 dark:text-white">Live spend simulator</span>
            <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 ml-2">{inr(totalMonthlySpend(spend))}/mo</span>
            <ChevronRight size={16} className={cx('ml-auto text-ink-400 transition', showSim && 'rotate-90')} />
          </button>
          <AnimatePresence initial={false}>
            {showSim && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-3 pt-4">
                  {SPEND_CATEGORIES.map((c) => (
                    <div key={c.id}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-ink-600 dark:text-ink-300">{c.icon} {c.label}</label>
                        <span className="text-[11px] font-bold text-ink-900 dark:text-white">{inr(spend[c.id])}</span>
                      </div>
                      <input type="range" min={0} max={50000} step={500} value={spend[c.id]}
                        onChange={(e) => setSpend((s) => ({ ...s, [c.id]: Number(e.target.value) }))}
                        className="w-full accent-brand-600 cursor-pointer" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-400 mt-3">Net value and effective rate below update live as you move these.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* toolbar */}
      <div className="flex items-center gap-2 mb-4">
        <p className="text-sm font-semibold text-ink-500">{items.length}/{MAX_COMPARE} selected</p>
        <button onClick={() => setPicker(true)} disabled={items.length >= MAX_COMPARE} className="btn-ghost text-sm py-2 disabled:opacity-40">
          <Plus size={14} /> Add
        </button>
        <button onClick={clearCompare} className="text-xs font-semibold text-ink-400 hover:text-rose-500 ml-auto">Clear all</button>
      </div>

      {/* table */}
      <div className="card-surface p-4 sm:p-6 overflow-x-auto">
        <table className="w-full border-collapse min-w-[760px]">
          <thead>
            <tr>
              <th className="text-left w-40"></th>
              {items.map((p) => (
                <th key={p.id} className="p-2 align-top">
                  <div className={cx('relative rounded-2xl p-3 border-2',
                    p.id === winner?.id ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10' : 'border-ink-200 dark:border-ink-700')}>
                    <button onClick={() => toggleCompare(p.id)} aria-label="Remove"
                      className="absolute top-1.5 right-1.5 grid place-items-center w-6 h-6 rounded-full text-ink-400 hover:text-rose-500 hover:bg-white dark:hover:bg-ink-800">
                      <X size={13} />
                    </button>
                    {p.id === winner?.id && <span className="chip bg-brand-600 text-white mb-2"><Trophy size={11} /> Winner</span>}
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-600 text-white font-bold mx-auto">{p.logo}</span>
                    <p className="text-xs font-bold text-ink-900 dark:text-white mt-2 leading-tight">{p.name}</p>
                    <p className="text-[10px] text-ink-400">{p.provider}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              let bestId = null;
              if (row.numMax) {
                bestId = [...items].sort((a, b) => row.numMax(b) - row.numMax(a))[0]?.id;
              } else if (row.num) {
                const vals = items.map((p) => ({ id: p.id, v: row.num(p) })).filter((x) => x.v != null);
                if (vals.length) bestId = vals.sort((a, b) => a.v - b.v)[0].id;
              } else if (row.best === 'max') {
                bestId = [...items].sort((a, b) => row.get(b) - row.get(a))[0]?.id;
              }
              return (
                <tr key={row.key} className={cx('border-t border-ink-100 dark:border-ink-800', row.highlight && 'bg-brand-50/40 dark:bg-brand-500/5')}>
                  <td className="py-3 pr-3 text-xs font-bold text-ink-400 align-middle">{row.label}</td>
                  {items.map((p) => {
                    const raw = row.get(p);
                    const val = row.render ? row.render(raw) : raw;
                    return (
                      <td key={p.id} className={cx('py-3 px-2 align-middle', row.wrap ? 'text-left' : 'text-center')}>
                        <motion.span key={String(val)} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
                          className={cx('inline-flex items-center gap-1 font-semibold',
                            row.wrap ? 'text-xs leading-relaxed' : 'text-sm',
                            p.id === bestId ? 'text-brand-700 dark:text-brand-300' : 'text-ink-700 dark:text-ink-200')}>
                          {row.key === 'rating' && <Star size={12} fill="currentColor" className="text-amber-400" />}
                          {val}
                          {p.id === bestId && !row.wrap && <Check size={13} className="text-brand-500" />}
                        </motion.span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr className="border-t border-ink-100 dark:border-ink-800">
              <td></td>
              {items.map((p) => (
                <td key={p.id} className="py-3 px-2 text-center">
                  <Link href={`/${p.category}/${getSlug(p)}`} className="btn-soft text-xs w-full justify-center">
                    X-Ray <ChevronRight size={12} />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <p className="flex items-start gap-2 text-xs text-ink-400 mt-4">
        <Info size={13} className="mt-0.5 shrink-0" />
        {allCards
          ? 'Winner is the card with the highest net value at your spend — move the sliders and it can change.'
          : 'Winner is the highest Unfiltered Score. Add only credit cards to unlock the live spend simulator.'}
        {' '}Highlighted cells are the best value in each row.
      </p>

      <Picker open={picker} onClose={() => setPicker(false)} items={items} toggle={toggleCompare} max={MAX_COMPARE} />
    </>
  );
}

function Picker({ open, onClose, items, toggle, max }) {
  const [cat, setCat] = useState('credit-cards');
  const list = PRODUCTS.filter((p) => p.category === cat);
  const heldIds = items.map((p) => p.id);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
            className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto no-scrollbar bg-white dark:bg-ink-900 rounded-3xl shadow-2xl border border-ink-200 dark:border-ink-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-extrabold text-lg text-ink-900 dark:text-white">Add to compare</h3>
              <button onClick={onClose} aria-label="Close" className="grid place-items-center w-8 h-8 rounded-full text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800"><X size={18} /></button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-4">
              {CATEGORIES.map((c) => (
                <button key={c.slug} onClick={() => setCat(c.slug)}
                  className={cx('shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border transition',
                    cat === c.slug ? 'bg-brand-600 border-brand-600 text-white' : 'border-ink-300 dark:border-ink-600 text-ink-600 dark:text-ink-300')}>
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {list.map((p) => {
                const on = heldIds.includes(p.id);
                const full = heldIds.length >= max && !on;
                return (
                  <button key={p.id} onClick={() => toggle(p.id)} disabled={full}
                    className={cx('w-full flex items-center gap-3 rounded-xl border p-3 text-left transition disabled:opacity-40',
                      on ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-500/10' : 'border-ink-200 dark:border-ink-700 hover:border-brand-300')}>
                    <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand-600 text-white text-xs font-bold shrink-0">{p.logo}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-ink-900 dark:text-white truncate">{p.name}</span>
                      <span className="block text-xs text-ink-400 truncate">{p.bestFor}</span>
                    </span>
                    <span className={cx('grid place-items-center w-5 h-5 rounded-full border-2 shrink-0',
                      on ? 'bg-brand-600 border-brand-600 text-white' : 'border-ink-300 dark:border-ink-600')}>
                      {on && <Check size={12} />}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-ink-400 mt-4">Mixing categories works, but the live spend simulator only appears when every pick is a credit card.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
