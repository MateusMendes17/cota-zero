/**
 * COTA ZERO — horizontal-scroll.js
 * Constrói a sequência de processo a partir de data.js e converte o scroll
 * vertical em deslocamento horizontal dentro de um painel fixo. Em ecrãs
 * pequenos, ou com movimento reduzido, a sequência volta a ser vertical.
 */

import { phases } from "./data.js";

const SIGNAL = "#FF4B00";

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const mono = "font-family='JetBrains Mono, Courier New, monospace'";

const frame = (label, content, alt) => `
  <svg viewBox="0 0 520 340" role="img" aria-label="${esc(alt)}">
    <title>${esc(alt)}</title>
    <g fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.55">
      <line x1="14" y1="14" x2="506" y2="14"/>
      <line x1="14" y1="326" x2="506" y2="326"/>
      <line x1="14" y1="14" x2="14" y2="326"/>
      <line x1="506" y1="14" x2="506" y2="326"/>
    </g>
    <text x="22" y="30" fill="currentColor" ${mono} font-size="7" letter-spacing=".12em">${esc(label)}</text>
    ${content}
  </svg>
`;

const dimLine = (x1, y1, x2, y2, label) => {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return `
    <g stroke="${SIGNAL}" stroke-width="0.9">
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>
      <line x1="${x1}" y1="${y1 - 5}" x2="${x1}" y2="${y1 + 5}"/>
      <line x1="${x2}" y1="${y2 - 5}" x2="${x2}" y2="${y2 + 5}"/>
    </g>
    <rect x="${mx - 23}" y="${my - 7}" width="46" height="13" fill="${SIGNAL}"/>
    <text x="${mx}" y="${my + 2.5}" text-anchor="middle" fill="#0F0F0F" ${mono} font-size="7">${label}</text>
  `;
};

const north = (x, y) => `
  <g>
    <line x1="${x}" y1="${y + 25}" x2="${x}" y2="${y + 4}" stroke="currentColor" stroke-width="0.9"/>
    <path d="M${x} ${y}l6 12h-12z" fill="${SIGNAL}" stroke="${SIGNAL}" stroke-width="0.8"/>
    <text x="${x}" y="${y + 35}" text-anchor="middle" fill="currentColor" ${mono} font-size="7">N</text>
  </g>
`;

const concepts = () => `
  <g fill="none" stroke="currentColor" stroke-width="0.7">
    <path d="M60 90 C120 62 185 74 230 52 S360 42 448 76" opacity=".42"/>
    <path d="M52 112 C128 86 184 96 238 76 S374 72 462 104" opacity=".3"/>
    <path d="M46 136 C126 114 198 126 250 104 S380 100 468 132" opacity=".2"/>
    <path d="M70 262 L436 262 L436 162 L70 162 Z" stroke-width="1.4"/>
    <path d="M70 262 L40 286 L406 286 L436 262" stroke-width="1"/>
    <path d="M436 162 L466 186 L466 286" stroke-width="1"/>
    <path d="M70 162 L40 186 L40 286" stroke-width="1"/>
    <g fill="url(#hatch-conceito)" stroke="none">
      <rect x="118" y="184" width="164" height="58"/>
    </g>
    <circle cx="356" cy="210" r="24" opacity=".55"/>
    <circle cx="356" cy="210" r="10" opacity=".4"/>
    <path d="M302 240 q18 -34 54 -14" opacity=".5"/>
    <line x1="70" y1="262" x2="70" y2="300" stroke="${SIGNAL}" stroke-width="0.8"/>
  </g>
  <defs>
    <pattern id="hatch-conceito" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="7" stroke="${SIGNAL}" stroke-width="0.7" opacity=".65"/>
    </pattern>
  </defs>
  <text x="124" y="216" fill="currentColor" ${mono} font-size="7" letter-spacing=".08em">HABITAR</text>
  <text x="124" y="228" fill="currentColor" ${mono} font-size="6" opacity=".6">COTA ±0,00</text>
  <text x="48" y="308" fill="currentColor" ${mono} font-size="6" opacity=".6">MURO EXISTENTE</text>
  ${dimLine(70, 148, 436, 148, "28,40 m")}
  ${north(466, 62)}
`;

