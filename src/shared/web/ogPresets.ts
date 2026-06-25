/** Open Graph and social sharing dimension presets. */
export const OG_PRESETS: Record<string, { w: number; h: number }> = {
  '1200x630': { w: 1200, h: 630 },
  '1200x600': { w: 1200, h: 600 },
  '1200x1200': { w: 1200, h: 1200 },
  '1500x500': { w: 1500, h: 500 },
};

/** Resolves a preset key to dimensions, falling back to 1200×630. */
export function resolveOgPreset(key: string): { w: number; h: number } {
  return OG_PRESETS[key] ?? OG_PRESETS['1200x630']!;
}
