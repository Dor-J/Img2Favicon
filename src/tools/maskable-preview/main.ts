import {
  initToolShell, initToolImageLoader, clearLoadedImage,
} from '../../shared/tools/toolBase';
import { drawMaskableOverlay, renderMaskablePreview } from '../../shared/image/maskablePreview';
import { downloadBlob } from '../../shared/image/encode';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const SIZE = 512;
let loaded: LoadedImage | null = null;
let sourceCanvas: HTMLCanvasElement | null = null;
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const showSafe = $<HTMLInputElement>('#showSafeZone');
const showCircle = $<HTMLInputElement>('#showCircle');
let clipMode: 'none' | 'circle' | 'squircle' = 'none';

function render(): void {
  if (!sourceCanvas) return;
  previewCanvas.width = SIZE;
  previewCanvas.height = SIZE;
  const ctx = previewCanvas.getContext('2d', { alpha: true })!;
  ctx.clearRect(0, 0, SIZE, SIZE);
  const clipped = renderMaskablePreview(sourceCanvas, SIZE, clipMode);
  ctx.drawImage(clipped, 0, 0);
  drawMaskableOverlay(ctx, SIZE, showSafe.checked, showCircle.checked);
}

initToolShell('maskable-preview', () => {
  loaded = clearLoadedImage(loaded);
  sourceCanvas = null;
});
initToolImageLoader(async (img) => { loaded = img; sourceCanvas = imageToCanvas(img); render(); }, () => {
  loaded = clearLoadedImage(loaded);
  sourceCanvas = null;
});
document.querySelectorAll('#clipMode button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#clipMode button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    clipMode = btn.getAttribute('data-clip') as typeof clipMode;
    render();
  });
});
[showSafe, showCircle].forEach((el) => el.addEventListener('change', render));
$('#downloadBtn').addEventListener('click', async () => {
  if (!previewCanvas.width) { showToast('Upload an icon first.'); return; }
  const blob = await new Promise<Blob | null>((r) => previewCanvas.toBlob(r, 'image/png'));
  if (blob) await downloadBlob(blob, 'maskable-preview.png');
});
