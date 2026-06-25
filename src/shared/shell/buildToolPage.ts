import type { PageEntry } from '../seo/pages';
import {
  buildPageDocument,
  DROPZONE,
  FORMAT_CONTROLS,
} from './pageShell';

/** Builds a standard image tool HTML page. */
export function buildToolPage(options: {
  page: PageEntry;
  script: string;
  note?: string;
  extraControls?: string;
  downloadLabel?: string;
  hideFormatControls?: boolean;
  accept?: string;
  uploadSub?: string;
}): string {
  const downloadLabel = options.downloadLabel ?? 'Download';
  let dropzone = DROPZONE;
  if (options.accept) {
    dropzone = dropzone.replace(
      'accept="image/png,image/jpeg,image/webp,image/gif"',
      `accept="${options.accept}"`,
    );
  }
  if (options.uploadSub) {
    dropzone = dropzone.replace('PNG, JPG, WebP, or GIF · up to 20 MB', options.uploadSub);
  }

  const bodyContent = `<div class="tool-layout">
      <aside class="panel tool-controls">
        <div class="panel-head"><div><h2>Controls</h2></div></div>
        <section class="section">
          ${options.note ? `<p class="tool-note">${options.note}</p>` : ''}
          <div class="section-title"><span>Source image</span><button id="clearImage" type="button">Clear</button></div>
          ${dropzone}
          ${options.extraControls ?? ''}
          ${options.hideFormatControls ? '' : FORMAT_CONTROLS}
          <button class="primary-button" id="downloadBtn" type="button" style="margin-top:16px">
            <i data-lucide="download"></i> ${downloadLabel}
          </button>
        </section>
      </aside>
      <section class="panel">
        <div class="panel-head"><div><h2>Preview</h2><p>Live result before download.</p></div></div>
        <div class="preview-wrap section">
          <div class="tool-workspace">
            <div class="tool-preview-wrap" id="previewWrap">
              <canvas id="previewCanvas" class="tool-preview-canvas"></canvas>
            </div>
          </div>
          <p class="tool-meta" id="metaInfo">Upload an image to begin.</p>
        </div>
      </section>
    </div>`;

  return buildPageDocument({ page: options.page, script: options.script, bodyContent });
}
