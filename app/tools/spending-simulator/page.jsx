import SpendingSimulator from '@/components/tools/SpendingSimulator';

export const metadata = {
  title: 'Spending Simulator — rank cards by how YOU actually spend',
  description: 'Move eight sliders to your real monthly spend and watch every credit card re-rank by net yearly value — rewards minus fees, with caps applied.',
  alternates: { canonical: 'https://unfilteredmoney.example/tools/spending-simulator' },
};

export default function SpendingSimulatorPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow">Spending Simulator</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Which card pays <em className="text-brand-600 not-italic">you</em> the most?</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-3">
          Headline reward rates are marketing. Set your real spend and see the net value each card
          returns — after fees and after the caps nobody mentions.
        </p>
      </div>
      <div className="mt-10">
        <SpendingSimulator />
      </div>
    </div>
  );
}
