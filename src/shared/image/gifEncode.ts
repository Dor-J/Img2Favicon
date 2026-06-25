import { GIFEncoder, quantize, applyPalette } from 'gifenc';

/** Encodes frame canvases into an animated GIF blob. */
export function encodeGif(
  frames: HTMLCanvasElement[],
  delayMs: number,
  repeat = 0,
): Uint8Array {
  if (!frames.length) throw new Error('At least one frame is required.');

  const gif = GIFEncoder();
  const delayCs = Math.max(1, Math.round(delayMs / 10));

  for (const frame of frames) {
    const ctx = frame.getContext('2d', { alpha: true })!;
    const { data, width, height } = ctx.getImageData(0, 0, frame.width, frame.height);
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    gif.writeFrame(index, width, height, {
      palette,
      delay: delayCs,
      repeat,
    });
  }

  gif.finish();
  return gif.bytes();
}

/** Encodes frames to a GIF Blob. */
export function encodeGifBlob(
  frames: HTMLCanvasElement[],
  delayMs: number,
  repeat = 0,
): Blob {
  const bytes = encodeGif(frames, delayMs, repeat);
  return new Blob([Uint8Array.from(bytes)], { type: 'image/gif' });
}
