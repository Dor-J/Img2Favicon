import { describe, expect, it, vi } from 'vitest';
import { addPaddingBorder } from './padding';

describe('addPaddingBorder', () => {
  it('expands canvas by padding amounts', () => {
    const mockCtx = { fillStyle: '', fillRect: vi.fn(), drawImage: vi.fn(), strokeStyle: '', lineWidth: 0, strokeRect: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 100;
    source.height = 50;
    const result = addPaddingBorder(source, {
      top: 10,
      right: 20,
      bottom: 10,
      left: 20,
      background: '#ffffff',
      borderWidth: 0,
      borderColor: '#000000',
    });
    expect(result.width).toBe(140);
    expect(result.height).toBe(70);
  });
});
