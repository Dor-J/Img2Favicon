import JSZip from 'jszip';
import { initShell } from '../../shared/shell/initShell';
import { validatePwaIcons } from '../../shared/web/pwaIconCheck';
import { $ } from '../../shared/tools/toolHelpers';
import '../../styles/shared.css';

const reportPanel = $<HTMLElement>('#reportPanel');
const dropzone = $<HTMLElement>('#dropzone');
const fileInput = $<HTMLInputElement>('#fileInput');

async function getDims(file: File): Promise<{ name: string; width: number; height: number }> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    return { name: file.name, width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function processFiles(files: FileList | File[]): Promise<void> {
  const collected: { name: string; width: number; height: number }[] = [];
  for (const file of files) {
    if (file.name.toLowerCase().endsWith('.zip')) {
      const zip = await JSZip.loadAsync(file);
      for (const [path, entry] of Object.entries(zip.files)) {
        if (entry.dir) continue;
        const blob = await entry.async('blob');
        const inner = new File([blob], path.split('/').pop() ?? path);
        if (inner.type.startsWith('image/')) collected.push(await getDims(inner));
      }
    } else if (file.type.startsWith('image/')) {
      collected.push(await getDims(file));
    }
  }
  const results = validatePwaIcons(collected);
  reportPanel.innerHTML = results.map((r) =>
    `<div class="report-item ${r.status === 'ok' ? 'ok' : r.status === 'warn' ? 'warn' : 'error'}"><strong>${r.filename}</strong><br>${r.message}</div>`,
  ).join('');
}

initShell({ activeToolId: 'icon-checker' });
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  if (e.dataTransfer?.files.length) void processFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', () => { if (fileInput.files?.length) void processFiles(fileInput.files); });
