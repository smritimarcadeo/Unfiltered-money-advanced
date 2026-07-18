# How It Works — the working of every part of the site

> A complete technical reference for UnfilteredMoney. Every feature, its exact
> mechanism (data in → logic → output), the files involved, and the formulas.
>
> Companion docs: **README.md** (overview), **GOING-LIVE.md** (demo → production, data sourcing, CMS, SEO, reviews & scoring at scale).

---

## 0. The one idea that runs everything

**One dataset, many views.** Every product is a plain object in `data/products.js`.
Every feature — Finder, X-Ray, Compare, Simulator, Wallet Optimizer, Eligibility —
reads that same object and computes its own view from it through a **shared engine**
(`lib/engine.js`). Because they all compute from one source, no two screens can ever
disagree about a number.

```
data/*.js  ──►  lib/ engines (pure functions)  ──►  components render the result
(facts)         (score, value, odds, match…)        (X-Ray, Compare, Finder…)
```

Nothing is fetched at runtime; everything is static (SSG) and computed at build time
or in the browser. No backend in this build.

---

## 1. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Styling | Tailwind CSS 3 + a small design system in `app/globals.css` |
| Animation | framer-motion |
| Icons | lucide-react |
| State | React Context in `lib/store.jsx` + `localStorage` |
| Data | Plain JS objects in `data/` — no DB |
| Rendering | Static (SSG) + client components for interactivity |

Run: `npm install` → `npm run dev` (auto-picks a free port) → `npm run build && npm start`.

---

## 2. The data layer — the single source of truth

### `data/products.js`
An array `PRODUCTS`. Each product carries **facts**, **scoring inputs**, and **editorial fields**:

```
id, category, subtype, name, provider, logo, tagline
rating              ← star (editorial; see §16 for the honest note)
scores[]            ← 4 sub-scores /10  → drive the Unfiltered Score
verdict             ← "Our take" (editorial prose)
pros[], cons[], exclusions[]   ← "What's good / not / The Catch"
eligibility[]       ← human-readable requirements
check{minAge,maxAge,minIncomeLakh}   ← machine rules for the eligibility engine
highlights[{label,value}]            ← the 3 stat tiles
badges[], bestFor
tags[]              ← power the Finder matching
attrs{price, rating, claimRatio, coverLakh, rewardPct, cagr, ...}  ← the raw numbers
applyUrl, lastUpdated, source         ← provenance
```

Helper exports: `getByCategory`, `getById`, `getFeatured`, `getCategory`, `getSimilar`
(tag-overlap within a category).

### `data/xray.js`
Keyed by product id — the "truth report" layer:
`decision{call:YES|MAYBE|NO, line}`, `nobodyTells[]`, `history[{date,label,type}]`,
and for cards `reward{rates{per-category %}, capMonthly, capCategories[], fee, waiverSpend}`.
Also exports `SPEND_CATEGORIES` (the 8 monthly-spend buckets).

### Other data files
- `data/finder.js` — quiz questions per category (options carry `tags`, `weight`, `reason`; a question with `filter:true` is a hard filter).
- `data/offers.js` — time-boxed offers with `expires`, `worth`, `catch`.
- `data/blog.js` — posts (`body[]`, `author`, `tags`) + `catStyle`/`blogTint` helpers.
- `data/glossary.js` — jargon terms.
- `data/site.js` — nav, stats, trust, testimonials, FAQ, disclosure.

---

## 3. The shared engine — `lib/engine.js`

Pure functions every feature calls. **This is the heart.**

### Slugs
- `getSlug(product)` → URL slug from the name (`hdfc-life-click-2-protect-super`).
- `getBySlug(category, slug)` / `getBySlugAny(slug)` → reverse lookup for the `[slug]` pages.

### Unfiltered Score
```
unfilteredScore(product) = round( average(scores[].value) × 10 )   // 0–100
scoreBand(score): ≥88 Outstanding · ≥78 Strong · ≥68 Decent · else Weak
```
So 4 sub-scores averaging 9.1 → **91/100 → "Outstanding"**. (The X-Ray ring shows this.)

