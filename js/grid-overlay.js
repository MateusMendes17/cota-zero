/**
 * COTA ZERO — grid-overlay.js
 * Modo "Planta": grelha de 12 colunas, eixos, nomes de secção e cotas
 * calculadas a partir das dimensões reais dos blocos. Não bloqueia cliques.
 */

const KEY = "cz-planta-2026";
const SVG_NS = "http://www.w3.org/2000/svg";

const readState = () => {
  try {
    return window.sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

const writeState = (on) => {
  try {
    window.sessionStorage.setItem(KEY, on ? "1" : "0");
  } catch {
    /* sem armazenamento: mantém apenas o estado em memória */
  }
};

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });

const svgEl = (name, attrs = {}) => {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
};

const mm = (px) => `${Math.round(px)} px`;

export function initPlanta() {
  const overlay = document.querySelector("#planta");
  if (!overlay) return;

  const buttons = Array.from(document.querySelectorAll("[data-plan-toggle]"));
  const inner = overlay.querySelector(".planta__inner");
  const colsEl = overlay.querySelector("[data-planta-cols]");
  const marks = overlay.querySelector("[data-planta-marks]");
  const topdim = overlay.querySelector("[data-planta-topdim]");
  if (!inner || !colsEl || !marks || !topdim) return;

  let isOn = false;
  let frame = 0;
  let labelEls = [];
  let measureEls = [];
  let sections = [];

  // Grelha de 12 colunas com numeração.
  colsEl.innerHTML = "";
  for (let i = 1; i <= 12; i += 1) {
    const col = document.createElement("div");
    col.className = "planta__col";
    const num = document.createElement("span");
    num.textContent = String(i).padStart(2, "0");
    col.appendChild(num);
    colsEl.appendChild(col);
  }

  const syncButtons = () => {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", isOn ? "true" : "false");
      button.setAttribute("aria-label", isOn ? "Desativar modo planta" : "Ativar modo planta");
      const mark = button.querySelector(".plan-toggle__mark");
      if (mark) mark.textContent = isOn ? "[×]" : "[ ]";
    });
    overlay.classList.toggle("is-on", isOn);
  };

  const collectSections = () => {
    sections = Array.from(document.querySelectorAll("main section, main > header"));
    labelEls.forEach((el) => el.remove());
    labelEls = sections.map((section) => {
      const el = document.createElement("div");
      el.className = "planta__label";
      const name =
        section.dataset.sheetName ||
        section.dataset.sectionName ||
        section.querySelector("h1, h2")?.textContent?.trim() ||
        "Secção";
      const sheet = section.dataset.sheet || document.body.dataset.sheet || "A-00";
      el.innerHTML = `<b>${esc(sheet)}</b><span>${esc(name)}</span>`;
      inner.appendChild(el);
      return el;
    });
    measureEls.forEach((el) => el.remove());
    measureEls = [];
  };

  const measure = () => {
    if (!isOn) return;
    const innerRect = inner.getBoundingClientRect();
    const width = innerRect.width;
    const height = innerRect.height;
    if (!width || !height) return;

    marks.setAttribute("viewBox", `0 0 ${width} ${height}`);
    marks.setAttribute("width", width);
    marks.setAttribute("height", height);
    marks.innerHTML = "";
    topdim.innerHTML = "";

    // Cotas do topo: largura total + largura de cada coluna.
    const colRects = Array.from(colsEl.children).map((col) => col.getBoundingClientRect());
    const dimSvg = svgEl("svg", {
      width,
      height: 44,
      viewBox: `0 0 ${width} 44`,
      "aria-hidden": "true"
    });
    const baseY = 31;
    dimSvg.appendChild(
      svgEl("line", {
        x1: 0,
        y1: baseY,
        x2: width,
        y2: baseY,
        stroke: "#FF4B00",
        "stroke-width": "1"
      })
    );
    const left = 0;
    const right = width;
    [left, right].forEach((x) => {
      const tick = svgEl("line", {
        x1: x,
        y1: baseY - 7,
        x2: x,
        y2: baseY + 7,
        stroke: "#FF4B00",
        "stroke-width": "1"
      });
      dimSvg.appendChild(tick);
    });
    const totalLabel = svgEl("text", {
      x: width / 2,
      y: 14,
      "text-anchor": "middle",
      fill: "#0F0F0F",
      "font-family": "JetBrains Mono, monospace",
      "font-size": "8",
      "letter-spacing": "0.06em"
    });
    totalLabel.textContent = `LARGURA ÚTIL · ${Math.round(width)} PX`;
    dimSvg.appendChild(totalLabel);

    if (width > 700) {
      colRects.forEach((rect, index) => {
        const x = rect.left - innerRect.left;
        if (index > 0) {
          dimSvg.appendChild(
            svgEl("line", {
              x1: x,
              y1: baseY - 4,
              x2: x,
              y2: baseY + 4,
              stroke: "#FF4B00",
              "stroke-width": "0.6",
              opacity: "0.8"
            })
          );
        }
        const text = svgEl("text", {
          x: x + rect.width / 2,
          y: baseY + 16,
          "text-anchor": "middle",
          fill: "#0F0F0F",
          "font-family": "JetBrains Mono, monospace",
          "font-size": "6.5",
          opacity: "0.7"
        });
        text.textContent = String(Math.round(rect.width));
        dimSvg.appendChild(text);
      });
    }
    topdim.appendChild(dimSvg);

    // Nomes de secção visíveis.
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const el = labelEls[index];
      if (!el) return;
      const top = rect.top - innerRect.top;
      const visible = rect.bottom > innerRect.top + 20 && rect.top < innerRect.bottom - 20;
      el.style.display = visible ? "inline-flex" : "none";
      if (visible) {
        el.style.top = `${Math.max(0, Math.min(height - 22, top))}px`;
        const sheet = section.dataset.sheet || document.body.dataset.sheet || "A-00";
        const name =
          section.dataset.sheetName ||
          section.dataset.sectionName ||
          section.querySelector("h1, h2")?.textContent?.trim() ||
          "Secção";
        const span = el.querySelector("span");
        if (span) span.textContent = `${name} · ${Math.round(rect.height)} px`;
        const b = el.querySelector("b");
        if (b) b.textContent = sheet;

        // Linha de eixo no início da secção.
        const y = Math.max(0, Math.min(height, top));
        marks.appendChild(
          svgEl("line", {
            x1: 0,
            y1: y,
            x2: width,
            y2: y,
            stroke: "#FF4B00",
            "stroke-width": "0.5",
            "stroke-dasharray": "3 4",
            opacity: "0.55"
          })
        );
      }
    });

    // Cotas reais de blocos assinalados.
    const candidates = Array.from(document.querySelectorAll("[data-planta-cota]")).filter(
      (el) => {
        const rect = el.getBoundingClientRect();
        return (
          rect.width > 30 &&
          rect.height > 20 &&
          rect.bottom > innerRect.top + 20 &&
          rect.top < innerRect.bottom - 20
        );
      }
    );

    measureEls.forEach((el) => el.remove());
    measureEls = [];

    candidates.slice(0, 3).forEach((el) => {
      const rect = el.getBoundingClientRect();
      const x = rect.left - innerRect.left;
      const y = rect.top - innerRect.top;
      const w = rect.width;
      const h = rect.height;

      const box = svgEl("rect", {
        x,
        y,
        width: w,
        height: h,
        fill: "none",
        stroke: "#FF4B00",
        "stroke-width": "0.8",
        "stroke-dasharray": "4 4",
        opacity: "0.85"
      });
      marks.appendChild(box);

      // Cota horizontal acima (ou abaixo, se não houver espaço).
      const dimY = y > 34 ? y - 14 : y + h + 14;
      marks.appendChild(
        svgEl("line", {
          x1: x,
          y1: dimY,
          x2: x + w,
          y2: dimY,
          stroke: "#FF4B00",
          "stroke-width": "0.8"
        })
      );
      [x, x + w].forEach((px) => {
        marks.appendChild(
          svgEl("line", {
            x1: px,
            y1: dimY - 5,
            x2: px,
            y2: dimY + 5,
            stroke: "#FF4B00",
            "stroke-width": "0.8"
          })
        );
      });

      const wLabel = document.createElement("div");
      wLabel.className = "planta__measure";
      wLabel.textContent = mm(w);
      wLabel.style.left = `${x + w / 2}px`;
      wLabel.style.top = `${dimY}px`;
      inner.appendChild(wLabel);
      measureEls.push(wLabel);

      // Cota vertical.
      const dimX = x + w + 22 < width ? x + w + 18 : x - 18;
      marks.appendChild(
        svgEl("line", {
          x1: dimX,
          y1: y,
          x2: dimX,
          y2: y + h,
          stroke: "#FF4B00",
          "stroke-width": "0.8"
        })
      );
      [y, y + h].forEach((py) => {
        marks.appendChild(
          svgEl("line", {
            x1: dimX - 5,
            y1: py,
            x2: dimX + 5,
            y2: py,
            stroke: "#FF4B00",
            "stroke-width": "0.8"
          })
        );
      });
      const hLabel = document.createElement("div");
      hLabel.className = "planta__measure";
      hLabel.textContent = mm(h);
      hLabel.style.left = `${dimX}px`;
      hLabel.style.top = `${y + h / 2}px`;
      hLabel.style.transform = "translate(-50%, -50%) rotate(-90deg)";
      inner.appendChild(hLabel);
      measureEls.push(hLabel);
    });
  };

  const schedule = () => {
    if (!isOn) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(measure);
  };

  const enable = () => {
    isOn = true;
    syncButtons();
    collectSections();
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
  };

  const disable = () => {
    isOn = false;
    syncButtons();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(frame);
    labelEls.forEach((el) => el.remove());
    labelEls = [];
    measureEls.forEach((el) => el.remove());
    measureEls = [];
    marks.innerHTML = "";
    topdim.innerHTML = "";
  };

  const toggle = (force) => {
    const next = typeof force === "boolean" ? force : !isOn;
    if (next === isOn) return;
    if (next) enable();
    else disable();
    writeState(next);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => toggle());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "g" && event.key !== "G") return;
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.matches("input, textarea, select, [contenteditable='true']") ||
        target.closest("input, textarea, select, [contenteditable='true']"))
    ) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    event.preventDefault();
    toggle();
  });

  syncButtons();
  if (readState()) enable();

  document.fonts?.ready?.then(() => {
    if (isOn) schedule();
  });
}
