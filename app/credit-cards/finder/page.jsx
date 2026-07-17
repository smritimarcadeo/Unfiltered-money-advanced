import { Suspense } from 'react';
import Finder from '@/components/finder/Finder';
import FinderSkeleton from '@/components/finder/FinderSkeleton';

export const metadata = {
  title: 'Credit Card Finder — match a card to how you spend',
  description: 'Tell us how you spend and we\'ll match the credit card that pays you back the most.',
};

export default function CreditCardFinderPage() {
  return (
    <Suspense fallback={<FinderSkeleton />}>
      <Finder category="credit-cards" />
    </Suspense>
  );
}
