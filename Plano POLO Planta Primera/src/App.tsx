import { useRef, useState } from "react";
import FloorPlan, { ROOMS, KIND_STYLE } from "./FloorPlan";
import type { RoomKind } from "./FloorPlan";

const KIND_LABELS: Record<string, string> = {
  office: "Oficina",
  studio: "Estudio",
  wc: "Aseos",
  storage: "Almacén",
  lab: "Laboratorio",
  tech: "Sala técnica",
  circulation: "Circulación",
  special: "Sala especial",
};

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoverInfo, setHoverInfo] = useState<{ id: string; x: number; y: number } | null>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  const selRoom = ROOMS.find((r) => r.id === selected) || null;
  const hoverRoom = hoverInfo ? ROOMS.find((r) => r.id === hoverInfo.id) : null;

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setPan({
      x: drag.current.px + (e.clientX - drag.current.x),
      y: drag.current.py + (e.clientY - drag.current.y),
    });
  };
  const onPointerUp = () => {
    drag.current = null;
  };
  const reset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onHover = (id: string | null, pos?: { x: number; y: number }) => {
    if (id && pos) setHoverInfo({ id, x: pos.x, y: pos.y });
    else setHoverInfo(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-slate-100">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-indigo-500 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-fuchsia-500 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-4 p-4 lg:p-6">
        {/* Header */}
        <header className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-2xl font-black text-white shadow-lg shadow-emerald-500/30">
                Ø
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight sm:text-2xl">
                  Plano POLO · Planta Primera
                </h1>
                <p className="text-xs text-slate-400 sm:text-sm">
                  Bases de acceso al Polo Nacional de Contenidos Digitales · 2026
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-xs font-semibold text-amber-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
              Interactivo · SVG vectorizado
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Plan viewer */}
          <main className="relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
            {/* Controles */}
            <div className="absolute left-3 top-3 z-10 flex flex-col gap-2">
              <div className="flex overflow-hidden rounded-xl border border-white/20 bg-slate-900/80 shadow-lg backdrop-blur">
                <button
                  className="px-3 py-2 text-lg font-bold text-white transition hover:bg-white/10"
                  onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                  aria-label="Acercar"
                >
                  +
                </button>
                <button
                  className="border-l border-white/10 px-3 py-2 text-lg font-bold text-white transition hover:bg-white/10"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}
                  aria-label="Alejar"
                >
                  −
                </button>
                <button
                  className="border-l border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                  onClick={reset}
                >
                  RESET
                </button>
              </div>
              <button
                className={`rounded-xl border px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur transition ${
                  showLabels
                    ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                    : "border-white/20 bg-slate-900/80 text-slate-300 hover:bg-white/10"
                }`}
                onClick={() => setShowLabels((s) => !s)}
              >
                {showLabels ? "🏷️ Rótulos ON" : "🏷️ Rótulos OFF"}
              </button>
            </div>

            <div className="absolute bottom-3 left-3 z-10 rounded-lg bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 shadow backdrop-blur">
              🖱️ Arrastra para mover · usa +/− para zoom
            </div>

            <div
              className="h-[60vh] w-full cursor-grab touch-none select-none active:cursor-grabbing lg:h-[80vh]"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              <div
                className="h-full w-full origin-center transition-transform duration-75"
                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
              >
                <FloorPlan
                  selected={selected}
                  onSelect={setSelected}
                  showLabels={showLabels}
                  onHover={onHover}
                />
              </div>
            </div>

            {/* Tooltip flotante */}
            {hoverRoom && hoverInfo && (
              <div
                className="pointer-events-none absolute z-20 max-w-xs rounded-xl border border-white/20 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl"
                style={{
                  left: `${hoverInfo.x}px`,
                  top: `${hoverInfo.y}px`,
                  transform: "translate(12px, -50%)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-full ring-2 ring-white/30 ${
                      KIND_STYLE[hoverRoom.kind as RoomKind].badge
                    }`}
                  />
                  <p className="text-sm font-bold text-white">
                    {hoverRoom.label} {hoverRoom.sub}
                  </p>
                </div>
                <p className="mt-1 text-xs text-slate-300">
                  {KIND_LABELS[hoverRoom.kind]}
                </p>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="flex w-full flex-col gap-4 lg:w-80">
            {/* Selección */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-300">
                Espacio seleccionado
              </h2>
              {selRoom ? (
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow ${
                        KIND_STYLE[selRoom.kind as RoomKind].badge
                      } text-white`}
                    >
                      {selRoom.icon || ""}
                    </span>
                    <div>
                      <p className="text-lg font-black text-white">
                        {selRoom.label} {selRoom.sub}
                      </p>
                      <p className="text-xs text-slate-400">{KIND_LABELS[selRoom.kind]}</p>
                    </div>
                  </div>
                  <button
                    className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
                    onClick={() => setSelected(null)}
                  >
                    Limpiar selección
                  </button>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                   Haz clic en cualquier sala del plano para ver su información.
                </p>
              )}
            </div>

            {/* Leyenda */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-300">
                Leyenda
              </h2>
              <ul className="space-y-2">
                {(
                  [
                    ["office", "Oficinas (OF / DES)", "🏢"],
                    ["studio", "Estudios (ST)", "🎬"],
                    ["wc", "Aseos (WC)", "🚻"],
                    ["storage", "Almacenes", "📦"],
                    ["lab", "Laboratorio 3D", "🔬"],
                    ["tech", "Salas técnicas (ET / CPD)", "⚙️"],
                    ["special", "Salas especiales", "✨"],
                  ] as [string, string, string][]
                ).map(([key, label, icon]) => (
                  <li key={key} className="flex items-center gap-3 text-sm text-slate-300">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-base shadow-inner ${
                        KIND_STYLE[key as RoomKind].badge
                      }`}
                    >
                      {icon}
                    </span>
                    <span className="text-sm">{label}</span>
                  </li>
                ))}
                <li className="flex items-center gap-3 pt-1 text-sm text-slate-300">
                  <span className="h-4 w-8 rounded bg-gradient-to-r from-emerald-400 to-emerald-600 shadow" />
                  Fachada / muro cortina
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-red-500 bg-red-500/20 text-xs font-bold text-red-400">
                    !
                  </span>
                  Salida de evacuación
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex h-8 w-8 items-center justify-center rounded bg-slate-500 text-xs">🛗</span>
                  Ascensor / Escaleras
                </li>
              </ul>
            </div>

            {/* Directorio */}
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                  Directorio
                </h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  {ROOMS.filter((r) => r.kind !== "circulation").length}
                </span>
              </div>
              <div className="max-h-64 space-y-1 overflow-y-auto pr-2 lg:max-h-[30vh]">
                {ROOMS.filter((r) => r.kind !== "circulation").map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelected(selected === r.id ? null : r.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                      selected === r.id
                        ? "bg-amber-500/20 text-amber-200 ring-1 ring-amber-400/40"
                        : "text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <span className="text-base">{r.icon || "•"}</span>
                    <span className="flex-1 font-semibold">
                      {r.label} {r.sub}
                    </span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold text-white ${
                        KIND_STYLE[r.kind as RoomKind].badge
                      }`}
                    >
                      {KIND_LABELS[r.kind]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-xs text-slate-400 backdrop-blur">
          Bases de acceso al Polo Nacional de Contenidos Digitales // 2026 · pág. 33 ·{" "}
          <span className="font-bold text-emerald-400">SVG vectorizado</span>
        </footer>
      </div>
    </div>
  );
}
