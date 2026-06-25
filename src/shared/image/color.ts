/** Parses a hex color string into RGB components. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '');
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

/** Returns true when two hex colors are visually similar. */
export function colorsAreSimilar(a: string, b: string, threshold = 90): boolean {
  const left = hexToRgb(a);
  const right = hexToRgb(b);
  return (
    Math.abs(left.r - right.r) +
      Math.abs(left.g - right.g) +
      Math.abs(left.b - right.b) <
    threshold
  );
}

/** Deduplicates similar hex colors while preserving order. */
export function dedupeSimilarColors(colors: string[]): string[] {
  return colors.filter(
    (color, index, arr) =>
      arr.findIndex((other) => colorsAreSimilar(color, other)) === index,
  );
}

/** Converts RGB channels to a lowercase hex color. */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((value) => Math.min(255, value).toString(16).padStart(2, '0'))
    .join('')}`;
}

/** Formats extracted colors as CSS custom properties. */
export function colorsToCssVariables(colors: string[]): string {
  return colors.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n');
}
