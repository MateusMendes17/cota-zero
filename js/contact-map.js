/**
 * COTA ZERO — contact-map.js
 * O mapa do OpenStreetMap só é pedido depois de uma ação explícita. Assim a
 * página de contacto não bloqueia o carregamento inicial com um iframe de
 * terceiros, nem envia pedidos antes de o visitante os pedir.
 */

export function initContactMap() {
  const root = document.querySelector("[data-contact-map]");
  if (!root) return;

  const button = root.querySelector("[data-map-load]");
  const iframe = root.querySelector("[data-map-iframe]");
  if (!button || !iframe) return;

  const load = () => {
    const src = iframe.dataset.src;
    if (!src) return;
    iframe.src = src;
    root.classList.add("is-loaded");
    iframe.focus({ preventScroll: true });
  };

  button.addEventListener("click", load, { once: true });
}
