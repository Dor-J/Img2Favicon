import {
  initToolShell,
  initToolImageLoader,
  initFormatControls,
  getExportSettings,
  clearLoadedImage,
} from '../../shared/tools/toolBase';
import {
  $,
  downloadCanvas,
  formatInputMeta,
  formatOutputMeta,
  updateMeta,
} from '../../shared/tools/toolHelpers';
import { colorKeyToAlpha, sampleColor } from '../../shared/image/filters';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;

let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
let keyColor = { r: 255, g: 255, b: 255 };

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const toleranceRange = $<HTMLInputElement>('#toleranceRange');
const featherRange = $<HTMLInputElement>('#featherRange');
const keyColorInput = $<HTMLInputElement>('#keyColor');

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '');
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
}

function renderPreview(): void {
  if (!loaded || !sourceCanvas) return;

  outputCanvas = document.createElement('canvas');
  outputCanvas.width = loaded.width;
  outputCanvas.height = loaded.height;
  const ctx = outputCanvas.getContext('2d', { alpha: true })!;
  ctx.drawImage(sourceCanvas, 0, 0);

  const imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
  colorKeyToAlpha(
    imageData.data,
    keyColor,
    Number(toleranceRange.value),
    Number(featherRange.value),
  );
  ctx.putImageData(imageData, 0, 0);

  const display = scaleToFitPreview(outputCanvas.width, outputCanvas.height, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d', { alpha: true })!.drawImage(
    outputCanvas,
    0,
    0,
    display.width,
    display.height,
  );

  updateMeta(metaEl, [
    ...formatInputMeta(loaded),
    ...formatOutputMeta(outputCanvas.width, outputCanvas.height, null, 'Transparency applied'),
  ]);
}

function pickColorFromCanvas(event: MouseEvent): void {
  if (!loaded || !sourceCanvas) return;

  const rect = previewCanvas.getBoundingClientRect();
  const displayX = Math.round(
    ((event.clientX - rect.left) / rect.width) * previewCanvas.width,
  );
  const displayY = Math.round(
    ((event.clientY - rect.top) / rect.height) * previewCanvas.height,
  );
  const sourceX = Math.round((displayX / previewCanvas.width) * loaded.width);
  const sourceY = Math.round((displayY / previewCanvas.height) * loaded.height);

  const ctx = sourceCanvas.getContext('2d', { alpha: true })!;
  const data = ctx.getImageData(0, 0, loaded.width, loaded.height).data;
  keyColor = sampleColor(data, loaded.width, sourceX, sourceY);
  keyColorInput.value = rgbToHex(keyColor.r, keyColor.g, keyColor.b);
  renderPreview();
  showToast('Key color picked from image.');
}

async function handleDownload(): Promise<void> {
  if (!loaded || !outputCanvas) {
    showToast('Upload an image first.');
    return;
  }

  const { formatSelect, qualityInput } = controls;
  const { format, quality } = getExportSettings({ formatSelect, qualityInput });
  await downloadCanvas(outputCanvas, loaded, format, quality);
}

function resetAll(): void {
  loaded = clearLoadedImage(loaded);
  sourceCanvas = null;
  outputCanvas = null;
  keyColor = { r: 255, g: 255, b: 255 };
  toleranceRange.value = '24';
  featherRange.value = '6';
  keyColorInput.value = '#ffffff';
  updateRangeDisplay(toleranceRange, $<HTMLOutputElement>('#toleranceValue'));
  updateRangeDisplay(featherRange, $<HTMLOutputElement>('#featherValue'));
  previewCanvas.width = 0;
  previewCanvas.height = 0;
  controls.qualityInput.value = '92';
  metaEl.textContent = 'Upload an image to begin.';
  showToast('Settings reset.');
}

const controls = {
  formatSelect: null as unknown as HTMLSelectElement,
  qualityInput: null as unknown as HTMLInputElement,
};

async function init(): Promise<void> {
  initToolShell('remove-bg', resetAll);
  const formatControls = await initFormatControls();
  controls.formatSelect = formatControls.formatSelect;
  controls.qualityInput = formatControls.qualityInput;

  updateRangeDisplay(toleranceRange, $<HTMLOutputElement>('#toleranceValue'));
  updateRangeDisplay(featherRange, $<HTMLOutputElement>('#featherValue'));

  initToolImageLoader(
    async (image) => {
      loaded = image;
      sourceCanvas = imageToCanvas(image);
      renderPreview();
    },
    () => {
      loaded = clearLoadedImage(loaded);
      sourceCanvas = null;
      outputCanvas = null;
      previewCanvas.width = 0;
      previewCanvas.height = 0;
      metaEl.textContent = 'Upload an image to begin.';
    },
  );

  toleranceRange.addEventListener('input', () => {
    updateRangeDisplay(toleranceRange, $<HTMLOutputElement>('#toleranceValue'));
    renderPreview();
  });
  featherRange.addEventListener('input', () => {
    updateRangeDisplay(featherRange, $<HTMLOutputElement>('#featherValue'));
    renderPreview();
  });
  keyColorInput.addEventListener('input', () => {
    keyColor = hexToRgb(keyColorInput.value);
    renderPreview();
  });
  previewCanvas.addEventListener('click', pickColorFromCanvas);
  controls.formatSelect.addEventListener('change', () => renderPreview());
  controls.qualityInput.addEventListener('input', () => renderPreview());
  $('#downloadBtn').addEventListener('click', () => {
    void handleDownload();
  });
}

void init();
