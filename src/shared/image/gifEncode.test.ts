import { describe, expect, it, vi } from 'vitest';
import { encodeGif, encodeGifBlob } from './gifEncode';

function frameCanvas(): HTMLCanvasElement {
  const imageData = new ImageData(4, 4);
  for (let i = 0; i < imageData.data.length; i += 4) {
    imageData.data[i] = 255;
    imageData.data[i + 3] = 255;
  }

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    getImageData: vi.fn(() => imageData),
  } as unknown as CanvasRenderingContext2D);

  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 4;
  return canvas;
}

describe('encodeGif', () => {
  it('encodes a single-frame GIF', () => {
    const bytes = encodeGif([frameCanvas()], 100);
    expect(bytes.length).toBeGreaterThan(0);
    expect(bytes[0]).toBe(0x47);
    expect(bytes[1]).toBe(0x49);
    expect(bytes[2]).toBe(0x46);
  });

  it('throws when no frames provided', () => {
    expect(() => encodeGif([], 100)).toThrow(/At least one frame/);
  });
});

describe('encodeGifBlob', () => {
  it('returns a GIF blob', () => {
    const blob = encodeGifBlob([frameCanvas(), frameCanvas()], 200);
    expect(blob.type).toBe('image/gif');
    expect(blob.size).toBeGreaterThan(0);
  });
});
