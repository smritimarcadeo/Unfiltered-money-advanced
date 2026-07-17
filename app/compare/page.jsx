import CompareWorkspace from '@/components/compare/CompareWorkspace';

export const metadata = {
  title: 'Compare — side by side, with a live spend simulator',
  description: 'Line up to 4 products side by side, see the winner on every row, and for cards watch net value recompute live as you move your spend.',
  alternates: { canonical: 'https://unfilteredmoney.example/compare' },
};

export default function ComparePage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow">Compare workspace</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">See the real differences</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-3">
          Not a spec sheet — a decision tool. Winner highlighted on every row, and for credit cards
          the net value recomputes live as you move your spend.
        </p>
      </div>
      <div className="mt-10">
        <CompareWorkspace />
      </div>
    </div>
  );
}
