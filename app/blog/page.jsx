import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { BLOGS } from '@/data/blog';

export const metadata = {
  title: 'Learn — honest money guides',
  description: 'Plain-English guides on insurance, credit cards and investing in India. No jargon, no sales pitch.',
};

export default function BlogPage() {
  const [lead, ...rest] = BLOGS;
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow">Learn</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Money, explained honestly</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-3">Short, no-jargon reads to help you decide with confidence.</p>
      </div>

      <Link href={`/blog/${lead.slug}`} className="group block card-surface p-6 sm:p-8 mt-10 hover:border-brand-300 transition">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">{lead.category}</span>
          <span className="flex items-center gap-1 text-ink-400"><Clock size={12} /> {lead.readTime}</span>
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-900 dark:text-white mt-4 group-hover:text-brand-600 transition max-w-3xl">{lead.title}</h2>
        <p className="text-ink-500 dark:text-ink-400 mt-3 max-w-2xl">{lead.excerpt}</p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 mt-4">Read guide <ArrowUpRight size={15} /></span>
      </Link>

      <div className="grid md:grid-cols-3 gap-5 mt-6">
        {rest.map((b) => (
          <Link key={b.slug} href={`/blog/${b.slug}`} className="group card-surface p-6 hover:border-brand-300 transition flex flex-col">
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="chip bg-ink-100 dark:bg-ink-800 text-ink-500 dark:text-ink-300">{b.category}</span>
              <span className="flex items-center gap-1 text-ink-400"><Clock size={12} /> {b.readTime}</span>
            </div>
            <h3 className="font-display font-bold text-lg text-ink-900 dark:text-white mt-3 group-hover:text-brand-600 transition">{b.title}</h3>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-2 flex-1">{b.excerpt}</p>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 mt-4">Read <ArrowUpRight size={14} /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
