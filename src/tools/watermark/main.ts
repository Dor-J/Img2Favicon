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
import {
  drawWatermark,
  type WatermarkOptions,
  type WatermarkPosition,
} from '../../shared/image/watermark';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import { refreshIcons } from '../../shared/shell/initShell';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;

let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
let logoImage: HTMLImageElement | null = null;
let logoUrl = '';
let mode: 'text' | 'logo' = 'text';

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const wmOpacity = $<HTMLInputElement>('#wmOpacity');
const logoScale = $<HTMLInputElement>('#logoScale');

function getWatermarkOptions(): WatermarkOptions {
  const position = $<HTMLSelectElement>('#wmPosition').value as WatermarkPosition;
  const opacity = Number(wmOpacity.value);

  if (mode === 'logo' && logoImage) {
    return {
      mode: 'logo',
      logo: logoImage,
      scale: Number(logoScale.value) / 100,
      opacity,
      position,
    };
  }

  return {
    mode: 'text',
    text: $<HTMLInputElement>('#wmText').value || '© Your Name',
    fontSize: Number($<HTMLInputElement>('#wmFontSize').value) || 32,
    color: $<HTMLInputElement>('#wmColor').value,
    opacity,
    position,
  };
}

function renderPreview(): void {
  if (!loaded || !sourceCanvas) return;

  outputCanvas = document.createElement('canvas');
  outputCanvas.width = loaded.width;
  outputCanvas.height = loaded.height;
  const ctx = outputCanvas.getContext('2d', { alpha: true })!;
  ctx.drawImage(sourceCanvas, 0, 0);
  drawWatermark(ctx, outputCanvas.width, outputCanvas.height, getWatermarkOptions());

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

function setMode(next: 'text' | 'logo'): void {
  mode = next;
  $$<HTMLButtonElement>('#wmMode button').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === next);
  });
  $('#textControls').classList.toggle('hide', next !== 'text');
  $('#logoControls').classList.toggle('hide', next !== 'logo');
  renderPreview();
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
  if (logoUrl) URL.revokeObjectURL(logoUrl);
  logoImage = null;
  logoUrl = '';
  mode = 'text';
  $<HTMLInputElement>('#wmText').value = '© Your Name';
  $<HTMLInputElement>('#wmFontSize').value = '32';
  $<HTMLInputElement>('#wmColor').value = '#ffffff';
  $<HTMLInputElement>('#logoInput').value = '';
  logoScale.value = '25';
  wmOpacity.value = '70';
  $<HTMLSelectElement>('#wmPosition').value = 'bottom-right';
  updateRangeDisplay(logoScale, $<HTMLOutputElement>('#logoScaleValue'), '%');
  updateRangeDisplay(wmOpacity, $<HTMLOutputElement>('#wmOpacityValue'), '%');
  setMode('text');
  previewCanvas.width = 0;
  previewCanvas.height = 0;
  controls.qualityInput.value = '92';
  metaEl.textContent = 'Upload an image to begin.';
  showToast('Settings reset.');
}

const $$ = <T extends Element>(selector: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll(selector));

const controls = {
  formatSelect: null as unknown as HTMLSelectElement,
  qualityInput: null as unknown as HTMLInputElement,
};

async function init(): Promise<void> {
  initToolShell('watermark', resetAll);
  const formatControls = await initFormatControls();
  controls.formatSelect = formatControls.formatSelect;
  controls.qualityInput = formatControls.qualityInput;

  updateRangeDisplay(logoScale, $<HTMLOutputElement>('#logoScaleValue'), '%');
  updateRangeDisplay(wmOpacity, $<HTMLOutputElement>('#wmOpacityValue'), '%');

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

  $$<HTMLButtonElement>('#wmMode button').forEach((button) => {
    button.addEventListener('click', () => {
      setMode(button.dataset.mode as 'text' | 'logo');
    });
  });

  ['#wmText', '#wmFontSize', '#wmColor', '#wmPosition'].forEach((selector) => {
    $(selector).addEventListener('input', () => renderPreview());
    $(selector).addEventListener('change', () => renderPreview());
  });
  logoScale.addEventListener('input', () => {
    updateRangeDisplay(logoScale, $<HTMLOutputElement>('#logoScaleValue'), '%');
    renderPreview();
  });
  wmOpacity.addEventListener('input', () => {
    updateRangeDisplay(wmOpacity, $<HTMLOutputElement>('#wmOpacityValue'), '%');
    renderPreview();
  });
  $<HTMLInputElement>('#logoInput').addEventListener('change', (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (logoUrl) URL.revokeObjectURL(logoUrl);
    logoUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      logoImage = image;
      setMode('logo');
    };
    image.src = logoUrl;
  });

  controls.formatSelect.addEventListener('change', () => renderPreview());
  controls.qualityInput.addEventListener('input', () => renderPreview());
  $('#downloadBtn').addEventListener('click', () => {
    void handleDownload();
  });

  refreshIcons();
}

void init();
