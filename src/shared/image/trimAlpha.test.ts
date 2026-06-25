import { describe, expect, it } from 'vitest';
import { findAlphaBounds } from './trimAlpha';

describe('findAlphaBounds', () => {
  it('finds bounds of opaque pixels', () => {
    const data = new Uint8ClampedArray(4 * 4 * 4);
    data[20] = 255;
    data[21] = 255;
    data[22] = 255;
    data[23] = 255;
    const bounds = findAlphaBounds(data, 4, 4);
    expect(bounds).toEqual({ x: 1, y: 1, width: 1, height: 1 });
  });
});
