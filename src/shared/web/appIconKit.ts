import { canvasToBlob } from '../image/encode';
import { fitImageToCanvas, type FitMode } from '../image/fitModes';

/** Standard app icon export sizes for iOS and Android. */
export const APP_ICON_SIZES = [
  [1024, 'icon-1024.png'],
  [512, 'icon-512.png'],
  [192, 'icon-192.png'],
  [180, 'icon-180.png'],
  [167, 'icon-167.png'],
  [152, 'icon-152.png'],
  [144, 'icon-144.png'],
  [120, 'icon-120.png'],
  [96, 'icon-96.png'],
  [72, 'icon-72.png'],
  [48, 'icon-48.png'],
] as const;

/** Creates a square app icon canvas at the requested size. */
export function createAppIconCanvas(
  source: HTMLCanvasElement,
  size: number,
  mode: FitMode,
  background: string,
): HTMLCanvasElement {
  return fitImageToCanvas(source, size, size, mode, background);
}

/** Encodes an app icon canvas to PNG blob. */
export async function appIconToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const blob = await canvasToBlob(canvas);
  if (!blob) throw new Error('Failed to encode PNG.');
  return blob;
}
