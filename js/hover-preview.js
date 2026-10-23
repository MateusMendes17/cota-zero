/**
 * COTA ZERO — hover-preview.js
 * Imagem técnica que segue o cursor com atraso ao passar por linhas de projeto.
 * Desativada em telemóvel e com movimento reduzido.
 */

export function initHoverPreviews() {
  if (window.__czHoverPreview) return;
  window.__czHoverPreview = true;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const preview = document.createElement("div");
  preview.className = "cursor-preview";
  preview.setAttribute("aria-hidden", "true");
  preview.innerHTML = `
    <div class="cursor-preview__media">
      <img alt="" width="640" height="480" decoding="async">
    </div>
    <div class="cursor-preview__cap"><b data-preview-code>A-00</b><span data-preview-name>Projeto</span></div>
  `;
  document.body.appendChild(preview);

  const img = preview.querySelector("img");
  const codeEl = preview.querySelector("[data-preview-code]");
  const nameEl = preview.querySelector("[data-preview-name]");
  let activeRow = null;
  let visible = false;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;
  let lastSrc = "";

  const place = () => {
    const width = preview.offsetWidth || 280;
    const height = preview.offsetHeight || 230;
    let x = targetX + 24;
    let y = targetY + 22;
    if (x + width > window.innerWidth - 14) x = targetX - width - 24;
    if (y + height > window.innerHeight - 14) y = targetY - height - 22;
    targetX = Math.max(10, x);
    targetY = Math.max(10, y);
  };

  const render = () => {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    currentX += dx * 0.16;
    currentY += dy * 0.16;
    preview.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) scale(${visible ? 1 : 0.97})`;
    if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
      frame = 0;
      return;
    }
    frame = requestAnimationFrame(render);
  };

  const start = () => {
    if (frame) return;
    frame = requestAnimationFrame(render);
  };

  const show = (row) => {
    if (!row) return;
    if (row === activeRow) return;
    const src = row.dataset.previewSrc;
    if (!src) return;
    if (src !== lastSrc) {
      img.src = src;
      lastSrc = src;
    }
    img.alt = row.dataset.previewAlt || "";
    codeEl.textContent = row.dataset.previewCode || "A-00";
    nameEl.textContent = row.dataset.previewName || "Projeto";
    activeRow = row;
    place();
    if (!visible) {
      currentX = targetX;
      currentY = targetY;
    }
    visible = true;
    preview.classList.add("is-visible", "is-color");
    preview.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) scale(1)`;
    start();
  };

  const hide = () => {
    visible = false;
    preview.classList.remove("is-visible");
    activeRow = null;
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      if (!activeRow) return;
      targetX = event.clientX;
      targetY = event.clientY;
      place();
      start();
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerover",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const row = target.closest("[data-preview-src]");
      if (row) show(row);
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerout",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const row = target.closest("[data-preview-src]");
      if (!row) return;
      const next = event.relatedTarget;
      if (next instanceof Node && row.contains(next)) return;
      hide();
    },
    { passive: true }
  );

  window.addEventListener("scroll", hide, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth < 900) hide();
  });

  // Se a linha fizer parte do fluxo e receber foco, não mostramos a imagem:
  // a informação essencial já está na própria linha.
  document.addEventListener("focusin", (event) => {
    if (activeRow && event.target instanceof Element && !activeRow.contains(event.target)) hide();
  });
}
