'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Check, Link2, Printer } from 'lucide-react';
import { getFinder } from '@/data/finder';
import { getByCategory } from '@/data/products';
import { recommend } from '@/lib/recommend';
import { cx } from '@/lib/format';
import ProductGrid from '@/components/product/ProductGrid';

// Answers <-> URL query, so a result page can be shared or bookmarked.
// Multi-select answers are stored comma-separated: ?priority=claim,tax
function answersToQuery(answers) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(answers)) {
    if (v == null) continue;
    p.set(k, Array.isArray(v) ? v.join(',') : v);
  }
  return p.toString();
}

function queryToAnswers(searchParams, questions) {
  const out = {};
  for (const q of questions) {
    const raw = searchParams.get(q.id);
    if (!raw) continue;
    const ids = raw.split(',').filter(Boolean);
    const valid = ids.filter((id) => q.options.some((o) => o.id === id));
    if (!valid.length) continue;
    out[q.id] = q.type === 'multi' ? valid : valid[0];
  }
  return out;
}

export default function Finder({ category }) {
  const config = getFinder(category);
  const questions = config.questions;
  const products = useMemo(() => getByCategory(category), [category]);
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  // Restore a shared result link on first load.
  useEffect(() => {
    const restored = queryToAnswers(searchParams, questions);
    if (Object.keys(restored).length === questions.length) {
      setAnswers(restored);
      setDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}?${answersToQuery(answers)}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const q = questions[step];
  const progress = ((step + (done ? 1 : 0)) / questions.length) * 100;

  const isSelected = (optId) => {
    const a = answers[q.id];
    return Array.isArray(a) ? a.includes(optId) : a === optId;
  };

  const choose = (optId) => {
    setAnswers((prev) => {
      if (q.type === 'multi') {
        const cur = Array.isArray(prev[q.id]) ? prev[q.id] : [];
        const next = cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId];
        return { ...prev, [q.id]: next };
      }
      return { ...prev, [q.id]: optId };
    });
    // auto-advance for single-select
    if (q.type !== 'multi') {
      setTimeout(() => next(optId), 260);
    }
  };

  const canProceed = () => {
    const a = answers[q.id];
    return Array.isArray(a) ? a.length > 0 : a != null;
  };

  const next = (justPicked) => {
    // for single-select we pass the freshly picked value so state race doesn't block
    const a = justPicked ?? answers[q.id];
    const has = Array.isArray(a) ? a.length > 0 : a != null;
    if (!has) return;
    if (step < questions.length - 1) setStep((s) => s + 1);
    else setDone(true);
  };

  const back = () => {
    if (done) { setDone(false); return; }
    if (step > 0) setStep((s) => s - 1);
  };

  const reset = () => { setAnswers({}); setStep(0); setDone(false); };

  const results = useMemo(() => {
    if (!done) return [];
    return recommend(products, questions, answers);
  }, [done, products, questions, answers]);

  // ── Results view ──
  if (done) {
    const top = results.slice(0, 3);
    const rest = results.slice(3);
    return (
      <div className="container-page py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
          <span className="section-eyebrow justify-center"><Sparkles size={14} /> Your personalised matches</span>
          <h1 className="heading-xl text-3xl sm:text-4xl mt-3">Here's what fits you best</h1>
          <p className="text-ink-500 dark:text-ink-400 mt-3">Based on your answers, ranked by how well each option matches — with the reasons why. Not sponsored-first.</p>
          <div className="no-print mt-5 flex flex-wrap justify-center gap-2">
            <button onClick={reset} className="btn-ghost text-sm"><RotateCcw size={15} /> Retake</button>
            <button onClick={shareLink} className="btn-ghost text-sm">
              <Link2 size={15} /> {copied ? 'Link copied!' : 'Share my result'}
            </button>
            <button onClick={() => window.print()} className="btn-ghost text-sm"><Printer size={15} /> Save as PDF</button>
          </div>
          <p className="text-xs text-ink-400 mt-3">
            Sharing copies a link with your answers in it — no personal data, nothing stored on our side.
          </p>
        </motion.div>

        <div className="mt-10">
          <h2 className="font-display font-bold text-ink-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-600 text-white text-xs">1</span> Your top 3 picks
          </h2>
          <ProductGrid products={top} showMatch />
        </div>

        {rest.length > 0 && (
          <div className="mt-12">
            <h2 className="font-display font-bold text-ink-900 dark:text-white mb-4">Other options worth a look</h2>
            <ProductGrid products={rest} showMatch />
          </div>
        )}
      </div>
    );
  }

  // ── Quiz view ──
  return (
    <div className="container-page py-10 sm:py-14">
      <div className="max-w-2xl mx-auto">
        {/* progress */}
        <div className="flex items-center justify-between mb-2 text-xs font-semibold text-ink-400">
          <span>{config.title}</span>
          <span>Question {step + 1} of {questions.length}</span>
        </div>
        <div className="h-1.5 rounded-full bg-ink-200 dark:bg-ink-800 overflow-hidden">
          <motion.div className="h-full bg-brand-600 rounded-full" animate={{ width: `${((step + 1) / questions.length) * 100}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.28 }}
            className="mt-8"
          >
            <h1 className="heading-xl text-2xl sm:text-3xl">{q.label}</h1>
            {q.type === 'multi' && <p className="text-sm text-ink-400 mt-1">Select all that apply</p>}

            <div className={cx('grid gap-3 mt-6', q.options.length > 3 ? 'sm:grid-cols-2' : 'sm:grid-cols-1')}>
              {q.options.map((opt) => {
                const sel = isSelected(opt.id);
                return (
                  <motion.button
                    key={opt.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => choose(opt.id)}
                    className={cx(
                      'flex items-center gap-4 text-left rounded-2xl border-2 p-4 transition-all',
                      sel
                        ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-500/10 shadow-lift'
                        : 'border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 hover:border-brand-300'
                    )}
                  >
                    <span className="text-2xl shrink-0">{opt.icon}</span>
                    <span className="flex-1 font-semibold text-ink-800 dark:text-ink-100">{opt.label}</span>
                    <span className={cx('grid place-items-center w-6 h-6 rounded-full border-2 shrink-0 transition',
                      sel ? 'bg-brand-600 border-brand-600 text-white' : 'border-ink-300 dark:border-ink-600')}>
                      {sel && <Check size={14} />}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* nav */}
        <div className="flex items-center justify-between mt-8">
          <button onClick={back} disabled={step === 0} className="btn-ghost text-sm disabled:opacity-40">
            <ArrowLeft size={15} /> Back
          </button>
          {q.type === 'multi' ? (
            <button onClick={() => next()} disabled={!canProceed()} className="btn-primary text-sm disabled:opacity-50">
              {step === questions.length - 1 ? 'See my matches' : 'Next'} <ArrowRight size={15} />
            </button>
          ) : (
            <span className="text-xs text-ink-400">Pick one to continue</span>
          )}
        </div>
      </div>
    </div>
  );
}
