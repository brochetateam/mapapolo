import { useState, useMemo } from "react";

/* ===================== TIPOS ===================== */
type RoomKind =
  | "office"
  | "studio"
  | "wc"
  | "storage"
  | "lab"
  | "tech"
  | "circulation"
  | "special";

interface RoomDef {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: RoomKind;
  diagonal?: boolean;
  icon?: string;
}

/* ===================== PALETA ===================== */
const KIND_STYLE: Record<
  RoomKind,
  { fill: string; fill2: string; stroke: string; text: string; badge: string; border: string }
> = {
  office: { fill: "#dbeafe", fill2: "#eff6ff", stroke: "#3b82f6", text: "#1e3a8a", badge: "bg-blue-500", border: "border-blue-300" },
  studio: { fill: "#ede9fe", fill2: "#f5f3ff", stroke: "#8b5cf6", text: "#5b21b6", badge: "bg-violet-500", border: "border-violet-300" },
  wc: { fill: "#a7f3d0", fill2: "#ecfdf5", stroke: "#10b981", text: "#065f46", badge: "bg-emerald-500", border: "border-emerald-300" },
  storage: { fill: "#fde68a", fill2: "#fffbeb", stroke: "#f59e0b", text: "#78350f", badge: "bg-amber-500", border: "border-amber-300" },
  lab: { fill: "#fecaca", fill2: "#fef2f2", stroke: "#ef4444", text: "#7f1d1d", badge: "bg-red-500", border: "border-red-300" },
  tech: { fill: "#bae6fd", fill2: "#f0f9ff", stroke: "#0284c7", text: "#0c4a6e", badge: "bg-sky-600", border: "border-sky-300" },
  circulation: { fill: "#f8fafc", fill2: "#f1f5f9", stroke: "#cbd5e1", text: "#475569", badge: "bg-slate-400", border: "border-slate-300" },
  special: { fill: "#fbcfe8", fill2: "#fdf2f8", stroke: "#ec4899", text: "#831843", badge: "bg-pink-500", border: "border-pink-300" },
};

