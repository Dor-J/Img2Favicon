import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  initIntentPrefetch,
  prefetchDocument,
  resetPrefetchNavForTests,
} from './prefetchNav';

describe('prefetchDocument', () => {
  const toolUrl = new URL('/tools/resize/index.html', window.location.origin).href;

  beforeEach(() => {
    resetPrefetchNavForTests();
    document.head.innerHTML = '';
  });

  afterEach(() => {
    resetPrefetchNavForTests();
    vi.restoreAllMocks();
    delete (navigator as Navigator & { connection?: unknown }).connection;
  });

  it('injects one prefetch link per URL', () => {
    prefetchDocument(toolUrl);

    const links = document.head.querySelectorAll('link[rel="prefetch"]');
    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute('href')).toBe(toolUrl);
    expect(links[0]?.getAttribute('as')).toBe('document');
  });

  it('does not duplicate on second call', () => {
    prefetchDocument(toolUrl);
    prefetchDocument(toolUrl);

    const links = document.head.querySelectorAll('link[rel="prefetch"]');
    expect(links).toHaveLength(1);
  });

  it('skips when saveData is true', () => {
    Object.defineProperty(navigator, 'connection', {
      configurable: true,
      value: { saveData: true },
    });

    prefetchDocument(toolUrl);

    expect(document.head.querySelectorAll('link[rel="prefetch"]')).toHaveLength(0);
  });

  it('ignores external URLs', () => {
    prefetchDocument('https://example.com/tools/resize/index.html');

    expect(document.head.querySelectorAll('link[rel="prefetch"]')).toHaveLength(0);
  });
});

describe('initIntentPrefetch', () => {
  beforeEach(() => {
    resetPrefetchNavForTests();
    document.head.innerHTML = '';
    document.body.innerHTML = `
      <a class="hub-card" href="./tools/resize/index.html">Resize</a>
    `;
  });

  afterEach(() => {
    resetPrefetchNavForTests();
    vi.restoreAllMocks();
  });

  it('prefetches on focusin for matching links', () => {
    initIntentPrefetch();
    const link = document.querySelector('a.hub-card') as HTMLAnchorElement;
    link.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(document.head.querySelectorAll('link[rel="prefetch"]')).toHaveLength(1);
  });

  it('attaches listeners only once', () => {
    initIntentPrefetch();
    initIntentPrefetch();

    const link = document.querySelector('a.hub-card') as HTMLAnchorElement;
    link.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

    expect(document.head.querySelectorAll('link[rel="prefetch"]')).toHaveLength(1);
  });
});
