'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Check, ArrowRight, ArrowUpRight, Trash2, ChevronRight, Info, Sparkles } from 'lucide-react';
import { getByCategory } from '@/data/products';
import { SPEND_CATEGORIES, defaultSpend, totalMonthlySpend, getSlug } from '@/lib/engine';
import { optimiseWallet, VERDICT } from '@/lib/wallet';
import { inr, cx } from '@/lib/format';

const TONE = {
  good: 'bg-brand-600 text-white',
  warn: 'bg-amber-500 text-white',
  bad: 'bg-rose-500 text-white',
};
const ICON = { keep: Check, replace: ArrowUpRight, remove: Trash2 };

export default function WalletOptimizer() {
  const cards = useMemo(() => getByCategory('credit-cards'), []);
  const [held, setHeld] = useState([]);
  const [spend, setSpend] = useState(defaultSpend);
  const [step, setStep] = useState('pick'); // pick -> spend -> result

  const result = useMemo(
    () => (held.length ? optimiseWallet(held, spend) : null),
    [held, spend]
  );

  const toggle = (id) => setHeld((h) => (h.includes(id) ? h.filter((x) => x !== id) : [...h, id]));
  const set = (id, val) => setSpend((s) => ({ ...s, [id]: val }));

  return (
    <div>
      {/* steps */}
      <div className="flex items-center gap-2 mb-6">
        {[['pick', 'Your cards'], ['spend', 'Your spend'], ['result', 'Verdict']].map(([id, label], i) => (
          <button key={id} onClick={() => (id === 'result' && !held.length ? null : setStep(id))}
            disabled={id !== 'pick' && !held.length}
            className={cx('flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition disabled:opacity-40',
              step === id ? 'bg-brand-600 text-white' : 'bg-ink-100 dark:bg-ink-800 text-ink-500 hover:text-brand-600')}>
            <span className={cx('grid place-items-center w-5 h-5 rounded-full text-[10px] font-bold',
              step === id ? 'bg-white/20' : 'bg-ink-200 dark:bg-ink-700')}>{i + 1}</span>
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── 1. pick cards ── */}
        {step === 'pick' && (
          <motion.div key="pick" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <h2 className="font-display font-bold text-xl text-ink-900 dark:text-white">Which cards do you already hold?</h2>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Pick as many as apply. Nothing leaves your browser.</p>

            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              {cards.map((c) => {
                const on = held.includes(c.id);
                return (
                  <motion.button key={c.id} whileTap={{ scale: 0.98 }} onClick={() => toggle(c.id)}
                    className={cx('flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition',
                      on ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-500/10 shadow-lift'
                        : 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 hover:border-brand-300')}>
                    <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-600 text-white text-xs font-bold shrink-0">{c.logo}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-ink-900 dark:text-white truncate">{c.name}</span>
                      <span className="block text-xs text-ink-400">{c.provider}</span>
                    </span>
                    <span className={cx('grid place-items-center w-6 h-6 rounded-full border-2 shrink-0',
                      on ? 'bg-brand-600 border-brand-600 text-white' : 'border-ink-300 dark:border-ink-600')}>
                      {on && <Check size={14} />}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-ink-400">{held.length} selected</p>
              <button onClick={() => setStep('spend')} disabled={!held.length} className="btn-primary disabled:opacity-50">
                Next: your spend <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* ── 2. spend ── */}
        {step === 'spend' && (
          <motion.div key="spend" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <h2 className="font-display font-bold text-xl text-ink-900 dark:text-white">Roughly what do you spend each month?</h2>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">Rough is fine — we only need the shape of your spending.</p>

            <div className="card-surface p-6 mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {SPEND_CATEGORIES.map((c) => (
                <div key={c.id}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-ink-600 dark:text-ink-300 flex items-center gap-1.5">
                      <span>{c.icon}</span> {c.label}
                    </label>
                    <span className="text-xs font-bold text-ink-900 dark:text-white">{inr(spend[c.id])}</span>
                  </div>
                  <input type="range" min={0} max={50000} step={500} value={spend[c.id]}
                    onChange={(e) => set(c.id, Number(e.target.value))} className="w-full accent-brand-600 cursor-pointer" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-ink-400">{inr(totalMonthlySpend(spend))}/month</p>
              <div className="flex gap-2">
                <button onClick={() => setStep('pick')} className="btn-ghost">Back</button>
                <button onClick={() => setStep('result')} className="btn-primary">See my verdict <Sparkles size={16} /></button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 3. result ── */}
        {step === 'result' && result && (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            {/* summary */}
            <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-700 p-6 text-white">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-brand-50/90">Your wallet earns</p>
                  <p className="font-display font-extrabold text-4xl mt-1">{inr(result.currentNet)}<span className="text-base font-bold">/yr</span></p>
                  <p className="text-sm text-brand-50/90 mt-1">across {result.rows.length} card{result.rows.length > 1 ? 's' : ''} at {inr(totalMonthlySpend(spend))}/mo</p>
                </div>
                {result.missing && result.missedGain > 500 && (
                  <div className="text-right">
                    <p className="text-xs text-brand-50/90">You're leaving on the table</p>
                    <p className="font-display font-extrabold text-2xl">+{inr(result.missedGain)}/yr</p>
                    <p className="text-xs text-brand-50/90">with {result.missing.product.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* verdicts */}
            <div className="space-y-3 mt-4">
              {result.rows.map((r) => {
                const meta = VERDICT[r.verdict];
                const Icon = ICON[r.verdict];
                return (
                  <motion.div key={r.product.id} layout className="card-surface p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-600 text-white text-xs font-bold shrink-0">{r.product.logo}</span>
                        <div className="min-w-0">
                          <p className="font-display font-bold text-ink-900 dark:text-white">{r.product.name}</p>
                          <p className="text-xs text-ink-400 mt-0.5">
                            {inr(r.value.gross)} rewards {r.value.fee > 0 ? `− ${inr(r.value.fee)} fee` : '· no fee charged'}
                            {' · '}{r.value.effectiveRate.toFixed(2)}% effective
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={cx('font-display font-extrabold', r.value.net >= 0 ? 'text-ink-900 dark:text-white' : 'text-rose-500')}>
                          {r.value.net >= 0 ? inr(r.value.net) : `−${inr(Math.abs(r.value.net))}`}
                        </span>
                        <span className={cx('chip !px-3 !py-1.5 font-bold', TONE[meta.tone])}>
                          <Icon size={13} /> {meta.label}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-ink-600 dark:text-ink-300 mt-3">{r.reason}</p>

                    {r.upgrade && (
                      <Link href={`/credit-cards/${getSlug(r.upgrade)}`}
                        className="mt-3 flex items-center gap-3 rounded-xl border border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5 p-3 hover:border-brand-400 transition">
                        <ArrowUpRight size={16} className="text-brand-600 shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs text-ink-400">Swap to</span>
                          <span className="block text-sm font-bold text-ink-900 dark:text-white truncate">{r.upgrade.name}</span>
                        </span>
                        <span className="text-sm font-bold text-brand-600 shrink-0">+{inr(r.delta)}/yr</span>
                        <ChevronRight size={15} className="text-ink-300 shrink-0" />
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <button onClick={() => setStep('pick')} className="btn-ghost text-sm">Change my cards</button>
              <button onClick={() => setStep('spend')} className="btn-ghost text-sm">Adjust my spend</button>
              <Link href="/tools/spending-simulator" className="btn-ghost text-sm">Compare every card <ArrowRight size={14} /></Link>
            </div>

            <p className="flex items-start gap-2 text-xs text-ink-400 mt-5">
              <Info size={13} className="mt-0.5 shrink-0" />
              "Replace" only fires when another card beats yours by more than ₹1,500/year — below that,
              switching isn't worth the paperwork. Same engine as every X-Ray page. Illustrative sample data.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
