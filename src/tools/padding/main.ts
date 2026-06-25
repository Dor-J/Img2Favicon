import {
  initToolShell,
  initToolImageLoader,
  initFormatControls,
  getExportSettings,
  clearLoadedImage,
} from '../../shared/tools/toolBase';
import { addPaddingBorder } from '../../shared/image/padding';
import { $, downloadCanvas, formatInputMeta, formatOutputMeta, updateMeta } from '../../shared/tools/toolHelpers';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const padInput = $<HTMLInputElement>('#padAll');
const bgTransparentInput = $<HTMLInputElement>('#bgTransparent');
const bgColorInput = $<HTMLInputElement>('#bgColor');
const borderWidthInput = $<HTMLInputElement>('#borderWidth');
const borderColorInput = $<HTMLInputElement>('#borderColor');

function renderPreview(): void {
  if (!sourceCanvas || !loaded) return;
  const pad = Math.max(0, Number(padInput.value) || 0);
  outputCanvas = addPaddingBorder(sourceCanvas, {
    top: pad,
    right: pad,
    bottom: pad,
    left: pad,
    background: bgTransparentInput.checked ? 'transparent' : bgColorInput.value,
    borderWidth: Math.max(0, Number(borderWidthInput.value) || 0),
    borderColor: borderColorInput.value,
  });
  const display = scaleToFitPreview(outputCanvas.width, outputCanvas.height, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d')!.drawImage(outputCanvas, 0, 0, display.width, display.height);
  updateMeta(metaEl, [
    ...formatInputMeta(loaded),
    ...formatOutputMeta(outputCanvas.width, outputCanvas.height),
  ]);
}

initToolShell('padding', () => {
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

[padInput, bgTransparentInput, bgColorInput, borderWidthInput, borderColorInput].forEach((el) => {
  el.addEventListener('input', renderPreview);
  el.addEventListener('change', renderPreview);
});

$('#downloadBtn').addEventListener('click', async () => {
  if (!outputCanvas || !loaded) return;
  const settings = getExportSettings(formatCtx);
  await downloadCanvas(outputCanvas, loaded, settings.format, settings.quality);
});
