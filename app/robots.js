const SITE = 'https://unfilteredmoney.example';

export default function robots() {
  return {
    // /saved is personal; /go/* are affiliate interstitials — neither belongs in an index.
    rules: [{ userAgent: '*', allow: '/', disallow: ['/saved', '/go/'] }],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
