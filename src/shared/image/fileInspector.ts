/** Image file statistics for the file inspector tool. */
export interface FileInspectResult {
  name: string;
  mime: string;
  sizeBytes: number;
  width: number;
  height: number;
  aspectRatio: string;
  megapixels: string;
  hasAlpha: boolean;
  orientation: 'landscape' | 'portrait' | 'square';
}

/** Computes aspect ratio as a simplified string. */
export function formatAspectRatio(width: number, height: number): string {
  if (width === height) return '1:1';
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(width, height);
  return `${width / d}:${height / d}`;
}

/** Detects whether an image canvas has any transparent pixels. */
export function detectAlphaChannel(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return false;
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let i = 3; i < data.length; i += 16) {
    if (data[i]! < 255) return true;
  }
  return false;
}

/** Builds inspection stats from a loaded image file. */
export function buildFileInspectResult(
  file: File,
  width: number,
  height: number,
  hasAlpha: boolean,
): FileInspectResult {
  const orientation =
    width === height ? 'square' : width > height ? 'landscape' : 'portrait';
  return {
    name: file.name,
    mime: file.type || 'unknown',
    sizeBytes: file.size,
    width,
    height,
    aspectRatio: formatAspectRatio(width, height),
    megapixels: ((width * height) / 1_000_000).toFixed(2),
    hasAlpha,
    orientation,
  };
}

/** Formats inspection result as readable text. */
export function formatInspectText(result: FileInspectResult): string {
  return [
    `File: ${result.name}`,
    `MIME: ${result.mime}`,
    `Size: ${result.sizeBytes} bytes`,
    `Dimensions: ${result.width} × ${result.height}`,
    `Aspect ratio: ${result.aspectRatio}`,
    `Megapixels: ${result.megapixels} MP`,
    `Orientation: ${result.orientation}`,
    `Alpha channel: ${result.hasAlpha ? 'yes' : 'no'}`,
  ].join('\n');
}
