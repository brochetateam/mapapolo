import { useMemo, useState } from "react";
import FloorPlan from "./FloorPlan";
import { rooms, typeColors, typeLabels, type RoomType } from "./floorplanData";

const typeOrder: RoomType[] = [
  "aula",
  "oficina",
  "agora",
  "cw",
  "patio",
  "recepcion",
  "office",
  "almacen",
  "wc",
  "room",
];

export default function App() {
  const [selected, setSelected] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selected) ?? null,
    [selected]
  );

  const directory = useMemo(() => {
    const groups: Record<string, typeof rooms> = {};
    rooms
      .filter((r) => r.label)
      .forEach((r) => {
        (groups[r.type] ||= []).push(r);
      });
    return typeOrder
      .filter((t) => groups[t])
      .map((t) => ({ type: t, items: groups[t] }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 text-slate-800">
      <div className="mx-auto max-w-[1500px] px-4 py-6 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-700 text-emerald-700">
              <span className="text-2xl font-bold leading-none">Ø</span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Polo Nacional de Contenidos Digitales
              </p>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                2.4 · Plano y directorio de POLO — Planta Baja
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            Plano vectorizado interactivo · SVG
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Plan */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* zoom controls */}
            <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white/90 shadow-sm backdrop-blur">
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                className="px-3 py-1.5 text-lg font-semibold text-slate-600 transition hover:bg-slate-100"
                aria-label="Acercar"
              >
                +
              </button>
              <button
                onClick={() => setZoom(1)}
                className="border-y border-slate-200 px-3 py-1 text-[10px] font-medium text-slate-500 transition hover:bg-slate-100"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
                className="px-3 py-1.5 text-lg font-semibold text-slate-600 transition hover:bg-slate-100"
                aria-label="Alejar"
              >
                −
              </button>
            </div>

            <div className="h-[68vh] w-full overflow-auto bg-[radial-gradient(#e8edf2_1px,transparent_1px)] [background-size:22px_22px]">
              <div
                className="mx-auto origin-top transition-transform duration-200"
                style={{ width: `${100 * zoom}%`, transform: `scale(1)` }}
              >
                <FloorPlan selected={selected} onSelect={setSelected} />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-2 text-[11px] text-slate-400">
              <span>Pasa el cursor o haz clic en cualquier espacio para más detalle.</span>
              <span>Norte ↑</span>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Selected info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-2 text-sm font-semibold text-slate-700">
                Espacio seleccionado
              </h2>
              {selectedRoom ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-4 w-4 rounded"
                      style={{
                        background: typeColors[selectedRoom.type].active,
                        border: `1.5px solid ${typeColors[selectedRoom.type].stroke}`,
                      }}
                    />
                    <span className="text-lg font-bold text-slate-900">
                      {selectedRoom.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Categoría: {typeLabels[selectedRoom.type]}
                  </p>
                  <button
                    onClick={() => setSelected(null)}
                    className="mt-1 text-xs font-medium text-emerald-700 hover:underline"
                  >
                    Limpiar selección
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Ningún espacio seleccionado todavía.
                </p>
              )}
            </div>

            {/* Legend */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">Leyenda</h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {typeOrder.map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <span
                      className="inline-block h-3.5 w-3.5 flex-shrink-0 rounded-sm"
                      style={{
                        background: typeColors[t].fill,
                        border: `1.5px solid ${typeColors[t].stroke}`,
                      }}
                    />
                    <span className="text-slate-600">{typeLabels[t]}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <svg width="22" height="14" viewBox="0 0 22 14">
                    <line x1="2" y1="12" x2="14" y2="12" stroke="#5b6470" strokeWidth="1.3" />
                    <path d="M14 12 A12 12 0 0 0 2 0" fill="none" stroke="#9aa3ad" strokeWidth="1" strokeDasharray="3 2" />
                  </svg>
                  <span>Puerta (sentido de apertura)</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="22" height="14" viewBox="0 0 22 14">
                    <rect x="1" y="1" width="20" height="12" fill="#f0f2f5" stroke="#5b6470" />
                    <line x1="1" y1="5" x2="21" y2="5" stroke="#8a93a0" />
                    <line x1="1" y1="9" x2="21" y2="9" stroke="#8a93a0" />
                  </svg>
                  <span>Escalera / ascensor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded border border-red-500 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                    Evacu.
                  </span>
                  <span>Ruta de evacuación</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-500 text-[9px] font-bold">
                    S
                  </span>
                  <span>Punto de servicio (S1 / S2)</span>
                </div>
              </div>
            </div>

            {/* Directory */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-semibold text-slate-700">
                Directorio de espacios
              </h2>
              <div className="max-h-[40vh] space-y-3 overflow-auto pr-1">
                {directory.map((g) => (
                  <div key={g.type}>
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {typeLabels[g.type]}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {g.items.map((r) => (
                        <button
                          key={r.id}
                          onClick={() =>
                            setSelected(selected === r.id ? null : r.id)
                          }
                          className={`rounded-md border px-2 py-1 text-xs transition ${
                            selected === r.id
                              ? "border-slate-800 bg-slate-800 text-white"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-6 text-center text-[11px] text-slate-400">
          Bases de acceso al Polo Nacional de Contenidos Digitales // 2026 — pág. 32
        </footer>
      </div>
    </div>
  );
}
