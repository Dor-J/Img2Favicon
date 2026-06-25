import type { OutputFormat } from './constants';
import { FORMAT_EXT, FORMAT_MIME } from './constants';

export interface EncodeOptions {
  format: OutputFormat;
  quality?: number;
}

let avifSupported: boolean | undefined;

/** Detects whether the browser can encode AVIF via canvas. */
export async function detectAvifSupport(): Promise<boolean> {
  if (avifSupported !== undefined) return avifSupported;

  if (typeof document === 'undefined') {
    avifSupported = false;
    return false;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const blob = await canvasToBlob(canvas, 'image/avif', 0.5);
  avifSupported = blob !== null && blob.size > 0;
  return avifSupported;
}

/** Converts a canvas to a blob with the given MIME type. */
export function canvasToBlob(
  sourceCanvas: HTMLCanvasElement,
  type = 'image/png',
  quality?: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    sourceCanvas.toBlob(resolve, type, quality);
  });
}

/** Encodes a canvas using a named output format. */
export async function encodeCanvas(
  canvas: HTMLCanvasElement,
  options: EncodeOptions,
): Promise<Blob> {
  const mime = FORMAT_MIME[options.format];
  const quality = options.format === 'png' ? undefined : (options.quality ?? 0.92);
  const blob = await canvasToBlob(canvas, mime, quality);
  if (!blob) {
    throw new Error(`Failed to encode ${options.format.toUpperCase()}.`);
  }
  return blob;
}

/** Returns a file extension for the given output format. */
export function extensionForFormat(format: OutputFormat): string {
  return FORMAT_EXT[format];
}

/** Builds a download filename from base name and format. */
export function buildFilename(baseName: string, format: OutputFormat): string {
  const stem = baseName.replace(/\.[^.]+$/, '') || 'image';
  return `${stem}.${extensionForFormat(format)}`;
}

/** Triggers a file download for the provided blob. */
export async function downloadBlob(blob: Blob, filename: string): Promise<void> {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Formats byte count for display. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Copies text to the clipboard with a DOM fallback. */
export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
}
