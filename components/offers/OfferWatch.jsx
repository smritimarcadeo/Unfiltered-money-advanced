'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, TrendingUp, TrendingDown, Circle, ChevronRight, Bell } from 'lucide-react';
import { OFFERS } from '@/data/offers';
import { getById } from '@/data/products';
import { XRAY } from '@/data/xray';
import { getSlug } from '@/lib/engine';
import { inr, cx } from '@/lib/format';

// Live countdown — ticks every second, SSR-safe (starts null).
function useNow(active = true) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [active]);
  return now;
}

function timeLeft(expires, now) {
  if (now == null) return null;
  const ms = new Date(expires + 'T23:59:59').getTime() - now;
  if (ms <= 0) return { expired: true };
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { expired: false, d, h, m, s, urgent: d < 7 };
}

function Countdown({ expires, now }) {
  const t = timeLeft(expires, now);
  if (!t) return <span className="text-xs font-mono text-ink-400">—</span>;
  if (t.expired) return <span className="chip bg-ink-100 dark:bg-ink-800 text-ink-400">Expired</span>;

  const box = (v, l) => (
    <span className="flex flex-col items-center">
      <span className="font-mono font-bold text-sm tabular-nums">{String(v).padStart(2, '0')}</span>
      <span className="text-[9px] uppercase text-ink-400">{l}</span>
    </span>
  );

  return (
    <span className={cx('inline-flex items-center gap-2 rounded-lg px-2.5 py-1',
      t.urgent ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300' : 'bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-200')}>
      {t.urgent && <AlertTriangle size={12} />}
      {box(t.d, 'd')}{box(t.h, 'h')}{box(t.m, 'm')}{box(t.s, 's')}
    </span>
  );
}

const CHANGE_ICON = {
  good: { Icon: TrendingUp, cls: 'text-brand-600 bg-brand-50 dark:bg-brand-500/15' },
  bad: { Icon: TrendingDown, cls: 'text-rose-500 bg-rose-50 dark:bg-rose-500/15' },
  neutral: { Icon: Circle, cls: 'text-ink-400 bg-ink-100 dark:bg-ink-800' },
};

export default function OfferWatch({ mode = 'watch' }) {
  const now = useNow();

  const offers = useMemo(() => {
    return OFFERS
      .map((o) => ({ ...o, product: getById(o.productId) }))
      .filter((o) => o.product)
      .sort((a, b) => new Date(a.expires) - new Date(b.expires));
  }, []);

  // Recent fine-print changes across every product — the "alerts" feed.
  const changes = useMemo(() => {
    const all = [];
    for (const [id, x] of Object.entries(XRAY)) {
      const p = getById(id);
      if (!p || !x.history) continue;
      for (const h of x.history) all.push({ ...h, product: p });
    }
    return all.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
  }, []);

  const live = offers.filter((o) => {
    const t = timeLeft(o.expires, now);
    return !t || !t.expired;
  });

  return (
    <div className="space-y-10">
      {/* offers */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-brand-600" />
          <h2 className="font-display font-extrabold text-xl text-ink-900 dark:text-white">Live offers</h2>
          <span className="chip bg-ink-100 dark:bg-ink-800 text-ink-500">{live.length}</span>
        </div>

        <div className="space-y-3">
          {live.map((o, i) => (
            <motion.div key={o.id}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="card-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="grid place-items-center w-10 h-10 rounded-lg bg-brand-600 text-white text-xs font-bold shrink-0">{o.product.logo}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">{o.kind}</span>
                      <span className="text-xs text-ink-400">{o.product.name}</span>
                    </div>
                    <h3 className="font-display font-bold text-ink-900 dark:text-white mt-1.5">{o.title}</h3>
                    <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">{o.detail}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Countdown expires={o.expires} now={now} />
                  {o.worth > 0 && (
                    <span className="text-xs text-ink-400">worth ~<strong className="text-ink-600 dark:text-ink-300">{inr(o.worth)}</strong></span>
                  )}
                </div>
              </div>

              {/* the catch */}
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50/60 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/20 p-3">
                <AlertTriangle size={14} className="text-rose-500 mt-0.5 shrink-0" />
                <p className="text-xs text-ink-700 dark:text-ink-200 leading-relaxed">
                  <strong className="text-rose-600 dark:text-rose-300">The catch:</strong> {o.catch}
                </p>
              </div>

              <Link href={`/${o.product.category}/${getSlug(o.product)}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline mt-3">
                See the full X-Ray <ChevronRight size={12} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* change feed */}
      {mode === 'watch' && (
        <section>
          <div className="flex items-center gap-2 mb-1">
            <Bell size={18} className="text-brand-600" />
            <h2 className="font-display font-extrabold text-xl text-ink-900 dark:text-white">What changed recently</h2>
          </div>
          <p className="text-sm text-ink-500 dark:text-ink-400 mb-4">
            Issuers move the goalposts quietly. Every fine-print change we've recorded, newest first.
          </p>
          <div className="card-surface divide-y divide-ink-100 dark:divide-ink-800">
            {changes.map((c, i) => {
              const { Icon, cls } = CHANGE_ICON[c.type] || CHANGE_ICON.neutral;
              return (
                <Link key={i} href={`/${c.product.category}/${getSlug(c.product)}`}
                  className="flex items-start gap-3 p-4 hover:bg-ink-50 dark:hover:bg-ink-800/50 transition">
                  <span className={cx('grid place-items-center w-8 h-8 rounded-full shrink-0', cls)}><Icon size={14} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-800 dark:text-ink-100">{c.label}</p>
                    <p className="text-xs text-ink-400 mt-0.5">
                      {c.product.name} · {new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <ChevronRight size={15} className="text-ink-300 shrink-0 mt-1" />
                </Link>
              );
            })}
          </div>
          <p className="text-xs text-ink-400 mt-4">
            Email/push alerts need a backend — not built in this demo. This feed is generated from the
            same timeline data shown on each X-Ray page.
          </p>
        </section>
      )}
    </div>
  );
}
