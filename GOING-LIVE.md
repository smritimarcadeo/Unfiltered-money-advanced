# Going Live — from demo to a real product

> **Scope:** how to replace the illustrative sample data with real, maintainable data;
> how to build the CMS; and how to handle content, on-page SEO and off-page SEO so this
> ranks and earns. Written for the Indian finance-comparison context specifically.
>
> **Read the compliance section first (§6).** For a finance site in India, getting the
> data *right and legal* matters more than getting it fast.

---

## 0. TL;DR — the honest version

- **Don't scrape banks.** It's the worst option: legally risky, and card/loan rates change
  constantly, so scraped data goes stale and stale data = wrong advice = your liability.
- **The real answer is boring:** join **affiliate networks + card/insurance partner programs**,
  and hire (or be) a small **editorial team** that verifies every number against the issuer's
  own page. That's exactly how BankBazaar, Paisabazaar, Ditto and CardExpert actually work.
- **Store all of it in a headless CMS** (Sanity / Strapi / Payload). The current `data/*.js`
  files already match the shape a CMS would return — swapping the source is a small change.
- **Your moat is editorial, not data volume:** the "Our take", "The Catch" and the
  fine-print timeline are things a scraper can never produce. Lean into that.

---

## 1. Where the data actually comes from

Ranked by how real businesses in this space actually do it — best first.

### 1.1 Affiliate networks & partner programs ⭐ (primary source + revenue)

This is both your **data source** and your **income**. When you join a card/loan/insurance
affiliate program you typically get: an approved product list, creative assets, the key
terms, and a **tracking link** — plus commission when a user applies.

| Network / program | Covers | How to join |
|---|---|---|
| **Bank/issuer direct affiliate** (HDFC, ICICI, Axis, SBI Card, IDFC FIRST…) | Their own cards/loans | Apply on the issuer's "partner"/"affiliate" page or via a business contact |
| **INRDeals / Cuelinks / vCommission / Optimise / Admitad India** | Aggregate many bank offers under one login | Sign up as a publisher, get approved, pull offers via dashboard/API |
| **NBFC & fintech programs** (Bajaj Finserv, MoneyView, CASHe…) | Personal loans | Direct publisher signup |
| **Insurance web-aggregator tie-ups** (Policybazaar-style partners, or direct with insurers) | Health/term/motor | Requires IRDAI web-aggregator licence or a licensed partner — see §6 |
| **Mutual fund** — you generally **don't** need feeds | Fund data is public | Use AMFI (below); never gate fund choice behind commission |

**Practical:** most publishers start with **one aggregator (e.g. Cuelinks/INRDeals)** to get
breadth fast, then add **direct issuer deals** for the top products (higher commission).

### 1.1a "I'm brand new — no bank will give me access yet"

Correct, and it doesn't block you. Separate two things people conflate:

