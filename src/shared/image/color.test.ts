import { describe, expect, it } from 'vitest';
import {
  colorsAreSimilar,
  colorsToCssVariables,
  dedupeSimilarColors,
  hexToRgb,
  rgbToHex,
} from './color';

describe('hexToRgb', () => {
  it('parses hex colors', () => {
    expect(hexToRgb('#ff5a1f')).toEqual({ r: 255, g: 90, b: 31 });
  });
});

describe('rgbToHex', () => {
  it('formats rgb as hex', () => {
    expect(rgbToHex(255, 90, 31)).toBe('#ff5a1f');
  });
});

describe('colorsAreSimilar', () => {
  it('returns true for identical colors', () => {
    expect(colorsAreSimilar('#ffffff', '#ffffff')).toBe(true);
  });

  it('returns false for very different colors', () => {
    expect(colorsAreSimilar('#000000', '#ffffff')).toBe(false);
  });
});

describe('dedupeSimilarColors', () => {
  it('removes near-duplicate colors', () => {
    expect(dedupeSimilarColors(['#ffffff', '#fefefe', '#000000'])).toHaveLength(2);
  });
});

describe('colorsToCssVariables', () => {
  it('formats css custom properties', () => {
    expect(colorsToCssVariables(['#ff0000'])).toContain('--color-1: #ff0000');
  });
});
