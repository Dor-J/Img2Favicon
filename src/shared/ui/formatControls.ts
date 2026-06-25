import { detectAvifSupport } from '../image/encode';
import type { OutputFormat } from '../image/constants';

/** Populates a format select with supported output formats. */
export async function populateFormatSelect(
  select: HTMLSelectElement,
  defaultFormat: OutputFormat = 'png',
): Promise<void> {
  const avifOk = await detectAvifSupport();
  const formats: Array<{ value: OutputFormat; label: string; disabled?: boolean }> = [
    { value: 'png', label: 'PNG' },
    { value: 'jpeg', label: 'JPEG' },
    { value: 'webp', label: 'WebP' },
    { value: 'avif', label: 'AVIF', disabled: !avifOk },
  ];

  select.innerHTML = formats
    .map(
      (f) =>
        `<option value="${f.value}"${f.disabled ? ' disabled' : ''}${f.value === defaultFormat ? ' selected' : ''}>${f.label}${f.disabled ? ' (unsupported)' : ''}</option>`,
    )
    .join('');
}

/** Returns the selected output format from a select element. */
export function getSelectedFormat(select: HTMLSelectElement): OutputFormat {
  return select.value as OutputFormat;
}

/** Returns true when the format uses a quality slider. */
export function formatUsesQuality(format: OutputFormat): boolean {
  return format === 'jpeg' || format === 'webp' || format === 'avif';
}

/** Binds quality slider visibility to format select changes. */
export function bindQualityVisibility(
  formatSelect: HTMLSelectElement,
  qualityField: HTMLElement,
): void {
  const update = (): void => {
    qualityField.classList.toggle('hide', !formatUsesQuality(getSelectedFormat(formatSelect)));
  };
  formatSelect.addEventListener('change', update);
  update();
}
