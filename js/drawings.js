/**
 * COTA ZERO — drawings.js
 * Geração de desenhos técnicos em SVG a partir dos parâmetros de cada projeto.
 * Linhas finas, cotas laranja, eixos, escala gráfica e norte.
 */

const INK = "#0F0F0F";
const SIGNAL = "#FF4B00";
const PAPER = "#E8E6E0";
const MONO = "'JetBrains Mono','Courier New',monospace";

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });

const fmtMm = (meters) => {
  const value = new Intl.NumberFormat("pt-PT").format(Math.round(meters * 1000));
  return value.replace(/\u00a0/g, " ");
};

const fmtLevel = (level) =>
  level === 0
    ? "±0,00"
    : `${level > 0 ? "+" : "−"}${Math.abs(level).toFixed(2).replace(".", ",")}`;

const roomText = (name, roomWidth, roomHeight) => {
  const available = Math.max(roomWidth, roomHeight);
  const size = Math.min(11, Math.max(5, available / Math.max(4, name.length * 0.68)));
  return size;
};

const dimH = (x1, x2, y, label) => {
  const mid = (x1 + x2) / 2;
  const boxWidth = Math.max(28, label.length * 5.8 + 8);
  return `
    <g class="dim dim--h">
      <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${SIGNAL}" stroke-width="0.9"/>
      <line x1="${x1}" y1="${y - 5}" x2="${x1}" y2="${y + 5}" stroke="${SIGNAL}" stroke-width="0.9"/>
      <line x1="${x2}" y1="${y - 5}" x2="${x2}" y2="${y + 5}" stroke="${SIGNAL}" stroke-width="0.9"/>
      <rect x="${mid - boxWidth / 2}" y="${y - 7}" width="${boxWidth}" height="14" fill="${SIGNAL}"/>
      <text x="${mid}" y="${y + 3}" text-anchor="middle" fill="${INK}" font-family="${MONO}" font-size="8.5" letter-spacing=".04em">${esc(label)}</text>
    </g>
  `;
};

const dimV = (y1, y2, x, label) => {
  const length = Math.abs(y2 - y1);
  const start = Math.max(y1, y2);
  const boxWidth = Math.max(28, label.length * 5.8 + 8);
  return `
    <g transform="translate(${x} ${start}) rotate(-90)" class="dim dim--v">
      <line x1="0" y1="0" x2="${length}" y2="0" stroke="${SIGNAL}" stroke-width="0.9"/>
      <line x1="0" y1="-5" x2="0" y2="5" stroke="${SIGNAL}" stroke-width="0.9"/>
      <line x1="${length}" y1="-5" x2="${length}" y2="5" stroke="${SIGNAL}" stroke-width="0.9"/>
      <rect x="${length / 2 - boxWidth / 2}" y="-7" width="${boxWidth}" height="14" fill="${SIGNAL}"/>
      <text x="${length / 2}" y="3" text-anchor="middle" fill="${INK}" font-family="${MONO}" font-size="8.5" letter-spacing=".04em">${esc(label)}</text>
    </g>
  `;
};

const northSymbol = (x, y) => `
  <g aria-hidden="true">
    <line x1="${x}" y1="${y + 30}" x2="${x}" y2="${y + 4}" stroke="${INK}" stroke-width="1"/>
    <path d="M${x} ${y}h0l6 13h-12z" fill="${SIGNAL}" stroke="${SIGNAL}" stroke-width="0.8"/>
    <text x="${x}" y="${y + 42}" text-anchor="middle" fill="${INK}" font-family="${MONO}" font-size="9">N</text>
  </g>
`;

const scaleBar = (x, y) => `
  <g aria-hidden="true">
    <line x1="${x}" y1="${y}" x2="${x + 100}" y2="${y}" stroke="${INK}" stroke-width="1"/>
    ${[0, 25, 50, 75, 100]
      .map(
        (offset) =>
          `<line x1="${x + offset}" y1="${y}" x2="${x + offset}" y2="${y - 4}" stroke="${INK}" stroke-width="1"/>`
      )
      .join("")}
    <rect x="${x}" y="${y - 4}" width="25" height="4" fill="${INK}"/>
    <rect x="${x + 50}" y="${y - 4}" width="25" height="4" fill="${INK}"/>
    <text x="${x}" y="${y + 11}" fill="${INK}" font-family="${MONO}" font-size="7.5">0</text>
    <text x="${x + 50}" y="${y + 11}" text-anchor="middle" fill="${INK}" font-family="${MONO}" font-size="7.5">5</text>
    <text x="${x + 100}" y="${y + 11}" text-anchor="end" fill="${INK}" font-family="${MONO}" font-size="7.5">10 m</text>
  </g>
`;

