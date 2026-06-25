/** Network Information API subset used for prefetch gating. */
interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

const prefetchedUrls = new Set<string>();
let intentPrefetchInitialized = false;

const DEFAULT_SELECTOR = 'a.hub-card, a.tools-dropdown-link, a.brand';

/** Returns false when prefetch should be skipped due to connection constraints. */
function shouldPrefetchByConnection(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!connection) return true;
  if (connection.saveData) return false;
  if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') return false;
  return true;
}

/** Returns true when the URL is a prefetchable same-origin document link. */
function isPrefetchableUrl(url: string): boolean {
  if (!url || url.startsWith('#')) return false;

  try {
    const parsed = new URL(url, window.location.href);
    if (parsed.origin !== window.location.origin) return false;
    if (parsed.pathname === window.location.pathname && parsed.search === window.location.search) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/** Injects a document prefetch link once per URL. */
export function prefetchDocument(url: string): void {
  if (!isPrefetchableUrl(url)) return;
  if (!shouldPrefetchByConnection()) return;
  if (prefetchedUrls.has(url)) return;

  const existing = document.head.querySelector(`link[rel="prefetch"][href="${url}"]`);
  if (existing) {
    prefetchedUrls.add(url);
    return;
  }

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = 'document';
  document.head.appendChild(link);
  prefetchedUrls.add(url);
}

function prefetchFromEvent(event: Event, selector: string): void {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const link = target.closest('a');
  if (!(link instanceof HTMLAnchorElement) || !link.matches(selector)) return;

  prefetchDocument(link.href);
}

/** Wires hover/focus intent prefetch for internal navigation links. */
export function initIntentPrefetch(options?: { selector?: string }): void {
  if (intentPrefetchInitialized) return;
  intentPrefetchInitialized = true;

  const selector = options?.selector ?? DEFAULT_SELECTOR;

  document.addEventListener(
    'pointerenter',
    (event) => prefetchFromEvent(event, selector),
    true,
  );

  document.addEventListener(
    'focusin',
    (event) => prefetchFromEvent(event, selector),
    true,
  );
}

/** Resets module state for unit tests. */
export function resetPrefetchNavForTests(): void {
  prefetchedUrls.clear();
  intentPrefetchInitialized = false;
}
