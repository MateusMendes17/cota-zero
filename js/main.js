/**
 * COTA ZERO — main.js
 * Arranque do site, navegação, menu móvel, revelações, contadores e
 * carregamento condicional dos módulos de cada página.
 */

import { initIntro } from "./intro.js";
import { initPlanta } from "./grid-overlay.js";
import { initInstruments } from "./instruments.js";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --------------------------------------------------------------------------
   Navegação / página atual
   -------------------------------------------------------------------------- */
function initActiveRoute() {
  const page = document.body.dataset.page || "";
  if (!page) return;
  document.querySelectorAll("[data-route]").forEach((link) => {
    if (link.dataset.route === page) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* --------------------------------------------------------------------------
   Menu móvel
   -------------------------------------------------------------------------- */
function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("#menu");
  if (!toggle || !menu) return;
  const closeBtn = menu.querySelector("[data-menu-close]");
  const links = Array.from(menu.querySelectorAll("a[href]"));
  const background = Array.from(document.querySelectorAll("body > *")).filter(
    (el) =>
      el !== menu &&
      el.tagName !== "SCRIPT" &&
      !el.classList.contains("skip-link") &&
      el.id !== "intro-root"
  );
  let open = false;
  let returnFocus = null;

  const setBackgroundInert = (inert) => {
    background.forEach((el) => {
      if (el === menu) return;
      el.inert = inert;
    });
  };

  menu.inert = true;
  menu.setAttribute("aria-hidden", "true");

  const firstFocusable = () => links[0] || closeBtn;

  const openMenu = () => {
    if (open) return;
    open = true;
    returnFocus = document.activeElement;
    document.body.classList.add("menu-open", "is-locked");
    menu.classList.add("is-open");
    menu.inert = false;
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    setBackgroundInert(true);
    window.requestAnimationFrame(() => firstFocusable()?.focus({ preventScroll: true }));
  };

  const closeMenu = (restoreFocus = true) => {
    if (!open) return;
    open = false;
    document.body.classList.remove("menu-open", "is-locked");
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    toggle.setAttribute("aria-expanded", "false");
    setBackgroundInert(false);
    window.setTimeout(() => {
      if (!open) menu.inert = true;
    }, 460);
    if (restoreFocus) {
      const target =
        returnFocus instanceof HTMLElement && document.contains(returnFocus)
          ? returnFocus
          : toggle;
      target.focus({ preventScroll: true });
    }
  };

  toggle.addEventListener("click", () => {
    if (open) closeMenu();
    else openMenu();
  });
  closeBtn?.addEventListener("click", () => closeMenu());
  links.forEach((link) => link.addEventListener("click", () => closeMenu(false)));

  document.addEventListener("keydown", (event) => {
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = [closeBtn, ...links].filter(
      (el) => el instanceof HTMLElement && !el.hasAttribute("disabled")
    );
    if (!focusables.length) return;
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

  window.addEventListener("resize", () => {
    if (open && window.innerWidth > 960) closeMenu(false);
  });
}

/* --------------------------------------------------------------------------
   Revelações ao scroll
   -------------------------------------------------------------------------- */
function initReveal() {
  const nodes = Array.from(document.querySelectorAll("[data-reveal]"));
  if (!nodes.length) return;
  if (reducedMotion() || !("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-in"));
    return;
  }
  nodes.forEach((el) => {
    el.classList.add("reveal-pending");
    if (el.dataset.revealDelay) {
      el.style.setProperty("--reveal-delay", `${el.dataset.revealDelay}ms`);
    }
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  nodes.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Contadores
   -------------------------------------------------------------------------- */
function initCounters() {
  const nodes = Array.from(document.querySelectorAll("[data-count]"));
  if (!nodes.length) return;
  const formatter = new Intl.NumberFormat("pt-PT");

  const setFinal = (el) => {
    const value = Number(el.dataset.count || 0);
    el.textContent = formatter.format(value).replace(/\u00a0/g, " ");
  };

  if (reducedMotion() || !("IntersectionObserver" in window)) {
    nodes.forEach(setFinal);
    return;
  }

  const animate = (el) => {
    const target = Number(el.dataset.count || 0);
    const duration = 1500;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = formatter.format(value).replace(/\u00a0/g, " ");
      if (t < 1) requestAnimationFrame(step);
      else setFinal(el);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  nodes.forEach((el) => {
    el.textContent = "0";
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   Carregamento condicional de módulos
   -------------------------------------------------------------------------- */
async function loadPageModules() {
  const jobs = [];

  if (document.querySelector("[data-hover-preview]")) {
    jobs.push(
      import("./hover-preview.js").then((m) => m.initHoverPreviews())
    );
  }

  if (document.querySelector("[data-projects-table]")) {
    jobs.push(import("./projects-table.js").then((m) => m.initProjectsTable()));
  }

  if (document.querySelector("[data-map]")) {
    jobs.push(import("./map.js").then((m) => m.initMaps()));
  }

  if (document.querySelector("[data-project-page]")) {
    jobs.push(import("./project-page.js").then((m) => m.initProjectPage()));
  }

  if (document.querySelector("[data-materials-page]")) {
    jobs.push(import("./materials.js").then((m) => m.initMaterials()));
  }

  if (document.querySelector("[data-contact-form]")) {
    jobs.push(import("./contact.js").then((m) => m.initContactForm()));
  }

  if (document.querySelector("[data-contact-map]")) {
    jobs.push(import("./contact-map.js").then((m) => m.initContactMap()));
  }

  if (document.querySelector("[data-horizontal]")) {
    jobs.push(import("./horizontal-scroll.js").then((m) => m.initHorizontalScroll()));
  }

  if (document.querySelector("[data-corte]")) {
    jobs.push(import("./slider-corte.js").then((m) => m.initCorteSliders()));
  }

  const results = await Promise.allSettled(jobs);
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("[Cota Zero] Falha ao carregar um módulo de página:", result.reason);
    }
  });
}

/* --------------------------------------------------------------------------
   Arranque
   -------------------------------------------------------------------------- */
function boot() {
  initActiveRoute();
  initInstruments();
  initMenu();
  initReveal();
  initCounters();
  initPlanta();

  initIntro();
  loadPageModules();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
