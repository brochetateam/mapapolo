/* ============================================================
   MAPAPOLO 2026 · Controlador principal
   ------------------------------------------------------------
   Orquesta mapa, buscador, panel de empresa y sinergias.
   ============================================================ */

(function () {
  "use strict";

  const DATA = window.MAPAPOLO_DATA;
  const MAPA = window.MAPAPOLO_MAPA;
  const BUS = window.MAPAPOLO_BUSCADOR;

  if (!DATA || !MAPA || !BUS) {
    console.error("[MAPAPOLO] Faltan módulos. ¿Se cargaron todos los scripts?");
    return;
  }

  /* ---------- DOM ---------- */
  const $ = function (sel, root) { return (root || document).querySelector(sel); };
  const $$ = function (sel, root) { return Array.from((root || document).querySelectorAll(sel)); };

  const els = {
    searchInput: $("#searchInput"),
    searchSuggestions: $("#searchSuggestions"),
    empresaEmpty: $("#empresaEmpty"),
    empresaContent: $("#empresaContent"),
    empresaAvatar: $("#empresaAvatar"),
    empresaNombre: $("#empresaNombre"),
    empresaSector: $("#empresaSector"),
    empresaUbicacionTxt: $("#empresaUbicacionTxt"),
    empresaDesc: $("#empresaDesc"),
    empresaTech: $("#empresaTech"),
    empresaWeb: $("#empresaWeb"),
    empresaClose: $("#empresaClose"),
    empresaCard: $("#empresaCard"),
    sinergiasCard: $("#sinergias"),
    sinergiasBody: $("#sinergiasBody"),
    btnVerSinergias: $("#btnVerSinergias"),
    mapStage: $("#mapStage"),
    mapHint: $("#mapHint"),
    toastContainer: $("#toastContainer"),
    menuToggle: $("#menuToggle"),
    headerMenu: $("#headerMenu"),
    themeToggle: $("#themeToggle"),
    themeIcon: $("#themeIcon"),
    statNums: $$(".stat-num")
  };

  let currentEmpresaId = null;

  // Zonas que NO deben mostrar sinergias IA
  const ZONAS_SIN_SINERGIAS = [
    "agora1", "agora2",
    "au1", "au2", "au3", "au4", "au5", "au6",
    "cw1", "cw2",
    "antesala", "office",
    "of4"
  ];
  let statsAnimated = false;

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    bindMapEvents();
    bindSearch();
    bindUI();
    animateStats();
    setupShortcuts();
    applyStoredTheme();
    loadMap();
    hideHintAfterTimeout();
  });

  /* ---------- MAPA ---------- */
  function loadMap() {
    MAPA.load($("#svgHost")).then(function (ok) {
      if (!ok) return;
      MAPA.setOnSelect(handleZonaSelect);
      MAPA.setOnHover(function (id, ev) {
        if (id) {
          showTooltip(id, ev);
        } else {
          hideTooltip();
        }
      });
    });
  }

  function bindMapEvents() {
    // Click en el stage (no en una zona) para reset
    if (els.mapStage) {
      els.mapStage.addEventListener("click", function (ev) {
        if (ev.target === els.mapStage || ev.target.tagName === "svg") {
          resetSelection();
        }
      });
    }
  }

  function handleZonaSelect(zoneId) {
    const z = DATA.getZonaByZonaId ? DATA.getZonaByZonaId(zoneId) : DATA.getZonaById(zoneId);
    if (!z) return;
    MAPA.setActive(zoneId);

    // Empresas en esta zona
    const empresas = DATA.getEmpresasByZona(zoneId);
    if (empresas.length === 0) {
      showZonaOnly(z, zoneId);
      return;
    }
    if (empresas.length === 1) {
      showEmpresa(empresas[0].id, zoneId);
    } else {
      // Mostrar lista de empresas
      showZonaLista(z, empresas, zoneId);
    }
  }

  function showZonaOnly(z, zoneId) {
    currentEmpresaId = null;
    els.empresaEmpty.hidden = true;
    els.empresaContent.hidden = false;
    els.empresaAvatar.textContent = "·";
    els.empresaAvatar.className = "avatar avatar-soft";
    els.empresaNombre.textContent = z.nombre;
    els.empresaSector.textContent = (DATA.categoriaLabel[z.categoria] || "Espacio común");
    els.empresaUbicacionTxt.textContent = "Planta baja · " + z.m2 + " m²";
    els.empresaDesc.textContent = z.desc;
    els.empresaTech.innerHTML = '<span class="tag tag-cyan">Espacio común</span><span class="tag">' + (z.m2 || "?") + ' m²</span>';
    els.empresaWeb.hidden = true;
    showSinergiasForZona(zoneId);
  }

  function showZonaLista(z, empresas, zoneId) {
    currentEmpresaId = null;
    els.empresaEmpty.hidden = true;
    els.empresaContent.hidden = false;
    els.empresaAvatar.textContent = empresas.length + "";
    els.empresaAvatar.className = "avatar avatar-soft";
    els.empresaNombre.textContent = z.nombre + " · " + empresas.length + " empresas";
    els.empresaSector.textContent = empresas.map(function (e) { return e.nombre; }).slice(0, 3).join(" · ") + (empresas.length > 3 ? "…" : "");
    els.empresaUbicacionTxt.textContent = "Planta baja · " + z.m2 + " m²";
    els.empresaDesc.textContent = z.desc;
    els.empresaTech.innerHTML = empresas.slice(0, 6).map(function (e) {
      return '<span class="tag" data-empresa-id="' + e.id + '" style="cursor:pointer">' + escapeHtml(e.nombre) + '</span>';
    }).join("");
    els.empresaWeb.hidden = true;

    // Hacer clicables los tags
    $$(".empresa-tech [data-empresa-id]", els.empresaTech).forEach(function (tag) {
      tag.addEventListener("click", function () {
        const id = tag.getAttribute("data-empresa-id");
        showEmpresa(id, zoneId);
      });
    });

    showSinergiasForZona(zoneId);
  }

  function showEmpresa(empresaId, fromZoneId) {
    const e = DATA.getEmpresaById(empresaId);
    if (!e) return;
    currentEmpresaId = empresaId;
    els.empresaEmpty.hidden = true;
    els.empresaContent.hidden = false;

    // Resaltar zonas de la empresa
    MAPA.highlight(e.zonas);
    if (e.zonas.length) {
      MAPA.setActive(e.zonas[0]);
    }

    // Avatar con color
    els.empresaAvatar.textContent = e.nombre.substring(0, 1).toUpperCase();
    els.empresaAvatar.className = "avatar avatar-soft";
    els.empresaAvatar.style.background = e.color;
    els.empresaAvatar.style.color = "#fff";

    els.empresaNombre.textContent = e.nombre;
    els.empresaSector.textContent = e.sector;
    const zonasTxt = e.zonas.map(function (zid) {
      const z = DATA.getZonaById(zid);
      return z ? z.nombre : zid;
    }).join(", ");
    els.empresaUbicacionTxt.textContent = "Planta baja · " + zonasTxt;
    els.empresaDesc.textContent = e.desc;

    // Tags con tecnologías
    const tags = (e.tech || []).slice(0, 8).map(function (t) {
      return '<span class="tag tag-cyan">' + escapeHtml(t) + '</span>';
    }).join("");
    els.empresaTech.innerHTML = tags;
    if (e.web) {
      els.empresaWeb.href = e.web;
      els.empresaWeb.hidden = false;
    } else {
      els.empresaWeb.hidden = true;
    }

    // Sinergias
    showSinergias(empresaId);
  }

  function showSinergias(empresaId) {
    els.sinergiasCard.hidden = false;
    const sinergias = BUS.emparejarSinergias(empresaId, 2);
    if (!sinergias.length) {
      els.sinergiasBody.innerHTML = '<p class="sinergias-empty">Aún no detectamos sinergias relevantes para esta empresa.</p>';
      MAPA.clearSynergyLines();
      MAPA.clearHighlight();
      return;
    }
    const html = sinergias.map(function (s) {
      const scoreClass = s._score >= 70 ? "high" : (s._score >= 50 ? "med" : "");
      return '' +
        '<article class="synergy-card" data-empresa-id="' + s.id + '">' +
          '<div class="synergy-card-head">' +
            '<span class="dot" style="width:10px;height:10px;border-radius:50%;background:' + s.color + ';display:inline-block"></span>' +
            '<span>' + escapeHtml(s.nombre) + '</span>' +
            '<span class="synergy-card-score ' + scoreClass + '">' + s._score + '%</span>' +
          '</div>' +
          '<p class="synergy-card-reason">' + escapeHtml(s._razon) + '</p>' +
        '</article>';
    }).join("");
    els.sinergiasBody.innerHTML = html;

    // Click → mostrar esa empresa
    $$("[data-empresa-id]", els.sinergiasBody).forEach(function (card) {
      card.addEventListener("click", function () {
        const id = card.getAttribute("data-empresa-id");
        showEmpresa(id);
      });
    });

    // Dibujar líneas de sinergia desde la empresa origen a las emparejadas
    const origen = DATA.getEmpresaById(empresaId);
    if (origen) {
      const pairs = [];
      sinergias.forEach(function (s) {
        if (origen.zonas.length && s.zonas.length) {
          pairs.push({ from: origen.zonas[0], to: s.zonas[0] });
        }
      });
      MAPA.drawSynergyLines(pairs);
    }
  }

  function showSinergiasForZona(zoneId) {
    if (ZONAS_SIN_SINERGIAS.indexOf(zoneId) !== -1) {
      els.sinergiasCard.hidden = true;
      MAPA.clearSynergyLines();
      MAPA.clearHighlight();
      return;
    }
    const empresas = DATA.getEmpresasByZona(zoneId);
    if (!empresas.length) {
      els.sinergiasCard.hidden = true;
      MAPA.clearSynergyLines();
      MAPA.clearHighlight();
      return;
    }
    els.sinergiasCard.hidden = false;
    // Mostrar mini-sinergia entre las de la zona
    if (empresas.length === 1) {
      showSinergias(empresas[0].id);
      return;
    }
    const html = empresas.slice(0, 3).map(function (e) {
      return '<article class="synergy-card" data-empresa-id="' + e.id + '">' +
        '<div class="synergy-card-head">' +
          '<span class="dot" style="width:10px;height:10px;border-radius:50%;background:' + e.color + ';display:inline-block"></span>' +
          '<span>' + escapeHtml(e.nombre) + '</span>' +
          '<span class="synergy-card-score">en zona</span>' +
        '</div>' +
        '<p class="synergy-card-reason">' + escapeHtml(e.sector) + ' · ' + escapeHtml((e.tech || []).slice(0, 2).join(", ")) + '</p>' +
      '</article>';
    }).join("");
    els.sinergiasBody.innerHTML = html;
    $$("[data-empresa-id]", els.sinergiasBody).forEach(function (card) {
      card.addEventListener("click", function () {
        const id = card.getAttribute("data-empresa-id");
        showEmpresa(id);
      });
    });
    MAPA.clearSynergyLines();
  }

  function resetSelection() {
    currentEmpresaId = null;
    MAPA.clearHighlight();
    MAPA.setActive(null);
    MAPA.clearSynergyLines();
    els.empresaEmpty.hidden = false;
    els.empresaContent.hidden = true;
    els.sinergiasCard.hidden = false;
    els.sinergiasBody.innerHTML = '<p class="sinergias-empty">Selecciona una empresa para ver sus sinergias recomendadas.</p>';
  }

  function showTooltip(id, ev) {
    if (MAPA.showTooltip) MAPA.showTooltip(id, ev);
  }
  function hideTooltip() {
    if (MAPA.hideTooltip) MAPA.hideTooltip();
  }

  /* ---------- BÚSQUEDA ---------- */
  function bindSearch() {
    if (!els.searchInput) return;
    let activeIdx = -1;
    let currentResults = [];

    els.searchInput.addEventListener("input", function (e) {
      const q = e.target.value.trim();
      if (q.length < 2) {
        els.searchSuggestions.hidden = true;
        currentResults = [];
        return;
      }
      currentResults = BUS.buscar(q, 6);
      renderSuggestions(currentResults);
    });

    els.searchInput.addEventListener("keydown", function (e) {
      const items = $$("li", els.searchSuggestions);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIdx = Math.min(items.length - 1, activeIdx + 1);
        updateActive();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIdx = Math.max(0, activeIdx - 1);
        updateActive();
      } else if (e.key === "Enter") {
        e.preventDefault();
        const pick = activeIdx >= 0 ? currentResults[activeIdx] : currentResults[0];
        if (pick) {
          chooseResult(pick);
        }
      } else if (e.key === "Escape") {
        els.searchSuggestions.hidden = true;
        els.searchInput.blur();
      }
    });

    document.addEventListener("click", function (e) {
      if (!els.searchSuggestions.contains(e.target) && e.target !== els.searchInput) {
        els.searchSuggestions.hidden = true;
      }
    });

    function renderSuggestions(results) {
      if (!results.length) {
        els.searchSuggestions.innerHTML = '<li class="muted" style="cursor:default">Sin resultados · prueba con "audio", "videojuegos"…</li>';
        els.searchSuggestions.hidden = false;
        return;
      }
      els.searchSuggestions.innerHTML = results.map(function (r, i) {
        return '<li data-empresa-id="' + r.id + '" data-idx="' + i + '">' +
          '<span class="dot" style="width:8px;height:8px;border-radius:50%;background:' + r.color + ';display:inline-block;flex-shrink:0"></span>' +
          '<span><strong>' + escapeHtml(r.nombre) + '</strong><br><span class="muted-sm">' + escapeHtml(r.sector) + '</span></span>' +
          '<span class="sug-score">' + (r._score || "") + '</span>' +
        '</li>';
      }).join("");
      els.searchSuggestions.hidden = false;
      activeIdx = -1;
      $$("li", els.searchSuggestions).forEach(function (li) {
        li.addEventListener("click", function () {
          const id = li.getAttribute("data-empresa-id");
          const pick = currentResults.find(function (r) { return r.id === id; });
          if (pick) chooseResult(pick);
        });
      });
    }
    function updateActive() {
      const items = $$("li", els.searchSuggestions);
      items.forEach(function (li, i) { li.classList.toggle("active", i === activeIdx); });
      if (activeIdx >= 0 && items[activeIdx]) items[activeIdx].scrollIntoView({ block: "nearest" });
    }
    function chooseResult(empresa) {
      els.searchInput.value = "";
      els.searchSuggestions.hidden = true;
      showEmpresa(empresa.id);
      toast("🔎 " + empresa.nombre + " · " + empresa.sector, "info");
    }
  }

  /* ---------- UI BINDINGS ---------- */
  function bindUI() {
    if (els.empresaClose) {
      els.empresaClose.addEventListener("click", resetSelection);
    }
    if (els.btnVerSinergias) {
      els.btnVerSinergias.addEventListener("click", function (e) {
        e.preventDefault();
        if (currentEmpresaId) {
          showSinergias(currentEmpresaId);
          toast("🤖 Sinergias recalculadas con IA local", "info");
        } else {
          toast("👆 Selecciona una empresa primero", "warn");
        }
      });
    }
    if (els.menuToggle) {
      // Evita que un deslizamiento (swipe) horizontal abra el menú:
      // solo cuenta como click si el dedo barely se movió.
      let touchMoved = false;
      els.menuToggle.addEventListener("touchstart", function () {
        touchMoved = false;
      }, { passive: true });
      els.menuToggle.addEventListener("touchmove", function () {
        touchMoved = true;
      }, { passive: true });
      els.menuToggle.addEventListener("click", function (e) {
        if (touchMoved) {
          e.preventDefault();
          return;
        }
        const open = els.headerMenu.classList.toggle("is-open");
        els.menuToggle.classList.toggle("is-open");
        els.menuToggle.setAttribute("aria-expanded", open);
      });
      document.addEventListener("click", function (e) {
        if (!els.menuToggle.contains(e.target) && !els.headerMenu.contains(e.target)) {
          els.headerMenu.classList.remove("is-open");
          els.menuToggle.classList.remove("is-open");
          els.menuToggle.setAttribute("aria-expanded", "false");
        }
      });
    }
    if (els.themeToggle) {
      els.themeToggle.addEventListener("click", toggleTheme);
    }
  }

  /* ---------- TEMA ---------- */
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("mapapolo-theme", next);
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (els.themeIcon) {
      if (theme === "light") {
        els.themeIcon.innerHTML = '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>';
      } else {
        els.themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>';
      }
    }
  }
  function applyStoredTheme() {
    const t = localStorage.getItem("mapapolo-theme") || "dark";
    applyTheme(t);
  }

  /* ---------- STATS COUNTER ---------- */
  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    els.statNums.forEach(function (el) {
      const target = parseInt(el.getAttribute("data-target"), 10) || 0;
      const duration = 1200;
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- SHORTCUTS ---------- */
  function setupShortcuts() {
    document.addEventListener("keydown", function (e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "/") {
        e.preventDefault();
        if (els.searchInput) els.searchInput.focus();
      } else if (e.key === "Escape") {
        resetSelection();
      } else if (e.key === "t" || e.key === "T") {
        toggleTheme();
      }
    });
  }

  function hideHintAfterTimeout() {
    if (!els.mapHint) return;
    setTimeout(function () {
      els.mapHint.classList.add("hidden");
    }, 6500);
  }

  /* ---------- TOAST ---------- */
  function toast(msg, kind) {
    if (!els.toastContainer) return;
    const el = document.createElement("div");
    el.className = "toast " + (kind || "info");
    el.innerHTML = '<span class="toast-icon">·</span><span>' + escapeHtml(msg) + '</span>';
    els.toastContainer.appendChild(el);
    setTimeout(function () {
      el.style.animation = "toast-out .3s forwards";
      setTimeout(function () { el.remove(); }, 300);
    }, 2400);
  }

  /* ---------- UTILS ---------- */
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();
