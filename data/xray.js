// ────────────────────────────────────────────────────────────────
//  Money X-Ray data — the "truth report" layer, keyed by product id.
//  Kept separate from products.js so the catalogue stays readable.
//
//   decision     → our blunt YES / MAYBE / NO call for the typical buyer
//   nobodyTells  → the stuff buried in the T&C
//   history      → dated fine-print changes (good / bad / neutral)
//   reward       → (cards only) per-category rates → powers the
//                  Spending Simulator, reward calculator & break-even
// ────────────────────────────────────────────────────────────────

// Monthly-spend categories used by the simulator + reward calculator.
export const SPEND_CATEGORIES = [
  { id: 'online', label: 'Online shopping', icon: '🛍️', def: 8000 },
  { id: 'travel', label: 'Travel & flights', icon: '✈️', def: 3000 },
  { id: 'fuel', label: 'Fuel', icon: '⛽', def: 4000 },
  { id: 'dining', label: 'Dining out', icon: '🍽️', def: 4000 },
  { id: 'bills', label: 'Bills & utilities', icon: '🧾', def: 5000 },
  { id: 'groceries', label: 'Groceries', icon: '🛒', def: 6000 },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', def: 2000 },
  { id: 'other', label: 'Everything else', icon: '💳', def: 5000 },
];

