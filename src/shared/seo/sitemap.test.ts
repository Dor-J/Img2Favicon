import { describe, expect, it } from 'vitest';
import { buildSitemapXml } from './sitemap';
import { ALL_PAGES } from './pages';

describe('buildSitemapXml', () => {
  it('includes every public page', () => {
    const xml = buildSitemapXml('2026-06-26');
    for (const page of ALL_PAGES) {
      expect(xml).toContain(`https://dor-j.github.io/Img2Favicon/${page.path}`);
    }
  });

  it('uses provided lastmod date', () => {
    const xml = buildSitemapXml('2026-06-26');
    expect(xml).toContain('<lastmod>2026-06-26</lastmod>');
  });

  it('prioritizes the hub page', () => {
    const xml = buildSitemapXml('2026-06-26');
    expect(xml).toContain('<loc>https://dor-j.github.io/Img2Favicon/index.html</loc>');
    expect(xml).toMatch(/index\.html[\s\S]*?<priority>1\.0<\/priority>/);
  });

  it('returns valid xml declaration', () => {
    const xml = buildSitemapXml();
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
  });
});