### Real yearly value for a card — `yearlyValue(product, spend)`
The engine behind the reward calculator, Spending Simulator, Compare and Wallet Optimizer:
```
for each spend category:
    earned = amount × rate%          (rate from xray.reward.rates)
    if category is capped: earned = min(earned, capMonthly)
monthlyGross = Σ earned
annualSpend  = (Σ monthly spend) × 12
gross        = monthlyGross × 12
fee          = (annualSpend ≥ waiverSpend) ? 0 : reward.fee     // waiver applied
net          = gross − fee
effectiveRate = net / annualSpend × 100
breakEven    = fee / grossRatePct × 100      // annual spend where rewards cover the fee
```
Returns `{gross, fee, net, feeWaived, effectiveRate, breakEven, perCategory[]}`.

### `rankBySpend(category, spend)`
Runs `yearlyValue` on every card and sorts by `net` — powers the Simulator leaderboard.

### Approval odds — `approvalOdds(product, profile)`
Rule-based, **no credit bureau**:
```
if age < minAge or age > maxAge         → blocker
if income < minIncomeLakh               → blocker
any blocker                             → { low, 10% }
income ≥ 1.5 × required (comfortable)   → { high, 85% }
otherwise (just clears)                 → { medium, 60% }
no profile set                          → { unknown }
```

---

## 4. Preference Finder — `components/finder/Finder.jsx` + `lib/recommend.js`

**Working:** a multi-step quiz that scores every product by tag overlap.

1. Each answer option lists `tags` and a `weight`. The user's picks become a set of
   selected options.
2. The **goal question** (`filter:true`) is a **hard filter** — its tags must be present,
   e.g. pick "health cover" and only health products survive.
3. For each surviving product:
   ```
   score = Σ weight  (for every selected option that shares ≥1 tag with the product)
   matchPct = clamp( score / totalWeight × 100 + ratingBoost , 8 , 99 )
   reasons  = the `reason` strings of the matched options
   ```
4. Sort by score, then rating. Show **Top 3** + the rest, each card showing its
   `matchPct` and the reasons that earned it.
5. **Shareable results:** answers are encoded into the URL (`?goal=health&who=...`).
   Loading that URL restores the result (`useSearchParams`), so it's bookmarkable.
   "Save as PDF" uses print styles.

Because it uses `useSearchParams`, finder pages are client-rendered (SSR ships a skeleton).

---

## 5. Money X-Ray — the product page

**Route:** `/[category]/[slug]` (e.g. `/insurance/hdfc-life-click-2-protect-super`).
**Files:** `app/*/[slug]/page.jsx` → `lib/product-page.jsx` (shared builder) → `components/xray/MoneyXray.jsx`.

**Working — how the page assembles (all from one product object):**
- **Header:** logo, name, provider, tagline; the **decision** chip (YES/MAYBE/NO from `xray.decision`); a **ScoreRing** showing `unfilteredScore` + `scoreBand`.
- **Our take** ← `verdict`.
- **How we scored it** ← animated bars from `scores[]`, links to `/methodology`.
- **Reward calculator** (cards) ← `RewardCalculator` using `yearlyValue` live.
- **Approval odds** ← `approvalOdds(product, profile)`; if no profile, prompts to set one.
- **What's good / What's not** ← `pros` / `cons`.
- **The Catch** ← `exclusions`.
- **Things nobody tells you** ← `xray.nobodyTells`.
- **Fine-print timeline** ← `xray.history` (color-coded good/bad/neutral).
- **Eligibility** ← `eligibility`.
- **Honest alternatives** ← `getSimilar` (tag overlap).
- **Provenance** ← `lastUpdated` + `source`.
- **Sticky CTA** ← Save / Compare / "View plan" → routes through `/go/[slug]`.

**SSG + SEO:** `generateStaticParams` prebuilds every product page. `generateMetadata`
sets title/description/canonical. Each page injects **JSON-LD** (`Product`, `Review`,
`BreadcrumbList`, `FAQPage`). *(Note on AggregateRating: see §16.)*

---

## 6. Spending Simulator — `/tools/spending-simulator`

8 category sliders → `rankBySpend('credit-cards', spend)` recomputes on every change →
the leaderboard **re-orders live** with each card's real net yearly value. Same engine as
the X-Ray, so the numbers match everywhere.

---

## 7. Compare workspace — `/compare` + `components/compare/CompareWorkspace.jsx`

- Up to **`MAX_COMPARE` (4)** products (the single source of truth is `lib/store.jsx`;
  every surface reads it — no local copies).
