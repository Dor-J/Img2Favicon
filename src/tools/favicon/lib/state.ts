import type { AppState } from './types';

/** Returns a fresh default editor state. */
export function createDefaultState(): AppState {
  return {
    source: 'image',
    image: null,
    imageName: '',
    imageUrl: '',
    text: 'F',
    font: 'Inter, ui-sans-serif, system-ui, sans-serif',
    weight: '800',
    textColor: '#ffffff',
    textScale: 58,
    background: 'solid',
    colorOne: '#ff5a1f',
    colorTwo: '#6d28d9',
    angle: 135,
    shape: 'rounded',
    zoom: 100,
    rotation: 0,
    padding: 6,
    panX: 0,
    panY: 0,
  };
}

/** Resets editable fields while optionally preserving a loaded image. */
export function resetState(state: AppState): void {
  const preservedImage = state.image;
  const preservedUrl = state.imageUrl;
  const preservedName = state.imageName;

  Object.assign(state, createDefaultState(), {
    source: preservedImage ? 'image' : 'text',
    image: preservedImage,
    imageUrl: preservedUrl,
    imageName: preservedName,
  });
}
