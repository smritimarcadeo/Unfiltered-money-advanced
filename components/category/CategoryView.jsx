'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { getByCategory, getCategory, getFeatured } from '@/data/products';
import { unfilteredScore } from '@/lib/engine';
import FilterBar from '@/components/product/FilterBar';
import ProductGrid from '@/components/product/ProductGrid';
import EligibilityChecker from '@/components/product/EligibilityChecker';
import RecentlyViewed from '@/components/shared/RecentlyViewed';
import FAQ from '@/components/shared/FAQ';
import { useStore } from '@/lib/store';
import { checkEligibility } from '@/lib/eligibility';

export default function CategoryView({ category }) {
  const cat = getCategory(category);
  const all = useMemo(() => getByCategory(category), [category]);
  const featured = useMemo(() => getFeatured(category).slice(0, 3), [category]);
  const { profile } = useStore();

  const [subtype, setSubtype] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('score');
  const [eligibleOnly, setEligibleOnly] = useState(false);

  // How many of this category the user actually qualifies for.
  const eligibleCount = useMemo(
    () => all.filter((p) => checkEligibility(p, profile).status === 'eligible').length,
    [all, profile]
  );

  const filtered = useMemo(() => {
    let list = all.filter((p) => {
      if (subtype !== 'all' && p.subtype !== subtype) return false;
      if (eligibleOnly && checkEligibility(p, profile).status !== 'eligible') return false;
      if (search) {
        const q = search.toLowerCase();
        if (!(p.name.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q) || p.bestFor.toLowerCase().includes(q))) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'price-low') return (a.attrs.price || 0) - (b.attrs.price || 0);
      if (sort === 'price-high') return (b.attrs.price || 0) - (a.attrs.price || 0);
      return unfilteredScore(b) - unfilteredScore(a); // 'score' (default)
    });
    return list;
  }, [all, subtype, search, sort, eligibleOnly, profile]);

  return (
    <>
      {/* header */}
      <section className="relative overflow-hidden border-b border-ink-200 dark:border-ink-800">
        <div className="absolute -top-32 right-0 w-[36rem] h-[36rem] rounded-full bg-brand-400/15 blur-3xl -z-10" />
        <div className="container-page py-12 sm:py-16">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
            <div>
              <span className="text-5xl">{cat.emoji}</span>
              <h1 className="heading-xl text-4xl sm:text-5xl mt-4">{cat.label}</h1>
              <p className="text-lg text-ink-500 dark:text-ink-400 mt-3 max-w-lg">{cat.tagline} Compare honestly, or let the finder match you in 30 seconds.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/${category}/finder`} className="btn-primary text-base px-6 py-3">
                  <Sparkles size={18} /> Find my match
                </Link>
                <a href="#browse" className="btn-ghost text-base px-6 py-3">Browse all {all.length}</a>
              </div>
            </div>

            {/* featured */}
            <div className="hidden lg:block">
              <p className="section-eyebrow mb-3"><Flame size={13} /> Top picks</p>
              <div className="space-y-2.5">
                {featured.map((p) => (
                  <button key={p.id} onClick={() => document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full flex items-center gap-3 card-surface p-3 hover:border-brand-300 transition text-left">
                    <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-600 text-white text-xs font-bold shrink-0">{p.logo}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink-900 dark:text-white truncate">{p.name}</p>
                      <p className="text-xs text-ink-400 truncate">{p.bestFor}</p>
                    </div>
                    <ArrowRight size={16} className="text-ink-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <RecentlyViewed />

      {/* browse */}
      <section id="browse" className="container-page py-8 scroll-mt-20">
        <FilterBar
          subtypes={cat.subtypes}
          subtype={subtype} setSubtype={setSubtype}
          search={search} setSearch={setSearch}
          sort={sort} setSort={setSort}
          count={filtered.length}
        />
        <EligibilityChecker
          eligibleOnly={eligibleOnly}
          setEligibleOnly={setEligibleOnly}
          eligibleCount={eligibleCount}
        />
        <div className="mt-6">
          <ProductGrid products={filtered} emptyHint="Try a different category pill or clear the search." />
        </div>

        {/* finder nudge */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-12 rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-700 p-8 text-white text-center">
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl">Not sure which one is right?</h3>
          <p className="text-brand-50/90 mt-2 max-w-md mx-auto">Answer a few questions and we'll rank these for you — with reasons.</p>
          <Link href={`/${category}/finder`} className="btn inline-flex mt-6 bg-white text-brand-700 hover:bg-brand-50 px-6 py-3 text-base font-bold">
            <Sparkles size={18} /> Take the 30-second finder
          </Link>
        </motion.div>
      </section>

      <FAQ />
    </>
  );
}
