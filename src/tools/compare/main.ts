import {
  initToolShell,
  initToolImageLoader,
  clearLoadedImage,
} from '../../shared/tools/toolBase';
import { bindCompareSlider } from '../../shared/ui/compareSlider';
import { encodeCanvas } from '../../shared/image/encode';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import { formatFileSize } from '../../shared/image/encode';
import { $ } from '../../shared/tools/toolHelpers';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let loaded: LoadedImage | null = null;
let originalBlob: Blob | null = null;
let compressedBlob: Blob | null = null;

const beforeCanvas = $<HTMLCanvasElement>('#beforeCanvas');
const afterCanvas = $<HTMLCanvasElement>('#afterCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const qualityRange = $<HTMLInputElement>('#qualityRange');
const formatSelect = $<HTMLSelectElement>('#formatSelect');

async function renderCompare(): Promise<void> {
  if (!loaded || !originalBlob) return;

  const source = imageToCanvas(loaded);
  const format = formatSelect.value as 'jpeg' | 'webp';
  compressedBlob = await encodeCanvas(source, {
    format,
    quality: Number(qualityRange.value) / 100,
  });

  const display = scaleToFitPreview(loaded.width, loaded.height, PREVIEW_MAX);
  beforeCanvas.width = afterCanvas.width = display.width;
  beforeCanvas.height = afterCanvas.height = display.height;

  const beforeImg = await blobToImage(originalBlob);
  const afterImg = await blobToImage(compressedBlob);
  beforeCanvas.getContext('2d')!.drawImage(beforeImg, 0, 0, display.width, display.height);
  afterCanvas.getContext('2d')!.drawImage(afterImg, 0, 0, display.width, display.height);

  const saved = originalBlob.size - compressedBlob.size;
  const pct = ((saved / originalBlob.size) * 100).toFixed(1);
  metaEl.textContent = `Original ${formatFileSize(originalBlob.size)} → ${formatFileSize(compressedBlob.size)} (${pct}% smaller)`;
}

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

initToolShell('compare', () => {
  loaded = clearLoadedImage(loaded);
  originalBlob = null;
  compressedBlob = null;
  metaEl.textContent = 'Upload an image to begin.';
});

initToolImageLoader(
  async (image) => {
    loaded = image;
    originalBlob = image.file;
    await renderCompare();
  },
  () => {
    loaded = clearLoadedImage(loaded);
    originalBlob = null;
    compressedBlob = null;
    metaEl.textContent = 'Upload an image to begin.';
  },
);

bindCompareSlider({
  wrap: $<HTMLElement>('#compareWrap'),
  beforeLayer: $<HTMLElement>('#compareBefore'),
  handle: $<HTMLElement>('#compareHandle'),
});

qualityRange.addEventListener('input', () => {
  updateRangeDisplay(qualityRange, $<HTMLOutputElement>('#qualityValue'), '%');
  void renderCompare();
});
formatSelect.addEventListener('change', () => void renderCompare());
updateRangeDisplay(qualityRange, $<HTMLOutputElement>('#qualityValue'), '%');
