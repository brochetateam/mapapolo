export type RoomType =
  | "aula"
  | "oficina"
  | "patio"
  | "agora"
  | "wc"
  | "almacen"
  | "recepcion"
  | "cw"
  | "office"
  | "room";

export interface Room {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  type: RoomType;
  labelTop?: boolean; // place label near top of room
  fontSize?: number;
}

export interface Door {
  x: number;
  y: number;
  s: number;
  a: number; // rotation degrees
}

export interface Stair {
  x: number;
  y: number;
  w: number;
  h: number;
  dir: "h" | "v"; // step orientation
  elevator?: boolean;
}

export interface Evac {
  id: string;
  x: number;
  y: number;
  label: string;
}

// Footprint rectangles forming the corridor / floor base
export const footprint = [
  { x: 485, y: 685, w: 705, h: 605 }, // main central block
  { x: 485, y: 1290, w: 700, h: 162 }, // bottom row
  { x: 1085, y: 540, w: 310, h: 285 }, // top-right wing
  { x: 300, y: 870, w: 200, h: 182 }, // left wing
  { x: 1180, y: 1125, w: 215, h: 162 }, // right-mid (Ágora 2)
  { x: 455, y: 628, w: 235, h: 62 }, // entrance corridor
];

export const rooms: Room[] = [
  // ---- Top-right wing ----
  { id: "almacen_top", x: 1090, y: 548, w: 78, h: 150, label: "Almacén", type: "almacen", labelTop: true, fontSize: 13 },
  { id: "agora1", x: 1185, y: 590, w: 100, h: 185, label: "Ágora 1", type: "agora", labelTop: true },
  { id: "wc1", x: 1300, y: 555, w: 85, h: 78, label: "WC", type: "wc" },
  { id: "wc2", x: 1300, y: 668, w: 85, h: 78, label: "WC", type: "wc" },

  // ---- Recepción / Hall lobby ----
  { id: "hall", x: 490, y: 690, w: 195, h: 185, label: "Recepción/Hall", type: "recepcion", labelTop: true, fontSize: 13 },

  // ---- AU column ----
  { id: "au1", x: 790, y: 720, w: 92, h: 95, label: "AU 1", type: "aula" },
  { id: "au2", x: 790, y: 820, w: 92, h: 65, label: "AU 2", type: "aula" },
  { id: "au3", x: 790, y: 890, w: 92, h: 75, label: "AU 3", type: "aula" },
  { id: "au4", x: 790, y: 970, w: 92, h: 80, label: "AU 4", type: "aula" },
  { id: "au5", x: 790, y: 1080, w: 92, h: 70, label: "AU 5", type: "aula" },
  { id: "au6", x: 790, y: 1160, w: 92, h: 82, label: "AU 6", type: "aula" },

  // ---- Patios ----
  { id: "patio1", x: 685, y: 720, w: 95, h: 530, label: "Patio 1", type: "patio", labelTop: true },
  { id: "patio2", x: 920, y: 720, w: 90, h: 460, label: "Patio 2", type: "patio", labelTop: true },

  // ---- OF column (left of patio1 / bottom) ----
  { id: "of1", x: 575, y: 1080, w: 110, h: 72, label: "O F 1", type: "oficina" },

  // ---- OF column right ----
  { id: "of2", x: 1015, y: 720, w: 75, h: 72, label: "O F 2", type: "oficina" },
  { id: "of3", x: 1015, y: 825, w: 75, h: 65, label: "O F 3", type: "oficina" },
  { id: "of4", x: 1015, y: 905, w: 95, h: 75, label: "O F 4", type: "oficina" },
  { id: "of5", x: 1015, y: 1080, w: 95, h: 72, label: "O F 5", type: "oficina" },
  { id: "alm_mant", x: 1090, y: 720, w: 62, h: 110, label: "Almacén Manteni.", type: "almacen", labelTop: true, fontSize: 10 },

  // ---- Left wing ----
  { id: "almacen4", x: 305, y: 875, w: 95, h: 65, label: "Almacén 4", type: "almacen", fontSize: 11 },
  { id: "almacen5", x: 305, y: 950, w: 78, h: 82, label: "Almacén 5", type: "almacen", fontSize: 11 },
  { id: "office", x: 415, y: 935, w: 55, h: 55, label: "Office", type: "office", fontSize: 10 },
  { id: "antesala", x: 490, y: 880, w: 195, h: 195, label: "Antesala/office", type: "office", labelTop: true, fontSize: 13 },

  // ---- Bottom row ----
  { id: "recepcion2", x: 490, y: 1305, w: 145, h: 145, label: "Recepción 2", type: "recepcion", labelTop: true, fontSize: 12 },
  { id: "cw2", x: 635, y: 1305, w: 175, h: 145, label: "CW2", type: "cw", labelTop: true },
  { id: "mid1", x: 810, y: 1305, w: 165, h: 145, label: "", type: "room" },
  { id: "cw1", x: 975, y: 1305, w: 130, h: 145, label: "C W 1", type: "cw" },
  { id: "of6", x: 1105, y: 1305, w: 80, h: 145, label: "O F 6", type: "oficina" },

  // ---- Right-mid ----
  { id: "agora2", x: 1185, y: 1130, w: 100, h: 150, label: "Ágora 2", type: "agora", labelTop: true },
];

