import { escapeHtml } from '../seo/head';
import type { PageEntry } from '../seo/pages';
import { buildPageDocument } from './pageShell';

/** Builds a read-only report tool page for validation results. */
export function buildReportToolPage(options: {
  page: PageEntry;
  script: string;
  note?: string;
  accept?: string;
}): string {
  const accept =
    options.accept ??
    'image/png,image/jpeg,image/webp,image/gif,image/x-icon,image/svg+xml,.ico,.svg,.zip,application/zip';

  const bodyContent = `<div class="tool-layout tool-layout-single">
      <section class="panel">
        <div class="panel-head"><div><h2>Upload kit</h2><p>Drop favicon files or a ZIP to validate.</p></div></div>
        <section class="section">
          ${options.note ? `<p class="tool-note">${escapeHtml(options.note)}</p>` : ''}
          <label class="dropzone" id="dropzone" for="fileInput">
            <span class="upload-copy">
              <strong id="uploadTitle">Drop favicon files or ZIP here</strong>
              <span id="uploadSub">PNG, ICO, SVG, or ZIP archive</span>
              <span class="browse-chip" aria-hidden="true">Choose files</span>
            </span>
            <i data-lucide="folder-search" aria-hidden="true"></i>
            <input class="visually-hidden" id="fileInput" type="file" accept="${accept}" multiple />
          </label>
          <div class="report-panel" id="reportPanel">
            <p class="tool-meta">Upload files to see the validation report.</p>
          </div>
        </section>
      </section>
    </div>`;

  return buildPageDocument({ page: options.page, script: options.script, bodyContent });
}
