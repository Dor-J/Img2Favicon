import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { buildToolPage } from '../src/shared/shell/buildToolPage.ts';
import { buildFormToolPage } from '../src/shared/shell/buildFormToolPage.ts';
import { buildOutputToolPage } from '../src/shared/shell/buildOutputToolPage.ts';
import { buildMultiFileToolPage } from '../src/shared/shell/buildMultiFileToolPage.ts';
import { buildCompareToolPage } from '../src/shared/shell/buildCompareToolPage.ts';
import { buildReportToolPage } from '../src/shared/shell/buildReportToolPage.ts';
import { getPageById } from '../src/shared/seo/pages.ts';
import { buildHubCardsHtml } from '../src/shared/seo/hubCards.ts';
import { buildSeoHead, escapeHtml } from '../src/shared/seo/head.ts';
import { buildSeoContent } from '../src/shared/seo/content.ts';
import { HUB_PAGE } from '../src/shared/seo/pages.ts';
import { buildLlmsTxt } from '../src/shared/seo/llms.ts';

type ToolBuild =
  | {
      id: string;
      type: 'standard';
      script: string;
      note?: string;
      extraControls?: string;
      downloadLabel?: string;
      hideFormatControls?: boolean;
      accept?: string;
      uploadSub?: string;
    }
  | { id: string; type: 'form'; script: string; formControls: string; outputPanel?: string; primaryAction?: string }
  | { id: string; type: 'output'; script: string; note?: string; extraControls?: string }
  | { id: string; type: 'multi'; script: string; note?: string; extraControls?: string; showFormatControls?: boolean; primaryLabel?: string }
  | { id: string; type: 'compare'; script: string; extraControls?: string }
  | { id: string; type: 'report'; script: string; note?: string };

