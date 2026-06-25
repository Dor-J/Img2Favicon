import { initShell } from '../../shared/shell/initShell';
import { checkContrast } from '../../shared/image/contrast';
import { copyText } from '../../shared/image/encode';
import { $ } from '../../shared/tools/toolHelpers';
import { showToast } from '../../shared/ui/toast';
import '../../styles/shared.css';

const fgInput = $<HTMLInputElement>('#fgColor');
const bgInput = $<HTMLInputElement>('#bgColor');
const resultEl = $<HTMLElement>('#contrastResult');
const swatchEl = $<HTMLElement>('#contrastSwatch');

function render(): void {
  const result = checkContrast(fgInput.value, bgInput.value);
  swatchEl.style.background = bgInput.value;
  swatchEl.style.color = fgInput.value;
  swatchEl.textContent = 'Sample text Aa';
  resultEl.innerHTML = `
    <p><strong>Contrast ratio:</strong> ${result.ratioFormatted}:1</p>
    <ul class="contrast-list">
      <li class="${result.normalAA ? 'pass' : 'fail'}">Normal text AA (4.5:1): ${result.normalAA ? 'Pass' : 'Fail'}</li>
      <li class="${result.normalAAA ? 'pass' : 'fail'}">Normal text AAA (7:1): ${result.normalAAA ? 'Pass' : 'Fail'}</li>
      <li class="${result.largeAA ? 'pass' : 'fail'}">Large text AA (3:1): ${result.largeAA ? 'Pass' : 'Fail'}</li>
      <li class="${result.largeAAA ? 'pass' : 'fail'}">Large text AAA (4.5:1): ${result.largeAAA ? 'Pass' : 'Fail'}</li>
    </ul>`;
}

initShell({ activeToolId: 'contrast-checker' });
[fgInput, bgInput].forEach((el) => el.addEventListener('input', render));
$('#copyRatio').addEventListener('click', async () => {
  await copyText(checkContrast(fgInput.value, bgInput.value).ratioFormatted);
  showToast('Ratio copied.');
});
render();
