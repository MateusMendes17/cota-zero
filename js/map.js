/**
 * COTA ZERO — map.js
 * Mapa de Portugal continental em SVG, pontos por coordenadas reais, legenda
 * numerada e ligação bidirecional com a tabela de projetos.
 */

import { projects, formatNumber } from "./data.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEW = { w: 420, h: 700 };
const BOUNDS = { lngMin: -9.6, lngMax: -6.1, latMin: 36.8, latMax: 42.2 };
const PAD = { x: 60, y: 40, w: 300, h: 620 };

const OUTLINE = [
  [-8.87, 41.88], [-8.83, 41.70], [-8.79, 41.40], [-8.75, 41.15], [-8.72, 40.90],
  [-8.75, 40.64], [-8.80, 40.40], [-8.87, 40.15], [-8.91, 39.90], [-9.00, 39.75],
  [-9.07, 39.60], [-9.20, 39.45], [-9.38, 39.36], [-9.42, 39.10], [-9.45, 38.85],
  [-9.42, 38.70], [-9.30, 38.62], [-9.14, 38.70], [-9.00, 38.60], [-8.90, 38.52],
  [-8.87, 38.30], [-8.87, 37.95], [-8.90, 37.60], [-8.95, 37.20], [-8.98, 37.02],
  [-8.85, 37.00], [-8.70, 37.05], [-8.50, 37.10], [-8.20, 37.05], [-7.95, 37.02],
  [-7.70, 37.10], [-7.42, 37.19], [-7.40, 37.30], [-7.45, 37.50], [-7.50, 37.72],
  [-7.42, 37.92], [-7.35, 38.10], [-7.10, 38.20], [-7.00, 38.40], [-6.95, 38.60],
  [-6.90, 38.90], [-7.05, 39.10], [-7.25, 39.30], [-7.30, 39.50], [-7.10, 39.70],
  [-6.95, 39.85], [-6.90, 40.00], [-6.80, 40.15], [-6.75, 40.30], [-6.60, 40.50],
  [-6.65, 40.70], [-6.85, 40.85], [-6.95, 41.00], [-6.75, 41.10], [-6.60, 41.25],
  [-6.65, 41.40], [-6.85, 41.50], [-6.95, 41.65], [-6.85, 41.80], [-6.95, 41.95],
  [-7.10, 42.05], [-7.30, 41.95], [-7.45, 41.85], [-7.65, 41.90], [-7.85, 41.95],
  [-8.05, 42.00], [-8.20, 42.08], [-8.40, 42.10], [-8.60, 42.06], [-8.75, 41.98],
  [-8.87, 41.88]
];

const RIVERS = [
  [
    [-8.68, 41.14], [-8.25, 41.16], [-7.90, 41.12], [-7.55, 41.10], [-7.25, 41.05],
    [-6.98, 41.02], [-6.75, 41.08], [-6.58, 41.05]
  ],
  [
    [-9.10, 38.72], [-8.82, 38.86], [-8.55, 39.02], [-8.28, 39.24], [-8.00, 39.44],
    [-7.65, 39.60], [-7.30, 39.72], [-7.02, 39.82], [-6.78, 39.88]
  ],
  [
    [-8.86, 38.50], [-8.58, 38.42], [-8.28, 38.33], [-7.98, 38.25], [-7.70, 38.18]
  ],
  [
    [-7.42, 37.20], [-7.38, 37.55], [-7.32, 37.90], [-7.18, 38.28], [-7.08, 38.65],
    [-7.00, 39.02], [-6.92, 39.38], [-6.88, 39.70]
  ]
];

const OFFSETS = {
  "casa-do-muro": [-18, -16],
  "armazem-14": [-28, 22],
  "escola-valongo": [33, 8],
  "casa-corten": [-27, 15],
  "oficina-aurora": [29, 10],
  "torre-do-relogio": [26, -15]
};

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });

