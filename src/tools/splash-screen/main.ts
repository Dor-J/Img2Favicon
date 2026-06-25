import JSZip from 'jszip';
import {
  initToolShell, initToolImageLoader, clearLoadedImage,
} from '../../shared/tools/toolBase';
import { SPLASH_SIZES } from '../../shared/web/splashScreen';
import { fitImageToCanvas, type FitMode } from '../../shared/image/fitModes';
import { downloadBlob, canvasToBlob } from '../../shared/image/encode';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
let fitMode: FitMode = 'cover';
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const bgColorInput = $<HTMLInputElement>('#bgColor');

function render(): void {
  if (!sourceCanvas) return;
  const preview = fitImageToCanvas(sourceCanvas, 512, 682, fitMode, bgColorInput.value);
  const d = scaleToFitPreview(512, 682, 560);
  previewCanvas.width = d.width;
  previewCanvas.height = d.height;
  previewCanvas.getContext('2d')!.drawImage(preview, 0, 0, d.width, d.height);
  metaEl.textContent = `Preview · ${SPLASH_SIZES.length} sizes in kit`;
}

initToolShell('splash-screen', () => {
  loaded = clearLoadedImage(loaded);
  sourceCanvas = null;
});
initToolImageLoader(async (img) => { loaded = img; sourceCanvas = imageToCanvas(img); render(); }, () => {
  loaded = clearLoadedImage(loaded);
  sourceCanvas = null;
});
document.querySelectorAll('#fitMode button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#fitMode button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    fitMode = btn.getAttribute('data-fit') as FitMode;
    render();
  });
});
bgColorInput.addEventListener('input', render);
$('#downloadBtn').addEventListener('click', async () => {
  if (!sourceCanvas) { showToast('Upload an image first.'); return; }
  const zip = new JSZip();
  for (const [w, h, name] of SPLASH_SIZES) {
    const c = fitImageToCanvas(sourceCanvas, w, h, fitMode, bgColorInput.value);
    const blob = await canvasToBlob(c, 'image/png');
    if (blob) zip.file(name, blob);
  }
  await downloadBlob(await zip.generateAsync({ type: 'blob' }), 'splash-screens.zip');
  showToast('Splash kit downloaded.');
});
