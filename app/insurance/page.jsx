import CategoryView from '@/components/category/CategoryView';

export const metadata = {
  title: 'Insurance — compare health, term life, car & travel plans',
  description: 'Honest, unbiased comparison of insurance plans in India. Use the finder to match health, term life, car or travel cover to your needs.',
};

export default function InsurancePage() {
  return <CategoryView category="insurance" />;
}
