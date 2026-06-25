import { describe, expect, it } from 'vitest';
import {
  buildBrowserConfigText,
  buildInstallationSnippet,
  buildManifestText,
  buildIcoBlob,
} from './export';
import { createDefaultState } from './state';

describe('buildInstallationSnippet', () => {
  it('includes the theme color in the HTML snippet', () => {
    const snippet = buildInstallationSnippet('#ff5a1f');
    expect(snippet).toContain('content="#ff5a1f"');
    expect(snippet).toContain('/favicon.ico');
  });
});

describe('buildManifestText', () => {
  it('serializes theme and background colors from state', () => {
    const state = createDefaultState();
    state.colorOne = '#123456';
    state.background = 'transparent';

    const manifest = JSON.parse(buildManifestText(state));
    expect(manifest.theme_color).toBe('#123456');
    expect(manifest.background_color).toBe('#ffffff');
  });
});

describe('buildBrowserConfigText', () => {
  it('embeds the tile color in XML', () => {
    expect(buildBrowserConfigText('#ff5a1f')).toContain('<TileColor>#ff5a1f</TileColor>');
  });
});

describe('buildIcoBlob', () => {
  it('creates an ICO container with the expected header', async () => {
    const fakePng = new ArrayBuffer(128);
    const ico = buildIcoBlob([fakePng, fakePng, fakePng]);
    const header = new DataView(await ico.arrayBuffer());

    expect(header.getUint16(0, true)).toBe(0);
    expect(header.getUint16(2, true)).toBe(1);
    expect(header.getUint16(4, true)).toBe(3);
  });
});
