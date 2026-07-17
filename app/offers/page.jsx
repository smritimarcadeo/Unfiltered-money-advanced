import OfferWatch from '@/components/offers/OfferWatch';

export const metadata = {
  title: 'Offers — with the catch spelled out',
  description: 'Live card, insurance and loan offers in India — each with a live countdown, our honest estimate of what it is really worth, and the catch nobody mentions.',
  alternates: { canonical: 'https://unfilteredmoney.example/offers' },
};

export default function OffersPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow">Offers</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Offers, with the catch attached</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-3">
          Every offer here shows what it's realistically worth to you — and the condition that
          quietly decides whether you'll ever see that value.
        </p>
      </div>
      <div className="mt-10">
        <OfferWatch mode="offers" />
      </div>
    </div>
  );
}
