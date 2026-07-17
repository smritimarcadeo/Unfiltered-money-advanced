'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Check, ChevronRight, Info, ShieldCheck, Lock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { PRODUCTS, CATEGORIES } from '@/data/products';
import { approvalOdds, ODDS_META, getSlug } from '@/lib/engine';
import { cx } from '@/lib/format';

const STEPS = [
  {
    id: 'category', label: 'What are you looking for?', type: 'single',
    options: [
      { id: 'credit-cards', label: 'A credit card', icon: '💳' },
      { id: 'loans', label: 'A loan', icon: '🏦' },
      { id: 'insurance', label: 'Insurance', icon: '🛡️' },
      { id: 'investments', label: 'To invest', icon: '📈' },
    ],
  },
  {
    id: 'age', label: 'How old are you?', type: 'single',
    options: [
      { id: '22', label: 'Under 25', icon: '🌱' },
      { id: '30', label: '25 – 35', icon: '💼' },
      { id: '42', label: '35 – 50', icon: '🧭' },
      { id: '58', label: '50 – 65', icon: '🌤️' },
      { id: '68', label: 'Over 65', icon: '🌳' },
    ],
  },
  {
    id: 'income', label: 'Your annual income?', type: 'single',
    options: [
      { id: '0', label: 'No steady income', icon: '📄' },
      { id: '3', label: 'Under ₹4 lakh', icon: '🌱' },
      { id: '6', label: '₹4 – 8 lakh', icon: '💼' },
      { id: '12', label: '₹8 – 15 lakh', icon: '📊' },
      { id: '25', label: 'Over ₹15 lakh', icon: '💎' },
    ],
  },
];

const TONE_BG = {
  high: 'bg-gradient-to-br from-brand-600 to-emerald-700',
  medium: 'bg-gradient-to-br from-amber-500 to-amber-600',
  low: 'bg-gradient-to-br from-rose-500 to-rose-700',
};

export default function EligibilityWizard() {
  const { setProfile } = useStore();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const q = STEPS[step];

  const choose = (id) => {
    const next = { ...answers, [q.id]: id };
    setAnswers(next);
    setTimeout(() => {
      if (step < STEPS.length - 1) setStep((s) => s + 1);
      else {
        // Persist so every product card across the site reflects it too.
        setProfile({ age: Number(next.age), incomeLakh: Number(next.income) });
        setDone(true);
      }
    }, 240);
  };

  const reset = () => { setAnswers({}); setStep(0); setDone(false); };

  const results = useMemo(() => {
    if (!done) return [];
    const profile = { age: Number(answers.age), incomeLakh: Number(answers.income) };
    return PRODUCTS
      .filter((p) => p.category === answers.category)
      .map((p) => ({ product: p, odds: approvalOdds(p, profile) }))
      .sort((a, b) => (b.odds.pct ?? 0) - (a.odds.pct ?? 0));
  }, [done, answers]);

  // ── Results ──
  if (done) {
    const eligible = results.filter((r) => r.odds.level !== 'low');
    const cat = CATEGORIES.find((c) => c.slug === answers.category);

    return (
      <div>
        <div className="text-center max-w-2xl mx-auto">
          <span className="section-eyebrow justify-center"><ShieldCheck size={14} /> Your odds</span>
          <h2 className="heading-xl text-3xl mt-3">
            You're likely eligible for {eligible.length} of {results.length} {cat?.label.toLowerCase()}
          </h2>
          <p className="text-ink-500 dark:text-ink-400 mt-3">
            Based on age {answers.age} and {answers.income === '0' ? 'no steady income' : `₹${answers.income}L/year`}.
            Saved to your browser — every product page now shows your odds.
          </p>
          <button onClick={reset} className="btn-ghost mt-5 mx-auto text-sm"><RotateCcw size={15} /> Start over</button>
        </div>

        <div className="space-y-3 mt-10 max-w-3xl mx-auto">
          {results.map((r, i) => {
            const meta = ODDS_META[r.odds.level];
            return (
              <motion.div key={r.product.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.4) }}
                className="card-surface p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <span className={cx('grid place-items-center rounded-2xl w-16 h-16 text-white shrink-0', TONE_BG[r.odds.level] || 'bg-ink-400')}>
                    <span className="font-display font-extrabold text-lg">{r.odds.pct}%</span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-bold text-ink-900 dark:text-white">{r.product.name}</p>
                    <p className="text-xs text-ink-400">{r.product.provider} · {meta.label}</p>
                    <ul className="mt-2 space-y-1">
                      {r.odds.reasons.map((x, j) => (
                        <li key={j} className="text-xs text-rose-600 dark:text-rose-300">✕ {x}</li>
                      ))}
                      {r.odds.positives?.slice(0, 2).map((x, j) => (
                        <li key={j} className="text-xs text-ink-500 dark:text-ink-400 flex items-start gap-1.5">
                          <Check size={12} className="text-brand-500 mt-0.5 shrink-0" />{x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href={`/${r.product.category}/${getSlug(r.product)}`} className="btn-ghost text-sm shrink-0">
                    X-Ray <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="flex items-start gap-2 text-xs text-ink-400 mt-8 max-w-3xl mx-auto">
          <Info size={13} className="mt-0.5 shrink-0" />
          Rule-based only — we compare you to each provider's published criteria. No credit bureau is
          contacted and this is <strong>not</strong> an approval. The issuer still decides, and your
          credit history matters as much as your income.
        </p>
      </div>
    );
  }

  // ── Wizard ──
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2 text-xs font-semibold text-ink-400">
        <span>Eligibility Wizard</span>
        <span>Step {step + 1} of {STEPS.length}</span>
      </div>
      <div className="h-1.5 rounded-full bg-ink-200 dark:bg-ink-800 overflow-hidden">
        <motion.div className="h-full bg-brand-600 rounded-full"
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28 }} className="mt-8">
          <h2 className="heading-xl text-2xl sm:text-3xl">{q.label}</h2>

          <div className={cx('grid gap-3 mt-6', q.options.length > 3 ? 'sm:grid-cols-2' : '')}>
            {q.options.map((opt) => {
              const sel = answers[q.id] === opt.id;
              return (
                <motion.button key={opt.id} whileTap={{ scale: 0.98 }} onClick={() => choose(opt.id)}
                  className={cx('flex items-center gap-4 text-left rounded-2xl border-2 p-4 transition-all',
                    sel ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-500/10 shadow-lift'
                      : 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 hover:border-brand-300')}>
                  <span className="text-2xl shrink-0">{opt.icon}</span>
                  <span className="flex-1 font-semibold text-ink-800 dark:text-ink-100">{opt.label}</span>
                  <span className={cx('grid place-items-center w-6 h-6 rounded-full border-2 shrink-0',
                    sel ? 'bg-brand-600 border-brand-600 text-white' : 'border-ink-300 dark:border-ink-600')}>
                    {sel && <Check size={14} />}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between mt-8">
        <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="btn-ghost text-sm disabled:opacity-40">
          <ArrowLeft size={15} /> Back
        </button>
        <span className="flex items-center gap-1.5 text-xs text-ink-400"><Lock size={12} /> Stays in your browser</span>
      </div>
    </div>
  );
}