const projectPoint = (lng, lat) => {
  const x = PAD.x + ((lng - BOUNDS.lngMin) / (BOUNDS.lngMax - BOUNDS.lngMin)) * PAD.w;
  const y = PAD.y + ((BOUNDS.latMax - lat) / (BOUNDS.latMax - BOUNDS.latMin)) * PAD.h;
  return { x, y };
};

const smoothPath = (points, close = true) => {
  if (!points.length) return "";
  const pts = points.map(([lng, lat]) => projectPoint(lng, lat));
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  const count = pts.length;
  for (let i = 0; i < count; i += 1) {
    if (!close && i === count - 1) break;
    const p0 = pts[(i - 1 + count) % count];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % count];
    const p3 = pts[(i + 2) % count];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  if (close) d += " Z";
  return d;
};

const svgEl = (name, attrs = {}) => {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value === undefined ? "" : String(value));
  });
  return el;
};

const activeIdsFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const tipo = params.get("tipo") || "";
  const ano = params.get("ano") || "";
  const estado = params.get("estado") || "";
  const focus = params.get("projeto") || "";
  return projects
    .filter((project) => {
      if (tipo && project.tipologia !== tipo) return false;
      if (ano && String(project.ano) !== ano) return false;
      if (estado && project.estadoKey !== estado) return false;
      if (focus && project.id !== focus) return false;
      return true;
    })
    .map((project) => project.id);
};

const buildSvg = (container) => {
  const svg = svgEl("svg", {
    class: "map__svg",
    viewBox: `0 0 ${VIEW.w} ${VIEW.h}`,
    role: "group",
    "aria-label": "Mapa de Portugal continental com a localização dos projetos da Cota Zero",
    preserveAspectRatio: "xMidYMid meet"
  });

  const title = svgEl("title");
  title.textContent = "Portugal continental — projetos Cota Zero";
  svg.appendChild(title);

  const desc = svgEl("desc");
  desc.textContent =
    "Seis pontos numerados localizam os projetos. Cada ponto pode ser ativado por teclado e filtra a tabela de projetos.";
  svg.appendChild(desc);

  // Quadro e graticula.
  svg.appendChild(
    svgEl("rect", {
      class: "map__frame",
      x: 24,
      y: 18,
      width: 372,
      height: 666
    })
  );

  const graticule = svgEl("g", { class: "map__graticule-group", "aria-hidden": "true" });
  for (let lat = 37; lat <= 42; lat += 1) {
    const y = projectPoint(-8.1, lat).y;
    graticule.appendChild(
      svgEl("line", {
        class: "map__graticule",
        x1: 48,
        y1: y,
        x2: 372,
        y2: y
      })
    );
    const label = svgEl("text", {
      class: "map__grat-label",
      x: 40,
      y: y + 2,
      "text-anchor": "end"
    });
    label.textContent = `${lat}°N`;
    graticule.appendChild(label);
  }
  for (let lng = -9; lng <= -7; lng += 1) {
    const x = projectPoint(lng, 39.5).x;
    graticule.appendChild(
      svgEl("line", {
        class: "map__graticule",
        x1: x,
        y1: 30,
        x2: x,
        y2: 674
      })
    );
    const label = svgEl("text", {
      class: "map__grat-label",
      x,
      y: 686,
      "text-anchor": "middle"
    });
    label.textContent = `${Math.abs(lng)}°O`;
    graticule.appendChild(label);
  }
  svg.appendChild(graticule);

  // Rio.
  const rivers = svgEl("g", { class: "map__rivers", "aria-hidden": "true" });
  RIVERS.forEach((river) => {
    rivers.appendChild(
      svgEl("path", {
        class: "map__river",
        d: smoothPath(river, false)
      })
    );
  });
  svg.appendChild(rivers);

  // Contorno.
  svg.appendChild(
    svgEl("path", {
      class: "map__land map__land--fill",
      d: smoothPath(OUTLINE, true)
    })
  );
  svg.appendChild(
    svgEl("path", {
      class: "map__land",
      d: smoothPath(OUTLINE, true)
    })
  );

  // Rótulo do mapa.
  const mapLabel = svgEl("text", {
    class: "map__grat-label",
    x: 30,
    y: 38,
    "font-size": "8",
    "letter-spacing": "0.12em"
  });
  mapLabel.textContent = "PORTUGAL CONTINENTAL";
  svg.appendChild(mapLabel);

  const scaleLabel = svgEl("text", {
    class: "map__grat-label",
    x: 30,
    y: 62
  });
  scaleLabel.textContent = "WGS 84 · ESCALA GRÁFICA";
  svg.appendChild(scaleLabel);

  const pointsGroup = svgEl("g", { class: "map__points" });
  const markers = new Map();

  projects.forEach((project, index) => {
    const truePoint = projectPoint(project.lng, project.lat);
    const offset = OFFSETS[project.id] || [0, 0];
    const markerX = Math.min(370, Math.max(52, truePoint.x + offset[0]));
    const markerY = Math.min(664, Math.max(32, truePoint.y + offset[1]));
    const id = String(index + 1).padStart(2, "0");

    const group = svgEl("g", {
      class: "map-point",
      "data-map-point": project.id,
      tabindex: "0",
      role: "button",
      "aria-label": `${project.codigo}, ${project.nome}, ${project.local}, ${project.ano}, ${formatNumber(project.area)} metros quadrados`,
      "data-cursor": "VER"
    });

    group.appendChild(
      svgEl("line", {
        class: "map-point__leader",
        x1: truePoint.x,
        y1: truePoint.y,
        x2: markerX,
        y2: markerY
      })
    );
    group.appendChild(
      svgEl("circle", {
        cx: truePoint.x,
        cy: truePoint.y,
        r: 1.7,
        fill: "currentColor",
        "aria-hidden": "true"
      })
    );
    group.appendChild(
      svgEl("circle", {
        class: "map-point__hit",
        cx: markerX,
        cy: markerY,
        r: 20
      })
    );
    group.appendChild(
      svgEl("circle", {
        class: "map-point__dot",
        cx: markerX,
        cy: markerY,
        r: 8
      })
    );
    const number = svgEl("text", {
      class: "map-point__num",
      x: markerX,
      y: markerY + 2.4
    });
    number.textContent = id;
    group.appendChild(number);

    pointsGroup.appendChild(group);
    markers.set(project.id, group);
  });
  svg.appendChild(pointsGroup);
  container.appendChild(svg);

  return { svg, pointsGroup, markers };
};

