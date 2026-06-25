import type { PageEntry } from '../seo/pages';
import { buildPageDocument } from './pageShell';

/** Builds a form-based tool page with controls and output panel. */
export function buildFormToolPage(options: {
  page: PageEntry;
  script: string;
  formControls: string;
  outputPanel?: string;
  primaryAction?: string;
}): string {
  const primaryAction =
    options.primaryAction ??
    `<button class="primary-button" id="primaryAction" type="button" style="margin-top:16px">
      <i data-lucide="download"></i> Download
    </button>`;

  const bodyContent = `<div class="tool-layout">
      <aside class="panel tool-controls">
        <div class="panel-head"><div><h2>Controls</h2></div></div>
        <section class="section">
          ${options.formControls}
          ${primaryAction}
        </section>
      </aside>
      <section class="panel">
        <div class="panel-head"><div><h2>Output</h2><p>Live preview before export.</p></div></div>
        <div class="preview-wrap section">
          ${options.outputPanel ?? '<div class="tool-workspace" id="outputWorkspace"></div>'}
        </div>
      </section>
    </div>`;

  return buildPageDocument({ page: options.page, script: options.script, bodyContent });
}
