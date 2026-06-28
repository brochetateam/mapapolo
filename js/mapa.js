// ============================================================
// MAPAPOLO — Motor de Mapa Interactivo
// Control del SVG, selección, resaltado, rutas
// ============================================================

const Mapa = (() => {

  let plantaActual = "baja";
  let zonaActiva = null;
  let zonasResaltadas = [];

  // Colores de zona por defecto
  const colores = {
    "recepcion": { fill: "#dbeafe", stroke: "#3b82f6" },
    "agora": { fill: "#fef3c7", stroke: "#f59e0b" },
    "patio1": { fill: "#d1fae5", stroke: "#10b981" },
    "patio2": { fill: "#d1fae5", stroke: "#10b981" },
    "showroom": { fill: "#fef9c3", stroke: "#eab308" },
    "aula1": { fill: "#ede9fe", stroke: "#8b5cf6" },
    "aula2": { fill: "#ede9fe", stroke: "#8b5cf6" },
    "aula3": { fill: "#ede9fe", stroke: "#8b5cf6" },
    "aula4": { fill: "#ede9fe", stroke: "#8b5cf6" },
    "aula5": { fill: "#ede9fe", stroke: "#8b5cf6" },
    "aula6": { fill: "#ede9fe", stroke: "#8b5cf6" },
    "modulo1": { fill: "#1e293b", stroke: "#475569" },
    "modulo2": { fill: "#1e293b", stroke: "#475569" },
    "coworking": { fill: "#dbeafe", stroke: "#3b82f6" },
    "lab-vr": { fill: "#f5f3ff", stroke: "#8b5cf6" },
    "lab-audio": { fill: "#f0fdfa", stroke: "#14b8a6" },
    "lab-3d": { fill: "#fff7ed", stroke: "#ea580c" },
    "lab-video": { fill: "#fef2f2", stroke: "#ef4444" },
    "despacho3": { fill: "#1e293b", stroke: "#475569" },
    "despacho4": { fill: "#1e293b", stroke: "#475569" },
    "despacho5": { fill: "#1e293b", stroke: "#475569" },
    "recepcion2": { fill: "#dbeafe", stroke: "#3b82f6" }
  };

  // Inicializar mapa
  function init() {
    // Asignar eventos de clic a todas las zonas
    document.querySelectorAll(".zone").forEach(zone => {
      zone.addEventListener("click", () => {
        const spaceId = zone.dataset.space;
        const spaceName = zone.dataset.name;
        seleccionarZona(spaceId, spaceName);
      });

      // Hover effect con tooltip
      zone.addEventListener("mouseenter", () => {
        const name = zone.dataset.name;
        if (name) zone.style.cursor = "pointer";
      });
    });

    // Selector de planta
    document.getElementById("btnBaja")?.addEventListener("click", () => cambiarPlanta("baja"));
    document.getElementById("btnPrimera")?.addEventListener("click", () => cambiarPlanta("primera"));
  }

  // Cambiar planta
  function cambiarPlanta(planta) {
    plantaActual = planta;

    const svgBaja = document.getElementById("svgBaja");
    const svgPrimera = document.getElementById("svgPrimera");
    const btnBaja = document.getElementById("btnBaja");
    const btnPrimera = document.getElementById("btnPrimera");

    if (planta === "baja") {
      svgBaja?.classList.remove("hidden");
      svgPrimera?.classList.add("hidden");
      btnBaja?.classList.add("active");
      btnPrimera?.classList.remove("active");
    } else {
      svgPrimera?.classList.remove("hidden");
      svgBaja?.classList.add("hidden");
      btnPrimera?.classList.add("active");
      btnBaja?.classList.remove("active");
    }

    // Limpiar selección al cambiar de planta
    limpiarSeleccion();
  }

  // Seleccionar zona
  function seleccionarZona(spaceId, spaceName) {
    // Limpiar selección previa
    limpiarSeleccion();

    // Activar nueva zona
    zonaActiva = spaceId;

    // Buscar todas las zonas con el mismo spaceId en la planta actual
    const selectorPlanta = plantaActual === "baja" ? "#svgBaja" : "#svgPrimera";
    document.querySelectorAll(`${selectorPlanta} .zone`).forEach(z => {
      if (z.dataset.space === spaceId) {
        z.classList.add("active");
      }
    });

    // Disparar evento para que app.js actualice el panel
    window.dispatchEvent(new CustomEvent("zonaSeleccionada", {
      detail: { spaceId, spaceName, planta: plantaActual }
    }));
  }

  // Resaltar zonas (por búsqueda)
  function resaltarZonas(spaceIds) {
    limpiarResaltado();
    zonasResaltadas = spaceIds;

    spaceIds.forEach(id => {
      document.querySelectorAll(`.zone[data-space="${id}"]`).forEach(z => {
        z.classList.add("highlighted");
      });
    });
  }

  // Limpiar selección
  function limpiarSeleccion() {
    zonaActiva = null;
    document.querySelectorAll(".zone.active").forEach(z => {
      z.classList.remove("active");
    });
  }

  // Limpiar resaltado
  function limpiarResaltado() {
    zonasResaltadas = [];
    document.querySelectorAll(".zone.highlighted").forEach(z => {
      z.classList.remove("highlighted");
    });
  }

  // Obtener zona activa
  function getZonaActiva() {
    return zonaActiva;
  }

  // Obtener planta actual
  function getPlantaActual() {
    return plantaActual;
  }

  // Navegar a una empresa específica
  function navegarAEmpresa(empresaId) {
    const empresa = EMPRESAS.find(e => e.id === empresaId);
    if (!empresa) return;

    // Cambiar a la planta correcta
    if (empresa.planta !== plantaActual) {
      cambiarPlanta(empresa.planta);
    }

    // Seleccionar la zona
    seleccionarZona(empresa.zona, empresa.nombre);
  }

  return {
    init,
    cambiarPlanta,
    seleccionarZona,
    resaltarZonas,
    limpiarSeleccion,
    limpiarResaltado,
    getZonaActiva,
    getPlantaActual,
    navegarAEmpresa
  };

})();
