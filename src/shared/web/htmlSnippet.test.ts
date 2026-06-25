import { describe, expect, it } from 'vitest';
import { buildInstallationSnippet } from './htmlSnippet';

describe('buildInstallationSnippet', () => {
  it('includes theme color in meta tag', () => {
    const snippet = buildInstallationSnippet('#ff5a1f');
    expect(snippet).toContain('content="#ff5a1f"');
    expect(snippet).toContain('/favicon.ico');
  });
});
