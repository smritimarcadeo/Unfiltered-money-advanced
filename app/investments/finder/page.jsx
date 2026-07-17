import { Suspense } from 'react';
import Finder from '@/components/finder/Finder';
import FinderSkeleton from '@/components/finder/FinderSkeleton';

export const metadata = {
  title: 'Investment Finder — match funds to your goal & risk',
  description: 'Match investments to your goal, horizon and risk appetite in under a minute.',
};

export default function InvestmentFinderPage() {
  return (
    <Suspense fallback={<FinderSkeleton />}>
      <Finder category="investments" />
    </Suspense>
  );
}
