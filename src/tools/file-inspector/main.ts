import { initShell } from '../../shared/shell/initShell';
import { bindFileDrop, resetDropzone, setDropzoneLoaded } from '../../shared/ui/fileDrop';
import { loadImageFromFile } from '../../shared/image/loadImage';
import {
  buildFileInspectResult,
  detectAlphaChannel,
  formatInspectText,
} from '../../shared/image/fileInspector';
import { copyText, formatFileSize } from '../../shared/image/encode';
import { imageToCanvas } from '../../shared/image/loadImage';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const outputText = $<HTMLTextAreaElement>('#outputText');
const metaEl = $<HTMLElement>('#metaInfo');

initShell({ activeToolId: 'file-inspector' });
bindFileDrop({
  dropzone: $<HTMLElement>('#dropzone'),
  input: $<HTMLInputElement>('#imageInput'),
  onFile: async (file) => {
    const loaded = await loadImageFromFile(file);
    setDropzoneLoaded(
      $<HTMLElement>('#dropzone'), $<HTMLElement>('#uploadTitle'), $<HTMLElement>('#uploadSub'),
      $<HTMLElement>('#uploadName'), $<HTMLImageElement>('#uploadThumb'),
      file, loaded.width, loaded.height, loaded.url,
    );
    const canvas = imageToCanvas(loaded);
    const result = buildFileInspectResult(file, loaded.width, loaded.height, detectAlphaChannel(canvas));
    outputText.value = formatInspectText(result);
    metaEl.textContent = `${result.width}×${result.height} · ${formatFileSize(result.sizeBytes)} · ${result.mime}`;
  },
});
$('#clearImage').addEventListener('click', () => {
  outputText.value = '';
  metaEl.textContent = 'Upload a file to begin.';
  resetDropzone($<HTMLElement>('#dropzone'), $<HTMLElement>('#uploadTitle'), $<HTMLElement>('#uploadSub'),
    $<HTMLElement>('#uploadName'), document.querySelector('#uploadThumb'), $<HTMLInputElement>('#imageInput'));
});
$('#copyBtn').addEventListener('click', async () => {
  if (!outputText.value) { showToast('Load a file first.'); return; }
  await copyText(outputText.value);
  showToast('Stats copied.');
});
