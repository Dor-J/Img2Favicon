import { describe, expect, it, vi } from 'vitest';
import { buildSpriteSheet } from './spriteSheet';

describe('buildSpriteSheet', () => {
  it('packs frames into a grid', () => {
    const mockCtx = { drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const frame = document.createElement('canvas');
    frame.width = 32;
    frame.height = 32;
    const result = buildSpriteSheet([frame, frame], { columns: 2, padding: 0, uniformCellSize: true });
    expect(result.canvas.width).toBe(64);
    expect(result.css).toContain('.sprite-0');
  });
});
