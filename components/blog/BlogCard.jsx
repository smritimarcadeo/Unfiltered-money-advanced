'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { catStyle, blogTint } from '@/data/blog';
import { cx } from '@/lib/format';

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function BlogCard({ blog, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.06, 0.3) }}
    >
      <Link href={`/blog/${blog.slug}`} className="group flex flex-col h-full card-surface overflow-hidden hover:border-brand-300 dark:hover:border-brand-500/50 hover:shadow-lift transition-all duration-300">
        {/* image / gradient placeholder */}
        <div className="relative h-[190px] overflow-hidden shrink-0">
          <div className={cx('w-full h-full bg-gradient-to-br grid place-items-center transition-transform duration-500 group-hover:scale-105', blogTint(blog.slug))}>
            <span className="font-display font-black text-6xl text-white/25 select-none">
              {(blog.title || '?').charAt(0).toUpperCase()}
            </span>
          </div>
          <span className={cx('absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full', catStyle(blog.category))}>
            {blog.category}
          </span>
        </div>

        {/* body */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-[11px] text-ink-400 mb-2">
            <span className="flex items-center gap-1"><CalendarDays size={12} /> {fmtDate(blog.date)}</span>
            <span className="text-ink-300 dark:text-ink-600">•</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime}</span>
          </div>

          <h3 className="font-display font-bold text-ink-900 dark:text-white leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
            {blog.title}
          </h3>
          <p className="text-sm text-ink-500 dark:text-ink-400 mt-2 line-clamp-2 flex-1">{blog.excerpt}</p>

          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {blog.tags.slice(0, 3).map((t) => (
                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 font-medium">#{t}</span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-ink-100 dark:border-ink-800">
            <div className="flex items-center gap-2 min-w-0">
              <span className="grid place-items-center w-7 h-7 rounded-full bg-brand-600 text-white text-[10px] font-bold shrink-0">
                {blog.author?.name?.[0] || 'U'}
              </span>
              <span className="text-xs font-semibold text-ink-500 dark:text-ink-400 truncate">{blog.author?.name || 'UnfilteredMoney'}</span>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:gap-1.5 transition-all shrink-0">
              Read <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
