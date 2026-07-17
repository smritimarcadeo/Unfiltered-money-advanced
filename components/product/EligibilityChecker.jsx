'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, X, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/store';
import { cx } from '@/lib/format';

export default function EligibilityChecker({ eligibleOnly, setEligibleOnly, eligibleCount }) {
  const { profile, setProfile, clearProfile } = useStore();
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');

  // `profile` is null on the first render and only arrives once the store
  // hydrates from localStorage — so seed the inputs when it lands, otherwise
  // "Edit" would show blank fields to someone who already saved a profile.
  useEffect(() => {
    setAge(profile?.age ?? '');
    setIncome(profile?.incomeLakh ?? '');
  }, [profile]);

  const apply = (e) => {
    e.preventDefault();
    setProfile({
      age: age === '' ? null : Number(age),
      incomeLakh: income === '' ? null : Number(income),
    });
    setOpen(false);
  };

  const reset = () => {
    clearProfile();
    setAge(''); setIncome('');
    setEligibleOnly(false);
    setOpen(false);
  };

  return (
    <div className="mt-3">
      {!profile ? (
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 rounded-full px-4 py-2 transition"
        >
          <UserCheck size={15} /> Check what I'm eligible for
          <ChevronDown size={14} className={cx('transition', open && 'rotate-180')} />
        </button>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">
            <UserCheck size={12} />
            {profile.age != null && `Age ${profile.age}`}
            {profile.age != null && profile.incomeLakh != null && ' · '}
            {profile.incomeLakh != null && `₹${profile.incomeLakh}L/yr`}
          </span>
          <button
            onClick={() => setEligibleOnly(!eligibleOnly)}
            className={cx(
              'chip border transition',
              eligibleOnly
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'border-ink-300 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:border-brand-400'
            )}
          >
            Eligible only ({eligibleCount})
          </button>
          <button onClick={() => setOpen((o) => !o)} className="text-xs font-semibold text-ink-500 hover:text-brand-600 px-2">Edit</button>
          <button onClick={reset} className="text-xs font-semibold text-ink-400 hover:text-rose-500 px-1" aria-label="Clear profile"><X size={14} /></button>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            onSubmit={apply}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-end gap-3 pt-3">
              <div>
                <label className="text-xs font-semibold text-ink-500">Your age</label>
                <input type="number" min="1" max="99" value={age} onChange={(e) => setAge(e.target.value)}
                  placeholder="30" className="input-field !py-2 !w-28 mt-1" />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-500">Annual income (₹ lakh)</label>
                <input type="number" min="0" max="200" step="0.5" value={income} onChange={(e) => setIncome(e.target.value)}
                  placeholder="6" className="input-field !py-2 !w-36 mt-1" />
              </div>
              <button type="submit" className="btn-primary text-sm px-4 py-2">Check</button>
            </div>
            <p className="text-xs text-ink-400 mt-2">
              Stays in your browser — nothing is sent anywhere. This is an indicative check against published criteria, not an approval.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
