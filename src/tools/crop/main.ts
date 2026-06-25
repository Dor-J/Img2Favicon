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
  applyCrop,
  clampCropRect,
  cropRectForRatioAtCenter,
  defaultCropRectForRatio,
  type CropRect,
  type CropRatio,
} from '../../shared/image/crop';
import { displayToSourceRect, scaleToFitPreview } from '../../shared/image/dimensions';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;

let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let outputCanvas: HTMLCanvasElement | null = null;
let cropRect: CropRect | null = null;
let ratio: CropRatio = 'free';
let displaySize = { width: 0, height: 0 };
let dragMode: 'move' | 'resize' | null = null;
let dragStart = { x: 0, y: 0, rect: { x: 0, y: 0, width: 0, height: 0 } };

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');

const $$ = <T extends Element>(selector: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll(selector));

function sourceToDisplayRect(rect: CropRect): CropRect {
  const scaleX = displaySize.width / (loaded?.width ?? 1);
  const scaleY = displaySize.height / (loaded?.height ?? 1);
  return {
    x: rect.x * scaleX,
    y: rect.y * scaleY,
    width: rect.width * scaleX,
    height: rect.height * scaleY,
  };
}

function displayToSourceCropRect(rect: CropRect): CropRect {
  return displayToSourceRect(rect, displaySize, {
    width: loaded!.width,
    height: loaded!.height,
  });
}

function drawCropOverlay(ctx: CanvasRenderingContext2D, displayRect: CropRect): void {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
  ctx.clearRect(displayRect.x, displayRect.y, displayRect.width, displayRect.height);
  ctx.strokeStyle = '#ff5a1f';
  ctx.lineWidth = 2;
  ctx.strokeRect(displayRect.x, displayRect.y, displayRect.width, displayRect.height);
  ctx.restore();
}

function renderPreview(): void {
  if (!loaded || !sourceCanvas || !cropRect) return;

  outputCanvas = applyCrop(sourceCanvas, cropRect);

  displaySize = scaleToFitPreview(loaded.width, loaded.height, PREVIEW_MAX);
  previewCanvas.width = displaySize.width;
  previewCanvas.height = displaySize.height;

  const ctx = previewCanvas.getContext('2d', { alpha: true })!;
  ctx.clearRect(0, 0, displaySize.width, displaySize.height);
  ctx.drawImage(sourceCanvas, 0, 0, displaySize.width, displaySize.height);

  const displayCrop = sourceToDisplayRect(cropRect);
  drawCropOverlay(ctx, displayCrop);

  updateMeta(metaEl, [
    ...formatInputMeta(loaded),
    ...formatOutputMeta(outputCanvas.width, outputCanvas.height),
  ]);
}

function setRatio(next: CropRatio): void {
  ratio = next;
  $$<HTMLButtonElement>('#ratioMode button').forEach((button) => {
    button.classList.toggle('active', button.dataset.ratio === next);
  });

  if (!loaded) return;

  if (ratio === 'free') {
    cropRect = defaultCropRectForRatio(loaded.width, loaded.height, 'free');
  } else {
    const centerX = cropRect ? cropRect.x + cropRect.width / 2 : loaded.width / 2;
    const centerY = cropRect ? cropRect.y + cropRect.height / 2 : loaded.height / 2;
    cropRect = cropRectForRatioAtCenter(loaded.width, loaded.height, ratio, centerX, centerY);
  }

  renderPreview();
}

function pointerToCanvas(event: PointerEvent): { x: number; y: number } {
  const rect = previewCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * previewCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * previewCanvas.height,
  };
}

function hitTestResizeHandle(displayRect: CropRect, x: number, y: number): boolean {
  const handle = 12;
  return (
    x >= displayRect.x + displayRect.width - handle &&
    x <= displayRect.x + displayRect.width &&
    y >= displayRect.y + displayRect.height - handle &&
    y <= displayRect.y + displayRect.height
  );
}

