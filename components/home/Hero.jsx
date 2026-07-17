'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { STATS } from '@/data/site';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-24 w-[42rem] h-[42rem] rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute top-20 -left-32 w-[34rem] h-[34rem] rounded-full bg-emerald-300/20 dark:bg-brand-600/10 blur-3xl" />
      </div>

      <div className="container-page pt-14 pb-16 sm:pt-20 sm:pb-24">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-700 px-3.5 py-1.5 text-xs font-semibold text-ink-600 dark:text-ink-300 shadow-soft"
            >
              <span className="grid place-items-center w-4 h-4 rounded-full bg-brand-600 text-white"><Sparkles size={10} /></span>
              Preference-based finder · No sign-up needed
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="heading-xl text-4xl sm:text-6xl leading-[1.05] mt-5"
            >
              Find the money product that{' '}
              <span className="relative whitespace-nowrap text-brand-600">
                actually fits you
                <svg className="absolute -bottom-1 left-0 w-full" height="10" viewBox="0 0 200 10" fill="none" preserveAspectRatio="none">
                  <path d="M2 7C50 2 150 2 198 7" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-ink-500 dark:text-ink-400 max-w-xl leading-relaxed"
            >
              Answer a few quick questions and get honest, unbiased picks for insurance,
              credit cards and investments — matched to your goal, budget and priorities.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link href="/insurance/finder" className="btn-primary text-base px-6 py-3">
                Find my match in 30s <ArrowRight size={18} />
              </Link>
              <Link href="/credit-cards" className="btn-ghost text-base px-6 py-3">
                Browse all products
              </Link>
            </motion.div>

            <div className="mt-8 flex items-center gap-6 text-sm text-ink-500 dark:text-ink-400">
              <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-brand-500" /> 100% unbiased</span>
              <span className="flex items-center gap-1.5"><Star size={16} className="text-amber-400" fill="currentColor" /> Honest pros & cons</span>
            </div>
          </div>

          {/* right: floating preview card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="relative"
          >
            <div className="card-surface p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <span className="section-eyebrow"><Sparkles size={13} /> Your match</span>
                <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">92% · Excellent</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-12 h-12 rounded-xl bg-brand-600 text-white font-bold">HD</span>
                <div>
                  <p className="text-xs text-ink-400 font-semibold">HDFC Life</p>
                  <p className="font-display font-bold text-ink-900 dark:text-white">Click 2 Protect Super</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 rounded-xl bg-ink-50 dark:bg-ink-900/50 p-3">
                {[['99.4%', 'Claims'], ['₹450/mo', 'From'], ['₹1 Cr', 'Cover']].map(([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-sm font-extrabold text-ink-900 dark:text-white">{v}</p>
                    <p className="text-[10px] uppercase text-ink-400">{l}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1.5">
                {['Matches your budget', 'Top claim settlement', 'Great for young families'].map((r) => (
                  <p key={r} className="flex items-center gap-2 text-xs text-ink-600 dark:text-ink-300">
                    <span className="grid place-items-center w-4 h-4 rounded-full bg-brand-100 dark:bg-brand-500/20 text-brand-600"><Sparkles size={9} /></span>
                    {r}
                  </p>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 card-surface px-4 py-3 shadow-xl hidden sm:flex items-center gap-2">
              <Star size={16} className="text-amber-400" fill="currentColor" />
              <span className="text-sm font-bold text-ink-800 dark:text-white">4.6</span>
              <span className="text-xs text-ink-400">avg rating</span>
            </div>
          </motion.div>
        </div>

        {/* stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="card-surface p-5 text-center">
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-brand-600">{s.value}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
