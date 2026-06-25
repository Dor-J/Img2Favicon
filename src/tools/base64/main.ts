import { initShell } from '../../shared/shell/initShell';
import { bindFileDrop, resetDropzone, setDropzoneLoaded } from '../../shared/ui/fileDrop';
import { loadImageFromFile, revokeLoadedImage, type LoadedImage } from '../../shared/image/loadImage';
import { blobToDataUrl, estimateDataUrlBytes, formatByteSize } from '../../shared/image/base64';
import { copyText } from '../../shared/image/encode';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

let loaded: LoadedImage | null = null;
const outputText = $<HTMLTextAreaElement>('#outputText');
const metaEl = $<HTMLElement>('#metaInfo');
const includePrefixInput = $<HTMLInputElement>('#includePrefix');

async function updateOutput(): Promise<void> {
  if (!loaded) return;
  const dataUrl = await blobToDataUrl(loaded.file);
  const raw = dataUrl.split(',')[1] ?? '';
  outputText.value = includePrefixInput.checked ? dataUrl : raw;
  metaEl.textContent = `File: ${loaded.file.name} · ${formatByteSize(estimateDataUrlBytes(dataUrl))} encoded`;
}

initShell({ activeToolId: 'base64' });

bindFileDrop({
  dropzone: $<HTMLElement>('#dropzone'),
  input: $<HTMLInputElement>('#imageInput'),
  onFile: async (file) => {
    loaded = await loadImageFromFile(file);
    setDropzoneLoaded(
      $<HTMLElement>('#dropzone'),
      $<HTMLElement>('#uploadTitle'),
      $<HTMLElement>('#uploadSub'),
      $<HTMLElement>('#uploadName'),
      $<HTMLImageElement>('#uploadThumb'),
      file,
      loaded.width,
      loaded.height,
      loaded.url,
    );
    await updateOutput();
  },
});

$('#clearImage').addEventListener('click', () => {
  revokeLoadedImage(loaded);
  loaded = null;
  outputText.value = '';
  metaEl.textContent = 'Upload a file to begin.';
  resetDropzone(
    $<HTMLElement>('#dropzone'),
    $<HTMLElement>('#uploadTitle'),
    $<HTMLElement>('#uploadSub'),
    $<HTMLElement>('#uploadName'),
    document.querySelector('#uploadThumb'),
    $<HTMLInputElement>('#imageInput'),
  );
});

includePrefixInput.addEventListener('change', () => void updateOutput());

$('#copyBtn').addEventListener('click', async () => {
  if (!outputText.value) {
    showToast('Load an image first.');
    return;
  }
  await copyText(outputText.value);
  showToast('Copied to clipboard.');
});
