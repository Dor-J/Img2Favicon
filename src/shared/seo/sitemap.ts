import { ALL_PAGES } from './pages';
import { pageCanonicalUrl } from './head';

/** Builds sitemap.xml content for all public pages. */
export function buildSitemapXml(lastmod = new Date().toISOString().slice(0, 10)): string {
  const urls = ALL_PAGES.map(
    (page) => `  <url>
    <loc>${pageCanonicalUrl(page.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.id === 'hub' ? '1.0' : '0.8'}</priority>
  </url>`,
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
