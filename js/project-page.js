/**
 * COTA ZERO — project-page.js
 * Lê o projeto pelo parâmetro ?id=, preenche a folha técnica, a galeria,
 * o comparador de corte, os desenhos e a navegação. Inclui lightbox acessível.
 */

import {
  projects,
  getProject,
  getRelatedProjects,
  getMaterial,
  formatNumber,
  formatArea
} from "./data.js";
import { planSVG, sectionSVG, elevationSVG } from "./drawings.js";

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

const setText = (root, selector, value) => {
  root.querySelectorAll(selector).forEach((el) => {
    el.textContent = value;
  });
};

const setHTML = (root, selector, value) => {
  root.querySelectorAll(selector).forEach((el) => {
    el.innerHTML = value;
  });
};

const meta = (selector) => document.querySelector(selector);
const SITE = "https://cotazero.pt";
const absolute = (src) => new URL(src, `${SITE}/`).href;
const socialImage = (src) =>
  src.startsWith("images/demo/")
    ? src.replace(/-\d+x\d+\.webp$/, "-1200x630.webp")
    : src;

const updateHead = (project) => {
  const title = `${project.nome} — ${project.local} | Cota Zero`;
  const description = `${project.descricaoCurta} ${project.ano}. ${project.tipologiaLabel}, ${formatArea(project.area)}, ${project.local}.`;
  document.title = title;
  const descriptionEl = meta('meta[name="description"]');
  if (descriptionEl) descriptionEl.setAttribute("content", description);
  const ogTitle = meta('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", title);
  const ogDescription = meta('meta[property="og:description"]');
  if (ogDescription) ogDescription.setAttribute("content", description);
  const ogImage = meta('meta[property="og:image"]');
  if (ogImage) ogImage.setAttribute("content", absolute(socialImage(project.capa.src)));
  const twitterImage = meta('meta[name="twitter:image"]');
  if (twitterImage) twitterImage.setAttribute("content", absolute(socialImage(project.capa.src)));
  const ogType = meta('meta[property="og:type"]');
  if (ogType) ogType.setAttribute("content", "article");
  const canonical = meta('link[rel="canonical"]');
  const url = `${SITE}/projeto.html?id=${encodeURIComponent(project.id)}`;
  if (canonical) canonical.setAttribute("href", url);
  const ogUrl = meta('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute("content", url);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${url}#project`,
        name: project.nome,
        alternateName: project.codigo,
        description: project.memoria.join(" "),
        dateCreated: String(project.ano),
        creator: {
          "@type": "Organization",
          name: "Cota Zero, Atelier de Arquitetura",
          url: SITE
        },
        locationCreated: {
          "@type": "Place",
          name: `${project.local}, ${project.distrito}, Portugal`,
          geo: {
            "@type": "GeoCoordinates",
            latitude: project.lat,
            longitude: project.lng
          }
        },
        image: project.imagens.map((image) => absolute(image.src)),
        material: project.materiais.map((key) => getMaterial(key)?.nome || key),
        area: {
          "@type": "QuantitativeValue",
          value: project.area,
          unitCode: "MTK"
        },
        url
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Início",
            item: `${SITE}/index.html`
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projetos",
            item: `${SITE}/projetos.html`
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.nome,
            item: url
          }
        ]
      }
    ]
  };
  let schemaEl = document.getElementById("project-schema");
  if (!schemaEl) {
    schemaEl = document.createElement("script");
    schemaEl.type = "application/ld+json";
    schemaEl.id = "project-schema";
    document.head.appendChild(schemaEl);
  }
  schemaEl.textContent = JSON.stringify(schema);
};

