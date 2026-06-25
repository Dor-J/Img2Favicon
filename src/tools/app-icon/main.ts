import JSZip from 'jszip';
import {
  initToolShell,
  initToolImageLoader,
  clearLoadedImage,
} from '../../shared/tools/toolBase';
import {
  APP_ICON_SIZES,
  createAppIconCanvas,
  appIconToBlob,
} from '../../shared/web/appIconKit';
import type { FitMode } from '../../shared/image/fitModes';
import { downloadBlob } from '../../shared/image/encode';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let fitMode: FitMode = 'cover';

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const bgColorInput = $<HTMLInputElement>('#bgColor');

function renderPreview(): void {
  if (!sourceCanvas) return;
  const preview = createAppIconCanvas(sourceCanvas, 256, fitMode, bgColorInput.value);
  const display = scaleToFitPreview(256, 256, PREVIEW_MAX);
  previewCanvas.width = display.width;
  previewCanvas.height = display.height;
  previewCanvas.getContext('2d')!.drawImage(preview, 0, 0, display.width, display.height);
  metaEl.textContent = `Preview at 256×256 · ${fitMode} fit`;
}

initToolShell('app-icon', () => {
  loaded = clearLoadedImage(loaded);
  sourceCanvas = null;
  metaEl.textContent = 'Upload an image to begin.';
});

initToolImageLoader(
  async (image) => {
    loaded = image;
    sourceCanvas = imageToCanvas(image);
    renderPreview();
  },
  () => {
    loaded = clearLoadedImage(loaded);
    sourceCanvas = null;
    metaEl.textContent = 'Upload an image to begin.';
  },
);

document.querySelectorAll('#fitMode button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#fitMode button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    fitMode = btn.getAttribute('data-fit') as FitMode;
    renderPreview();
  });
});

bgColorInput.addEventListener('input', renderPreview);

$('#downloadBtn').addEventListener('click', async () => {
  if (!sourceCanvas) {
    showToast('Upload an image first.');
    return;
  }

  const zip = new JSZip();
  for (const [size, filename] of APP_ICON_SIZES) {
    const canvas = createAppIconCanvas(sourceCanvas, size, fitMode, bgColorInput.value);
    zip.file(filename, await appIconToBlob(canvas));
  }
  await downloadBlob(await zip.generateAsync({ type: 'blob' }), 'app-icons.zip');
  showToast('App icon kit downloaded.');
});
