import { describe, expect, it } from 'vitest';
import {
  buildSeoHead,
  buildToolJsonLd,
  buildHubJsonLd,
  buildFaqJsonLd,
  escapeHtml,
  pageCanonicalUrl,
} from './head';
import { getPageById, HUB_PAGE } from './pages';

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    expect(escapeHtml(`Tom & Jerry's <script>"test"</script>`)).toBe(
      'Tom &amp; Jerry&#39;s &lt;script&gt;&quot;test&quot;&lt;/script&gt;',
    );
  });
});

describe('buildSeoHead', () => {
  it('includes canonical URL with site prefix', () => {
    const head = buildSeoHead({
      page: HUB_PAGE,
      documentTitle: 'Img2Favicon — Private Browser Image Tools',
    });
    expect(head).toContain(
      '<link rel="canonical" href="https://dor-j.github.io/Img2Favicon/index.html" />',
    );
  });

  it('escapes descriptions in meta tags', () => {
    const page = {
      ...HUB_PAGE,
      seoDescription: 'Free & private "browser" tools',
    };
    const head = buildSeoHead({ page });
    expect(head).toContain('content="Free &amp; private &quot;browser&quot; tools"');
  });

  it('uses relative asset prefix for tool pages', () => {
    const page = getPageById('resize');
    expect(page).toBeDefined();
    const head = buildSeoHead({ page: page! });
    expect(head).toContain('href="../../favicon.ico"');
  });

  it('includes JSON-LD script', () => {
    const head = buildSeoHead({ page: HUB_PAGE });
    expect(head).toContain('<script type="application/ld+json">');
  });
});

describe('JSON-LD builders', () => {
  it('builds hub schemas with tool list', () => {
    const schemas = buildHubJsonLd();
    expect(schemas).toHaveLength(2);
    expect(schemas[0]['@type']).toBe('WebSite');
    expect(schemas[1]['@type']).toBe('ItemList');
  });

  it('builds tool WebApplication schema', () => {
    const page = getPageById('favicon');
    expect(page).toBeDefined();
    const schemas = buildToolJsonLd(page!);
    expect(schemas[0]['@type']).toBe('WebApplication');
    expect(schemas[0].offers).toEqual({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    });
  });

  it('builds FAQ schema from page FAQ items', () => {
    const page = getPageById('strip-metadata');
    expect(page?.faq?.length).toBeGreaterThan(0);
    const faq = buildFaqJsonLd(page!.faq!);
    expect(faq['@type']).toBe('FAQPage');
    expect(faq.mainEntity).toHaveLength(page!.faq!.length);
  });
});

describe('pageCanonicalUrl', () => {
  it('returns absolute URL for a page path', () => {
    expect(pageCanonicalUrl('tools/crop/index.html')).toBe(
      'https://dor-j.github.io/Img2Favicon/tools/crop/index.html',
    );
  });
});