const titleLine = (label, right, width = 1000) => `
  <g aria-hidden="true">
    <text x="30" y="30" fill="${INK}" font-family="${MONO}" font-size="10" letter-spacing=".12em">${esc(label)}</text>
    <text x="${width - 30}" y="30" text-anchor="end" fill="${INK}" font-family="${MONO}" font-size="9" letter-spacing=".08em">${esc(right)}</text>
    <line x1="30" y1="42" x2="${width - 30}" y2="42" stroke="${INK}" stroke-width="0.8"/>
  </g>
`;

const levelMarker = (x, y, label) => {
  const width = Math.max(40, label.length * 6 + 8);
  return `
    <g>
      <line x1="${x}" y1="${y}" x2="${x + width + 8}" y2="${y}" stroke="${SIGNAL}" stroke-width="0.8"/>
      <rect x="${x + 4}" y="${y - 7}" width="${width}" height="14" fill="${SIGNAL}"/>
      <text x="${x + 4 + width / 2}" y="${y + 3}" text-anchor="middle" fill="${INK}" font-family="${MONO}" font-size="8">${esc(label)}</text>
    </g>
  `;
};

/* --------------------------------------------------------------------------
   Planta
   -------------------------------------------------------------------------- */
export function planSVG(project, variant = "full") {
  const data = project.desenho?.planta;
  if (!data) return "";
  const uid = `${project.id}-plan-${variant}`;
  const width = data.largura;
  const depth = data.profundidade;
  const maxW = 790;
  const maxH = 420;
  const scale = Math.min(maxW / width, maxH / depth);
  const planW = width * scale;
  const planH = depth * scale;
  const x0 = 100 + (maxW - planW) / 2;
  const y0 = 90 + (maxH - planH) / 2;
  const wall = Math.max(3, Math.min(8, 0.24 * scale));
  const vaos = project.desenho?.corte?.vaos || [width];
  const totalVao = vaos.reduce((sum, value) => sum + value, 0);
  const widths = vaos.map((value) => (value / totalVao) * planW);
  const xPositions = [x0];
  widths.forEach((value) => {
    xPositions.push(xPositions[xPositions.length - 1] + value);
  });

  let rooms = "";
  (data.rooms || []).forEach((room) => {
    const rx = x0 + room.x * scale;
    const ry = y0 + room.y * scale;
    const rw = room.w * scale;
    const rh = room.h * scale;
    const size = roomText(room.n, rw, rh, scale);
    rooms += `
      <rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" fill="none" stroke="${INK}" stroke-width="0.8"/>
      ${
        size >= 4.6
          ? `<text x="${rx + rw / 2}" y="${ry + rh / 2 + size * 0.35}" text-anchor="middle" fill="${INK}" font-family="${MONO}" font-size="${size}" letter-spacing=".05em">${esc(room.n)}</text>`
          : ""
      }
    `;
  });

  let aberturas = "";
  (data.aberturas || []).forEach((ab) => {
    if (ab.lado === "top" || ab.lado === "bottom") {
      const ax = x0 + ab.pos * scale;
      const aw = ab.largura * scale;
      const ay = ab.lado === "top" ? y0 : y0 + planH;
      aberturas += `
        <line x1="${ax}" y1="${ay}" x2="${ax + aw}" y2="${ay}" stroke="${PAPER}" stroke-width="${wall + 2}"/>
        <line x1="${ax}" y1="${ay - 2}" x2="${ax + aw}" y2="${ay - 2}" stroke="${INK}" stroke-width="0.8"/>
        <line x1="${ax}" y1="${ay + 2}" x2="${ax + aw}" y2="${ay + 2}" stroke="${INK}" stroke-width="0.8"/>
        <line x1="${ax}" y1="${ay}" x2="${ax + aw}" y2="${ay}" stroke="${INK}" stroke-width="0.5"/>
      `;
    } else {
      const ay = y0 + ab.pos * scale;
      const ah = ab.largura * scale;
      const ax = ab.lado === "left" ? x0 : x0 + planW;
      aberturas += `
        <line x1="${ax}" y1="${ay}" x2="${ax}" y2="${ay + ah}" stroke="${PAPER}" stroke-width="${wall + 2}"/>
        <line x1="${ax - 2}" y1="${ay}" x2="${ax - 2}" y2="${ay + ah}" stroke="${INK}" stroke-width="0.8"/>
        <line x1="${ax + 2}" y1="${ay}" x2="${ax + 2}" y2="${ay + ah}" stroke="${INK}" stroke-width="0.8"/>
        <line x1="${ax}" y1="${ay}" x2="${ax}" y2="${ay + ah}" stroke="${INK}" stroke-width="0.5"/>
      `;
    }
  });

  let portas = "";
  (data.portas || []).forEach((porta) => {
    const px = x0 + porta.x * scale;
    const py = y0 + porta.y * scale;
    const leaf = 0.9 * scale;
    if (porta.dir === "v") {
      portas += `
        <line x1="${px}" y1="${py}" x2="${px}" y2="${py + leaf}" stroke="${PAPER}" stroke-width="${wall + 2}"/>
        <line x1="${px}" y1="${py}" x2="${px + leaf}" y2="${py}" stroke="${INK}" stroke-width="0.9"/>
        <path d="M${px + leaf} ${py} A ${leaf} ${leaf} 0 0 1 ${px} ${py + leaf}" fill="none" stroke="${INK}" stroke-width="0.6"/>
      `;
    } else {
      portas += `
        <line x1="${px}" y1="${py}" x2="${px + leaf}" y2="${py}" stroke="${PAPER}" stroke-width="${wall + 2}"/>
        <line x1="${px}" y1="${py}" x2="${px}" y2="${py + leaf}" stroke="${INK}" stroke-width="0.9"/>
        <path d="M${px} ${py + leaf} A ${leaf} ${leaf} 0 0 1 ${px + leaf} ${py}" fill="none" stroke="${INK}" stroke-width="0.6"/>
      `;
    }
  });

  // Eixos e bolhas
  const axisXs = [0.2, 0.45, 0.7, 0.95].map((frac) => x0 + planW * frac);
  const axisYs = [0.25, 0.5, 0.75].map((frac) => y0 + planH * frac);
  let axes = "";
  axisXs.forEach((x, index) => {
    axes += `<line x1="${x}" y1="${y0 - 22}" x2="${x}" y2="${y0 + planH + 22}" stroke="${INK}" stroke-width="0.45" stroke-dasharray="4 6" opacity="0.45"/>`;
    axes += `<circle cx="${x}" cy="${y0 - 32}" r="9" fill="${PAPER}" stroke="${INK}" stroke-width="0.8"/>`;
    axes += `<text x="${x}" y="${y0 - 29}" text-anchor="middle" fill="${INK}" font-family="${MONO}" font-size="8">${String.fromCharCode(65 + index)}</text>`;
  });
  axisYs.forEach((y, index) => {
    axes += `<line x1="${x0 - 22}" y1="${y}" x2="${x0 + planW + 22}" y2="${y}" stroke="${INK}" stroke-width="0.45" stroke-dasharray="4 6" opacity="0.45"/>`;
    axes += `<circle cx="${x0 - 32}" cy="${y}" r="9" fill="${PAPER}" stroke="${INK}" stroke-width="0.8"/>`;
    axes += `<text x="${x0 - 32}" y="${y + 3}" text-anchor="middle" fill="${INK}" font-family="${MONO}" font-size="8">${index + 1}</text>`;
  });

  const totalWidth = fmtMm(width);
  const totalDepth = fmtMm(depth);
  const dimY = y0 + planH + 42;
  const segments = xPositions
    .slice(0, -1)
    .map((x, index) => dimH(x, x + widths[index], dimY + 18, fmtMm(vaos[index])))
    .join("");

  return `
    <svg viewBox="0 0 1000 700" role="img" aria-labelledby="${uid}-title ${uid}-desc" preserveAspectRatio="xMidYMid meet">
      <title id="${uid}-title">Planta do projeto ${esc(project.nome)}</title>
      <desc id="${uid}-desc">Planta baixa com ${(data.rooms || []).length} espaços, eixos, vãos e cotas em milímetros. Área de ${project.area} metros quadrados.</desc>
      <rect width="1000" height="700" fill="${PAPER}"/>
      ${titleLine("PLANTA — PISO 0", `${project.codigo} · ${project.nome} · ESC. 1:100`)}
      <g>
        <rect x="${x0}" y="${y0}" width="${planW}" height="${planH}" fill="none" stroke="${INK}" stroke-width="2.4"/>
        <rect x="${x0 + wall}" y="${y0 + wall}" width="${planW - wall * 2}" height="${planH - wall * 2}" fill="none" stroke="${INK}" stroke-width="0.65"/>
        ${rooms}
        ${aberturas}
        ${portas}
        ${axes}
      </g>
      ${dimH(x0, x0 + planW, dimY, totalWidth)}
      ${segments}
      ${dimV(y0, y0 + planH, x0 - 52, totalDepth)}
      <g aria-hidden="true">
        <path d="M${x0 - 12} ${y0 + planH + 12}l8 -12 8 12z" fill="${SIGNAL}"/>
        <text x="${x0 + 12}" y="${y0 + planH + 18}" fill="${INK}" font-family="${MONO}" font-size="8">COTA ZERO · ±0,00</text>
      </g>
      ${northSymbol(930, 72)}
      ${scaleBar(760, 660)}
      <g aria-hidden="true">
        <line x1="30" y1="660" x2="30" y2="680" stroke="${INK}" stroke-width="0.5"/>
        <text x="38" y="676" fill="${INK}" font-family="${MONO}" font-size="7.5" opacity=".6">Desenho gerado a partir da ficha do projeto. Dimensões em milímetros.</text>
      </g>
    </svg>
  `;
}

