/**
 * COTA ZERO — materials.js
 * Biblioteca de materiais: índice, fichas, obra construída por material e
 * matriz de compatibilidades. Tudo gerado a partir de data.js.
 */

import {
  materials,
  projects,
  getProjectsByMaterial
} from "./data.js";

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });

const projectLinks = (key) => {
  const list = getProjectsByMaterial(key);
  if (!list.length) {
    return `<p class="micro">Sem obra construída com este material.</p>`;
  }
  return list
    .map(
      (project) => `
        <a href="projeto.html?id=${encodeURIComponent(project.id)}" data-material-project="${esc(project.id)}">
          <span><b>${esc(project.codigo)}</b> ${esc(project.nome)}</span>
          <span>${project.ano}</span>
        </a>
      `
    )
    .join("");
};

const materialMarkup = (material) => {
  const count = getProjectsByMaterial(material.key).length;
  return `
    <article class="material" id="${esc(material.key)}" data-material="${esc(material.key)}" tabindex="-1">
      <div class="material__swatch ${esc(material.classe)}" data-code="${esc(material.codigo)}" role="img" aria-label="Textura de ${esc(material.nome)}"></div>
      <div class="material__body">
        <div class="material__head">
          <h2 class="material__name">${esc(material.nome)}</h2>
          <span class="material__tag">${esc(material.codigo)} · ${String(count).padStart(2, "0")} obra${count === 1 ? "" : "s"}</span>
        </div>
        <p class="material__text">${esc(material.descricao)}</p>
        <div class="material__cols">
          <div>
            <table class="spec-table">
              <caption class="visually-hidden">Ficha técnica de ${esc(material.nome)}</caption>
              <tbody>
                <tr><th scope="row">Origem</th><td>${esc(material.origem)}</td></tr>
                <tr><th scope="row">Acabamento</th><td>${esc(material.acabamento)}</td></tr>
                <tr><th scope="row">Aplicação</th><td>${esc(material.uso)}</td></tr>
                <tr><th scope="row">Regra de obra</th><td>${esc(material.nota)}</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <p class="micro" style="margin-bottom:8px;">Obra construída · ${esc(material.nome)}</p>
            <div class="material__projects" data-material-projects>
              ${projectLinks(material.key)}
            </div>
          </div>
        </div>
      </div>
    </article>
  `;
};

const jumpMarkup = (material) => {
  const count = getProjectsByMaterial(material.key).length;
  return `
    <button type="button" class="material-jump" data-material-jump="${esc(material.key)}" aria-pressed="false">
      <span class="material-jump__num">${esc(material.codigo)}</span>
      <span class="material-jump__name">${esc(material.nome)}</span>
      <span class="material-jump__num">${String(count).padStart(2, "0")} obras</span>
    </button>
  `;
};

const matrixMarkup = () => `
  <table class="matrix">
    <caption class="visually-hidden">Matriz de materiais por projeto. A coluna assinala os projetos que usam cada material.</caption>
    <thead>
      <tr>
        <th scope="col">Material / Projeto</th>
        ${projects
          .map(
            (project) => `
              <th scope="col" data-matrix-col="${esc(project.id)}">
                <a href="projeto.html?id=${encodeURIComponent(project.id)}" title="${esc(project.nome)}">${esc(project.codigo)}</a>
              </th>
            `
          )
          .join("")}
      </tr>
    </thead>
    <tbody>
      ${materials
        .map(
          (material) => `
            <tr data-matrix-row="${esc(material.key)}">
              <th scope="row" class="matrix__proj">${esc(material.nome)}</th>
              ${projects
                .map((project) => {
                  const on = project.materiais.includes(material.key);
                  return `<td class="matrix__cell${on ? " is-on" : ""}" data-matrix-col="${esc(project.id)}" data-matrix-cell="${esc(project.id)}:${esc(material.key)}">
                    <span aria-hidden="true"></span>
                    <span class="visually-hidden">${on ? "Sim" : "Não"}</span>
                  </td>`;
                })
                .join("")}
            </tr>
          `
        )
        .join("")}
    </tbody>
  </table>
`;

