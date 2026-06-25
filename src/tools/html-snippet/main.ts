import { initShell } from '../../shared/shell/initShell';
import { buildInstallationSnippet } from '../../shared/web/htmlSnippet';
import { copyText } from '../../shared/image/encode';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const themeColorInput = $<HTMLInputElement>('#themeColor');
const faviconIcoInput = $<HTMLInputElement>('#faviconIco');
const faviconSvgInput = $<HTMLInputElement>('#faviconSvg');
const favicon32Input = $<HTMLInputElement>('#favicon32');
const appleInput = $<HTMLInputElement>('#appleTouch');
const manifestInput = $<HTMLInputElement>('#manifestPath');
const outputText = $<HTMLTextAreaElement>('#outputText');

function render(): void {
  outputText.value = buildInstallationSnippet({
    themeColor: themeColorInput.value,
    faviconIco: faviconIcoInput.value || undefined,
    faviconSvg: faviconSvgInput.value || undefined,
    favicon32: favicon32Input.value || undefined,
    appleTouchIcon: appleInput.value || undefined,
    manifest: manifestInput.value || undefined,
  });
}

initShell({ activeToolId: 'html-snippet' });
[
  themeColorInput,
  faviconIcoInput,
  faviconSvgInput,
  favicon32Input,
  appleInput,
  manifestInput,
].forEach((el) => el.addEventListener('input', render));

$('#copyBtn').addEventListener('click', async () => {
  await copyText(outputText.value);
  showToast('Snippet copied.');
});

render();
