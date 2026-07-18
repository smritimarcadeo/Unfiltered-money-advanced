export const BLOGS = [
  {
    slug: 'term-vs-endowment',
    title: 'Term vs Endowment: why mixing insurance & investment costs you',
    category: 'Insurance',
    readTime: '5 min',
    date: '2026-06-12',
    excerpt: 'Endowment and money-back policies promise "returns" but deliver poor cover and low growth. Here\'s the honest math.',
    tag: 'insurance',
    author: { name: 'Priya Sharma', role: 'Ex-insurance advisor' },
    tags: ['insurance', 'term plan', 'endowment'],
    body: [
      'Insurance and investment are two different jobs. The moment you combine them, you usually get a bad version of both — low cover and low returns.',
      'A term plan gives you a large cover (say ₹1 crore) for a small premium. An endowment plan gives you a fraction of that cover for a much higher premium, and "returns" that rarely beat inflation.',
      'The smarter approach: buy a pure term plan for protection, and invest the difference in an index fund or ELSS for growth. Keep the two jobs separate.',
      'Rule of thumb: your cover should be roughly 10–15× your annual income. If a policy can\'t give you that cheaply, it\'s probably mixing in an investment you don\'t need.',
    ],
  },
  {
    slug: 'first-credit-card',
    title: 'How to choose your first credit card (without getting trapped)',
    category: 'Credit Cards',
    readTime: '4 min',
    date: '2026-05-28',
    excerpt: 'Start lifetime-free, match rewards to how you actually spend, and never revolve a balance. A simple playbook.',
    tag: 'credit-cards',
    author: { name: 'Rahul Verma', role: 'Cards & rewards nerd' },
    tags: ['credit cards', 'beginners', 'lifetime free'],
    body: [
      'Your first card should be lifetime-free. There\'s no reason to pay an annual fee before you know how you\'ll use the card.',
      'Match rewards to your real spending. If you shop online, a cashback card beats a travel card. If you fly often, lounge access and miles matter more.',
      'The golden rule: pay the full bill every month. Revolving a balance at 36–42% APR wipes out every reward you earn.',
      'Use the Finder to see which lifetime-free card fits your income and spending in about a minute.',
    ],
  },
  {
    slug: 'index-fund-sip',
    title: 'Why an index fund SIP is the best first investment',
    category: 'Investments',
    readTime: '6 min',
    date: '2026-05-10',
    excerpt: 'Low cost, no fund-manager risk, and it quietly beats most active funds over time. The beginner\'s core holding.',
    tag: 'investments',
    author: { name: 'Ananya Iyer', role: 'Personal finance writer' },
    tags: ['investments', 'index fund', 'SIP', 'beginners'],
    body: [
      'An index fund simply buys all the companies in an index like the Nifty 50. No stock-picking, no guessing — you own the market.',
      'Because there\'s no active manager, costs are tiny (often ~0.2%). Over decades, low costs compound into a big difference.',
      'A monthly SIP automates discipline: you invest a fixed amount every month, buying more units when prices are low.',
      'Start small — even ₹500/month — and increase it as your income grows. Time in the market beats timing the market.',
    ],
  },
  {
    slug: 'health-insurance-mistakes',
    title: '5 health insurance mistakes that cost you at claim time',
    category: 'Insurance',
    readTime: '5 min',
    date: '2026-04-22',
    excerpt: 'Room-rent caps, under-insuring, and skipping disclosures are the silent claim-killers. Avoid these.',
    tag: 'insurance',
    author: { name: 'Priya Sharma', role: 'Ex-insurance advisor' },
    tags: ['insurance', 'health', 'claims'],
    body: [
      'Mistake 1: Under-insuring. A ₹3L cover sounds fine until a single hospitalisation costs ₹6L. Aim for ₹10L+ in a metro.',
      'Mistake 2: Ignoring room-rent limits. A capped room rent can proportionally cut your entire claim.',
      'Mistake 3: Not disclosing pre-existing conditions. Non-disclosure is the top reason honest claims get rejected.',
      'Mistake 4: Buying only employer cover. It ends the day your job does. Have your own base policy.',
      'Mistake 5: Chasing the cheapest premium. Check the claim settlement ratio and cashless network first.',
    ],
  },
];

export const getBlog = (slug) => BLOGS.find((b) => b.slug === slug);

// Category filter list, in display order.
export const BLOG_CATS = ['All', ...Array.from(new Set(BLOGS.map((b) => b.category)))];

// Per-category accent (chip + featured gradient) — light + dark aware.
export const CAT_STYLE = {
  'Insurance': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  'Credit Cards': 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  'Investments': 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  'Loans': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
};
export const catStyle = (cat) => CAT_STYLE[cat] || 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300';

// Deterministic gradient placeholder (no images in the dataset) — the old
// site did the same as an image fallback.
const TINTS = ['from-brand-500 to-emerald-700', 'from-sky-500 to-indigo-700', 'from-violet-500 to-purple-700', 'from-amber-500 to-orange-700', 'from-rose-500 to-pink-700'];
export const blogTint = (slug) => TINTS[(slug || '').length % TINTS.length];
