import { writeFileSync } from "fs";

// ── data (from floorplanData.ts) ──

const footprint = [
  { x: 485, y: 685, w: 705, h: 605 },
  { x: 485, y: 1290, w: 700, h: 162 },
  { x: 1085, y: 540, w: 310, h: 285 },
  { x: 300, y: 870, w: 200, h: 182 },
  { x: 1180, y: 1125, w: 215, h: 162 },
  { x: 455, y: 628, w: 235, h: 62 },
];

const rooms = [
  { id: "almacen_top", x: 1090, y: 548, w: 78, h: 150, label: "Almacén", type: "almacen", labelTop: true, fontSize: 13 },
  { id: "agora1", x: 1185, y: 590, w: 100, h: 185, label: "Ágora 1", type: "agora", labelTop: true },
  { id: "wc1", x: 1300, y: 555, w: 85, h: 78, label: "WC", type: "wc" },
  { id: "wc2", x: 1300, y: 668, w: 85, h: 78, label: "WC", type: "wc" },
  { id: "hall", x: 490, y: 690, w: 195, h: 185, label: "Recepción/Hall", type: "recepcion", labelTop: true, fontSize: 13 },
  { id: "au1", x: 790, y: 720, w: 92, h: 95, label: "AU 1", type: "aula" },
  { id: "au2", x: 790, y: 820, w: 92, h: 65, label: "AU 2", type: "aula" },
  { id: "au3", x: 790, y: 890, w: 92, h: 75, label: "AU 3", type: "aula" },
  { id: "au4", x: 790, y: 970, w: 92, h: 80, label: "AU 4", type: "aula" },
  { id: "au5", x: 790, y: 1080, w: 92, h: 70, label: "AU 5", type: "aula" },
  { id: "au6", x: 790, y: 1160, w: 92, h: 82, label: "AU 6", type: "aula" },
  { id: "patio1", x: 685, y: 720, w: 95, h: 530, label: "Patio 1", type: "patio", labelTop: true },
  { id: "patio2", x: 920, y: 720, w: 90, h: 460, label: "Patio 2", type: "patio", labelTop: true },
  { id: "of1", x: 575, y: 1080, w: 110, h: 72, label: "O F 1", type: "oficina" },
  { id: "of2", x: 1015, y: 720, w: 75, h: 72, label: "O F 2", type: "oficina" },
  { id: "of3", x: 1015, y: 825, w: 75, h: 65, label: "O F 3", type: "oficina" },
  { id: "of4", x: 1015, y: 905, w: 95, h: 75, label: "O F 4", type: "oficina" },
  { id: "of5", x: 1015, y: 1080, w: 95, h: 72, label: "O F 5", type: "oficina" },
  { id: "alm_mant", x: 1090, y: 720, w: 62, h: 110, label: "Almacén Manteni.", type: "almacen", labelTop: true, fontSize: 10 },
  { id: "almacen4", x: 305, y: 875, w: 95, h: 65, label: "Almacén 4", type: "almacen", fontSize: 11 },
  { id: "almacen5", x: 305, y: 950, w: 78, h: 82, label: "Almacén 5", type: "almacen", fontSize: 11 },
  { id: "office", x: 415, y: 935, w: 55, h: 55, label: "Office", type: "office", fontSize: 10 },
  { id: "antesala", x: 490, y: 880, w: 195, h: 195, label: "Antesala/office", type: "office", labelTop: true, fontSize: 13 },
  { id: "recepcion2", x: 490, y: 1305, w: 145, h: 145, label: "Recepción 2", type: "recepcion", labelTop: true, fontSize: 12 },
  { id: "cw2", x: 635, y: 1305, w: 175, h: 145, label: "CW2", type: "cw", labelTop: true },
  { id: "mid1", x: 810, y: 1305, w: 165, h: 145, label: "", type: "room" },
  { id: "cw1", x: 975, y: 1305, w: 130, h: 145, label: "C W 1", type: "cw" },
  { id: "of6", x: 1105, y: 1305, w: 80, h: 145, label: "O F 6", type: "oficina" },
  { id: "agora2", x: 1185, y: 1130, w: 100, h: 150, label: "Ágora 2", type: "agora", labelTop: true },
];