export function initMaterials() {
  const root = document.querySelector("[data-materials-page]");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const jumpsRoot = root.querySelector("[data-materials-jumps]");
  const listRoot = root.querySelector("[data-materials-list]");
  const matrixRoot = root.querySelector("[data-material-matrix]");
  const clearButton = root.querySelector("[data-materials-clear]");
  const activeLabel = root.querySelector("[data-material-active]");
  if (!listRoot || !matrixRoot) return;

  if (jumpsRoot) jumpsRoot.innerHTML = materials.map(jumpMarkup).join("");
  listRoot.innerHTML = materials.map(materialMarkup).join("");
  matrixRoot.innerHTML = matrixMarkup();

  const articles = Array.from(root.querySelectorAll("[data-material]"));
  const jumps = Array.from(root.querySelectorAll("[data-material-jump]"));
  const matrixColumns = Array.from(root.querySelectorAll("[data-matrix-col]"));
  const matrixRows = Array.from(root.querySelectorAll("[data-matrix-row]"));
  let active = "";

  const apply = (key, scroll = false) => {
    active = key && materials.some((material) => material.key === key) ? key : "";

    articles.forEach((article) => {
      const on = article.dataset.material === active;
      article.classList.toggle("is-active", Boolean(active) && on);
      article.classList.toggle("is-dim", Boolean(active) && !on);
      const lists = article.querySelectorAll("[data-material-projects]");
      lists.forEach((list) => {
        list.classList.toggle("is-highlighted", Boolean(active) && on);
        list.querySelectorAll("a").forEach((link) => {
          link.classList.toggle("is-match", Boolean(active) && on);
        });
      });
    });

    jumps.forEach((button) => {
      const on = button.dataset.materialJump === active;
      button.classList.toggle("is-active", Boolean(active) && on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    });

    matrixRows.forEach((row) => {
      row.classList.toggle("is-row-active", Boolean(active) && row.dataset.matrixRow === active);
    });

    if (clearButton) clearButton.hidden = !active;

    if (activeLabel) {
      const current = materials.find((material) => material.key === active);
      activeLabel.textContent = current ? `${current.codigo} · ${current.nome}` : "todas as fichas";
    }

    if (scroll && active) {
      const article = root.querySelector(`[data-material="${active}"]`);
      article?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    }

    const base = `${window.location.pathname}${window.location.search}`;
    if (active) window.history.replaceState(null, "", `${base}#${active}`);
    else window.history.replaceState(null, "", base);
  };

  const toggle = (key) => {
    apply(active === key ? "" : key, active !== key);
  };

  jumpsRoot?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-material-jump]");
    if (!button) return;
    toggle(button.dataset.materialJump || "");
  });

  clearButton?.addEventListener("click", () => apply(""));

  // A matriz destaca a coluna do projeto em foco.
  const setColumn = (projectId) => {
    matrixColumns.forEach((cell) => {
      cell.classList.toggle("is-col-active", Boolean(projectId) && cell.dataset.matrixCol === projectId);
    });
  };

  matrixRoot.addEventListener("pointerover", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const cell = target.closest("[data-matrix-col]");
    if (cell) setColumn(cell.dataset.matrixCol || "");
  });
  matrixRoot.addEventListener("pointerleave", () => setColumn(""));
  matrixRoot.addEventListener("focusin", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const cell = target.closest("[data-matrix-col]");
    if (cell) setColumn(cell.dataset.matrixCol || "");
  });
  matrixRoot.addEventListener("focusout", () => setColumn(""));

  window.addEventListener("hashchange", () => {
    apply(window.location.hash.replace(/^#/, ""), false);
  });

  const initial = window.location.hash.replace(/^#/, "");
  if (initial) apply(initial, true);
}