const buildChrome = (container) => {
  const north = document.createElement("div");
  north.className = "map__north";
  north.innerHTML = `
    <span class="north" aria-hidden="true">
      <svg class="north__arrow" viewBox="0 0 20 28"><line x1="10" y1="26" x2="10" y2="5"/><path d="M10 1l4 9H6z"/></svg>
      N
    </span>
  `;
  container.appendChild(north);

  const scale = document.createElement("div");
  scale.className = "map__scale";
  scale.innerHTML = `
    <span class="scalebar" aria-hidden="true">
      <span class="scalebar__bar"><i></i><i></i><i></i><i></i></span>
      <span class="scalebar__labels"><span>0</span><span>50</span><span>100 km</span></span>
    </span>
  `;
  container.appendChild(scale);

  const tip = document.createElement("div");
  tip.className = "map__tip";
  tip.setAttribute("role", "status");
  tip.setAttribute("aria-live", "polite");
  container.appendChild(tip);
  return tip;
};

const buildLegend = (container, onSelect) => {
  const selector = container.dataset.mapLegend;
  if (!selector) return null;
  const legend = document.querySelector(selector);
  if (!legend) return null;
  legend.innerHTML = projects
    .map(
      (project, index) => `
      <li>
        <button type="button" data-map-project="${esc(project.id)}">
          <span class="visually-hidden">Filtrar por </span><b>${String(index + 1).padStart(2, "0")}</b>
          <span>${esc(project.nome)}</span>
          <span>${project.ano}</span>
        </button>
      </li>
    `
    )
    .join("");
  legend.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-map-project]");
    if (!button) return;
    onSelect(button.dataset.mapProject);
  });
  return legend;
};

