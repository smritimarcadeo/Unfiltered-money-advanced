// ────────────────────────────────────────────────────────────────
//  The shared engine. Every surface — X-Ray, Spending Simulator,
//  compare, reward calculator — computes from THIS file, so the
//  numbers can never disagree with each other across the site.
// ────────────────────────────────────────────────────────────────

import { PRODUCTS } from '@/data/products';
import { getXray, SPEND_CATEGORIES } from '@/data/xray';

// ── Slugs ──────────────────────────────────────────────────────
export const slugify = (s) =>
  s.toLowerCase()
    .replace(/[’'()]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getSlug = (product) => slugify(product.name);

export const getBySlug = (category, slug) =>
  PRODUCTS.find((p) => p.category === category && getSlug(p) === slug);

// Slugs are unique across the whole catalogue, so /go/[slug] can look
// a product up without knowing its category.
export const getBySlugAny = (slug) => PRODUCTS.find((p) => getSlug(p) === slug);

// ── Unfiltered Score ───────────────────────────────────────────
// Derived from the published sub-scores, NOT authored by hand —
// so /methodology fully explains where the number comes from.
export function unfilteredScore(product) {
  if (!product.scores?.length) return null;
  const avg = product.scores.reduce((s, x) => s + x.value, 0) / product.scores.length;
  return Math.round(avg * 10);
}

export function scoreBand(score) {
  if (score >= 88) return { label: 'Outstanding', tone: 'good' };
  if (score >= 78) return { label: 'Strong', tone: 'good' };
  if (score >= 68) return { label: 'Decent', tone: 'warn' };
  return { label: 'Weak', tone: 'bad' };
}

// ── Spend model ────────────────────────────────────────────────
export const defaultSpend = () =>
  Object.fromEntries(SPEND_CATEGORIES.map((c) => [c.id, c.def]));

export const totalMonthlySpend = (spend) =>
  Object.values(spend).reduce((a, b) => a + (Number(b) || 0), 0);

// ── Real yearly value for a card, given a monthly spend map ────
// Returns gross rewards, the fee actually charged (waivers applied),
// net value, and the annual spend needed to break even on the fee.
export function yearlyValue(product, spend) {
  const r = getXray(product.id)?.reward;
  if (!r) return null;

  let monthlyGross = 0;
  const perCategory = [];

  for (const cat of SPEND_CATEGORIES) {
    const amount = Number(spend[cat.id]) || 0;
    const rate = r.rates[cat.id] ?? 0;
    let earned = (amount * rate) / 100;

    // Category-specific monthly cap (e.g. Axis ACE's ₹500 on bills).
    if (r.capMonthly && r.capCategories?.includes(cat.id)) {
      earned = Math.min(earned, r.capMonthly);
    }
    monthlyGross += earned;
    perCategory.push({ ...cat, amount, rate, earned });
  }

  const annualSpend = totalMonthlySpend(spend) * 12;
  const gross = monthlyGross * 12;
  const feeWaived = r.waiverSpend > 0 && annualSpend >= r.waiverSpend;
  const fee = feeWaived ? 0 : r.fee;
  const net = gross - fee;

  // Effective rate on everything you spend.
  const effectiveRate = annualSpend > 0 ? (net / annualSpend) * 100 : 0;

  // Break-even: annual spend at which rewards cover the fee, at this mix.
  const grossRatePct = annualSpend > 0 ? (gross / annualSpend) * 100 : 0;
  const breakEven = r.fee > 0 && grossRatePct > 0 ? Math.round((r.fee / grossRatePct) * 100) : 0;

  return { gross, fee, net, feeWaived, annualSpend, effectiveRate, breakEven, perCategory, rawFee: r.fee, waiverSpend: r.waiverSpend };
}

// Rank every card in a category by real net value for this spend.
export function rankBySpend(category, spend) {
  return PRODUCTS.filter((p) => p.category === category)
    .map((p) => ({ product: p, value: yearlyValue(p, spend) }))
    .filter((x) => x.value)
    .sort((a, b) => b.value.net - a.value.net);
}

// ── Approval odds (rule-based — no credit bureau involved) ─────
// Deliberately conservative: this is an indication, never an approval.
export function approvalOdds(product, profile) {
  const rules = product.check;
  if (!rules || !profile || (profile.age == null && profile.incomeLakh == null)) {
    return { level: 'unknown', pct: null, reasons: [] };
  }

  const blockers = [];
  const positives = [];

  if (profile.age != null) {
    if (rules.minAge != null && profile.age < rules.minAge) blockers.push(`You must be at least ${rules.minAge}`);
    else if (rules.maxAge != null && profile.age > rules.maxAge) blockers.push(`Entry age closes at ${rules.maxAge}`);
    else positives.push('Your age is inside the accepted band');
  }

  if (rules.minIncomeLakh) {
    if (profile.incomeLakh == null) {
      // no income given — can't judge this rule
    } else if (profile.incomeLakh < rules.minIncomeLakh) {
      blockers.push(`Stated income requirement is ₹${rules.minIncomeLakh}L+`);
    } else if (profile.incomeLakh >= rules.minIncomeLakh * 1.5) {
      positives.push('Your income is comfortably above the requirement');
    } else {
      positives.push('You meet the income requirement');
    }
  } else if (profile.incomeLakh != null) {
    positives.push('No minimum income requirement');
  }

  if (blockers.length) {
    return { level: 'low', pct: 10, reasons: blockers, positives: [] };
  }

  // Comfortably clear = higher odds; just scraping through = medium.
  const comfortable = positives.some((p) => p.includes('comfortably'));
  return comfortable
    ? { level: 'high', pct: 85, reasons: [], positives }
    : { level: 'medium', pct: 60, reasons: [], positives };
}

export const ODDS_META = {
  high: { label: 'Strong chance', tone: 'good' },
  medium: { label: 'Fair chance', tone: 'warn' },
  low: { label: 'Unlikely', tone: 'bad' },
  unknown: { label: 'Tell us about you', tone: 'neutral' },
};

export { SPEND_CATEGORIES };
