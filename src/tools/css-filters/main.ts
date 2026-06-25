import {
  initToolShell, initToolImageLoader, clearLoadedImage,
} from '../../shared/tools/toolBase';
import { buildCssFilterString, type CssFilterValues } from '../../shared/image/cssFilters';
import { copyText, downloadBlob } from '../../shared/image/encode';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { updateRangeDisplay } from '../../shared/ui/rangeDisplay';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

let loaded: LoadedImage | null = null;
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const filterOutput = $<HTMLTextAreaElement>('#filterOutput');
const sliders = ['blur', 'brightness', 'contrast', 'grayscale', 'saturate', 'sepia', 'hueRotate', 'invert'] as const;

function getValues(): CssFilterValues {
  return {
    blur: Number($<HTMLInputElement>('#blurRange').value),
    brightness: Number($<HTMLInputElement>('#brightnessRange').value),
    contrast: Number($<HTMLInputElement>('#contrastRange').value),
    grayscale: Number($<HTMLInputElement>('#grayscaleRange').value),
    saturate: Number($<HTMLInputElement>('#saturateRange').value),
    sepia: Number($<HTMLInputElement>('#sepiaRange').value),
    hueRotate: Number($<HTMLInputElement>('#hueRotateRange').value),
    invert: Number($<HTMLInputElement>('#invertRange').value),
  };
}

function render(): void {
  if (!loaded) return;
  const source = imageToCanvas(loaded);
  const d = scaleToFitPreview(source.width, source.height, 560);
  previewCanvas.width = d.width;
  previewCanvas.height = d.height;
  const ctx = previewCanvas.getContext('2d')!;
  const filter = buildCssFilterString(getValues());
  ctx.filter = filter === 'none' ? 'none' : filter;
  ctx.drawImage(source, 0, 0, d.width, d.height);
  ctx.filter = 'none';
  filterOutput.value = filter === 'none' ? 'none' : `filter: ${filter};`;
}

initToolShell('css-filters', () => { loaded = clearLoadedImage(loaded); });
initToolImageLoader(async (img) => { loaded = img; render(); }, () => { loaded = clearLoadedImage(loaded); });
sliders.forEach((key) => {
  const input = $<HTMLInputElement>(`#${key}Range`);
  const output = $<HTMLOutputElement>(`#${key}Value`);
  input.addEventListener('input', () => { updateRangeDisplay(input, output); render(); });
  updateRangeDisplay(input, output);
});
$('#copyBtn').addEventListener('click', async () => {
  await copyText(filterOutput.value);
  showToast('CSS copied.');
});
$('#downloadBtn').addEventListener('click', async () => {
  if (!previewCanvas.width) { showToast('Upload an image first.'); return; }
  const blob = await new Promise<Blob | null>((r) => previewCanvas.toBlob(r, 'image/png'));
  if (blob) await downloadBlob(blob, 'filter-preview.png');
});
