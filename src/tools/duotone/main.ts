import {
  initToolShell, initToolImageLoader, initFormatControls, getExportSettings, clearLoadedImage,
} from '../../shared/tools/toolBase';
import { applyDuotone, type DuotoneMode } from '../../shared/image/duotone';
import { $, downloadCanvas, formatInputMeta, formatOutputMeta, updateMeta } from '../../shared/tools/toolHelpers';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import '../../styles/shared.css';

let loaded: LoadedImage | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
let mode: DuotoneMode = 'grayscale';
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const shadowInput = $<HTMLInputElement>('#shadowColor');
const highlightInput = $<HTMLInputElement>('#highlightColor');

function render(): void {
  if (!loaded) return;
  outputCanvas = applyDuotone(imageToCanvas(loaded), mode, shadowInput.value, highlightInput.value);
  const d = scaleToFitPreview(outputCanvas.width, outputCanvas.height, 560);
  previewCanvas.width = d.width;
  previewCanvas.height = d.height;
  previewCanvas.getContext('2d')!.drawImage(outputCanvas, 0, 0, d.width, d.height);
  updateMeta(metaEl, [...formatInputMeta(loaded), ...formatOutputMeta(outputCanvas.width, outputCanvas.height)]);
}

initToolShell('duotone', () => { loaded = clearLoadedImage(loaded); outputCanvas = null; });
const formatCtx = await initFormatControls();
initToolImageLoader(async (img) => { loaded = img; render(); }, () => { loaded = clearLoadedImage(loaded); outputCanvas = null; });
document.querySelectorAll('#duotoneMode button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#duotoneMode button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.getAttribute('data-mode') as DuotoneMode;
    document.querySelector('#duotoneColors')!.classList.toggle('hide', mode === 'grayscale');
    render();
  });
});
[shadowInput, highlightInput].forEach((el) => el.addEventListener('input', render));
$('#downloadBtn').addEventListener('click', async () => {
  if (!outputCanvas || !loaded) return;
  const s = getExportSettings(formatCtx);
  await downloadCanvas(outputCanvas, loaded, s.format, s.quality);
});
