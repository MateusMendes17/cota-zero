/**
 * COTA ZERO — slider-corte.js
 * Comparador entre fotografia e corte desenhado. O input de intervalo cobre
 * toda a imagem, para funcionar com rato, toque e teclado sem depender de
 * gestos personalizados.
 */

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const update = (root, range) => {
  const value = clamp(Number(range.value) || 0, 0, 100);
  root.style.setProperty("--pos", `${value}%`);
  const label = root.querySelector("[data-corte-pos]");
  if (label) label.textContent = `${String(Math.round(value)).padStart(2, "0")}%`;
  range.setAttribute("aria-valuetext", `${Math.round(value)} por cento de fotografia`);
};

export function initCorteSliders() {
  document.querySelectorAll("[data-corte]").forEach((root) => {
    if (root.dataset.initialized === "true") return;
    const range = root.querySelector("input[type='range']");
    if (!range) return;

    root.dataset.initialized = "true";
    const photo = root.querySelector("[data-corte-photo]");
    if (photo) photo.setAttribute("draggable", "false");

    const handle = () => update(root, range);
    range.addEventListener("input", handle, { passive: true });
    range.addEventListener("change", handle, { passive: true });

    // Um clique fora do punho também move o comparador; no toque, o alcance
    // dos 34 px do punho é aumentado para 48 px.
    root.addEventListener("pointerdown", (event) => {
      if (event.target === range) return;
      const rect = root.getBoundingClientRect();
      if (!rect.width) return;
      const value = ((event.clientX - rect.left) / rect.width) * 100;
      range.value = String(clamp(value, 0, 100));
      update(root, range);
    });

    update(root, range);
  });
}
