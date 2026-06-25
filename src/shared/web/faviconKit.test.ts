import { describe, expect, it } from 'vitest';
import { validateFaviconKit } from './faviconKit';

describe('validateFaviconKit', () => {
  it('reports missing required files', () => {
    const results = validateFaviconKit([]);
    expect(results.some((r) => r.status === 'missing')).toBe(true);
  });

  it('accepts correctly sized png', () => {
    const results = validateFaviconKit([
      { name: 'favicon-32x32.png', width: 32, height: 32 },
      { name: 'favicon-16x16.png', width: 16, height: 16 },
      { name: 'apple-touch-icon.png', width: 180, height: 180 },
      { name: 'android-chrome-192.png', width: 192, height: 192 },
      { name: 'android-chrome-512.png', width: 512, height: 512 },
      { name: 'favicon.ico', width: 16, height: 16 },
    ]);
    expect(results.filter((r) => r.status === 'ok').length).toBeGreaterThan(0);
  });
});
