import {
  initToolShell, initToolImageLoader, clearLoadedImage,
} from '../../shared/tools/toolBase';
import { canvasToPdf } from '../../shared/image/imageToPdf';
import { downloadBlob } from '../../shared/image/encode';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

let loaded: LoadedImage | null = null;
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');

initToolShell('image-to-pdf', () => { loaded = clearLoadedImage(loaded); });
initToolImageLoader(async (img) => {
  loaded = img;
  const source = imageToCanvas(img);
  const d = scaleToFitPreview(source.width, source.height, 560);
  previewCanvas.width = d.width;
  previewCanvas.height = d.height;
  previewCanvas.getContext('2d')!.drawImage(source, 0, 0, d.width, d.height);
  metaEl.textContent = `${img.width}×${img.height} → single-page PDF`;
}, () => { loaded = clearLoadedImage(loaded); metaEl.textContent = 'Upload an image to begin.' });
$('#downloadBtn').addEventListener('click', async () => {
  if (!loaded) { showToast('Upload an image first.'); return; }
  const blob = canvasToPdf(imageToCanvas(loaded));
  await downloadBlob(blob, 'image.pdf');
  showToast('PDF downloaded.');
});
