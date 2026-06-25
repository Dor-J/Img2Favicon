/** Extracts dominant colors from raw RGBA image data. */
export function extractDominantColors(
  data: Uint8ClampedArray,
  maxColors = 7,
): string[] {
  const bins = new Map<string, number>();

  for (let index = 0; index < data.length; index += 16) {
    const alpha = data[index + 3];
    if (alpha === undefined || alpha < 150) continue;

    const r = Math.round(data[index]! / 32) * 32;
    const g = Math.round(data[index + 1]! / 32) * 32;
    const b = Math.round(data[index + 2]! / 32) * 32;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 16 || brightness > 246) continue;

    const key = `${Math.min(255, r)},${Math.min(255, g)},${Math.min(255, b)}`;
    bins.set(key, (bins.get(key) ?? 0) + 1);
  }

  return [...bins.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([key]) => {
      const [r, g, b] = key.split(',').map(Number);
      return `#${[r, g, b]
        .map((value) => value.toString(16).padStart(2, '0'))
        .join('')}`;
    })
    .slice(0, maxColors);
}

/** Extracts dominant colors from a canvas image. */
export function extractColorsFromCanvas(
  canvas: HTMLCanvasElement,
  maxColors = 7,
): string[] {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return [];
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return extractDominantColors(data, maxColors);
}
