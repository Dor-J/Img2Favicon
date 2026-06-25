import { describe, expect, it } from 'vitest';
import { colorKeyToAlpha } from './filters';

describe('colorKeyToAlpha', () => {
  it('makes exact key color pixels fully transparent', () => {
    const data = new Uint8ClampedArray([
      255, 255, 255, 255,
      10, 20, 30, 255,
    ]);

    colorKeyToAlpha(data, { r: 255, g: 255, b: 255 }, 0, 0);

    expect(data[3]).toBe(0);
    expect(data[7]).toBe(255);
  });

  it('feathers near-key pixels toward transparency', () => {
    const data = new Uint8ClampedArray([220, 220, 220, 255]);

    colorKeyToAlpha(data, { r: 255, g: 255, b: 255 }, 5, 10);

    expect(data[3]).toBeGreaterThan(0);
    expect(data[3]).toBeLessThan(255);
  });
});
