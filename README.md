# UnfilteredMoney Pro 💰

> Honest, unbiased money guidance for India — insurance, credit cards & investments.
> Built from scratch on **Next.js 15 (App Router)** with a **Preference Finder** that matches
> products to the user instead of just listing them.

---

## 🚀 Run it

```bash
npm install
npm run dev                 # starts on the first free port (3000, else 3001, 3002…)
npm run build && npm start  # production — also auto-picks a free port
```

**No port is hard-coded.** `next dev` finds a free port on its own. `next start` doesn't —
it crashes with `EADDRINUSE` — so `npm start` goes through [`scripts/start.mjs`](./scripts/start.mjs),
which probes upward from 3000 and starts on the first free one.

Want a specific port? Set `PORT`:

```bash
PORT=4000 npm run dev        # or: PORT=4000 npm start
```

---

## ✨ What's built (all working)

### Core — Preference Finder (the USP)
- **Multi-step quiz** per vertical (insurance / credit cards / investments), one question per screen, progress bar, back/next, auto-advance on single-select, multi-select support.
- **Weighted tag-matching engine** (`lib/recommend.js`) — pure function, no AI/API. Each answer rewards products sharing its tags.
- **Hard filter on the goal question** — ask for health cover, you only get health plans.
- **Match % + "why this?" reasons** on every result card.
- **Top 3 picks** + "other options worth a look", plus retake.

### ⭐ Money X-Ray — the signature feature
A crawlable, statically-generated **truth report** per product at `/{category}/{slug}`
(e.g. `/credit-cards/axis-ace-credit-card`) — 19 pages, one per product.

| Section | What it does |
|---|---|
| **Decision** | A blunt **YES / MAYBE / NO** with a one-line reason |
| **Unfiltered Score** | 0–100, derived from the published sub-scores — no hand-tuning |
| **Our take** | Editorial verdict, including who should *not* buy |
| **Score breakdown** | 4 sub-scores with animated bars |
| **Real yearly value** | (cards) 8 spend sliders → net ₹, effective rate, break-even |
| **Approval odds** | Rule-based %, no credit bureau — never an approval |
| **The Catch** | The fine print that decides if it's good *for you* |
| **Things nobody tells you** | Buried in the T&C, or never mentioned |
| **Fine-print timeline** | Dated changes — good / bad / neutral |
| **Honest alternatives** | Tag-overlap suggestions, cross-linked |
| **Provenance** | Last verified + source |

**Score vs Decision:** they measure different things and can disagree — Amex scores **85 (Strong)**
but gets a **NO**, because its value is gated behind ₹4L of spend most people never hit. Both the
X-Ray and `/methodology` say this explicitly rather than hiding the tension.

### 🧰 Decision tools

| Tool | Route | What it does |
|---|---|---|
| **Wallet Optimizer** | `/tools/wallet-optimizer` | Pick the cards you hold + your spend → blunt **Keep / Replace / Remove** on each, with the ₹ impact and a specific swap. Each upgrade card is offered to only **one** of your cards (greedy, biggest-gain-first) — no "replace all three with the same card". |
| **Eligibility Wizard** | `/eligibility` | 3 questions → approval odds across every product. Rule-based, no bureau, saved to your browser so every product page then shows your odds. |
| **Compare workspace** | `/compare` | Up to 4 products, winner per row, and — when all picks are cards — a **live spend simulator** that recomputes net value and can flip the winner. |
| **Offer Watch** | `/tools/offer-watch` | Live expiry countdowns + a feed of every fine-print change issuers made. |
| **Offers** | `/offers` | Every live offer with what it's *really* worth and **the catch**. |

### 🎚 Spending Simulator — `/tools/spending-simulator`
8 category sliders + 4 presets → every card **live re-ranks** by net yearly value
(rewards − fee, monthly caps applied), with a spring-animated leaderboard and value bars.

### 🔎 ⌘K command search
One flat index over products, guides, glossary terms and pages. Keyboard-driven
(↑↓ navigate, ↵ open, Esc close), prefix-ranked.

