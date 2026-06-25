import { describe, expect, it } from 'vitest';
import { getToolsWithMissingTests, getUnmappedTools, TOOL_TEST_FILES } from './toolCoverage';
import { TOOL_PAGES } from '../seo/pages';

describe('toolCoverage', () => {
  it('maps every registered tool to at least one test file', () => {
    expect(getUnmappedTools()).toEqual([]);
    expect(Object.keys(TOOL_TEST_FILES).length).toBeGreaterThanOrEqual(TOOL_PAGES.length);
  });

  it('has all mapped test files on disk', () => {
    expect(getToolsWithMissingTests()).toEqual([]);
  });
});
