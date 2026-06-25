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
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { drawTransformed } from '../../shared/image/transform';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import { refreshIcons } from '../../shared/shell/initShell';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;

let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
let rotation = 0;
let straighten = 0;
let flipH = false;
let flipV = false;

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const rotateRange = $<HTMLInputElement>('#rotateRange');
const straightenRange = $<HTMLInputElement>('#straightenRange');

function renderPreview(): void {
  if (!loaded || !sourceCanvas) return;

  outputCanvas = drawTransformed(sourceCanvas, loaded.width, loaded.height, {
    rotation: rotation + straighten,
    flipH,
    flipV,
  });

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
    ...formatOutputMeta(outputCanvas.width, outputCanvas.height),
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
  rotation = 0;
  straighten = 0;
  flipH = false;
  flipV = false;
  rotateRange.value = '0';
  straightenRange.value = '0';
  updateRangeDisplay(rotateRange, $<HTMLOutputElement>('#rotateValue'), '°');
  updateRangeDisplay(straightenRange, $<HTMLOutputElement>('#straightenValue'), '°');
  previewCanvas.width = 0;
  previewCanvas.height = 0;
  controls.qualityInput.value = '92';
  metaEl.textContent = 'Upload an image to begin.';
  showToast('Settings reset.');
}

const controls = {
  formatSelect: null as unknown as HTMLSelectElement,
  qualityInput: null as unknown as HTMLInputElement,
};

async function init(): Promise<void> {
  initToolShell('rotate', resetAll);
  const formatControls = await initFormatControls();
  controls.formatSelect = formatControls.formatSelect;
  controls.qualityInput = formatControls.qualityInput;

  updateRangeDisplay(rotateRange, $<HTMLOutputElement>('#rotateValue'), '°');
  updateRangeDisplay(straightenRange, $<HTMLOutputElement>('#straightenValue'), '°');

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
      previewCanvas.width = 0;
      previewCanvas.height = 0;
      metaEl.textContent = 'Upload an image to begin.';
    },
  );

  rotateRange.addEventListener('input', () => {
    rotation = Number(rotateRange.value);
    updateRangeDisplay(rotateRange, $<HTMLOutputElement>('#rotateValue'), '°');
    renderPreview();
  });
  straightenRange.addEventListener('input', () => {
    straighten = Number(straightenRange.value);
    updateRangeDisplay(straightenRange, $<HTMLOutputElement>('#straightenValue'), '°');
    renderPreview();
  });
  $('#flipH').addEventListener('click', () => {
    flipH = !flipH;
    renderPreview();
  });
  $('#flipV').addEventListener('click', () => {
    flipV = !flipV;
    renderPreview();
  });
  controls.formatSelect.addEventListener('change', () => renderPreview());
  controls.qualityInput.addEventListener('input', () => renderPreview());
  $('#downloadBtn').addEventListener('click', () => {
    void handleDownload();
  });

  refreshIcons();
}

void init();
