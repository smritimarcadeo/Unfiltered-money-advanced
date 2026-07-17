import WalletOptimizer from '@/components/tools/WalletOptimizer';

export const metadata = {
  title: 'Wallet Optimizer — keep, replace or remove your cards',
  description: 'Tell us which cards you hold and how you spend. We\'ll tell you which ones are earning their place, which to swap, and which are quietly costing you money.',
  alternates: { canonical: 'https://unfilteredmoney.example/tools/wallet-optimizer' },
};

export default function WalletOptimizerPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow">Wallet Optimizer</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Is your wallet actually paying you?</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-3">
          Most people hold a card they stopped benefiting from years ago. Pick your cards, set your
          spend, and get a blunt keep / replace / remove verdict on each — with the rupee impact.
        </p>
      </div>
      <div className="mt-10">
        <WalletOptimizer />
      </div>
    </div>
  );
}
