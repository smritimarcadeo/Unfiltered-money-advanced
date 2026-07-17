'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ClipboardList, Sparkles, Scale, BadgeCheck, ShieldCheck, Eye, Lock,
  HeartHandshake, ArrowRight, Quote,
} from 'lucide-react';
import { HOW_IT_WORKS, TRUST, TESTIMONIALS } from '@/data/site';
import { CATEGORIES, getByCategory } from '@/data/products';

const ICONS = { ClipboardList, Sparkles, Scale, BadgeCheck, ShieldCheck, Eye, Lock, HeartHandshake };

function Section({ eyebrow, title, subtitle, children }) {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="max-w-2xl">
        {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
        <h2 className="heading-xl text-3xl sm:text-4xl mt-3">{title}</h2>
        {subtitle && <p className="mt-3 text-ink-500 dark:text-ink-400 leading-relaxed">{subtitle}</p>}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <Section eyebrow="How it works" title="From confused to confident in four steps" subtitle="No jargon, no sales pressure — just a clear path to the right product for you.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {HOW_IT_WORKS.map((s, i) => {
          const Icon = ICONS[s.icon];
          return (
            <motion.div key={s.title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="card-surface p-6 relative">
              <span className="absolute top-5 right-5 font-display font-extrabold text-4xl text-ink-100 dark:text-ink-800">{i + 1}</span>
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand-600 text-white shadow-lift"><Icon size={22} /></span>
              <h3 className="font-display font-bold text-ink-900 dark:text-white mt-4">{s.title}</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-2 leading-relaxed">{s.text}</p>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

export function CategoryShowcase() {
  return (
    <Section eyebrow="Explore" title="What do you want to sort out today?" subtitle="Pick a category to browse, or jump straight into the finder for a personalised match.">
      <div className="grid md:grid-cols-3 gap-5">
        {CATEGORIES.map((c, i) => {
          const count = getByCategory(c.slug).length;
          return (
            <motion.div key={c.slug} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="group card-surface p-6 hover:shadow-lift hover:border-brand-300 transition-all">
              <div className="flex items-start justify-between">
                <span className="text-4xl">{c.emoji}</span>
                <span className="chip bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-300">{count} options</span>
              </div>
              <h3 className="font-display font-extrabold text-xl text-ink-900 dark:text-white mt-4">{c.label}</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{c.tagline}</p>
              <div className="mt-5 flex items-center gap-2">
                <Link href={`/${c.slug}/finder`} className="btn-primary text-sm px-4 py-2 flex-1 justify-center">Find my match</Link>
                <Link href={`/${c.slug}`} className="btn-ghost text-sm px-4 py-2">Browse <ArrowRight size={14} /></Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

export function Trust() {
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-700 p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-100">Why trust us</span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 max-w-xl">Guidance built to help you decide — not to sell</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {TRUST.map((t) => {
              const Icon = ICONS[t.icon];
              return (
                <div key={t.title} className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-5">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-white/15"><Icon size={20} /></span>
                  <h3 className="font-bold mt-4">{t.title}</h3>
                  <p className="text-sm text-brand-50/90 mt-1.5 leading-relaxed">{t.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <Section eyebrow="Loved by users" title="Real decisions, made simpler">
      <div className="grid md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="card-surface p-6">
            <Quote size={26} className="text-brand-200 dark:text-brand-500/40" />
            <p className="text-ink-700 dark:text-ink-200 mt-3 leading-relaxed">{t.text}</p>
            <div className="flex items-center gap-3 mt-5">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-brand-600 text-white text-sm font-bold">{t.avatar}</span>
              <div>
                <p className="text-sm font-bold text-ink-900 dark:text-white">{t.name}</p>
                <p className="text-xs text-ink-400">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

export function FinalCTA() {
  return (
    <section className="container-page pb-8">
      <div className="card-surface p-8 sm:p-12 text-center">
        <h2 className="heading-xl text-3xl sm:text-4xl">Ready to find your match?</h2>
        <p className="text-ink-500 dark:text-ink-400 mt-3 max-w-lg mx-auto">It takes about 30 seconds and you don't need to sign up. Honest picks, every time.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/insurance/finder" className="btn-primary text-base px-6 py-3">Start the finder <ArrowRight size={18} /></Link>
          <Link href="/tools" className="btn-ghost text-base px-6 py-3">Try the calculators</Link>
        </div>
      </div>
    </section>
  );
}
