import {
  initToolShell, initToolImageLoader, initFormatControls, getExportSettings, clearLoadedImage,
} from '../../shared/tools/toolBase';
import { sharpenCanvas } from '../../shared/image/sharpen';
import { $, downloadCanvas, formatInputMeta, formatOutputMeta, updateMeta } from '../../shared/tools/toolHelpers';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import '../../styles/shared.css';

let loaded: LoadedImage | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const amountRange = $<HTMLInputElement>('#amountRange');
const radiusRange = $<HTMLInputElement>('#radiusRange');

function render(): void {
  if (!loaded) return;
  outputCanvas = sharpenCanvas(imageToCanvas(loaded), Number(amountRange.value), Number(radiusRange.value));
  const d = scaleToFitPreview(outputCanvas.width, outputCanvas.height, 560);
  previewCanvas.width = d.width;
  previewCanvas.height = d.height;
  previewCanvas.getContext('2d')!.drawImage(outputCanvas, 0, 0, d.width, d.height);
  updateMeta(metaEl, [...formatInputMeta(loaded), ...formatOutputMeta(outputCanvas.width, outputCanvas.height)]);
}

initToolShell('sharpen', () => { loaded = clearLoadedImage(loaded); outputCanvas = null; });
const formatCtx = await initFormatControls();
initToolImageLoader(async (img) => { loaded = img; render(); }, () => { loaded = clearLoadedImage(loaded); outputCanvas = null; });
[amountRange, radiusRange].forEach((input) => {
  const output = $<HTMLOutputElement>(`#${input.id.replace('Range', 'Value')}`);
  input.addEventListener('input', () => { updateRangeDisplay(input, output); render(); });
  updateRangeDisplay(input, output);
});
$('#downloadBtn').addEventListener('click', async () => {
  if (!outputCanvas || !loaded) return;
  const s = getExportSettings(formatCtx);
  await downloadCanvas(outputCanvas, loaded, s.format, s.quality);
});
