'use client';

import { useState } from 'react';
import { Link2, Check, Share2 } from 'lucide-react';
import { cx } from '@/lib/format';

export default function ShareBar({ title, slug }) {
  const [copied, setCopied] = useState(false);
  const path = `/blog/${slug}`;

  const url = () => (typeof window !== 'undefined' ? window.location.origin + path : path);
  const share = (net) => {
    const u = encodeURIComponent(url());
    const t = encodeURIComponent(title);
    const links = {
      x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
      whatsapp: `https://wa.me/?text=${t}%20${u}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    };
    window.open(links[net], '_blank', 'noopener,width=600,height=500');
  };
  const copy = () => {
    navigator.clipboard?.writeText(url()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const btn = 'grid place-items-center h-9 px-3 rounded-full border border-ink-300 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:border-brand-400 hover:text-brand-600 transition text-xs font-semibold gap-1.5 flex items-center';

  return (
    <div className="no-print flex flex-wrap items-center gap-2 mt-10 pt-6 border-t border-ink-100 dark:border-ink-800">
      <span className="flex items-center gap-1.5 text-sm font-bold text-ink-600 dark:text-ink-300 mr-1"><Share2 size={15} /> Share</span>
      <button onClick={() => share('x')} className={btn}>X / Twitter</button>
      <button onClick={() => share('whatsapp')} className={btn}>WhatsApp</button>
      <button onClick={() => share('linkedin')} className={btn}>LinkedIn</button>
      <button onClick={copy} className={cx(btn, copied && 'border-brand-500 text-brand-600')}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
