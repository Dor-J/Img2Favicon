import { showToast } from './toast';

export interface FileDropOptions {
  dropzone: HTMLElement;
  input: HTMLInputElement;
  onFile: (file: File) => void | Promise<void>;
}

/** Wires drag-and-drop and file input to a dropzone element. */
export function bindFileDrop(options: FileDropOptions): void {
  const { dropzone, input, onFile } = options;

  input.addEventListener('change', () => {
    const file = input.files?.[0];
    if (file) void onFile(file);
  });

  ['dragenter', 'dragover'].forEach((eventName) =>
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
      dropzone.classList.add('dragover');
    }),
  );

  ['dragleave', 'drop'].forEach((eventName) =>
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      event.stopPropagation();
      dropzone.classList.remove('dragover');
    }),
  );

  dropzone.addEventListener('drop', (event) => {
    const files = (event as DragEvent).dataTransfer?.files;
    const file = files && files.length === 1 ? files[0] : null;
    if (!file) {
      showToast('Drop one image at a time.');
      return;
    }
    void onFile(file);
  });

  if (!dropzone.dataset.dropBound) {
    dropzone.dataset.dropBound = '1';
    ['dragover', 'drop'].forEach((eventName) =>
      document.addEventListener(eventName, (event) => event.preventDefault()),
    );
  }
}

/** Updates dropzone UI after a successful file load. */
export function setDropzoneLoaded(
  dropzone: HTMLElement,
  titleEl: HTMLElement,
  subEl: HTMLElement,
  nameEl: HTMLElement,
  thumbEl: HTMLImageElement | null,
  file: File,
  width: number,
  height: number,
  url: string,
): void {
  dropzone.classList.add('has-image');
  titleEl.textContent = 'Image ready';
  subEl.textContent = `${width} × ${height} px`;
  nameEl.textContent = file.name;
  if (thumbEl) thumbEl.src = url;
}

/** Resets dropzone UI to empty state. */
export function resetDropzone(
  dropzone: HTMLElement,
  titleEl: HTMLElement,
  subEl: HTMLElement,
  nameEl: HTMLElement,
  thumbEl: HTMLImageElement | null,
  input: HTMLInputElement,
): void {
  dropzone.classList.remove('has-image');
  titleEl.textContent = 'Drop an image here or browse';
  subEl.textContent = 'PNG, JPG, WebP, or GIF · up to 20 MB';
  nameEl.textContent = '';
  if (thumbEl) thumbEl.removeAttribute('src');
  input.value = '';
}