- **Displaying factual data** needs **no** bank permission. A card's fee, reward rate and
  features are public facts. Read them off the issuer's own public page / MITC PDF and
  **rewrite them in your own words** (don't copy their marketing copy — that's their
  copyright; the *fact* isn't). You can compile and launch a 30–50 product catalog by hand
  from public sources this weekend. Every big site started exactly here.
- **Earning commission** needs an affiliate link — and **aggregators approve new/small
  publishers** where banks won't deal with you directly yet:

  | Network | Entry bar |
  |---|---|
  | **EarnKaro** | Works **without a website** — pure link-based, lowest bar |
  | **Cuelinks** | Website required, approves new publishers, hundreds of India brands/banks |
  | **INRDeals** | Bank card/loan focus |
  | **vCommission / Admitad / Optimise** | Large CPA networks carrying bank offers |

  Join one → pull offers + tracking links from its dashboard → drop them into `applyUrl`.

- **Bootstrap order (solves the chicken-and-egg):**
  `compile public data → launch with aggregator links (or the issuer's own public apply URL,
  earning ₹0 but real) → build traffic → traffic unlocks direct bank deals + IRDAI-partner
  tie-ups.` Direct access comes *after* traffic, never before it.

### 1.2 Official / public data feeds (free, authoritative — use for the numbers)

These are the sources your editorial team verifies against. **Cite them** (the `source`
field already exists on every product).

| Data | Source | Notes |
|---|---|---|
| Mutual fund NAV, returns, expense ratio | **AMFI** (amfiindia.com — free NAV file) + AMC factsheets | Daily NAV is downloadable and redistribution-friendly for info use |
| Insurance claim settlement ratios | **IRDAI Annual Report** (published yearly) | The single number people trust — always dated |
| Repo rate / policy rates | **RBI** press releases | Drives loan rates |
| Card fees & terms (MITC) | Each issuer's **"Most Important Terms & Conditions"** PDF | The authoritative fee/charge document — link to it |
| Gold/FD/small-savings rates | RBI / bank rate cards / India Post | Rate cards change; timestamp them |

> Rule: **numbers come from official sources or the issuer's own page; opinions come from you.**
> Never publish a rate you can't point at a source for.

### 1.3 Licensed data providers (paid — optional, for scale)

If you grow beyond what a small team can maintain by hand, you can buy structured feeds:
mutual-fund data vendors (e.g. Morningstar/Value Research-style feeds), or fintech data
APIs. Expensive; only worth it once traffic justifies it.

### 1.4 Manual editorial (always — this is the moat)

Even with feeds, a human must write: `verdict` (Our take), `exclusions` (The Catch),
`nobodyTells`, the `decision` (YES/MAYBE/NO), and the `history` timeline. This is the content
Google rewards under **E-E-A-T** (§4) and the reason a user picks you over a rate table.

### 1.5 Scraping — read this before you consider it

**Short version: avoid it for rates. Here's the honest breakdown.**

- **Legal risk (India):** most bank/aggregator sites' Terms of Use forbid automated
  collection. Bypassing access controls can attract liability under the **IT Act, 2000**,
  and copying substantial content raises **Copyright Act** issues. This is a real, not
  theoretical, risk for a commercial site.
- **Product risk:** rates, fees and offers change weekly. A scraper gives you *yesterday's*
  numbers with no provenance — the opposite of what a trust brand needs. One wrong premium
  or APR shown to a user is a genuine liability on a finance site.
- **What IS reasonable:** scraping **publicly published, non-gated, factual** data that has
  no ToS prohibition **for internal verification** (e.g. cross-checking a fee you already
  sourced), always respecting `robots.txt`, rate-limiting, identifying your bot, and never
  redistributing copyrighted copy. Treat it as a *checking* tool, not a *sourcing* one.
- **Bottom line:** affiliate feeds + official data + editorial beat scraping on legality,
  freshness and trust simultaneously. There is no scenario where scraping rates is the
  right primary strategy for this business.

---

## 2. The CMS — architecture

Goal: your editorial team edits products, offers, blog posts and SEO fields in a friendly UI,
and the Next.js site reads them. **No more editing `data/*.js` by hand.**

### 2.1 Which CMS

**Recommended: a headless CMS.** Top picks for this stack:

| CMS | Why | Trade-off |
|---|---|---|
| **Sanity** ⭐ | Great editing UX, real-time, generous free tier, strong for structured product data + references | Hosted (your content lives on Sanity) |
| **Payload CMS** | Open-source, self-hosted, Postgres/Mongo, code-first schema that mirrors your current JS objects almost 1:1 | You run/host it |
| **Strapi** | Popular, self-hosted, admin UI out of the box | Heavier |

For a finance site that wants control and self-hosting, **Payload** maps cleanest onto what
you already have. For fastest time-to-editor, **Sanity**. Either works.

### 2.2 The content models (mirror your current data)

Your `data/` files already ARE the schema. Recreate them as CMS collections:

```
Product        → id, category, subtype, name, provider, logo, tagline,
                 rating, sponsored, featured, bestFor, badges[],
                 highlights[{label,value}], scores[{label,value}],
                 verdict (rich text), pros[], cons[], exclusions[],
                 eligibility[{title,description}], check{minAge,maxAge,minIncomeLakh},
                 tags[], attrs{...}, applyUrl, lastUpdated, source,
                 reward{rates,capMonthly,fee,waiverSpend}   ← cards
                 seo{title,description,canonical,ogImage}    ← per-product SEO override

XRay           → decision{call,line}, nobodyTells[], history[{date,label,type}]
                 (or fold these into Product)

Offer          → productId (reference), title, detail, worth, expires, catch, kind

BlogPost       → slug, title, excerpt, body (rich text/portable text), category,
                 author (reference), readTime, date, tag, relatedProducts[],
                 seo{...}, faq[{q,a}]

Author         → name, bio, credentials, photo, socials   ← for E-E-A-T (§4)

Category       → slug, label, emoji, tagline, subtypes[], cta, seo{...}

Glossary       → term, cat, short, long

Redirect       → from, to, type(301/302)   ← so editors manage redirects
```

### 2.3 How it plugs into the current code (small change)

Right now: `import { PRODUCTS } from '@/data/products'` (synchronous, build-time).

After CMS: replace each `data/*.js` with a fetch in a server component, cached and
revalidated. The rest of the app (finder, X-Ray, compare, engine) **doesn't change** —
it already takes plain objects.

```js
// lib/cms.js
export async function getProducts() {
  const res = await fetch(`${CMS_URL}/api/products`, {
    next: { revalidate: 3600, tags: ['products'] },   // ISR: refresh hourly
  });
  return res.json();
}
```

- Use **Incremental Static Regeneration** (`revalidate`) so pages stay static-fast but
  update when the CMS changes.
- Add an **on-publish webhook** from the CMS → `revalidateTag('products')` so an edit goes
  live in seconds, not on the next deploy.
- Keep the same slug logic (`lib/engine.js#getSlug`) so URLs never change.

### 2.4 Editorial workflow

Draft → **fact-check against `source`** → set `lastUpdated` → publish. Add a required
"verified by" + "verified on" field. A **freshness dashboard** (products whose `lastUpdated`
is >90 days old) keeps data honest — and the X-Ray already shows that date to users.

---

## 3. Backend you'll need for a "real" product

The demo is front-end only. To actually operate:

| Need | Build |
|---|---|
| **Affiliate redirect + click tracking** | Make `/go/[slug]` a real route that logs the click (product, timestamp, referrer, campaign) to a DB, then 302s to the affiliate URL. The disclosure UI is already built. |
| **Database** | Postgres (Supabase/Neon) or the CMS's DB — for clicks, leads, saved items if you add accounts |
| **Analytics** | GA4 or a privacy-first option (Plausible/Umami). Track: finder completions, X-Ray views, `/go` clicks, calculator use |
| **Auth (optional)** | Only if you add cloud-saved profiles. Google/OTP via Clerk/Supabase Auth. Update `/privacy-policy` the moment you store personal data |
| **Lead forms** | Insurance/loan "get a callback" → your CRM + consent capture (DPDP, §6) |
| **Search (at scale)** | If catalog grows large, add Algolia/Meilisearch; today the client filter is fine |
| **Hosting** | Vercel (native Next.js) or a container on Railway/Render. CMS self-host on the same |
| **Conversion tracking** | Postback/S2S from the affiliate network so you know which clicks earned — the whole business depends on this loop |

---

## 4. On-page SEO (what's already done + what to add)

### Already in the build ✅
- Per-page `metadata` (title, description, canonical, OG) on every route
- **JSON-LD** on product pages: `Product` + `AggregateRating` + `Review` + `BreadcrumbList` + `FAQPage`
- `sitemap.xml` + `robots.txt` (with `/go/*` and `/saved` disallowed)
- X-Ray pages are **statically generated (SSG)** — fast, crawlable
- Semantic headings, per-product slugs, `noindex` on affiliate interstitials

### Add for production
1. **Per-product SEO overrides from the CMS** — let editors set a custom title/description/OG
   image per product and blog post (fields are in the model above). Auto-generate a good
   default (already done), let humans override the important ones.
2. **OG images** — generate dynamic share images (`opengraph-image.js` / `@vercel/og`) showing
   the product name + Unfiltered Score. Big CTR win in social/WhatsApp shares.
3. **Programmatic comparison pages** — `/[category]/[slugA]-vs-[slugB]` generated from the
   catalog. "X vs Y" is enormous long-tail search volume in Indian finance. You already have
   the compare engine; wrap it in an indexable SSG route with its own JSON-LD.
4. **Real canonical domain** — replace `unfilteredmoney.example` in `metadataBase`, `sitemap.js`,
   `robots.js` and `lib/product-page.jsx` with your live domain (single find-replace).
5. **Core Web Vitals** — you're already static + light; keep images optimized (switch
   `images.unoptimized` off once you have a real image host), lazy-load below the fold.
