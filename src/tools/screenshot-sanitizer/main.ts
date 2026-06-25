import {
  initToolShell,
  initToolImageLoader,
  initFormatControls,
  getExportSettings,
  clearLoadedImage,
} from '../../shared/tools/toolBase';
import {
  blurRegion,
  type EffectRegion,
} from '../../shared/image/filters';
import { displayToSourceRect, scaleToFitPreview } from '../../shared/image/dimensions';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import { $, downloadCanvas } from '../../shared/tools/toolHelpers';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
let displaySize = { width: 0, height: 0 };
let regions: EffectRegion[] = [];
let dragStart: { x: number; y: number } | null = null;
let regionCounter = 0;

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const intensityRange = $<HTMLInputElement>('#intensityRange');

function pointerToCanvas(event: PointerEvent): { x: number; y: number } {
  const rect = previewCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * previewCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * previewCanvas.height,
  };
}

function applyEffects(): void {
  if (!loaded || !sourceCanvas) return;
  outputCanvas = document.createElement('canvas');
  outputCanvas.width = loaded.width;
  outputCanvas.height = loaded.height;
  const ctx = outputCanvas.getContext('2d', { alpha: true })!;
  ctx.drawImage(sourceCanvas, 0, 0);
  const intensity = Number(intensityRange.value);

  for (const region of regions) {
    const sourceRect = displayToSourceRect(region, displaySize, {
      width: loaded.width,
      height: loaded.height,
    });
    blurRegion(ctx, outputCanvas, sourceRect, intensity);
  }
}

function drawPreview(): void {
  if (!loaded || !sourceCanvas) return;
  applyEffects();
  const target = outputCanvas ?? sourceCanvas;
  displaySize = scaleToFitPreview(target.width, target.height, PREVIEW_MAX);
  previewCanvas.width = displaySize.width;
  previewCanvas.height = displaySize.height;
  const ctx = previewCanvas.getContext('2d')!;
  ctx.drawImage(target, 0, 0, displaySize.width, displaySize.height);
  ctx.strokeStyle = '#ff5a1f';
  ctx.lineWidth = 2;
  for (const region of regions) {
    ctx.strokeRect(region.x, region.y, region.width, region.height);
  }
  metaEl.textContent = `${regions.length} blur region(s) · metadata stripped on export`;
}

initToolShell('screenshot-sanitizer', () => {
  loaded = clearLoadedImage(loaded);
  sourceCanvas = null;
  outputCanvas = null;
  regions = [];
  metaEl.textContent = 'Upload a screenshot to begin.';
});

const formatCtx = await initFormatControls();

initToolImageLoader(
  async (image) => {
    loaded = image;
    sourceCanvas = imageToCanvas(image);
    regions = [];
    drawPreview();
  },
  () => {
    loaded = clearLoadedImage(loaded);
    sourceCanvas = null;
    outputCanvas = null;
    regions = [];
    metaEl.textContent = 'Upload a screenshot to begin.';
  },
);

previewCanvas.addEventListener('pointerdown', (event) => {
  dragStart = pointerToCanvas(event);
});
previewCanvas.addEventListener('pointerup', (event) => {
  if (!dragStart) return;
  const end = pointerToCanvas(event);
  const x = Math.min(dragStart.x, end.x);
  const y = Math.min(dragStart.y, end.y);
  const width = Math.abs(end.x - dragStart.x);
  const height = Math.abs(end.y - dragStart.y);
  if (width > 4 && height > 4) {
    regions.push({ id: `r-${++regionCounter}`, x, y, width, height });
    drawPreview();
  }
  dragStart = null;
});

intensityRange.addEventListener('input', () => {
  updateRangeDisplay(intensityRange, $<HTMLOutputElement>('#intensityValue'));
  drawPreview();
});
updateRangeDisplay(intensityRange, $<HTMLOutputElement>('#intensityValue'));

$('#clearRegions').addEventListener('click', () => {
  regions = [];
  drawPreview();
});

$('#downloadBtn').addEventListener('click', async () => {
  if (!outputCanvas && sourceCanvas) applyEffects();
  if (!outputCanvas || !loaded) return;
  const settings = getExportSettings(formatCtx);
  await downloadCanvas(outputCanvas, loaded, settings.format, settings.quality);
});
