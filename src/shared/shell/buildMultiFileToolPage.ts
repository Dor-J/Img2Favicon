import { escapeHtml } from '../seo/head';
import type { PageEntry } from '../seo/pages';
import { buildPageDocument, FORMAT_CONTROLS } from './pageShell';

/** Builds a multi-file image tool page. */
export function buildMultiFileToolPage(options: {
  page: PageEntry;
  script: string;
  note?: string;
  extraControls?: string;
  showFormatControls?: boolean;
  primaryLabel?: string;
}): string {
  const primaryLabel = options.primaryLabel ?? 'Download';
  const formatBlock = options.showFormatControls === false ? '' : FORMAT_CONTROLS;

  const bodyContent = `<div class="tool-layout">
      <aside class="panel tool-controls">
        <div class="panel-head"><div><h2>Controls</h2></div></div>
        <section class="section">
          ${options.note ? `<p class="tool-note">${escapeHtml(options.note)}</p>` : ''}
          <div class="section-title"><span>Source files</span><button id="clearFiles" type="button">Clear all</button></div>
          <label class="dropzone" id="dropzone" for="fileInput">
            <span class="upload-copy">
              <strong id="uploadTitle">Drop images here or browse</strong>
              <span id="uploadSub">PNG, JPG, WebP, or GIF · multiple files</span>
              <span class="browse-chip" aria-hidden="true">Choose files</span>
            </span>
            <i data-lucide="images" aria-hidden="true"></i>
            <input class="visually-hidden" id="fileInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple />
          </label>
          <ul class="file-list" id="fileList"></ul>
          ${options.extraControls ?? ''}
          ${formatBlock}
          <button class="primary-button" id="downloadBtn" type="button" style="margin-top:16px">
            <i data-lucide="download"></i> ${escapeHtml(primaryLabel)}
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
          <p class="tool-meta" id="metaInfo">Add images to begin.</p>
        </div>
      </section>
    </div>`;

  return buildPageDocument({ page: options.page, script: options.script, bodyContent });
}
