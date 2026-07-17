export const SITE = {
  name: 'UnfilteredMoney',
  tagline: 'Honest money guidance for India',
  description: 'Unbiased comparisons of credit cards, insurance and investments — with a smart finder that recommends what actually fits you.',
};

// `short` is what the desktop bar shows — the full label would overflow
// once every vertical is in the nav. The mobile menu always uses `label`.
export const NAV = [
  { label: 'Insurance', href: '/insurance' },
  { label: 'Credit Cards', short: 'Cards', href: '/credit-cards' },
  { label: 'Investments', short: 'Invest', href: '/investments' },
  { label: 'Loans', href: '/loans' },
  { label: 'Offers', href: '/offers' },
  { label: 'Tools', href: '/tools' },
  { label: 'Learn', href: '/blog' },
];

export const STATS = [
  { value: '25+', label: 'Products compared' },
  { value: '100%', label: 'Unbiased picks' },
  { value: '30 sec', label: 'To your match' },
  { value: '₹0', label: 'To use, always' },
];

export const HOW_IT_WORKS = [
  { icon: 'ClipboardList', title: 'Tell us your preference', text: 'Answer a few quick questions — goal, budget and what matters to you.' },
  { icon: 'Sparkles', title: 'Get matched instantly', text: 'Our finder scores every product and shows your best-fit picks with reasons.' },
  { icon: 'Scale', title: 'Compare side-by-side', text: 'Line up shortlisted options and see the real differences, not the marketing.' },
  { icon: 'BadgeCheck', title: 'Decide with confidence', text: 'Honest pros & cons, eligibility and clear disclosures — then apply.' },
];

export const TRUST = [
  { icon: 'ShieldCheck', title: 'No hidden bias', text: 'We show honest pros AND cons, and clearly label anything sponsored.' },
  { icon: 'Eye', title: 'Full transparency', text: 'You always see why a product is recommended to you.' },
  { icon: 'Lock', title: 'Your data stays yours', text: 'The finder runs in your browser. No account needed to get matched.' },
  { icon: 'HeartHandshake', title: 'People first', text: 'Guidance designed to help you decide — not to push a sale.' },
];

export const TESTIMONIALS = [
  { name: 'Ananya R.', role: 'First-time card user', text: 'The finder suggested a lifetime-free card that fit my income perfectly. Took me under a minute.', avatar: 'AR' },
  { name: 'Vikram S.', role: 'New dad', text: 'Finally understood term vs endowment. Picked a plan with 99% claim ratio without the sales pressure.', avatar: 'VS' },
  { name: 'Priya M.', role: 'Salaried, 28', text: 'Compared three ELSS funds side-by-side and saw exactly what differed. Super clear.', avatar: 'PM' },
];

export const FAQS = [
  { q: 'Is UnfilteredMoney really unbiased?', a: 'We show honest pros and cons for every product and clearly label anything sponsored. The finder ranks by how well a product fits you — not by who pays us.' },
  { q: 'Do I need an account to use the finder?', a: 'No. The Preference Finder runs entirely in your browser. You can save shortlists locally without signing up.' },
  { q: 'How are recommendations calculated?', a: 'Each answer you give adds weight to products that match your goal, budget and priorities. We then rank them by match score and show the reasons.' },
  { q: 'Are these live prices and offers?', a: 'This is a demo catalog. In production, product data would be updated regularly with a "last updated" date on each item.' },
  { q: 'Is my data shared with banks?', a: 'No. Nothing is sent anywhere unless you choose to click "Apply" on a product.' },
];

export const DISCLOSURE =
  'UnfilteredMoney may earn a commission when you apply through some links, marked "Sponsored". This never affects your match score or the honest pros & cons we show. This is a demo build with sample data — not financial advice.';
