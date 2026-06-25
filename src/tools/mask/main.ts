import {
  initToolShell,
  initToolImageLoader,
  initFormatControls,
  getExportSettings,
  clearLoadedImage,
} from '../../shared/tools/toolBase';
import { applyShapeMaskInPlace } from '../../shared/image/mask';
import type { ShapeMode } from '../../shared/image/shape';
import { $, downloadCanvas, formatInputMeta, formatOutputMeta, updateMeta } from '../../shared/tools/toolHelpers';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
let shape: ShapeMode = 'rounded';

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const radiusRange = $<HTMLInputElement>('#radiusRange');

function renderPreview(): void {
  if (!sourceCanvas || !loaded) return;
  const radiusRatio = Number(radiusRange.value) / 100;
  outputCanvas = applyShapeMaskInPlace(sourceCanvas, { shape, radiusRatio });
  const display = scaleToFitPreview(outputCanvas.width, outputCanvas.height, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d')!.drawImage(outputCanvas, 0, 0, display.width, display.height);
  updateMeta(metaEl, [
    ...formatInputMeta(loaded),
    ...formatOutputMeta(outputCanvas.width, outputCanvas.height),
  ]);
}

initToolShell('mask', () => {
  loaded = clearLoadedImage(loaded);
  sourceCanvas = null;
  outputCanvas = null;
  metaEl.textContent = 'Upload an image to begin.';
});

const formatCtx = await initFormatControls();

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
    metaEl.textContent = 'Upload an image to begin.';
  },
);

document.querySelectorAll('#shapeMode button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#shapeMode button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    shape = btn.getAttribute('data-shape') as ShapeMode;
    radiusRange.closest('.field')!.classList.toggle('hide', shape !== 'rounded');
    renderPreview();
  });
});

radiusRange.addEventListener('input', () => {
  updateRangeDisplay(radiusRange, $<HTMLOutputElement>('#radiusValue'), '%');
  renderPreview();
});

$('#downloadBtn').addEventListener('click', async () => {
  if (!outputCanvas || !loaded) return;
  const settings = getExportSettings(formatCtx);
  await downloadCanvas(outputCanvas, loaded, settings.format, settings.quality);
});
