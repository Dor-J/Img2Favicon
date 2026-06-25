import { describe, expect, it } from 'vitest';
import { OG_PRESETS, resolveOgPreset } from './ogPresets';

describe('resolveOgPreset', () => {
  it('returns known preset dimensions', () => {
    expect(resolveOgPreset('1200x630')).toEqual({ w: 1200, h: 630 });
  });

  it('falls back to default preset for unknown keys', () => {
    expect(resolveOgPreset('unknown')).toEqual(OG_PRESETS['1200x630']);
  });
});
