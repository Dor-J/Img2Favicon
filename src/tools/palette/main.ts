import {
  initToolShell,
  initToolImageLoader,
  clearLoadedImage,
} from '../../shared/tools/toolBase';
import { extractColorsFromCanvas } from '../../shared/image/palette';
import { dedupeSimilarColors, colorsToCssVariables } from '../../shared/image/color';
import { copyText } from '../../shared/image/encode';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let loaded: LoadedImage | null = null;
let colors: string[] = [];

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const swatchesEl = $<HTMLElement>('#swatches');
const metaEl = $<HTMLElement>('#metaInfo');

function renderSwatches(): void {
  swatchesEl.innerHTML = colors
    .map(
      (color) =>
        `<button type="button" class="palette-swatch" data-color="${color}" style="background:${color}" title="${color}"><span>${color}</span></button>`,
    )
    .join('');

  swatchesEl.querySelectorAll('.palette-swatch').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await copyText(btn.getAttribute('data-color') ?? '');
      showToast('Color copied.');
    });
  });
}

function render(): void {
  if (!loaded) return;
  const source = imageToCanvas(loaded);
  colors = dedupeSimilarColors(extractColorsFromCanvas(source));
  renderSwatches();
  metaEl.textContent = `${colors.length} colors extracted from ${loaded.file.name}`;

  const display = scaleToFitPreview(loaded.width, loaded.height, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d')!.drawImage(source, 0, 0, display.width, display.height);
}

initToolShell('palette', () => {
  loaded = clearLoadedImage(loaded);
  colors = [];
  swatchesEl.innerHTML = '';
  metaEl.textContent = 'Upload an image to begin.';
});

initToolImageLoader(
  async (image) => {
    loaded = image;
    render();
  },
  () => {
    loaded = clearLoadedImage(loaded);
    colors = [];
    swatchesEl.innerHTML = '';
    metaEl.textContent = 'Upload an image to begin.';
  },
);

$('#copyHexBtn').addEventListener('click', async () => {
  if (!colors.length) {
    showToast('Load an image first.');
    return;
  }
  await copyText(colors.join('\n'));
  showToast('Hex colors copied.');
});

$('#copyCssBtn').addEventListener('click', async () => {
  if (!colors.length) {
    showToast('Load an image first.');
    return;
  }
  await copyText(`:root {\n${colorsToCssVariables(colors)}\n}`);
  showToast('CSS variables copied.');
});

$('#downloadBtn').addEventListener('click', async () => {
  if (!loaded) {
    showToast('Load an image first.');
    return;
  }
  const blob = await new Promise<Blob | null>((resolve) => previewCanvas.toBlob(resolve, 'image/png'));
  if (!blob) return;
  const { downloadBlob } = await import('../../shared/image/encode');
  await downloadBlob(blob, 'palette-preview.png');
});