6. **Internal linking** — the X-Ray "alternatives", blog→product links and glossary already
   do this. Add breadcrumb UI (schema is there) and category hub pages with rich intro copy.
7. **Content freshness signals** — surface `lastUpdated` as a visible "Reviewed on" line (already
   on the X-Ray) — Google likes dated, maintained finance content.

---

## 5. Off-page SEO & authority

Finance is **YMYL** ("Your Money or Your Life") — Google holds it to the highest trust bar.
Off-page is where you earn that.

1. **E-E-A-T is non-negotiable.** Add real **author pages** with credentials (the `Author`
   model exists), an "About / editorial standards" page (you have `/methodology` + `/about`),
   and named reviewers on money articles. Google explicitly weighs author expertise on YMYL.
2. **Backlinks from finance/news sites** — original data studies ("we analysed 50 cards'
   real reward rates") earn links far better than product pages. Your engine can generate
   these studies from real data once you have it.
3. **Digital PR** — pitch your "The Catch" findings and rate-change timeline to personal-finance
   journalists. Being the site that *spots the fine-print change first* is a linkable angle.
4. **Google Business + brand SERP** — consistent NAP, `Organization` + `sameAs` JSON-LD linking
   your socials, so your brand box is clean.
5. **Community & social** — a genuinely useful newsletter ("what changed in cards this month",
   which you can auto-draft from the Offer Watch timeline) builds direct traffic that doesn't
   depend on Google.
6. **Comparison/aggregator citations** — get listed where people already look for card comparisons.
7. **Avoid:** paid link schemes, spun content, thin doorway pages — on a YMYL site these get you
   demoted hard.

---

## 6. Compliance — do NOT skip (India)

A finance site that gives recommendations sits close to regulated territory. Get this reviewed
by a lawyer before launch; the framing below keeps you on the safe side.

| Area | What it means for you |
|---|---|
| **"Information, not advice"** | Keep the current framing everywhere (footer, About, per-page). Personalised *recommendations* on investments can cross into **SEBI Registered Investment Adviser** territory; on insurance into **IRDAI web-aggregator** territory. The finder is framed as *information/decision-support* — keep it that way, or get the licence. |
| **IRDAI (insurance)** | To *sell/compare and transact* insurance as an aggregator you need an **IRDAI web-aggregator registration**, or you must partner with a licensed entity and hand off the transaction. Displaying editorial info about plans is lighter; the moment you facilitate a sale, you need the licence/partner. |
| **SEBI (investments)** | Educational content about mutual funds is fine. Telling a specific person to buy a specific fund for money can require **RIA registration**. Keep investment tools as info + calculators, not personalised advice. Distributing MFs needs **AMFI/ARN**. |
| **RBI (loans/cards)** | You're a referrer/lead-gen, not a lender — fine, but disclose the partner relationship. |
| **DPDP Act 2023** | The moment a form captures a name/email/phone: add a **consent notice**, a real **privacy policy** (you have `/privacy-policy` — expand it when you collect data), purpose limitation, and a grievance contact. |
| **ASCI (advertising)** | **Affiliate/sponsored disclosure must be clear and upfront** — you already do this on cards, the X-Ray, `/go`, the footer and `/methodology`. Keep it. |
| **Disclaimers** | Keep "not SEBI/IRDAI/RBI registered", "not financial advice", and dated data. Already present. |

---

## 7. Migration checklist (demo → production)

1. [ ] Register domain; set it in `metadataBase`, `sitemap.js`, `robots.js`, `lib/product-page.jsx`
2. [ ] Stand up the CMS (Payload/Sanity); recreate the models in §2.2
3. [ ] Migrate the current `data/*.js` content into the CMS as the first real records
4. [ ] Add `lib/cms.js` fetchers with ISR + revalidate webhooks; swap imports
5. [ ] Join 1 affiliate aggregator + 2–3 direct issuer programs; get real `applyUrl`s
6. [ ] Build the real `/go/[slug]` redirect + click logging to a DB
7. [ ] Replace sample numbers with sourced, dated, verified data (editorial pass)
8. [ ] Add GA4 + conversion postbacks from the affiliate network
9. [ ] Add author pages + editorial-standards page (E-E-A-T)
10. [ ] Turn on real image hosting; set `images.unoptimized: false`
11. [ ] Bump/patch Next before public deploy; run a security review
12. [ ] **Legal review** of the "information not advice" framing + IRDAI/SEBI exposure
13. [ ] Expand `/privacy-policy` + add consent capture before any form goes live
14. [ ] Ship programmatic "X vs Y" pages + dynamic OG images for the SEO push
15. [ ] Launch the newsletter (auto-drafted from Offer Watch) for owned traffic

---

## 8. Rough cost & team reality

- **Solo / bootstrap:** you can run this yourself — be the editorial team, use one affiliate
  aggregator, Sanity free tier, Vercel free/hobby, GA4. Cost ≈ domain + time.
- **Small team:** +1 editor/fact-checker (the real bottleneck is trustworthy data, not code),
  a paid CMS tier, a data-vendor feed once traffic justifies it.
- **The constraint is never the code** — it's keeping the numbers correct and current, and
  earning authority. Budget your effort there.

---

*This document is engineering + strategy guidance, not legal advice. For a regulated-adjacent
finance product in India, have a lawyer review your licensing exposure and disclosures before
you accept a single rupee of commission.*
