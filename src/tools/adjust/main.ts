import {
  initToolShell,
  initToolImageLoader,
  initFormatControls,
  getExportSettings,
  clearLoadedImage,
} from '../../shared/tools/toolBase';
import { applyAdjustments } from '../../shared/image/adjust';
import { $, downloadCanvas, formatInputMeta, formatOutputMeta, updateMeta } from '../../shared/tools/toolHelpers';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const brightnessRange = $<HTMLInputElement>('#brightnessRange');
const contrastRange = $<HTMLInputElement>('#contrastRange');
const saturationRange = $<HTMLInputElement>('#saturationRange');

function getAdjustments() {
  return {
    brightness: Number(brightnessRange.value),
    contrast: Number(contrastRange.value),
    saturation: Number(saturationRange.value),
  };
}

function renderPreview(): void {
  if (!sourceCanvas || !loaded) return;
  outputCanvas = applyAdjustments(sourceCanvas, getAdjustments());
  const display = scaleToFitPreview(outputCanvas.width, outputCanvas.height, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d')!.drawImage(outputCanvas, 0, 0, display.width, display.height);
  updateMeta(metaEl, [
    ...formatInputMeta(loaded),
    ...formatOutputMeta(outputCanvas.width, outputCanvas.height),
  ]);
}

initToolShell('adjust', () => {
  loaded = clearLoadedImage(loaded);
  sourceCanvas = null;
  outputCanvas = null;
  brightnessRange.value = '0';
  contrastRange.value = '0';
  saturationRange.value = '0';
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

[brightnessRange, contrastRange, saturationRange].forEach((input) => {
  const output = document.querySelector(`#${input.id.replace('Range', 'Value')}`) as HTMLOutputElement;
  input.addEventListener('input', () => {
    updateRangeDisplay(input, output);
    renderPreview();
  });
  updateRangeDisplay(input, output);
});

$('#downloadBtn').addEventListener('click', async () => {
  if (!outputCanvas || !loaded) return;
  const settings = getExportSettings(formatCtx);
  await downloadCanvas(outputCanvas, loaded, settings.format, settings.quality);
});
