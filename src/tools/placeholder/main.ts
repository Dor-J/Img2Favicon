import { initShell } from '../../shared/shell/initShell';
import { downloadBlob } from '../../shared/image/encode';
import { placeholderFilename, renderPlaceholderCanvas } from '../../shared/image/placeholder';
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
  const canvas = renderPlaceholderCanvas({
    width: Number(widthInput.value),
    height: Number(heightInput.value),
    backgroundColor: bgColorInput.value,
    textColor: textColorInput.value,
    label: labelInput.value,
  });
  previewCanvas.width = canvas.width;
  previewCanvas.height = canvas.height;
  previewCanvas.getContext('2d')!.drawImage(canvas, 0, 0);
}

async function download(): Promise<void> {
  const canvas = renderPlaceholderCanvas({
    width: Number(widthInput.value),
    height: Number(heightInput.value),
    backgroundColor: bgColorInput.value,
    textColor: textColorInput.value,
    label: labelInput.value,
  });
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png');
  });
  if (!blob) {
    showToast('Failed to generate PNG.');
    return;
  }
  await downloadBlob(blob, placeholderFilename(canvas.width, canvas.height));
  showToast('Placeholder downloaded.');
}

initShell({ activeToolId: 'placeholder' });
[widthInput, heightInput, bgColorInput, textColorInput, labelInput].forEach((el) => {
  el.addEventListener('input', render);
});
$('#primaryAction').addEventListener('click', () => void download());
render();
