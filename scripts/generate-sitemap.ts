import { writeFileSync, mkdirSync } from 'node:fs';
import { buildSitemapXml } from '../src/shared/seo/sitemap.ts';

const outPath = 'dist/sitemap.xml';
mkdirSync('dist', { recursive: true });
writeFileSync(outPath, buildSitemapXml());
console.log(`Wrote ${outPath}`);
