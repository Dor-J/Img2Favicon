import { initShell } from '../../shared/shell/initShell';
import { initFormatControls, getExportSettings } from '../../shared/tools/toolBase';
import { combineCanvases, type CombineLayout } from '../../shared/image/combine';
import { bindMultiFileDrop } from '../../shared/ui/multiFileDrop';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { buildFilename, downloadBlob, encodeCanvas } from '../../shared/image/encode';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let canvases: HTMLCanvasElement[] = [];
let layout: CombineLayout = 'horizontal';

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const gapInput = $<HTMLInputElement>('#gapInput');
const bgColorInput = $<HTMLInputElement>('#bgColor');
const gridColsInput = $<HTMLInputElement>('#gridCols');

function renderPreview(): void {
  if (canvases.length < 2) {
    metaEl.textContent = 'Add at least 2 images.';
    return;
  }
  const combined = combineCanvases(canvases, {
    layout,
    gap: Math.max(0, Number(gapInput.value) || 0),
    background: bgColorInput.value,
    gridColumns: Math.max(1, Number(gridColsInput.value) || 2),
  });
  const display = scaleToFitPreview(combined.width, combined.height, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d')!.drawImage(combined, 0, 0, display.width, display.height);
  metaEl.textContent = `Combined ${canvases.length} images · ${combined.width}×${combined.height}`;
  previewCanvas.dataset.output = '1';
  (previewCanvas as HTMLCanvasElement & { _output?: HTMLCanvasElement })._output = combined;
}

initShell({ activeToolId: 'combine' });
const formatCtx = await initFormatControls();

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

const multiDrop = bindMultiFileDrop({
  dropzone: $<HTMLElement>('#dropzone'),
  input: $<HTMLInputElement>('#fileInput'),
  listEl: $<HTMLElement>('#fileList'),
  maxFiles: 10,
  onChange: (items) => {
    void Promise.all(items.map((item) => canvasFromUrl(item.url, item.width, item.height))).then(
      (loaded) => {
        canvases = loaded;
        renderPreview();
      },
    );
  },
});

document.querySelectorAll('#layoutMode button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#layoutMode button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    layout = btn.getAttribute('data-layout') as CombineLayout;
    gridColsInput.closest('.field')!.classList.toggle('hide', layout !== 'grid');
    renderPreview();
  });
});

[gapInput, bgColorInput, gridColsInput].forEach((el) => el.addEventListener('input', renderPreview));

$('#clearFiles').addEventListener('click', () => {
  multiDrop.clear();
  canvases = [];
  metaEl.textContent = 'Add images to begin.';
});

$('#downloadBtn').addEventListener('click', async () => {
  const output = (previewCanvas as HTMLCanvasElement & { _output?: HTMLCanvasElement })._output;
  if (!output) return;
  const settings = getExportSettings(formatCtx);
  const blob = await encodeCanvas(output, { format: settings.format, quality: settings.quality / 100 });
  await downloadBlob(blob, buildFilename('combined', settings.format));
});
