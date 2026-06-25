import JSZip from 'jszip';
import { initShell } from '../../shared/shell/initShell';
import { initFormatControls, getExportSettings } from '../../shared/tools/toolBase';
import { bindMultiFileDrop } from '../../shared/ui/multiFileDrop';
import { fitWithinBox } from '../../shared/image/dimensions';
import { resizeCanvas } from '../../shared/image/transform';
import { encodeCanvas, buildFilename, downloadBlob } from '../../shared/image/encode';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

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

initShell({ activeToolId: 'bulk-resize' });
const formatCtx = await initFormatControls();
const maxW = $<HTMLInputElement>('#maxWidth');
const maxH = $<HTMLInputElement>('#maxHeight');
const maintain = $<HTMLInputElement>('#maintainAspect');
const metaEl = $<HTMLElement>('#metaInfo');
let items: { file: File; url: string; width: number; height: number }[] = [];

bindMultiFileDrop({
  dropzone: $<HTMLElement>('#dropzone'),
  input: $<HTMLInputElement>('#fileInput'),
  listEl: $<HTMLElement>('#fileList'),
  maxFiles: 20,
  onChange: (list) => {
    items = list;
    metaEl.textContent = `${items.length} file(s) ready for batch export.`;
  },
});

$('#downloadBtn').addEventListener('click', async () => {
  if (!items.length) { showToast('Add images first.'); return; }
  const mw = maxW.value ? Number(maxW.value) : null;
  const mh = maxH.value ? Number(maxH.value) : null;
  const { format, quality } = getExportSettings(formatCtx);
  const zip = new JSZip();

  for (const item of items) {
    const src = await canvasFromUrl(item.url, item.width, item.height);
    const size = fitWithinBox(item.width, item.height, mw, mh, maintain.checked);
    const out = resizeCanvas(src, size.width, size.height);
    const blob = await encodeCanvas(out, { format, quality: quality / 100 });
    zip.file(buildFilename(item.file.name, format), blob);
  }

  await downloadBlob(await zip.generateAsync({ type: 'blob' }), 'bulk-resized.zip');
  showToast('ZIP downloaded.');
});
