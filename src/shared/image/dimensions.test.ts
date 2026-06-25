import { describe, expect, it } from 'vitest';
import {
  displayToSourceRect,
  expandForRotation,
  fitWithinBox,
  scaleToFitPreview,
} from './dimensions';

describe('fitWithinBox', () => {
  it('scales down width while maintaining aspect ratio', () => {
    expect(fitWithinBox(2000, 1000, 1000, null, true)).toEqual({
      width: 1000,
      height: 500,
    });
  });

  it('scales down height while maintaining aspect ratio', () => {
    expect(fitWithinBox(1000, 2000, null, 1000, true)).toEqual({
      width: 500,
      height: 1000,
    });
  });

  it('allows independent dimensions when aspect is not maintained', () => {
    expect(fitWithinBox(2000, 1000, 800, 600, false)).toEqual({
      width: 800,
      height: 600,
    });
  });
});

describe('expandForRotation', () => {
  it('returns original size at zero degrees', () => {
    expect(expandForRotation(100, 50, 0)).toEqual({ width: 100, height: 50 });
  });

  it('expands bounds for 90 degree rotation', () => {
    const result = expandForRotation(100, 50, 90);
    expect(result.width).toBeGreaterThanOrEqual(50);
    expect(result.height).toBeGreaterThanOrEqual(100);
  });
});

describe('scaleToFitPreview', () => {
  it('keeps dimensions when already within preview max', () => {
    expect(scaleToFitPreview(400, 300, 560)).toEqual({ width: 400, height: 300 });
  });

  it('scales large images to fit preview max edge', () => {
    const result = scaleToFitPreview(2000, 1000, 560);
    expect(Math.max(result.width, result.height)).toBeLessThanOrEqual(560);
  });
});

describe('displayToSourceRect', () => {
  it('maps display coordinates to source coordinates', () => {
    expect(
      displayToSourceRect(
        { x: 10, y: 20, width: 100, height: 50 },
        { width: 200, height: 100 },
        { width: 1000, height: 500 },
      ),
    ).toEqual({ x: 50, y: 100, width: 500, height: 250 });
  });
});