export const XRAY = {
  // ───────────── INSURANCE ─────────────
  'ins-1': {
    decision: { call: 'YES', line: 'The default term plan for most young Indians — big cover, small premium, claims actually paid.' },
    nobodyTells: [
      'The premium you lock at 28 stays flat for the whole term — every year you delay costs you roughly 8–10% more, forever.',
      'The "return of premium" variant nearly doubles your cost to hand back money that inflation has already eaten. Decline it.',
      'Cover above ₹50L triggers a medical test — book it early, because an undiagnosed condition found later is a claim rejection waiting to happen.',
    ],
    history: [
      { date: '2026-04-01', label: 'Claim settlement ratio improved to 99.4% (from 99.1%)', type: 'good' },
      { date: '2025-11-15', label: 'Critical illness rider premium raised ~6%', type: 'bad' },
      { date: '2025-06-10', label: 'Online medical test slots added in 40 more cities', type: 'good' },
    ],
  },
  'ins-2': {
    decision: { call: 'MAYBE', line: 'Excellent cashless network, but the co-pay and room-rent terms decide whether it is actually good for you.' },
    nobodyTells: [
      'The no-claim bonus sounds generous, but it is added to your cover — not your wallet. It does nothing if you never claim.',
      'Cashless only works inside the network. Outside it you pay the whole bill first and wait weeks for reimbursement.',
      'Buying the ₹5L slab to save premium is a false economy in a metro — one ICU week can exhaust it.',
    ],
    history: [
      { date: '2026-05-20', label: 'Cashless network crossed 7,000 hospitals', type: 'good' },
      { date: '2026-01-08', label: 'Senior-citizen co-pay introduced on new policies', type: 'bad' },
      { date: '2025-09-01', label: 'Modern treatments (robotic surgery) added to cover', type: 'good' },
    ],
  },
  'ins-3': {
    decision: { call: 'YES', line: 'Best claim record in the market. Pay the small premium difference and stop worrying.' },
    nobodyTells: [
      'The monthly-income payout option protects families who have never handled a ₹1 crore lump sum — often the smarter choice.',
      'Limited offline branches means everything runs online. If your nominee is not comfortable with that, brief them now.',
      'Claim ratio is measured on count, not value. It is still the best signal available, but it is not a guarantee.',
    ],
    history: [
      { date: '2026-04-01', label: 'Claim settlement ratio at 99.5% — highest in class', type: 'good' },
      { date: '2025-12-01', label: 'Payout options expanded (lump sum + monthly income)', type: 'good' },
      { date: '2025-07-22', label: 'Base premium increased ~4% for new buyers', type: 'bad' },
    ],
  },
  'ins-4': {
    decision: { call: 'MAYBE', line: 'Buy it for access, not value — it is one of the few plans that will take your parents at 65+ without a medical test.' },
    nobodyTells: [
      'The 30% co-pay is on every claim, forever. A ₹5L hospitalisation still costs you ₹1.5L out of pocket.',
      '"No medical test" does not mean "no scrutiny" — undisclosed conditions are still checked hard at claim time.',
      'Premiums rise steeply each renewal at this age band. Budget for the policy getting more expensive every year.',
    ],
    history: [
      { date: '2026-06-01', label: 'Entry age extended to 75', type: 'good' },
      { date: '2026-02-14', label: 'Premium revised upward ~9% across age bands', type: 'bad' },
      { date: '2025-10-05', label: 'Pre-existing waiting period cut to 12 months', type: 'good' },
    ],
  },
  'ins-5': {
    decision: { call: 'MAYBE', line: 'Great price for a first health policy — but only if you fix the room-rent cap on the base variant.' },
    nobodyTells: [
      'A room-rent cap can cut your entire claim proportionally, not just the room charge. It is the single nastiest clause in health insurance.',
      'Unlimited reinstatement only refills the base cover, and usually for a different illness — read that clause before relying on it.',
      'Wellness reward points are marketing. Judge the policy on cover and network, not on step-count discounts.',
    ],
    history: [
      { date: '2026-05-02', label: 'Unlimited base reinstatement added', type: 'good' },
      { date: '2025-12-20', label: 'Room-rent cap tightened on the base variant', type: 'bad' },
      { date: '2025-08-11', label: 'Network hospitals expanded in tier-2 cities', type: 'neutral' },
    ],
  },
  'ins-6': {
    decision: { call: 'YES', line: 'Motor insurance is mandatory anyway — pick the one that settles claims without a surveyor queue.' },
    nobodyTells: [
      'A lower IDV shaves a few hundred off your premium and thousands off your payout if the car is written off. Do not shrink it.',
      'Without zero-depreciation, plastic and rubber parts are settled at ~50% value — that is most of a modern bumper repair.',
      'Self-inspection via smartphone is genuinely faster, but you must film it exactly as instructed or the claim gets queried.',
    ],
    history: [
      { date: '2026-03-18', label: 'Cashless garage network grew to 5,900+', type: 'good' },
      { date: '2025-11-02', label: 'Zero-dep add-on price raised for cars over 3 years', type: 'bad' },
      { date: '2025-05-30', label: 'Self-inspection claim flow launched', type: 'good' },
    ],
  },
  'ins-7': {
    decision: { call: 'YES', line: 'The highest-leverage ₹450 you will ever spend before a foreign trip.' },
    nobodyTells: [
      'A single night in a US hospital can cost more than your entire trip. That is what the $500k figure is really for.',
      'Buy it before you leave — cover cannot start on a trip already underway, no matter what the website lets you click.',
      'Skiing, diving and trekking are excluded on the base plan. If your trip has any of that, you need the add-on.',
    ],
    history: [
      { date: '2026-06-12', label: 'COVID-related medical cover made permanent', type: 'good' },
      { date: '2026-01-25', label: 'Baggage-delay payout threshold raised to 6 hours', type: 'bad' },
      { date: '2025-09-14', label: '24×7 global assistance desk added', type: 'good' },
    ],
  },

  // ───────────── CREDIT CARDS ─────────────
  'cc-1': {
    decision: { call: 'YES', line: 'The best default card in India for ordinary spending — the unlimited 2% is the real hero, not the headline 5%.' },
    nobodyTells: [
      'The 5% is capped at ₹500/month. Past ₹10,000 of bill payments you are back to 2% — so the headline is a ceiling, not a rate.',
      'Rent, fuel, wallet loads and EMIs earn nothing. If those are a big chunk of your spend, your real rate is well under 2%.',
      'The ₹499 fee waives at ₹2L annual spend — that is ₹16,700/month. Below that, subtract the fee from your rewards honestly.',
    ],
    history: [
      { date: '2026-05-10', label: 'Monthly cashback cap on the 5% category tightened', type: 'bad' },
      { date: '2025-12-01', label: 'Lounge access reduced to 4 visits per year', type: 'bad' },
      { date: '2025-06-18', label: '2% unlimited cashback made permanent', type: 'good' },
    ],
    reward: {
      rates: { online: 2, travel: 2, fuel: 0, dining: 2, bills: 5, groceries: 2, entertainment: 2, other: 2 },
      capMonthly: 500, capCategories: ['bills'], fee: 499, waiverSpend: 200000,
    },
  },
  'cc-2': {
    decision: { call: 'MAYBE', line: 'Superb if you transfer points to airlines. If you redeem for vouchers, the ₹2,500 fee stops making sense.' },
    nobodyTells: [
      '4 points per ₹150 is ~2.7% only if each point is worth ₹1 via airline transfer. Redeem for catalogue vouchers and it collapses to ~1%.',
      'Lounge visits are capped per quarter, not per year — the "12/yr" cannot be spent in one holiday.',
      'Point transfers have an annual ceiling. Heavy spenders hit it and lose the very benefit they paid the fee for.',
    ],
    history: [
      { date: '2026-04-22', label: 'Annual cap introduced on point transfers to partners', type: 'bad' },
      { date: '2025-10-30', label: 'Milestone voucher value increased', type: 'good' },
      { date: '2025-07-05', label: 'Rent transactions excluded from rewards', type: 'bad' },
    ],
    reward: {
      rates: { online: 2.7, travel: 2.7, fuel: 0, dining: 2.7, bills: 1, groceries: 2.7, entertainment: 2.7, other: 2.7 },
      capMonthly: null, capCategories: [], fee: 2500, waiverSpend: 400000,
    },
  },
  'cc-3': {
    decision: { call: 'YES', line: 'Lifetime free with no games. There is no scenario where holding this card costs you money.' },
    nobodyTells: [
      'The 5% needs an active Prime membership. Without Prime it quietly drops to 3% — still fine, but not what the ads say.',
      'Outside Amazon it is an ordinary 1% card. Treat it as an Amazon card that happens to work everywhere, not an all-rounder.',
      'No lounge access at all. If you fly even occasionally, this cannot be your only card.',
    ],
    history: [
      { date: '2026-06-01', label: 'Rewards confirmed to never expire', type: 'good' },
      { date: '2025-11-20', label: 'Some utility categories removed from rewards', type: 'bad' },
      { date: '2025-04-09', label: 'Still genuinely lifetime free — no fee introduced', type: 'good' },
    ],
    reward: {
      rates: { online: 5, travel: 1, fuel: 0, dining: 1, bills: 1, groceries: 1, entertainment: 1, other: 1 },
      capMonthly: null, capCategories: [], fee: 0, waiverSpend: 0,
    },
  },
  'cc-4': {
    decision: { call: 'MAYBE', line: 'Unbeatable if you fill up at BPCL specifically. Brand-agnostic about pumps? The whole premise collapses.' },
    nobodyTells: [
      '7.25% is BPCL-only. At any other pump you earn close to nothing — check your daily route before applying.',
      'Fuel rewards are capped monthly. Past roughly ₹5,000 of fuel the effective rate falls off a cliff.',
      'The ₹1,499 fee needs about ₹3,500/month of BPCL fuel just to break even. Below that you are paying to earn.',
    ],
    history: [
      { date: '2026-05-15', label: 'Monthly cap on accelerated fuel points reduced', type: 'bad' },
      { date: '2025-09-25', label: 'Welcome bonus raised to 6,000 points', type: 'good' },
      { date: '2025-03-12', label: 'Fuel surcharge waiver extended', type: 'good' },
    ],
    reward: {
      rates: { online: 1, travel: 1, fuel: 7.25, dining: 2.5, bills: 1, groceries: 2.5, entertainment: 1, other: 1 },
      capMonthly: 400, capCategories: ['fuel'], fee: 1499, waiverSpend: 200000,
    },
  },
  'cc-5': {
    decision: { call: 'YES', line: 'The lowest-friction way into the credit system if your income is modest — and it costs nothing to hold.' },
    nobodyTells: [
      'The "10x" needs a monthly spend threshold most starters never hit. Budget on the base rate, treat 10x as a bonus.',
      'Rewards never expire, but redemption carries a per-request fee that quietly eats small redemptions.',
      'Approves profiles other issuers reject — which is exactly why it is a first card, not a forever card.',
    ],
    history: [
      { date: '2026-02-28', label: 'Reward redemption fee introduced per request', type: 'bad' },
      { date: '2025-08-16', label: 'Lounge access added (4 per year)', type: 'good' },
      { date: '2025-01-30', label: 'Confirmed lifetime free', type: 'good' },
    ],
    reward: {
      rates: { online: 2.5, travel: 1, fuel: 0, dining: 2.5, bills: 1, groceries: 2.5, entertainment: 2.5, other: 1 },
      capMonthly: null, capCategories: [], fee: 0, waiverSpend: 0,
    },
  },
  'cc-6': {
    decision: { call: 'NO', line: 'All-or-nothing milestones. Miss ₹4L of spend and you have paid ₹5,000 for very little — most people miss it.' },
    nobodyTells: [
      'The ₹44k "value" assumes you hit every milestone AND want those exact vouchers. Both assumptions usually fail.',
      'Acceptance still breaks at small merchants and many local businesses. You will need a Visa/Mastercard backup.',
      'Chasing a milestone makes people overspend. Spending ₹4L to earn ₹44k of vouchers you did not need is a loss, not a win.',
    ],
    history: [
      { date: '2026-03-05', label: 'Milestone spend targets raised', type: 'bad' },
      { date: '2025-10-12', label: 'Lounge visits increased to 8 per year', type: 'good' },
      { date: '2025-06-01', label: 'Insurance & utility spends excluded from milestones', type: 'bad' },
    ],
    reward: {
      rates: { online: 2.4, travel: 4, fuel: 0, dining: 3, bills: 0, groceries: 2.4, entertainment: 2.4, other: 2 },
      capMonthly: null, capCategories: [], fee: 5000, waiverSpend: 400000,
    },
  },

  // ───────────── INVESTMENTS ─────────────
  'inv-1': {
    decision: { call: 'YES', line: 'The most boring, most sensible first investment in India. Start here.' },
    nobodyTells: [
      'You are buying 50 large companies — no mid or small caps. This is a core holding, not a complete portfolio.',
      'It falls exactly as hard as the market falls. There is no cushion, and that is the price of the low fee.',
      'Direct plans cost roughly half of regular plans. Buying via a distributor silently doubles your expense ratio for the same fund.',
    ],
    history: [
      { date: '2026-04-10', label: 'Expense ratio cut to 0.20%', type: 'good' },
      { date: '2025-10-01', label: 'Tracking error narrowed vs benchmark', type: 'good' },
      { date: '2025-04-15', label: 'Nifty 50 index constituents rebalanced', type: 'neutral' },
    ],
  },
  'inv-2': {
    decision: { call: 'YES', line: 'If you are saving tax under 80C anyway, this is the only option that also builds real wealth.' },
    nobodyTells: [
      'Every SIP instalment locks for 3 years separately — your January 2026 instalment is free in January 2029, not the whole folio.',
      'Under the new tax regime, 80C does not exist. If you have moved, this fund is just an equity fund — judge it on merit.',
      'Gains above ₹1.25L a year are taxed at 12.5%. The tax break is at entry, not at exit.',
    ],
    history: [
      { date: '2026-03-20', label: 'Consistent top-quartile 5-year performance', type: 'good' },
      { date: '2025-08-01', label: 'Expense ratio raised slightly as AUM grew', type: 'bad' },
      { date: '2025-02-11', label: 'Fund manager tenure crossed 5 years', type: 'good' },
    ],
  },
  'inv-3': {
    decision: { call: 'YES', line: 'One of the very few active funds that has actually earned its fee — if you can sit through the lag.' },
    nobodyTells: [
      'It holds cash when it finds nothing worth buying. That protects you in crashes and makes you feel stupid in bull runs.',
      'Overseas holdings can be frozen by RBI limits — the global exposure you bought may pause without warning.',
      'If lagging the index for two years would make you panic-sell, buy an index fund instead. The strategy only works if you stay.',
    ],
    history: [
      { date: '2026-05-05', label: 'Reopened international investing within RBI limits', type: 'good' },
      { date: '2025-09-18', label: 'Cash allocation raised on valuation concerns', type: 'neutral' },
      { date: '2025-03-02', label: 'Expense ratio reduced to 0.63%', type: 'good' },
    ],
  },
  'inv-4': {
    decision: { call: 'MAYBE', line: 'Right home for 1–3 year money you cannot afford to lose. Wrong place for wealth creation.' },
    nobodyTells: [
      'It is not capital-guaranteed. The NAV can and does fall when interest rates rise — "debt" is not "safe".',
      'Since 2023, gains are taxed at your income slab with no indexation. The old FD-beating maths has narrowed a lot.',
      'Credit risk is real: one bond issuer defaulting can dent the NAV overnight. Check the portfolio quality, not just returns.',
    ],
    history: [
      { date: '2026-04-01', label: 'Portfolio credit quality improved (higher AAA share)', type: 'good' },
      { date: '2025-07-01', label: 'Debt fund taxation changed — slab rate, no indexation', type: 'bad' },
      { date: '2025-01-20', label: 'Average maturity shortened to reduce rate risk', type: 'neutral' },
    ],
  },
  'inv-5': {
    decision: { call: 'MAYBE', line: 'The extra ₹50k deduction is real money — but the lock-in to 60 and forced annuity are serious constraints.' },
    nobodyTells: [
      '40% of your corpus must buy an annuity at exit, and that annuity income is taxed as salary. Your "tax-free" retirement is not.',
      'Locked until 60 means locked — partial withdrawal needs a specific approved reason, not just needing the money.',
      'Auto Choice shifts you to debt as you age. Sensible by default, but you cannot outrun inflation on autopilot alone.',
    ],
    history: [
      { date: '2026-06-15', label: 'Equity allocation cap raised for Auto Choice', type: 'good' },
      { date: '2025-11-10', label: 'Annuity purchase rules clarified — still mandatory', type: 'neutral' },
      { date: '2025-05-08', label: 'Fund management charges remain among the lowest', type: 'good' },
    ],
  },
  'inv-6': {
    decision: { call: 'NO', line: 'The 3% GST plus a 2–6% spread means gold must climb several percent before you even break even.' },
    nobodyTells: [
      'You pay 3% GST on every purchase — that is a guaranteed loss the moment you buy.',
      'The buy price and sell price are not the same. That spread is the platform\'s margin, and it comes out of your return.',
      'Free storage is time-limited. After the free window you either pay, take delivery (more charges), or sell.',
    ],
    history: [
      { date: '2026-05-28', label: 'Free storage window shortened', type: 'bad' },
      { date: '2025-12-15', label: 'Buy-sell spread widened during volatility', type: 'bad' },
      { date: '2025-06-20', label: 'Minimum purchase lowered to ₹10', type: 'good' },
    ],
  },
  // ───────────── LOANS ─────────────
  'loan-1': {
    decision: { call: 'YES', line: 'The cheapest money you will ever legitimately borrow — and no penalty for killing it early.' },
    nobodyTells: [
      'On a 20-year loan at 8.5%, you repay roughly double the amount borrowed. One extra EMI a year can cut ~4 years off that.',
      'Floating means floating. When the repo rises, banks usually extend your tenure instead of raising the EMI — you pay for years longer and barely notice.',
      'The 8.50% headline needs a 750+ score. Check your score before applying, because each rejected application dents it further.',
    ],
    history: [
      { date: '2026-06-05', label: 'Home loan rate cut to 8.50% after repo revision', type: 'good' },
      { date: '2026-01-12', label: 'Processing fee revised to 0.35% of loan amount', type: 'bad' },
      { date: '2025-08-20', label: 'Digital application flow launched', type: 'good' },
    ],
  },
  'loan-2': {
    decision: { call: 'MAYBE', line: 'Fast and unsecured — fine for a genuine emergency, expensive for anything you could have saved for.' },
    nobodyTells: [
      'The advertised 10.85% goes to almost nobody. Most approved applicants land at 13–16% — ask for your actual rate before signing.',
      'The processing fee is deducted from the disbursal, so you receive less than you borrowed but pay interest on the full amount.',
      'Prepayment costs up to 4%. A "flexible" loan that punishes you for repaying early is not flexible.',
    ],
    history: [
      { date: '2026-05-18', label: 'Pre-approved offers extended to more customers', type: 'good' },
      { date: '2026-02-02', label: 'Processing fee raised to up to 2.5%', type: 'bad' },
      { date: '2025-09-09', label: 'Same-day disbursal introduced for salaried applicants', type: 'good' },
    ],
  },
  'loan-3': {
    decision: { call: 'MAYBE', line: 'Far better than a personal loan for a car — but keep the tenure at 5 years, not 7.' },
    nobodyTells: [
      'A car loses ~15% of value the year you buy it. Stretch to 7 years and you will owe more than the car is worth for most of the loan.',
      'Dealers earn commission on bundled insurance. You are allowed to buy the policy elsewhere — and it is usually cheaper.',
      'The RC stays hypothecated to the bank until closure. Selling before that needs an NOC and a wait.',
    ],
    history: [
      { date: '2026-04-14', label: 'Rate reduced to 9.10% for 750+ scores', type: 'good' },
      { date: '2025-12-08', label: 'Foreclosure charges reintroduced in first 12 months', type: 'bad' },
      { date: '2025-06-25', label: 'Tenure extended to 7 years', type: 'neutral' },
    ],
  },
  'loan-4': {
    decision: { call: 'MAYBE', line: 'The moratorium is genuinely valuable — but check public-sector banks first, they are often 2–3% cheaper.' },
    nobodyTells: [
      'Interest accrues during the moratorium. A 4-year course can add lakhs to the balance before your first EMI is even due.',
      'Paying just the simple interest during the course, if you can, avoids that compounding entirely. Nobody offers this — you have to ask.',
      '80E has no upper limit on interest deduction, but it only runs for 8 years. Plan your repayment inside that window.',
    ],
    history: [
      { date: '2026-06-20', label: 'Moratorium extended to course + 1 year', type: 'good' },
      { date: '2026-03-01', label: 'Collateral threshold lowered to ₹40L', type: 'bad' },
      { date: '2025-10-18', label: 'Living-cost and travel coverage added', type: 'good' },
    ],
  },
  'loan-5': {
    decision: { call: 'YES', line: 'If you own gold, this beats a personal loan on rate, speed and paperwork — just do not roll it over.' },
    nobodyTells: [
      'No credit check sounds friendly. It exists because your gold is the credit check — default and it is auctioned, family heirloom or not.',
      'Higher loan-to-value schemes carry sharply higher rates. The cheapest rate usually means borrowing only ~65% of your gold\'s value.',
      'Tenures are short (often 12 months). Rolling it over repeatedly is how a cheap loan quietly turns expensive.',
    ],
    history: [
      { date: '2026-05-30', label: 'Rate reduced to 9.90% on low-LTV schemes', type: 'good' },
      { date: '2026-01-15', label: 'LTV cap tightened per RBI norms', type: 'neutral' },
      { date: '2025-07-11', label: 'Under-1-hour disbursal rolled out across branches', type: 'good' },
    ],
  },
};

export const getXray = (id) => XRAY[id] || null;
