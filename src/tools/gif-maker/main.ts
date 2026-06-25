import { initShell } from '../../shared/shell/initShell';
import { bindMultiFileDrop } from '../../shared/ui/multiFileDrop';
import { encodeGifBlob } from '../../shared/image/gifEncode';
import { downloadBlob } from '../../shared/image/encode';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const delayInput = $<HTMLInputElement>('#delayInput');
const loopInput = $<HTMLInputElement>('#loopInput');
const metaEl = $<HTMLElement>('#metaInfo');
let frames: HTMLCanvasElement[] = [];

function canvasFromUrl(url: string, w: number, h: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      c.getContext('2d')!.drawImage(img, 0, 0);
      resolve(c);
    };
    img.onerror = reject;
    img.src = url;
  });
}

initShell({ activeToolId: 'gif-maker' });
bindMultiFileDrop({
  dropzone: $<HTMLElement>('#dropzone'),
  input: $<HTMLInputElement>('#fileInput'),
  listEl: $<HTMLElement>('#fileList'),
  maxFiles: 30,
  onChange: (items) => {
    void Promise.all(items.map((i) => canvasFromUrl(i.url, i.width, i.height))).then((loaded) => {
      frames = loaded;
      if (frames[0]) {
        const d = scaleToFitPreview(frames[0].width, frames[0].height, 560);
        previewCanvas.width = d.width;
        previewCanvas.height = d.height;
        previewCanvas.getContext('2d')!.drawImage(frames[0], 0, 0, d.width, d.height);
      }
      metaEl.textContent = `${frames.length} frame(s) loaded`;
    });
  },
});
$('#downloadBtn').addEventListener('click', async () => {
  if (!frames.length) { showToast('Add frames first.'); return; }
  const delay = Number(delayInput.value) || 100;
  const loop = loopInput.checked ? 0 : 1;
  const blob = encodeGifBlob(frames, delay, loop);
  await downloadBlob(blob, 'animation.gif');
  showToast('GIF downloaded.');
});
