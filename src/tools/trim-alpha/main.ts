import {
  initToolShell,
  initToolImageLoader,
  initFormatControls,
  getExportSettings,
  clearLoadedImage,
} from '../../shared/tools/toolBase';
import { trimTransparentCanvas } from '../../shared/image/trimAlpha';
import { $, downloadCanvas, formatInputMeta, formatOutputMeta, updateMeta } from '../../shared/tools/toolHelpers';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let loaded: LoadedImage | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');

function render(): void {
  if (!loaded) return;
  const source = imageToCanvas(loaded);
  outputCanvas = trimTransparentCanvas(source);
  const display = scaleToFitPreview(outputCanvas.width, outputCanvas.height, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d')!.drawImage(outputCanvas, 0, 0, display.width, display.height);
  updateMeta(metaEl, [
    ...formatInputMeta(loaded),
    ...formatOutputMeta(outputCanvas.width, outputCanvas.height),
    `Removed ${source.width - outputCanvas.width}×${source.height - outputCanvas.height}px padding`,
  ]);
}

initToolShell('trim-alpha', () => {
  loaded = clearLoadedImage(loaded);
  outputCanvas = null;
  metaEl.textContent = 'Upload an image to begin.';
});
const formatCtx = await initFormatControls();
initToolImageLoader(async (img) => { loaded = img; render(); }, () => {
  loaded = clearLoadedImage(loaded);
  outputCanvas = null;
  metaEl.textContent = 'Upload an image to begin.';
});
$('#downloadBtn').addEventListener('click', async () => {
  if (!outputCanvas || !loaded) return;
  const s = getExportSettings(formatCtx);
  await downloadCanvas(outputCanvas, loaded, s.format, s.quality);
});
