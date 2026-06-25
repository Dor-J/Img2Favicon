import { resolveToolHref, TOOLS } from '../shared/shell/toolsNav';
import { initShell, refreshIcons } from '../shared/shell/initShell';
import '../styles/shared.css';
import '../styles/hub.css';

initShell();

const grid = document.querySelector('#hubGrid');
if (grid && !grid.querySelector('.hub-card')) {
  grid.innerHTML = TOOLS.map(
    (tool) => `
    <a class="hub-card" href="${resolveToolHref(tool.href)}">
      <span class="hub-card-icon"><i data-lucide="${tool.icon}"></i></span>
      <h2>${tool.title}</h2>
      <p>${tool.description}</p>
    </a>`,
  ).join('');
  refreshIcons();
}
