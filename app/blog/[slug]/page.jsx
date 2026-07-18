import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, CalendarDays, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { BLOGS, getBlog, catStyle, blogTint } from '@/data/blog';
import ShareBar from '@/components/blog/ShareBar';

export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }) {
  const b = getBlog(params.slug);
  if (!b) return {};
  return {
    title: b.title,
    description: b.excerpt,
    alternates: { canonical: `https://unfilteredmoney.example/blog/${b.slug}` },
    openGraph: { title: b.title, description: b.excerpt, type: 'article' },
  };
}

const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export default function BlogDetailPage({ params }) {
  const b = getBlog(params.slug);
  if (!b) notFound();

  const related = BLOGS.filter((x) => x.slug !== b.slug && x.category === b.category).slice(0, 3);
  const more = related.length < 3 ? BLOGS.filter((x) => x.slug !== b.slug && !related.includes(x)).slice(0, 3 - related.length) : [];
  const sidebarPosts = [...related, ...more];
  const finderLink = b.tag === 'insurance' ? '/insurance/finder' : b.tag === 'credit-cards' ? '/credit-cards/finder' : '/investments/finder';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: b.title,
    description: b.excerpt,
    datePublished: b.date,
    author: { '@type': 'Person', name: b.author?.name || 'UnfilteredMoney' },
    publisher: { '@type': 'Organization', name: 'UnfilteredMoney' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* breadcrumb */}
      <div className="border-b border-ink-200 dark:border-ink-800">
        <div className="container-page py-4">
          <nav className="flex items-center gap-1.5 text-xs text-ink-500 flex-wrap">
            <Link href="/" className="hover:text-brand-600 font-medium">Home</Link>
            <ChevronRight size={12} className="text-ink-300" />
            <Link href="/blog" className="hover:text-brand-600 font-medium">Blog</Link>
            <ChevronRight size={12} className="text-ink-300" />
            <span className="text-brand-600 font-semibold line-clamp-1 max-w-[220px]">{b.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-page py-10">
        <div className="grid lg:grid-cols-4 gap-10">
          {/* article */}
          <article className="lg:col-span-3 min-w-0">
            {/* banner */}
            <div className={`relative w-full h-56 md:h-80 rounded-3xl overflow-hidden grid place-items-center bg-gradient-to-br ${blogTint(b.slug)} mb-6`}>
              <span className="font-display font-black text-8xl md:text-9xl text-white/20 select-none">{b.title.charAt(0)}</span>
              <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 rounded-full ${catStyle(b.category)}`}>{b.category}</span>
            </div>

            <h1 className="heading-xl text-3xl md:text-4xl leading-tight">{b.title}</h1>

            {/* byline */}
            <div className="flex flex-wrap items-center gap-3 mt-5 pb-6 border-b border-ink-100 dark:border-ink-800">
              <div className="flex items-center gap-2.5">
                <span className="grid place-items-center w-10 h-10 rounded-full bg-brand-600 text-white font-bold text-sm shrink-0">{b.author?.name?.[0] || 'U'}</span>
                <div>
                  <p className="text-[11px] text-ink-400 leading-none mb-1">Written by</p>
                  <p className="text-sm font-bold text-ink-900 dark:text-white leading-none">{b.author?.name || 'UnfilteredMoney'}</p>
                </div>
              </div>
              <span className="text-ink-200 dark:text-ink-700 hidden sm:block">|</span>
              <div className="flex items-center gap-3 text-xs text-ink-500">
                <span className="flex items-center gap-1"><CalendarDays size={13} /> {fmtDate(b.date)}</span>
                <span className="text-ink-300">•</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {b.readTime} read</span>
              </div>
            </div>

            {/* lead */}
            <p className="text-lg text-ink-600 dark:text-ink-300 leading-relaxed font-medium mt-6">{b.excerpt}</p>

            {/* body */}
            <div className="mt-6 space-y-5">
              {b.body.map((p, i) => (
                <p key={i} className="text-[17px] text-ink-700 dark:text-ink-200 leading-relaxed">{p}</p>
              ))}
            </div>

            {/* tags */}
            {b.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {b.tags.map((t) => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 font-medium">#{t}</span>
                ))}
              </div>
            )}

            {/* author bio card */}
            <div className="flex items-start gap-4 mt-8 card-surface p-5">
              <span className="grid place-items-center w-12 h-12 rounded-full bg-brand-600 text-white font-bold shrink-0">{b.author?.name?.[0] || 'U'}</span>
              <div>
                <p className="font-display font-bold text-ink-900 dark:text-white">{b.author?.name || 'UnfilteredMoney'}</p>
                <p className="text-xs text-brand-600 font-semibold">{b.author?.role || 'Editorial team'}</p>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-1.5 leading-relaxed">
                  Writes honest, jargon-free money guides for UnfilteredMoney — pros and cons, never a sales pitch.
                </p>
              </div>
            </div>

            <ShareBar title={b.title} slug={b.slug} />

            {/* CTA */}
            <div className="mt-10 rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-700 p-8 text-white text-center">
              <h3 className="font-display font-extrabold text-2xl">Put this into action</h3>
              <p className="text-brand-50/90 mt-2">Use the finder to get matched to products that fit what you just read.</p>
              <Link href={finderLink} className="btn inline-flex mt-5 bg-white text-brand-700 hover:bg-brand-50 px-6 py-3 font-bold"><Sparkles size={17} /> Open the finder</Link>
            </div>
          </article>

          {/* sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {sidebarPosts.length > 0 && (
                <div className="card-surface p-5">
                  <h3 className="font-display font-bold text-ink-900 dark:text-white mb-3">Related reads</h3>
                  <div className="space-y-3">
                    {sidebarPosts.map((r) => (
                      <Link key={r.slug} href={`/blog/${r.slug}`} className="group flex gap-3 items-start">
                        <span className={`grid place-items-center w-12 h-12 rounded-lg bg-gradient-to-br shrink-0 ${blogTint(r.slug)}`}>
                          <span className="font-display font-black text-lg text-white/40">{r.title.charAt(0)}</span>
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink-800 dark:text-ink-100 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">{r.title}</p>
                          <p className="text-[11px] text-ink-400 mt-1">{r.readTime}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-surface p-5">
                <h3 className="font-display font-bold text-ink-900 dark:text-white mb-3">Explore</h3>
                <div className="space-y-1.5">
                  {[['Insurance', '/insurance'], ['Credit Cards', '/credit-cards'], ['Investments', '/investments'], ['Loans', '/loans'], ['All guides', '/blog']].map(([label, href]) => (
                    <Link key={href} href={href} className="flex items-center justify-between text-sm text-ink-600 dark:text-ink-300 hover:text-brand-600 py-1.5 group">
                      {label} <ArrowRight size={14} className="text-ink-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
