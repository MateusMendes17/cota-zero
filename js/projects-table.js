/**
 * COTA ZERO — projects-table.js
 * Índice de projetos: ordenação, filtros combináveis, URL, vista tabela/grelha,
 * contador e ligação ao mapa. As linhas alimentam a imagem que segue o cursor.
 */

import {
  projects,
  tipologias,
  estados,
  anos,
  formatNumber,
  getProject
} from "./data.js";
import { initHoverPreviews } from "./hover-preview.js";

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });

const thumb = (src, width = 900, height = 675) => {
  if (src.startsWith("images/demo/") && src.endsWith(".webp")) {
    return /-900\.webp$/.test(src) ? src : src.replace(/\.webp$/, "-900.webp");
  }
  try {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("h", String(height));
    return url.href;
  } catch {
    return src;
  }
};

const slug = (value) => String(value).toLowerCase();

export function initProjectsTable() {
  const root = document.querySelector("[data-projects-index]");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const tbody = root.querySelector("[data-projects-tbody]");
  const grid = root.querySelector("[data-projects-grid]");
  const count = root.querySelector("[data-result-count]");
  const clearBtn = root.querySelector("[data-clear-filters]");
  const activeWrap = root.querySelector("[data-active-filters]");
  const tableView = root.querySelector("[data-table-view]");
  const gridView = root.querySelector("[data-grid-view]") || grid;
  const empty = root.querySelector("[data-empty]");
  const selects = {
    tipo: root.querySelector("[data-filter='tipologia']"),
    ano: root.querySelector("[data-filter='ano']"),
    estado: root.querySelector("[data-filter='estado']")
  };
  const viewButtons = Array.from(root.querySelectorAll("[data-view]"));
  const sortButtons = Array.from(root.querySelectorAll("[data-sort]"));
  const mobileSort = root.querySelector("[data-mobile-sort]");
  const mobileSortDir = root.querySelector("[data-mobile-sort-dir]");
  const table = root.querySelector("[data-projects-table]");
  if (!tbody || !grid || !count || !table) return;

  const defaults = {
    tipo: "",
    ano: "",
    estado: "",
    focus: "",
    ordem: "codigo",
    dir: "asc",
    vista: "tabela"
  };

  const state = { ...defaults };

  const validTipologias = new Set(tipologias.map((item) => item.value));
  const validEstados = new Set(estados.map((item) => item.value));
  const validAnos = new Set(anos.map((ano) => String(ano)));
  const sortFields = new Set(["codigo", "nome", "local", "ano", "tipologia", "area", "estado"]);

  const fillSelect = (select, items, firstLabel) => {
    if (!select) return;
    select.innerHTML = "";
    const first = document.createElement("option");
    first.value = "";
    first.textContent = firstLabel;
    select.appendChild(first);
    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });
  };

  fillSelect(
    selects.tipo,
    tipologias.map((item) => ({ value: item.value, label: item.label })),
    "Todas as tipologias"
  );
  fillSelect(
    selects.ano,
    anos.map((ano) => ({ value: String(ano), label: String(ano) })),
    "Todos os anos"
  );
  fillSelect(selects.estado, estados, "Todos os estados");

  const readUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const tipo = params.get("tipo") || "";
    const ano = params.get("ano") || "";
    const estado = params.get("estado") || "";
    const focus = params.get("projeto") || "";
    const ordem = params.get("ordem") || "codigo";
    const dir = params.get("dir") === "desc" ? "desc" : "asc";
    const vista = params.get("vista") === "grelha" ? "grelha" : "tabela";
    state.tipo = validTipologias.has(tipo) ? tipo : "";
    state.ano = validAnos.has(ano) ? ano : "";
    state.estado = validEstados.has(estado) ? estado : "";
    state.focus = getProject(focus) ? focus : "";
    state.ordem = sortFields.has(ordem) ? ordem : "codigo";
    state.dir = dir;
    state.vista = vista;
  };

  const syncUrl = () => {
    const params = new URLSearchParams();
    if (state.tipo) params.set("tipo", state.tipo);
    if (state.ano) params.set("ano", state.ano);
    if (state.estado) params.set("estado", state.estado);
    if (state.focus) params.set("projeto", state.focus);
    if (state.vista === "grelha") params.set("vista", "grelha");
    if (state.ordem !== "codigo" || state.dir !== "asc") {
      params.set("ordem", state.ordem);
      params.set("dir", state.dir);
    }
    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  };

  const updateControls = () => {
    Object.entries(selects).forEach(([key, select]) => {
      if (select) select.value = state[key];
    });
    viewButtons.forEach((button) => {
      button.setAttribute("aria-pressed", button.dataset.view === state.vista ? "true" : "false");
    });
    if (tableView) tableView.hidden = state.vista !== "tabela";
    if (gridView) gridView.hidden = state.vista !== "grelha";

    if (mobileSort) mobileSort.value = state.ordem;
    if (mobileSortDir) {
      mobileSortDir.textContent = state.dir === "asc" ? "↑" : "↓";
      mobileSortDir.setAttribute(
        "aria-label",
        `Inverter para ordem ${state.dir === "asc" ? "descendente" : "ascendente"}`
      );
    }

    sortButtons.forEach((button) => {
      const th = button.closest("th");
      const key = button.dataset.sort;
      if (!th) return;
      const active = state.ordem === key;
      th.setAttribute("aria-sort", active ? (state.dir === "asc" ? "ascending" : "descending") : "none");
      const arrow = button.querySelector(".sort-arrow");
      if (arrow) arrow.textContent = active ? (state.dir === "asc" ? "↑" : "↓") : "↕";
      const label = button.dataset.label || key;
      const visible = button.querySelector("span:first-child")?.textContent.trim() || label;
      button.setAttribute(
        "aria-label",
        `Ordenar por ${visible} (${label})${active ? (state.dir === "asc" ? ", descendente" : ", ascendente") : ""}`
      );
    });

    const hasFilters = Boolean(state.tipo || state.ano || state.estado || state.focus);
    if (clearBtn) clearBtn.disabled = !hasFilters;

    if (activeWrap) {
      const chips = [];
      if (state.tipo) {
        const label = tipologias.find((item) => item.value === state.tipo)?.label || state.tipo;
        chips.push(
          `<span class="filter-chip">Tipologia: ${esc(label)}<button type="button" data-clear="tipo" aria-label="Remover filtro de tipologia">×</button></span>`
        );
      }
      if (state.ano) {
        chips.push(
          `<span class="filter-chip">Ano: ${esc(state.ano)}<button type="button" data-clear="ano" aria-label="Remover filtro de ano">×</button></span>`
        );
      }
      if (state.estado) {
        const label = estados.find((item) => item.value === state.estado)?.label || state.estado;
        chips.push(
          `<span class="filter-chip">Estado: ${esc(label)}<button type="button" data-clear="estado" aria-label="Remover filtro de estado">×</button></span>`
        );
      }
      if (state.focus) {
        const project = getProject(state.focus);
        chips.push(
          `<span class="filter-chip">Projeto: ${esc(project?.nome || state.focus)}<button type="button" data-clear="focus" aria-label="Remover foco de projeto">×</button></span>`
        );
      }
      activeWrap.innerHTML = chips.join("");
    }
  };

  const filtered = () => {
    const list = projects.filter((project) => {
      if (state.tipo && project.tipologia !== state.tipo) return false;
      if (state.ano && String(project.ano) !== state.ano) return false;
      if (state.estado && project.estadoKey !== state.estado) return false;
      if (state.focus && project.id !== state.focus) return false;
      return true;
    });

    const direction = state.dir === "asc" ? 1 : -1;
    return list.sort((a, b) => {
      let result = 0;
      switch (state.ordem) {
        case "ano":
          result = a.ano - b.ano;
          break;
        case "area":
          result = a.area - b.area;
          break;
        case "nome":
          result = a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" });
          break;
        case "local":
          result = a.local.localeCompare(b.local, "pt", { sensitivity: "base" });
          break;
        case "tipologia":
          result = a.tipologiaLabel.localeCompare(b.tipologiaLabel, "pt", { sensitivity: "base" });
          break;
        case "estado":
          result = a.estado.localeCompare(b.estado, "pt", { sensitivity: "base" });
          break;
        case "codigo":
        default:
          result = a.codigo.localeCompare(b.codigo, "pt", { numeric: true });
          break;
      }
      if (result === 0) result = a.codigo.localeCompare(b.codigo, "pt", { numeric: true });
      return result * direction;
    });
  };

  const renderRows = (list) => {
    tbody.innerHTML = list
      .map((project) => {
        const image = thumb(project.capa.src);
        return `
          <tr data-preview-src="${esc(image)}"
              data-preview-alt="${esc(project.capa.alt)}"
              data-preview-code="${esc(project.codigo)}"
              data-preview-name="${esc(project.nome)}"
              data-cursor="VER">
            <td class="td-code" data-label="Nº">${esc(project.codigo)}</td>
            <td class="td-name" data-label="Nome"><a class="row-link" href="projeto.html?id=${encodeURIComponent(project.id)}">${esc(project.nome)}</a></td>
            <td class="td-local" data-label="Local">${esc(project.local)}</td>
            <td class="td-year" data-label="Ano">${project.ano}</td>
            <td class="td-type" data-label="Tipologia">${esc(project.tipologiaLabel)}</td>
            <td class="td-area" data-label="Área (m²)">${formatNumber(project.area)}</td>
            <td class="td-status" data-label="Estado"><span class="status status--${esc(project.estadoKey)}">${esc(project.estado)}</span></td>
          </tr>
        `;
      })
      .join("");
  };

  const renderGrid = (list) => {
    grid.innerHTML = list
      .map((project) => {
        const image = thumb(project.capa.src);
        return `
          <article class="project-card">
            <div class="media media--4x3 project-card__media">
              <img src="${esc(image)}" alt="${esc(project.capa.alt)}" width="900" height="675" loading="lazy" decoding="async">
            </div>
            <div class="project-card__top"><b>${esc(project.codigo)}</b><span>${project.ano} · ${esc(project.local)}</span></div>
            <h3 class="project-card__name">${esc(project.nome)}</h3>
            <div class="project-card__meta">
              <span>${esc(project.tipologiaLabel)}</span>
              <span>${formatNumber(project.area)} m² · ${esc(project.estado)}</span>
            </div>
            <a class="project-card__link" href="projeto.html?id=${encodeURIComponent(project.id)}" aria-label="Ver projeto ${esc(project.nome)}"></a>
          </article>
        `;
      })
      .join("");
  };

  const render = () => {
    const list = filtered();
    renderRows(list);
    renderGrid(list);
    count.textContent = String(list.length).padStart(2, "0");
    if (empty) empty.hidden = list.length > 0;
    if (tableView) tableView.hidden = state.vista !== "tabela" || list.length === 0;
    if (gridView) gridView.hidden = state.vista !== "grelha" || list.length === 0;
    updateControls();
    syncUrl();
    document.dispatchEvent(
      new CustomEvent("cz:filterchange", {
        detail: {
          ids: list.map((project) => project.id),
          focusId: state.focus,
          filters: { tipo: state.tipo, ano: state.ano, estado: state.estado }
        }
      })
    );
  };

  Object.entries(selects).forEach(([key, select]) => {
    if (!select) return;
    select.addEventListener("change", () => {
      state[key] = select.value;
      render();
    });
  });

  sortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const field = button.dataset.sort;
      if (!field) return;
      if (state.ordem === field) {
        state.dir = state.dir === "asc" ? "desc" : "asc";
      } else {
        state.ordem = field;
        state.dir = field === "ano" || field === "area" ? "desc" : "asc";
      }
      render();
    });
  });

  mobileSort?.addEventListener("change", () => {
    const field = mobileSort.value;
    if (!sortFields.has(field)) return;
    state.ordem = field;
    state.dir = field === "ano" || field === "area" ? "desc" : "asc";
    render();
  });

  mobileSortDir?.addEventListener("click", () => {
    state.dir = state.dir === "asc" ? "desc" : "asc";
    render();
  });

  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.vista = button.dataset.view === "grelha" ? "grelha" : "tabela";
      render();
    });
  });

  clearBtn?.addEventListener("click", () => {
    state.tipo = "";
    state.ano = "";
    state.estado = "";
    state.focus = "";
    render();
  });

  activeWrap?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-clear]");
    if (!button) return;
    const key = button.dataset.clear;
    if (key === "tipo") state.tipo = "";
    else if (key === "ano") state.ano = "";
    else if (key === "estado") state.estado = "";
    else if (key === "focus") state.focus = "";
    render();
  });

  empty?.querySelector("[data-empty-clear]")?.addEventListener("click", () => {
    state.tipo = "";
    state.ano = "";
    state.estado = "";
    state.focus = "";
    render();
  });

  document.addEventListener("cz:mapfocus", (event) => {
    const id = event.detail?.id;
    if (!id || !getProject(id)) return;
    state.focus = state.focus === id ? "" : id;
    render();
    if (window.innerWidth < 960) {
      const filters = root.querySelector("[data-filters]");
      filters?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    }
  });

  window.addEventListener("popstate", () => {
    readUrl();
    render();
  });

  readUrl();
  render();
  initHoverPreviews();
}
