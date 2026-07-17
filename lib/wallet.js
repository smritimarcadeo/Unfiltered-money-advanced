// ────────────────────────────────────────────────────────────────
//  Wallet Optimizer logic.
//  Given the cards someone holds + their spend, decide Keep /
//  Replace / Remove for each — and quantify the ₹ impact.
//  Uses the same yearlyValue engine as everything else.
// ────────────────────────────────────────────────────────────────

import { getByCategory } from '@/data/products';
import { yearlyValue, rankBySpend } from '@/lib/engine';

// Below this, switching cards isn't worth the paperwork.
const SWITCH_THRESHOLD = 1500;

export const VERDICT = {
  keep: { label: 'Keep', tone: 'good', note: 'Earning its place in your wallet' },
  replace: { label: 'Replace', tone: 'warn', note: 'Another card pays you meaningfully more' },
  remove: { label: 'Remove', tone: 'bad', note: 'Costing you more than it returns' },
};

export function optimiseWallet(heldIds, spend) {
  const all = getByCategory('credit-cards');
  const held = all.filter((p) => heldIds.includes(p.id));
  const ranked = rankBySpend('credit-cards', spend);
  const best = ranked[0];

  const rows = held.map((p) => ({
    product: p,
    value: yearlyValue(p, spend),
    verdict: null,
    reason: '',
    upgrade: null,
    delta: 0,
  }));

  // 1. Anything that costs more than it earns goes, regardless of alternatives.
  for (const r of rows) {
    if (r.value.net < 0) {
      r.verdict = 'remove';
      r.reason = `The ₹${r.value.fee.toLocaleString('en-IN')} fee costs more than the ₹${Math.round(r.value.gross).toLocaleString('en-IN')} it earns at your spend.`;
    }
  }

  // 2. Assign replacements greedily, biggest gain first, and let each
  //    candidate card be claimed only ONCE — otherwise we'd tell someone
  //    to replace three cards with the same single card.
  const candidates = ranked.filter((c) => !heldIds.includes(c.product.id));
  const claimed = new Set();

  for (;;) {
    let pick = null;
    for (const row of rows) {
      if (row.verdict) continue; // already removed or replaced
      for (const c of candidates) {
        if (claimed.has(c.product.id)) continue;
        const delta = c.value.net - row.value.net;
        if (delta > SWITCH_THRESHOLD && (!pick || delta > pick.delta)) {
          pick = { row, cand: c, delta };
        }
      }
    }
    if (!pick) break;
    pick.row.verdict = 'replace';
    pick.row.upgrade = pick.cand.product;
    pick.row.delta = pick.delta;
    pick.row.reason = `${pick.cand.product.name} would pay you ₹${Math.round(pick.delta).toLocaleString('en-IN')} more a year at this spend.`;
    claimed.add(pick.cand.product.id);
  }

  // 3. Everything left is worth keeping.
  for (const r of rows) {
    if (r.verdict) continue;
    r.verdict = 'keep';
    r.reason = best && best.product.id === r.product.id
      ? 'This is the single best card for your spend right now.'
      : 'Returns solid value at your spend — nothing clearly better is still available to swap into.';
  }

  rows.sort((a, b) => b.value.net - a.value.net);

  const currentNet = rows.reduce((s, r) => s + r.value.net, 0);
  const bestNet = best ? best.value.net : 0;

  // The best card you don't hold, versus your strongest current card.
  const missing = candidates.find((c) => !claimed.has(c.product.id)) || candidates[0];
  const topHeldNet = rows.length ? Math.max(...rows.map((r) => r.value.net)) : 0;
  const missedGain = missing ? missing.value.net - topHeldNet : 0;

  return { rows, currentNet, best, bestNet, missing, missedGain };
}
