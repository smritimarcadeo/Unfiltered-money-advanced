'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { FAQS } from '@/data/site';

export default function FAQ({ items = FAQS }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="container-page py-16 sm:py-20">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10">
        <div>
          <span className="section-eyebrow">FAQ</span>
          <h2 className="heading-xl text-3xl sm:text-4xl mt-3">Questions, answered honestly</h2>
          <p className="text-ink-500 dark:text-ink-400 mt-3">Everything you might wonder before you trust us with a money decision.</p>
        </div>
        <div className="space-y-3">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="card-surface overflow-hidden">
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
                  <span className="font-semibold text-ink-900 dark:text-white">{f.q}</span>
                  <span className={`grid place-items-center w-7 h-7 rounded-full bg-brand-50 dark:bg-brand-500/15 text-brand-600 shrink-0 transition-transform ${isOpen ? 'rotate-45' : ''}`}><Plus size={16} /></span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
