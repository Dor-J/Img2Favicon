import { describe, expect, it } from 'vitest';
import { validatePwaIcons } from './pwaIconCheck';

describe('validatePwaIcons', () => {
  it('flags non-square icons', () => {
    const results = validatePwaIcons([{ name: 'icon.png', width: 200, height: 180 }]);
    expect(results.some((r) => r.status === 'error')).toBe(true);
  });

  it('accepts valid 512 icon', () => {
    const results = validatePwaIcons([{ name: 'icon-512.png', width: 512, height: 512 }]);
    expect(results.some((r) => r.status === 'ok')).toBe(true);
  });
});
