import {
  ACCEPTED_IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  MAX_IMAGE_EDGE,
  MAX_IMAGE_PIXELS,
} from './constants';
import { isImageWithinLimits, verifyImageFileSignature } from './validation';

export interface LoadedImage {
  image: HTMLImageElement;
  file: File;
  url: string;
  width: number;
  height: number;
}

/** Loads and validates an image file for client-side processing. */
export async function loadImageFromFile(file: File): Promise<LoadedImage> {
  if (
    !ACCEPTED_IMAGE_TYPES.has(file.type) ||
    file.size === 0 ||
    file.size > MAX_IMAGE_BYTES
  ) {
    throw new Error('Choose a PNG, JPG, WebP, or GIF under 20 MB.');
  }

  if (!(await verifyImageFileSignature(file))) {
    throw new Error('That file does not contain a supported image format.');
  }

  const url = URL.createObjectURL(file);
  const image = await decodeImage(url);

  if (
    !isImageWithinLimits(
      image.naturalWidth,
      image.naturalHeight,
      MAX_IMAGE_EDGE,
      MAX_IMAGE_PIXELS,
    )
  ) {
    URL.revokeObjectURL(url);
    throw new Error('That image is too large. Use an image below 32 megapixels.');
  }

  return {
    image,
    file,
    url,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
}

/** Revokes an object URL created during image loading. */
export function revokeLoadedImage(loaded: LoadedImage | null): void {
  if (loaded?.url) URL.revokeObjectURL(loaded.url);
}

function decodeImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('That image could not be decoded.'));
    image.src = url;
  });
}

/** Draws a loaded image onto a canvas at native resolution. */
export function imageToCanvas(loaded: LoadedImage): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = loaded.width;
  canvas.height = loaded.height;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  ctx.drawImage(loaded.image, 0, 0);
  return canvas;
}

/** Creates a canvas from any drawable image source. */
export function drawableToCanvas(
  source: CanvasImageSource,
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: true })!;
  ctx.drawImage(source, 0, 0, width, height);
  return canvas;
}
