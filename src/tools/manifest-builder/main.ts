import { initShell } from '../../shared/shell/initShell';
import { buildManifestJson } from '../../shared/web/manifest';
import { copyText, downloadBlob } from '../../shared/image/encode';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const nameInput = $<HTMLInputElement>('#appName');
const shortNameInput = $<HTMLInputElement>('#shortName');
const themeColorInput = $<HTMLInputElement>('#themeColor');
const bgColorInput = $<HTMLInputElement>('#bgColor');
const displaySelect = $<HTMLSelectElement>('#displayMode');
const icon192Input = $<HTMLInputElement>('#icon192');
const icon512Input = $<HTMLInputElement>('#icon512');
const outputText = $<HTMLTextAreaElement>('#outputText');

function getJson(): string {
  return buildManifestJson({
    name: nameInput.value || 'Your Website',
    shortName: shortNameInput.value || 'Website',
    themeColor: themeColorInput.value,
    backgroundColor: bgColorInput.value,
    display: displaySelect.value,
    icon192: icon192Input.value || '/android-chrome-192.png',
    icon512: icon512Input.value || '/android-chrome-512.png',
  });
}

function render(): void {
  outputText.value = getJson();
}

initShell({ activeToolId: 'manifest-builder' });
[
  nameInput,
  shortNameInput,
  themeColorInput,
  bgColorInput,
  displaySelect,
  icon192Input,
  icon512Input,
].forEach((el) => {
  el.addEventListener('input', render);
  el.addEventListener('change', render);
});

$('#copyBtn').addEventListener('click', async () => {
  await copyText(getJson());
  showToast('Manifest copied.');
});

$('#downloadBtn').addEventListener('click', async () => {
  await downloadBlob(
    new Blob([getJson()], { type: 'application/manifest+json' }),
    'site.webmanifest',
  );
  showToast('Manifest downloaded.');
});

render();
