import OfferWatch from '@/components/offers/OfferWatch';

export const metadata = {
  title: 'Offer Watch — countdowns & fine-print change alerts',
  description: 'Live expiry countdowns on every offer, plus a feed of every fine-print change issuers have quietly made.',
  alternates: { canonical: 'https://unfilteredmoney.example/tools/offer-watch' },
};

export default function OfferWatchPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow">Offer Watch</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Nothing expires without warning</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-3">
          Live countdowns on every offer, and a running record of the terms issuers quietly changed
          while nobody was looking.
        </p>
      </div>
      <div className="mt-10">
        <OfferWatch mode="watch" />
      </div>
    </div>
  );
}
