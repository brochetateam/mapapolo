/* ============================================================
   MAPAPOLO 2026 · Controlador del mapa SVG
   ------------------------------------------------------------
   Carga el SVG real de la planta baja, hace clicables sus
   zonas según los IDs definidos en datos.js, y pinta las
   líneas de sinergia.
   ============================================================ */

window.MAPAPOLO_MAPA = (function () {
  "use strict";

  const DATA = window.MAPAPOLO_DATA;
  const SVG_URL = "mapas/plano_polo_planta_baja.svg";
  const SVG_URL_FALLBACK = "../Plano POLO Planta Baja/plano_polo_planta_baja.svg";

  const state = {
    zonasData: {},
    activeSpace: null,
    highlightZones: new Set(),
    onSelect: null,
    onHover: null
  };

  /* ---------- LOAD ---------- */
  async function load(svgHost) {
    let raw;
    try {
      const r = await fetch(SVG_URL);
      if (!r.ok) throw new Error("HTTP " + r.status);
      raw = await r.text();
    } catch (e1) {
      try {
        const r2 = await fetch(SVG_URL_FALLBACK);
        if (!r2.ok) throw new Error("HTTP " + r2.status);
        raw = await r2.text();
      } catch (e2) {
        console.error("[MAPAPOLO] No se pudo cargar el SVG:", e1, e2);
        svgHost.innerHTML = '<div style="padding:24px;color:#c7cbe0;text-align:center;">No se pudo cargar el plano.<br><small>Revisa la ruta mapas/plano_polo_planta_baja.svg</small></div>';
        return false;
      }
    }

    svgHost.innerHTML = raw;
    const svg = svgHost.querySelector("svg");
    if (!svg) return false;

    // Ajustes de tamaño y estilo
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Hacer interactivos los grupos cuyo id esté en zonas
    Object.keys(DATA.zonas).forEach(function (id) {
      const g = svg.querySelector("#" + CSS.escape(id));
      if (g) {
        g.setAttribute("data-space", id);
        // Cursor pointer
        g.style.cursor = "pointer";
        // Quitar pointer-events de textos internos
        g.querySelectorAll("text").forEach(function (t) { t.style.pointerEvents = "none"; });
        g.addEventListener("click", function (ev) { handleClick(id, ev); });
        g.addEventListener("mouseenter", function (ev) { handleEnter(id, ev); });
        g.addEventListener("mouseleave", function (ev) { handleLeave(id, ev); });
        state.zonasData[id] = g;
      }
    });

    // Limpiar outlines feos en SVG
    svg.style.outline = "none";

    return true;
  }

  /* ---------- HANDLERS ---------- */
  function handleClick(id, ev) {
    ev.stopPropagation();
    if (state.onSelect) state.onSelect(id);
  }

  function handleEnter(id, ev) {
    if (state.onHover) state.onHover(id, ev);
  }

  function handleLeave(id, ev) {
    if (state.onHover) state.onHover(null, ev);
  }

  /* ---------- HIGHLIGHT / ACTIVE ---------- */
  function setActive(id) {
    Object.keys(state.zonasData).forEach(function (k) {
      const el = state.zonasData[k];
      el.classList.remove("is-active");
    });
    state.activeSpace = id;
    if (id && state.zonasData[id]) {
      state.zonasData[id].classList.add("is-active");
    }
  }

  function highlight(ids) {
    Object.keys(state.zonasData).forEach(function (k) {
      const el = state.zonasData[k];
      el.classList.remove("is-highlight", "is-dim");
    });
    if (!ids) return;
    const set = new Set(ids);
    Object.keys(state.zonasData).forEach(function (k) {
      if (set.has(k)) state.zonasData[k].classList.add("is-highlight");
      else state.zonasData[k].classList.add("is-dim");
    });
  }

  function clearHighlight() {
    Object.keys(state.zonasData).forEach(function (k) {
      state.zonasData[k].classList.remove("is-highlight", "is-dim");
    });
  }

  /* ---------- SINERGY LINES ---------- */
  function getZonaCentroid(zoneId) {
    const el = state.zonasData[zoneId];
    if (!el) return null;
    const svg = el.ownerSVGElement;
    if (!svg) return null;
    const b = el.getBBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height };
  }

  function getZonaCenters(zonaIds) {
    return zonaIds.map(function (id) {
      return getZonaCentroid(id);
    }).filter(Boolean);
  }

  function drawSynergyLines(pairs) {
    const layer = document.getElementById("synergyLines");
    if (!layer) return;
    layer.innerHTML = "";

    pairs.forEach(function (p, idx) {
      const a = getZonaCentroid(p.from);
      const b = getZonaCentroid(p.to);
      if (!a || !b) return;
      // Curva bezier con control arriba
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const offset = Math.min(120, Math.max(40, Math.hypot(dx, dy) * 0.25));
      const cx = mx;
      const cy = my - offset;

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("class", "synergy-line");
      path.setAttribute("d", "M " + a.x + " " + a.y + " Q " + cx + " " + cy + " " + b.x + " " + b.y);
      path.style.animationDelay = (idx * 0.2) + "s";
      layer.appendChild(path);

      // Nodos brillantes
      const c1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c1.setAttribute("class", "synergy-node");
      c1.setAttribute("cx", a.x);
      c1.setAttribute("cy", a.y);
      c1.setAttribute("r", 3.5);
      layer.appendChild(c1);

      const c2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c2.setAttribute("class", "synergy-node");
      c2.setAttribute("cx", b.x);
      c2.setAttribute("cy", b.y);
      c2.setAttribute("r", 3.5);
      c2.style.animationDelay = "0.4s";
      layer.appendChild(c2);
    });
  }

  function clearSynergyLines() {
    const layer = document.getElementById("synergyLines");
    if (layer) layer.innerHTML = "";
  }

  /* ---------- TOOLTIP ---------- */
  let tooltipEl = null;
  function showTooltip(id, ev) {
    if (!id) { hideTooltip(); return; }
    const z = DATA.getZonaById(id);
    if (!z) return;
    const empresas = DATA.getEmpresasByZona(id);

    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "tooltip";
      document.getElementById("mapStage").appendChild(tooltipEl);
    }
    tooltipEl.innerHTML =
      '<div class="tooltip-title">' + escapeHtml(z.nombre) + '</div>' +
      '<div class="tooltip-sub">' + escapeHtml(z.desc) + '</div>' +
      (empresas.length ? '<span class="tooltip-count">' + empresas.length + ' empresa' + (empresas.length > 1 ? 's' : '') + '</span>' : '');

    const stage = document.getElementById("mapStage");
    const stageRect = stage.getBoundingClientRect();
    const el = state.zonasData[id];
    const svg = el.ownerSVGElement;
    const svgRect = svg.getBoundingClientRect();
    const b = el.getBBox();
    const ctm = el.getCTM();
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = b.x + b.width / 2;
    svgPoint.y = b.y;
    const screenPoint = svgPoint.matrixTransform(ctm);

    const x = (svgRect.left - stageRect.left) + screenPoint.x;
    const y = (svgRect.top - stageRect.top) + screenPoint.y;

    tooltipEl.style.left = x + "px";
    tooltipEl.style.top = y + "px";
    tooltipEl.style.display = "block";
  }
  function hideTooltip() {
    if (tooltipEl) tooltipEl.style.display = "none";
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* ---------- API pública ---------- */
  return {
    load: load,
    setActive: setActive,
    highlight: highlight,
    clearHighlight: clearHighlight,
    drawSynergyLines: drawSynergyLines,
    clearSynergyLines: clearSynergyLines,
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    setOnSelect: function (fn) { state.onSelect = fn; },
    setOnHover: function (fn) { state.onHover = fn; },
    getZonaCenters: getZonaCenters
  };
})();

/* Polyfill mínimo para CSS.escape (algunos navegadores antiguos) */
if (typeof CSS === "undefined" || !CSS.escape) {
  window.CSS = window.CSS || {};
  CSS.escape = function (s) {
    return String(s).replace(/([^a-zA-Z0-9_-])/g, "\\$1");
  };
}
