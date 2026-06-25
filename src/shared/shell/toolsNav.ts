import { TOOL_PAGES } from '../seo/pages';

/** Registry entry for a browser-based tool page. */
export interface ToolEntry {
  id: string;
  title: string;
  href: string;
  icon: string;
  description: string;
}

/** All tools available in the suite (hub-relative paths). */
export const TOOLS: ToolEntry[] = TOOL_PAGES.map((page) => ({
  id: page.id,
  title: page.title,
  href: page.path,
  icon: page.icon ?? 'sparkles',
  description: page.description,
}));

/** Resolves a hub-relative tool href for the current page depth. */
export function resolveToolHref(hubHref: string): string {
  const depth = window.location.pathname.includes('/tools/') ? '../../' : './';
  return `${depth}${hubHref}`;
}

/** Finds a tool entry by id. */
export function getToolById(id: string): ToolEntry | undefined {
  return TOOLS.find((tool) => tool.id === id);
}
