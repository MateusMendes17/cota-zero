/**
 * COTA ZERO — cursor.js
 * Cruz de coordenadas com atraso. Só em dispositivos com rato e sem
 * preferência por movimento reduzido. O cursor nativo é substituído,
 * mas toda a interação continua acessível por teclado.
 */

const pad = (value) => String(Math.max(0, Math.round(value))).padStart(4, "0");

export function initCursor() {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduced) return;

  let el = document.querySelector("[data-cursor]");
  if (!el) {
    el = document.createElement("div");
    el.className = "cursor";
    el.setAttribute("data-cursor", "");
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `
      <span class="cursor__cross"></span>
      <span class="cursor__cross cursor__cross--v"></span>
      <span class="cursor__dot"></span>
      <span class="cursor__ring"><span class="cursor__label">Ver</span></span>
      <span class="cursor__coords">X 0000 · Y 0000</span>
    `;
    document.body.appendChild(el);
  }

  const coords = el.querySelector(".cursor__coords");
  const label = el.querySelector(".cursor__label");
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let frame = 0;
  let active = false;
  let shown = false;

  const render = () => {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    currentX += dx * 0.34;
    currentY += dy * 0.34;
    el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`;
    if (coords) coords.textContent = `X ${pad(targetX)} · Y ${pad(targetY)}`;
    if (Math.abs(dx) < 0.12 && Math.abs(dy) < 0.12) {
      active = false;
      return;
    }
    frame = requestAnimationFrame(render);
  };

  const start = () => {
    if (active) return;
    active = true;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(render);
  };

  const show = () => {
    if (shown) return;
    shown = true;
    document.documentElement.classList.add("has-cursor");
    el.classList.remove("is-hidden");
    start();
  };

  document.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType === "touch") return;
      targetX = event.clientX;
      targetY = event.clientY;
      show();
      if (!active) {
        currentX = targetX;
        currentY = targetY;
      }
      start();
    },
    { passive: true }
  );

  document.addEventListener(
    "pointerover",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest(
        "a, button, [role='button'], input, select, textarea, summary, [data-cursor]"
      );
      if (!interactive) {
        el.classList.remove("is-link");
        return;
      }
      let text = interactive.getAttribute("data-cursor");
      if (!text) {
        if (interactive.matches("input[type='range']")) text = "Arrastar";
        else if (interactive.matches("input, textarea, select")) text = "Escrever";
        else if (interactive.matches("a")) text = "Abrir";
        else text = "Ver";
      }
      if (label) label.textContent = text;
      el.classList.add("is-link");
    },
    { passive: true }
  );

  document.addEventListener("pointerdown", () => el.classList.add("is-down"), { passive: true });
  document.addEventListener("pointerup", () => el.classList.remove("is-down"), { passive: true });
  document.documentElement.addEventListener("mouseleave", () => el.classList.add("is-hidden"));
  document.documentElement.addEventListener("mouseenter", () => el.classList.remove("is-hidden"));
  window.addEventListener("blur", () => el.classList.add("is-hidden"));

  // Evita que o cursor fique visível durante o scroll em telemóveis híbridos.
  window.addEventListener(
    "scroll",
    () => {
      if (window.matchMedia("(pointer: coarse)").matches) {
        document.documentElement.classList.remove("has-cursor");
        shown = false;
      }
    },
    { passive: true }
  );
}
