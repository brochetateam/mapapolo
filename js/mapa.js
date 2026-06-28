const Mapa = (() => {
  let plantaActual = 'baja';
  let listenersActivos = false;

  const COLORES_ZONA = {
    comun: { fill: '#e8f0fe', stroke: '#005cb9', hover: '#005cb915', text: '#005cb9' },
    formacion: { fill: '#fff3e0', stroke: '#f39200', hover: '#f3920015', text: '#c97d00' },
    institucional: { fill: '#e0f7f3', stroke: '#00a88f', hover: '#00a88f15', text: '#007a66' },
    oficina: { fill: '#f0f0ff', stroke: '#6366f1', hover: '#6366f115', text: '#4f46e5' },
    coworking: { fill: '#fdf2f8', stroke: '#ec4899', hover: '#ec489915', text: '#be185d' },
    laboratorio: { fill: '#f3e8ff', stroke: '#a855f7', hover: '#a855f715', text: '#7e22ce' }
  };

  const COLORES_ZONA_DARK = {
    comun: { fill: '#001a33', stroke: '#3b82f6', hover: '#3b82f620', text: '#60a5fa' },
    formacion: { fill: '#1f1400', stroke: '#f59e0b', hover: '#f59e0b20', text: '#fbbf24' },
    institucional: { fill: '#001a14', stroke: '#14b8a6', hover: '#14b8a620', text: '#2dd4bf' },
    oficina: { fill: '#14142b', stroke: '#818cf8', hover: '#818cf820', text: '#a5b4fc' },
    coworking: { fill: '#2d0a1a', stroke: '#f472b6', hover: '#f472b620', text: '#f9a8d4' },
    laboratorio: { fill: '#1a0a2e', stroke: '#c084fc', hover: '#c084fc20', text: '#d8b4fe' }
  };

  function getColores(tipo) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const paleta = isDark ? COLORES_ZONA_DARK : COLORES_ZONA;
    return paleta[tipo] || paleta.comun;
  }

  function init() {
    if (listenersActivos) return;
    listenersActivos = true;

    document.querySelectorAll('.zone').forEach(el => {
      el.addEventListener('click', function () {
        const spaceId = this.dataset.space;
        if (spaceId) App.seleccionarEspacio(spaceId);
      });
    });

    document.querySelectorAll('.floor-tab').forEach(tab => {
      tab.addEventListener('click', function () {
        const planta = this.dataset.floor;
        if (planta) cambiarPlanta(planta);
      });
    });

    const observer = new MutationObserver(() => {
      if (plantaActual === 'baja') aplicarColoresPlanta('baja');
      else aplicarColoresPlanta('primera');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    aplicarColoresPlanta('baja');
  }

  function cambiarPlanta(planta) {
    plantaActual = planta;
    document.querySelectorAll('.floor-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.floor === planta);
    });
    document.querySelectorAll('.map-floor').forEach(el => {
      el.classList.toggle('active', el.dataset.floor === planta);
    });
    aplicarColoresPlanta(planta);
    App.onCambioPlanta(planta);
  }

  function aplicarColoresPlanta(planta) {
    document.querySelectorAll(`.map-floor[data-floor="${planta}"] .zone`).forEach(el => {
      const spaceId = el.dataset.space;
      if (!spaceId) return;
      const espacio = MAPAPOLO.espacios[spaceId];
      if (!espacio) return;
      const colores = getColores(espacio.tipo);
      const rect = el.tagName === 'rect' ? el : el.querySelector('rect, path');
      if (rect) {
        rect.setAttribute('fill', colores.fill);
        rect.setAttribute('stroke', colores.stroke);
      }
      const label = el.querySelector('.zone-label');
      if (label) label.setAttribute('fill', colores.text);
    });
  }

  function highlightZona(spaceId) {
    document.querySelectorAll('.zone').forEach(el => el.classList.remove('highlighted'));
    if (!spaceId) return;
    const el = document.querySelector(`.zone[data-space="${spaceId}"]`);
    if (el) {
      el.classList.add('highlighted');
      const rect = el.getBoundingClientRect();
      const container = document.querySelector('.map-container');
      if (container && rect) {
        const containerRect = container.getBoundingClientRect();
        if (rect.top < containerRect.top || rect.bottom > containerRect.bottom ||
            rect.left < containerRect.left || rect.right > containerRect.right) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }

  function resetHighlights() {
    document.querySelectorAll('.zone').forEach(el => el.classList.remove('highlighted', 'active'));
  }

  return {
    init,
    cambiarPlanta,
    highlightZona,
    resetHighlights,
    aplicarColoresPlanta,
    getPlantaActual: () => plantaActual
  };
})();
