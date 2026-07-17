import CategoryView from '@/components/category/CategoryView';

export const metadata = {
  title: 'Investments — index funds, ELSS, debt & retirement',
  description: 'Match investments to your goal, horizon and risk. Compare index funds, ELSS tax savers, debt funds and retirement options honestly.',
};

export default function InvestmentsPage() {
  return <CategoryView category="investments" />;
}
