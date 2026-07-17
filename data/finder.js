// ────────────────────────────────────────────────────────────────
//  Preference Finder — quiz config per category.
//  Each option carries `tags` (rewarded when a product shares them),
//  `weight`, and a `reason` shown on the matched product.
//  A question with `filter: true` hard-filters the goal (e.g. type).
// ────────────────────────────────────────────────────────────────

export const FINDERS = {
  insurance: {
    title: 'Insurance Finder',
    subtitle: 'Answer 5 quick questions — get your best-fit plans in 30 seconds.',
    questions: [
      {
        id: 'goal', label: 'What do you want to protect?', type: 'single', filter: true,
        options: [
          { id: 'health', label: 'My health / medical bills', icon: '🏥', tags: ['health'], weight: 3, reason: 'Health cover — exactly what you asked for' },
          { id: 'life', label: 'My family\'s future (term life)', icon: '💙', tags: ['term'], weight: 3, reason: 'Pure term protection for your family' },
          { id: 'car', label: 'My car', icon: '🚗', tags: ['car'], weight: 3, reason: 'Motor cover for your vehicle' },
          { id: 'travel', label: 'A trip abroad', icon: '✈️', tags: ['travel'], weight: 3, reason: 'Travel cover for your trip' },
        ],
      },
      {
        id: 'who', label: 'Who needs to be covered?', type: 'single',
        options: [
          { id: 'me', label: 'Just me', icon: '🙋', tags: ['individual'], weight: 2, reason: 'Great for individual cover' },
          { id: 'family', label: 'My family', icon: '👨‍👩‍👧', tags: ['family'], weight: 2, reason: 'Family-friendly plan' },
          { id: 'parents', label: 'My parents', icon: '👵', tags: ['senior', 'no-medical'], weight: 4, reason: 'Senior-friendly, easy onboarding' },
        ],
      },
      {
        id: 'age', label: 'Your age group?', type: 'single',
        options: [
          { id: 'young', label: '18–30', icon: '🌱', tags: ['young', 'budget-low'], weight: 1, reason: 'Low premiums at your age' },
          { id: 'mid', label: '30–45', icon: '💼', tags: ['budget-mid'], weight: 1, reason: 'Balanced cover for your stage' },
          { id: 'senior', label: '45+', icon: '🧭', tags: ['high-cover', 'no-medical'], weight: 1, reason: 'Adequate cover without hassle' },
        ],
      },
      {
        id: 'budget', label: 'Your budget?', type: 'single',
        options: [
          { id: 'low', label: 'Keep it cheap', icon: '💸', tags: ['budget-low'], weight: 2, reason: 'Fits a lean budget' },
          { id: 'mid', label: 'Balanced', icon: '⚖️', tags: ['budget-mid'], weight: 2, reason: 'Good value for money' },
          { id: 'high', label: 'Best cover, price no bar', icon: '💎', tags: ['high-cover', 'high-claim'], weight: 2, reason: 'Premium cover & top claims' },
        ],
      },
      {
        id: 'priority', label: 'What matters most?', type: 'multi',
        options: [
          { id: 'claim', label: 'High claim settlement', icon: '✅', tags: ['high-claim'], weight: 3, reason: 'Excellent claim settlement record' },
          { id: 'cashless', label: 'Cashless hospitals', icon: '🏨', tags: ['cashless'], weight: 2, reason: 'Wide cashless network' },
          { id: 'tax', label: 'Tax saving', icon: '🧾', tags: ['tax-saving'], weight: 2, reason: 'Helps you save tax' },
          { id: 'cover', label: 'Maximum coverage', icon: '🛡️', tags: ['high-cover'], weight: 2, reason: 'Very high sum insured' },
        ],
      },
    ],
  },

  'credit-cards': {
    title: 'Credit Card Finder',
    subtitle: 'Tell us how you spend — we\'ll match the card that pays you most.',
    questions: [
      {
        id: 'spend', label: 'Where do you spend the most?', type: 'single', filter: true,
        options: [
          { id: 'shopping', label: 'Online shopping', icon: '🛍️', tags: ['shopping', 'cashback'], weight: 3, reason: 'Top rewards on your shopping' },
          { id: 'travel', label: 'Travel & flights', icon: '✈️', tags: ['travel', 'miles'], weight: 3, reason: 'Best travel & lounge value' },
          { id: 'fuel', label: 'Fuel & commute', icon: '⛽', tags: ['fuel'], weight: 3, reason: 'High fuel savings' },
          { id: 'everything', label: 'A bit of everything', icon: '🧩', tags: ['cashback', 'rewards'], weight: 3, reason: 'Great all-rounder rewards' },
        ],
      },
      {
        id: 'income', label: 'Your annual income?', type: 'single',
        options: [
          { id: 'low', label: 'Under ₹4L', icon: '🌱', tags: ['low-income', 'first-card'], weight: 2, reason: 'Easy eligibility for you' },
          { id: 'mid', label: '₹4L – ₹10L', icon: '💼', tags: ['mid-income'], weight: 2, reason: 'Fits your income band' },
          { id: 'high', label: '₹10L+', icon: '💎', tags: ['high-income', 'premium'], weight: 2, reason: 'Unlocks premium perks' },
        ],
      },
      {
        id: 'fee', label: 'Annual fee preference?', type: 'single',
        options: [
          { id: 'free', label: 'Lifetime free only', icon: '🆓', tags: ['lifetime-free', 'no-annual-fee'], weight: 3, reason: 'No annual fee, ever' },
          { id: 'ok', label: 'OK if rewards justify it', icon: '👍', tags: ['rewards'], weight: 1, reason: 'Rewards outweigh the fee' },
        ],
      },
      {
        id: 'perk', label: 'Which perks do you want?', type: 'multi',
        options: [
          { id: 'cashback', label: 'Cashback', icon: '💰', tags: ['cashback'], weight: 2, reason: 'Strong cashback' },
          { id: 'lounge', label: 'Airport lounges', icon: '🛋️', tags: ['lounge'], weight: 2, reason: 'Includes lounge access' },
          { id: 'miles', label: 'Air miles / travel', icon: '🧳', tags: ['miles', 'travel'], weight: 2, reason: 'Converts to travel value' },
          { id: 'first', label: 'It\'s my first card', icon: '🔰', tags: ['first-card', 'student'], weight: 2, reason: 'Beginner-friendly' },
        ],
      },
    ],
  },

  investments: {
    title: 'Investment Finder',
    subtitle: 'Match investments to your goal, horizon and risk appetite.',
    questions: [
      {
        id: 'goal', label: 'What\'s your goal?', type: 'single', filter: true,
        options: [
          { id: 'wealth', label: 'Long-term wealth', icon: '🌳', tags: ['equity', 'long-term'], weight: 3, reason: 'Built for long-term growth' },
          { id: 'tax', label: 'Save tax (80C)', icon: '🧾', tags: ['tax-saving'], weight: 3, reason: 'Saves tax under 80C' },
          { id: 'retire', label: 'Retirement', icon: '🏖️', tags: ['retirement', 'long-term'], weight: 3, reason: 'Designed for retirement' },
          { id: 'safe', label: 'Park money safely', icon: '🛟', tags: ['debt', 'low-risk'], weight: 3, reason: 'Lower-risk, stable option' },
        ],
      },
      {
        id: 'horizon', label: 'When do you need the money?', type: 'single',
        options: [
          { id: 'short', label: 'Under 3 years', icon: '⏱️', tags: ['short-term', 'low-risk'], weight: 2, reason: 'Suits a short horizon' },
          { id: 'long', label: '5+ years', icon: '📅', tags: ['long-term', 'equity'], weight: 2, reason: 'Rewards patience over years' },
        ],
      },
      {
        id: 'risk', label: 'Your risk appetite?', type: 'single',
        options: [
          { id: 'low', label: 'Play it safe', icon: '🛡️', tags: ['low-risk', 'debt'], weight: 2, reason: 'Low volatility' },
          { id: 'mid', label: 'Balanced', icon: '⚖️', tags: ['mid-risk', 'index'], weight: 2, reason: 'Balanced risk & return' },
          { id: 'high', label: 'Aggressive', icon: '🚀', tags: ['high-risk', 'equity'], weight: 2, reason: 'Higher growth potential' },
        ],
      },
      {
        id: 'exp', label: 'Your experience level?', type: 'single',
        options: [
          { id: 'new', label: 'I\'m a beginner', icon: '🔰', tags: ['beginner', 'index', 'sip'], weight: 2, reason: 'Beginner-friendly & simple' },
          { id: 'pro', label: 'I invest already', icon: '📊', tags: ['lumpsum', 'high-risk'], weight: 1, reason: 'Suits experienced investors' },
        ],
      },
    ],
  },
};

