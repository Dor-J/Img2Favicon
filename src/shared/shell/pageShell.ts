import { buildSeoContent } from '../seo/content';
import { buildSeoHead, escapeHtml } from '../seo/head';
import type { PageEntry } from '../seo/pages';

export const PAGE_META = `<meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark light" />
  <meta name="referrer" content="no-referrer" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'none'; object-src 'none'; connect-src 'none'; form-action 'none'; img-src 'self' blob: data:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; manifest-src 'self' blob:; worker-src 'none'" />`;

export const PAGE_FOOTER = `<footer class="footer">
      <span class="privacy"><i data-lucide="shield-check"></i> Private by design — image processing happens locally.</span>
      <span>Img2Favicon · built for modern web projects</span>
    </footer>`;

export const PAGE_TOAST = `<div class="toast" id="toast" role="status" aria-live="polite"><i data-lucide="check-circle-2"></i><span id="toastText">Done</span></div>`;

export const DROPZONE = `<label class="dropzone" id="dropzone" for="imageInput">
              <span class="upload-thumb"><img id="uploadThumb" alt="" /></span>
              <span class="upload-copy">
                <strong id="uploadTitle">Drop an image here or browse</strong>
                <span id="uploadSub">PNG, JPG, WebP, or GIF · up to 20 MB</span>
                <span class="browse-chip" aria-hidden="true">Choose image</span>
                <em id="uploadName"></em>
              </span>
              <i data-lucide="image-up" aria-hidden="true"></i>
              <input class="visually-hidden" id="imageInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
            </label>`;

export const FORMAT_CONTROLS = `<div class="field">
              <label for="formatSelect">Output format</label>
              <select id="formatSelect"></select>
            </div>
            <div class="field" id="qualityField">
              <label for="qualityRange">Quality</label>
              <div class="range-row">
                <input id="qualityRange" type="range" min="10" max="100" value="92" />
                <output class="range-value" id="qualityValue">92%</output>
              </div>
            </div>`;

/** Builds the outer HTML document shell for a tool page. */
export function buildPageDocument(options: {
  page: PageEntry;
  script: string;
  bodyContent: string;
}): string {
  const documentTitle = `${options.page.title} — Img2Favicon`;
  const seoHead = buildSeoHead({ page: options.page, documentTitle, assetPrefix: '../../' });
  const seoContent = buildSeoContent(options.page);

  return `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  ${PAGE_META}
  <meta name="description" content="${escapeHtml(options.page.seoDescription)}" />
  <title>${escapeHtml(documentTitle)}</title>
  ${seoHead}
</head>
<body>
  <div id="site-header"></div>
  <main class="shell tool-page">
    <section class="hero">
      <span class="eyebrow">Runs entirely in your browser</span>
      <h1>${escapeHtml(options.page.title)}</h1>
      <p>${escapeHtml(options.page.description)}</p>
    </section>
    ${options.bodyContent}
    ${seoContent}
    ${PAGE_FOOTER}
  </main>
  ${PAGE_TOAST}
  <script type="module" src="${options.script}"></script>
</body>
</html>`;
}
