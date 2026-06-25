import { drawShapePath } from '../../../shared/image/shape';
import type { AppState } from './types';
import { MASTER_SIZE } from './constants';

/** Renders the favicon into a 2D canvas context at the requested size. */
export function renderIcon(
  context: CanvasRenderingContext2D,
  size: number,
  state: AppState,
): void {
  context.clearRect(0, 0, size, size);
  const scale = size / MASTER_SIZE;

  context.save();
  drawShapePath(context, size, state.shape);
  context.clip();

  if (state.background !== 'transparent') {
    if (state.background === 'solid') {
      context.fillStyle = state.colorOne;
    } else {
      const angle = ((state.angle - 90) * Math.PI) / 180;
      const cx = size / 2;
      const cy = size / 2;
      const radius = size * 0.72;
      const gradient = context.createLinearGradient(
        cx - Math.cos(angle) * radius,
        cy - Math.sin(angle) * radius,
        cx + Math.cos(angle) * radius,
        cy + Math.sin(angle) * radius,
      );
      gradient.addColorStop(0, state.colorOne);
      gradient.addColorStop(1, state.colorTwo);
      context.fillStyle = gradient;
    }
    context.fillRect(0, 0, size, size);
  }

  if (state.source === 'image' && state.image) {
    const pad = (state.padding / 100) * size;
    const usable = Math.max(1, size - pad * 2);
    const base = Math.max(usable / state.image.width, usable / state.image.height);
    const zoom = state.zoom / 100;
    const width = state.image.width * base * zoom;
    const height = state.image.height * base * zoom;
    const x = (size - width) / 2 + state.panX * scale;
    const y = (size - height) / 2 + state.panY * scale;

    context.save();
    context.translate(size / 2, size / 2);
    context.rotate((state.rotation * Math.PI) / 180);
    context.translate(-size / 2, -size / 2);
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(state.image, x, y, width, height);
    context.restore();
  }

  if (state.source === 'text') {
    const fontSize = Math.round(size * (state.textScale / 100));
    context.fillStyle = state.textColor;
    context.font = `${state.weight} ${fontSize}px ${state.font}`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(
      (state.text || 'F').slice(0, 3).toUpperCase(),
      size / 2,
      size * 0.515,
    );
  }

  context.restore();
}

/** Creates an offscreen canvas containing the rendered icon. */
export function createIconCanvas(
  size: number,
  state: AppState,
  documentRef: Document = document,
): HTMLCanvasElement {
  const canvas = documentRef.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  renderIcon(canvas.getContext('2d', { alpha: true })!, size, state);
  return canvas;
}

/** Converts canvas pixels to a PNG blob. */
export function canvasToBlob(
  sourceCanvas: HTMLCanvasElement,
  type = 'image/png',
): Promise<Blob | null> {
  return new Promise((resolve) => sourceCanvas.toBlob(resolve, type));
}

/** Returns PNG bytes for an icon rendered at the requested size. */
export async function getPngArrayBuffer(
  size: number,
  state: AppState,
  documentRef: Document = document,
): Promise<ArrayBuffer> {
  const canvas = createIconCanvas(size, state, documentRef);
  const blob = await canvasToBlob(canvas);
  if (!blob) {
    throw new Error('Failed to encode PNG.');
  }
  return blob.arrayBuffer();
}

/** Updates a range input's label and CSS progress variable. */
export function updateRangeDisplay(
  input: HTMLInputElement,
  output: HTMLOutputElement,
  suffix = '',
): void {
  output.textContent = `${input.value}${suffix}`;
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const pct = ((Number(input.value) - min) / (max - min)) * 100;
  input.style.setProperty('--range-progress', `${pct}%`);
}
