import BlogList from '@/components/blog/BlogList';

export const metadata = {
  title: 'Learn — honest money guides',
  description: 'Plain-English guides on insurance, credit cards and investing in India. No jargon, no sales pitch.',
  alternates: { canonical: 'https://unfilteredmoney.example/blog' },
};

export default function BlogPage() {
  return (
    <div className="container-page py-12">
      <div className="max-w-2xl">
        <span className="section-eyebrow">Learn</span>
        <h1 className="heading-xl text-4xl sm:text-5xl mt-3">Money, explained honestly</h1>
        <p className="text-lg text-ink-500 dark:text-ink-400 mt-3">Short, no-jargon reads to help you decide with confidence.</p>
      </div>
      <BlogList />
    </div>
  );
}