### 🧮 The shared engine — `lib/engine.js`
The X-Ray, reward calculator, simulator and compare **all compute from one file**, so the
numbers can never disagree across the site. It owns: `unfilteredScore`, `yearlyValue`
(caps + fee waivers + break-even), `rankBySpend`, `approvalOdds`, and slug helpers.

### Authenticity — why you'd believe us
- **Rating breakdown** — each product scored /10 on 4 criteria (claim record or rewards rate, value, service, transparency) with animated bars, not one opaque star rating.
- **"Our take"** — an honest editorial verdict on every product, including who should *not* buy it.
- **The fine print** — a "what's not covered" section per product (co-pays, caps, spend targets, GST, lock-ins).
- **Provenance** — every product shows a **"Last verified"** date and the **source** it was checked against.
- **[/methodology](app/methodology/page.jsx)** — the full method: scoring weights, how the finder ranks, **how we make money**, and an explicit "where we fall short" section.
- **Sponsored labels** on cards, in the detail modal, and in the footer — and sponsorship is never an input to ranking.

### Usefulness
- **Eligibility checker** — enter age + income once; every card gets a **"Likely eligible" / "Not eligible — needs ₹6L+"** chip, plus an **"Eligible only (n)"** filter. Persisted, never transmitted.
- **Similar options** — tag-overlap suggestions inside every product detail.
- **Shareable finder results** — answers encode into the URL (`?goal=health&who=parents…`), so a result can be shared or bookmarked and restores on load.
- **Save as PDF** — print styles strip the chrome for a clean takeaway.
- **[/glossary](app/glossary/page.jsx)** — 28 jargon terms in plain English, searchable and filterable by category, each with "what it means" + "why it matters".

### Catalog & discovery
- Category pages for all three verticals with **search**, **subtype pills**, **sort** (rating / price ↑ / price ↓), live result count.
- **Product cards** — rating, "Best for" badge, key highlights, pros preview, sponsored label.
- **Product detail modal** — full pros/cons, eligibility & documents, highlights, sponsored disclosure, sticky action bar.
- **Featured "Top picks"** strip on each category page.

### Decide
- **Compare up to 3** side-by-side — sticky compare bar, dynamic table built from product highlights, **best-value cells highlighted**, **"Top pick"** winner badge.

### Personalisation (no login needed)
- **Shortlist / save** (❤️) — persisted in `localStorage`, with a **Saved** page and navbar counter.
- **Recently viewed** strip (home + category pages).
- **Dark mode** — persisted, respects system preference.

### Tools
- **10 working calculators** at `/tools`: SIP · EMI · Loan Eligibility (FOIR) · FD (quarterly compounding) · Compound · Retirement (25× rule + SIP needed) · Insurance Cover · 80C Tax · GST (add/remove) · Card Rewards — live sliders, each result **links through to matching products**.

### Compliance & transparency pages
- **`/privacy-policy`** — DPDP Act 2023 aware. Documents that there are no cookies, no analytics, no accounts, and that everything (answers, age, income, spend) stays in `localStorage`.
- **`/go/[slug]`** — an affiliate interstitial shown *before* you leave: states plainly whether we earn a commission on that product, that nothing about you travels with the click, and whose privacy policy now applies. `noindex` + disallowed in robots.txt.

### Content & trust
- **Blog** — list + article pages (SSG via `generateStaticParams`), each ending in a finder CTA.
- **Trust section**, testimonials, FAQ accordion, **sponsored disclosure** in footer + detail modal.
- About & Contact (form with demo submit state), custom 404.

### Foundation & SEO
- Mobile-first responsive, framer-motion animations, accessible labels/focus states, custom design system.
- Per-page **metadata** + **canonical** URLs.
- **`sitemap.xml`** (38 URLs — static + category + 19 X-Ray pages + blog) and **`robots.txt`**, both generated from the data.
- **JSON-LD** on every X-Ray page: `Product` + `AggregateRating` + `Review` + `BreadcrumbList` + `FAQPage`.
- X-Ray pages are **statically generated (SSG)** — fast and crawlable.

---

