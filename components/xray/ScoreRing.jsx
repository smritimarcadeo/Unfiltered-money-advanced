'use client';

import { motion } from 'framer-motion';
import { cx } from '@/lib/format';

const TONE = {
  good: 'stroke-brand-500',
  warn: 'stroke-amber-400',
  bad: 'stroke-rose-400',
};

export default function ScoreRing({ score, band, size = 116 }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth="8" fill="none"
          className="stroke-ink-200 dark:stroke-ink-700" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} strokeWidth="8" fill="none" strokeLinecap="round"
          className={cx(TONE[band.tone] || TONE.good)}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display font-extrabold text-2xl text-ink-900 dark:text-white leading-none">{score}</p>
          <p className="text-[10px] uppercase tracking-wide text-ink-400 mt-0.5">/ 100</p>
        </div>
      </div>
    </div>
  );
}
