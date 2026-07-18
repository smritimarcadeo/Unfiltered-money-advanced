import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ArrowLeft, Coins, ShieldCheck, Info, Lock } from 'lucide-react';
import { PRODUCTS } from '@/data/products';
import { getSlug, getBySlugAny, unfilteredScore } from '@/lib/engine';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: getSlug(p) }));
}

export function generateMetadata({ params }) {
  const p = getBySlugAny(params.slug);
  if (!p) return {};
  return {
    title: `Leaving for ${p.provider}`,
    description: `You're about to leave UnfilteredMoney for ${p.provider}.`,
    robots: { index: false, follow: false },
  };
}

export default function GoPage({ params }) {
  const product = getBySlugAny(params.slug);
  if (!product) notFound();

  const score = unfilteredScore(product);
  const isDemoLink = !product.applyUrl || product.applyUrl === '#';

  return (
    <div className="container-page py-16 max-w-xl">
      <div className="card-surface p-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-brand-600 text-white font-bold">{product.logo}</span>
          <ExternalLink size={20} className="text-ink-300" />
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-ink-100 dark:bg-ink-800 text-ink-500 text-xs font-bold px-1 text-center leading-tight">
            {product.provider.split(' ')[0]}
          </span>
        </div>

        <h1 className="heading-xl text-2xl mt-6">You're leaving for {product.provider}</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">
          {product.name} · Unfiltered Score {score}/100
        </p>

        {/* the disclosure — the whole point of this page */}
        <div className={`mt-6 rounded-2xl border-2 p-5 text-left ${
          product.sponsored
            ? 'border-amber-200 dark:border-amber-500/30 bg-amber-50/60 dark:bg-amber-500/5'
            : 'border-brand-200 dark:border-brand-500/30 bg-brand-50/50 dark:bg-brand-500/5'
        }`}>
          <h2 className="flex items-center gap-2 font-bold text-sm text-ink-900 dark:text-white">
            <Coins size={15} className={product.sponsored ? 'text-amber-600' : 'text-brand-600'} />
            {product.sponsored ? 'We may earn a commission on this one' : 'We earn nothing from this one'}
          </h2>
          <p className="text-sm text-ink-700 dark:text-ink-200 mt-2 leading-relaxed">
            {product.sponsored
              ? 'This is a sponsored placement. If you apply, we may be paid — and we are telling you before you click, not in a footnote afterwards. It did not change the score, the decision, or a single word of our take.'
              : 'There is no affiliate arrangement here. We rated it and ranked it exactly the same way as everything else — which is the point.'}
          </p>
        </div>

        <div className="mt-4 space-y-2 text-left">
          <p className="flex items-start gap-2 text-xs text-ink-500 dark:text-ink-400">
            <Lock size={13} className="mt-0.5 shrink-0" />
            Nothing about you travels with this click. Your saved answers, age and income stay in your browser.
          </p>
          <p className="flex items-start gap-2 text-xs text-ink-500 dark:text-ink-400">
            <ShieldCheck size={13} className="mt-0.5 shrink-0" />
            From here on, {product.provider}'s own privacy policy and terms apply — not ours.
          </p>
        </div>

        {isDemoLink ? (
          <div className="mt-6 rounded-xl bg-ink-50 dark:bg-ink-800 p-4">
            <p className="flex items-start gap-2 text-xs text-ink-500 dark:text-ink-400 text-left">
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>
                <strong>Demo build:</strong> there's no real destination to send you to, and no click
                tracking exists — that needs a backend. In production this page would redirect to{' '}
                {product.provider} with the affiliate reference attached.
              </span>
            </p>
          </div>
        ) : (
          <a href={product.applyUrl} rel="nofollow sponsored noopener" className="btn-primary w-full justify-center mt-6 py-3">
            Continue to {product.provider} <ExternalLink size={16} />
          </a>
        )}

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <Link href={`/${product.category}/${getSlug(product)}`} className="btn-ghost text-sm">
            <ArrowLeft size={14} /> Back to the X-Ray
          </Link>
        </div>
      </div>
    </div>
  );
}
