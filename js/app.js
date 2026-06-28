const App = (() => {
  let espacioSeleccionado = null;
  let empresaSeleccionada = null;
  let resultadosBusqueda = [];

  function init() {
    Mapa.init();
    initSearch();
    initTheme();
    initFilters();
    initFeaturedCompanies();
    cargarEmpresaDestacada();
  }

  function initTheme() {
    const btn = document.getElementById('themeToggle');
    const saved = localStorage.getItem('mapapolo-theme');
    if (saved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      btn.textContent = '☀️';
    }
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('mapapolo-theme', 'light');
        btn.textContent = '🌙';
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('mapapolo-theme', 'dark');
        btn.textContent = '☀️';
      }
      setTimeout(() => Mapa.aplicarColoresPlanta(Mapa.getPlantaActual()), 50);
    });
  }

  function initSearch() {
    const input = document.getElementById('searchInput');
    const results = document.getElementById('searchResults');
    let timeout;

    input.addEventListener('input', () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const q = input.value.trim();
        if (q.length < 2) {
          results.classList.remove('visible');
          resultadosBusqueda = [];
          Mapa.resetHighlights();
          return;
        }
        const res = Buscador.buscarTodo(q);
        resultadosBusqueda = res;
        renderSearchResults(res);
      }, 200);
    });

    input.addEventListener('focus', () => {
      if (resultadosBusqueda.length > 0 || input.value.trim().length >= 2) {
        results.classList.add('visible');
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-center')) {
        results.classList.remove('visible');
      }
    });
  }

  function renderSearchResults(res) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    if (res.empresas.length === 0 && res.espacios.length === 0) {
      container.innerHTML = '<div class="search-result-item" style="color:var(--text3);font-size:13px;justify-content:center;padding:16px;">Sin resultados</div>';
      container.classList.add('visible');
      return;
    }

    const MAX = 6;
    let count = 0;

    res.empresas.forEach(r => {
      if (count >= MAX) return;
      const e = r.empresa;
      const espacio = Object.values(MAPAPOLO.espacios).find(esp => (esp.empresas || []).includes(e.id));
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div class="sr-icon" style="background:${e.color}">${e.nombre.charAt(0)}</div>
        <div class="sr-info">
          <div class="sr-name">${e.nombre}</div>
          <div class="sr-detail">${e.sector} · ${espacio ? espacio.nombre : ''} (Planta ${e.planta === 'baja' ? 'Baja' : 'Primera'})</div>
        </div>
        <div class="sr-score">${Math.round(r.score * 10)}%</div>
      `;
      item.addEventListener('click', () => seleccionarEmpresa(e.id));
      container.appendChild(item);
      count++;
    });

    res.espacios.forEach(r => {
      if (count >= MAX) return;
      const e = r.espacio;
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div class="sr-icon" style="background:var(--polo-blue)">${e.nombre.charAt(0)}</div>
        <div class="sr-info">
          <div class="sr-name">${e.nombre}</div>
          <div class="sr-detail">${e.tipo} · Planta ${e.planta === 'baja' ? 'Baja' : 'Primera'}</div>
        </div>
        <div class="sr-score">${Math.round(r.score * 8)}%</div>
      `;
      item.addEventListener('click', () => seleccionarEspacio(e.id));
      container.appendChild(item);
      count++;
    });

    container.classList.add('visible');
  }

  function seleccionarEmpresa(empresaId) {
    const empresa = MAPAPOLO.empresas.find(e => e.id === empresaId);
    if (!empresa) return;
    empresaSeleccionada = empresaId;
    document.getElementById('searchResults').classList.remove('visible');

    const espacio = Object.values(MAPAPOLO.espacios).find(esp => (esp.empresas || []).includes(empresaId));
    if (espacio) {
      if (espacio.planta !== Mapa.getPlantaActual()) {
        Mapa.cambiarPlanta(espacio.planta);
      }
      seleccionarEspacio(espacio.id, empresaId);
    }
  }

  function seleccionarEspacio(spaceId, focusEmpresaId) {
    const espacio = MAPAPOLO.espacios[spaceId];
    if (!espacio) return;

    espacioSeleccionado = spaceId;
    if (!focusEmpresaId) empresaSeleccionada = null;

    if (espacio.planta !== Mapa.getPlantaActual()) {
      Mapa.cambiarPlanta(espacio.planta);
    }

    Mapa.highlightZona(spaceId);
    renderInfoPanel(spaceId, focusEmpresaId);
  }

  function renderInfoPanel(spaceId, focusEmpresaId) {
    const espacio = MAPAPOLO.espacios[spaceId];
    if (!espacio) return;

    const empresas = MAPAPOLO.getEmpresasEnEspacio(spaceId);
    const empFocus = focusEmpresaId ? MAPAPOLO.empresas.find(e => e.id === focusEmpresaId) : null;

    document.getElementById('infoDefault').style.display = 'none';
    const content = document.getElementById('infoContent');
    content.classList.add('visible');

    const tagCls = espacio.planta === 'primera' ? 'orange' : '';
    document.getElementById('infoTag').textContent = `Planta ${espacio.planta === 'baja' ? 'Baja' : 'Primera'} · ${espacio.tipo}`;
    document.getElementById('infoTag').className = `info-tag ${tagCls}`;
    document.getElementById('infoTitle').textContent = espacio.nombre;
    document.getElementById('infoDesc').textContent = espacio.desc;

    const list = document.getElementById('companyList');
    list.innerHTML = '';
    if (empresas.length === 0) {
      list.innerHTML = '<div class="company-item empty">No hay empresas asignadas actualmente</div>';
    } else {
      empresas.forEach(e => {
        const div = document.createElement('div');
        div.className = `company-item${focusEmpresaId === e.id ? '' : ''}`;
        div.dataset.empresaId = e.id;
        const isFocus = focusEmpresaId === e.id;
        if (isFocus) div.style.borderColor = 'var(--polo-blue)';
        div.innerHTML = `
          <div class="company-item-top">
            <span class="company-name">${e.nombre}</span>
            <span class="company-sector">${e.sector}</span>
          </div>
          <div class="company-tech">${e.tech.map(t => `<span>${t}</span>`).join('')}</div>
        `;
        div.addEventListener('click', (ev) => {
          ev.stopPropagation();
          mostrarSinergias(e.id);
        });
        list.appendChild(div);
      });
    }

    if (focusEmpresaId) {
      mostrarSinergias(focusEmpresaId);
    } else if (empresas.length > 0) {
      mostrarSinergias(empresas[0].id);
    } else {
      mostrarSinergias(null);
    }

    renderRuta(espacio);
  }

  function mostrarSinergias(empresaId) {
    const container = document.getElementById('synergyContainer');
    container.innerHTML = '';

    if (empresaId) {
      empresaSeleccionada = empresaId;
      const empresa = MAPAPOLO.empresas.find(e => e.id === empresaId);
      if (!empresa) return;

      const sinergias = MAPAPOLO.getSinergias(empresaId);

      if (sinergias.length === 0) {
        container.innerHTML = `
          <div class="synergy-card">
            <div class="synergy-header">
              <span class="icon">💡</span>
              <h4>Sinergias potenciales</h4>
            </div>
            <div class="synergy-text">No hay sinergias específicas registradas para ${empresa.nombre}. ¡Sé el primero en conectar!</div>
          </div>`;
        return;
      }

      let html = `
        <div class="synergy-card">
          <div class="synergy-header">
            <span class="icon">✨</span>
            <h4>Conexiones inteligentes · ${empresa.nombre}</h4>
          </div>
          <div class="synergy-text">${sinergias.length} sinergia(s) detectada(s) con empresas del Polo:</div>`;

      sinergias.forEach(s => {
        const empresaRelacion = s.desde || s.hacia;
        if (!empresaRelacion) return;
        const espacioRel = Object.values(MAPAPOLO.espacios).find(esp => (esp.empresas || []).includes(empresaRelacion.id));
        html += `
          <div class="synergy-connection" data-empresa="${empresaRelacion.id}" style="cursor:pointer;">
            <span class="s-empresa">${empresaRelacion.nombre}</span>
            <span class="arrow">→</span>
            <span style="color:var(--text2);font-size:11px;flex:1;">${s.motivo}</span>
            ${espacioRel ? `<span style="font-size:10px;color:var(--text3);white-space:nowrap;">📍 ${espacioRel.nombre}</span>` : ''}
          </div>`;
      });

      html += '</div>';
      container.innerHTML = html;

      container.querySelectorAll('.synergy-connection').forEach(el => {
        el.addEventListener('click', function () {
          const eId = this.dataset.empresa;
          if (eId) seleccionarEmpresa(eId);
        });
      });
    } else {
      container.innerHTML = `
        <div class="synergy-card">
          <div class="synergy-header">
            <span class="icon">💡</span>
            <h4>Sinergias disponibles</h4>
          </div>
          <div class="synergy-text">Selecciona una empresa para explorar sus conexiones y sinergias con otras empresas del Polo.</div>
        </div>`;
    }
  }

  function renderRuta(espacio) {
    const container = document.getElementById('rutaContainer');
    container.innerHTML = '';

    if (!espacio) return;

    const esPlantaBaja = espacio.planta === 'baja';
    const desde = esPlantaBaja ? 'Entrada Principal' : 'Recepción (Pl. Baja)';
    const hasta = espacio.nombre;

    let instrucciones = [];
    if (!esPlantaBaja) {
      instrucciones.push('Entra por la Recepción Principal (Planta Baja)');
      instrucciones.push('Sube por las escaleras o ascensor a la Planta Primera');
    } else {
      instrucciones.push('Entra por la Recepción Principal');
    }
    instrucciones.push(`Dirígete a ${espacio.nombre}`);
    instrucciones.push(`Ubicación: ${espacio.tipo} en Planta ${espacio.planta === 'baja' ? 'Baja' : 'Primera'}`);

    container.innerHTML = `
      <div class="ruta-info">
        <span class="icon">📍</span>
        <div>
          <strong>Cómo llegar:</strong> ${desde} → ${hasta}
          <br>
          ${instrucciones.map((inst, i) => `${i + 1}. ${inst}`).join(' · ')}
        </div>
      </div>`;
  }

  function onCambioPlanta(planta) {
    if (espacioSeleccionado) {
      const esp = MAPAPOLO.espacios[espacioSeleccionado];
      if (esp && esp.planta !== planta) {
        espacioSeleccionado = null;
        empresaSeleccionada = null;
        resetPanel();
      }
    }
  }

  function resetPanel() {
    document.getElementById('infoDefault').style.display = 'flex';
    document.getElementById('infoContent').classList.remove('visible');
    document.getElementById('synergyContainer').innerHTML = '';
    document.getElementById('rutaContainer').innerHTML = '';
  }

  function initFilters() {
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', function () {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const filter = this.dataset.filter;
        aplicarFiltro(filter);
      });
    });
  }

  function aplicarFiltro(filter) {
    document.querySelectorAll('.zone').forEach(z => z.style.display = '');
    if (filter === 'all') return;

    const sectorMap = {
      videojuegos: ['Videojuegos'],
      audiovisual: ['Producción Audiovisual', 'Audiovisual'],
      xr: ['XR / Metaverso', 'Realidad Mixta', 'Simulación'],
      audio: ['Audio / Sound Design', 'Audio Profesional'],
      ia: ['Inteligencia Artificial'],
      '3d': ['Arte 3D', 'Animación', 'Arte Digital']
    };
    const sectores = sectorMap[filter] || [];

    const empresasFiltro = MAPAPOLO.empresas.filter(e => sectores.includes(e.sector)).map(e => e.id);
    const espaciosFiltro = Object.entries(MAPAPOLO.espacios)
      .filter(([_, esp]) => (esp.empresas || []).some(id => empresasFiltro.includes(id)))
      .map(([id]) => id);

    document.querySelectorAll('.zone').forEach(z => {
      const spaceId = z.dataset.space;
      if (spaceId && !espaciosFiltro.includes(spaceId)) {
        z.style.display = 'none';
      }
    });
  }

  function initFeaturedCompanies() {
    const container = document.getElementById('featuredList');
    const destacadas = ['krilloud', 'cienciavr', 'forgottenempires', 'heqate', 'inone', 'owogame'];
    container.innerHTML = destacadas.map(id => {
      const e = MAPAPOLO.empresas.find(emp => emp.id === id);
      return e ? `<div class="featured-item" data-empresa="${e.id}" style="cursor:pointer">
        <span class="dot" style="background:${e.color}"></span>
        <strong>${e.nombre}</strong>
        <span style="color:var(--text3)">· ${e.sector}</span>
      </div>` : '';
    }).join('');
    container.querySelectorAll('.featured-item').forEach(el => {
      el.addEventListener('click', function () {
        const id = this.dataset.empresa;
        if (id) seleccionarEmpresa(id);
      });
    });
  }

  function cargarEmpresaDestacada() {
    setTimeout(() => {
      const id = 'krilloud';
      const e = MAPAPOLO.empresas.find(emp => emp.id === id);
      if (e) {
        const espacio = Object.values(MAPAPOLO.espacios).find(esp => (esp.empresas || []).includes(id));
        if (espacio) {
          if (espacio.planta !== Mapa.getPlantaActual()) {
            Mapa.cambiarPlanta(espacio.planta);
          }
          seleccionarEspacio(espacio.id, id);
        }
      }
    }, 500);
  }

  return { init, seleccionarEspacio, onCambioPlanta };
})();

document.addEventListener('DOMContentLoaded', App.init);
