'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Check, Minus, Heart, Scale, ArrowRight, ShieldCheck, Info, Quote, Ban,
  CalendarClock, EyeOff, TrendingUp, TrendingDown, Circle, ChevronRight, Sparkles,
  UserCheck, AlertTriangle, ArrowLeft,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { getSimilar, getCategory } from '@/data/products';
import { getXray } from '@/data/xray';
import { unfilteredScore, scoreBand, approvalOdds, ODDS_META, getSlug } from '@/lib/engine';
import { cx } from '@/lib/format';
import ScoreRing from './ScoreRing';
import RewardCalculator from './RewardCalculator';

const DECISION = {
  YES: { cls: 'bg-brand-600 text-white', note: 'We\'d buy this' },
  MAYBE: { cls: 'bg-amber-500 text-white', note: 'Depends on you' },
  NO: { cls: 'bg-rose-500 text-white', note: 'We\'d skip this' },
};

const HISTORY_ICON = {
  good: { Icon: TrendingUp, cls: 'text-brand-600 bg-brand-50 dark:bg-brand-500/15' },
  bad: { Icon: TrendingDown, cls: 'text-rose-500 bg-rose-50 dark:bg-rose-500/15' },
  neutral: { Icon: Circle, cls: 'text-ink-400 bg-ink-100 dark:bg-ink-800' },
};

function Section({ title, icon: Icon, iconCls, children, sub }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      className="card-surface p-6"
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon size={18} className={iconCls || 'text-brand-600'} />}
        <h2 className="font-display font-extrabold text-xl text-ink-900 dark:text-white">{title}</h2>
      </div>
      {sub && <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{sub}</p>}
      <div className="mt-4">{children}</div>
    </motion.section>
  );
}