export function initMaps() {
  const containers = Array.from(document.querySelectorAll("[data-map]"));
  if (!containers.length) return;

  containers.forEach((container) => {
    if (container.dataset.initialized === "true") return;
    container.dataset.initialized = "true";

    const mode = container.dataset.mapMode || "mini";
    const { markers } = buildSvg(container);
    const tip = buildChrome(container);
    let currentTipId = "";

    const setFocus = (id) => {
      if (mode === "index") {
        document.dispatchEvent(new CustomEvent("cz:mapfocus", { detail: { id } }));
      } else {
        window.location.href = `projetos.html?projeto=${encodeURIComponent(id)}`;
      }
    };

    const legend = buildLegend(container, setFocus);

    const updateActive = (ids, focusId = "") => {
      const activeSet = new Set(ids);
      const allActive = activeSet.size === projects.length;
      markers.forEach((marker, id) => {
        const active = activeSet.has(id);
        marker.classList.toggle("is-active", active && (Boolean(focusId) || !allActive));
        marker.classList.toggle("is-dim", !active);
        marker.setAttribute("aria-pressed", focusId === id ? "true" : "false");
      });
      if (legend) {
        legend.querySelectorAll("[data-map-project]").forEach((button) => {
          const id = button.dataset.mapProject;
          button.classList.toggle("is-active", activeSet.has(id) && (Boolean(focusId) || !allActive));
          if (focusId === id) button.setAttribute("aria-current", "true");
          else button.removeAttribute("aria-current");
        });
      }
    };

    const initialIds = activeIdsFromUrl();
    const initialFocus = new URLSearchParams(window.location.search).get("projeto") || "";
    updateActive(initialIds, initialFocus);

    document.addEventListener("cz:filterchange", (event) => {
      const ids = event.detail?.ids || projects.map((project) => project.id);
      updateActive(ids, event.detail?.focusId || "");
    });

    const showTip = (project, group) => {
      const circle = group.querySelector(".map-point__dot");
      if (!circle) return;
      const mapRect = container.getBoundingClientRect();
      const circleRect = circle.getBoundingClientRect();
      const top = circleRect.top - mapRect.top;
      const left = circleRect.left - mapRect.left + circleRect.width / 2;
      const below = top < 90;
      tip.classList.toggle("is-below", below);
      tip.innerHTML = `
        <div class="map__tip-code"><span>${esc(project.codigo)} / ${esc(project.estado)}</span><b>${project.ano}</b></div>
        <div class="map__tip-name">${esc(project.nome)}</div>
        <div class="map__tip-data"><span>${esc(project.local)}</span><span>${formatNumber(project.area)} m²</span></div>
      `;
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
      tip.classList.add("is-visible");
      currentTipId = project.id;
    };

    const hideTip = () => {
      tip.classList.remove("is-visible");
      currentTipId = "";
    };

    markers.forEach((group, id) => {
      const project = projects.find((item) => item.id === id);
      if (!project) return;
      group.addEventListener("pointerenter", () => showTip(project, group));
      group.addEventListener("pointerleave", hideTip);
      group.addEventListener("focus", () => showTip(project, group));
      group.addEventListener("blur", hideTip);
      group.addEventListener("click", () => setFocus(id));
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setFocus(id);
        }
      });
    });

    document.addEventListener("pointerdown", (event) => {
      if (!(event.target instanceof Node) || !container.contains(event.target)) hideTip();
    });
    window.addEventListener("scroll", hideTip, { passive: true });
    window.addEventListener("resize", hideTip);

    // Se a tabela mudar de estado sem evento (link direto), sincroniza ao voltar.
    window.addEventListener("popstate", () => {
      updateActive(activeIdsFromUrl(), new URLSearchParams(window.location.search).get("projeto") || "");
    });

    container.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && currentTipId) hideTip();
    });
  });
}
