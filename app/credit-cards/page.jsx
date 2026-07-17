import CategoryView from '@/components/category/CategoryView';

export const metadata = {
  title: 'Credit Cards — cashback, travel, fuel & lifetime-free',
  description: 'Compare the best credit cards in India by how you actually spend. Match cashback, travel, fuel or lifetime-free cards to your income and perks.',
};

export default function CreditCardsPage() {
  return <CategoryView category="credit-cards" />;
}
