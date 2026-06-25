import { escapeHtml } from '../seo/head';
import type { PageEntry } from '../seo/pages';
import { buildPageDocument, DROPZONE } from './pageShell';

/** Builds an image-in, text-out tool page with copy panel. */
export function buildOutputToolPage(options: {
  page: PageEntry;
  script: string;
  note?: string;
  extraControls?: string;
  accept?: string;
  uploadSub?: string;
}): string {
  const accept = options.accept ?? 'image/png,image/jpeg,image/webp,image/gif';
  const uploadSub = options.uploadSub ?? 'PNG, JPG, WebP, or GIF · up to 20 MB';
  const dropzone = DROPZONE.replace(
    'accept="image/png,image/jpeg,image/webp,image/gif"',
    `accept="${accept}"`,
  ).replace('PNG, JPG, WebP, or GIF · up to 20 MB', escapeHtml(uploadSub));

  const bodyContent = `<div class="tool-layout">
      <aside class="panel tool-controls">
        <div class="panel-head"><div><h2>Controls</h2></div></div>
        <section class="section">
          ${options.note ? `<p class="tool-note">${escapeHtml(options.note)}</p>` : ''}
          <div class="section-title"><span>Source image</span><button id="clearImage" type="button">Clear</button></div>
          ${dropzone}
          ${options.extraControls ?? ''}
        </section>
      </aside>
      <section class="panel">
        <div class="panel-head"><div><h2>Output</h2><p>Copy or inspect the result.</p></div></div>
        <div class="preview-wrap section">
          <div class="copy-panel">
            <textarea class="copy-output" id="outputText" readonly placeholder="Load a file to see output…"></textarea>
            <div class="button-row" style="margin-top:12px">
              <button class="primary-button" id="copyBtn" type="button"><i data-lucide="copy"></i> Copy</button>
            </div>
          </div>
          <p class="tool-meta" id="metaInfo">Upload a file to begin.</p>
        </div>
      </section>
    </div>`;

  return buildPageDocument({ page: options.page, script: options.script, bodyContent });
}
