// ────────────────────────────────────────────────────────────────
//  Preference matching engine (pure function, no dependencies).
//  Given products + a finder config + the user's answers, returns
//  products sorted by match, each annotated with matchPct + reasons.
// ────────────────────────────────────────────────────────────────

export function recommend(products, questions, answers) {
  // Collect the option objects the user selected.
  const selected = [];
  const filterTags = new Set();

  for (const q of questions) {
    const ans = answers[q.id];
    if (ans == null) continue;
    const ids = Array.isArray(ans) ? ans : [ans];
    for (const opt of q.options) {
      if (!ids.includes(opt.id)) continue;
      selected.push(opt);
      if (q.filter) (opt.tags || []).forEach((t) => filterTags.add(t));
    }
  }

  const totalWeight = selected.reduce((s, o) => s + (o.weight || 1), 0) || 1;

  const scored = products.map((p) => {
    const productTags = new Set(p.tags || []);
    let score = 0;
    const reasons = [];

    for (const opt of selected) {
      const hit = (opt.tags || []).some((t) => productTags.has(t));
      if (hit) {
        score += opt.weight || 1;
        if (opt.reason) reasons.push(opt.reason);
      }
    }

    // A small nudge from the product's own rating breaks ties nicely.
    const ratingBoost = ((p.attrs?.rating || p.rating || 0) - 4) * 0.4;
    const matchPct = Math.max(
      8,
      Math.min(99, Math.round((score / totalWeight) * 100 + ratingBoost))
    );

    // Does the product satisfy the hard-filter (goal) question?
    const passesFilter =
      filterTags.size === 0 ||
      [...filterTags].some((t) => productTags.has(t));

    return { ...p, matchScore: score, matchPct, reasons: reasons.slice(0, 4), passesFilter };
  });

  const eligible = scored.filter((p) => p.passesFilter);
  const pool = eligible.length ? eligible : scored;

  pool.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return (b.attrs?.rating || 0) - (a.attrs?.rating || 0);
  });

  return pool;
}

export function isFinderComplete(questions, answers) {
  return questions.every((q) => {
    const a = answers[q.id];
    if (Array.isArray(a)) return a.length > 0;
    return a != null;
  });
}