const plan = () => `
  <g fill="none" stroke="currentColor" stroke-width="1.1">
    <path d="M82 72 H438 V270 H82 Z"/>
    <path d="M244 72 V270 M330 72 V270 M82 168 H330 M244 214 H438" stroke-width="0.8"/>
    <path d="M82 168 H114 M144 168 H184 M214 168 H244" stroke-width="0.8"/>
    <path d="M174 72 V104 M286 72 V108 M376 72 V98" stroke-width="0.8"/>
    <path d="M174 168 v-24 a12 12 0 0 1 24 0 v24" stroke-width="0.6" opacity=".7"/>
    <path d="M286 168 v-20 a11 11 0 0 1 22 0 v20" stroke-width="0.6" opacity=".7"/>
    <path d="M376 214 v-22 a11 11 0 0 1 22 0 v22" stroke-width="0.6" opacity=".7"/>
    <g stroke-width="0.6" opacity=".55">
      <line x1="92" y1="82" x2="234" y2="82"/>
      <line x1="92" y1="158" x2="234" y2="158"/>
    </g>
    <circle cx="404" cy="88" r="9" stroke="${SIGNAL}" stroke-width="0.8"/>
    <line x1="404" y1="97" x2="404" y2="110" stroke="${SIGNAL}" stroke-width="0.8"/>
  </g>
  <text x="118" y="124" text-anchor="middle" fill="currentColor" ${mono} font-size="7">SALA</text>
  <text x="118" y="212" text-anchor="middle" fill="currentColor" ${mono} font-size="7">COZINHA</text>
  <text x="287" y="122" text-anchor="middle" fill="currentColor" ${mono} font-size="7">SUITE</text>
  <text x="287" y="192" text-anchor="middle" fill="currentColor" ${mono} font-size="7">QUARTO</text>
  <text x="384" y="196" text-anchor="middle" fill="currentColor" ${mono} font-size="7">ATELIER</text>
  <text x="384" y="250" text-anchor="middle" fill="currentColor" ${mono} font-size="7">PÁTIO</text>
  <text x="330" y="256" text-anchor="middle" fill="currentColor" ${mono} font-size="6" opacity=".5">3,20 × 4,80</text>
  ${dimLine(82, 56, 438, 56, "16,00 m")}
  ${dimLine(454, 72, 454, 270, "9,20 m")}
  ${north(470, 56)}
`;

const section = () => `
  <g fill="none" stroke="currentColor" stroke-width="1">
    <path d="M58 272 H462"/>
    <path d="M86 272 V154 H218 V272 M218 154 L260 112 L306 154 V272 M306 154 H432 V272" stroke-width="1.2"/>
    <path d="M74 154 H444" stroke-width="0.8"/>
    <path d="M218 154 L260 112 L306 154" stroke-width="1.2"/>
    <g stroke-width="0.7" opacity=".55">
      <line x1="86" y1="238" x2="218" y2="238"/>
      <line x1="306" y1="238" x2="432" y2="238"/>
      <line x1="86" y1="188" x2="218" y2="188"/>
      <line x1="306" y1="188" x2="432" y2="188"/>
    </g>
    <rect x="86" y="148" width="132" height="6" fill="currentColor" stroke="none" opacity=".8"/>
    <rect x="306" y="148" width="126" height="6" fill="currentColor" stroke="none" opacity=".8"/>
    <line x1="218" y1="112" x2="218" y2="286" stroke="${SIGNAL}" stroke-width="0.9" stroke-dasharray="8 4 2 4"/>
    <path d="M430 154 l22 -10 M430 164 l22 -10 M430 174 l22 -10" stroke-width="0.7" stroke="${SIGNAL}"/>
  </g>
  <g>
    <rect x="78" y="260" width="52" height="12" fill="${SIGNAL}"/>
    <text x="104" y="269" text-anchor="middle" fill="#0F0F0F" ${mono} font-size="7">±0,00</text>
    <rect x="250" y="168" width="56" height="12" fill="${SIGNAL}"/>
    <text x="278" y="177" text-anchor="middle" fill="#0F0F0F" ${mono} font-size="7">+3,20</text>
    <rect x="250" y="96" width="56" height="12" fill="${SIGNAL}"/>
    <text x="278" y="105" text-anchor="middle" fill="#0F0F0F" ${mono} font-size="7">+6,40</text>
  </g>
  <text x="152" y="218" fill="currentColor" ${mono} font-size="7">SALA</text>
  <text x="368" y="218" fill="currentColor" ${mono} font-size="7">ATELIER</text>
  <text x="282" y="78" fill="currentColor" ${mono} font-size="6" opacity=".55">COBERTURA INCLINADA · 27°</text>
  <text x="450" y="126" fill="${SIGNAL}" ${mono} font-size="6">A-A'</text>
  ${dimLine(86, 88, 432, 88, "16,00 m")}
`;

