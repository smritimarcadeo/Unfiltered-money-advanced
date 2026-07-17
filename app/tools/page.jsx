import Link from 'next/link';
import { Gauge, ArrowRight } from 'lucide-react';
import Calculators from '@/components/tools/Calculators';

export const metadata = {
  title: 'Money Tools — SIP, EMI, cover, tax & rewards calculators',
  description: 'Free calculators to plan your SIP corpus, loan EMI, insurance cover, 80C tax saving and credit-card rewards — then jump to matching products.',
  alternates: { canonical: 'https://unfilteredmoney.example/tools' },
};

export default function ToolsPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow">Free tools</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Money calculators</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-3">Run the numbers in seconds, then let the finder match you to real products.</p>
      </div>

      {/* simulator promo */}
      <Link href="/tools/spending-simulator"
        className="group mt-8 flex flex-wrap items-center gap-4 rounded-3xl bg-gradient-to-br from-brand-600 to-emerald-700 p-6 text-white hover:shadow-lift transition">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/15 shrink-0"><Gauge size={24} /></span>
        <div className="min-w-0 flex-1">
          <p className="font-display font-extrabold text-xl">Spending Simulator</p>
          <p className="text-sm text-brand-50/90 mt-0.5">Set your real monthly spend — watch every card re-rank by net yearly value.</p>
        </div>
        <span className="btn bg-white text-brand-700 group-hover:bg-brand-50 px-5 py-2.5 text-sm font-bold shrink-0">
          Open <ArrowRight size={15} />
        </span>
      </Link>

      <div className="mt-8">
        <Calculators />
      </div>
    </div>
  );
}
