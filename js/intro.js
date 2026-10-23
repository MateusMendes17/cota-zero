/**
 * COTA ZERO — intro.js
 * Sequência de entrada "arranque de obra": contador 0—100, grelha desenhada
 * com stroke-dashoffset e recolha das linhas.
 *
 * A sequência é curta (~0,9 s) e fica registada em localStorage, para não
 * voltar a bloquear a navegação em novos separadores ou visitas seguintes.
 */

const KEY = "cz-intro-2026";

const canAnimate = () =>
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const alreadySeen = () => {
  try {
    return (
      window.localStorage.getItem(KEY) === "1" ||
      window.sessionStorage.getItem(KEY) === "1"
    );
  } catch {
    return false;
  }
};

const markSeen = () => {
  try {
    window.localStorage.setItem(KEY, "1");
    window.sessionStorage.setItem(KEY, "1");
  } catch {
    /* sessão privada ou armazenamento bloqueado: mostra de novo, sem falhar */
  }
};

export function initIntro() {
  // Em ecrãs pequenos a entrada é dispensada: o conteúdo e a imagem principal
  // ficam disponíveis de imediato, sem uma camada decorativa por cima.
  if (
    !canAnimate() ||
    alreadySeen() ||
    window.matchMedia("(max-width: 720px)").matches
  ) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.className = "intro";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Arranque de obra");

  const lines = [];
  for (let i = 1; i < 12; i += 1) {
    const x = (i / 12) * 1000;
    lines.push(
      `<line x1="${x}" y1="0" x2="${x}" y2="700" pathLength="100" style="animation-delay:${i * 0.045}s"/>`
    );
  }
  for (let i = 1; i < 4; i += 1) {
    const y = (i / 4) * 700;
    lines.push(
      `<line x1="0" y1="${y}" x2="1000" y2="${y}" pathLength="100" style="animation-delay:${0.18 + i * 0.07}s"/>`
    );
  }

  overlay.innerHTML = `
    <div class="intro__bar">
      <span>Cota Zero · Atelier de Arquitetura</span>
      <span>Porto · 41°08′N 8°37′O</span>
      <button type="button" class="intro__skip" data-intro-skip>Saltar →</button>
    </div>
    <div class="intro__stage">
      <svg class="intro__lines" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
        <g stroke="#E8E6E0" stroke-width="0.7" opacity="0.5">${lines.join("")}</g>
        <rect x="0.5" y="0.5" width="999" height="699" fill="none" stroke="#E8E6E0" stroke-width="1" opacity="0.3"/>
      </svg>
      <div class="intro__count"><span data-intro-count>000</span><small>/ 100</small></div>
      <div class="intro__meta">
        <span><b>Arranque de obra</b><br>Verificação de cota</span>
        <span>12 eixos · 5 fases<br>Desenho rev. 00</span>
      </div>
    </div>
    <div class="intro__foot">
      <span data-intro-status>A medir o terreno</span>
      <span class="intro__progress" aria-hidden="true"><i data-intro-progress></i></span>
      <span>Cota Zero · 2011—2026</span>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add("is-intro", "is-locked");

  const background = Array.from(document.body.children).filter(
    (el) => el !== overlay && el.tagName !== "SCRIPT"
  );
  background.forEach((el) => {
    el.inert = true;
  });

  const countEl = overlay.querySelector("[data-intro-count]");
  const progressEl = overlay.querySelector("[data-intro-progress]");
  const statusEl = overlay.querySelector("[data-intro-status]");
  const skipBtn = overlay.querySelector("[data-intro-skip]");
  const duration = 900;
  let started = 0;
  let frame = 0;
  let finished = false;

  const unlock = () => {
    background.forEach((el) => {
      el.inert = false;
    });
    document.body.classList.remove("is-intro", "is-locked");
  };

  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    markSeen();
    countEl.textContent = "100";
    progressEl.style.width = "100%";
    statusEl.textContent = "Cota verificada · a abrir";
    overlay.classList.add("is-lines-out");
    window.setTimeout(() => {
      overlay.classList.add("is-done");
      unlock();
      window.setTimeout(() => overlay.remove(), 320);
    }, 260);
  };

  const tick = (now) => {
    if (!started) started = now;
    const t = Math.min(1, (now - started) / duration);
    const value = Math.floor(t * 100);
    countEl.textContent = String(value).padStart(3, "0");
    progressEl.style.width = `${t * 100}%`;
    if (t < 0.45) statusEl.textContent = "A medir o terreno";
    else if (t < 0.8) statusEl.textContent = "A marcar os eixos";
    else statusEl.textContent = "A fixar a cota zero";
    if (t < 1) {
      frame = requestAnimationFrame(tick);
    } else {
      finish();
    }
  };

  skipBtn.addEventListener("click", finish);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target === overlay.querySelector(".intro__stage")) {
      finish();
    }
  });
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") finish();
  });

  // Se algo falhar a meio, a página nunca fica bloqueada.
  window.setTimeout(() => {
    if (!finished && document.body.contains(overlay)) finish();
  }, 3000);

  // O relógio de animação pode ser travado num separador em segundo plano.
  // Este limite garante que a entrada termina sempre em menos de 1 s.
  window.setTimeout(finish, duration + 80);

  window.setTimeout(() => skipBtn.focus({ preventScroll: true }), 120);
  frame = requestAnimationFrame(tick);
}