const elevation = () => `
  <g fill="none" stroke="currentColor" stroke-width="1">
    <path d="M62 278 H458"/>
    <path d="M84 278 V146 H184 V104 L232 78 L280 104 V146 H436 V278" stroke-width="1.2"/>
    <path d="M62 278 H458" stroke-width="1.4"/>
    <g stroke-width="0.7">
      <rect x="106" y="176" width="48" height="62"/>
      <line x1="130" y1="176" x2="130" y2="238"/>
      <rect x="214" y="128" width="40" height="42"/>
      <line x1="234" y1="128" x2="234" y2="170"/>
      <rect x="352" y="168" width="56" height="72"/>
      <line x1="380" y1="168" x2="380" y2="240"/>
    </g>
    <g stroke-width="0.5" opacity=".45">
      <line x1="84" y1="166" x2="436" y2="166"/>
      <line x1="84" y1="198" x2="436" y2="198"/>
      <line x1="84" y1="230" x2="436" y2="230"/>
    </g>
    <line x1="184" y1="146" x2="184" y2="282" stroke="${SIGNAL}" stroke-width="0.8"/>
    <line x1="280" y1="146" x2="280" y2="282" stroke="${SIGNAL}" stroke-width="0.8"/>
    <g stroke="${SIGNAL}" stroke-width="0.7">
      <path d="M62 292 h396"/>
      <path d="M62 286 v12 M458 286 v12"/>
    </g>
  </g>
  <text x="234" y="72" text-anchor="middle" fill="currentColor" ${mono} font-size="7">CUMEEIRA +6,80</text>
  <text x="288" y="254" fill="currentColor" ${mono} font-size="6" opacity=".55">BETÃO À VISTA</text>
  <text x="88" y="254" fill="currentColor" ${mono} font-size="6" opacity=".55">GRANITO</text>
  <text x="352" y="254" fill="currentColor" ${mono} font-size="6" opacity=".55">MADEIRA</text>
  <text x="260" y="306" text-anchor="middle" fill="#0F0F0F" ${mono} font-size="7">ALÇADO SUL · 1:100</text>
  ${north(470, 56)}
`;

const site = () => `
  <g fill="none" stroke="currentColor" stroke-width="0.8">
    <path d="M54 268 L54 100 L452 100 L452 268 Z" stroke-width="1.2"/>
    <path d="M84 238 V158 H252 V238 Z" stroke-width="1.1"/>
    <path d="M84 198 H252 M156 158 V238"/>
    <path d="M296 238 V176 H418 V238 Z" stroke-width="1.1"/>
    <path d="M296 204 H418 M350 176 V238"/>
    <g stroke-dasharray="4 4" stroke="${SIGNAL}">
      <path d="M54 100 H452"/>
      <path d="M54 268 H452"/>
    </g>
    <circle cx="454" cy="248" r="18" stroke="${SIGNAL}"/>
    <path d="M454 266 V282 M436 248 H472" stroke="${SIGNAL}"/>
    <path d="M112 94 V68 M100 94 H124" stroke-width="1"/>
    <path d="M112 68 L186 82" stroke-width="0.8"/>
    <rect x="178" y="76" width="44" height="10" stroke-width="0.8"/>
    <path d="M296 94 h58 v22 h-58z" stroke-dasharray="3 3"/>
    <path d="M366 94 h58 v22 h-58z" stroke-dasharray="3 3"/>
    <g stroke-width="0.6" opacity=".55">
      <path d="M64 86 H442"/>
      <path d="M64 282 H442"/>
    </g>
  </g>
  <text x="112" y="68" fill="currentColor" ${mono} font-size="6">GRUA</text>
  <text x="298" y="110" fill="currentColor" ${mono} font-size="6">ESTALEIRO</text>
  <text x="370" y="110" fill="currentColor" ${mono} font-size="6">ARQUIVO</text>
  <text x="156" y="206" text-anchor="middle" fill="currentColor" ${mono} font-size="7">FASE 1</text>
  <text x="350" y="212" text-anchor="middle" fill="currentColor" ${mono} font-size="7">FASE 2</text>
  <text x="454" y="300" text-anchor="middle" fill="currentColor" ${mono} font-size="6" opacity=".6">ENTRADA</text>
  ${dimLine(54, 86, 452, 86, "38,00 m")}
  ${north(56, 56)}
`;

