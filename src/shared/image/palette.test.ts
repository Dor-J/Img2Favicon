import { describe, expect, it } from 'vitest';
import { extractDominantColors } from './palette';

describe('extractDominantColors', () => {
  it('extracts red from solid red pixels', () => {
    const data = new Uint8ClampedArray(4 * 4);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }
    const colors = extractDominantColors(data, 3);
    expect(colors[0]).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
