/**
 * COTA ZERO — instruments.js
 * Instrumentos fixos: relógio do Porto, coordenadas, scroll e folha visível.
 */

const pad = (value, size = 4) => String(Math.max(0, Math.round(value))).padStart(size, "0");

const formatDate = (date) =>
  new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  })
    .format(date)
    .replace(/\//g, ".");

const formatTime = (date) =>
  new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(date);

export function initInstruments() {
  // Preenche carimbo e nomes de folha a partir do body.
  const pageSheet = document.body.dataset.sheet || "A-00";
  const pageName = document.body.dataset.sheetName || "Folha";
  document.querySelectorAll("[data-page-sheet]").forEach((el) => {
    el.textContent = pageSheet;
  });
  document.querySelectorAll("[data-page-name]").forEach((el) => {
    el.textContent = pageName;
  });

  const railSheet = document.querySelector(".rail [data-sheet]");
  const railSheetName = document.querySelector(".rail [data-sheet-name]");
  if (railSheet) railSheet.textContent = pageSheet;
  if (railSheetName) railSheetName.textContent = pageName;

  const stampDate = document.querySelector("[data-stamp-date]");
  if (stampDate) stampDate.textContent = formatDate(new Date());

  // Relógio.
  const clockEls = document.querySelectorAll("[data-clock]");
  const dateEls = document.querySelectorAll("[data-date]");
  let clockTimer = 0;
  const tickClock = () => {
    const now = new Date();
    clockEls.forEach((el) => {
      el.textContent = formatTime(now);
    });
    dateEls.forEach((el) => {
      el.textContent = formatDate(now);
    });
  };
  if (clockEls.length || dateEls.length) {
    tickClock();
    clockTimer = window.setInterval(tickClock, 1000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) tickClock();
    });
  }

  // Coordenadas do cursor.
  const coordX = document.querySelector("[data-coord-x]");
  const coordY = document.querySelector("[data-coord-y]");
  let pointerFrame = 0;
  let px = 0;
  let py = 0;
  if (coordX || coordY) {
    document.addEventListener(
      "pointermove",
      (event) => {
        px = event.clientX;
        py = event.clientY;
        if (pointerFrame) return;
        pointerFrame = requestAnimationFrame(() => {
          if (coordX) coordX.textContent = pad(px);
          if (coordY) coordY.textContent = pad(py);
          pointerFrame = 0;
        });
      },
      { passive: true }
    );
  }

  // Scroll em percentagem e em píxeis + folha visível.
  const scrollPct = document.querySelector("[data-scroll-pct]");
  const scrollPx = document.querySelector("[data-scroll-px]");
  const sections = Array.from(
    document.querySelectorAll("main section[data-sheet], main header[data-sheet]")
  );
  let scrollFrame = 0;
  let lastSheet = "";
  let lastSheetName = "";

  const updateScroll = () => {
    scrollFrame = 0;
    const doc = document.documentElement;
    const top = window.scrollY || doc.scrollTop || 0;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.max(0, (top / max) * 100));
    if (scrollPct) scrollPct.textContent = `${pad(pct, 3)}%`;
    if (scrollPx) scrollPx.textContent = pad(top);

    if (sections.length) {
      const line = window.innerHeight * 0.4;
      let current = sections[0];
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= line) current = section;
      });
      const sheet = current.dataset.sheet || pageSheet;
      const name =
        current.dataset.sheetName ||
        current.dataset.sectionName ||
        current.querySelector("h1, h2")?.textContent?.trim() ||
        pageName;
      if (railSheet && sheet !== lastSheet) {
        railSheet.textContent = sheet;
        lastSheet = sheet;
      }
      if (railSheetName && name !== lastSheetName) {
        railSheetName.textContent = name;
        lastSheetName = name;
      }
    }
  };

  const scheduleScroll = () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(updateScroll);
  };

  window.addEventListener("scroll", scheduleScroll, { passive: true });
  window.addEventListener("resize", scheduleScroll);
  updateScroll();

  window.addEventListener("pagehide", () => {
    if (clockTimer) window.clearInterval(clockTimer);
  });
}
