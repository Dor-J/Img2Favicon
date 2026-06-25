import JSZip from 'jszip';
import { initShell } from '../../shared/shell/initShell';
import { renderAllPdfPages, renderPdfPage } from '../../shared/image/pdfRasterize';
import { downloadBlob } from '../../shared/image/encode';
import { scaleToFitPreview } from '../../shared/image/dimensions';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
const metaEl = $<HTMLElement>('#metaInfo');
const scaleInput = $<HTMLInputElement>('#scaleInput');
const allPagesInput = $<HTMLInputElement>('#allPages');
const imageInput = $<HTMLInputElement>('#imageInput');
const dropzone = $<HTMLElement>('#dropzone');
let pdfFile: File | null = null;

async function preview(): Promise<void> {
  if (!pdfFile) return;
  const scale = Number(scaleInput.value) || 1.5;
  const canvas = await renderPdfPage(pdfFile, 1, scale);
  const d = scaleToFitPreview(canvas.width, canvas.height, 560);
  previewCanvas.width = d.width;
  previewCanvas.height = d.height;
  previewCanvas.getContext('2d')!.drawImage(canvas, 0, 0, d.width, d.height);
  metaEl.textContent = `Page 1 preview at ${scale}× scale`;
}

initShell({ activeToolId: 'pdf-to-image', showReset: true, onReset: () => {
  pdfFile = null;
  imageInput.value = '';
  dropzone.classList.remove('has-image');
  metaEl.textContent = 'Upload a PDF to begin.';
}});

imageInput.addEventListener('change', () => {
  pdfFile = imageInput.files?.[0] ?? null;
  if (pdfFile) {
    dropzone.classList.add('has-image');
    $<HTMLElement>('#uploadTitle').textContent = pdfFile.name;
    void preview();
  }
});

dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  const file = e.dataTransfer?.files[0];
  if (file?.type === 'application/pdf' || file?.name.endsWith('.pdf')) {
    pdfFile = file;
    dropzone.classList.add('has-image');
    $<HTMLElement>('#uploadTitle').textContent = file.name;
    void preview();
  }
});

scaleInput.addEventListener('change', () => void preview());

$('#downloadBtn').addEventListener('click', async () => {
  if (!pdfFile) { showToast('Upload a PDF first.'); return; }
  const scale = Number(scaleInput.value) || 1.5;
  if (allPagesInput.checked) {
    const pages = await renderAllPdfPages(pdfFile, scale);
    const zip = new JSZip();
    for (let i = 0; i < pages.length; i++) {
      const blob = await new Promise<Blob | null>((r) => pages[i]!.toBlob(r, 'image/png'));
      if (blob) zip.file(`page-${String(i + 1).padStart(3, '0')}.png`, blob);
    }
    await downloadBlob(await zip.generateAsync({ type: 'blob' }), 'pdf-pages.zip');
  } else {
    const canvas = await renderPdfPage(pdfFile, 1, scale);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/png'));
    if (blob) await downloadBlob(blob, 'page-1.png');
  }
  showToast('Export complete.');
});
