import Hero from '@/components/home/Hero';
import { HowItWorks, CategoryShowcase, Trust, Testimonials, FinalCTA } from '@/components/home/Sections';
import FAQ from '@/components/shared/FAQ';
import RecentlyViewed from '@/components/shared/RecentlyViewed';

export default function HomePage() {
  return (
    <>
      <Hero />
      <RecentlyViewed />
      <CategoryShowcase />
      <HowItWorks />
      <Trust />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
