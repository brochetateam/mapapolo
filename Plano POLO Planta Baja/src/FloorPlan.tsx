import { useState } from "react";
import {
  footprint,
  rooms,
  doors,
  stairs,
  evacuations,
  typeColors,
  type Door,
  type Stair,
} from "./floorplanData";

function DoorMark({ d }: { d: Door }) {
  // hinge at (x,y); leaf to (x+s,y); arc sweeps to (x,y+s) before rotation
  return (
    <g transform={`rotate(${d.a} ${d.x} ${d.y})`}>
      <line
        x1={d.x}
        y1={d.y}
        x2={d.x + d.s}
        y2={d.y}
        stroke="#5b6470"
        strokeWidth={1.3}
      />
      <path
        d={`M ${d.x + d.s} ${d.y} A ${d.s} ${d.s} 0 0 1 ${d.x} ${d.y + d.s}`}
        fill="none"
        stroke="#9aa3ad"
        strokeWidth={1}
        strokeDasharray="3 2"
      />
    </g>
  );
}

function StairMark({ s }: { s: Stair }) {
  const steps = [];
  const n = s.dir === "h" ? Math.floor(s.h / 9) : Math.floor(s.w / 9);
  for (let i = 1; i < n; i++) {
    if (s.dir === "h") {
      const y = s.y + (s.h / n) * i;
      steps.push(<line key={i} x1={s.x} y1={y} x2={s.x + s.w} y2={y} stroke="#8a93a0" strokeWidth={0.9} />);
    } else {
      const x = s.x + (s.w / n) * i;
      steps.push(<line key={i} x1={x} y1={s.y} x2={x} y2={s.y + s.h} stroke="#8a93a0" strokeWidth={0.9} />);
    }
  }
  return (
    <g>
      <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="#f0f2f5" stroke="#5b6470" strokeWidth={1.2} />
      {steps}
      {s.elevator && (
        <g>
          <rect
            x={s.x + s.w / 2 - 13}
            y={s.y + s.h / 2 - 13}
            width={26}
            height={26}
            fill="#ffffff"
            stroke="#5b6470"
            strokeWidth={1.1}
          />
          <line x1={s.x + s.w / 2 - 13} y1={s.y + s.h / 2 - 13} x2={s.x + s.w / 2 + 13} y2={s.y + s.h / 2 + 13} stroke="#8a93a0" strokeWidth={0.9} />
          <line x1={s.x + s.w / 2 + 13} y1={s.y + s.h / 2 - 13} x2={s.x + s.w / 2 - 13} y2={s.y + s.h / 2 + 13} stroke="#8a93a0" strokeWidth={0.9} />
        </g>
      )}
    </g>
  );
}

