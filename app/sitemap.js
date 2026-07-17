import { PRODUCTS, CATEGORIES } from '@/data/products';
import { BLOGS } from '@/data/blog';
import { getSlug } from '@/lib/engine';

const SITE = 'https://unfilteredmoney.example';

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    ['', 1.0, 'daily'],
    ['/offers', 0.9, 'daily'],
    ['/eligibility', 0.9, 'weekly'],
    ['/compare', 0.8, 'weekly'],
    ['/tools', 0.8, 'weekly'],
    ['/tools/spending-simulator', 0.9, 'weekly'],
    ['/tools/wallet-optimizer', 0.9, 'weekly'],
    ['/tools/offer-watch', 0.8, 'daily'],
    ['/blog', 0.8, 'weekly'],
    ['/glossary', 0.7, 'monthly'],
    ['/methodology', 0.7, 'monthly'],
    ['/about', 0.5, 'monthly'],
    ['/contact', 0.4, 'yearly'],
    ['/privacy-policy', 0.3, 'yearly'],
  ].map(([path, priority, changeFrequency]) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  const categoryRoutes = CATEGORIES.flatMap((c) => [
    { url: `${SITE}/${c.slug}`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE}/${c.slug}/finder`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]);

  // One X-Ray page per product — the main crawlable surface.
  const productRoutes = PRODUCTS.map((p) => ({
    url: `${SITE}/${p.category}/${getSlug(p)}`,
    lastModified: new Date(p.lastUpdated),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogRoutes = BLOGS.map((b) => ({
    url: `${SITE}/blog/${b.slug}`,
    lastModified: new Date(b.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes];
}
