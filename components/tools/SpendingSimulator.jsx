'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy, ChevronRight, Info } from 'lucide-react';
import { SPEND_CATEGORIES, defaultSpend, rankBySpend, totalMonthlySpend, getSlug } from '@/lib/engine';
import { inr, cx } from '@/lib/format';

const PRESETS = [
  { id: 'balanced', label: 'Balanced', spend: null },
  { id: 'online', label: 'Online shopper', spend: { online: 30000, travel: 2000, fuel: 1000, dining: 3000, bills: 4000, groceries: 5000, entertainment: 2000, other: 3000 } },
  { id: 'commuter', label: 'Daily commuter', spend: { online: 4000, travel: 1000, fuel: 12000, dining: 3000, bills: 5000, groceries: 6000, entertainment: 1000, other: 3000 } },
  { id: 'traveller', label: 'Frequent flyer', spend: { online: 6000, travel: 25000, fuel: 2000, dining: 9000, bills: 4000, groceries: 4000, entertainment: 4000, other: 5000 } },
];

export default function SpendingSimulator() {
  const [spend, setSpend] = useState(defaultSpend);
  const [preset, setPreset] = useState('balanced');

  const ranked = useMemo(() => rankBySpend('credit-cards', spend), [spend]);
  const monthly = totalMonthlySpend(spend);
  const best = ranked[0];

  const set = (id, val) => { setSpend((s) => ({ ...s, [id]: val })); setPreset(null); };
  const applyPreset = (p) => { setSpend(p.spend ? { ...p.spend } : defaultSpend()); setPreset(p.id); };

  return (
    <div className="grid lg:grid-cols-[380px_1fr] gap-6 items-start">
      {/* controls */}
      <div className="card-surface p-6 lg:sticky lg:top-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-ink-900 dark:text-white">Your monthly spend</h2>
          <button onClick={() => applyPreset(PRESETS[0])} className="text-xs font-semibold text-ink-400 hover:text-brand-600 inline-flex items-center gap-1">
            <RotateCcw size={12} /> Reset
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {PRESETS.map((p) => (
            <button key={p.id} onClick={() => applyPreset(p)}
              className={cx('rounded-full px-3 py-1.5 text-xs font-semibold border transition',
                preset === p.id ? 'bg-brand-600 border-brand-600 text-white'
                  : 'border-ink-300 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:border-brand-400')}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="space-y-3.5">
          {SPEND_CATEGORIES.map((c) => (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 flex items-center gap-1.5">
                  <span>{c.icon}</span> {c.label}
                </label>
                <span className="text-xs font-bold text-ink-900 dark:text-white">{inr(spend[c.id])}</span>
              </div>
              <input type="range" min={0} max={50000} step={500} value={spend[c.id]}
                onChange={(e) => set(c.id, Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer" />
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-brand-50 dark:bg-brand-500/10 p-4 text-center">
          <p className="text-xs font-semibold text-brand-700 dark:text-brand-300">You spend</p>
          <p className="font-display font-extrabold text-2xl text-brand-700 dark:text-brand-300 mt-0.5">{inr(monthly)}<span className="text-sm font-bold">/mo</span></p>
          <p className="text-xs text-brand-600/80 dark:text-brand-400/80 mt-0.5">{inr(monthly * 12)} a year</p>
        </div>
      </div>

      {/* leaderboard */}
      <div>
        {best && (
          <motion.div layout className="rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-700 p-6 text-white mb-4">
            <div className="flex items-center gap-2 text-brand-50/90 text-xs font-bold uppercase tracking-wide">
              <Trophy size={14} /> Best card for your spend
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={best.product.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="flex flex-wrap items-end justify-between gap-4 mt-3">
                <div>
                  <p className="font-display font-extrabold text-2xl">{best.product.name}</p>
                  <p className="text-sm text-brand-50/90 mt-0.5">{best.product.provider}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-extrabold text-3xl">{inr(best.value.net)}</p>
                  <p className="text-xs text-brand-50/90">net value / year</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        <div className="space-y-2.5">
          {ranked.map((x, i) => {
            const { product: p, value: v } = x;
            const lead = ranked[0].value.net;
            const pct = lead > 0 ? Math.max(4, (v.net / lead) * 100) : 4;
            return (
              <motion.div key={p.id} layout
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className={cx('card-surface p-4', i === 0 && 'border-brand-400 dark:border-brand-500/60')}>
                <div className="flex items-center gap-3">
                  <span className={cx('grid place-items-center w-7 h-7 rounded-full text-xs font-bold shrink-0',
                    i === 0 ? 'bg-brand-600 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-500')}>{i + 1}</span>
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-600 text-white text-xs font-bold shrink-0">{p.logo}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-ink-400">
                      {v.effectiveRate.toFixed(2)}% effective
                      {v.fee > 0 ? ` · ${inr(v.fee)} fee` : v.rawFee > 0 ? ' · fee waived' : ' · no fee'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <motion.p layout className={cx('font-display font-extrabold', v.net >= 0 ? 'text-ink-900 dark:text-white' : 'text-rose-500')}>
                      {v.net >= 0 ? inr(v.net) : `−${inr(Math.abs(v.net))}`}
                    </motion.p>
                    <p className="text-[10px] uppercase text-ink-400">per year</p>
                  </div>
                  <Link href={`/credit-cards/${getSlug(p)}`} aria-label={`X-Ray for ${p.name}`}
                    className="grid place-items-center w-8 h-8 rounded-full text-ink-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-500/10 shrink-0">
                    <ChevronRight size={17} />
                  </Link>
                </div>
                <div className="h-1.5 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden mt-3">
                  <motion.div layout className={cx('h-full rounded-full', i === 0 ? 'bg-brand-600' : 'bg-brand-300 dark:bg-brand-500/50')}
                    animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 200, damping: 28 }} />
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="flex items-start gap-2 text-xs text-ink-400 mt-5">
          <Info size={13} className="mt-0.5 shrink-0" />
          Net value = rewards earned at your spend, minus the annual fee (waivers and monthly caps applied).
          Uses the same engine as every X-Ray page, so the numbers always agree. Illustrative sample data.
        </p>
      </div>
    </div>
  );
}
