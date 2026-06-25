import { buildFaviconManifestText } from '../../../shared/web/manifest';
import type { AppState } from './types';
import { ICO_SIZES } from './constants';
import { createIconCanvas, canvasToBlob, getPngArrayBuffer } from './render';

export { buildInstallationSnippet } from '../../../shared/web/htmlSnippet';

/** Serializes PWA manifest JSON for the current icon state. */
export function buildManifestText(state: AppState): string {
  return buildFaviconManifestText(
    state.colorOne,
    state.background === 'transparent' ? '#ffffff' : state.colorOne,
  );
}

/** Serializes legacy browserconfig XML for Windows tiles. */
export function buildBrowserConfigText(themeColor: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig><msapplication><tile><square150x150logo src="/mstile-150x150.png"/><TileColor>${themeColor}</TileColor></tile></msapplication></browserconfig>
`;
}

/** Encodes PNG buffers into a multi-size ICO blob. */
export function buildIcoBlob(buffers: ArrayBuffer[]): Blob {
  const header = 6;
  const entry = 16;
  const imagesLength = buffers.reduce((total, item) => total + item.byteLength, 0);
  const output = new ArrayBuffer(header + entry * buffers.length + imagesLength);
  const view = new DataView(output);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, buffers.length, true);

  let imageOffset = header + entry * buffers.length;
  buffers.forEach((buffer, index) => {
    const size = ICO_SIZES[index] ?? 16;
    const dimension = size >= 256 ? 0 : size;
    const base = header + entry * index;
    view.setUint8(base, dimension);
    view.setUint8(base + 1, dimension);
    view.setUint8(base + 2, 0);
    view.setUint8(base + 3, 0);
    view.setUint16(base + 4, 1, true);
    view.setUint16(base + 6, 32, true);
    view.setUint32(base + 8, buffer.byteLength, true);
    view.setUint32(base + 12, imageOffset, true);
    new Uint8Array(output, imageOffset, buffer.byteLength).set(new Uint8Array(buffer));
    imageOffset += buffer.byteLength;
  });

  return new Blob([output], { type: 'image/x-icon' });
}

/** Generates a favicon.ico blob from the current editor state. */
export async function generateIcoBlob(state: AppState): Promise<Blob> {
  const buffers = await Promise.all(
    ICO_SIZES.map((size) => getPngArrayBuffer(size, state)),
  );
  return buildIcoBlob(buffers);
}

/** Encodes PNG canvas data as base64 for embedding in SVG. */
async function canvasToBase64(sourceCanvas: HTMLCanvasElement): Promise<string> {
  const blob = await canvasToBlob(sourceCanvas);
  if (!blob) {
    throw new Error('Failed to encode PNG for SVG export.');
  }

  const buffer = await blob.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;

  for (let index = 0; index < bytes.length; index += chunk) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunk));
  }

  return btoa(binary);
}

/** Generates an SVG favicon blob from the current editor state. */
export async function generateSvgBlob(state: AppState): Promise<Blob> {
  const imageCanvas = createIconCanvas(512, state);
  const base64 = await canvasToBase64(imageCanvas);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,${base64}"/></svg>`;
  return new Blob([svg], { type: 'image/svg+xml' });
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

/** Downloads a PNG favicon at the requested size. */
export async function downloadPng(
  size: number,
  filename: string,
  state: AppState,
): Promise<void> {
  const canvas = createIconCanvas(size, state);
  const blob = await canvasToBlob(canvas);
  if (!blob) {
    throw new Error('Failed to encode PNG.');
  }
  await downloadBlob(blob, filename);
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
