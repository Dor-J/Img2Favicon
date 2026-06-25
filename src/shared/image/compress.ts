import type { OutputFormat } from './constants';
import { FORMAT_MIME } from './constants';
import { canvasToBlob } from './encode';

export interface CompressResult {
  blob: Blob;
  quality: number;
  reachedTarget: boolean;
}

/** Binary-searches JPEG/WebP quality to approach a target file size. */
export async function compressToTargetSize(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  targetBytes: number,
  maxIterations = 8,
): Promise<CompressResult> {
  const mime = FORMAT_MIME[format];

  if (format === 'png' || format === 'avif') {
    const blob = await canvasToBlob(canvas, mime);
    return {
      blob: blob!,
      quality: 1,
      reachedTarget: (blob?.size ?? Infinity) <= targetBytes,
    };
  }

  let low = 0.1;
  let high = 1;
  let bestBlob: Blob | null = null;
  let bestQuality = high;

  for (let i = 0; i < maxIterations; i++) {
    const quality = (low + high) / 2;
    const blob = await canvasToBlob(canvas, mime, quality);
    if (!blob) break;

    bestBlob = blob;
    bestQuality = quality;

    if (blob.size > targetBytes) {
      high = quality;
    } else {
      low = quality;
    }
  }

  if (!bestBlob) {
    throw new Error('Failed to compress image.');
  }

  return {
    blob: bestBlob,
    quality: bestQuality,
    reachedTarget: bestBlob.size <= targetBytes,
  };
}