const doors = [
  { x: 882, y: 770, s: 26, a: 90 },
  { x: 882, y: 855, s: 24, a: 90 },
  { x: 882, y: 930, s: 24, a: 90 },
  { x: 882, y: 1010, s: 24, a: 90 },
  { x: 882, y: 1115, s: 24, a: 90 },
  { x: 882, y: 1200, s: 24, a: 90 },
  { x: 1015, y: 760, s: 24, a: 180 },
  { x: 1015, y: 860, s: 22, a: 180 },
  { x: 1015, y: 945, s: 24, a: 180 },
  { x: 1015, y: 1115, s: 24, a: 180 },
  { x: 685, y: 760, s: 28, a: 0 },
  { x: 600, y: 690, s: 26, a: 270 },
  { x: 685, y: 1110, s: 26, a: 180 },
  { x: 685, y: 930, s: 26, a: 0 },
  { x: 470, y: 935, s: 22, a: 0 },
  { x: 400, y: 905, s: 20, a: 0 },
  { x: 383, y: 985, s: 20, a: 0 },
  { x: 1168, y: 600, s: 24, a: 0 },
  { x: 1285, y: 600, s: 22, a: 0 },
  { x: 1300, y: 668, s: 20, a: 270 },
  { x: 635, y: 1340, s: 26, a: 0 },
  { x: 810, y: 1340, s: 24, a: 180 },
  { x: 975, y: 1340, s: 24, a: 0 },
  { x: 1105, y: 1340, s: 22, a: 180 },
  { x: 1185, y: 1170, s: 24, a: 0 },
];

const stairs = [
  { x: 655, y: 720, w: 56, h: 92, dir: "h", elevator: true },
  { x: 655, y: 1175, w: 56, h: 95, dir: "h", elevator: true },
  { x: 510, y: 1175, w: 130, h: 110, dir: "v" },
  { x: 1308, y: 752, w: 58, h: 62, dir: "v" },
  { x: 312, y: 1032, w: 58, h: 45, dir: "h" },
  { x: 1298, y: 1208, w: 58, h: 58, dir: "v" },
  { x: 1290, y: 1290, w: 75, h: 38, dir: "v" },
];

const evacuations = [
  { id: "e1", x: 432, y: 1062, label: "Evacu. 1" },
  { id: "e2", x: 428, y: 902, label: "Evacu. 2" },
  { id: "e3", x: 1228, y: 772, label: "Evacu. 3" },
  { id: "e4", x: 1228, y: 1242, label: "Evacu. 4" },
];

const typeColors = {
  aula: { fill: "#eef4ff", stroke: "#9bb6e0", active: "#cfe0ff" },
  oficina: { fill: "#f3f0fb", stroke: "#b5a8db", active: "#ddd2f4" },
  patio: { fill: "#eef7ee", stroke: "#a7cba7", active: "#d3ecd3" },
  agora: { fill: "#fff6ea", stroke: "#e0c193", active: "#ffe7c2" },
  wc: { fill: "#eafbf6", stroke: "#8fd0bd", active: "#c7f1e6" },
  almacen: { fill: "#f5f5f3", stroke: "#bdbdb5", active: "#e6e6df" },
  recepcion: { fill: "#fdeef2", stroke: "#e0a0b4", active: "#f8d3df" },
  cw: { fill: "#eef9ff", stroke: "#94c5dd", active: "#cdeaf7" },
  office: { fill: "#f6f3ee", stroke: "#c9b79a", active: "#ecdfca" },
  room: { fill: "#fafafa", stroke: "#cccccc", active: "#ededed" },
};

const columns = [
  [575, 720], [685, 720], [780, 720], [882, 720], [920, 720], [1010, 720],
  [575, 880], [685, 880], [882, 880], [920, 880],
  [575, 1075], [685, 1075], [882, 1075], [920, 1075],
  [575, 1290], [685, 1290], [810, 1290], [920, 1290], [1010, 1290], [1105, 1290],
  [490, 880], [490, 1075],
];

