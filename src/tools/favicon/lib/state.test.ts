import { describe, expect, it } from 'vitest';
import { createDefaultState, resetState } from './state';

describe('createDefaultState', () => {
  it('returns the expected initial editor values', () => {
    const state = createDefaultState();
    expect(state.source).toBe('image');
    expect(state.text).toBe('F');
    expect(state.colorOne).toBe('#ff5a1f');
    expect(state.shape).toBe('rounded');
  });
});

describe('resetState', () => {
  it('restores defaults while keeping a loaded image', () => {
    const state = createDefaultState();
    state.text = 'ABC';
    state.zoom = 220;
    state.image = new Image();
    state.imageUrl = 'blob:example';
    state.imageName = 'logo.png';

    resetState(state);

    expect(state.text).toBe('F');
    expect(state.zoom).toBe(100);
    expect(state.source).toBe('image');
    expect(state.imageName).toBe('logo.png');
    expect(state.imageUrl).toBe('blob:example');
  });

  it('switches to text mode when no image is loaded', () => {
    const state = createDefaultState();
    state.source = 'image';
    state.text = 'XYZ';

    resetState(state);

    expect(state.source).toBe('text');
  });
});
