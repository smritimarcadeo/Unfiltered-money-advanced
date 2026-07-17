import { Suspense } from 'react';
import Finder from '@/components/finder/Finder';
import FinderSkeleton from '@/components/finder/FinderSkeleton';

export const metadata = {
  title: 'Loan Finder — the cheapest sensible way to borrow',
  description: 'Answer a few questions and we\'ll point you at the cheapest sensible way to borrow for your need.',
};

export default function LoansFinderPage() {
  return (
    <Suspense fallback={<FinderSkeleton />}>
      <Finder category="loans" />
    </Suspense>
  );
}
