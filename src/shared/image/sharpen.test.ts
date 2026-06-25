import { describe, expect, it, vi } from 'vitest';
import { sharpenCanvas } from './sharpen';

describe('sharpenCanvas', () => {
  it('returns canvas with same dimensions', () => {
    const original = new ImageData(4, 4);
    original.data.fill(128);
    const blur = new ImageData(4, 4);
    blur.data.fill(100);

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
      filter: '',
      getImageData: vi
        .fn()
        .mockReturnValueOnce(original)
        .mockReturnValueOnce(blur),
      putImageData: vi.fn(),
    } as unknown as CanvasRenderingContext2D);

    const source = document.createElement('canvas');
    source.width = 4;
    source.height = 4;
    const result = sharpenCanvas(source, 50, 1);
    expect(result.width).toBe(4);
    expect(result.height).toBe(4);
  });

  it('writes sharpened pixels back to canvas', () => {
    const original = new ImageData(2, 2);
    original.data.set([100, 100, 100, 255, 100, 100, 100, 255, 100, 100, 100, 255, 100, 100, 100, 255]);
    const blur = new ImageData(2, 2);
    blur.data.set([80, 80, 80, 255, 80, 80, 80, 255, 80, 80, 80, 255, 80, 80, 80, 255]);
    const putImageData = vi.fn();

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
      filter: '',
      getImageData: vi.fn().mockReturnValueOnce(original).mockReturnValueOnce(blur),
      putImageData,
    } as unknown as CanvasRenderingContext2D);

    const source = document.createElement('canvas');
    source.width = 2;
    source.height = 2;
    sharpenCanvas(source, 100, 2);
    expect(putImageData).toHaveBeenCalled();
  });
});
