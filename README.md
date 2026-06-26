# Img2Favicon

A privacy-first, browser-based image tool suite. Turn an image or a few letters into a complete favicon package — or resize, crop, convert, and more. Nothing leaves your device.

**44 tools** across five categories, all running locally in your browser.

## Features

### Create
- **Favicon kit** — image or text sources, ICO/SVG/PNG exports, ZIP download
- **App icon generator** — iOS/Android store sizes in a ZIP
- **Splash screen generator** — iOS/PWA startup images in a ZIP
- **Open Graph image** — social sharing presets (1200×630, etc.)
- **Placeholder generator** — labeled mockup PNGs
- **QR code generator** — PNG or SVG export

### Edit
- **Resize, crop, rotate, watermark, blur, remove background**
- **Trim transparent pixels** — auto-crop alpha padding around icons
- **Bulk resize & compress** — batch process images to ZIP
- **Palette extractor** — dominant colors with hex/CSS export
- **Padding & border** — add canvas padding before export
- **Rounded corners & mask** — circle, squircle, rounded rect
- **Adjust** — brightness, contrast, saturation
- **Grayscale & duotone** — creative two-color effects
- **Sharpen** — unsharp mask sharpening
- **Combine images** — horizontal, vertical, or grid collages
- **Seamless tile preview** — 2×2 texture repeat checker

### Convert
- **Format convert** — PNG, JPEG, WebP, AVIF
- **Image to Base64** / **Data URL to image** — encode and decode
- **SVG to PNG** — client-side rasterization
- **Sprite sheet builder** / **Split sprite sheet** — pack and unpack frames
- **GIF from frames** — animated GIF creator
- **PDF to image** / **Image to PDF** — local document conversion

### Web dev
- **Favicon checker** / **PWA icon checker** — validate icon kits
- **Maskable icon preview** — Android safe-zone overlay
- **Manifest builder** — site.webmanifest JSON
- **HTML snippet generator** — favicon install tags
- **WCAG contrast checker** — AA/AAA pass/fail
- **Social card preview** — Twitter/LinkedIn/Slack mockups
- **CSS filter playground** — preview and copy filter CSS
- **Image file inspector** — quick dimensions, MIME, alpha stats

### Privacy
- **Strip metadata** — remove EXIF on re-encode
- **Metadata viewer** — inspect EXIF before sharing
- **Screenshot sanitizer** — strip metadata + blur regions
- **Compare before/after** — quality/size comparison slider

- Live canvas preview with drag-to-reposition (favicon tool)
- Dark/light theme, categorized hub, tools dropdown nav
- SEO and GEO optimized for search engines and AI discovery

## Development

Requires [Bun](https://bun.sh).

```bash
bun install
bun run dev
bun run test
bun run build
bun run deploy
bun run preview
```

## Project structure

```
index.html              Hub page (generated with static tool links)
tools/*/index.html      Individual tool pages (generated)
public/                 Static assets (robots.txt, llms.txt, favicons, OG image)
scripts/                Page, sitemap, and asset generators
src/
  hub/                  Hub bootstrap
  shared/seo/           SEO/GEO config, head builder, sitemap, llms.txt
  shared/shell/         Shared header, tool page builders, nav
  shared/image/         Shared image processing libraries
  shared/web/           Manifest, favicon kit, HTML snippet utilities
  tools/                Tool-specific app code
dist/                   Production build output (after bun run build)
```

## Dependencies

- **jszip** — ZIP export for favicon/app icon/sprite kits
- **exifr** — metadata parsing (metadata viewer)
- **qrcode** — QR code generation
- **pdfjs-dist** — PDF rasterization (PDF to image)
- **jspdf** — PDF export (image to PDF)
- **gifenc** — animated GIF encoding
- **lucide** — icons

## SEO and GEO

- **SEO**: canonical URLs, Open Graph/Twitter meta, JSON-LD, `robots.txt`, and `sitemap.xml`
- **GEO**: `public/llms.txt` summarizes the suite for AI assistants
- Hub tool cards are rendered in static HTML at build time for crawler discoverability

Override the production URL when building:

```bash
SITE_URL=https://your-domain.example bun run build
```

## Deployment

CI runs `bun run deploy` (same as `bun run build`) and publishes the Vite output via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**Required GitHub Pages setting:** In the repo **Settings → Pages**, set **Source** to
**GitHub Actions** — not “Deploy from branch → main”. If Pages serves the `main` branch
root, visitors get unstyled HTML (no CSS) because that branch holds source files, not the
built `dist/` output.

**Site looks broken (blue links, no layout)?** Pages is pointing at the wrong source. Either:

1. **Recommended:** **Settings → Pages → Source → GitHub Actions**, then re-run the deploy
   workflow.
2. **Alternative:** **Deploy from branch → `gh-pages` → `/ (root)`** if you use the
   `gh-pages` branch workflow instead.

Live site: https://dor-j.github.io/Img2Favicon/

## License

See [LICENSE](LICENSE).
