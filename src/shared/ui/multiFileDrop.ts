import { showToast } from './toast';

export interface MultiFileItem {
  id: string;
  file: File;
  url: string;
  width: number;
  height: number;
}

/** Wires multi-file dropzone with list rendering and reorder/remove. */
export function bindMultiFileDrop(options: {
  dropzone: HTMLElement;
  input: HTMLInputElement;
  listEl: HTMLElement;
  maxFiles?: number;
  onChange: (items: MultiFileItem[]) => void;
}): { getItems: () => MultiFileItem[]; clear: () => void } {
  const maxFiles = options.maxFiles ?? 10;
  let items: MultiFileItem[] = [];
  let counter = 0;

  const render = (): void => {
    options.listEl.innerHTML = items
      .map(
        (item, index) => `<li class="file-list-item" data-id="${item.id}">
          <span>${index + 1}. ${item.file.name} (${item.width}×${item.height})</span>
          <button type="button" data-remove="${item.id}">Remove</button>
        </li>`,
      )
      .join('');

    options.listEl.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-remove');
        removeItem(id!);
      });
    });

    options.onChange([...items]);
  };

  const removeItem = (id: string): void => {
    const item = items.find((i) => i.id === id);
    if (item) URL.revokeObjectURL(item.url);
    items = items.filter((i) => i.id !== id);
    render();
  };

  const addFiles = async (files: FileList | File[]): Promise<void> => {
    for (const file of files) {
      if (items.length >= maxFiles) {
        showToast(`Maximum ${maxFiles} files allowed.`);
        break;
      }
      if (!file.type.startsWith('image/')) continue;

      const url = URL.createObjectURL(file);
      try {
        const image = await decodeImage(url);
        items.push({
          id: `f-${++counter}`,
          file,
          url,
          width: image.naturalWidth,
          height: image.naturalHeight,
        });
      } catch {
        URL.revokeObjectURL(url);
      }
    }
    render();
  };

  options.input.addEventListener('change', () => {
    if (options.input.files?.length) void addFiles(options.input.files);
    options.input.value = '';
  });

  options.dropzone.addEventListener('dragover', (event) => {
    event.preventDefault();
    options.dropzone.classList.add('dragover');
  });

  options.dropzone.addEventListener('dragleave', () => {
    options.dropzone.classList.remove('dragover');
  });

  options.dropzone.addEventListener('drop', (event) => {
    event.preventDefault();
    options.dropzone.classList.remove('dragover');
    if (event.dataTransfer?.files.length) void addFiles(event.dataTransfer.files);
  });

  return {
    getItems: () => [...items],
    clear: () => {
      items.forEach((item) => URL.revokeObjectURL(item.url));
      items = [];
      render();
    },
  };
}

function decodeImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to decode image.'));
    image.src = url;
  });
}