- Table rows are built dynamically from the selected products' `highlights` + core attrs,
  so it works for any category. Best value per row is highlighted.
- **Winner** = highest net value if all picks are cards (live), else highest Unfiltered Score.
- If every pick is a card, a **live spend simulator** appears and can flip the winner.
- The floating `CompareBar` (sitewide) collects picks and links here; it hides itself on `/compare`.

---

## 8. Eligibility — two surfaces, one engine (`lib/eligibility.js` + engine `approvalOdds`)

- **Inline checker** (`components/product/EligibilityChecker.jsx`) on category pages: enter
  age + income once → each card gets a **"Likely eligible" / "Not eligible — needs ₹6L+"**
  chip, plus an "Eligible only (n)" filter. The profile is saved to the store (`localStorage`).
- **Eligibility Wizard** (`/eligibility`): a 3-step quiz (category → age band → income band)
  → runs `approvalOdds` on every product in that category → shows a % + reasons, ranked.
  It also **persists the profile**, so every product page then shows your odds.

Nothing is transmitted — it's all local, and it's always "indicative, not an approval".

---

## 9. Wallet Optimizer — `/tools/wallet-optimizer` + `lib/wallet.js`

**Working:** pick the cards you hold + set your spend → a **Keep / Replace / Remove** verdict on each.
```
for each held card:  v = yearlyValue(card, spend)
  if v.net < 0                         → REMOVE  (fee costs more than it earns)
  else assign upgrades greedily:
     find an unheld card whose net beats this one by > ₹1,500
     biggest gain first; each candidate card can be claimed only ONCE
     matched                          → REPLACE (with that card, +₹ shown)
     none                             → KEEP
```
The "each candidate once" rule prevents the bug of telling you to replace three cards with
the same single card. Also shows total wallet value and the best card you're missing.

---

## 10. Offers & Offer Watch — `data/offers.js` + `components/offers/OfferWatch.jsx`

- **Live countdowns:** a `useNow()` hook ticks every second; `timeLeft(expires, now)`
  computes d/h/m/s and flags `urgent` when < 7 days. SSR-safe (starts null).
- Each offer shows its honest **`worth`** and **`catch`**.
- **Change feed** (`/tools/offer-watch`): aggregates every `xray.history` entry across all
  products, newest first — the "what quietly changed" record.
- `/offers` shows the offer list; `/tools/offer-watch` adds the change feed.

---

## 11. Calculators — `/tools` + `components/tools/Calculators.jsx`

Ten calculators, all live sliders, each result links to matching products. Formulas:

| Calc | Formula |
|---|---|
| **SIP** | `FV = P × ((1+r)^n − 1)/r × (1+r)`, `r = rate/12`, `n = years×12` |
| **EMI** | reducing balance: `EMI = P·r·(1+r)^n / ((1+r)^n − 1)` |
| **Loan Eligibility** | FOIR: capacity `= income×0.5 − existing EMIs`; loan `= capacity·((1+r)^n−1)/(r·(1+r)^n)` |
| **FD** | quarterly compound: `M = P × (1 + rate/4)^(4×years)` |
| **Compound** | `FV = P × (1+rate)^years` |
| **Retirement** | future monthly `= expense×(1+infl)^yrs`; corpus `= futureMonthly×12×25` (25× / 4% rule); then the SIP needed at 12% |
| **GST** | add: `tax = amt×rate%`; remove: `base = amt/(1+rate%)` (split CGST+SGST) |
| **Insurance Cover** | `income × (15 if dependents≥2 else 12) + outstanding loans` |
| **Tax 80C** | `min(invest, 150000) × slab%` |
| **Card Rewards** | `monthly spend × 12 × reward%` (for a real per-card figure, use the Simulator) |

---

## 12. Blog — `/blog` + `/blog/[slug]`

- **List** (`components/blog/BlogList.jsx`): sticky category pills + search, then a grid of
  `BlogCard`s (image-top gradient placeholder + category badge, date/read-time, title,
  excerpt, tags, author footer). (The featured hero card was removed on request.)
- **Single** (`app/blog/[slug]/page.jsx`, SSG): breadcrumb → banner → title → author byline →
  lead → body paragraphs → tags → author bio → **ShareBar** (X/WhatsApp/LinkedIn/copy) →
  finder CTA → sticky sidebar (related reads + explore). Injects `BlogPosting` JSON-LD.
