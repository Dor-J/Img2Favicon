import JSZip from 'jszip';
import { initShell } from '../../shared/shell/initShell';
import { buildSpriteSheet } from '../../shared/image/spriteSheet';
import { bindMultiFileDrop } from '../../shared/ui/multiFileDrop';
import { copyText, downloadBlob } from '../../shared/image/encode';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let frames: HTMLCanvasElement[] = [];
let lastCss = '';

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const colsInput = $<HTMLInputElement>('#colsInput');
const padInput = $<HTMLInputElement>('#padInput');
const uniformInput = $<HTMLInputElement>('#uniformCells');

function buildFrames(items: { url: string; width: number; height: number }[]): Promise<HTMLCanvasElement[]> {
  return Promise.all(items.map((item) => canvasFromUrl(item.url, item.width, item.height)));
}

function canvasFromUrl(url: string, width: number, height: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function renderPreview(): void {
  if (!frames.length) {
    metaEl.textContent = 'Add frame images to begin.';
    return;
  }
  const result = buildSpriteSheet(frames, {
    columns: Math.max(1, Number(colsInput.value) || 4),
    padding: Math.max(0, Number(padInput.value) || 0),
    uniformCellSize: uniformInput.checked,
  });
  lastCss = result.css;
  const display = scaleToFitPreview(result.canvas.width, result.canvas.height, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d')!.drawImage(result.canvas, 0, 0, display.width, display.height);
  metaEl.textContent = `${frames.length} frames · ${result.canvas.width}×${result.canvas.height}`;
  (previewCanvas as HTMLCanvasElement & { _output?: HTMLCanvasElement })._output = result.canvas;
}

initShell({ activeToolId: 'sprite-sheet' });

bindMultiFileDrop({
  dropzone: $<HTMLElement>('#dropzone'),
  input: $<HTMLInputElement>('#fileInput'),
  listEl: $<HTMLElement>('#fileList'),
  maxFiles: 30,
  onChange: (items) => {
    void buildFrames(items).then((loaded) => {
      frames = loaded;
      renderPreview();
    });
  },
});

[colsInput, padInput, uniformInput].forEach((el) => {
  el.addEventListener('input', renderPreview);
  el.addEventListener('change', renderPreview);
});

$('#copyCssBtn').addEventListener('click', async () => {
  if (!lastCss) {
    showToast('Add frames first.');
    return;
  }
  await copyText(lastCss);
  showToast('CSS copied.');
});

$('#downloadBtn').addEventListener('click', async () => {
  const output = (previewCanvas as HTMLCanvasElement & { _output?: HTMLCanvasElement })._output;
  if (!output) {
    showToast('Add frames first.');
    return;
  }
  const pngBlob = await new Promise<Blob | null>((resolve) => output.toBlob(resolve, 'image/png'));
  if (!pngBlob) return;

  const zip = new JSZip();
  zip.file('sprite.png', pngBlob);
  zip.file('sprite.css', lastCss);
  await downloadBlob(await zip.generateAsync({ type: 'blob' }), 'sprite-sheet.zip');
  showToast('Sprite sheet ZIP downloaded.');
});
