import { describe, expect, it, vi } from 'vitest';
import { applyDuotone } from './duotone';

function mockCanvasContext(pixels: number[]): CanvasRenderingContext2D {
  const imageData = new ImageData(2, 2);
  imageData.data.set(pixels);
  return {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => imageData),
    putImageData: vi.fn(),
    filter: '',
  } as unknown as CanvasRenderingContext2D;
}

describe('applyDuotone', () => {
  it('returns a canvas matching source dimensions', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCanvasContext([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 128, 128, 128, 255]),
    );

    const source = document.createElement('canvas');
    source.width = 2;
    source.height = 2;
    const result = applyDuotone(source, 'grayscale', '#000000', '#ffffff');
    expect(result.width).toBe(2);
    expect(result.height).toBe(2);
  });

  it('writes adjusted pixels back to canvas', () => {
    const ctx = mockCanvasContext([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 128, 128, 128, 255]);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);

    const source = document.createElement('canvas');
    source.width = 2;
    source.height = 2;
    applyDuotone(source, 'duotone', '#000000', '#ffffff');
    expect(ctx.putImageData).toHaveBeenCalled();
  });
});