- Images are deterministic gradient placeholders (`blogTint`) — swap for real images when a CMS is added.

---

## 13. Global state — `lib/store.jsx`

One Context, persisted to `localStorage`, hydration-safe:
`theme` (dark/light), `saved[]` (shortlist), `compare[]` (+ `MAX_COMPARE`), `recent[]`
(recently viewed), `profile{age,incomeLakh}` (eligibility), `detailId` (the product-detail modal).
Exposes `toggleSave/isSaved`, `toggleCompare/inCompare/clearCompare`, `pushRecent`,
`setProfile/clearProfile`, `openDetail/closeDetail`.

---

## 14. Navigation, search, theme

- **Navbar** (`components/layout/Navbar.jsx`): desktop nav appears at `lg:` with short labels
  ("Cards", "Invest") to fit; full labels in `title` + the mobile menu (2-col grid). "Find my
  match" CTA at `xl:`. Saved counter + theme toggle.
- **Command search** (`⌘K`, `components/search/CommandSearch.jsx`): a palette over products,
  tools, calculators and guides.
- **Dark mode:** `theme` in the store toggles the `dark` class on `<html>`; every component
  is styled for both via `dark:` variants; persisted.

---

## 15. SEO — built in

- Per-page `metadata` (title, description, **canonical**, OG) on every route.
- `app/sitemap.js` (static routes + every product slug + calculators) and `app/robots.js`
  (disallows `/saved` and `/go/`).
- **JSON-LD:** `Product`/`Review`/`BreadcrumbList`/`FAQPage` on X-Ray pages; `BlogPosting` on posts.
- X-Ray + blog pages are **SSG** — fast and crawlable.
- `/go/[slug]` affiliate interstitials are `noindex`.

---

## 16. Scoring, "Our take" & ratings — current vs the automated model

**Current state (demo):** `scores[]`, `verdict`, `decision`, `pros/cons`, `exclusions` and
`rating` are **hand-authored** in the data files. The Unfiltered Score is just their average.
This is illustrative sample data.

**The catch to fix before any SEO push:** the product JSON-LD emits `AggregateRating` for a
rating with no real reviews. That is self-serving markup and a Google-penalty risk — remove
it until genuine user reviews exist (see GOING-LIVE.md §5a).

**The automated ("nothing editable") model — the intended production working:**
- **Score by formula, not by hand.** Define a rubric once; a scoring engine computes each
  sub-score from the product's objective `attrs` against one-time category benchmarks:
  ```
  Insurance:  claim record = (claimRatio − 90)/9.5 × 10 ;  value = premium-per-₹1L vs peers
  Cards:      effective reward rate ; fee-vs-rewards ; acceptance ; conditions count
  Investments: expense ratio ; returns ; consistency
  Loans:      interest rate ; tenure ; fees
  → weighted average → Unfiltered Score.  Add a product → its score is generated.
  ```
- **"Our take" by template.** A clause library triggered by the same numbers, assembled into
  a sentence (top strength + main catch) — deterministic, no AI, no editing.
- **Decision, pros/cons, badges** likewise derived by threshold rules over the facts.
- **Star rating:** removed until real, moderated user reviews exist.

In that model you maintain only a small **factual dataset** (fee, cover, claim ratio, reward
rate…) sourced from public feeds (IRDAI, AMFI, brochures, RBI) — everything on the page is
generated from it. See GOING-LIVE.md §1 (where the facts come from) and §5a (reviews & scoring at scale).

---

## 17. Adding a product (how the whole site updates from one edit)

1. Append an object to `PRODUCTS` in `data/products.js` (facts + tags + highlights + eligibility `check`).
2. Add its X-Ray entry in `data/xray.js` (decision, nobodyTells, history; reward model for cards).
3. That's it. It automatically appears in: the category catalog, search, filters, the Finder,
   Compare, the Spending Simulator, Wallet Optimizer, the Eligibility Wizard, its own SSG
   X-Ray page (`/category/slug`), its `/go/slug` interstitial, and the sitemap.

No component changes — because everything reads the one dataset through the shared engine.

---

## 18. What is NOT built (needs a backend)

Click tracking on `/go/[slug]` (the disclosure UI exists), analytics, auth/cloud profiles,
real email/push alerts, user reviews & moderation, a CMS, and live rate feeds. The migration
path for all of these is in **GOING-LIVE.md**.
