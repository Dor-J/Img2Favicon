import { initShell } from '../../shared/shell/initShell';
import { loadImageFromFile } from '../../shared/image/loadImage';
import { downloadBlob } from '../../shared/image/encode';
import {
  renderSocialCardCanvas,
  socialCardFilename,
  type SocialPlatform,
} from '../../shared/image/socialCard';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const titleInput = $<HTMLInputElement>('#cardTitle');
const descInput = $<HTMLTextAreaElement>('#cardDesc');
const domainInput = $<HTMLInputElement>('#cardDomain');
const imageInput = $<HTMLInputElement>('#cardImage');
const previewCanvas = $<HTMLCanvasElement>('#previewCanvas');
let cardImage: HTMLImageElement | null = null;
let platform: SocialPlatform = 'twitter';

function drawCard(): void {
  const canvas = renderSocialCardCanvas(
    {
      platform,
      title: titleInput.value,
      description: descInput.value,
      domain: domainInput.value,
    },
    cardImage,
  );
  previewCanvas.width = canvas.width;
  previewCanvas.height = canvas.height;
  previewCanvas.getContext('2d')!.drawImage(canvas, 0, 0);
}

initShell({ activeToolId: 'social-card' });
[titleInput, descInput, domainInput].forEach((el) => el.addEventListener('input', drawCard));
imageInput.addEventListener('change', async () => {
  const file = imageInput.files?.[0];
  if (!file) return;
  const loaded = await loadImageFromFile(file);
  cardImage = loaded.image;
  drawCard();
});
document.querySelectorAll('#platformMode button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#platformMode button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    platform = btn.getAttribute('data-platform') as SocialPlatform;
    drawCard();
  });
});
$('#downloadBtn').addEventListener('click', async () => {
  const blob = await new Promise<Blob | null>((r) => previewCanvas.toBlob(r, 'image/png'));
  if (blob) {
    await downloadBlob(blob, socialCardFilename(platform));
    showToast('Card downloaded.');
  }
});
drawCard();
