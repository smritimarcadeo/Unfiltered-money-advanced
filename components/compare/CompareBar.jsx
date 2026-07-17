'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { getById } from '@/data/products';
import { cx } from '@/lib/format';

export default function CompareBar() {
  const { compare, toggleCompare, clearCompare, MAX_COMPARE, hydrated } = useStore();
  const pathname = usePathname();

  if (!hydrated) return null;
  // The workspace page IS the comparison — don't float a bar over it.
  if (pathname === '/compare') return null;

  const items = compare.map(getById).filter(Boolean);

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="no-print fixed bottom-4 inset-x-0 z-40 px-4 flex justify-center"
        >
          <div className="card-surface shadow-2xl flex items-center gap-3 p-2.5 pl-4 max-w-2xl w-full">
            <Scale size={18} className="text-brand-600 shrink-0" />
            <div className="flex items-center gap-1.5 flex-1 overflow-x-auto no-scrollbar">
              {items.map((p) => (
                <span key={p.id} className="chip bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-200 shrink-0">
                  {p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name}
                  <button onClick={() => toggleCompare(p.id)} aria-label="Remove" className="ml-1 hover:text-rose-500"><X size={12} /></button>
                </span>
              ))}
              <span className="text-xs text-ink-400 shrink-0 ml-1">{items.length}/{MAX_COMPARE}</span>
            </div>
            <button onClick={clearCompare} className="text-xs font-semibold text-ink-400 hover:text-ink-700 px-2 shrink-0">Clear</button>
            <Link
              href="/compare"
              className={cx('btn-primary text-sm px-4 py-2 shrink-0', items.length < 2 && 'pointer-events-none opacity-50')}
            >
              Compare <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