// ── SVG generation helpers ──

const esc = (s) => (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function doorMark(d) {
  return `<g transform="rotate(${d.a} ${d.x} ${d.y})">
    <line x1="${d.x}" y1="${d.y}" x2="${d.x + d.s}" y2="${d.y}" stroke="#5b6470" stroke-width="1.3"/>
    <path d="M ${d.x + d.s} ${d.y} A ${d.s} ${d.s} 0 0 1 ${d.x} ${d.y + d.s}" fill="none" stroke="#9aa3ad" stroke-width="1" stroke-dasharray="3 2"/>
  </g>`;
}

function stairMark(s) {
  const n = s.dir === "h" ? Math.floor(s.h / 9) : Math.floor(s.w / 9);
  let steps = "";
  for (let i = 1; i < n; i++) {
    if (s.dir === "h") {
      const y = s.y + (s.h / n) * i;
      steps += `<line x1="${s.x}" y1="${y}" x2="${s.x + s.w}" y2="${y}" stroke="#8a93a0" stroke-width="0.9"/>`;
    } else {
      const x = s.x + (s.w / n) * i;
      steps += `<line x1="${x}" y1="${s.y}" x2="${x}" y2="${s.y + s.h}" stroke="#8a93a0" stroke-width="0.9"/>`;
    }
  }
  let el = "";
  if (s.elevator) {
    el = `<rect x="${s.x + s.w / 2 - 13}" y="${s.y + s.h / 2 - 13}" width="26" height="26" fill="#fff" stroke="#5b6470" stroke-width="1.1"/>
      <line x1="${s.x + s.w / 2 - 13}" y1="${s.y + s.h / 2 - 13}" x2="${s.x + s.w / 2 + 13}" y2="${s.y + s.h / 2 + 13}" stroke="#8a93a0" stroke-width="0.9"/>
      <line x1="${s.x + s.w / 2 + 13}" y1="${s.y + s.h / 2 - 13}" x2="${s.x + s.w / 2 - 13}" y2="${s.y + s.h / 2 + 13}" stroke="#8a93a0" stroke-width="0.9"/>`;
  }
  return `<g>
    <rect x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" fill="#f0f2f5" stroke="#5b6470" stroke-width="1.2"/>
    ${steps}
    ${el}
  </g>`;
}

// ── Build SVG string ──

function generate() {
  const parts = [];

  // footprint
  parts.push(`<g id="footprint">`);
  for (const f of footprint) {
    parts.push(`<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" fill="#eef1f4" stroke="#2f3640" stroke-width="2.4"/>`);
  }
  parts.push(`</g>`);

  // outer dashed boundary
  parts.push(`<path d="M300 870 v-120 a40 40 0 0 1 40 -40 h120 v-100 h760 v-60 h170 v420 h60 a40 40 0 0 1 0 80 h-60 v260 a40 40 0 0 1 -40 40 h-180 v160 h-700 v-160 h-160 v-180 h-110 a40 40 0 0 1 0 -80 h110 z" fill="none" stroke="#c4ccd6" stroke-width="1.4" stroke-dasharray="6 5" opacity="0.7"/>`);

  // rooms
  for (const r of rooms) {
    const c = typeColors[r.type];
    const lx = r.x + r.w / 2;
    const ly = r.labelTop ? r.y + 18 : r.y + r.h / 2 + 4;
    parts.push(`<g id="${r.id}">`);
    parts.push(`<rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.4"/>`);
    if (r.type === "agora") {
      parts.push(`<rect x="${r.x + 12}" y="${r.y + 28}" width="${r.w - 24}" height="${r.h - 44}" fill="none" stroke="${c.stroke}" stroke-width="1"/>`);
      parts.push(`<rect x="${r.x + 24}" y="${r.y + 44}" width="${r.w - 48}" height="${r.h - 76}" fill="none" stroke="${c.stroke}" stroke-width="1"/>`);
    }
    if (r.type === "patio") {
      parts.push(`<line x1="${r.x}" y1="${r.y + r.h}" x2="${r.x + r.w}" y2="${r.y}" stroke="${c.stroke}" stroke-width="0.7" opacity="0.5"/>`);
    }
    if (r.label) {
      const fw = (r.type === "aula" || r.type === "oficina" || r.type === "cw") ? 700 : 500;
      parts.push(`<text x="${lx}" y="${ly}" text-anchor="middle" font-size="${r.fontSize ?? 15}" font-weight="${fw}" fill="#2a313a" style="pointer-events:none;user-select:none">${esc(r.label)}</text>`);
    }
    parts.push(`</g>`);
  }

  // columns
  parts.push(`<g fill="#2f3640">`);
  for (const [cx, cy] of columns) {
    parts.push(`<rect x="${cx - 4}" y="${cy - 4}" width="8" height="8"/>`);
  }
  parts.push(`</g>`);

  // stairs
  for (const s of stairs) {
    parts.push(stairMark(s));
  }

  // doors
  for (const d of doors) {
    parts.push(doorMark(d));
  }

  // entrance
  parts.push(`<g>`);
  parts.push(`<text x="635" y="612" text-anchor="middle" font-size="13" fill="#2a313a">Entrada IAT</text>`);
  parts.push(`<path d="M455 660 l-55 40 l30 40 l55 -40 z" fill="#f7f8fa" stroke="#5b6470" stroke-width="1.2"/>`);
  parts.push(`<line x1="455" y1="660" x2="430" y2="740" stroke="#9aa3ad" stroke-width="0.8"/>`);
  for (let i = 0; i < 8; i++) {
    parts.push(`<line x1="300" y1="${1100 + i * 9}" x2="470" y2="${1100 + i * 9}" stroke="#cfd6de" stroke-width="0.8"/>`);
  }
  for (let i = 0; i < 7; i++) {
    parts.push(`<line x1="300" y1="${1340 + i * 9}" x2="470" y2="${1340 + i * 9}" stroke="#cfd6de" stroke-width="0.8"/>`);
  }
  parts.push(`</g>`);

  // POLO DIGITAL marker
  parts.push(`<g>`);
  for (let i = 0; i < 5; i++) {
    parts.push(`<circle cx="426" cy="${530 + i * 26}" r="8" fill="none" stroke="#3f8f5f" stroke-width="1.6"/>`);
    parts.push(`<circle cx="426" cy="${530 + i * 26}" r="2" fill="#3f8f5f"/>`);
  }
  parts.push(`<text x="398" y="585" font-size="11" fill="#3f8f5f" font-weight="600" letter-spacing="2" transform="rotate(-90 398 585)">POLO DIGITAL</text>`);
  parts.push(`</g>`);

  // S1 / S2
  parts.push(`<g>`);
  for (const [label, cx, cy] of [["S1", 540, 1340], ["S2", 600, 1340]]) {
    parts.push(`<g><circle cx="${cx}" cy="${cy}" r="17" fill="#fff" stroke="#2f3640" stroke-width="1.4"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#2a313a">${label}</text></g>`);
  }
  parts.push(`</g>`);

  // evacuation labels
  for (const e of evacuations) {
    parts.push(`<g><rect x="${e.x - 4}" y="${e.y - 13}" width="68" height="18" rx="3" fill="#fff" stroke="#e23b3b" stroke-width="1" opacity="0.95"/><text x="${e.x + 30}" y="${e.y}" text-anchor="middle" font-size="12" font-weight="700" fill="#e23b3b">${esc(e.label)}</text></g>`);
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="280 510 1130 970" width="1130" height="970" style="background:#ffffff">
  ${parts.join("\n  ")}
</svg>`;

  const outPath = import.meta.dirname + "/plano_polo_planta_baja.svg";
  writeFileSync(outPath, svg, "utf-8");
  console.log(`SVG generated: ${outPath}`);
}

generate();