FINDERS.loans = {
  title: 'Loan Finder',
  subtitle: 'Tell us what you need the money for — we\'ll point you at the cheapest sensible way to get it.',
  questions: [
    {
      id: 'purpose', label: 'What do you need the money for?', type: 'single', filter: true,
      options: [
        { id: 'home', label: 'Buying a home', icon: '🏠', tags: ['home'], weight: 3, reason: 'Home loan — the cheapest big-ticket borrowing' },
        { id: 'car', label: 'Buying a car', icon: '🚗', tags: ['car'], weight: 3, reason: 'Secured car loan for your purchase' },
        { id: 'education', label: 'Education / studies', icon: '🎓', tags: ['education'], weight: 3, reason: 'Education loan with a moratorium' },
        { id: 'anything', label: 'Something urgent / personal', icon: '⚡', tags: ['personal', 'gold'], weight: 3, reason: 'Available for any purpose' },
      ],
    },
    {
      id: 'speed', label: 'How fast do you need it?', type: 'single',
      options: [
        { id: 'now', label: 'Today, honestly', icon: '🏃', tags: ['fast-approval'], weight: 3, reason: 'Disburses fast' },
        { id: 'weeks', label: 'A few weeks is fine', icon: '🗓️', tags: ['low-rate', 'collateral'], weight: 2, reason: 'Worth the wait for a lower rate' },
      ],
    },
    {
      id: 'security', label: 'Can you offer any security?', type: 'single',
      options: [
        { id: 'gold', label: 'I own gold', icon: '🥇', tags: ['gold', 'collateral'], weight: 3, reason: 'Your gold cuts the rate roughly in half' },
        { id: 'property', label: 'Property / the asset itself', icon: '🏡', tags: ['collateral', 'low-rate'], weight: 2, reason: 'Secured — much cheaper' },
        { id: 'none', label: 'Nothing — unsecured only', icon: '🙅', tags: ['no-collateral'], weight: 2, reason: 'No collateral needed' },
      ],
    },
    {
      id: 'profile', label: 'Your situation?', type: 'single',
      options: [
        { id: 'salaried', label: 'Salaried', icon: '💼', tags: ['salaried'], weight: 1, reason: 'Suits salaried applicants' },
        { id: 'self', label: 'Self-employed', icon: '🧑‍🍳', tags: ['self-employed', 'gold'], weight: 1, reason: 'Works without salary slips' },
        { id: 'noincome', label: 'No income proof', icon: '📄', tags: ['low-income', 'gold'], weight: 2, reason: 'No income proof required' },
      ],
    },
    {
      id: 'priority', label: 'What matters most?', type: 'multi',
      options: [
        { id: 'rate', label: 'Lowest interest rate', icon: '📉', tags: ['low-rate'], weight: 3, reason: 'Among the lowest rates here' },
        { id: 'tax', label: 'Tax benefit', icon: '🧾', tags: ['tax-saving'], weight: 2, reason: 'Interest gives you a tax break' },
        { id: 'long', label: 'Small EMI / long tenure', icon: '📆', tags: ['long-tenure'], weight: 2, reason: 'Long tenure keeps the EMI small' },
        { id: 'quick', label: 'Speed over everything', icon: '⚡', tags: ['fast-approval'], weight: 2, reason: 'Money in hand fastest' },
      ],
    },
  ],
};

export const getFinder = (cat) => FINDERS[cat];
