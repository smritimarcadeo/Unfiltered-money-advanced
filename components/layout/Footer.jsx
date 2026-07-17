import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { DISCLOSURE } from '@/data/site';

const cols = [
  { title: 'Products', links: [['Insurance', '/insurance'], ['Credit Cards', '/credit-cards'], ['Investments', '/investments'], ['Loans', '/loans'], ['Offers', '/offers']] },
  { title: 'Tools', links: [['Spending Simulator', '/tools/spending-simulator'], ['Wallet Optimizer', '/tools/wallet-optimizer'], ['Offer Watch', '/tools/offer-watch'], ['Eligibility Wizard', '/eligibility'], ['Compare', '/compare'], ['All Calculators', '/tools']] },
  { title: 'Company', links: [['About', '/about'], ['How we rate', '/methodology'], ['Glossary', '/glossary'], ['Learn / Blog', '/blog'], ['Contact', '/contact'], ['Privacy Policy', '/privacy-policy']] },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-200 dark:border-ink-800 bg-white/60 dark:bg-ink-900/60">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-600 text-white">
                <TrendingUp size={18} strokeWidth={2.5} />
              </span>
              <span className="font-display font-extrabold text-lg text-ink-900 dark:text-white">
                Unfiltered<span className="text-brand-600">Money</span>
              </span>
            </div>
            <p className="text-sm text-ink-500 dark:text-ink-400 max-w-xs leading-relaxed">
              Honest, unbiased guidance to help Indians pick the right card, cover and
              investment — matched to what actually fits you.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-3">{c.title}</h4>
              <ul className="space-y-2">
                {c.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-ink-600 dark:text-ink-300 hover:text-brand-600 transition">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-ink-200 dark:border-ink-800">
          <p className="text-xs text-ink-400 leading-relaxed max-w-3xl">
            {DISCLOSURE}{' '}
            <Link href="/methodology" className="text-brand-600 hover:underline font-semibold">
              See exactly how we rate and get paid →
            </Link>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-400">
            <span>© {'2026'} UnfilteredMoney</span>
            <Link href="/privacy-policy" className="hover:text-brand-600">Privacy</Link>
            <Link href="/methodology" className="hover:text-brand-600">How we rate</Link>
            <Link href="/about" className="hover:text-brand-600">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
