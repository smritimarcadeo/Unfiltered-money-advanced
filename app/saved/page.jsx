'use client';

import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getById } from '@/data/products';
import ProductGrid from '@/components/product/ProductGrid';

export default function SavedPage() {
  const { saved, hydrated } = useStore();
  const items = hydrated ? saved.map(getById).filter(Boolean) : [];

  return (
    <div className="container-page py-12">
      <div className="flex items-center gap-3 mb-2">
        <span className="grid place-items-center w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-500/15 text-rose-500"><Heart size={22} fill="currentColor" /></span>
        <div>
          <h1 className="heading-xl text-3xl">Your shortlist</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Saved locally in your browser — no account needed.</p>
        </div>
      </div>

      {hydrated && items.length === 0 ? (
        <div className="card-surface grid place-items-center text-center py-16 mt-6">
          <span className="grid place-items-center w-16 h-16 rounded-2xl bg-ink-100 dark:bg-ink-800 text-ink-400 mb-4"><Heart size={28} /></span>
          <p className="font-display font-bold text-ink-800 dark:text-white">Nothing saved yet</p>
          <p className="text-sm text-ink-500 mt-1 max-w-sm">Tap the heart on any product to shortlist it, then compare your favourites here.</p>
          <Link href="/insurance/finder" className="btn-primary mt-5 text-sm">Find products to save <ArrowRight size={15} /></Link>
        </div>
      ) : (
        <div className="mt-8">
          <ProductGrid products={items} />
        </div>
      )}
    </div>
  );
}
