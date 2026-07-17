export const inr = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export const inrCompact = (n) => {
  n = Number(n || 0);
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2).replace(/\.00$/, '') + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2).replace(/\.00$/, '') + ' L';
  if (n >= 1e3) return '₹' + (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
  return inr(n);
};

export const cx = (...parts) => parts.filter(Boolean).join(' ');

export const matchTone = (pct) => {
  if (pct >= 80) return { label: 'Excellent match', color: 'text-brand-700 bg-brand-50 dark:bg-brand-500/15 dark:text-brand-300' };
  if (pct >= 55) return { label: 'Good match', color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300' };
  return { label: 'Fair match', color: 'text-amber-700 bg-amber-50 dark:bg-amber-500/15 dark:text-amber-300' };
};