function onPointerDown(event: PointerEvent): void {
  if (!loaded || !cropRect) return;

  const point = pointerToCanvas(event);
  const displayRect = sourceToDisplayRect(cropRect);

  if (
    point.x >= displayRect.x &&
    point.x <= displayRect.x + displayRect.width &&
    point.y >= displayRect.y &&
    point.y <= displayRect.y + displayRect.height
  ) {
    dragMode = hitTestResizeHandle(displayRect, point.x, point.y) ? 'resize' : 'move';
    dragStart = { x: point.x, y: point.y, rect: { ...displayRect } };
    previewCanvas.setPointerCapture(event.pointerId);
  }
}

function onPointerMove(event: PointerEvent): void {
  if (!dragMode || !loaded || !cropRect) return;

  const point = pointerToCanvas(event);
  const dx = point.x - dragStart.x;
  const dy = point.y - dragStart.y;
  let nextDisplay = { ...dragStart.rect };

  if (dragMode === 'move') {
    nextDisplay.x += dx;
    nextDisplay.y += dy;
  } else {
    nextDisplay.width = Math.max(20, dragStart.rect.width + dx);
    nextDisplay.height = Math.max(20, dragStart.rect.height + dy);
  }

  if (ratio !== 'free') {
    const aspect =
      ratio === '1:1'
        ? 1
        : ratio === '16:9'
          ? 16 / 9
          : ratio === '4:3'
            ? 4 / 3
            : 3 / 2;
    nextDisplay.height = nextDisplay.width / aspect;
  }

  nextDisplay.x = Math.max(0, Math.min(nextDisplay.x, displaySize.width - nextDisplay.width));
  nextDisplay.y = Math.max(0, Math.min(nextDisplay.y, displaySize.height - nextDisplay.height));
  nextDisplay.width = Math.min(nextDisplay.width, displaySize.width - nextDisplay.x);
  nextDisplay.height = Math.min(nextDisplay.height, displaySize.height - nextDisplay.y);

  cropRect = clampCropRect(
    displayToSourceCropRect(nextDisplay),
    loaded.width,
    loaded.height,
  );
  renderPreview();
}

function onPointerUp(): void {
  dragMode = null;
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
  cropRect = null;
  ratio = 'free';
  previewCanvas.width = 0;
  previewCanvas.height = 0;
  controls.qualityInput.value = '92';
  $$<HTMLButtonElement>('#ratioMode button').forEach((button) => {
    button.classList.toggle('active', button.dataset.ratio === 'free');
  });
  metaEl.textContent = 'Upload an image to begin.';
  showToast('Settings reset.');
}

const controls = {
  formatSelect: null as unknown as HTMLSelectElement,
  qualityInput: null as unknown as HTMLInputElement,
};

async function init(): Promise<void> {
  initToolShell('crop', resetAll);
  const formatControls = await initFormatControls();
  controls.formatSelect = formatControls.formatSelect;
  controls.qualityInput = formatControls.qualityInput;

  initToolImageLoader(
    async (image) => {
      loaded = image;
      sourceCanvas = imageToCanvas(image);
      cropRect = defaultCropRectForRatio(image.width, image.height, ratio);
      renderPreview();
    },
    () => {
      loaded = clearLoadedImage(loaded);
      sourceCanvas = null;
      outputCanvas = null;
      cropRect = null;
      previewCanvas.width = 0;
      previewCanvas.height = 0;
      metaEl.textContent = 'Upload an image to begin.';
    },
  );

  $$<HTMLButtonElement>('#ratioMode button').forEach((button) => {
    button.addEventListener('click', () => {
      setRatio(button.dataset.ratio as CropRatio);
    });
  });

  previewCanvas.addEventListener('pointerdown', onPointerDown);
  previewCanvas.addEventListener('pointermove', onPointerMove);
  previewCanvas.addEventListener('pointerup', onPointerUp);
  previewCanvas.addEventListener('pointercancel', onPointerUp);

  controls.formatSelect.addEventListener('change', () => renderPreview());
  controls.qualityInput.addEventListener('input', () => renderPreview());
  $('#downloadBtn').addEventListener('click', () => {
    void handleDownload();
  });
}

void init();
