import type { PageEntry } from './pages';
import { TOOL_PAGES } from './pages';

/** Tool category identifiers for hub grouping and navigation. */
export type ToolCategory = 'create' | 'edit' | 'convert' | 'web' | 'privacy';

/** Display labels for hub sections and nav dropdown. */
export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  create: 'Create',
  edit: 'Edit',
  convert: 'Convert',
  web: 'Web dev',
  privacy: 'Privacy',
};

/** Ordered list of categories for consistent hub and nav rendering. */
export const CATEGORY_ORDER: ToolCategory[] = [
  'create',
  'edit',
  'convert',
  'web',
  'privacy',
];

/** Returns tool pages grouped by category in display order. */
export function getToolsByCategory(): { category: ToolCategory; label: string; tools: PageEntry[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    tools: TOOL_PAGES.filter((tool) => tool.category === category),
  })).filter((group) => group.tools.length > 0);
}
