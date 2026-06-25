import { describe, expect, it, vi } from 'vitest';
import {
  getSocialCardBackground,
  getSocialCardImageHeight,
  renderSocialCardCanvas,
  socialCardFilename,
  truncateSocialDescription,
} from './socialCard';

describe('socialCard helpers', () => {
  it('returns platform-specific backgrounds', () => {
    expect(getSocialCardBackground('linkedin')).toBe('#ffffff');
    expect(getSocialCardBackground('slack')).toBe('#1a1d21');
    expect(getSocialCardBackground('twitter')).toBe('#15202b');
  });

  it('uses taller image strip on twitter', () => {
    expect(getSocialCardImageHeight('twitter')).toBe(200);
    expect(getSocialCardImageHeight('linkedin')).toBe(180);
  });

  it('truncates long descriptions', () => {
    expect(truncateSocialDescription('a'.repeat(100), 80)).toHaveLength(80);
  });

  it('builds platform-specific filenames', () => {
    expect(socialCardFilename('twitter')).toBe('social-card-twitter.png');
  });
});

describe('renderSocialCardCanvas', () => {
  it('renders default card dimensions', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillStyle: '',
      font: '',
      fillRect: vi.fn(),
      fillText: vi.fn(),
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);

    const canvas = renderSocialCardCanvas({
      platform: 'twitter',
      title: 'Test',
      description: 'Desc',
      domain: 'example.com',
    });
    expect(canvas.width).toBe(600);
    expect(canvas.height).toBe(340);
  });
});
