import type { LoadedImage } from '../image/loadImage';
import type { OutputFormat } from '../image/constants';
import {
  buildFilename,
  downloadBlob,
  encodeCanvas,
  formatFileSize,
} from '../image/encode';
import { showToast } from '../ui/toast';

export const $ = <T extends Element>(selector: string, root: ParentNode = document): T =>
  root.querySelector(selector)!;

/** Downloads a canvas using the selected format and quality. */
export async function downloadCanvas(
  canvas: HTMLCanvasElement,
  loaded: LoadedImage,
  format: OutputFormat,
  quality: number,
): Promise<void> {
  const blob = await encodeCanvas(canvas, { format, quality: quality / 100 });
  await downloadBlob(blob, buildFilename(loaded.file.name, format));
  showToast('Image downloaded.');
}

/** Updates the meta info element with dimensions and size. */
export function updateMeta(el: HTMLElement, parts: string[]): void {
  el.textContent = parts.filter(Boolean).join(' · ');
}

/** Reads quality from a range input (1–100). */
export function getQuality(input: HTMLInputElement): number {
  return Number(input.value);
}

/** Builds meta parts for output dimensions and file size. */
export function formatOutputMeta(
  width: number,
  height: number,
  blob?: Blob | null,
  extra?: string,
): string[] {
  const parts = [`Output: ${width} × ${height} px`];
  if (blob) parts.push(formatFileSize(blob.size));
  if (extra) parts.push(extra);
  return parts;
}

/** Formats input file meta for display. */
export function formatInputMeta(loaded: LoadedImage): string[] {
  return [
    `Original: ${loaded.width} × ${loaded.height} px`,
    formatFileSize(loaded.file.size),
  ];
}
