import { describe, expect, it } from 'vitest';
import { formatMetadataJson, metadataStatusMessage } from './metadataFormat';

describe('formatMetadataJson', () => {
  it('formats metadata with indentation', () => {
    expect(formatMetadataJson({ Make: 'Canon' })).toBe('{\n  "Make": "Canon"\n}');
  });

  it('returns empty object for nullish metadata', () => {
    expect(formatMetadataJson(null)).toBe('{}');
  });
});

describe('metadataStatusMessage', () => {
  it('reports parsed metadata', () => {
    expect(metadataStatusMessage('photo.jpg', { Make: 'Canon' })).toContain('Parsed metadata');
  });

  it('reports missing metadata', () => {
    expect(metadataStatusMessage('photo.jpg', null)).toContain('No embedded metadata');
  });
});