const lightboxController = (images, project) => {
  const box = document.querySelector("[data-lightbox]");
  if (!box) return null;
  const img = box.querySelector("[data-lightbox-img]");
  const caption = box.querySelector("[data-lightbox-cap]");
  const count = box.querySelector("[data-lightbox-count]");
  const closeBtn = box.querySelector("[data-lightbox-close]");
  const prevBtn = box.querySelector("[data-lightbox-prev]");
  const nextBtn = box.querySelector("[data-lightbox-next]");
  const titleEl = box.querySelector("[data-lightbox-title]");
  if (!img || !closeBtn || !prevBtn || !nextBtn) return null;

  let index = 0;
  let open = false;
  let lastFocus = null;

  const preload = (i) => {
    const image = images[(i + images.length) % images.length];
    if (!image) return;
    const pre = new Image();
    pre.src = image.src;
  };

  const show = (i, focusImage = false) => {
    index = (i + images.length) % images.length;
    const image = images[index];
    img.src = image.src;
    img.alt = image.alt;
    img.width = image.largura;
    img.height = image.altura;
    img.classList.remove("is-color");
    if (caption) caption.textContent = image.legenda;
    if (count) count.textContent = `${String(index + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;
    if (titleEl) titleEl.innerHTML = `${esc(project.codigo)} · ${esc(project.nome)}`;
    window.requestAnimationFrame(() => img.classList.add("is-color"));
    preload(index + 1);
    preload(index - 1);
    if (focusImage) closeBtn.focus({ preventScroll: true });
  };

  const openBox = (i) => {
    if (open) return;
    open = true;
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.classList.add("is-locked");
    show(i);
    window.requestAnimationFrame(() => closeBtn.focus({ preventScroll: true }));
  };

  const closeBox = () => {
    if (!open) return;
    open = false;
    box.hidden = true;
    document.body.classList.remove("is-locked");
    img.src = "";
    if (lastFocus instanceof HTMLElement) lastFocus.focus({ preventScroll: true });
  };

  closeBtn.addEventListener("click", closeBox);
  prevBtn.addEventListener("click", () => show(index - 1));
  nextBtn.addEventListener("click", () => show(index + 1));
  box.addEventListener("click", (event) => {
    if (event.target === box) closeBox();
  });

  document.addEventListener("keydown", (event) => {
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeBox();
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = [closeBtn, prevBtn, nextBtn];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  return { open: openBox };
};

export function initProjectPage() {
  const root = document.querySelector("[data-project-page]");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const params = new URLSearchParams(window.location.search);
  const requested = params.get("id");
  const fallback = projects[0];
  const project = requested ? getProject(requested) : fallback;

  if (!project) {
    setText(root, "[data-project-name]", "Projeto não encontrado");
    setText(root, "[data-breadcrumb-current]", "Erro");
    const body = root.querySelector(".project-body");
    if (body) body.hidden = true;
    const error = root.querySelector("[data-project-error]");
    if (error) {
      error.hidden = false;
      error.querySelector("h1")?.focus?.();
    }
    document.title = "Projeto não encontrado — Cota Zero";
    return;
  }

  updateHead(project);

  // Cabeçalho
  setText(root, "[data-project-code]", project.codigo);
  setText(root, "[data-project-name]", project.nome);
  setText(root, "[data-project-local]", project.local);
  setText(root, "[data-project-coords]", project.coordenadasTexto);
  setText(root, "[data-project-year]", String(project.ano));
  setText(root, "[data-project-area]", formatArea(project.area));
  setText(root, "[data-project-programa]", project.programa);
  setText(root, "[data-project-tipologia]", project.tipologiaLabel);
  setText(root, "[data-breadcrumb-current]", project.nome);
  setHTML(
    root,
    "[data-project-status]",
    `<span class="status status--${esc(project.estadoKey)}">${esc(project.estado)}</span>`
  );

  // Ficha
  setText(root, "[data-sheet-field='local']", `${project.local} · ${project.distrito}`);
  setText(root, "[data-sheet-field='coords']", project.coordenadasTexto);
  setText(root, "[data-sheet-field='ano']", String(project.ano));
  setText(root, "[data-sheet-field='area']", formatArea(project.area));
  setText(root, "[data-sheet-field='programa']", project.programa);
  setText(root, "[data-sheet-field='tipologia']", project.tipologiaLabel);
  setText(root, "[data-sheet-field='estado']", project.estado);
  setText(root, "[data-sheet-field='equipa']", project.equipa.join(", "));
  setText(root, "[data-sheet-field='fotografo']", project.fotografo);
  setText(root, "[data-sheet-field='cliente']", project.cliente);
  setText(root, "[data-sheet-field='codigo']", project.codigo);
  setHTML(
    root,
    "[data-sheet-field='materiais']",
    `<span class="project-sheet__tags">${project.materiais
      .map((key) => {
        const material = getMaterial(key);
        if (!material) return "";
        return `<a class="tag" href="materiais.html#${esc(key)}">${esc(material.nome)}</a>`;
      })
      .join("")}</span>`
  );

  setText(root, "[data-project-lead]", project.descricaoCurta);

  // Hero
  const hero = root.querySelector("[data-project-hero]");
  if (hero) {
    const heroImg = hero.querySelector("img");
    if (heroImg) {
      heroImg.src = thumb(project.capa.src);
      heroImg.alt = project.capa.alt;
      heroImg.width = 900;
      heroImg.height = 675;
      heroImg.loading = "eager";
      heroImg.setAttribute("fetchpriority", "high");
    }
    const cap = hero.querySelector(".fig__cap");
    if (cap) {
      cap.innerHTML = `<span><b>FIG. 01</b> — ${esc(project.capa.legenda)}</span><span>${esc(project.local)} · ${project.ano}</span>`;
    }
  }

  // Galeria
  const gallery = root.querySelector("[data-project-gallery]");
  const galleryImages = project.imagens.slice(1);
  const spanClasses = [
    "gallery__item--narrow",
    "gallery__item",
    "gallery__item--offset",
    "gallery__item--small"
  ];
  const ratios = ["3x4", "4x3", "3x2", "1x1"];
  if (gallery) {
    gallery.innerHTML = galleryImages
      .map((image, index) => {
        const imageIndex = index + 1;
        const span = spanClasses[index % spanClasses.length];
        const ratio = ratios[index % ratios.length];
        const displayHeight = Math.round((image.altura / image.largura) * 900);
        return `
          <figure class="fig gallery__item ${span}">
            <button type="button" class="gallery__button" data-lightbox-index="${imageIndex}" aria-label="Ampliar imagem: ${esc(image.alt)}">
              <span class="media media--${ratio}">
                <img src="${esc(thumb(image.src))}" alt="${esc(image.alt)}" width="900" height="${displayHeight}" loading="lazy" decoding="async">
              </span>
            </button>
            <figcaption class="fig__cap"><span>${esc(image.legenda)}</span><span>${esc(project.local)} · ${project.ano}</span></figcaption>
          </figure>
        `;
      })
      .join("");
  }

  // Corte: fotografia + desenho SVG
  const cortePhoto = root.querySelector("[data-corte-photo]");
  if (cortePhoto && project.imagens[1]) {
    const corteImage = project.imagens[1];
    cortePhoto.src = thumb(corteImage.src);
    cortePhoto.alt = corteImage.alt;
    cortePhoto.width = 900;
    cortePhoto.height = Math.round((corteImage.altura / corteImage.largura) * 900);
    cortePhoto.loading = "lazy";
    cortePhoto.decoding = "async";
  }
  const corteDrawing = root.querySelector("[data-corte-drawing]");
  if (corteDrawing) corteDrawing.innerHTML = sectionSVG(project, "overlay");

  // Memória
  const memory = root.querySelector("[data-project-memory]");
  if (memory) {
    memory.innerHTML = project.memoria.map((paragraph) => `<p>${esc(paragraph)}</p>`).join("");
  }
  const words = project.memoria.join(" ").split(/\s+/).filter(Boolean).length;
  setText(root, "[data-memory-words]", `${words} palavras`);

  // Citação
  const quote = root.querySelector("[data-project-quote]");
  if (quote) {
    quote.innerHTML = `<p>“${esc(project.citacao.texto)}”</p><cite>${esc(project.citacao.autor)}</cite>`;
  }

  // Desenhos
  const plan = root.querySelector("[data-project-plan]");
  if (plan) {
    plan.innerHTML = `
      <div class="drawing__head"><span>Desenho 01 / Planta piso 0</span><b>Esc. 1:100</b></div>
      ${planSVG(project, "full")}
    `;
  }
  const section = root.querySelector("[data-project-section]");
  if (section) {
    section.innerHTML = `
      <div class="drawing__head"><span>Desenho 02 / Corte A-A'</span><b>Esc. 1:100</b></div>
      ${sectionSVG(project, "full")}
    `;
  }
  const elevation = root.querySelector("[data-project-elevation]");
  if (elevation) {
    elevation.innerHTML = `
      <div class="drawing__head"><span>Desenho 03 / Alçado sul</span><b>Esc. 1:100</b></div>
      ${elevationSVG(project)}
    `;
  }

  // Navegação anterior / seguinte
  const index = projects.findIndex((item) => item.id === project.id);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const nav = root.querySelector("[data-project-nav]");
  if (nav) {
    nav.innerHTML = `
      <a href="projeto.html?id=${encodeURIComponent(prev.id)}">
        <span class="micro">← Anterior · ${esc(prev.codigo)}</span>
        <span class="project-nav__name">${esc(prev.nome)}</span>
        <span class="micro">${esc(prev.local)} · ${prev.ano}</span>
      </a>
      <a href="projeto.html?id=${encodeURIComponent(next.id)}">
        <span class="micro">Seguinte · ${esc(next.codigo)} →</span>
        <span class="project-nav__name">${esc(next.nome)}</span>
        <span class="micro">${esc(next.local)} · ${next.ano}</span>
      </a>
    `;
  }

  // Relacionados
  const relatedRoot = root.querySelector("[data-project-related]");
  const related = getRelatedProjects(project.id, 3);
  if (relatedRoot && related.length) {
    relatedRoot.hidden = false;
    const grid = relatedRoot.querySelector(".related__grid");
    if (grid) {
      grid.innerHTML = related
        .map(
          (item) => `
          <article class="project-card">
            <div class="media media--4x3">
              <img src="${esc(thumb(item.capa.src))}" alt="${esc(item.capa.alt)}" width="900" height="675" loading="lazy" decoding="async">
            </div>
            <div class="project-card__top"><b>${esc(item.codigo)}</b><span>${item.ano} · ${esc(item.local)}</span></div>
            <h3 class="project-card__name">${esc(item.nome)}</h3>
            <div class="project-card__meta"><span>${esc(item.tipologiaLabel)}</span><span>${formatNumber(item.area)} m²</span></div>
            <a class="project-card__link" href="projeto.html?id=${encodeURIComponent(item.id)}" aria-label="Ver projeto ${esc(item.nome)}"></a>
          </article>
        `
        )
        .join("");
    }
  } else if (relatedRoot) {
    relatedRoot.hidden = true;
  }

  // Lightbox
  const lightbox = lightboxController(project.imagens, project);
  if (lightbox) {
    root.querySelectorAll("[data-lightbox-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const i = Number(button.dataset.lightboxIndex || 0);
        lightbox.open(i);
      });
    });
  }

  // Carimbo / instrumentos
  document.body.dataset.sheetName = project.nome;
  document.querySelectorAll("[data-page-name]").forEach((el) => {
    el.textContent = project.nome;
  });
  document.querySelectorAll(".rail [data-sheet-name]").forEach((el) => {
    el.textContent = project.nome;
  });
}