/* --------------------------------------------------------------------------
   Corte
   -------------------------------------------------------------------------- */
export function sectionSVG(project, variant = "full") {
  const data = project.desenho?.corte;
  if (!data) return "";
  const uid = `${project.id}-section-${variant}`;
  const width = data.largura;
  const height = data.altura;
  const maxW = 750;
  const maxH = 430;
  const scale = Math.min(maxW / width, maxH / height);
  const drawW = width * scale;
  const drawH = height * scale;
  const x0 = 140 + (maxW - drawW) / 2;
  const groundY = 100 + (maxH - drawH) / 2 + drawH;
  const topY = groundY - drawH;
  const wall = Math.max(3, Math.min(9, 0.25 * scale));
  const vaos = data.vaos || [width];
  const totalVao = vaos.reduce((sum, value) => sum + value, 0);
  const widths = vaos.map((value) => (value / totalVao) * drawW);
  const boundaries = [x0];
  widths.forEach((value) => {
    boundaries.push(boundaries[boundaries.length - 1] + value);
  });

  const levels = data.niveis || [0, height];
  let slabs = "";
  levels.forEach((level) => {
    const y = groundY - level * scale;
    slabs += `<rect x="${x0 - wall}" y="${y - 2}" width="${drawW + wall * 2}" height="${Math.max(3, 0.24 * scale)}" fill="${INK}"/>`;
  });

  let walls = "";
  walls += `<rect x="${x0 - wall}" y="${topY}" width="${wall}" height="${drawH}" fill="${INK}"/>`;
  walls += `<rect x="${x0 + drawW}" y="${topY}" width="${wall}" height="${drawH}" fill="${INK}"/>`;
  boundaries.slice(1, -1).forEach((x) => {
    walls += `<rect x="${x}" y="${topY}" width="${Math.max(2.4, wall * 0.42)}" height="${drawH}" fill="${INK}" opacity="0.9"/>`;
  });

  // Vãos: fendas verticais nas paredes exteriores, uma por nível, alternadas.
  let windows = "";
  levels.slice(0, -1).forEach((level, index) => {
    const yTop = groundY - (level + (levels[index + 1] - level) * 0.72) * scale;
    const yBottom = groundY - (level + (levels[index + 1] - level) * 0.22) * scale;
    const side = index % 2 === 0 ? x0 - wall - 1 : x0 + drawW + 1;
    windows += `
      <rect x="${side}" y="${yTop}" width="${wall + 2}" height="${yBottom - yTop}" fill="${PAPER}"/>
      <line x1="${side + wall / 2}" y1="${yTop}" x2="${side + wall / 2}" y2="${yBottom}" stroke="${INK}" stroke-width="0.8"/>
      <line x1="${side + wall / 2 + 1.5}" y1="${yTop}" x2="${side + wall / 2 + 1.5}" y2="${yBottom}" stroke="${INK}" stroke-width="0.4"/>
    `;
  });

  let roof = "";
  if (data.cobertura === "inclinada") {
    const ridgeX = x0 + drawW / 2;
    const ridgeY = topY - Math.min(0.9 * scale, 78);
    const eave = data.beiral ? data.beiral * scale : 0;
    roof = `
      <path d="M${x0 - wall - eave} ${topY} L${ridgeX} ${ridgeY} L${x0 + drawW + wall + eave} ${topY}" fill="none" stroke="${INK}" stroke-width="2.4"/>
      <path d="M${x0 - wall - eave} ${topY + 6} L${ridgeX} ${ridgeY + 6} L${x0 + drawW + wall + eave} ${topY + 6}" fill="none" stroke="${INK}" stroke-width="0.8"/>
      <path d="M${x0 - wall - eave} ${topY} L${ridgeX} ${ridgeY} L${x0 + drawW + wall + eave} ${topY} L${x0 + drawW + wall + eave} ${topY + 6} L${ridgeX} ${ridgeY + 6} L${x0 - wall - eave} ${topY + 6} Z" fill="${INK}" opacity="0.08"/>
    `;
  } else {
    roof = `
      <rect x="${x0 - wall}" y="${topY - 2}" width="${drawW + wall * 2}" height="${Math.max(5, 0.3 * scale)}" fill="${INK}"/>
      <rect x="${x0 - wall}" y="${topY - Math.max(10, 0.55 * scale)}" width="${wall}" height="${Math.max(10, 0.55 * scale)}" fill="${INK}"/>
      <rect x="${x0 + drawW}" y="${topY - Math.max(10, 0.55 * scale)}" width="${wall}" height="${Math.max(10, 0.55 * scale)}" fill="${INK}"/>
    `;
  }

  const levelMarks = levels
    .map((level) => levelMarker(22, groundY - level * scale, fmtLevel(level)))
    .join("");

  const human = `
    <g opacity=".72" aria-hidden="true">
      <circle cx="${x0 + drawW * 0.58}" cy="${groundY - 1.68 * scale}" r="${Math.max(2.5, 0.09 * scale)}" fill="none" stroke="${INK}" stroke-width="0.8"/>
      <line x1="${x0 + drawW * 0.58}" y1="${groundY - 1.56 * scale}" x2="${x0 + drawW * 0.58}" y2="${groundY - 0.82 * scale}" stroke="${INK}" stroke-width="0.8"/>
      <line x1="${x0 + drawW * 0.58}" y1="${groundY - 1.3 * scale}" x2="${x0 + drawW * 0.58 - 0.28 * scale}" y2="${groundY - 1.0 * scale}" stroke="${INK}" stroke-width="0.7"/>
      <line x1="${x0 + drawW * 0.58}" y1="${groundY - 1.3 * scale}" x2="${x0 + drawW * 0.58 + 0.28 * scale}" y2="${groundY - 1.0 * scale}" stroke="${INK}" stroke-width="0.7"/>
      <line x1="${x0 + drawW * 0.58}" y1="${groundY - 0.82 * scale}" x2="${x0 + drawW * 0.58 - 0.22 * scale}" y2="${groundY}" stroke="${INK}" stroke-width="0.7"/>
      <line x1="${x0 + drawW * 0.58}" y1="${groundY - 0.82 * scale}" x2="${x0 + drawW * 0.58 + 0.22 * scale}" y2="${groundY}" stroke="${INK}" stroke-width="0.7"/>
    </g>
  `;

  const segments = boundaries
    .slice(0, -1)
    .map((x, index) => dimH(x, x + widths[index], groundY + 54, fmtMm(vaos[index])))
    .join("");

  return `
    <svg viewBox="0 0 1000 640" role="img" aria-labelledby="${uid}-title ${uid}-desc" preserveAspectRatio="xMidYMid meet">
      <title id="${uid}-title">Corte A-A' do projeto ${esc(project.nome)}</title>
      <desc id="${uid}-desc">Corte transversal com ${levels.length} níveis, cotas de altura e cobertura ${data.cobertura}.</desc>
      <rect width="1000" height="640" fill="${PAPER}"/>
      <defs>
        <pattern id="${uid}-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="${INK}" stroke-width="0.55" opacity=".45"/>
        </pattern>
      </defs>
      ${titleLine("CORTE A-A'", `${project.codigo} · ${project.nome} · ESC. 1:100`)}
      <rect x="${x0 - 60}" y="${groundY}" width="${drawW + 120}" height="66" fill="url(#${uid}-hatch)" opacity=".55"/>
      <line x1="${x0 - 70}" y1="${groundY}" x2="${x0 + drawW + 70}" y2="${groundY}" stroke="${INK}" stroke-width="1.4"/>
      ${slabs}
      ${walls}
      ${windows}
      ${roof}
      ${human}
      ${levelMarks}
      ${dimV(topY, groundY, x0 + drawW + 62, fmtMm(height))}
      ${dimH(x0, x0 + drawW, groundY + 40, fmtMm(width))}
      ${segments}
      <g aria-hidden="true">
        <path d="M${x0 - 12} ${groundY + 12}l8 -12 8 12z" fill="${SIGNAL}"/>
        <text x="${x0 + 12}" y="${groundY + 18}" fill="${INK}" font-family="${MONO}" font-size="8">COTA ZERO · ${fmtLevel(0)}</text>
      </g>
      ${scaleBar(760, 600)}
    </svg>
  `;
}