const TOOL_BUILDS: ToolBuild[] = [
  {
    id: 'resize',
    type: 'standard',
    script: '/src/tools/resize/main.ts',
    extraControls: `<div class="field-grid two" style="margin-top:12px">
              <div class="field"><label for="maxWidth">Max width</label><input class="input" id="maxWidth" type="number" min="1" placeholder="Original" /></div>
              <div class="field"><label for="maxHeight">Max height</label><input class="input" id="maxHeight" type="number" min="1" placeholder="Original" /></div>
            </div>
            <div class="field" style="margin-top:12px"><label><input id="maintainAspect" type="checkbox" checked /> Maintain aspect ratio</label></div>
            <div class="field" style="margin-top:12px"><label for="targetKb">Target size (KB, optional)</label><input class="input" id="targetKb" type="number" min="1" placeholder="No limit" /></div>`,
  },
  {
    id: 'crop',
    type: 'standard',
    script: '/src/tools/crop/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label>Aspect ratio</label>
              <div class="segmented" id="ratioMode">
                <button class="active" type="button" data-ratio="free">Free</button>
                <button type="button" data-ratio="1:1">1:1</button>
                <button type="button" data-ratio="16:9">16:9</button>
                <button type="button" data-ratio="4:3">4:3</button>
                <button type="button" data-ratio="3:2">3:2</button>
              </div></div>`,
  },
  { id: 'convert', type: 'standard', script: '/src/tools/convert/main.ts' },
  {
    id: 'remove-bg',
    type: 'standard',
    script: '/src/tools/remove-bg/main.ts',
    note: 'Works best on solid or simple backgrounds. Click the preview to pick a key color.',
    extraControls: `<div class="field" style="margin-top:12px"><label for="toleranceRange">Tolerance</label>
              <div class="range-row"><input id="toleranceRange" type="range" min="0" max="100" value="24" /><output class="range-value" id="toleranceValue">24</output></div></div>
            <div class="field" style="margin-top:12px"><label for="featherRange">Edge feather</label>
              <div class="range-row"><input id="featherRange" type="range" min="0" max="30" value="6" /><output class="range-value" id="featherValue">6</output></div></div>
            <div class="field" style="margin-top:12px"><label>Key color</label><input class="color-input" id="keyColor" type="color" value="#ffffff" /></div>`,
  },
  {
    id: 'rotate',
    type: 'standard',
    script: '/src/tools/rotate/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label for="rotateRange">Rotation</label>
              <div class="range-row"><input id="rotateRange" type="range" min="-180" max="180" value="0" /><output class="range-value" id="rotateValue">0°</output></div></div>
            <div class="field" style="margin-top:12px"><label for="straightenRange">Straighten</label>
              <div class="range-row"><input id="straightenRange" type="range" min="-10" max="10" value="0" /><output class="range-value" id="straightenValue">0°</output></div></div>
            <div class="button-row" style="margin-top:12px">
              <button class="minor-button" id="flipH" type="button"><i data-lucide="flip-horizontal"></i> Flip H</button>
              <button class="minor-button" id="flipV" type="button"><i data-lucide="flip-vertical"></i> Flip V</button>
            </div>`,
  },
  {
    id: 'watermark',
    type: 'standard',
    script: '/src/tools/watermark/main.ts',
    extraControls: `<div class="segmented" id="wmMode" style="margin-bottom:12px">
              <button class="active" type="button" data-mode="text">Text</button><button type="button" data-mode="logo">Logo</button></div>
            <div id="textControls">
              <div class="field"><label for="wmText">Text</label><input class="input" id="wmText" value="© Your Name" /></div>
              <div class="field" style="margin-top:12px"><label for="wmFontSize">Font size</label><input class="input" id="wmFontSize" type="number" min="8" max="200" value="32" /></div>
              <div class="field" style="margin-top:12px"><label for="wmColor">Color</label><input class="color-input" id="wmColor" type="color" value="#ffffff" /></div>
            </div>
            <div id="logoControls" class="hide">
              <div class="field"><label for="logoInput">Logo PNG</label><input class="input" id="logoInput" type="file" accept="image/png,image/webp" /></div>
              <div class="field" style="margin-top:12px"><label for="logoScale">Scale</label><div class="range-row"><input id="logoScale" type="range" min="5" max="100" value="25" /><output class="range-value" id="logoScaleValue">25%</output></div></div>
            </div>
            <div class="field" style="margin-top:12px"><label for="wmPosition">Position</label>
              <select id="wmPosition"><option value="bottom-right">Bottom right</option><option value="bottom-center">Bottom center</option><option value="bottom-left">Bottom left</option>
              <option value="center">Center</option><option value="top-right">Top right</option><option value="top-center">Top center</option><option value="top-left">Top left</option></select></div>
            <div class="field" style="margin-top:12px"><label for="wmOpacity">Opacity</label><div class="range-row"><input id="wmOpacity" type="range" min="5" max="100" value="70" /><output class="range-value" id="wmOpacityValue">70%</output></div></div>`,
  },
  {
    id: 'blur',
    type: 'standard',
    script: '/src/tools/blur/main.ts',
    extraControls: `<div class="segmented" id="effectMode" style="margin-bottom:12px">
              <button class="active" type="button" data-mode="blur">Blur</button><button type="button" data-mode="pixelate">Pixelate</button></div>
            <div class="field"><label for="intensityRange">Intensity</label><div class="range-row"><input id="intensityRange" type="range" min="2" max="40" value="12" /><output class="range-value" id="intensityValue">12</output></div></div>
            <p class="tool-note" style="margin-top:12px">Drag on the preview to add a redaction region.</p>
            <button class="minor-button" id="clearRegions" type="button" style="margin-top:8px">Clear regions</button>`,
  },
  {
    id: 'strip-metadata',
    type: 'standard',
    script: '/src/tools/strip-metadata/main.ts',
    note: 'Your camera GPS, device info, and timestamps are not included in the export.',
  },
  {
    id: 'og-image',
    type: 'standard',
    script: '/src/tools/og-image/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label>Preset</label>
              <div class="segmented" id="presetMode">
                <button class="active" type="button" data-preset="1200x630">1200×630</button>
                <button type="button" data-preset="1200x600">1200×600</button>
                <button type="button" data-preset="1200x1200">1:1</button>
                <button type="button" data-preset="1500x500">Twitter</button>
              </div></div>
            <div class="field" style="margin-top:12px"><label>Fit mode</label>
              <div class="segmented" id="fitMode">
                <button class="active" type="button" data-fit="cover">Cover</button>
                <button type="button" data-fit="contain">Contain</button>
              </div></div>
            <div class="field hide" style="margin-top:12px"><label for="bgColor">Letterbox color</label><input class="color-input" id="bgColor" type="color" value="#000000" /></div>`,
  },
  {
    id: 'app-icon',
    type: 'standard',
    script: '/src/tools/app-icon/main.ts',
    downloadLabel: 'Download ZIP kit',
    extraControls: `<div class="field" style="margin-top:12px"><label>Fit mode</label>
              <div class="segmented" id="fitMode">
                <button class="active" type="button" data-fit="cover">Cover</button>
                <button type="button" data-fit="contain">Contain</button>
              </div></div>
            <div class="field" style="margin-top:12px"><label for="bgColor">Background</label><input class="color-input" id="bgColor" type="color" value="#ffffff" /></div>`,
    hideFormatControls: true,
  },
  {
    id: 'placeholder',
    type: 'form',
    script: '/src/tools/placeholder/main.ts',
    formControls: `<div class="field-grid two">
              <div class="field"><label for="widthInput">Width</label><input class="input" id="widthInput" type="number" min="1" value="400" /></div>
              <div class="field"><label for="heightInput">Height</label><input class="input" id="heightInput" type="number" min="1" value="300" /></div>
            </div>
            <div class="field" style="margin-top:12px"><label for="bgColorInput">Background</label><input class="color-input" id="bgColorInput" type="color" value="#cccccc" /></div>
            <div class="field" style="margin-top:12px"><label for="textColorInput">Text color</label><input class="color-input" id="textColorInput" type="color" value="#333333" /></div>
            <div class="field" style="margin-top:12px"><label for="labelInput">Label (optional)</label><input class="input" id="labelInput" placeholder="400 × 300" /></div>`,
    outputPanel: `<div class="tool-workspace"><canvas id="previewCanvas" class="tool-preview-canvas"></canvas></div>`,
  },
  {
    id: 'qr-code',
    type: 'form',
    script: '/src/tools/qr-code/main.ts',
    formControls: `<div class="field"><label for="qrText">URL or text</label><textarea class="copy-output" id="qrText" rows="3" placeholder="https://example.com">https://example.com</textarea></div>
            <div class="field-grid two" style="margin-top:12px">
              <div class="field"><label for="qrSize">Size (px)</label><input class="input" id="qrSize" type="number" min="128" max="1024" value="256" /></div>
              <div class="field"><label for="qrEc">Error correction</label><select id="qrEc"><option value="L">L</option><option value="M" selected>M</option><option value="Q">Q</option><option value="H">H</option></select></div>
            </div>
            <div class="field" style="margin-top:12px"><label for="qrFormat">Format</label><select id="qrFormat"><option value="png">PNG</option><option value="svg">SVG</option></select></div>`,
    outputPanel: `<div class="tool-workspace"><canvas id="previewCanvas" class="tool-preview-canvas"></canvas></div>`,
  },
  {
    id: 'html-snippet',
    type: 'form',
    script: '/src/tools/html-snippet/main.ts',
    formControls: `<div class="field"><label for="themeColor">Theme color</label><input class="color-input" id="themeColor" type="color" value="#ffffff" /></div>
            <div class="field" style="margin-top:12px"><label for="faviconIco">favicon.ico path</label><input class="input" id="faviconIco" value="/favicon.ico" /></div>
            <div class="field" style="margin-top:12px"><label for="faviconSvg">favicon.svg path</label><input class="input" id="faviconSvg" value="/favicon.svg" /></div>
            <div class="field" style="margin-top:12px"><label for="favicon32">32×32 PNG path</label><input class="input" id="favicon32" value="/favicon-32x32.png" /></div>
            <div class="field" style="margin-top:12px"><label for="appleTouch">Apple touch icon path</label><input class="input" id="appleTouch" value="/apple-touch-icon.png" /></div>
            <div class="field" style="margin-top:12px"><label for="manifestPath">Manifest path</label><input class="input" id="manifestPath" value="/site.webmanifest" /></div>
            <button class="primary-button" id="copyBtn" type="button" style="margin-top:16px"><i data-lucide="copy"></i> Copy snippet</button>`,
    outputPanel: `<textarea class="copy-output" id="outputText" readonly></textarea>`,
    primaryAction: '',
  },
  {
    id: 'manifest-builder',
    type: 'form',
    script: '/src/tools/manifest-builder/main.ts',
    formControls: `<div class="field"><label for="appName">Name</label><input class="input" id="appName" value="Your Website" /></div>
            <div class="field" style="margin-top:12px"><label for="shortName">Short name</label><input class="input" id="shortName" value="Website" /></div>
            <div class="field-grid two" style="margin-top:12px">
              <div class="field"><label for="themeColor">Theme color</label><input class="color-input" id="themeColor" type="color" value="#ffffff" /></div>
              <div class="field"><label for="bgColor">Background</label><input class="color-input" id="bgColor" type="color" value="#ffffff" /></div>
            </div>
            <div class="field" style="margin-top:12px"><label for="displayMode">Display</label><select id="displayMode"><option value="standalone">standalone</option><option value="fullscreen">fullscreen</option><option value="minimal-ui">minimal-ui</option><option value="browser">browser</option></select></div>
            <div class="field" style="margin-top:12px"><label for="icon192">192×192 icon path</label><input class="input" id="icon192" value="/android-chrome-192.png" /></div>
            <div class="field" style="margin-top:12px"><label for="icon512">512×512 icon path</label><input class="input" id="icon512" value="/android-chrome-512.png" /></div>
            <div class="button-row" style="margin-top:16px">
              <button class="primary-button" id="copyBtn" type="button"><i data-lucide="copy"></i> Copy</button>
              <button class="minor-button" id="downloadBtn" type="button"><i data-lucide="download"></i> Download</button>
            </div>`,
    outputPanel: `<textarea class="copy-output" id="outputText" readonly></textarea>`,
    primaryAction: '',
  },
  {
    id: 'base64',
    type: 'output',
    script: '/src/tools/base64/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label><input id="includePrefix" type="checkbox" checked /> Include data: prefix</label></div>`,
  },
  {
    id: 'metadata-viewer',
    type: 'output',
    script: '/src/tools/metadata-viewer/main.ts',
  },
  {
    id: 'palette',
    type: 'standard',
    script: '/src/tools/palette/main.ts',
    hideFormatControls: true,
    extraControls: `<div class="button-row" style="margin-top:12px">
              <button class="minor-button" id="copyHexBtn" type="button"><i data-lucide="copy"></i> Copy hex</button>
              <button class="minor-button" id="copyCssBtn" type="button"><i data-lucide="copy"></i> Copy CSS vars</button>
            </div>
            <div class="palette-swatches" id="swatches"></div>`,
    downloadLabel: 'Download preview',
  },
  {
    id: 'adjust',
    type: 'standard',
    script: '/src/tools/adjust/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label for="brightnessRange">Brightness</label><div class="range-row"><input id="brightnessRange" type="range" min="-100" max="100" value="0" /><output class="range-value" id="brightnessValue">0</output></div></div>
            <div class="field" style="margin-top:12px"><label for="contrastRange">Contrast</label><div class="range-row"><input id="contrastRange" type="range" min="-100" max="100" value="0" /><output class="range-value" id="contrastValue">0</output></div></div>
            <div class="field" style="margin-top:12px"><label for="saturationRange">Saturation</label><div class="range-row"><input id="saturationRange" type="range" min="-100" max="100" value="0" /><output class="range-value" id="saturationValue">0</output></div></div>`,
  },
  {
    id: 'padding',
    type: 'standard',
    script: '/src/tools/padding/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label for="padAll">Padding (px)</label><input class="input" id="padAll" type="number" min="0" value="32" /></div>
            <div class="field" style="margin-top:12px"><label><input id="bgTransparent" type="checkbox" /> Transparent background</label></div>
            <div class="field" style="margin-top:12px"><label for="bgColor">Background color</label><input class="color-input" id="bgColor" type="color" value="#ffffff" /></div>
            <div class="field-grid two" style="margin-top:12px">
              <div class="field"><label for="borderWidth">Border (px)</label><input class="input" id="borderWidth" type="number" min="0" value="0" /></div>
              <div class="field"><label for="borderColor">Border color</label><input class="color-input" id="borderColor" type="color" value="#000000" /></div>
            </div>`,
  },
  {
    id: 'mask',
    type: 'standard',
    script: '/src/tools/mask/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label>Shape</label>
              <div class="segmented" id="shapeMode">
                <button class="active" type="button" data-shape="rounded">Rounded</button>
                <button type="button" data-shape="circle">Circle</button>
                <button type="button" data-shape="squircle">Squircle</button>
              </div></div>
            <div class="field" style="margin-top:12px"><label for="radiusRange">Corner radius</label><div class="range-row"><input id="radiusRange" type="range" min="0" max="50" value="19" /><output class="range-value" id="radiusValue">19%</output></div></div>`,
  },
  {
    id: 'svg-to-png',
    type: 'standard',
    script: '/src/tools/svg-to-png/main.ts',
    accept: 'image/svg+xml,.svg',
    uploadSub: 'SVG file · up to 20 MB',
    hideFormatControls: true,
    extraControls: `<div class="field-grid two" style="margin-top:12px">
              <div class="field"><label for="outWidth">Width</label><input class="input" id="outWidth" type="number" min="1" value="512" /></div>
              <div class="field"><label for="outHeight">Height</label><input class="input" id="outHeight" type="number" min="1" value="512" /></div>
            </div>`,
  },
  {
    id: 'combine',
    type: 'multi',
    script: '/src/tools/combine/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label>Layout</label>
              <div class="segmented" id="layoutMode">
                <button class="active" type="button" data-layout="horizontal">Horizontal</button>
                <button type="button" data-layout="vertical">Vertical</button>
                <button type="button" data-layout="grid">Grid</button>
              </div></div>
            <div class="field-grid two" style="margin-top:12px">
              <div class="field"><label for="gapInput">Gap (px)</label><input class="input" id="gapInput" type="number" min="0" value="8" /></div>
              <div class="field hide"><label for="gridCols">Grid columns</label><input class="input" id="gridCols" type="number" min="1" value="2" /></div>
            </div>
            <div class="field" style="margin-top:12px"><label for="bgColor">Background</label><input class="color-input" id="bgColor" type="color" value="#000000" /></div>`,
  },
  {
    id: 'sprite-sheet',
    type: 'multi',
    script: '/src/tools/sprite-sheet/main.ts',
    showFormatControls: false,
    primaryLabel: 'Download ZIP',
    extraControls: `<div class="field-grid two" style="margin-top:12px">
              <div class="field"><label for="colsInput">Columns</label><input class="input" id="colsInput" type="number" min="1" value="4" /></div>
              <div class="field"><label for="padInput">Padding</label><input class="input" id="padInput" type="number" min="0" value="0" /></div>
            </div>
            <div class="field" style="margin-top:12px"><label><input id="uniformCells" type="checkbox" checked /> Uniform cell size</label></div>
            <button class="minor-button" id="copyCssBtn" type="button" style="margin-top:12px"><i data-lucide="copy"></i> Copy CSS</button>`,
  },
  {
    id: 'favicon-checker',
    type: 'report',
    script: '/src/tools/favicon-checker/main.ts',
    note: 'Drop individual PNG/ICO/SVG files or a ZIP of your favicon kit.',
  },
  {
    id: 'screenshot-sanitizer',
    type: 'standard',
    script: '/src/tools/screenshot-sanitizer/main.ts',
    downloadLabel: 'Download sanitized',
    note: 'Metadata is removed on export. Drag on the preview to blur sensitive regions.',
    extraControls: `<div class="field"><label for="intensityRange">Blur intensity</label><div class="range-row"><input id="intensityRange" type="range" min="2" max="40" value="12" /><output class="range-value" id="intensityValue">12</output></div></div>
            <button class="minor-button" id="clearRegions" type="button" style="margin-top:8px">Clear regions</button>`,
  },
  {
    id: 'compare',
    type: 'compare',
    script: '/src/tools/compare/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label for="formatSelect">Format</label><select id="formatSelect"><option value="jpeg">JPEG</option><option value="webp">WebP</option></select></div>
            <div class="field" style="margin-top:12px"><label for="qualityRange">Quality</label><div class="range-row"><input id="qualityRange" type="range" min="10" max="100" value="75" /><output class="range-value" id="qualityValue">75%</output></div></div>`,
  },
  { id: 'trim-alpha', type: 'standard', script: '/src/tools/trim-alpha/main.ts', note: 'Best for PNG/WebP logos with transparent backgrounds.' },
  {
    id: 'dataurl-decode',
    type: 'form',
    script: '/src/tools/dataurl-decode/main.ts',
    formControls: `<div class="field"><label for="dataUrlInput">Data URL or Base64</label><textarea class="copy-output" id="dataUrlInput" rows="5" placeholder="data:image/png;base64,..."></textarea></div>
            <div class="button-row" style="margin-top:16px"><button class="primary-button" id="downloadPng" type="button"><i data-lucide="download"></i> PNG</button><button class="minor-button" id="downloadJpg" type="button"><i data-lucide="download"></i> JPG</button></div>`,
    outputPanel: `<div class="tool-workspace"><canvas id="previewCanvas" class="tool-preview-canvas"></canvas></div><p class="tool-meta" id="metaInfo">Paste a data URL to decode.</p>`,
    primaryAction: '',
  },
  {
    id: 'bulk-resize',
    type: 'multi',
    script: '/src/tools/bulk-resize/main.ts',
    primaryLabel: 'Download ZIP',
    extraControls: `<div class="field-grid two" style="margin-top:12px">
              <div class="field"><label for="maxWidth">Max width</label><input class="input" id="maxWidth" type="number" min="1" placeholder="Original" /></div>
              <div class="field"><label for="maxHeight">Max height</label><input class="input" id="maxHeight" type="number" min="1" placeholder="Original" /></div>
            </div>
            <div class="field" style="margin-top:12px"><label><input id="maintainAspect" type="checkbox" checked /> Maintain aspect ratio</label></div>`,
  },
  {
    id: 'splash-screen',
    type: 'standard',
    script: '/src/tools/splash-screen/main.ts',
    downloadLabel: 'Download ZIP kit',
    hideFormatControls: true,
    extraControls: `<div class="field" style="margin-top:12px"><label>Fit mode</label><div class="segmented" id="fitMode"><button class="active" type="button" data-fit="cover">Cover</button><button type="button" data-fit="contain">Contain</button></div></div>
            <div class="field" style="margin-top:12px"><label for="bgColor">Background</label><input class="color-input" id="bgColor" type="color" value="#ffffff" /></div>`,
  },
  {
    id: 'maskable-preview',
    type: 'standard',
    script: '/src/tools/maskable-preview/main.ts',
    hideFormatControls: true,
    downloadLabel: 'Download preview PNG',
    extraControls: `<div class="field" style="margin-top:12px"><label>Clip preview</label><div class="segmented" id="clipMode"><button class="active" type="button" data-clip="none">Full</button><button type="button" data-clip="circle">Circle</button><button type="button" data-clip="squircle">Squircle</button></div></div>
            <div class="field" style="margin-top:12px"><label><input id="showSafeZone" type="checkbox" checked /> Show safe zone</label></div>
            <div class="field" style="margin-top:8px"><label><input id="showCircle" type="checkbox" checked /> Show circle mask</label></div>`,
  },
  {
    id: 'duotone',
    type: 'standard',
    script: '/src/tools/duotone/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label>Mode</label><div class="segmented" id="duotoneMode"><button class="active" type="button" data-mode="grayscale">Grayscale</button><button type="button" data-mode="duotone">Duotone</button></div></div>
            <div id="duotoneColors" class="hide"><div class="field-grid two" style="margin-top:12px"><div class="field"><label for="shadowColor">Shadow</label><input class="color-input" id="shadowColor" type="color" value="#1a1a2e" /></div><div class="field"><label for="highlightColor">Highlight</label><input class="color-input" id="highlightColor" type="color" value="#e94560" /></div></div></div>`,
  },
  {
    id: 'contrast-checker',
    type: 'form',
    script: '/src/tools/contrast-checker/main.ts',
    formControls: `<div class="field-grid two"><div class="field"><label for="fgColor">Foreground</label><input class="color-input" id="fgColor" type="color" value="#ffffff" /></div><div class="field"><label for="bgColor">Background</label><input class="color-input" id="bgColor" type="color" value="#ff5a1f" /></div></div>
            <button class="primary-button" id="copyRatio" type="button" style="margin-top:16px"><i data-lucide="copy"></i> Copy ratio</button>`,
    outputPanel: `<div id="contrastSwatch" class="contrast-swatch">Sample text Aa</div><div id="contrastResult" class="contrast-result"></div>`,
    primaryAction: '',
  },
  {
    id: 'social-card',
    type: 'form',
    script: '/src/tools/social-card/main.ts',
    formControls: `<div class="field"><label for="cardTitle">Title</label><input class="input" id="cardTitle" value="Your page title" /></div>
            <div class="field" style="margin-top:12px"><label for="cardDesc">Description</label><textarea class="copy-output" id="cardDesc" rows="2">A short description for the link preview.</textarea></div>
            <div class="field" style="margin-top:12px"><label for="cardDomain">Domain</label><input class="input" id="cardDomain" value="example.com" /></div>
            <div class="field" style="margin-top:12px"><label for="cardImage">OG image</label><input class="input" id="cardImage" type="file" accept="image/png,image/jpeg,image/webp" /></div>
            <div class="field" style="margin-top:12px"><label>Platform</label><div class="segmented" id="platformMode"><button class="active" type="button" data-platform="twitter">Twitter/X</button><button type="button" data-platform="linkedin">LinkedIn</button><button type="button" data-platform="slack">Slack</button></div></div>
            <button class="primary-button" id="downloadBtn" type="button" style="margin-top:16px"><i data-lucide="download"></i> Download preview</button>`,
    outputPanel: `<div class="tool-workspace"><canvas id="previewCanvas" class="tool-preview-canvas"></canvas></div>`,
    primaryAction: '',
  },
  { id: 'icon-checker', type: 'report', script: '/src/tools/icon-checker/main.ts', note: 'Drop PWA or Apple touch icon PNGs, or a ZIP archive.' },
  { id: 'file-inspector', type: 'output', script: '/src/tools/file-inspector/main.ts', note: 'Quick file stats without full EXIF parsing.' },
  {
    id: 'css-filters',
    type: 'standard',
    script: '/src/tools/css-filters/main.ts',
    hideFormatControls: true,
    downloadLabel: 'Download preview',
    extraControls: `<div class="field"><label for="blurRange">blur()</label><div class="range-row"><input id="blurRange" type="range" min="0" max="20" value="0" /><output id="blurValue" class="range-value">0</output></div></div>
            <div class="field" style="margin-top:8px"><label for="brightnessRange">brightness()</label><div class="range-row"><input id="brightnessRange" type="range" min="0" max="200" value="100" /><output id="brightnessValue" class="range-value">100</output></div></div>
            <div class="field" style="margin-top:8px"><label for="contrastRange">contrast()</label><div class="range-row"><input id="contrastRange" type="range" min="0" max="200" value="100" /><output id="contrastValue" class="range-value">100</output></div></div>
            <div class="field" style="margin-top:8px"><label for="grayscaleRange">grayscale()</label><div class="range-row"><input id="grayscaleRange" type="range" min="0" max="100" value="0" /><output id="grayscaleValue" class="range-value">0</output></div></div>
            <div class="field" style="margin-top:8px"><label for="saturateRange">saturate()</label><div class="range-row"><input id="saturateRange" type="range" min="0" max="200" value="100" /><output id="saturateValue" class="range-value">100</output></div></div>
            <div class="field" style="margin-top:8px"><label for="sepiaRange">sepia()</label><div class="range-row"><input id="sepiaRange" type="range" min="0" max="100" value="0" /><output id="sepiaValue" class="range-value">0</output></div></div>
            <div class="field" style="margin-top:8px"><label for="hueRotateRange">hue-rotate()</label><div class="range-row"><input id="hueRotateRange" type="range" min="0" max="360" value="0" /><output id="hueRotateValue" class="range-value">0</output></div></div>
            <div class="field" style="margin-top:8px"><label for="invertRange">invert()</label><div class="range-row"><input id="invertRange" type="range" min="0" max="100" value="0" /><output id="invertValue" class="range-value">0</output></div></div>
            <textarea class="copy-output" id="filterOutput" readonly style="margin-top:12px;min-height:60px"></textarea>
            <button class="minor-button" id="copyBtn" type="button" style="margin-top:8px"><i data-lucide="copy"></i> Copy CSS</button>`,
  },
  {
    id: 'split-image',
    type: 'standard',
    script: '/src/tools/split-image/main.ts',
    downloadLabel: 'Download frames ZIP',
    hideFormatControls: false,
    extraControls: `<div class="field-grid two" style="margin-top:12px"><div class="field"><label for="cellWidth">Cell width</label><input class="input" id="cellWidth" type="number" min="1" value="32" /></div><div class="field"><label for="cellHeight">Cell height</label><input class="input" id="cellHeight" type="number" min="1" value="32" /></div></div>
            <div class="field" style="margin-top:12px"><label for="padInput">Padding</label><input class="input" id="padInput" type="number" min="0" value="0" /></div>`,
  },
  {
    id: 'gif-maker',
    type: 'multi',
    script: '/src/tools/gif-maker/main.ts',
    showFormatControls: false,
    primaryLabel: 'Download GIF',
    extraControls: `<div class="field-grid two" style="margin-top:12px"><div class="field"><label for="delayInput">Frame delay (ms)</label><input class="input" id="delayInput" type="number" min="20" value="100" /></div><div class="field"><label><input id="loopInput" type="checkbox" checked /> Loop forever</label></div></div>`,
  },
  {
    id: 'pdf-to-image',
    type: 'standard',
    script: '/src/tools/pdf-to-image/main.ts',
    hideFormatControls: true,
    downloadLabel: 'Download preview',
    accept: 'application/pdf,.pdf',
    uploadSub: 'PDF file · up to 20 MB',
    extraControls: `<div class="field" style="margin-top:12px"><label for="scaleInput">Scale</label><input class="input" id="scaleInput" type="number" min="0.5" max="4" step="0.1" value="1.5" /></div>
            <div class="field" style="margin-top:12px"><label><input id="allPages" type="checkbox" /> Export all pages as ZIP</label></div>`,
  },
  { id: 'image-to-pdf', type: 'standard', script: '/src/tools/image-to-pdf/main.ts', hideFormatControls: true, downloadLabel: 'Download PDF' },
  {
    id: 'sharpen',
    type: 'standard',
    script: '/src/tools/sharpen/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label for="amountRange">Amount</label><div class="range-row"><input id="amountRange" type="range" min="0" max="200" value="80" /><output class="range-value" id="amountValue">80</output></div></div>
            <div class="field" style="margin-top:12px"><label for="radiusRange">Radius</label><div class="range-row"><input id="radiusRange" type="range" min="1" max="10" value="2" /><output class="range-value" id="radiusValue">2</output></div></div>`,
  },
  {
    id: 'tile-preview',
    type: 'standard',
    script: '/src/tools/tile-preview/main.ts',
    extraControls: `<div class="field" style="margin-top:12px"><label for="repeatsInput">Tile repeats</label><input class="input" id="repeatsInput" type="number" min="2" max="4" value="2" /></div>`,
  },
];

function buildPage(build: ToolBuild): string {
  const page = getPageById(build.id);
  if (!page) throw new Error(`Missing page registry entry for ${build.id}`);

  switch (build.type) {
    case 'standard':
      return buildToolPage({
        page,
        script: build.script,
        note: build.note,
        extraControls: build.extraControls,
        downloadLabel: build.downloadLabel,
        hideFormatControls: build.hideFormatControls,
        accept: build.accept,
        uploadSub: build.uploadSub,
      });
    case 'form':
      return buildFormToolPage({
        page,
        script: build.script,
        formControls: build.formControls,
        outputPanel: build.outputPanel,
        primaryAction: build.primaryAction,
      });
    case 'output':
      return buildOutputToolPage({
        page,
        script: build.script,
        note: build.note,
        extraControls: build.extraControls,
      });
    case 'multi':
      return buildMultiFileToolPage({
        page,
        script: build.script,
        note: build.note,
        extraControls: build.extraControls,
        showFormatControls: build.showFormatControls,
        primaryLabel: build.primaryLabel,
      });
    case 'compare':
      return buildCompareToolPage({ page, script: build.script, extraControls: build.extraControls });
    case 'report':
      return buildReportToolPage({ page, script: build.script, note: build.note });
    default:
      throw new Error(`Unknown build type for ${build.id}`);
  }
}

for (const build of TOOL_BUILDS) {
  const page = getPageById(build.id);
  if (!page) throw new Error(`Missing page registry entry for ${build.id}`);
  mkdirSync(page.path.replace(/\/[^/]+$/, ''), { recursive: true });
  writeFileSync(page.path, buildPage(build));
}

const hubCards = buildHubCardsHtml('./');
const hubDocumentTitle = `Img2Favicon — ${HUB_PAGE.title}`;
const hubSeoHead = buildSeoHead({ page: HUB_PAGE, documentTitle: hubDocumentTitle, assetPrefix: './' });
const hubSeoContent = buildSeoContent(HUB_PAGE);

const hubHtml = `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${escapeHtml(HUB_PAGE.seoDescription)}" />
  <meta name="color-scheme" content="dark light" />
  <meta name="referrer" content="no-referrer" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'none'; object-src 'none'; connect-src 'none'; form-action 'none'; img-src 'self' blob: data:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; manifest-src 'self' blob:; worker-src 'none'" />
  <title>${escapeHtml(hubDocumentTitle)}</title>
  ${hubSeoHead}
</head>
<body>
  <div id="site-header"></div>
  <main class="shell">
    <section class="hero">
      <span class="eyebrow">Runs entirely in your browser</span>
      <h1>Private browser image tools.</h1>
      <p>${escapeHtml(HUB_PAGE.description)}</p>
    </section>
    <div class="hub-categories" id="hubGrid" aria-label="Tools">
      <!-- hub-grid-start -->
      ${hubCards}
      <!-- hub-grid-end -->
    </div>
    ${hubSeoContent}
    <footer class="footer">
      <span class="privacy"><i data-lucide="shield-check"></i> Private by design — image processing happens locally.</span>
      <span>Img2Favicon · built for modern web projects</span>
    </footer>
  </main>
  <script type="module" src="/src/hub/main.ts"></script>
</body>
</html>
`;

writeFileSync('index.html', hubHtml);

const faviconPage = getPageById('favicon');
if (faviconPage) {
  const faviconPath = faviconPage.path;
  let faviconHtml = readFileSync(faviconPath, 'utf8');
  const faviconTitle = `Img2Favicon — ${faviconPage.title}`;
  const faviconSeoHead = buildSeoHead({
    page: faviconPage,
    documentTitle: faviconTitle,
    assetPrefix: '../../',
  });
  const faviconSeoContent = buildSeoContent(faviconPage);

  faviconHtml = faviconHtml.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${escapeHtml(faviconPage.seoDescription)}" />`,
  );
  faviconHtml = faviconHtml.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(faviconTitle)}</title>\n  ${faviconSeoHead}`,
  );
  faviconHtml = faviconHtml.replace(
    /\n    <footer class="footer">/,
    `\n    ${faviconSeoContent}\n    <footer class="footer">`,
  );
  writeFileSync(faviconPath, faviconHtml);
}

mkdirSync('public', { recursive: true });
writeFileSync('public/llms.txt', buildLlmsTxt());

console.log(`Generated ${TOOL_BUILDS.length} tool pages and updated hub.`);
