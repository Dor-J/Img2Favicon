import {
  initToolShell, initToolImageLoader, initFormatControls, getExportSettings, clearLoadedImage,
} from '../../shared/tools/toolBase';
import { createTilePreview } from '../../shared/image/tilePreview';
import { $, downloadCanvas, formatInputMeta, formatOutputMeta, updateMeta } from '../../shared/tools/toolHelpers';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import '../../styles/shared.css';

let loaded: LoadedImage | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const repeatsInput = $<HTMLInputElement>('#repeatsInput');

function render(): void {
  if (!loaded) return;
  const repeats = Math.max(2, Math.min(4, Number(repeatsInput.value) || 2));
  outputCanvas = createTilePreview(imageToCanvas(loaded), repeats);
  const d = scaleToFitPreview(outputCanvas.width, outputCanvas.height, 560);
  previewCanvas.width = d.width;
  previewCanvas.height = d.height;
  previewCanvas.getContext('2d')!.drawImage(outputCanvas, 0, 0, d.width, d.height);
  updateMeta(metaEl, [...formatInputMeta(loaded), ...formatOutputMeta(outputCanvas.width, outputCanvas.height), `${repeats}×${repeats} tile`]);
}

initToolShell('tile-preview', () => { loaded = clearLoadedImage(loaded); outputCanvas = null; });
const formatCtx = await initFormatControls();
initToolImageLoader(async (img) => { loaded = img; render(); }, () => { loaded = clearLoadedImage(loaded); outputCanvas = null; });
repeatsInput.addEventListener('input', render);
$('#downloadBtn').addEventListener('click', async () => {
  if (!outputCanvas || !loaded) return;
  const s = getExportSettings(formatCtx);
  await downloadCanvas(outputCanvas, loaded, s.format, s.quality);
});