export default function MoneyXray({ product }) {
  const { isSaved, toggleSave, inCompare, toggleCompare, openDetail, profile } = useStore();
  const xray = getXray(product.id);
  const score = unfilteredScore(product);
  const band = scoreBand(score);
  const similar = getSimilar(product);
  const odds = approvalOdds(product, profile);
  const decision = xray?.decision;
  const dec = decision ? DECISION[decision.call] : null;

  const ctaText = getCategory(product.category)?.cta || 'View details';

  return (
    <div className="pb-24">
      {/* ── Header ── */}
      <header className="relative overflow-hidden border-b border-ink-200 dark:border-ink-800">
        <div className="absolute -top-32 right-0 w-[34rem] h-[34rem] rounded-full bg-brand-400/15 blur-3xl -z-10" />
        <div className="container-page py-10">
          <Link href={`/${product.category}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-brand-600 mb-6">
            <ArrowLeft size={15} /> All {product.category.replace('-', ' ')}
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-14 h-14 rounded-2xl bg-brand-600 text-white font-bold shrink-0">{product.logo}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink-400">{product.provider}</p>
                    {product.sponsored && <span className="chip bg-ink-100 dark:bg-ink-700 text-ink-500 !py-0.5 text-[10px]">Sponsored</span>}
                  </div>
                  <h1 className="heading-xl text-2xl sm:text-3xl leading-tight">{product.name}</h1>
                </div>
              </div>

              <p className="text-lg text-ink-500 dark:text-ink-400 mt-4 max-w-xl">{product.tagline}</p>

              {/* decision */}
              {decision && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex items-start gap-3 rounded-2xl border-2 border-ink-200 dark:border-ink-700 p-4 max-w-xl">
                  <span className={cx('grid place-items-center rounded-xl px-3.5 py-2 font-display font-extrabold text-sm shrink-0', dec.cls)}>
                    {decision.call}
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{dec.note}</p>
                    <p className="text-sm text-ink-700 dark:text-ink-200 mt-0.5 leading-relaxed">{decision.line}</p>
                  </div>
                </motion.div>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-5">
                <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">Best for: {product.bestFor}</span>
                {product.badges?.map((b) => (
                  <span key={b} className="chip bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">{b}</span>
                ))}
              </div>
            </div>

            {/* score card */}
            <div className="card-surface p-6 lg:w-72 shrink-0">
              <div className="flex items-center gap-4">
                <ScoreRing score={score} band={band} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-400">Unfiltered Score</p>
                  <p className={cx('font-display font-extrabold text-lg',
                    band.tone === 'good' ? 'text-brand-600' : band.tone === 'warn' ? 'text-amber-500' : 'text-rose-500')}>
                    {band.label}
                  </p>
                  <Link href="/methodology" className="text-xs font-semibold text-brand-600 hover:underline inline-flex items-center gap-0.5 mt-1">
                    How we score <ChevronRight size={11} />
                  </Link>
                </div>
              </div>
              {/* The score and the decision measure different things — say so,
                  otherwise a good product we'd tell you to skip looks like a bug. */}
              <p className="text-[11px] text-ink-400 leading-relaxed mt-3">
                This rates <strong className="text-ink-500 dark:text-ink-300">how good the product is</strong> — not
                whether you should buy it. A strong product can still earn a <strong className="text-ink-500 dark:text-ink-300">NO</strong> if
                most people can't extract its value.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-5 rounded-xl bg-ink-50 dark:bg-ink-900/50 p-3">
                {product.highlights.map((h) => (
                  <div key={h.label} className="text-center">
                    <p className="text-sm font-extrabold text-ink-900 dark:text-white leading-tight">{h.value}</p>
                    <p className="text-[10px] uppercase text-ink-400 mt-0.5">{h.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-page py-10 space-y-6 max-w-5xl">
        {/* our take */}
        {product.verdict && (
          <Section title="Our take" icon={Quote}>
            <p className="text-ink-700 dark:text-ink-200 leading-relaxed">{product.verdict}</p>
          </Section>
        )}

        {/* score breakdown */}
        {product.scores && (
          <Section title="How we scored it" icon={Scale} sub="Four criteria, published weights. The Unfiltered Score is just the average — no hand-tuning.">
            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
              {product.scores.map((s) => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-ink-600 dark:text-ink-300">{s.label}</span>
                    <span className="text-xs font-bold text-ink-900 dark:text-white">{s.value.toFixed(1)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-ink-200 dark:bg-ink-700 overflow-hidden">
                    <motion.div
                      className={cx('h-full rounded-full', s.value >= 9 ? 'bg-brand-600' : s.value >= 7.5 ? 'bg-brand-400' : 'bg-amber-400')}
                      initial={{ width: 0 }} whileInView={{ width: `${s.value * 10}%` }} viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* reward calculator — cards only */}
        <RewardCalculator product={product} />

        {/* approval odds */}
        <Section title="Your approval odds" icon={UserCheck} sub="Rule-based, from published criteria. No credit bureau involved — and never an approval.">
          {odds.level === 'unknown' ? (
            <div className="rounded-2xl bg-ink-50 dark:bg-ink-800 p-5 text-center">
              <p className="text-sm text-ink-600 dark:text-ink-300">
                Set your age and income on any category page to see your odds here.
              </p>
              <Link href={`/${product.category}`} className="btn-soft text-sm mt-3">
                Set my profile <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className={cx('rounded-2xl px-6 py-5 text-center text-white shrink-0 w-full sm:w-44',
                odds.level === 'high' ? 'bg-gradient-to-br from-brand-600 to-emerald-700'
                  : odds.level === 'medium' ? 'bg-gradient-to-br from-amber-500 to-amber-600'
                    : 'bg-gradient-to-br from-rose-500 to-rose-700')}>
                <p className="font-display font-extrabold text-3xl">{odds.pct}%</p>
                <p className="text-xs text-white/90 mt-1">{ODDS_META[odds.level].label}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {odds.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                    <AlertTriangle size={15} className="text-rose-400 mt-0.5 shrink-0" /><span>{r}</span>
                  </li>
                ))}
                {odds.positives?.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                    <Check size={15} className="text-brand-500 mt-0.5 shrink-0" /><span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {/* pros / cons */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="card-surface p-6">
            <h2 className="font-display font-bold text-brand-700 dark:text-brand-300 mb-3">What's good</h2>
            <ul className="space-y-2.5">
              {product.pros.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                  <Check size={15} className="text-brand-500 mt-0.5 shrink-0" /><span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface p-6">
            <h2 className="font-display font-bold text-rose-600 dark:text-rose-300 mb-3">What's not</h2>
            <ul className="space-y-2.5">
              {product.cons.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-200">
                  <Minus size={15} className="text-rose-400 mt-0.5 shrink-0" /><span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* the catch */}
        <Section title="The Catch" icon={Ban} iconCls="text-rose-500" sub="The fine print that decides whether this is actually good for you.">
          <ul className="space-y-2">
            {product.exclusions.map((e, i) => (
              <li key={i} className="flex items-start gap-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 p-3 text-sm text-ink-700 dark:text-ink-200">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" /><span>{e}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* things nobody tells you */}
        {xray?.nobodyTells && (
          <Section title="Things nobody tells you" icon={EyeOff} sub="Buried in the T&C, or simply never mentioned by the people selling it.">
            <div className="space-y-3">
              {xray.nobodyTells.map((t, i) => (
                <div key={i} className="flex gap-4 rounded-2xl bg-ink-50 dark:bg-ink-800 p-4">
                  <span className="grid place-items-center w-7 h-7 rounded-full bg-ink-900 dark:bg-white text-white dark:text-ink-900 text-xs font-bold shrink-0">{i + 1}</span>
                  <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* timeline */}
        {xray?.history && (
          <Section title="Fine-print timeline" icon={CalendarClock} sub="What changed, and when. Issuers quietly move the goalposts — this is the record.">
            <ol className="relative border-l-2 border-ink-200 dark:border-ink-700 ml-3 space-y-5">
              {xray.history.map((h, i) => {
                const { Icon, cls } = HISTORY_ICON[h.type] || HISTORY_ICON.neutral;
                return (
                  <li key={i} className="ml-6">
                    <span className={cx('absolute -left-[15px] grid place-items-center w-7 h-7 rounded-full ring-4 ring-white dark:ring-ink-800', cls)}>
                      <Icon size={13} />
                    </span>
                    <p className="text-xs font-semibold text-ink-400">
                      {new Date(h.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-ink-700 dark:text-ink-200 mt-0.5">{h.label}</p>
                  </li>
                );
              })}
            </ol>
          </Section>
        )}

        {/* eligibility */}
        <Section title="Eligibility & documents" icon={ShieldCheck}>
          <div className="space-y-2">
            {product.eligibility.map((e) => (
              <div key={e.title} className="flex gap-3 rounded-xl bg-ink-50 dark:bg-ink-800 p-3">
                <span className="text-xs font-bold text-ink-500 w-24 shrink-0">{e.title}</span>
                <span className="text-sm text-ink-700 dark:text-ink-200">{e.description}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* alternatives */}
        {similar.length > 0 && (
          <Section title="Honest alternatives" icon={Sparkles} sub="If this isn't quite right, these are the closest options we'd point you to.">
            <div className="grid sm:grid-cols-3 gap-3">
              {similar.map((s) => (
                <Link key={s.id} href={`/${s.category}/${getSlug(s)}`}
                  className="rounded-2xl border border-ink-200 dark:border-ink-700 p-4 hover:border-brand-400 transition">
                  <div className="flex items-center gap-2.5">
                    <span className="grid place-items-center w-9 h-9 rounded-lg bg-brand-600 text-white text-xs font-bold shrink-0">{s.logo}</span>
                    <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300 ml-auto">{unfilteredScore(s)}/100</span>
                  </div>
                  <p className="text-sm font-bold text-ink-900 dark:text-white mt-3 leading-snug">{s.name}</p>
                  <p className="text-xs text-ink-400 mt-1">{s.bestFor}</p>
                  <span className="text-xs font-semibold text-brand-600 inline-flex items-center gap-0.5 mt-3">
                    See its X-Ray <ChevronRight size={11} />
                  </span>
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* provenance */}
        <div className="rounded-2xl bg-ink-50 dark:bg-ink-800 p-4 space-y-1.5">
          <p className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
            <CalendarClock size={13} className="shrink-0" />
            Last verified {new Date(product.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="flex items-start gap-2 text-xs text-ink-500 dark:text-ink-400">
            <Info size={13} className="mt-0.5 shrink-0" /> Source: {product.source}
          </p>
          <p className="flex items-start gap-2 text-xs text-ink-500 dark:text-ink-400">
            <Info size={13} className="mt-0.5 shrink-0" />
            Illustrative sample data for this demo — information, not financial advice.
            {product.sponsored && ' This is a sponsored placement; it does not change the score or our take.'}
          </p>
        </div>
      </div>

      {/* sticky CTA */}
      <div className="no-print fixed bottom-0 inset-x-0 z-30 border-t border-ink-200 dark:border-ink-700 bg-white/90 dark:bg-ink-900/90 backdrop-blur-xl">
        <div className="container-page py-3 flex items-center gap-2">
          <div className="hidden sm:block min-w-0 flex-1">
            <p className="text-sm font-bold text-ink-900 dark:text-white truncate">{product.name}</p>
            <p className="text-xs text-ink-400">Unfiltered Score {score}/100 · {band.label}</p>
          </div>
          <button onClick={() => toggleSave(product.id)} aria-label="Save"
            className={cx('grid place-items-center w-11 h-11 rounded-full border shrink-0',
              isSaved(product.id) ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-ink-300 dark:border-ink-600 text-ink-500')}>
            <Heart size={18} fill={isSaved(product.id) ? 'currentColor' : 'none'} />
          </button>
          <button onClick={() => toggleCompare(product.id)}
            className={cx('btn-ghost px-4 py-2.5 text-sm shrink-0', inCompare(product.id) && 'border-brand-500 text-brand-600')}>
            <Scale size={16} /> <span className="hidden sm:inline">{inCompare(product.id) ? 'Added' : 'Compare'}</span>
          </button>
          <Link href={`/go/${getSlug(product)}`} className="btn-primary flex-1 sm:flex-none justify-center text-sm py-2.5 px-6">
            {ctaText} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
