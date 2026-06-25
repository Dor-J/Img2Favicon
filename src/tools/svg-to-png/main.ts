import { initShell } from '../../shared/shell/initShell';
import { rasterizeSvgFile } from '../../shared/image/svgRasterize';
import { downloadBlob } from '../../shared/image/encode';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let outputCanvas: HTMLCanvasElement | null = null;

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const fileInput = $<HTMLInputElement>('#imageInput');
const widthInput = $<HTMLInputElement>('#outWidth');
const heightInput = $<HTMLInputElement>('#outHeight');
const dropzone = $<HTMLElement>('#dropzone');

async function processFile(file: File): Promise<void> {
  if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') {
    showToast('Choose an SVG file.');
    return;
  }

  const width = Math.max(1, Number(widthInput.value) || 512);
  const height = Math.max(1, Number(heightInput.value) || 512);
  outputCanvas = await rasterizeSvgFile(file, width, height);

  const display = scaleToFitPreview(width, height, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d')!.drawImage(outputCanvas, 0, 0, display.width, display.height);
  metaEl.textContent = `Output: ${width}×${height} PNG`;
  dropzone.classList.add('has-image');
  $<HTMLElement>('#uploadTitle').textContent = file.name;
}

initShell({ activeToolId: 'svg-to-png', showReset: true, onReset: () => {
  outputCanvas = null;
  fileInput.value = '';
  dropzone.classList.remove('has-image');
  metaEl.textContent = 'Upload an SVG to begin.';
}});

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (file) void processFile(file);
});

[widthInput, heightInput].forEach((el) => {
  el.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (file) void processFile(file);
  });
});

$('#downloadBtn').addEventListener('click', async () => {
  if (!outputCanvas) {
    showToast('Upload an SVG first.');
    return;
  }
  const blob = await new Promise<Blob | null>((resolve) => {
    outputCanvas!.toBlob(resolve, 'image/png');
  });
  if (!blob) {
    showToast('Failed to encode PNG.');
    return;
  }
  await downloadBlob(blob, 'converted.png');
  showToast('PNG downloaded.');
});
