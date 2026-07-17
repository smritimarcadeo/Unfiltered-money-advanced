import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Sparkles } from 'lucide-react';
import { BLOGS, getBlog } from '@/data/blog';

export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }) {
  const b = getBlog(params.slug);
  if (!b) return {};
  return { title: b.title, description: b.excerpt };
}

export default function BlogDetailPage({ params }) {
  const b = getBlog(params.slug);
  if (!b) notFound();

  const finderLink = b.tag === 'insurance' ? '/insurance/finder' : b.tag === 'credit-cards' ? '/credit-cards/finder' : '/investments/finder';

  return (
    <article className="container-page py-12 max-w-3xl">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-brand-600 mb-6"><ArrowLeft size={15} /> All guides</Link>

      <div className="flex items-center gap-3 text-xs font-semibold">
        <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300">{b.category}</span>
        <span className="flex items-center gap-1 text-ink-400"><Clock size={12} /> {b.readTime}</span>
        <span className="text-ink-400">{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>

      <h1 className="heading-xl text-3xl sm:text-4xl mt-4 leading-tight">{b.title}</h1>
      <p className="text-lg text-ink-500 dark:text-ink-400 mt-4">{b.excerpt}</p>

      <div className="mt-8 space-y-5">
        {b.body.map((p, i) => (
          <p key={i} className="text-ink-700 dark:text-ink-200 leading-relaxed text-[17px]">{p}</p>
        ))}
      </div>

      <div className="mt-12 rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-700 p-8 text-white text-center">
        <h3 className="font-display font-extrabold text-2xl">Put this into action</h3>
        <p className="text-brand-50/90 mt-2">Use the finder to get matched to products that fit what you just read.</p>
        <Link href={finderLink} className="btn inline-flex mt-5 bg-white text-brand-700 hover:bg-brand-50 px-6 py-3 font-bold"><Sparkles size={17} /> Open the finder</Link>
      </div>
    </article>
  );
}