## 🎨 Design language (different from the old site)

| Token | Choice |
|-------|--------|
| Brand | Deep **emerald** (`brand-*`) — money / trust |
| Neutrals | Cool **slate "ink"** scale (`ink-50…950`) |
| Accent | Amber (ratings) |
| Fonts | **Plus Jakarta Sans** (display) + **Inter** (body) |
| Shape | Rounded 2xl/3xl cards, soft layered shadows (`shadow-card`, `shadow-lift`) |
| Motion | Subtle fade-up on scroll, spring modals |

Fonts load via `<link>` with a system-font fallback — **no build-time font fetch**, so it builds offline.

---

## 📁 Structure

```
unfilteredmoney-pro/
├── app/
│   ├── layout.jsx / providers.jsx     # shell: Navbar, Footer, CompareBar, ProductDetail
│   ├── page.jsx                       # home
│   ├── insurance|credit-cards|investments/
│   │   ├── page.jsx                   # category catalog
│   │   └── finder/page.jsx            # Preference Finder
│   ├── tools/ blog/ blog/[slug]/ saved/ about/ contact/ not-found.jsx
│   └── globals.css                    # design system + component classes
├── components/
│   ├── finder/Finder.jsx              # ⭐ quiz + results
│   ├── product/                       # ProductCard, ProductGrid, FilterBar, ProductDetail
│   ├── compare/                       # CompareBar, CompareModal
│   ├── category/CategoryView.jsx      # shared catalog view for all 3 verticals
│   ├── home/                          # Hero, Sections
│   ├── shared/                        # FAQ, RecentlyViewed
│   └── layout/                        # Navbar, Footer
├── data/                              # ⭐ all content — no backend
│   ├── products.js                    # catalog: tags, attrs, scores, verdict,
│   │                                  #   exclusions, check (eligibility), source
│   ├── finder.js                      # quiz questions + weights
│   ├── glossary.js                    # jargon terms
│   ├── blog.js  site.js
└── lib/
    ├── recommend.js                   # ⭐ matching engine
    ├── eligibility.js                 # profile vs product rules
    ├── store.jsx                      # theme / saved / compare / recent / profile
    └── format.js
```

---

## 🧠 How the matching engine works

1. Every product has `tags` (e.g. `['health','senior','cashless','budget-high']`).
2. Every quiz option has `tags`, a `weight`, and a `reason` string.
3. For each product: `score = Σ weight` of selected options sharing ≥1 tag; matched `reason`s are collected.
4. `matchPct = score / totalWeight × 100`, nudged slightly by the product's rating to break ties.
5. Options on a question marked `filter: true` **hard-filter** the pool (goal must match).
6. Sorted by score, then rating.

**Tuning it:** change `weight` in `data/finder.js`, or add/remove `tags` in `data/products.js`.
No component changes needed — the whole finder is data-driven.

### Adding a product
Append an object to `PRODUCTS` in `data/products.js` with `tags` + `highlights` + `pros`/`cons`/`eligibility`.
It automatically appears in the catalog, filters, finder, compare and search.

---

## ⚠️ Honest caveats

- **Front-end only.** No backend, database, auth or email. Contact form and "Apply" don't submit anywhere.
- **Illustrative data.** Real issuer names, but every rate, score, catch and timeline entry is a sample — not a live quote. Not financial advice; not SEBI/IRDAI/RBI registered.
- **Finder pages are client-rendered.** Adding shareable result URLs (`useSearchParams`) makes Next opt into client rendering, so `/*/finder` ships a skeleton in SSR HTML. Fine for interactive tools — the X-Ray pages carry the SEO.

## 🗺 Roadmap (needs a backend)

- **Click tracking** on `/go/[slug]` (the disclosure layer is built; the tracking isn't) · GA4
- Login + cloud-saved preferences · **real** email/push alerts for Offer Watch · renewal reminders
- User reviews · CMS for product/blog data · newsletter (ESP)
- Programmatic "X vs Y" compare pages · Hindi/multi-language · PWA

---

*Demo build with sample data — not financial advice.* 🇮🇳
