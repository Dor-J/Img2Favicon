import { describe, expect, it } from 'vitest';
import { checkContrast, contrastRatio } from './contrast';

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });
});

describe('checkContrast', () => {
  it('passes AA for black on white', () => {
    const result = checkContrast('#000000', '#ffffff');
    expect(result.normalAA).toBe(true);
    expect(result.normalAAA).toBe(true);
  });
});
