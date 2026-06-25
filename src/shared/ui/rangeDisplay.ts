/** Updates a range input label and CSS progress variable. */
export function updateRangeDisplay(
  input: HTMLInputElement,
  output: HTMLOutputElement,
  suffix = '',
): void {
  output.textContent = `${input.value}${suffix}`;
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const pct = ((Number(input.value) - min) / (max - min)) * 100;
  input.style.setProperty('--range-progress', `${pct}%`);
}
