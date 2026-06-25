import JSZip from 'jszip';
import { initShell } from '../../shared/shell/initShell';
import { validateFaviconKit } from '../../shared/web/faviconKit';
import { $ } from '../../shared/tools/toolHelpers';
import '../../styles/shared.css';

const reportPanel = $<HTMLElement>('#reportPanel');
const dropzone = $<HTMLElement>('#dropzone');
const fileInput = $<HTMLInputElement>('#fileInput');

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  if (file.name.toLowerCase().endsWith('.ico')) {
    return { width: 16, height: 16 };
  }
  if (file.name.toLowerCase().endsWith('.svg') || file.type === 'image/svg+xml') {
    return { width: 512, height: 512 };
  }
  if (file.name.includes('webmanifest') || file.name.endsWith('.json')) {
    return { width: 0, height: 0 };
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('decode failed'));
      image.src = url;
    });
    return { width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function collectFiles(fileList: FileList | File[]): Promise<{ name: string; width: number; height: number }[]> {
  const results: { name: string; width: number; height: number }[] = [];

  for (const file of fileList) {
    if (file.name.toLowerCase().endsWith('.zip') || file.type === 'application/zip') {
      const zip = await JSZip.loadAsync(file);
      for (const [path, entry] of Object.entries(zip.files)) {
        if (entry.dir) continue;
        const blob = await entry.async('blob');
        const innerFile = new File([blob], path.split('/').pop() ?? path, { type: blob.type });
        const dims = await getImageDimensions(innerFile);
        results.push({ name: innerFile.name, ...dims });
      }
    } else {
      const dims = await getImageDimensions(file);
      results.push({ name: file.name, ...dims });
    }
  }

  return results;
}

function renderReport(files: { name: string; width: number; height: number }[]): void {
  const results = validateFaviconKit(files);
  reportPanel.innerHTML = results
    .map((item) => {
      const cls = item.status === 'ok' ? 'ok' : item.status === 'extra' ? 'warn' : 'error';
      return `<div class="report-item ${cls}"><strong>${item.filename}</strong><br>${item.message}</div>`;
    })
    .join('');

  const issues = results.filter((r) => r.status !== 'ok' && r.status !== 'extra').length;
  dropzone.classList.add('has-image');
  $<HTMLElement>('#uploadTitle').textContent =
    issues === 0 ? 'Kit looks good' : `${issues} issue(s) found`;
}

initShell({ activeToolId: 'favicon-checker' });

dropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  if (e.dataTransfer?.files.length) void processFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files?.length) void processFiles(fileInput.files);
});

async function processFiles(files: FileList | File[]): Promise<void> {
  const collected = await collectFiles(files);
  renderReport(collected);
}