export const doors: Door[] = [
  // AU rooms opening to central corridor (x ~882)
  { x: 882, y: 770, s: 26, a: 90 },
  { x: 882, y: 855, s: 24, a: 90 },
  { x: 882, y: 930, s: 24, a: 90 },
  { x: 882, y: 1010, s: 24, a: 90 },
  { x: 882, y: 1115, s: 24, a: 90 },
  { x: 882, y: 1200, s: 24, a: 90 },
  // OF right column opening left to corridor (x 1015)
  { x: 1015, y: 760, s: 24, a: 180 },
  { x: 1015, y: 860, s: 22, a: 180 },
  { x: 1015, y: 945, s: 24, a: 180 },
  { x: 1015, y: 1115, s: 24, a: 180 },
  // Hall / entrance
  { x: 685, y: 760, s: 28, a: 0 },
  { x: 600, y: 690, s: 26, a: 270 },
  // OF1
  { x: 685, y: 1110, s: 26, a: 180 },
  // Antesala
  { x: 685, y: 930, s: 26, a: 0 },
  { x: 470, y: 935, s: 22, a: 0 },
  // Almacenes left
  { x: 400, y: 905, s: 20, a: 0 },
  { x: 383, y: 985, s: 20, a: 0 },
  // top wing
  { x: 1168, y: 600, s: 24, a: 0 },
  { x: 1285, y: 600, s: 22, a: 0 },
  { x: 1300, y: 668, s: 20, a: 270 },
  // bottom row
  { x: 635, y: 1340, s: 26, a: 0 },
  { x: 810, y: 1340, s: 24, a: 180 },
  { x: 975, y: 1340, s: 24, a: 0 },
  { x: 1105, y: 1340, s: 22, a: 180 },
  // agora2
  { x: 1185, y: 1170, s: 24, a: 0 },
];

export const stairs: Stair[] = [
  { x: 655, y: 720, w: 56, h: 92, dir: "h", elevator: true }, // main stair + lift near hall
  { x: 655, y: 1175, w: 56, h: 95, dir: "h", elevator: true }, // lower central stair + lift
  { x: 510, y: 1175, w: 130, h: 110, dir: "v" }, // bottom-left service / wc block
  { x: 1308, y: 752, w: 58, h: 62, dir: "v" }, // top wing stair (Evacu 3)
  { x: 312, y: 1032, w: 58, h: 45, dir: "h" }, // left wing stair (Evacu 1)
  { x: 1298, y: 1208, w: 58, h: 58, dir: "v" }, // right-mid stair (Evacu 4)
  { x: 1290, y: 1290, w: 75, h: 38, dir: "v" }, // extra near agora2
];

export const evacuations: Evac[] = [
  { id: "e1", x: 432, y: 1062, label: "Evacu. 1" },
  { id: "e2", x: 428, y: 902, label: "Evacu. 2" },
  { id: "e3", x: 1228, y: 772, label: "Evacu. 3" },
  { id: "e4", x: 1228, y: 1242, label: "Evacu. 4" },
];

export const typeColors: Record<RoomType, { fill: string; stroke: string; active: string }> = {
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

export const typeLabels: Record<RoomType, string> = {
  aula: "Aulas (AU)",
  oficina: "Oficinas (OF)",
  patio: "Patios",
  agora: "Ágoras",
  wc: "Aseos (WC)",
  almacen: "Almacenes",
  recepcion: "Recepción",
  cw: "Coworking (CW)",
  office: "Office / Antesala",
  room: "Otros espacios",
};