/* ===================== DATOS ===================== */
const ROOMS: RoomDef[] = [
  // Ala izquierda
  { id: "almacen-av", label: "Almacén", sub: "Audiovisual", x: 158, y: 95, w: 98, h: 32, kind: "storage", icon: "📦" },
  { id: "wc-l1", label: "WC", x: 158, y: 130, w: 60, h: 30, kind: "wc", icon: "🚻" },
  { id: "wc-l2", label: "WC", x: 158, y: 163, w: 60, h: 30, kind: "wc", icon: "🚻" },
  { id: "of7", label: "OF7", x: 158, y: 196, w: 98, h: 56, kind: "office", icon: "🏢" },
  { id: "des3", label: "DES", sub: "3", x: 60, y: 268, w: 38, h: 64, kind: "office", icon: "" },
  { id: "des2", label: "DES", sub: "2", x: 100, y: 268, w: 38, h: 64, kind: "office", icon: "🏢" },
  { id: "des1", label: "DES", sub: "1", x: 140, y: 268, w: 50, h: 64, kind: "office", icon: "" },
  { id: "flex", label: "FLEX", x: 60, y: 334, w: 90, h: 64, kind: "special", icon: "✨" },
  { id: "hall2", label: "Hall PI-2", x: 200, y: 296, w: 120, h: 110, kind: "circulation", icon: "🚶" },
  { id: "of8", label: "OF8", x: 158, y: 410, w: 98, h: 58, kind: "office", icon: "" },
  { id: "lab3d", label: "Lab", sub: "Impresión 3D", x: 158, y: 470, w: 98, h: 64, kind: "lab", icon: "🔬" },
  { id: "evac1-stair", label: "", x: 70, y: 392, w: 90, h: 78, kind: "circulation" },

  // Estudios
  { id: "st5", label: "ST 5", x: 332, y: 196, w: 80, h: 84, kind: "studio", icon: "🎬" },
  { id: "st4", label: "ST 4", x: 332, y: 282, w: 80, h: 78, kind: "studio", icon: "🎬" },
  { id: "st3", label: "ST 3", x: 332, y: 362, w: 80, h: 78, kind: "studio", icon: "🎬" },
  { id: "st2", label: "ST 2", x: 332, y: 442, w: 80, h: 78, kind: "studio", icon: "🎬" },
  { id: "st1", label: "ST 1", x: 332, y: 522, w: 80, h: 78, kind: "studio", icon: "🎬" },

  // Centro
  { id: "of14", label: "OF14", x: 520, y: 196, w: 200, h: 240, kind: "office", diagonal: true, icon: "🏢" },
  { id: "of15", label: "OF15", x: 520, y: 196, w: 200, h: 240, kind: "office", diagonal: true, icon: "🏢" },
  { id: "of16", label: "OF16", x: 520, y: 440, w: 200, h: 170, kind: "office", diagonal: true, icon: "" },

  // Derecha
  { id: "et", label: "ET", x: 768, y: 196, w: 120, h: 120, kind: "tech", icon: "⚙️" },
  { id: "of13", label: "OF13", x: 768, y: 318, w: 120, h: 130, kind: "office", icon: "" },
  { id: "of12", label: "OF12", x: 768, y: 450, w: 120, h: 160, kind: "office", icon: "🏢" },
  { id: "sala-proy", label: "Sala de Proyección", x: 600, y: 545, w: 165, h: 65, kind: "special", icon: "" },

  // Fila inferior
  { id: "of9", label: "OF9", x: 158, y: 690, w: 150, h: 70, kind: "office", icon: "🏢" },
  { id: "of10", label: "OF10", x: 312, y: 690, w: 280, h: 70, kind: "office", icon: "🏢" },
  { id: "of11", label: "OF11", x: 596, y: 690, w: 130, h: 70, kind: "office", icon: "🏢" },
  { id: "sala-audio", label: "Sala Audiovisual", x: 730, y: 660, w: 130, h: 100, kind: "special", icon: "📽️" },

  // Ala NE
  { id: "almacen-ne", label: "Almacén", x: 988, y: 60, w: 90, h: 60, kind: "storage", icon: "" },
  { id: "wc-ne1", label: "WC", x: 1180, y: 60, w: 70, h: 50, kind: "wc", icon: "🚻" },
  { id: "wc-ne2", label: "WC", x: 1180, y: 130, w: 70, h: 50, kind: "wc", icon: "" },

  // Ala SE
  { id: "cpd", label: "CPD", x: 1130, y: 470, w: 110, h: 60, kind: "tech", icon: "🖥️" },
  { id: "almacen-se", label: "Almacén", x: 1130, y: 540, w: 110, h: 60, kind: "storage", icon: "" },
];

const CORRIDORS = [
  { x: 414, y: 196, w: 50, h: 414 },
  { x: 256, y: 95, w: 76, h: 515 },
  { x: 720, y: 196, w: 48, h: 414 },
  { x: 158, y: 612, w: 702, h: 76 },
  { x: 888, y: 196, w: 100, h: 70 },
  { x: 888, y: 470, w: 242, h: 60 },
];

interface Door { x: number; y: number; o: "h" | "v"; }
const DOORS: Door[] = [
  { x: 256, y: 224, o: "v" }, { x: 256, y: 438, o: "v" }, { x: 256, y: 500, o: "v" },
  { x: 332, y: 238, o: "v" }, { x: 332, y: 320, o: "v" }, { x: 332, y: 400, o: "v" },
  { x: 332, y: 480, o: "v" }, { x: 332, y: 560, o: "v" },
  { x: 600, y: 320, o: "v" }, { x: 768, y: 380, o: "v" }, { x: 768, y: 520, o: "v" },
  { x: 233, y: 690, o: "h" }, { x: 450, y: 690, o: "h" }, { x: 660, y: 690, o: "h" },
  { x: 190, y: 196, o: "h" }, { x: 190, y: 130, o: "v" },
];

