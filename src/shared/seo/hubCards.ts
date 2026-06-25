import { escapeHtml } from './head';
import { getToolsByCategory } from './categories';

/** Builds static hub card links grouped by category for crawlable HTML. */
export function buildHubCardsHtml(hrefPrefix = './'): string {
  return getToolsByCategory()
    .map((group) => {
      const cards = group.tools
        .map(
          (tool) => `<a class="hub-card" href="${escapeHtml(`${hrefPrefix}${tool.path}`)}">
      <span class="hub-card-icon"><i data-lucide="${escapeHtml(tool.icon ?? 'sparkles')}"></i></span>
      <h2>${escapeHtml(tool.title)}</h2>
      <p>${escapeHtml(tool.description)}</p>
    </a>`,
        )
        .join('\n      ');

      return `<section class="hub-category" aria-labelledby="hub-cat-${group.category}">
      <h2 class="hub-category-title" id="hub-cat-${group.category}">${escapeHtml(group.label)}</h2>
      <div class="hub-grid">
      ${cards}
      </div>
    </section>`;
    })
    .join('\n    ');
}
