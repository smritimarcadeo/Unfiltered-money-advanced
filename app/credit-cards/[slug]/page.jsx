import { buildStaticParams, buildMetadata, ProductPage } from '@/lib/product-page';

const CATEGORY = 'credit-cards';

export function generateStaticParams() {
  return buildStaticParams(CATEGORY);
}

export function generateMetadata({ params }) {
  return buildMetadata(CATEGORY, params.slug);
}

export default function Page({ params }) {
  return <ProductPage category={CATEGORY} slug={params.slug} />;
}
