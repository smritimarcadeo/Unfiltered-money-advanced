// ────────────────────────────────────────────────────────────────
//  Eligibility checker — compares a user profile against a
//  product's hard rules. Deliberately conservative: we say
//  "likely eligible", never "approved".
// ────────────────────────────────────────────────────────────────

export const hasProfile = (profile) =>
  !!profile && (profile.age != null || profile.incomeLakh != null);

export function checkEligibility(product, profile) {
  const rules = product.check;
  if (!rules || !hasProfile(profile)) return { status: 'unknown', reasons: [] };

  const reasons = [];

  if (profile.age != null) {
    if (rules.minAge != null && profile.age < rules.minAge)
      reasons.push(`Minimum age is ${rules.minAge}`);
    if (rules.maxAge != null && profile.age > rules.maxAge)
      reasons.push(`Maximum entry age is ${rules.maxAge}`);
  }

  if (profile.incomeLakh != null && rules.minIncomeLakh) {
    if (profile.incomeLakh < rules.minIncomeLakh)
      reasons.push(`Needs income of ₹${rules.minIncomeLakh}L+ per year`);
  }

  return reasons.length
    ? { status: 'not-eligible', reasons }
    : { status: 'eligible', reasons: [] };
}

export const ELIGIBILITY_LABEL = {
  eligible: 'Likely eligible',
  'not-eligible': 'Not eligible',
  unknown: '',
};
