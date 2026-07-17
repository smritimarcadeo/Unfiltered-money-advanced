'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { SPEND_CATEGORIES, defaultSpend, yearlyValue, totalMonthlySpend } from '@/lib/engine';
import { inr, cx } from '@/lib/format';

export default function RewardCalculator({ product }) {
  const [spend, setSpend] = useState(defaultSpend);
  const v = useMemo(() => yearlyValue(product, spend), [product, spend]);
  if (!v) return null;

  const set = (id, val) => setSpend((s) => ({ ...s, [id]: val }));
  const monthly = totalMonthlySpend(spend);

  return (
    <section className="card-surface p-6">
      <div className="flex items-center gap-2 mb-1">
        <Calculator size={18} className="text-brand-600" />
        <h2 className="font-display font-extrabold text-xl text-ink-900 dark:text-white">What it's actually worth to you</h2>
      </div>
      <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
        Move the sliders to your real monthly spend. This is net value — rewards minus the fee, with caps applied.
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* sliders */}
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
          <p className="text-xs text-ink-400 pt-1">Total: <strong className="text-ink-600 dark:text-ink-300">{inr(monthly)}/month</strong> · {inr(monthly * 12)}/year</p>
        </div>

        {/* result */}
        <div className="space-y-3">
          <motion.div
            key={Math.round(v.net)}
            initial={{ scale: 0.98, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }}
            className={cx('rounded-3xl p-6 text-center text-white',
              v.net >= 0 ? 'bg-gradient-to-br from-brand-600 to-emerald-700' : 'bg-gradient-to-br from-rose-500 to-rose-700')}
          >
            <p className="text-sm text-white/80">Net value per year</p>
            <p className="font-display font-extrabold text-4xl mt-1">{v.net >= 0 ? inr(v.net) : `−${inr(Math.abs(v.net))}`}</p>
            <p className="text-xs text-white/80 mt-2">
              {inr(v.gross)} rewards {v.fee > 0 ? `− ${inr(v.fee)} fee` : v.rawFee > 0 ? '· fee waived at your spend' : '· no annual fee'}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-ink-50 dark:bg-ink-800 p-4 text-center">
              <p className="font-display font-extrabold text-lg text-ink-900 dark:text-white">{v.effectiveRate.toFixed(2)}%</p>
              <p className="text-[11px] uppercase tracking-wide text-ink-400 mt-0.5">Effective rate</p>
            </div>
            <div className="rounded-2xl bg-ink-50 dark:bg-ink-800 p-4 text-center">
              <p className="font-display font-extrabold text-lg text-ink-900 dark:text-white">
                {v.rawFee > 0 ? inr(v.breakEven) : '—'}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-ink-400 mt-0.5">Break-even spend/yr</p>
            </div>
          </div>

          {v.rawFee > 0 && v.annualSpend < v.breakEven && (
            <p className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              At this spend the fee costs more than you earn. You'd need {inr(v.breakEven)}/year to break even.
            </p>
          )}

          {/* where the value comes from */}
          <div className="rounded-2xl border border-ink-200 dark:border-ink-700 p-4">
            <p className="text-xs font-bold text-ink-500 mb-2 flex items-center gap-1.5"><TrendingUp size={13} /> Where it comes from</p>
            <div className="space-y-1.5">
              {v.perCategory.filter((c) => c.earned > 0).sort((a, b) => b.earned - a.earned).slice(0, 4).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs">
                  <span className="text-ink-600 dark:text-ink-300">{c.icon} {c.label} <span className="text-ink-400">@ {c.rate}%</span></span>
                  <span className="font-bold text-ink-900 dark:text-white">{inr(c.earned * 12)}/yr</span>
                </div>
              ))}
              {v.perCategory.every((c) => c.earned === 0) && (
                <p className="text-xs text-ink-400">No rewards at this spend mix.</p>
              )}
            </div>
          </div>

          <Link href="/tools/spending-simulator" className="btn-ghost w-full justify-center text-sm py-2.5">
            Compare every card at this spend <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
