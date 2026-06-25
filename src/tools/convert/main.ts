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
import { encodeCanvas } from '../../shared/image/encode';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;

let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');

async function renderPreview(): Promise<void> {
  if (!loaded || !sourceCanvas) return;

  const { formatSelect, qualityInput } = controls;
  const { format, quality } = getExportSettings({ formatSelect, qualityInput });
  const blob = await encodeCanvas(sourceCanvas, { format, quality: quality / 100 });
  const bitmap = await createImageBitmap(blob);
  outputCanvas = document.createElement('canvas');
  outputCanvas.width = bitmap.width;
  outputCanvas.height = bitmap.height;
  outputCanvas.getContext('2d', { alpha: true })!.drawImage(bitmap, 0, 0);
  bitmap.close();

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
    ...formatOutputMeta(outputCanvas.width, outputCanvas.height, blob),
  ]);
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
  previewCanvas.width = 0;
  previewCanvas.height = 0;
  metaEl.textContent = 'Upload an image to begin.';
  controls.qualityInput.value = '92';
  showToast('Settings reset.');
}

const controls = {
  formatSelect: null as unknown as HTMLSelectElement,
  qualityInput: null as unknown as HTMLInputElement,
};

async function init(): Promise<void> {
  initToolShell('convert', resetAll);
  const formatControls = await initFormatControls();
  controls.formatSelect = formatControls.formatSelect;
  controls.qualityInput = formatControls.qualityInput;

  initToolImageLoader(
    async (image) => {
      loaded = image;
      sourceCanvas = imageToCanvas(image);
      await renderPreview();
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

  controls.formatSelect.addEventListener('change', () => {
    void renderPreview();
  });
  controls.qualityInput.addEventListener('input', () => {
    void renderPreview();
  });
  $('#downloadBtn').addEventListener('click', () => {
    void handleDownload();
  });
}

void init();
