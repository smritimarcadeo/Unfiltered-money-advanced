import CategoryView from '@/components/category/CategoryView';

export const metadata = {
  title: 'Loans — home, personal, car, education & gold',
  description: 'Compare loan rates honestly. See the real rate you\'ll get, the fees deducted upfront, and the prepayment catches — before you borrow.',
  alternates: { canonical: 'https://unfilteredmoney.example/loans' },
};

export default function LoansPage() {
  return <CategoryView category="loans" />;
}
