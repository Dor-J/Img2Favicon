import { escapeHtml } from './head';
import type { PageEntry } from './pages';

/** Builds crawlable FAQ section HTML. */
export function buildFaqSection(page: PageEntry): string {
  if (!page.faq?.length) return '';

  const items = page.faq
    .map(
      (item) => `<details class="seo-faq-item">
      <summary>${escapeHtml(item.question)}</summary>
      <p>${escapeHtml(item.answer)}</p>
    </details>`,
    )
    .join('\n      ');

  return `<section class="seo-section" aria-label="FAQ">
      <h2>Frequently asked questions</h2>
      ${items}
    </section>`;
}

/** Builds crawlable how-it-works section HTML. */
export function buildHowItWorksSection(page: PageEntry): string {
  if (!page.howItWorks?.length) return '';

  const steps = page.howItWorks
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join('\n        ');

  return `<section class="seo-section" aria-label="How it works">
      <h2>How it works</h2>
      <ol>
        ${steps}
      </ol>
    </section>`;
}

/** Builds combined SEO content block for tool pages. */
export function buildSeoContent(page: PageEntry): string {
  const faq = buildFaqSection(page);
  const howItWorks = buildHowItWorksSection(page);
  if (!faq && !howItWorks) return '';
  return `<div class="seo-content">${howItWorks}${faq}</div>`;
}