interface Props {
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function FloorPlan({ selected, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <svg
      viewBox="280 510 1130 970"
      className="h-full w-full"
      style={{ background: "#ffffff" }}
    >
      {/* ===== floor / corridor base ===== */}
      <g>
        {footprint.map((f, i) => (
          <rect
            key={i}
            x={f.x}
            y={f.y}
            width={f.w}
            height={f.h}
            fill="#eef1f4"
            stroke="#2f3640"
            strokeWidth={2.4}
          />
        ))}
      </g>

      {/* outer accent rounded boundary (decorative, like original dashed shell) */}
      <path
        d="M300 870 v-120 a40 40 0 0 1 40 -40 h120 v-100 h760 v-60 h170 v420 h60 a40 40 0 0 1 0 80 h-60 v260 a40 40 0 0 1 -40 40 h-180 v160 h-700 v-160 h-160 v-180 h-110 a40 40 0 0 1 0 -80 h110 z"
        fill="none"
        stroke="#c4ccd6"
        strokeWidth={1.4}
        strokeDasharray="6 5"
        opacity={0.7}
      />

      {/* ===== rooms ===== */}
      <g>
        {rooms.map((r) => {
          const c = typeColors[r.type];
          const isActive = selected === r.id || hovered === r.id;
          const lx = r.x + r.w / 2;
          const ly = r.labelTop ? r.y + 18 : r.y + r.h / 2 + 4;
          return (
            <g
              key={r.id}
              onMouseEnter={() => setHovered(r.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(selected === r.id ? null : r.id)}
              style={{ cursor: "pointer" }}
            >
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill={isActive ? c.active : c.fill}
                stroke={isActive ? "#1f2933" : c.stroke}
                strokeWidth={isActive ? 2.2 : 1.4}
              />
              {/* nested rings for ágoras (auditorium) */}
              {r.type === "agora" && (
                <>
                  <rect x={r.x + 12} y={r.y + 28} width={r.w - 24} height={r.h - 44} fill="none" stroke={c.stroke} strokeWidth={1} />
                  <rect x={r.x + 24} y={r.y + 44} width={r.w - 48} height={r.h - 76} fill="none" stroke={c.stroke} strokeWidth={1} />
                </>
              )}
              {/* patio hatch */}
              {r.type === "patio" && (
                <line x1={r.x} y1={r.y + r.h} x2={r.x + r.w} y2={r.y} stroke={c.stroke} strokeWidth={0.7} opacity={0.5} />
              )}
              {r.label && (
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  fontSize={r.fontSize ?? 15}
                  fontWeight={r.type === "aula" || r.type === "oficina" || r.type === "cw" ? 700 : 500}
                  fill="#2a313a"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {r.label}
                </text>
              )}
            </g>
          );
        })}
      </g>

      {/* ===== structural columns (the small dark squares of the plan) ===== */}
      <g fill="#2f3640">
        {[
          [575, 720], [685, 720], [780, 720], [882, 720], [920, 720], [1010, 720],
          [575, 880], [685, 880], [882, 880], [920, 880],
          [575, 1075], [685, 1075], [882, 1075], [920, 1075],
          [575, 1290], [685, 1290], [810, 1290], [920, 1290], [1010, 1290], [1105, 1290],
          [490, 880], [490, 1075],
        ].map(([cx, cy], i) => (
          <rect key={i} x={cx - 4} y={cy - 4} width={8} height={8} />
        ))}
      </g>

      {/* ===== stairs & elevators ===== */}
      <g>
        {stairs.map((s, i) => (
          <StairMark key={i} s={s} />
        ))}
      </g>

      {/* ===== doors ===== */}
      <g>
        {doors.map((d, i) => (
          <DoorMark key={i} d={d} />
        ))}
      </g>

      {/* ===== entrance ramp (Entrada IAT) ===== */}
      <g>
        <text x={635} y={612} textAnchor="middle" fontSize={13} fill="#2a313a">
          Entrada IAT
        </text>
        <path d="M455 660 l-55 40 l30 40 l55 -40 z" fill="#f7f8fa" stroke="#5b6470" strokeWidth={1.2} />
        <line x1={455} y1={660} x2={430} y2={740} stroke="#9aa3ad" strokeWidth={0.8} />
        {/* exterior steps bottom-left */}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={300 + i * 0} y1={1100 + i * 9} x2={470} y2={1100 + i * 9} stroke="#cfd6de" strokeWidth={0.8} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={"b" + i} x1={300} y1={1340 + i * 9} x2={470} y2={1340 + i * 9} stroke="#cfd6de" strokeWidth={0.8} />
        ))}
      </g>

      {/* ===== POLO DIGITAL marker (green dots + vertical text) ===== */}
      <g>
        {Array.from({ length: 5 }).map((_, i) => (
          <circle key={i} cx={426} cy={530 + i * 26} r={8} fill="none" stroke="#3f8f5f" strokeWidth={1.6} />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <circle key={"d" + i} cx={426} cy={530 + i * 26} r={2} fill="#3f8f5f" />
        ))}
        <text
          x={398}
          y={585}
          fontSize={11}
          fill="#3f8f5f"
          fontWeight={600}
          letterSpacing={2}
          transform="rotate(-90 398 585)"
        >
          POLO DIGITAL
        </text>
      </g>

      {/* ===== S1 / S2 markers ===== */}
      <g>
        {[
          ["S1", 540, 1340],
          ["S2", 600, 1340],
        ].map(([label, cx, cy]) => (
          <g key={label as string}>
            <circle cx={cx as number} cy={cy as number} r={17} fill="#ffffff" stroke="#2f3640" strokeWidth={1.4} />
            <text x={cx as number} y={(cy as number) + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2a313a">
              {label}
            </text>
          </g>
        ))}
      </g>

      {/* ===== evacuation labels ===== */}
      <g>
        {evacuations.map((e) => (
          <g key={e.id}>
            <rect x={e.x - 4} y={e.y - 13} width={68} height={18} rx={3} fill="#fff" stroke="#e23b3b" strokeWidth={1} opacity={0.95} />
            <text x={e.x + 30} y={e.y} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e23b3b">
              {e.label}
            </text>
          </g>
        ))}
      </g>

      {/* hovered tooltip */}
      {hovered && (() => {
        const r = rooms.find((x) => x.id === hovered);
        if (!r || !r.label) return null;
        return (
          <g style={{ pointerEvents: "none" }}>
            <rect x={r.x + r.w / 2 - 60} y={r.y - 30} width={120} height={22} rx={5} fill="#1f2933" opacity={0.92} />
            <text x={r.x + r.w / 2} y={r.y - 15} textAnchor="middle" fontSize={13} fill="#fff" fontWeight={600}>
              {r.label}
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
