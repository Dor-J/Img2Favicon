import exifr from 'exifr';
import { initShell } from '../../shared/shell/initShell';
import { bindFileDrop, resetDropzone, setDropzoneLoaded } from '../../shared/ui/fileDrop';
import { copyText } from '../../shared/image/encode';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const outputText = $<HTMLTextAreaElement>('#outputText');
const metaEl = $<HTMLElement>('#metaInfo');

initShell({ activeToolId: 'metadata-viewer' });

bindFileDrop({
  dropzone: $<HTMLElement>('#dropzone'),
  input: $<HTMLInputElement>('#imageInput'),
  onFile: async (file) => {
    setDropzoneLoaded(
      $<HTMLElement>('#dropzone'),
      $<HTMLElement>('#uploadTitle'),
      $<HTMLElement>('#uploadSub'),
      $<HTMLElement>('#uploadName'),
      $<HTMLImageElement>('#uploadThumb'),
      file,
      0,
      0,
      URL.createObjectURL(file),
    );

    try {
      const metadata = await exifr.parse(file, { translateKeys: true });
      outputText.value = JSON.stringify(metadata ?? {}, null, 2);
      metaEl.textContent = metadata
        ? `Parsed metadata from ${file.name}`
        : `No embedded metadata found in ${file.name}`;
    } catch {
      outputText.value = '{}';
      metaEl.textContent = 'Could not parse metadata from this file.';
    }
  },
});

$('#clearImage').addEventListener('click', () => {
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

$('#copyBtn').addEventListener('click', async () => {
  if (!outputText.value) {
    showToast('Load an image first.');
    return;
  }
  await copyText(outputText.value);
  showToast('Metadata copied.');
});
