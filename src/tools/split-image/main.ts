import JSZip from 'jszip';
import {
  initToolShell, initToolImageLoader, initFormatControls, getExportSettings, clearLoadedImage,
} from '../../shared/tools/toolBase';
import { splitUniformGrid } from '../../shared/image/splitSprite';
import { downloadBlob, encodeCanvas } from '../../shared/image/encode';
import { imageToCanvas, type LoadedImage } from '../../shared/image/loadImage';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

let loaded: LoadedImage | null = null;
let frames: HTMLCanvasElement[] = [];
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const cellW = $<HTMLInputElement>('#cellWidth');
const cellH = $<HTMLInputElement>('#cellHeight');
const padInput = $<HTMLInputElement>('#padInput');

function render(): void {
  if (!loaded) return;
  const source = imageToCanvas(loaded);
  const d = scaleToFitPreview(source.width, source.height, 560);
  previewCanvas.width = d.width;
  previewCanvas.height = d.height;
  previewCanvas.getContext('2d')!.drawImage(source, 0, 0, d.width, d.height);
  try {
    frames = splitUniformGrid(source, Number(cellW.value) || 32, Number(cellH.value) || 32, Number(padInput.value) || 0);
    metaEl.textContent = `${frames.length} frame(s) detected`;
  } catch {
    metaEl.textContent = 'Adjust cell size to match grid.';
    frames = [];
  }
}

initToolShell('split-image', () => { loaded = clearLoadedImage(loaded); frames = []; });
const formatCtx = await initFormatControls();
initToolImageLoader(async (img) => { loaded = img; render(); }, () => { loaded = clearLoadedImage(loaded); frames = []; });
[cellW, cellH, padInput].forEach((el) => el.addEventListener('input', render));
$('#downloadBtn').addEventListener('click', async () => {
  if (!frames.length) { showToast('Upload a sprite sheet and set cell size.'); return; }
  const { format, quality } = getExportSettings(formatCtx);
  const zip = new JSZip();
  for (let i = 0; i < frames.length; i++) {
    const blob = await encodeCanvas(frames[i]!, { format, quality: quality / 100 });
    zip.file(`frame-${String(i + 1).padStart(3, '0')}.png`, blob);
  }
  await downloadBlob(await zip.generateAsync({ type: 'blob' }), 'split-frames.zip');
  showToast('ZIP downloaded.');
});
