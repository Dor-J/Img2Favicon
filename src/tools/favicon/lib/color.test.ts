import { describe, expect, it } from 'vitest';
import {
  colorsAreSimilar,
  dedupeSimilarColors,
  hexToRgb,
  rgbToHex,
} from './color';

describe('hexToRgb', () => {
  it('parses a six-digit hex color', () => {
    expect(hexToRgb('#ff5a1f')).toEqual({ r: 255, g: 90, b: 31 });
  });
});

describe('rgbToHex', () => {
  it('formats RGB channels as hex', () => {
    expect(rgbToHex(255, 90, 31)).toBe('#ff5a1f');
  });
});

describe('colorsAreSimilar', () => {
  it('returns true for nearby colors', () => {
    expect(colorsAreSimilar('#ff5a1f', '#ff5a20')).toBe(true);
  });

  it('returns false for distinct colors', () => {
    expect(colorsAreSimilar('#ff5a1f', '#0f766e')).toBe(false);
  });
});

describe('dedupeSimilarColors', () => {
  it('removes visually similar duplicates', () => {
    expect(dedupeSimilarColors(['#ff5a1f', '#ff5a20', '#0f766e'])).toEqual([
      '#ff5a1f',
      '#0f766e',
    ]);
  });
});