/* ===================== HELPERS SVG ===================== */
function Stairs({ x, y, w, h, steps = 8, dir = "v" }: { x: number; y: number; w: number; h: number; steps?: number; dir?: "v" | "h" }) {
  const lines = [];
  for (let i = 1; i < steps; i++) {
    if (dir === "v") {
      const yy = y + (h / steps) * i;
      lines.push(<line key={i} x1={x} y1={yy} x2={x + w} y2={yy} stroke="#64748b" strokeWidth={0.8} />);
    } else {
      const xx = x + (w / steps) * i;
      lines.push(<line key={i} x1={xx} y1={y} x2={xx} y2={y + h} stroke="#64748b" strokeWidth={0.8} />);
    }
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#e2e8f0" stroke="#475569" strokeWidth={1.2} rx={1} />
      {lines}
      <text x={x + w / 2} y={y + h / 2 + 3} textAnchor="middle" fontSize={7} fill="#334155" fontWeight={600}>
        {dir === "v" ? "SUBE" : "SUBE →"}
      </text>
    </g>
  );
}

function Elevator({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} fill="#cbd5e1" stroke="#334155" strokeWidth={1.2} rx={1} />
      <line x1={x} y1={y} x2={x + s} y2={y + s} stroke="#64748b" strokeWidth={0.8} />
      <line x1={x + s} y1={y} x2={x} y2={y + s} stroke="#64748b" strokeWidth={0.8} />
      <text x={x + s / 2} y={y + s / 2 + 3} textAnchor="middle" fontSize={7} fill="#0f172a" fontWeight={700}>
        🛗
      </text>
    </g>
  );
}

function DoorArc({ d }: { d: Door }) {
  const r = 18;
  if (d.o === "v") {
    return (
      <g>
        <path d={`M ${d.x} ${d.y} A ${r} ${r} 0 0 1 ${d.x + r} ${d.y + r}`} fill="none" stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="3,2" />
        <line x1={d.x} y1={d.y} x2={d.x} y2={d.y + r} stroke="#ef4444" strokeWidth={1.6} />
      </g>
    );
  }
  return (
    <g>
      <path d={`M ${d.x} ${d.y} A ${r} ${r} 0 0 1 ${d.x + r} ${d.y + r}`} fill="none" stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="3,2" />
      <line x1={d.x} y1={d.y} x2={d.x + r} y2={d.y} stroke="#ef4444" strokeWidth={1.6} />
    </g>
  );
}

/* ===================== COMPONENTE ===================== */
interface FloorPlanProps {
  selected: string | null;
  onSelect: (id: string | null) => void;
  showLabels: boolean;
  onHover: (id: string | null, pos?: { x: number; y: number }) => void;
}

