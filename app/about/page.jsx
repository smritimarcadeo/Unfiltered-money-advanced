import Link from 'next/link';
import { ShieldCheck, Eye, HeartHandshake, Scale, ArrowRight } from 'lucide-react';
import { DISCLOSURE } from '@/data/site';

export const metadata = {
  title: 'About — why we built UnfilteredMoney',
  description: 'We give honest, unbiased money guidance for India — showing pros AND cons, and never letting sponsorship change your match.',
};

const values = [
  { icon: Eye, title: 'Transparency', text: 'You always see why a product is recommended, and what its downsides are.' },
  { icon: Scale, title: 'Fair ranking', text: 'Matches are ranked by fit, not by who pays us. Sponsored items are labelled.' },
  { icon: ShieldCheck, title: 'Your privacy', text: 'The finder runs in your browser. No account, no data harvesting.' },
  { icon: HeartHandshake, title: 'People first', text: 'Built to help you decide well — not to push a sale.' },
];

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow">Our mission</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Money advice without the filter</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-4 leading-relaxed">
          Most comparison sites rank products by commission. We don't. UnfilteredMoney exists to
          give Indians honest, jargon-free guidance — a smart finder that matches products to your
          real needs, with the pros <em>and</em> the cons laid bare.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        {values.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.title} className="card-surface p-6">
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-brand-600 text-white shadow-lift"><Icon size={22} /></span>
              <h3 className="font-display font-bold text-ink-900 dark:text-white mt-4">{v.title}</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-2 leading-relaxed">{v.text}</p>
            </div>
          );
        })}
      </div>

      <div className="card-surface p-6 mt-8">
        <h4 className="font-bold text-ink-800 dark:text-white text-sm mb-2">Disclosure</h4>
        <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{DISCLOSURE}</p>
      </div>

      <div className="mt-10">
        <Link href="/insurance/finder" className="btn-primary text-base px-6 py-3">Try the finder <ArrowRight size={17} /></Link>
      </div>
    </div>
  );
}
