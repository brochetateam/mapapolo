// ============================================================
// MAPAPOLO — Controlador Principal
// Orquesta mapa, buscador y panel de información
// ============================================================

const App = (() => {

  // Referencias DOM
  let searchInput;
  let searchResults;
  let infoDefault;
  let infoContent;
  let infoTitle;
  let infoDesc;
  let infoTags;
  let infoCompanies;
  let infoSynergy;
  let synergyList;

  // Inicializar
  function init() {
    // Obtener referencias DOM
    searchInput = document.getElementById("searchInput");
    searchResults = document.getElementById("searchResults");
    infoDefault = document.getElementById("infoDefault");
    infoContent = document.getElementById("infoContent");
    infoTitle = document.getElementById("infoTitle");
    infoDesc = document.getElementById("infoDesc");
    infoTags = document.getElementById("infoTags");
    infoCompanies = document.getElementById("infoCompanies");
    infoSynergy = document.getElementById("infoSynergy");
    synergyList = document.getElementById("synergyList");

    // Inicializar mapa
    Mapa.init();

    // Configurar búsqueda
    setupSearch();

    // Configurar filtros
    setupFilters();

    // Escuchar selección de zona
    window.addEventListener("zonaSeleccionada", (e) => {
      mostrarInfoZona(e.detail.spaceId);
    });

    // Renderizar sinergias en sidebar
    renderizarSinergiasSidebar();

    // Toggle tema oscuro
    setupThemeToggle();

    console.log("MapaPolo inicializado correctamente");
  }

  // ============================================================
  // BÚSQUEDA
  // ============================================================

  function setupSearch() {
    if (!searchInput) return;

    let debounceTimer;

    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const query = e.target.value.trim();
        if (query.length < 2) {
          ocultarResultadosBusqueda();
          Mapa.limpiarResaltado();
          return;
        }
        ejecutarBusqueda(query);
      }, 200);
    });

    searchInput.addEventListener("focus", () => {
      if (searchInput.value.trim().length >= 2) {
        ejecutarBusqueda(searchInput.value.trim());
      }
    });

    // Cerrar resultados al hacer clic fuera
    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        ocultarResultadosBusqueda();
      }
    });

    // Atajo de teclado: Escape para limpiar
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        ocultarResultadosBusqueda();
        Mapa.limpiarResaltado();
      }
    });
  }

  function ejecutarBusqueda(query) {
    const resultados = Buscador.buscar(query);

    if (resultados.length === 0) {
      mostrarSinResultados(query);
      return;
    }

    mostrarResultadosBusqueda(resultados);

    // Resaltar zonas en el mapa
    const spaceIds = resultados
      .map(r => r.tipo === "empresa" ? r.item.zona : r.id)
      .filter(Boolean);
    const uniqueIds = [...new Set(spaceIds)];
    Mapa.resaltarZonas(uniqueIds);

    // Si hay un resultado muy relevante (score > 70), seleccionarlo
    if (resultados.length > 0 && resultados[0].score > 70) {
      const primerResultado = resultados[0];
      if (primerResultado.tipo === "empresa") {
        Mapa.navegarAEmpresa(primerResultado.item.id);
      } else {
        Mapa.seleccionarZona(primerResultado.id, primerResultado.item.titulo);
      }
    }
  }

  function mostrarResultadosBusqueda(resultados) {
    searchResults.innerHTML = "";
    searchResults.classList.add("active");

    resultados.slice(0, 10).forEach(resultado => {
      const item = resultado.item;
      const esEmpresa = resultado.tipo === "empresa";

      const div = document.createElement("div");
      div.className = "search-result-item";

      const scoreClass = resultado.score >= 60 ? "alto" :
                         resultado.score >= 30 ? "medio" : "bajo";

      const iconBg = esEmpresa ? getSectorColor(item.sector) : "#e2e8f0";
      const iconText = esEmpresa ? item.sector.charAt(0) : "📍";

      div.innerHTML = `
        <div class="search-result-icon" style="background: ${iconBg}; color: white; font-weight: 700;">
          ${iconText}
        </div>
        <div class="search-result-info">
          <div class="search-result-name">${esEmpresa ? item.nombre : item.titulo}</div>
          <div class="search-result-meta">${esEmpresa ? `${item.sector} · ${item.planta === "baja" ? "Planta Baja" : "Planta Primera"}` : `Espacio · ${item.planta === "baja" ? "Planta Baja" : "Planta Primera"}`}</div>
        </div>
        <div class="search-result-score ${scoreClass}">${resultado.score}%</div>
      `;

      div.addEventListener("click", () => {
        if (esEmpresa) {
          Mapa.navegarAEmpresa(item.id);
        } else {
          const planta = item.planta === "primera" ? "primera" : "baja";
          if (Mapa.getPlantaActual() !== planta) {
            Mapa.cambiarPlanta(planta);
          }
          Mapa.seleccionarZona(resultado.id, item.titulo);
        }
        ocultarResultadosBusqueda();
      });

      searchResults.appendChild(div);
    });
  }

  function mostrarSinResultados(query) {
    searchResults.innerHTML = `
      <div class="search-result-item" style="justify-content: center; cursor: default;">
        <div class="search-result-info" style="text-align: center;">
          <div class="search-result-name" style="color: var(--texto-sec);">
            Sin resultados para "${query}"
          </div>
          <div class="search-result-meta">
            Prueba con: "videojuegos", "audio", "VR", "IA", "3D"...
          </div>
        </div>
      </div>
    `;
    searchResults.classList.add("active");
  }

  function ocultarResultadosBusqueda() {
    searchResults.classList.remove("active");
  }

  // ============================================================
  // PANEL DE INFORMACIÓN
  // ============================================================

  function mostrarInfoZona(spaceId) {
    const espacio = ESPACIOS[spaceId];
    if (!espacio) return;

    // Ocultar default, mostrar contenido
    infoDefault.style.display = "none";
    infoContent.classList.add("active");

    // Título y descripción
    infoTitle.textContent = espacio.titulo;
    infoDesc.textContent = espacio.descripcion;

    // Tags
    infoTags.innerHTML = `
      <span class="tag tag-planta ${espacio.planta === "primera" ? "primera" : ""}">
        ${espacio.planta === "baja" ? "Planta Baja" : "Planta Primera"}
      </span>
      <span class="tag tag-tipo">${formatTipo(espacio.tipo)}</span>
      ${espacio.capacidad ? `<span class="tag" style="background: var(--fondo); color: var(--texto-sec);">👥 ${espacio.capacidad}</span>` : ""}
    `;

    // Empresas
    renderizarEmpresas(spaceId);

    // Sinergias del espacio
    renderizarSinergiasEspacio(spaceId);
  }

  function renderizarEmpresas(spaceId) {
    const espacio = ESPACIOS[spaceId];
    if (!espacio) return;

    infoCompanies.innerHTML = "";

    if (espacio.empresas.length === 0) {
      infoCompanies.innerHTML = `
        <p class="no-companies">
          Espacio común sin empresas asignadas.
          ${espacio.equipamiento ? `<br><small>Equipamiento: ${espacio.equipamiento.join(" · ")}</small>` : ""}
        </p>
      `;
      return;
    }

    espacio.empresas.forEach(empresaId => {
      const empresa = EMPRESAS.find(e => e.id === empresaId);
      if (!empresa) return;

      const card = document.createElement("div");
      card.className = "company-card";

      const sectorClass = `sector-${empresa.sector.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`;

      card.innerHTML = `
        <div class="company-header">
          <span class="company-name">${empresa.nombre}</span>
          <span class="company-sector ${sectorClass}">${empresa.sector}</span>
        </div>
        <div class="company-techs">
          ${empresa.tecnologias.slice(0, 4).map(t => `<span class="tech-tag">${t}</span>`).join("")}
        </div>
        <a href="${empresa.web}" target="_blank" rel="noopener" class="company-web" onclick="event.stopPropagation()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
          Visitar web
        </a>
      `;

      // Click en la empresa para ver sinergias
      card.addEventListener("click", () => {
        mostrarSinergiasEmpresa(empresa);
      });

      infoCompanies.appendChild(card);
    });
  }

  function renderizarSinergiasEspacio(spaceId) {
    const espacio = ESPACIOS[spaceId];
    if (!espacio || !infoSynergy) return;

    infoSynergy.innerHTML = "";

    if (espacio.sinergias) {
      const div = document.createElement("div");
      div.className = "synergy-box";
      div.innerHTML = `
        <div class="synergy-header">
          <span class="synergy-icon">💡</span>
          <span class="synergy-title">Sinergia del espacio</span>
        </div>
        <p class="synergy-text">${espacio.sinergias}</p>
      `;
      infoSynergy.appendChild(div);
    }

    // Si hay empresas, mostrar sinergias entre ellas
    if (espacio.empresas.length >= 2) {
      const sinergiasInternas = calcularSinergiasInternas(espacio.empresas);
      if (sinergiasInternas.length > 0) {
        const div = document.createElement("div");
        div.className = "synergy-box";
        div.style.marginTop = "var(--gap-sm)";
        div.innerHTML = `
          <div class="synergy-header">
            <span class="synergy-icon">🔗</span>
            <span class="synergy-title">Conexiones internas</span>
          </div>
          <div class="synergy-connections">
            ${sinergiasInternas.map(s => `
              <div class="synergy-connection" onclick="App.navegarAEmpresa('${s.empresa.id}')">
                <div class="synergy-connection-icon" style="background: ${getSectorColor(s.empresa.sector)}; color: white;">
                  ${s.empresa.sector.charAt(0)}
                </div>
                <div class="synergy-connection-info">
                  <div class="synergy-connection-name">${s.empresa.nombre}</div>
                  <div class="synergy-connection-reason">${s.razon}</div>
                </div>
                <div class="synergy-connection-score">${s.score}%</div>
              </div>
            `).join("")}
          </div>
        `;
        infoSynergy.appendChild(div);
      }
    }
  }

  function mostrarSinergiasEmpresa(empresa) {
    if (!infoSynergy) return;

    const sinergias = Buscador.encontrarSinergias(empresa.id);

    infoSynergy.innerHTML = "";

    if (sinergias.length === 0) {
      infoSynergy.innerHTML = `
        <div class="synergy-box">
          <div class="synergy-header">
            <span class="synergy-icon">🤖</span>
            <span class="synergy-title">Sinergias IA</span>
          </div>
          <p class="synergy-text">No se encontraron sinergias directas para esta empresa en este momento.</p>
        </div>
      `;
      return;
    }

    const div = document.createElement("div");
    div.className = "synergy-box";
    div.innerHTML = `
      <div class="synergy-header">
        <span class="synergy-icon">🤖</span>
        <span class="synergy-title">Sinergias detectadas para ${empresa.nombre}</span>
      </div>
      <div class="synergy-connections">
        ${sinergias.map(s => `
          <div class="synergy-connection" onclick="App.navegarAEmpresa('${s.empresa.id}')">
            <div class="synergy-connection-icon" style="background: ${getSectorColor(s.empresa.sector)}; color: white;">
              ${s.empresa.sector.charAt(0)}
            </div>
            <div class="synergy-connection-info">
              <div class="synergy-connection-name">${s.empresa.nombre}</div>
              <div class="synergy-connection-reason">${s.razon}</div>
            </div>
            <div class="synergy-connection-score">${s.score}%</div>
          </div>
        `).join("")}
      </div>
    `;
    infoSynergy.appendChild(div);
  }

  function calcularSinergiasInternas(empresaIds) {
    const sinergias = [];
    for (let i = 0; i < empresaIds.length; i++) {
      for (let j = i + 1; j < empresaIds.length; j++) {
        const emp1 = EMPRESAS.find(e => e.id === empresaIds[i]);
        const emp2 = EMPRESAS.find(e => e.id === empresaIds[j]);
        if (!emp1 || !emp2) continue;

        const techsComunes = emp1.tecnologias.filter(t1 =>
          emp2.tecnologias.some(t2 => t1.toLowerCase() === t2.toLowerCase())
        );

        if (techsComunes.length > 0) {
          sinergias.push({
            empresa: emp2,
            razon: `Comparten: ${techsComunes.join(", ")}`,
            score: 60 + (techsComunes.length * 15)
          });
        }
      }
    }
    return sinergias.sort((a, b) => b.score - a.score);
  }

  // ============================================================
  // SIDEBAR — SINERGIAS
  // ============================================================

  function renderizarSinergiasSidebar() {
    if (!synergyList) return;

    synergyList.innerHTML = "";

    // Mostrar las mejores sinergias predefinidas
    const topSinergias = SINERGIAS_PREDEFINIDAS
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    topSinergias.forEach(s => {
      const emp1 = EMPRESAS.find(e => e.id === s.empresa1);
      const emp2 = EMPRESAS.find(e => e.id === s.empresa2);
      if (!emp1 || !emp2) return;

      const div = document.createElement("div");
      div.className = "synergy-item";
      div.innerHTML = `
        <span class="synergy-item-empresas">
          ${emp1.nombre} <span class="synergy-item-arrow">↔</span> ${emp2.nombre}
        </span>
        <span class="synergy-item-score">${s.score}%</span>
      `;
      div.addEventListener("click", () => {
        // Seleccionar la primera empresa
        Mapa.navegarAEmpresa(s.empresa1);
      });
      synergyList.appendChild(div);
    });
  }

  // ============================================================
  // FILTROS
  // ============================================================

  function setupFilters() {
    document.querySelectorAll(".filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        // Toggle active
        const wasActive = pill.classList.contains("active");
        document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));

        if (wasActive) {
          // Si ya estaba activo, desactivar y limpiar mapa
          Mapa.limpiarResaltado();
          Mapa.limpiarSeleccion();
          return;
        }

        pill.classList.add("active");
        const categoria = pill.dataset.category;

        if (categoria) {
          const resultados = Buscador.buscarPorCategoria(categoria);
          const spaceIds = resultados.map(r => r.tipo === "empresa" ? r.item.zona : r.id).filter(Boolean);
          Mapa.resaltarZonas([...new Set(spaceIds)]);

          // Cambiar a la planta correcta si es necesario
          if (resultados.length > 0) {
            const primeraEmpresa = resultados.find(r => r.tipo === "empresa");
            if (primeraEmpresa && primeraEmpresa.item.planta !== Mapa.getPlantaActual()) {
              Mapa.cambiarPlanta(primeraEmpresa.item.planta);
            }
          }
        }
      });
    });
  }

  // ============================================================
  // TEMA OSCURO
  // ============================================================

  function setupThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    // Cargar tema guardado
    const savedTheme = localStorage.getItem("mapapolo-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);

    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("mapapolo-theme", next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    toggle.innerHTML = theme === "dark"
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
  }

  // ============================================================
  // UTILIDADES
  // ============================================================

  function getSectorColor(sector) {
    const colors = {
      "Videojuegos": "#6366f1",
      "Videojuegos AAA": "#6366f1",
      "Educación VR": "#8b5cf6",
      "Realidad Mixta": "#8b5cf6",
      "Simulación": "#059669",
      "Audio / Sound Design": "#14b8a6",
      "Audio Profesional": "#14b8a6",
      "Inteligencia Artificial": "#f59e0b",
      "3D / Arte Digital": "#ea580c",
      "Animación": "#ec4899",
      "Arte Digital": "#db2777",
      "Producción Audiovisual": "#0284c7",
      "Cine / Film Commission": "#ef4444",
      "Marketing Digital": "#0ea5e9",
      "Ciberseguridad": "#ca8a04",
      "Narrativa Digital": "#a16207",
      "Edición Digital": "#d97706",
      "Fintech / Deportes": "#0d9488",
      "Industria 4.0": "#475569",
      "Artes Escénicas": "#dc2626"
    };
    return colors[sector] || "#64748b";
  }

  function formatTipo(tipo) {
    const tipos = {
      "zona-comun": "Zona Común",
      "aula": "Aula",
      "oficina": "Oficina",
      "coworking": "Coworking",
      "laboratorio": "Laboratorio"
    };
    return tipos[tipo] || tipo;
  }

  // Navegar a empresa desde fuera
  function navegarAEmpresa(empresaId) {
    Mapa.navegarAEmpresa(empresaId);
  }

  // API pública
  return {
    init,
    navegarAEmpresa
  };

})();

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", App.init);
