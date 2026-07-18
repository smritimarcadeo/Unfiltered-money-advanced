// Shared builder for the three X-Ray routes — /insurance/[slug],
// /credit-cards/[slug], /investments/[slug]. Keeps SSG params,
// metadata and JSON-LD identical across categories.

import { notFound } from 'next/navigation';
import { getByCategory } from '@/data/products';
import { getXray } from '@/data/xray';
import { getSlug, getBySlug, unfilteredScore } from '@/lib/engine';
import MoneyXray from '@/components/xray/MoneyXray';

const SITE = 'https://unfilteredmoney.example';

export function buildStaticParams(category) {
  return getByCategory(category).map((p) => ({ slug: getSlug(p) }));
}

export function buildMetadata(category, slug) {
  const p = getBySlug(category, slug);
  if (!p) return {};
  const score = unfilteredScore(p);
  const decision = getXray(p.id)?.decision;
  const desc = decision
    ? `${decision.call} — ${decision.line} Unfiltered Score ${score}/100. The catch, real value and approval odds, unfiltered.`
    : `${p.tagline} Unfiltered Score ${score}/100.`;

  return {
    title: `${p.name} review — Money X-Ray`,
    description: desc.slice(0, 300),
    alternates: { canonical: `${SITE}/${category}/${slug}` },
    openGraph: { title: `${p.name} — Money X-Ray`, description: desc.slice(0, 300), type: 'article' },
  };
}

export function ProductPage({ category, slug }) {
  const product = getBySlug(category, slug);
  if (!product) notFound();

  const score = unfilteredScore(product);
  const catLabel = { 'credit-cards': 'Credit Cards', insurance: 'Insurance', investments: 'Investments', loans: 'Loans' }[category];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        brand: { '@type': 'Brand', name: product.provider },
        description: product.tagline,
        category: catLabel,
        // Editorial review only — a single Review authored by us (our Unfiltered
        // Score). No AggregateRating: that implies user reviews we don't have, and
        // self-serving AggregateRating markup is a Google-penalty risk.
        review: {
          '@type': 'Review',
          reviewRating: { '@type': 'Rating', ratingValue: score, bestRating: 100, worstRating: 0 },
          author: { '@type': 'Organization', name: 'UnfilteredMoney' },
          reviewBody: product.verdict,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
          { '@type': 'ListItem', position: 2, name: catLabel, item: `${SITE}/${category}` },
          { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE}/${category}/${slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `Is ${product.name} worth it?`,
            acceptedAnswer: { '@type': 'Answer', text: product.verdict },
          },
          {
            '@type': 'Question',
            name: `What are the drawbacks of ${product.name}?`,
            acceptedAnswer: { '@type': 'Answer', text: product.cons.join(' ') },
          },
          {
            '@type': 'Question',
            name: `What is not covered by ${product.name}?`,
            acceptedAnswer: { '@type': 'Answer', text: product.exclusions.join(' ') },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MoneyXray product={product} />
    </>
  );
}