const drawing = (id) => {
  if (id === "conceito") {
    return frame("DESENHO 00 · TERRENO / INTENÇÃO", concepts(), "Plano de intenções com muro existente, área de implantação e curvas de nível");
  }
  if (id === "planta") {
    return frame("DESENHO 01 · PLANTA / ORGANIZAÇÃO", plan(), "Planta de organização com salas, circulação e cotas");
  }
  if (id === "corte") {
    return frame("DESENHO 02 · CORTE / ESPESSURA", section(), "Corte transversal com níveis e cobertura inclinada");
  }
  if (id === "alcado") {
    return frame("DESENHO 03 · ALÇADO / MATÉRIA", elevation(), "Alçado sul com vãos e materiais");
  }
  return frame("DESENHO 04 · OBRA / EXECUÇÃO", site(), "Plano de estaleiro com fases de obra e grua");
};

const phaseMarkup = (phase, index) => {
  const total = String(phases.length).padStart(2, "0");
  const num = String(index + 1).padStart(2, "0");
  const dark = index % 2 === 1;
  const checks = [
    "Levantamento + programa",
    "Estrutura + circulação",
    "Alturas + materiais",
    "Vãos + juntas",
    "Execução + registo"
  ];
  return `
    <article class="phase${dark ? " phase--dark" : ""}" id="fase-${esc(phase.id)}" data-horizontal-slide data-phase="${esc(phase.id)}">
      <div class="phase__top">
        <span>Fase <b>${esc(phase.num)}</b> / ${total}</span>
        <span>${esc(phase.semanas)}</span>
      </div>
      <div class="phase__body">
        <div class="phase__num">${esc(phase.num)}</div>
        <h3 class="phase__title">${esc(phase.titulo)}</h3>
        <p class="phase__text">${esc(phase.texto)}</p>
        <p class="phase__note">${esc(phase.nota)}</p>
      </div>
      <figure class="phase__figure">${drawing(phase.desenho)}</figure>
      <div class="phase__foot">
        <span>${esc(phase.entrega)}</span>
        <span>${esc(checks[index] || "Caderno de obra")}</span>
      </div>
    </article>
  `;
};

