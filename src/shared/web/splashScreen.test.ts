import { describe, expect, it } from 'vitest';
import { SPLASH_SIZES } from './splashScreen';

describe('SPLASH_SIZES', () => {
  it('includes common iOS splash dimensions', () => {
    expect(SPLASH_SIZES.length).toBeGreaterThan(5);
    expect(SPLASH_SIZES[0]).toEqual([2048, 2732, 'splash-2048x2732.png']);
  });

  it('uses width-height filenames for each entry', () => {
    for (const [width, height, filename] of SPLASH_SIZES) {
      expect(filename).toContain(String(width));
      expect(filename).toContain(String(height));
    }
  });
});
