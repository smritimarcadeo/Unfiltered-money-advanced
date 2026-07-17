// ────────────────────────────────────────────────────────────────
//  Offers — time-boxed deals tied to a product.
//  `expires` drives the Offer Watch countdowns. `worth` is our
//  honest estimate of realisable value, and `catch` is the string
//  the marketing never shows you.
// ────────────────────────────────────────────────────────────────

export const OFFERS = [
  {
    id: 'off-1', productId: 'cc-1', title: '₹1,500 cashback on first spend',
    detail: 'Spend ₹10,000 within 30 days of card setup and get ₹1,500 back.',
    worth: 1500, expires: '2026-08-14',
    catch: 'The ₹10,000 must be in eligible categories — rent, fuel and wallet loads do not count.',
    kind: 'Welcome bonus',
  },
  {
    id: 'off-2', productId: 'cc-3', title: 'Amazon Prime worth ₹1,499 free',
    detail: 'Complimentary annual Prime membership on card approval.',
    worth: 1499, expires: '2026-09-30',
    catch: 'Only for first-time Prime members. Existing subscribers get nothing.',
    kind: 'Welcome bonus',
  },
  {
    id: 'off-3', productId: 'cc-2', title: '10,000 bonus reward points',
    detail: 'Spend ₹1L in the first 90 days and collect 10,000 points.',
    worth: 10000, expires: '2026-07-28',
    catch: '₹1L in 90 days is ₹33k/month. Points are worth ₹1 each only via airline transfer — otherwise ~₹0.30.',
    kind: 'Milestone',
  },
  {
    id: 'off-4', productId: 'cc-4', title: '6,000 welcome fuel points',
    detail: 'Credited on payment of the joining fee.',
    worth: 1500, expires: '2026-07-22',
    catch: 'You pay the ₹1,499 joining fee to receive roughly ₹1,500 of points. That is a wash, not a gift.',
    kind: 'Welcome bonus',
  },
  {
    id: 'off-5', productId: 'ins-2', title: '15% off first-year premium',
    detail: 'Discount on the first year of a new family floater policy.',
    worth: 1275, expires: '2026-08-05',
    catch: 'First year only — the premium reverts at renewal, and health premiums rise with age anyway.',
    kind: 'Discount',
  },
  {
    id: 'off-6', productId: 'ins-1', title: 'Free medical test at home',
    detail: 'Home sample collection for cover above ₹50L, at no cost.',
    worth: 2000, expires: '2026-10-15',
    catch: 'Standard practice at most insurers — this is convenience, not a saving.',
    kind: 'Perk',
  },
  {
    id: 'off-7', productId: 'loan-2', title: 'Zero processing fee',
    detail: 'Processing fee waived on personal loans sanctioned this month.',
    worth: 5000, expires: '2026-07-31',
    catch: 'Saves ~₹5,000 upfront on a ₹2L loan — but the interest rate is where the real cost is. Do not let a fee waiver sell you a 16% loan.',
    kind: 'Fee waiver',
  },
  {
    id: 'off-8', productId: 'loan-1', title: '0.10% rate concession',
    detail: 'Rate concession for applicants with a 800+ credit score.',
    worth: 42000, expires: '2026-09-01',
    catch: 'Needs an 800+ score. On a ₹50L / 20-year loan the saving is real (~₹42k), but only a small minority qualify.',
    kind: 'Rate cut',
  },
  {
    id: 'off-9', productId: 'inv-2', title: 'Zero commission direct plan',
    detail: 'Invest in the direct plan and skip distributor commission entirely.',
    worth: 0, expires: '2026-12-31',
    catch: 'Not an offer at all — direct plans always exist. Any platform "giving" you this is selling you the default.',
    kind: 'Perk',
  },
  {
    id: 'off-10', productId: 'loan-5', title: 'Rate from 9.90% on low-LTV',
    detail: 'Lowest slab rate for loans up to 65% of gold value.',
    worth: 0, expires: '2026-08-20',
    catch: 'Borrowing more against the same gold pushes you into a much higher rate slab.',
    kind: 'Rate cut',
  },
];

export const getOffersFor = (productId) => OFFERS.filter((o) => o.productId === productId);