export function initHorizontalScroll() {
  const root = document.querySelector("[data-horizontal]");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const track = root.querySelector("[data-horizontal-track]");
  const jumps = root.querySelector("[data-horizontal-jumps]");
  const progressBar = root.querySelector("[data-horizontal-progress]");
  const countEl = root.querySelector("[data-horizontal-count]");
  const statusEl = root.querySelector("[data-horizontal-status]");
  const sticky = root.querySelector(".process-h__sticky");
  if (!track || !sticky) return;

  track.innerHTML = phases.map(phaseMarkup).join("");
  if (jumps) {
    jumps.innerHTML = phases
      .map(
        (phase, index) =>
          `<button type="button" data-horizontal-jump="${index}" aria-label="Ir para a fase ${esc(phase.num)}: ${esc(phase.titulo)}">${esc(phase.num)}</button>`
      )
      .join("");
  }

  const slides = Array.from(track.querySelectorAll("[data-horizontal-slide]"));
  const jumpButtons = jumps ? Array.from(jumps.querySelectorAll("[data-horizontal-jump]")) : [];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const narrow = window.matchMedia("(max-width: 960px)");
  let isStatic = false;
  let distance = 0;
  let start = 0;
  let span = 0;
  let frameId = 0;
  let current = -1;

  const phaseFromHash = () => {
    let id = window.location.hash.replace(/^#/, "");
    try {
      id = decodeURIComponent(id);
    } catch {
      /* hash inválido: ignora */
    }
    return phases.findIndex((phase) => `fase-${phase.id}` === id);
  };

  const scrollToPhase = (index, smooth = false) => {
    if (index < 0) return;
    const behavior = smooth && !reduced.matches ? "smooth" : "auto";
    if (isStatic || span <= 0 || !distance) {
      slides[index]?.scrollIntoView({ behavior, block: "start" });
      return;
    }
    const target = start + (slides.length > 1 ? (index / (slides.length - 1)) * span : 0);
    window.scrollTo({ top: target, behavior });
  };

  let pendingHash = phaseFromHash();
  if (pendingHash < 0) pendingHash = null;

  const setCurrent = (index) => {
    if (index === current) return;
    current = index;
    jumpButtons.forEach((button, i) => {
      if (i === index) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  };

  const paint = (progress) => {
    const clamped = clamp(progress, 0, 1);
    track.style.transform = `translate3d(${(-distance * clamped).toFixed(2)}px, 0, 0)`;
    if (progressBar) progressBar.style.width = `${(clamped * 100).toFixed(2)}%`;
    const index = Math.min(slides.length - 1, Math.round(clamped * (slides.length - 1)));
    setCurrent(index);
    if (countEl) {
      countEl.innerHTML = `<b>${String(index + 1).padStart(2, "0")}</b> / ${String(slides.length).padStart(2, "0")}`;
    }
    if (statusEl) statusEl.textContent = phases[index]?.titulo || "";
  };

  const update = () => {
    frameId = 0;
    if (isStatic) return;
    const progress = span > 0 ? (window.scrollY - start) / span : 0;
    paint(progress);
  };

  const schedule = () => {
    if (isStatic || frameId) return;
    frameId = requestAnimationFrame(update);
  };

  const measure = () => {
    if (isStatic) return;
    track.style.transform = "translate3d(0, 0, 0)";
    const stickyWidth = sticky.clientWidth;
    const trackWidth = track.scrollWidth;
    distance = Math.max(0, trackWidth - stickyWidth);
    if (!distance) {
      root.style.height = "";
      if (pendingHash !== null) {
        const index = pendingHash;
        pendingHash = null;
        requestAnimationFrame(() => scrollToPhase(index, false));
      }
      return;
    }
    root.style.height = `${Math.round(sticky.offsetHeight + distance)}px`;
    start = root.getBoundingClientRect().top + window.scrollY;
    span = root.offsetHeight - sticky.offsetHeight;
    update();
    if (pendingHash !== null) {
      const index = pendingHash;
      pendingHash = null;
      requestAnimationFrame(() => scrollToPhase(index, false));
    }
  };

  const setStatic = (value) => {
    isStatic = value;
    root.classList.toggle("is-static", value);
    if (value) {
      root.style.height = "";
      track.style.transform = "";
      if (progressBar) progressBar.style.width = "0%";
      if (countEl) countEl.innerHTML = `<b>01</b> / ${String(slides.length).padStart(2, "0")}`;
      if (statusEl) statusEl.textContent = "Sequência em modo vertical";
      jumpButtons.forEach((button) => button.removeAttribute("aria-current"));
      current = -1;
    } else {
      measure();
    }
  };

  const syncMode = () => {
    const staticMode = narrow.matches || reduced.matches;
    setStatic(staticMode);
    if (staticMode && pendingHash !== null) {
      const index = pendingHash;
      pendingHash = null;
      requestAnimationFrame(() => scrollToPhase(index, false));
    }
  };

  jumpButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.horizontalJump || 0);
      if (isStatic) {
        slides[index]?.scrollIntoView({
          behavior: reduced.matches ? "auto" : "smooth",
          block: "start"
        });
        return;
      }
      const target = start + (slides.length > 1 ? (index / (slides.length - 1)) * span : 0);
      window.scrollTo({
        top: target,
        behavior: reduced.matches ? "auto" : "smooth"
      });
    });
  });

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("hashchange", () => {
    const index = phaseFromHash();
    if (index >= 0) scrollToPhase(index, true);
  });
  reduced.addEventListener?.("change", syncMode);
  narrow.addEventListener?.("change", syncMode);
  document.fonts?.ready?.then(measure);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => {
      if (!isStatic) measure();
    });
    observer.observe(track);
  }

  syncMode();
}
