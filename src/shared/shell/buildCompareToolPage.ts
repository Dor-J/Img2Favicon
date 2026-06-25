import type { PageEntry } from '../seo/pages';
import { buildPageDocument, DROPZONE } from './pageShell';

/** Builds a before/after comparison tool page with slider. */
export function buildCompareToolPage(options: {
  page: PageEntry;
  script: string;
  extraControls?: string;
}): string {
  const bodyContent = `<div class="tool-layout">
      <aside class="panel tool-controls">
        <div class="panel-head"><div><h2>Controls</h2></div></div>
        <section class="section">
          <div class="section-title"><span>Source image</span><button id="clearImage" type="button">Clear</button></div>
          ${DROPZONE}
          ${options.extraControls ?? ''}
        </section>
      </aside>
      <section class="panel">
        <div class="panel-head"><div><h2>Compare</h2><p>Drag the slider to compare original vs compressed.</p></div></div>
        <div class="preview-wrap section">
          <div class="tool-workspace">
            <div class="compare-wrap" id="compareWrap">
              <canvas id="afterCanvas" class="compare-canvas"></canvas>
              <div class="compare-before" id="compareBefore">
                <canvas id="beforeCanvas" class="compare-canvas"></canvas>
              </div>
              <div class="compare-handle" id="compareHandle" role="slider" aria-label="Compare slider" tabindex="0"></div>
            </div>
          </div>
          <p class="tool-meta" id="metaInfo">Upload an image to begin.</p>
        </div>
      </section>
    </div>`;

  return buildPageDocument({ page: options.page, script: options.script, bodyContent });
}
