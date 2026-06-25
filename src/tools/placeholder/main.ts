import { initShell } from '../../shared/shell/initShell';
import { downloadBlob } from '../../shared/image/encode';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const widthInput = $<HTMLInputElement>('#widthInput');
const heightInput = $<HTMLInputElement>('#heightInput');
const bgColorInput = $<HTMLInputElement>('#bgColorInput');
const textColorInput = $<HTMLInputElement>('#textColorInput');
const labelInput = $<HTMLInputElement>('#labelInput');
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');

function render(): void {
  const width = Math.max(1, Number(widthInput.value) || 400);
  const height = Math.max(1, Number(heightInput.value) || 300);
  previewCanvas.width = width;
  previewCanvas.height = height;
  const ctx = previewCanvas.getContext('2d')!;
  ctx.fillStyle = bgColorInput.value;
  ctx.fillRect(0, 0, width, height);

  const label = labelInput.value.trim();
  if (label) {
    ctx.fillStyle = textColorInput.value;
    ctx.font = `bold ${Math.round(Math.min(width, height) / 8)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, width / 2, height / 2);
  }
}

async function download(): Promise<void> {
  render();
  const blob = await new Promise<Blob | null>((resolve) => {
    previewCanvas.toBlob(resolve, 'image/png');
  });
  if (!blob) {
    showToast('Failed to generate PNG.');
    return;
  }
  await downloadBlob(blob, `placeholder-${previewCanvas.width}x${previewCanvas.height}.png`);
  showToast('Placeholder downloaded.');
}

initShell({ activeToolId: 'placeholder' });
[widthInput, heightInput, bgColorInput, textColorInput, labelInput].forEach((el) => {
  el.addEventListener('input', render);
});
$('#primaryAction').addEventListener('click', () => void download());
render();
