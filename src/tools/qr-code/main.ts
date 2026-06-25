import QRCode from 'qrcode';
import { initShell } from '../../shared/shell/initShell';
import { downloadBlob } from '../../shared/image/encode';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const textInput = $<HTMLTextAreaElement>('#qrText');
const sizeInput = $<HTMLInputElement>('#qrSize');
const ecSelect = $<HTMLSelectElement>('#qrEc');
const formatSelect = $<HTMLSelectElement>('#qrFormat');
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');

async function render(): Promise<void> {
  const text = textInput.value.trim() || 'https://example.com';
  const size = Math.max(128, Number(sizeInput.value) || 256);
  previewCanvas.width = size;
  previewCanvas.height = size;
  await QRCode.toCanvas(previewCanvas, text, {
    width: size,
    errorCorrectionLevel: ecSelect.value as 'L' | 'M' | 'Q' | 'H',
    margin: 2,
  });
}

async function download(): Promise<void> {
  const text = textInput.value.trim();
  if (!text) {
    showToast('Enter text or URL.');
    return;
  }

  const size = Math.max(128, Number(sizeInput.value) || 256);
  const format = formatSelect.value;

  if (format === 'svg') {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      errorCorrectionLevel: ecSelect.value as 'L' | 'M' | 'Q' | 'H',
      width: size,
    });
    await downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), 'qrcode.svg');
  } else {
    await render();
    const blob = await new Promise<Blob | null>((resolve) => {
      previewCanvas.toBlob(resolve, 'image/png');
    });
    if (!blob) {
      showToast('Failed to generate QR code.');
      return;
    }
    await downloadBlob(blob, 'qrcode.png');
  }
  showToast('QR code downloaded.');
}

initShell({ activeToolId: 'qr-code' });
[textInput, sizeInput, ecSelect, formatSelect].forEach((el) => {
  el.addEventListener('input', () => void render());
  el.addEventListener('change', () => void render());
});
$('#primaryAction').addEventListener('click', () => void download());
void render();
