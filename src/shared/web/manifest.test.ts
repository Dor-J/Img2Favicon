import { describe, expect, it } from 'vitest';
import { buildManifestJson } from './manifest';

describe('buildManifestJson', () => {
  it('includes theme color in output', () => {
    const json = JSON.parse(
      buildManifestJson({
        name: 'Test',
        shortName: 'T',
        themeColor: '#ff0000',
        backgroundColor: '#ffffff',
        display: 'standalone',
        icon192: '/a.png',
        icon512: '/b.png',
      }),
    );
    expect(json.theme_color).toBe('#ff0000');
    expect(json.icons).toHaveLength(2);
  });
});
