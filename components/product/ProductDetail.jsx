'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, Check, Minus, Heart, Scale, ArrowRight, ShieldCheck, Info,
  Quote, Ban, CalendarClock, UserCheck, UserX, ChevronRight,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { getById, getSimilar } from '@/data/products';
import { checkEligibility } from '@/lib/eligibility';
import { getSlug } from '@/lib/engine';
import { cx } from '@/lib/format';

function ScoreBar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-ink-600 dark:text-ink-300">{label}</span>
        <span className="text-xs font-bold text-ink-900 dark:text-white">{value.toFixed(1)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-ink-200 dark:bg-ink-700 overflow-hidden">
        <motion.div
          className={cx('h-full rounded-full', value >= 9 ? 'bg-brand-600' : value >= 7.5 ? 'bg-brand-400' : 'bg-amber-400')}
          initial={{ width: 0 }} animate={{ width: `${value * 10}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { detailId, closeDetail, openDetail, isSaved, toggleSave, inCompare, toggleCompare, profile } = useStore();
  const product = detailId ? getById(detailId) : null;

  useEffect(() => {
    if (!detailId) return;
    const onKey = (e) => e.key === 'Escape' && closeDetail();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [detailId, closeDetail]);

  // Computed with guards so AnimatePresence stays mounted and the
  // exit animation still plays when `product` becomes null on close.
  const similar = product ? getSimilar(product) : [];
  const elig = product ? checkEligibility(product, profile) : { status: 'unknown', reasons: [] };

  return (
    <AnimatePresence>
      {product && (
      <motion.div
        key="detail"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={closeDetail} />
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto no-scrollbar bg-white dark:bg-ink-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-ink-200 dark:border-ink-700"
        >
          {/* header */}
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 p-5 sm:p-6 bg-white/90 dark:bg-ink-900/90 backdrop-blur border-b border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-3 min-w-0">
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-600 text-white font-bold shrink-0">{product.logo}</span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink-400">{product.provider}</p>
                <h2 className="font-display font-extrabold text-lg text-ink-900 dark:text-white leading-tight">{product.name}</h2>
              </div>
            </div>
            <button onClick={closeDetail} aria-label="Close" className="grid place-items-center w-9 h-9 rounded-full text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800 shrink-0">
              <X size={20} />
            </button>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex items-center gap-2 flex-wrap">
              {product.matchPct != null && (
                <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">{product.matchPct}% match</span>
              )}
              {elig.status !== 'unknown' && (
                <span className={cx('chip', elig.status === 'eligible'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300')}>
                  {elig.status === 'eligible' ? <UserCheck size={12} /> : <UserX size={12} />}
                  {elig.status === 'eligible' ? 'Likely eligible' : elig.reasons[0]}
                </span>
              )}
              {product.badges?.map((b) => (
                <span key={b} className="chip bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">{b}</span>
              ))}
            </div>

            <p className="text-ink-600 dark:text-ink-300 leading-relaxed">{product.tagline}</p>

            {/* highlights */}
            <div className="grid grid-cols-3 gap-3">
              {product.highlights.map((h) => (
                <div key={h.label} className="rounded-2xl bg-ink-50 dark:bg-ink-800 p-4 text-center">
                  <p className="font-display font-extrabold text-ink-900 dark:text-white">{h.value}</p>
                  <p className="text-[11px] uppercase tracking-wide text-ink-400 mt-1">{h.label}</p>
                </div>
              ))}
            </div>

            {/* our take */}
            {product.verdict && (
              <div className="rounded-2xl border-2 border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Quote size={16} className="text-brand-600" />
                  <h4 className="font-display font-bold text-brand-700 dark:text-brand-300 text-sm">Our take</h4>
                </div>
                <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">{product.verdict}</p>
              </div>
            )}

            {/* rating breakdown */}
            {product.scores && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-ink-800 dark:text-ink-100 text-sm">How we scored it</h4>
                  <Link href="/methodology" onClick={closeDetail} className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-0.5">
                    Our method <ChevronRight size={12} />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                  {product.scores.map((s) => <ScoreBar key={s.label} label={s.label} value={s.value} />)}
                </div>
              </div>
            )}

            {/* pros / cons */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5 p-4">
                <h4 className="font-bold text-brand-700 dark:text-brand-300 text-sm mb-2">Pros</h4>
                <ul className="space-y-2">
                  {product.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                      <Check size={15} className="text-brand-500 mt-0.5 shrink-0" /><span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-rose-200 dark:border-rose-500/30 bg-rose-50/50 dark:bg-rose-500/5 p-4">
                <h4 className="font-bold text-rose-600 dark:text-rose-300 text-sm mb-2">Cons</h4>
                <ul className="space-y-2">
                  {product.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                      <Minus size={15} className="text-rose-400 mt-0.5 shrink-0" /><span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* exclusions / fine print */}
            {product.exclusions && (
              <div>
                <h4 className="font-bold text-ink-800 dark:text-ink-100 text-sm mb-2 flex items-center gap-2">
                  <Ban size={16} className="text-rose-500" /> The fine print — what's not covered
                </h4>
                <ul className="rounded-2xl bg-ink-50 dark:bg-ink-800 p-4 space-y-2">
                  {product.exclusions.map((e, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-400 shrink-0" /><span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* eligibility */}
            <div>
              <h4 className="font-bold text-ink-800 dark:text-ink-100 text-sm mb-2 flex items-center gap-2"><ShieldCheck size={16} className="text-brand-500" /> Eligibility & documents</h4>
              <div className="space-y-2">
                {product.eligibility.map((e) => (
                  <div key={e.title} className="flex gap-3 rounded-xl bg-ink-50 dark:bg-ink-800 p-3">
                    <span className="text-xs font-bold text-ink-500 w-20 shrink-0">{e.title}</span>
                    <span className="text-sm text-ink-700 dark:text-ink-200">{e.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* similar */}
            {similar.length > 0 && (
              <div>
                <h4 className="font-bold text-ink-800 dark:text-ink-100 text-sm mb-2">Similar options</h4>
                <div className="space-y-2">
                  {similar.map((s) => (
                    <button key={s.id} onClick={() => openDetail(s.id)}
                      className="w-full flex items-center gap-3 rounded-xl border border-ink-200 dark:border-ink-700 p-3 hover:border-brand-400 transition text-left">
                      <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand-600 text-white text-xs font-bold shrink-0">{s.logo}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-ink-900 dark:text-white truncate">{s.name}</p>
                        <p className="text-xs text-ink-400 truncate">{s.bestFor}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* provenance */}
            <div className="rounded-xl bg-ink-50 dark:bg-ink-800 p-3 space-y-1.5">
              <p className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
                <CalendarClock size={13} className="shrink-0" />
                Last verified {new Date(product.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="flex items-start gap-2 text-xs text-ink-500 dark:text-ink-400">
                <Info size={13} className="mt-0.5 shrink-0" />
                Source: {product.source}
              </p>
              {product.sponsored && (
                <p className="flex items-start gap-2 text-xs text-ink-500 dark:text-ink-400">
                  <Info size={13} className="mt-0.5 shrink-0" />
                  Sponsored placement — we may earn a commission if you apply. It does not change the score or our take.
                </p>
              )}
            </div>
          </div>

          {/* sticky footer actions */}
          <div className="sticky bottom-0 flex items-center gap-2 p-4 bg-white/90 dark:bg-ink-900/90 backdrop-blur border-t border-ink-100 dark:border-ink-800">
            <button
              onClick={() => toggleSave(product.id)}
              className={cx('grid place-items-center w-11 h-11 rounded-full border shrink-0', isSaved(product.id) ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-ink-300 dark:border-ink-600 text-ink-500')}
              aria-label="Save"
            >
              <Heart size={18} fill={isSaved(product.id) ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => toggleCompare(product.id)}
              className={cx('btn-ghost px-4 py-2.5 text-sm shrink-0', inCompare(product.id) && 'border-brand-500 text-brand-600')}
            >
              <Scale size={16} /> {inCompare(product.id) ? 'Added' : 'Compare'}
            </button>
            <Link href={`/${product.category}/${getSlug(product)}`} onClick={closeDetail} className="btn-primary flex-1 justify-center text-sm py-2.5">
              Full Money X-Ray <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
