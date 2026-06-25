import {
  initToolShell,
  initToolImageLoader,
  initFormatControls,
  getExportSettings,
  clearLoadedImage,
} from '../../shared/tools/toolBase';
import { fitImageToCanvas, type FitMode } from '../../shared/image/fitModes';
import { resolveOgPreset } from '../../shared/web/ogPresets';
import { $, formatInputMeta, updateMeta } from '../../shared/tools/toolHelpers';
import { buildFilename, downloadBlob, encodeCanvas } from '../../shared/image/encode';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
let preset = '1200x630';
let fitMode: FitMode = 'cover';

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const bgColorInput = $<HTMLInputElement>('#bgColor');

function renderPreview(): void {
  if (!sourceCanvas || !loaded) return;
  const { w, h } = resolveOgPreset(preset);
  outputCanvas = fitImageToCanvas(
    sourceCanvas,
    w,
    h,
    fitMode,
    fitMode === 'contain' ? bgColorInput.value : '#000000',
  );
  const display = scaleToFitPreview(w, h, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d')!.drawImage(outputCanvas, 0, 0, display.width, display.height);
  updateMeta(metaEl, [...formatInputMeta(loaded), `${w}×${h} · ${fitMode}`]);
}

initToolShell('og-image', () => {
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

document.querySelectorAll('#presetMode button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#presetMode button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    preset = btn.getAttribute('data-preset')!;
    renderPreview();
  });
});

document.querySelectorAll('#fitMode button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#fitMode button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    fitMode = btn.getAttribute('data-fit') as FitMode;
    bgColorInput.closest('.field')!.classList.toggle('hide', fitMode !== 'contain');
    renderPreview();
  });
});

bgColorInput.addEventListener('input', renderPreview);

$('#downloadBtn').addEventListener('click', async () => {
  if (!outputCanvas || !loaded) return;
  const settings = getExportSettings(formatCtx);
  const blob = await encodeCanvas(outputCanvas, {
    format: settings.format,
    quality: settings.quality / 100,
  });
  await downloadBlob(blob, buildFilename(`og-${preset}`, settings.format));
});
