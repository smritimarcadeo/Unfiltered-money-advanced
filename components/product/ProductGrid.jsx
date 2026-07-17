'use client';

import { SearchX } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, showMatch = false, emptyHint }) {
  if (!products.length) {
    return (
      <div className="col-span-full grid place-items-center py-20 text-center">
        <div className="grid place-items-center w-16 h-16 rounded-2xl bg-ink-100 dark:bg-ink-800 text-ink-400 mb-4">
          <SearchX size={28} />
        </div>
        <p className="font-display font-bold text-ink-800 dark:text-ink-100">No products match this filter</p>
        <p className="text-sm text-ink-500 mt-1">{emptyHint || 'Try clearing filters or a different search.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} showMatch={showMatch} />
      ))}
    </div>
  );
}
