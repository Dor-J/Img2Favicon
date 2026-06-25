import { initShell } from '../../shared/shell/initShell';
import { dataUrlToImage } from '../../shared/image/dataUrlDecode';
import { downloadBlob } from '../../shared/image/encode';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const PREVIEW_MAX = 560;
const inputText = $<HTMLTextAreaElement>('#dataUrlInput');
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
let lastBlob: Blob | null = null;

async function decode(): Promise<void> {
  const text = inputText.value.trim();
  if (!text) return;
  try {
    const img = await dataUrlToImage(text);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d')!.drawImage(img, 0, 0);
    const display = scaleToFitPreview(canvas.width, canvas.height, PREVIEW_MAX);
    previewCanvas.width = display.width;
    previewCanvas.height = display.height;
    previewCanvas.getContext('2d')!.drawImage(canvas, 0, 0, display.width, display.height);
    lastBlob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
    metaEl.textContent = `Decoded ${img.naturalWidth}×${img.naturalHeight} px`;
  } catch {
    showToast('Invalid data URL or Base64 string.');
    metaEl.textContent = 'Could not decode input.';
  }
}

initShell({ activeToolId: 'dataurl-decode' });
inputText.addEventListener('input', () => void decode());
$('#downloadPng').addEventListener('click', async () => {
  if (!lastBlob) { showToast('Paste a valid data URL first.'); return; }
  await downloadBlob(lastBlob, 'decoded.png');
  showToast('PNG downloaded.');
});
$('#downloadJpg').addEventListener('click', async () => {
  if (!previewCanvas.width) { showToast('Paste a valid data URL first.'); return; }
  const blob = await new Promise<Blob | null>((r) => previewCanvas.toBlob(r, 'image/jpeg', 0.92));
  if (blob) await downloadBlob(blob, 'decoded.jpg');
});
