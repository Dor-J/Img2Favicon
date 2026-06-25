/** Supported favicon source modes. */
export type SourceMode = 'image' | 'text';

/** Background fill style for the icon canvas. */
export type BackgroundMode = 'solid' | 'gradient' | 'transparent';

/** Clip shape applied to the favicon canvas. */
export type ShapeMode = 'rounded' | 'square' | 'circle';

/** Mutable editor state shared across rendering and export. */
export interface AppState {
  source: SourceMode;
  image: HTMLImageElement | null;
  imageName: string;
  imageUrl: string;
  text: string;
  font: string;
  weight: string;
  textColor: string;
  textScale: number;
  background: BackgroundMode;
  colorOne: string;
  colorTwo: string;
  angle: number;
  shape: ShapeMode;
  zoom: number;
  rotation: number;
  padding: number;
  panX: number;
  panY: number;
}
