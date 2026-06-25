/** CSS filter values for the filter playground. */
export interface CssFilterValues {
  blur: number;
  brightness: number;
  contrast: number;
  grayscale: number;
  saturate: number;
  sepia: number;
  hueRotate: number;
  invert: number;
}

/** Builds a CSS filter property value from slider inputs. */
export function buildCssFilterString(values: CssFilterValues): string {
  const parts: string[] = [];
  if (values.blur > 0) parts.push(`blur(${values.blur}px)`);
  if (values.brightness !== 100) parts.push(`brightness(${values.brightness}%)`);
  if (values.contrast !== 100) parts.push(`contrast(${values.contrast}%)`);
  if (values.grayscale > 0) parts.push(`grayscale(${values.grayscale}%)`);
  if (values.saturate !== 100) parts.push(`saturate(${values.saturate}%)`);
  if (values.sepia > 0) parts.push(`sepia(${values.sepia}%)`);
  if (values.hueRotate > 0) parts.push(`hue-rotate(${values.hueRotate}deg)`);
  if (values.invert > 0) parts.push(`invert(${values.invert}%)`);
  return parts.length ? parts.join(' ') : 'none';
}

/** Default neutral CSS filter values. */
export function defaultCssFilterValues(): CssFilterValues {
  return {
    blur: 0,
    brightness: 100,
    contrast: 100,
    grayscale: 0,
    saturate: 100,
    sepia: 0,
    hueRotate: 0,
    invert: 0,
  };
}
