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
import {
  blurRegion,
  pixelateRegion,
  type EffectRegion,
} from '../../shared/image/filters';
import { displayToSourceRect, scaleToFitPreview } from '../../shared/image/dimensions';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;

let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
let displaySize = { width: 0, height: 0 };
let regions: EffectRegion[] = [];
let effectMode: 'blur' | 'pixelate' = 'blur';
let dragStart: { x: number; y: number } | null = null;
let activeRegion: EffectRegion | null = null;
let regionCounter = 0;

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const intensityRange = $<HTMLInputElement>('#intensityRange');

function pointerToCanvas(event: PointerEvent): { x: number; y: number } {
  const rect = previewCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * previewCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * previewCanvas.height,
  };
}

function applyEffects(): void {
  if (!loaded || !sourceCanvas) return;

  outputCanvas = document.createElement('canvas');
  outputCanvas.width = loaded.width;
  outputCanvas.height = loaded.height;
  const ctx = outputCanvas.getContext('2d', { alpha: true })!;
  ctx.drawImage(sourceCanvas, 0, 0);

  const intensity = Number(intensityRange.value);

  for (const region of regions) {
    const sourceRect = displayToSourceRect(region, displaySize, {
      width: loaded.width,
      height: loaded.height,
    });

    if (effectMode === 'blur') {
      blurRegion(ctx, outputCanvas, sourceRect, intensity);
    } else {
      pixelateRegion(ctx, sourceRect, Math.max(2, Math.round(intensity / 2)));
    }
  }
}

function drawRegionOutlines(): void {
  const ctx = previewCanvas.getContext('2d', { alpha: true })!;
  ctx.strokeStyle = '#ff5a1f';
  ctx.lineWidth = 2;

  for (const region of regions) {
    ctx.strokeRect(region.x, region.y, region.width, region.height);
  }
}

function renderPreview(): void {
  if (!loaded || !sourceCanvas) return;

  applyEffects();

  displaySize = scaleToFitPreview(loaded.width, loaded.height, PREVIEW_MAX);
  previewCanvas.width = displaySize.width;
  previewCanvas.height = displaySize.height;
  previewCanvas.getContext('2d', { alpha: true })!.drawImage(
    outputCanvas!,
    0,
    0,
    displaySize.width,
    displaySize.height,
  );
  drawRegionOutlines();

  updateMeta(metaEl, [
    ...formatInputMeta(loaded),
    ...formatOutputMeta(outputCanvas!.width, outputCanvas!.height, null, `${regions.length} region(s)`),
  ]);
}

function setEffectMode(mode: 'blur' | 'pixelate'): void {
  effectMode = mode;
  $$<HTMLButtonElement>('#effectMode button').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === mode);
  });
  renderPreview();
}

function onPointerDown(event: PointerEvent): void {
  if (!loaded) return;

  dragStart = pointerToCanvas(event);
  regionCounter += 1;
  activeRegion = {
    id: `region-${regionCounter}`,
    x: dragStart.x,
    y: dragStart.y,
    width: 1,
    height: 1,
  };
  regions.push(activeRegion);
  previewCanvas.setPointerCapture(event.pointerId);
}

function onPointerMove(event: PointerEvent): void {
  if (!dragStart || !activeRegion) return;

  const point = pointerToCanvas(event);
  activeRegion.x = Math.min(dragStart.x, point.x);
  activeRegion.y = Math.min(dragStart.y, point.y);
  activeRegion.width = Math.max(1, Math.abs(point.x - dragStart.x));
  activeRegion.height = Math.max(1, Math.abs(point.y - dragStart.y));

  renderPreview();
}

function onPointerUp(): void {
  dragStart = null;
  activeRegion = null;
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
  regions = [];
  effectMode = 'blur';
  previewCanvas.width = 0;
  previewCanvas.height = 0;
  intensityRange.value = '12';
  updateRangeDisplay(intensityRange, $<HTMLOutputElement>('#intensityValue'));
  controls.qualityInput.value = '92';
  $$<HTMLButtonElement>('#effectMode button').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === 'blur');
  });
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
  initToolShell('blur', resetAll);
  const formatControls = await initFormatControls();
  controls.formatSelect = formatControls.formatSelect;
  controls.qualityInput = formatControls.qualityInput;

  updateRangeDisplay(intensityRange, $<HTMLOutputElement>('#intensityValue'));

  initToolImageLoader(
    async (image) => {
      loaded = image;
      sourceCanvas = imageToCanvas(image);
      regions = [];
      renderPreview();
    },
    () => {
      loaded = clearLoadedImage(loaded);
      sourceCanvas = null;
      outputCanvas = null;
      regions = [];
      previewCanvas.width = 0;
      previewCanvas.height = 0;
      metaEl.textContent = 'Upload an image to begin.';
    },
  );

  $$<HTMLButtonElement>('#effectMode button').forEach((button) => {
    button.addEventListener('click', () => {
      setEffectMode(button.dataset.mode as 'blur' | 'pixelate');
    });
  });

  intensityRange.addEventListener('input', () => {
    updateRangeDisplay(intensityRange, $<HTMLOutputElement>('#intensityValue'));
    renderPreview();
  });

  previewCanvas.addEventListener('pointerdown', onPointerDown);
  previewCanvas.addEventListener('pointermove', onPointerMove);
  previewCanvas.addEventListener('pointerup', onPointerUp);
  previewCanvas.addEventListener('pointercancel', onPointerUp);

  $('#clearRegions').addEventListener('click', () => {
    regions = [];
    renderPreview();
    showToast('Regions cleared.');
  });

  controls.formatSelect.addEventListener('change', () => renderPreview());
  controls.qualityInput.addEventListener('input', () => renderPreview());
  $('#downloadBtn').addEventListener('click', () => {
    void handleDownload();
  });
}

void init();
