import { Suspense } from 'react';
import Finder from '@/components/finder/Finder';
import FinderSkeleton from '@/components/finder/FinderSkeleton';

export const metadata = {
  title: 'Insurance Finder — get matched in 30 seconds',
  description: 'Answer a few quick questions and get your best-fit insurance plans with the reasons why.',
};

export default function InsuranceFinderPage() {
  return (
    <Suspense fallback={<FinderSkeleton />}>
      <Finder category="insurance" />
    </Suspense>
  );
}
