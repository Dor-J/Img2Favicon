import { describe, expect, it, vi } from 'vitest';
import { splitSpriteSheet, splitUniformGrid } from './splitSprite';

describe('splitSpriteSheet', () => {
  it('splits a sheet into square frames', () => {
    const mockCtx = { drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 66;
    source.height = 66;
    const frames = splitSpriteSheet(source, 2, 2);
    expect(frames.length).toBeGreaterThan(0);
    expect(frames[0]!.width).toBe(32);
  });

  it('throws when grid is invalid', () => {
    const source = document.createElement('canvas');
    source.width = 4;
    source.height = 4;
    expect(() => splitSpriteSheet(source, 10, 0)).toThrow(/Invalid grid/);
  });
});

describe('splitUniformGrid', () => {
  it('splits by explicit cell size', () => {
    const mockCtx = { drawImage: vi.fn() };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockCtx as unknown as CanvasRenderingContext2D,
    );

    const source = document.createElement('canvas');
    source.width = 42;
    source.height = 42;
    const frames = splitUniformGrid(source, 20, 20, 2);
    expect(frames).toHaveLength(4);
    expect(frames[0]!.width).toBe(20);
    expect(frames[0]!.height).toBe(20);
  });
});
