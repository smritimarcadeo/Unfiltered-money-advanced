'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Scale, Star, Check, ArrowRight, Sparkles, UserCheck, UserX, ScanLine } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cx, matchTone } from '@/lib/format';
import { checkEligibility } from '@/lib/eligibility';
import { getSlug } from '@/lib/engine';

const LOGO_TINTS = ['bg-brand-600', 'bg-indigo-600', 'bg-rose-500', 'bg-amber-500', 'bg-sky-600', 'bg-violet-600'];
const tint = (id) => LOGO_TINTS[(id?.length || 0) % LOGO_TINTS.length];

export default function ProductCard({ product, index = 0, showMatch = false }) {
  const { isSaved, toggleSave, inCompare, toggleCompare, openDetail, compare, MAX_COMPARE, profile } = useStore();
  const saved = isSaved(product.id);
  const comparing = inCompare(product.id);
  const compareFull = compare.length >= MAX_COMPARE && !comparing;
  const tone = matchTone(product.matchPct || 0);
  const elig = checkEligibility(product, profile);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group card-surface p-5 flex flex-col hover:shadow-lift hover:border-brand-300 dark:hover:border-brand-500/50 transition-all duration-300"
    >
      {/* top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className={cx('grid place-items-center w-12 h-12 rounded-xl text-white font-bold text-sm shrink-0', tint(product.id))}>
            {product.logo}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-ink-400 truncate">{product.provider}</p>
              {product.sponsored && (
                <span className="chip bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-300 !py-0.5 !px-2 text-[10px]">Sponsored</span>
              )}
            </div>
            <h3 className="font-display font-bold text-ink-900 dark:text-white leading-tight truncate">{product.name}</h3>
          </div>
        </div>
        <button
          onClick={() => toggleSave(product.id)}
          aria-label={saved ? 'Remove from saved' : 'Save'}
          className={cx(
            'grid place-items-center w-9 h-9 rounded-full shrink-0 transition',
            saved ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/15' : 'text-ink-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'
          )}
        >
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* match + rating */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {showMatch && product.matchPct != null && (
          <span className={cx('chip', tone.color)}>
            <Sparkles size={12} /> {product.matchPct}% · {tone.label}
          </span>
        )}
        <span className="chip bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
          <Star size={12} fill="currentColor" /> {product.rating}
        </span>
        <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 truncate max-w-[60%]">
          Best for: {product.bestFor}
        </span>
        {elig.status !== 'unknown' && (
          <span
            title={elig.reasons.join(' · ')}
            className={cx(
              'chip',
              elig.status === 'eligible'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300'
            )}
          >
            {elig.status === 'eligible' ? <UserCheck size={12} /> : <UserX size={12} />}
            {elig.status === 'eligible' ? 'Likely eligible' : elig.reasons[0]}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{product.tagline}</p>

      {/* highlights */}
      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-ink-50 dark:bg-ink-900/50 p-3">
        {product.highlights.map((h) => (
          <div key={h.label} className="text-center">
            <p className="text-sm font-extrabold text-ink-900 dark:text-white leading-tight">{h.value}</p>
            <p className="text-[10px] uppercase tracking-wide text-ink-400 mt-0.5">{h.label}</p>
          </div>
        ))}
      </div>

      {/* reasons (from finder) or pros preview */}
      <ul className="mt-4 space-y-1.5 flex-1">
        {(product.reasons?.length ? product.reasons : product.pros).slice(0, 3).map((r, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-ink-600 dark:text-ink-300">
            <Check size={14} className="text-brand-500 mt-0.5 shrink-0" />
            <span>{r}</span>
          </li>
        ))}
      </ul>

      {/* actions */}
      <div className="mt-5 flex items-center gap-2">
        <button onClick={() => openDetail(product.id)} className="btn-ghost flex-1 text-sm py-2.5">
          View details
        </button>
        <button
          onClick={() => toggleCompare(product.id)}
          disabled={compareFull}
          aria-label="Add to compare"
          title={compareFull ? `Compare up to ${MAX_COMPARE}` : 'Compare'}
          className={cx(
            'grid place-items-center w-11 h-11 rounded-full border transition shrink-0',
            comparing
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'border-ink-300 dark:border-ink-600 text-ink-500 hover:border-brand-500 hover:text-brand-600 disabled:opacity-40'
          )}
        >
          <Scale size={17} />
        </button>
      </div>

      <Link href={`/${product.category}/${getSlug(product)}`} className="mt-2 btn-primary w-full justify-center text-sm py-2.5">
        <ScanLine size={16} /> Full Money X-Ray
      </Link>
    </motion.article>
  );
}
