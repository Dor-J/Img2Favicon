import { describe, expect, it } from 'vitest';
import { watermarkAnchor } from './watermark';

describe('watermarkAnchor', () => {
  it('anchors content to the bottom-right with padding', () => {
    expect(watermarkAnchor(400, 300, 80, 20, 'bottom-right', 16)).toEqual({
      x: 304,
      y: 264,
    });
  });

  it('centers content in the canvas', () => {
    expect(watermarkAnchor(400, 300, 80, 20, 'center', 0)).toEqual({
      x: 160,
      y: 140,
    });
  });
});