export default function FloorPlan({ selected, onSelect, showLabels, onHover }: FloorPlanProps) {
  const [localHover, setLocalHover] = useState<string | null>(null);

  const entrancePath = useMemo(
    () =>
      "M150 88 H262 V52 H910 V190 H1078 V52 H1262 V300 H910 V460 H1262 V610 H910 V610 H872 V768 H150 V540 H42 V404 H150 Z",
    []
  );

  return (
    <svg
      viewBox="0 0 1320 820"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Sombra general del edificio */}
        <filter id="bldg-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.25" />
        </filter>
        <filter id="room-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#fbbf24" floodOpacity="0.8" />
        </filter>
        <filter id="room-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15" />
        </filter>

        {/* Patrón de suelo (baldosas) */}
        <pattern id="floor-tile" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#f1f5f9" />
          <path d="M0 0 L24 0 M0 0 L0 24" stroke="#e2e8f0" strokeWidth={0.8} />
        </pattern>

        {/* Patrón de pasillos (direccional) */}
        <pattern id="corridor-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#cbd5e1" strokeWidth={1.2} />
        </pattern>

        {/* Gradientes por tipo de sala */}
        {Object.entries(KIND_STYLE).map(([key, s]) => (
          <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={s.fill2} />
            <stop offset="100%" stopColor={s.fill} />
          </linearGradient>
        ))}

        {/* Gradiente fachada */}
        <linearGradient id="facade-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        {/* Patrón de muro exterior */}
        <pattern id="wall-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#1e293b" strokeWidth={1.2} />
        </pattern>
      </defs>

      {/* Fondo del plano */}
      <rect x={0} y={0} width={1320} height={820} fill="#fafafa" />

      {/* ===== EDIFICIO ===== */}
      <g filter="url(#bldg-shadow)">
        {/* Sombra 3D del edificio (extrusión) */}
        <path d={entrancePath} fill="#0f172a" opacity={0.12} transform="translate(6, 8)" />
        {/* Masa del edificio */}
        <path d={entrancePath} fill="url(#floor-tile)" stroke="#1e293b" strokeWidth={3.5} strokeLinejoin="round" />
        {/* Relieve interior de paredes (grosor doble) */}
        <path d={entrancePath} fill="none" stroke="#475569" strokeWidth={1.2} transform="translate(0, 0)" />
      </g>

      {/* ===== PASILLOS ===== */}
      {CORRIDORS.map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="url(#corridor-hatch)" />
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="none" stroke="#94a3b8" strokeWidth={0.6} strokeDasharray="2,3" />
        </g>
      ))}

      {/* ===== FACHADA (muro cortina verde) ===== */}
      <g stroke="url(#facade-grad)" strokeWidth={7} strokeLinecap="round">
        <line x1="158" y1="100" x2="158" y2="125" />
        <line x1="158" y1="195" x2="158" y2="250" />
        <line x1="160" y1="690" x2="858" y2="690" />
        <line x1="50" y1="412" x2="50" y2="468" />
        <line x1="906" y1="280" x2="906" y2="335" />
        <line x1="906" y1="430" x2="906" y2="460" />
        <line x1="1255" y1="465" x2="1255" y2="600" />
        <line x1="1130" y1="465" x2="1240" y2="465" />
        <line x1="1180" y1="170" x2="1250" y2="170" />
      </g>
      {/* Puntos en fachada (soportes) */}
      <g fill="#065f46">
        <circle cx="158" cy="100" r="2.5" />
        <circle cx="158" cy="250" r="2.5" />
        <circle cx="160" cy="690" r="2.5" />
        <circle cx="858" cy="690" r="2.5" />
      </g>

      {/* ===== SALAS ===== */}
      {ROOMS.map((r) => {
        const st = KIND_STYLE[r.kind];
        const isSel = selected === r.id;
        const isHover = localHover === r.id;
        const clickable = r.kind !== "circulation";
        return (
          <g
            key={r.id}
            onMouseEnter={(e) => {
              if (clickable) {
                setLocalHover(r.id);
                const pt = (e.currentTarget.ownerSVGElement as SVGSVGElement).createSVGPoint();
                pt.x = e.clientX; pt.y = e.clientY;
                const svgP = pt.matrixTransform((e.currentTarget.ownerSVGElement as SVGSVGElement).getScreenCTM()?.inverse());
                onHover(r.id, { x: svgP.x, y: svgP.y });
              }
            }}
            onMouseLeave={() => { setLocalHover(null); onHover(null); }}
            onClick={() => clickable && onSelect(isSel ? null : r.id)}
            style={{ cursor: clickable ? "pointer" : "default" }}
          >
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx={3}
              fill={isSel ? "#fde047" : isHover ? st.fill : `url(#grad-${r.kind})`}
              stroke={isSel ? "#b45309" : isHover ? st.stroke : "#94a3b8"}
              strokeWidth={isSel ? 2.8 : isHover ? 1.8 : 1.1}
              filter={isSel ? "url(#room-glow)" : isHover ? "url(#room-shadow)" : undefined}
            />
            {r.diagonal && (
              <g stroke={st.stroke} strokeWidth={0.8} opacity={0.35}>
                <line x1={r.x} y1={r.y} x2={r.x + r.w} y2={r.y + r.h} />
                <line x1={r.x + r.w} y1={r.y} x2={r.x} y2={r.y + r.h} />
              </g>
            )}
            {showLabels && (
              <g style={{ pointerEvents: "none" }}>
                {r.icon && (
                  <text x={r.x + r.w / 2} y={r.y + 16} textAnchor="middle" fontSize={14} opacity={0.7}>
                    {r.icon}
                  </text>
                )}
                <text
                  x={r.x + r.w / 2}
                  y={r.y + r.h / 2 + (r.sub ? -3 : 4)}
                  textAnchor="middle"
                  fontSize={r.kind === "office" || r.kind === "studio" ? 13 : 10}
                  fontWeight={700}
                  fill={st.text}
                >
                  {r.label}
                </text>
                {r.sub && (
                  <text
                    x={r.x + r.w / 2}
                    y={r.y + r.h / 2 + 12}
                    textAnchor="middle"
                    fontSize={8}
                    fill={st.text}
                    opacity={0.8}
                  >
                    {r.sub}
                  </text>
                )}
              </g>
            )}
          </g>
        );
      })}

      {/* ===== ESCALERAS ===== */}
      <Stairs x={466} y={120} w={54} h={76} steps={9} dir="v" />
      <Stairs x={466} y={530} w={54} h={72} steps={9} dir="v" />
      <Stairs x={75} y={398} w={80} h={66} steps={8} dir="h" />
      <Stairs x={1100} y={196} w={70} h={64} steps={8} dir="h" />
      <Stairs x={1130} y={540} w={64} h={60} steps={7} dir="h" />

      {/* ===== ASCENSORES ===== */}
      <Elevator x={988} y={130} s={70} />
      <Elevator x={1030} y={470} s={70} />

      {/* ===== PUERTAS ===== */}
      {DOORS.map((d, i) => (
        <DoorArc key={i} d={d} />
      ))}

      {/* ===== SALIDAS DE EVACUACIÓN ===== */}
      {[
        { x: 168, y: 470, t: "Evacu. 1" },
        { x: 920, y: 250, t: "Evacu. 3" },
        { x: 960, y: 535, t: "Evacu. 4" },
      ].map((e, i) => (
        <g key={i}>
          <circle cx={e.x} cy={e.y} r={14} fill="#fef2f2" stroke="#dc2626" strokeWidth={2.5} />
          <text x={e.x} y={e.y + 4} textAnchor="middle" fontSize={11} fill="#dc2626" fontWeight={800}>!</text>
          <text x={e.x + 20} y={e.y + 4} fontSize={11} fill="#dc2626" fontWeight={700}>
            {e.t}
          </text>
        </g>
      ))}
      <g>
        <circle cx={120} cy={462} r={14} fill="#fef2f2" stroke="#dc2626" strokeWidth={2.5} />
        <text x={120} y={466} textAnchor="middle" fontSize={11} fill="#dc2626" fontWeight={800}>!</text>
      </g>

      {/* ===== BRÚJULA NORTE ===== */}
      <g transform="translate(1240, 760)">
        <circle cx="0" cy="0" r="22" fill="white" stroke="#1e293b" strokeWidth={2} filter="url(#room-shadow)" />
        <polygon points="0,-18 5,0 0,18 -5,0" fill="#ef4444" stroke="#1e293b" strokeWidth={0.8} />
        <polygon points="0,-18 5,0 0,0" fill="#7f1d1d" />
        <text x="0" y="-26" textAnchor="middle" fontSize="11" fontWeight={800} fill="#1e293b">N</text>
      </g>

      {/* ===== ESCALA GRÁFICA ===== */}
      <g transform="translate(50, 770)">
        <line x1="0" y1="0" x2="100" y2="0" stroke="#1e293b" strokeWidth={2} />
        <line x1="0" y1="-4" x2="0" y2="4" stroke="#1e293b" strokeWidth={2} />
        <line x1="50" y1="-3" x2="50" y2="3" stroke="#1e293b" strokeWidth={1.5} />
        <line x1="100" y1="-4" x2="100" y2="4" stroke="#1e293b" strokeWidth={2} />
        <text x="0" y="14" fontSize="10" fill="#1e293b" fontWeight={600}>0</text>
        <text x="100" y="14" fontSize="10" fill="#1e293b" fontWeight={600} textAnchor="end">~10 m</text>
      </g>
    </svg>
  );
}

export { ROOMS, KIND_STYLE };
export type { RoomDef, RoomKind };
