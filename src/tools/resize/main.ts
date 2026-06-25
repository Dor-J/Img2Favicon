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
import { buildFilename, downloadBlob } from '../../shared/image/encode';
import { compressToTargetSize } from '../../shared/image/compress';
import { fitWithinBox, scaleToFitPreview } from '../../shared/image/dimensions';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { resizeCanvas } from '../../shared/image/transform';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;

let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const maxWidthInput = $<HTMLInputElement>('#maxWidth');
const maxHeightInput = $<HTMLInputElement>('#maxHeight');
const maintainAspectInput = $<HTMLInputElement>('#maintainAspect');
const targetKbInput = $<HTMLInputElement>('#targetKb');

function parseOptionalInt(value: string): number | null {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

async function renderPreview(): Promise<void> {
  if (!loaded || !sourceCanvas) return;

  const size = fitWithinBox(
    loaded.width,
    loaded.height,
    parseOptionalInt(maxWidthInput.value),
    parseOptionalInt(maxHeightInput.value),
    maintainAspectInput.checked,
  );

  outputCanvas = resizeCanvas(sourceCanvas, size.width, size.height);

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

  const targetKb = parseOptionalInt(targetKbInput.value);
  if (targetKb) {
    const { formatSelect } = controls;
    const { format } = getExportSettings({ formatSelect, qualityInput: controls.qualityInput });
    const result = await compressToTargetSize(outputCanvas, format, targetKb * 1024);
    updateMeta(metaEl, [
      ...formatInputMeta(loaded),
      ...formatOutputMeta(
        size.width,
        size.height,
        result.blob,
        result.reachedTarget ? undefined : 'Target size not fully reached',
      ),
    ]);
    return;
  }

  updateMeta(metaEl, [
    ...formatInputMeta(loaded),
    ...formatOutputMeta(size.width, size.height),
  ]);
}

async function handleDownload(): Promise<void> {
  if (!loaded || !outputCanvas) {
    showToast('Upload an image first.');
    return;
  }

  const { formatSelect, qualityInput } = controls;
  const { format, quality } = getExportSettings({ formatSelect, qualityInput });
  const targetKb = parseOptionalInt(targetKbInput.value);

  if (targetKb) {
    const result = await compressToTargetSize(outputCanvas, format, targetKb * 1024);
    await downloadBlob(result.blob, buildFilename(loaded.file.name, format));
    showToast('Image downloaded.');
    return;
  }

  await downloadCanvas(outputCanvas, loaded, format, quality);
}

function resetAll(): void {
  loaded = clearLoadedImage(loaded);
  sourceCanvas = null;
  outputCanvas = null;
  previewCanvas.width = 0;
  previewCanvas.height = 0;
  maxWidthInput.value = '';
  maxHeightInput.value = '';
  targetKbInput.value = '';
  maintainAspectInput.checked = true;
  controls.qualityInput.value = '92';
  metaEl.textContent = 'Upload an image to begin.';
  showToast('Settings reset.');
}

const controls = {
  formatSelect: null as unknown as HTMLSelectElement,
  qualityInput: null as unknown as HTMLInputElement,
};

async function init(): Promise<void> {
  initToolShell('resize', resetAll);
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

  [maxWidthInput, maxHeightInput, targetKbInput, maintainAspectInput].forEach((el) => {
    el.addEventListener('input', () => {
      void renderPreview();
    });
    el.addEventListener('change', () => {
      void renderPreview();
    });
  });
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
