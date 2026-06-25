import { describe, expect, it } from 'vitest';
import { buildCssFilterString, defaultCssFilterValues } from './cssFilters';

describe('buildCssFilterString', () => {
  it('returns none for default values', () => {
    expect(buildCssFilterString(defaultCssFilterValues())).toBe('none');
  });

  it('includes blur when set', () => {
    const v = defaultCssFilterValues();
    v.blur = 4;
    expect(buildCssFilterString(v)).toContain('blur(4px)');
  });
});