/* --------------------------------------------------------------------------
   Alçado
   -------------------------------------------------------------------------- */
export function elevationSVG(project) {
  const data = project.desenho?.alcado;
  if (!data) return "";
  const uid = `${project.id}-elev`;
  const width = data.largura;
  const height = data.altura;
  const maxW = 790;
  const maxH = 400;
  const scale = Math.min(maxW / width, maxH / height);
  const drawW = width * scale;
  const drawH = height * scale;
  const x0 = 100 + (maxW - drawW) / 2;
  const groundY = 84 + drawH + (maxH - drawH) / 2;
  const topY = groundY - drawH;
  const vaos = data.vaos || [width];
  const totalVao = vaos.reduce((sum, value) => sum + value, 0);
  const widths = vaos.map((value) => (value / totalVao) * drawW);
  const boundaries = [x0];
  widths.forEach((value) => {
    boundaries.push(boundaries[boundaries.length - 1] + value);
  });

  // Juntas verticais e preenchimentos de material.
  let joints = "";
  boundaries.slice(1, -1).forEach((x) => {
    joints += `<line x1="${x}" y1="${topY}" x2="${x}" y2="${groundY}" stroke="${INK}" stroke-width="0.55" opacity=".55"/>`;
  });

  let openings = "";
  (data.aberturas || []).forEach((ab, index) => {
    const px = x0 + ab.x * scale;
    const pw = ab.w * scale;
    const ph = ab.h * scale;
    const py = groundY - ph;
    const isDoor = index === 1 && ab.h < 2.8;
    openings += `
      <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${PAPER}" stroke="${INK}" stroke-width="1"/>
      <line x1="${px + pw / 2}" y1="${py}" x2="${px + pw / 2}" y2="${py + ph}" stroke="${INK}" stroke-width="0.65"/>
      <line x1="${px}" y1="${py + ph / 2}" x2="${px + pw}" y2="${py + ph / 2}" stroke="${INK}" stroke-width="0.65"/>
      ${
        isDoor
          ? `<line x1="${px}" y1="${groundY}" x2="${px + pw}" y2="${groundY}" stroke="${SIGNAL}" stroke-width="2"/>`
          : ""
      }
    `;
  });

  let roof = "";
  if (data.cobertura === "inclinada") {
    const ridgeY = topY - Math.min(0.7 * scale, 58);
    roof = `
      <path d="M${x0 - 8} ${topY} L${x0 + drawW / 2} ${ridgeY} L${x0 + drawW + 8} ${topY}" fill="none" stroke="${INK}" stroke-width="2.1"/>
      <path d="M${x0 - 8} ${topY + 6} L${x0 + drawW / 2} ${ridgeY + 6} L${x0 + drawW + 8} ${topY + 6}" fill="none" stroke="${INK}" stroke-width="0.7"/>
    `;
  } else {
    roof = `<rect x="${x0 - 10}" y="${topY - 7}" width="${drawW + 20}" height="7" fill="${INK}"/>`;
  }

  const materialLabel =
    project.materiais.includes("aco-corten")
      ? "AÇO CORTEN · JUNTA APARENTE"
      : project.materiais.includes("tijolo")
        ? "TIJOLO CERÂMICO · JUNTA CONTÍNUA"
        : "BETÃO APARENTE · COFRAGEM DE PINHO";

  const segments = boundaries
    .slice(0, -1)
    .map((x, index) => dimH(x, x + widths[index], groundY + 52, fmtMm(vaos[index])))
    .join("");

  return `
    <svg viewBox="0 0 1000 640" role="img" aria-labelledby="${uid}-title ${uid}-desc" preserveAspectRatio="xMidYMid meet">
      <title id="${uid}-title">Alçado sul do projeto ${esc(project.nome)}</title>
      <desc id="${uid}-desc">Alçado com vãos, juntas de material, cobertura e cotas.</desc>
      <rect width="1000" height="640" fill="${PAPER}"/>
      <defs>
        <pattern id="${uid}-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="${INK}" stroke-width="0.55" opacity=".4"/>
        </pattern>
      </defs>
      ${titleLine("ALÇADO SUL", `${project.codigo} · ${project.nome} · ESC. 1:100`)}
      <rect x="${x0 - 50}" y="${groundY}" width="${drawW + 100}" height="48" fill="url(#${uid}-hatch)" opacity=".5"/>
      <line x1="${x0 - 60}" y1="${groundY}" x2="${x0 + drawW + 60}" y2="${groundY}" stroke="${INK}" stroke-width="1.2"/>
      <rect x="${x0}" y="${topY}" width="${drawW}" height="${drawH}" fill="none" stroke="${INK}" stroke-width="1.6"/>
      ${joints}
      ${openings}
      ${roof}
      <g aria-hidden="true">
        <line x1="${x0}" y1="${topY + drawH * 0.18}" x2="${x0 + drawW}" y2="${topY + drawH * 0.18}" stroke="${INK}" stroke-width="0.35" stroke-dasharray="2 8" opacity=".3"/>
        <line x1="${x0}" y1="${topY + drawH * 0.52}" x2="${x0 + drawW}" y2="${topY + drawH * 0.52}" stroke="${INK}" stroke-width="0.35" stroke-dasharray="2 8" opacity=".3"/>
        <line x1="${x0}" y1="${topY + drawH * 0.84}" x2="${x0 + drawW}" y2="${topY + drawH * 0.84}" stroke="${INK}" stroke-width="0.35" stroke-dasharray="2 8" opacity=".3"/>
        <text x="${x0 + 8}" y="${topY + 18}" fill="${INK}" font-family="${MONO}" font-size="8" letter-spacing=".08em">${materialLabel}</text>
      </g>
      ${levelMarker(22, groundY, fmtLevel(0))}
      ${levelMarker(22, topY, fmtLevel(height))}
      ${dimH(x0, x0 + drawW, groundY + 44, fmtMm(width))}
      ${segments}
      ${[0, 1, 2].map((index) => `<line x1="${x0}" y1="${topY + (drawH / 3) * index}" x2="${x0 + drawW}" y2="${topY + (drawH / 3) * index}" stroke="${INK}" stroke-width="0.3" opacity=".25"/>`).join("")}
      ${scaleBar(760, 590)}
      ${northSymbol(930, 66)}
    </svg>
  `;
}
