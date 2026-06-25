import { createIcons } from 'lucide';
import { CATEGORY_LABELS } from '../seo/categories';
import { getToolsByCategory } from '../seo/categories';
import { resolveToolHref } from './toolsNav';

export interface ShellOptions {
  activeToolId?: string;
  showReset?: boolean;
  onReset?: () => void;
}

function hubHref(): string {
  return window.location.pathname.includes('/tools/') ? '../../index.html' : './index.html';
}

function buildNavDropdown(activeToolId?: string): string {
  const groups = getToolsByCategory()
    .map((group) => {
      const links = group.tools
        .map((tool) => {
          const href = resolveToolHref(tool.path);
          const active = tool.id === activeToolId ? ' active' : '';
          return `<a class="tools-dropdown-link${active}" href="${href}">${tool.title}</a>`;
        })
        .join('');
      return `<div class="tools-dropdown-group">
        <span class="tools-dropdown-label">${CATEGORY_LABELS[group.category]}</span>
        ${links}
      </div>`;
    })
    .join('');

  return `<div class="tools-dropdown" id="toolsDropdown">
    <button class="ghost-button tools-dropdown-toggle" id="toolsDropdownToggle" type="button" aria-expanded="false" aria-haspopup="true">
      <i data-lucide="layout-grid"></i><span>Tools</span><i data-lucide="chevron-down" class="tools-dropdown-chevron"></i>
    </button>
    <div class="tools-dropdown-menu" id="toolsDropdownMenu" role="menu" hidden>
      <a class="tools-dropdown-link tools-dropdown-home" href="${hubHref()}">All tools</a>
      ${groups}
    </div>
  </div>`;
}

/** Initializes shared site header, theme, and optional reset control. */
export function initShell(options: ShellOptions = {}): void {
  const header = document.querySelector('#site-header');
  if (header) {
    header.innerHTML = `
      <div class="shell topbar">
        <a href="${hubHref()}" class="brand" aria-label="Img2Favicon home">
          <span class="brand-mark"><i data-lucide="sparkles"></i></span>
          <span>Img2Favicon<small>Private browser image tools</small></span>
        </a>
        ${buildNavDropdown(options.activeToolId)}
        <div class="header-actions">
          ${
            options.showReset
              ? `<button class="ghost-button" id="resetAll" type="button" title="Reset">
                   <i data-lucide="rotate-ccw"></i><span>Reset</span>
                 </button>`
              : ''
          }
          <button class="icon-button" id="themeToggle" type="button" title="Toggle theme" aria-label="Toggle theme">
            <i data-lucide="sun"></i>
          </button>
        </div>
      </div>`;

    setupToolsDropdown();
  }

  restoreTheme();
  setupIcons();

  document.querySelector('#themeToggle')?.addEventListener('click', toggleTheme);

  if (options.showReset && options.onReset) {
    document.querySelector('#resetAll')?.addEventListener('click', options.onReset);
  }
}

function setupToolsDropdown(): void {
  const toggle = document.querySelector('#toolsDropdownToggle');
  const menu = document.querySelector('#toolsDropdownMenu');
  const dropdown = document.querySelector('#toolsDropdown');
  if (!toggle || !menu || !dropdown) return;

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = !menu.hasAttribute('hidden');
    if (isOpen) {
      menu.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('open');
    } else {
      menu.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      dropdown.classList.add('open');
    }
  });

  document.addEventListener('click', () => {
    menu.setAttribute('hidden', '');
    toggle.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('open');
  });

  menu.addEventListener('click', (event) => event.stopPropagation());
}

function setupIcons(): void {
  createIcons({ attrs: { 'stroke-width': '2' } });
}

function toggleTheme(): void {
  const root = document.documentElement;
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('forgefavicon-theme', next);
  const buttonIcon = document.querySelector('#themeToggle i');
  buttonIcon?.setAttribute('data-lucide', next === 'dark' ? 'sun' : 'moon');
  setupIcons();
}

function restoreTheme(): void {
  const saved = localStorage.getItem('forgefavicon-theme');
  const theme =
    saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.dataset.theme = theme;
  document.querySelector('#themeToggle i')?.setAttribute(
    'data-lucide',
    theme === 'dark' ? 'sun' : 'moon',
  );
}

/** Re-renders lucide icons after dynamic DOM updates. */
export function refreshIcons(): void {
  setupIcons();
}
