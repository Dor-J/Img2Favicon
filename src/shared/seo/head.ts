import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from './site';
import type { FaqItem, PageEntry } from './pages';
import { HUB_PAGE, TOOL_PAGES } from './pages';

/** Options for building SEO head tags. */
export interface SeoHeadOptions {
  page: PageEntry;
  /** Full page title shown in browser tab (defaults to page title + site name). */
  documentTitle?: string;
  ogType?: 'website' | 'article';
  /** Relative prefix for favicon assets (e.g. './' or '../../'). */
  assetPrefix?: string;
}

/** Escapes text for safe HTML attribute and content insertion. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Builds JSON-LD for the hub page. */
export function buildHubJsonLd(): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: absoluteUrl('/'),
      description: HUB_PAGE.seoDescription,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${SITE_NAME} tools`,
      itemListElement: TOOL_PAGES.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        url: absoluteUrl(`/${tool.path}`),
      })),
    },
  ];
}

/** Builds JSON-LD for a tool page. */
export function buildToolJsonLd(page: PageEntry): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: page.title,
      description: page.seoDescription,
      url: absoluteUrl(`/${page.path}`),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
  ];

  if (page.faq?.length) {
    schemas.push(buildFaqJsonLd(page.faq));
  }

  return schemas;
}

/** Builds FAQPage JSON-LD. */
export function buildFaqJsonLd(faq: FaqItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function jsonLdScript(schemas: Record<string, unknown>[]): string {
  if (schemas.length === 0) return '';
  const payload = schemas.length === 1 ? schemas[0] : schemas;
  return `<script type="application/ld+json">${JSON.stringify(payload)}</script>`;
}

/** Builds SEO meta tags, canonical link, and optional JSON-LD. */
export function buildSeoHead(options: SeoHeadOptions): string {
  const {
    page,
    ogType = page.id === 'hub' ? 'website' : 'article',
    assetPrefix = page.id === 'hub' ? './' : '../../',
  } = options;
  const documentTitle =
    options.documentTitle ??
    (page.id === 'hub' ? `${SITE_NAME} — ${page.title}` : `${page.title} — ${SITE_NAME}`);
  const canonical = absoluteUrl(`/${page.path}`);
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE);
  const description = page.seoDescription;

  const schemas = page.id === 'hub' ? buildHubJsonLd() : buildToolJsonLd(page);

  const keywords = page.keywords?.length
    ? `<meta name="keywords" content="${escapeHtml(page.keywords.join(', '))}" />`
    : '';

  return `<link rel="canonical" href="${escapeHtml(canonical)}" />
  <meta name="robots" content="index, follow" />
  ${keywords}
  <meta property="og:title" content="${escapeHtml(documentTitle)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(documentTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
  <link rel="icon" href="${escapeHtml(`${assetPrefix}favicon.ico`)}" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="${escapeHtml(`${assetPrefix}favicon-32x32.png`)}" />
  <link rel="apple-touch-icon" sizes="180x180" href="${escapeHtml(`${assetPrefix}apple-touch-icon.png`)}" />
  ${jsonLdScript(schemas)}`;
}

/** Returns the canonical URL for a page path (for tests and sitemap). */
export function pageCanonicalUrl(path: string): string {
  return absoluteUrl(`/${path}`);
}

/** Exposes site URL for tests. */
export { SITE_URL };
