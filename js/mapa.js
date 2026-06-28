/* =============================================
   MAPAPOLO 2026 - Motor del Mapa Interactivo
   Genera los SVG vectorizados y gestiona
   las interacciones con las zonas
   ============================================= */

const Mapa = (() => {
    let plantaActiva = 'baja';
    let zoom = 1;
    let panX = 0;
    let panY = 0;
    let arrastrando = false;
    let inicioX = 0;
    let inicioY = 0;
    let inicioPanX = 0;
    let inicioPanY = 0;
    let sinergiasVisibles = false;
    let filtroPlantaActivo = 'todas';

    // Colores por tipo de espacio
    const COLORES = {
        comun: { fill: '#e3eaf5', stroke: '#94a8c5', text: '#1a1a2e' },
        aula: { fill: '#e8f0ff', stroke: '#5b8def', text: '#1a1a2e' },
        institucion: { fill: '#fff4e0', stroke: '#f39200', text: '#1a1a2e' },
        oficinas: { fill: '#e0f5ee', stroke: '#00a88f', text: '#1a1a2e' },
        coworking: { fill: '#e8e3ff', stroke: '#9b6dff', text: '#1a1a2e' },
        laboratorio: { fill: '#ffe0e9', stroke: '#e94e77', text: '#1a1a2e' },
    };

    // Colores modo oscuro
    const COLORES_OSCURO = {
        comun: { fill: '#2c3e50', stroke: '#7f9bc0', text: '#e7ebf3' },
        aula: { fill: '#1e3a5f', stroke: '#5b8def', text: '#e7ebf3' },
        institucion: { fill: '#4a3818', stroke: '#f39200', text: '#e7ebf3' },
        oficinas: { fill: '#1a3d34', stroke: '#00a88f', text: '#e7ebf3' },
        coworking: { fill: '#2e2655', stroke: '#9b6dff', text: '#e7ebf3' },
        laboratorio: { fill: '#4a1d2e', stroke: '#e94e77', text: '#e7ebf3' },
    };

    const obtenerColores = () => {
        return document.body.classList.contains('modo-oscuro') ? COLORES_OSCURO : COLORES;
    };

    // ==================== DEFINICIÓN DE ZONAS EN SVG ====================
    // ViewBox: 1000 x 700 (unidades lógicas)
    // Cada zona tiene coordenadas x, y, width, height
    // Para planta baja seguimos el layout de los planos reales

    const ZONAS_BAJA = [
        { id: 'recepcion', x: 200, y: 60, w: 130, h: 70, label: 'Recepción', sublabel: 'Hall principal' },
        { id: 'patio-1', x: 230, y: 170, w: 220, h: 130, label: 'Patio 1', sublabel: '' },
        { id: 'showroom', x: 90, y: 250, w: 100, h: 60, label: 'Showroom', sublabel: '' },
        { id: 'oficina-promalaga', x: 90, y: 320, w: 100, h: 50, label: 'Promálaga', sublabel: 'Oficina' },
        { id: 'aula-1', x: 500, y: 80, w: 80, h: 60, label: 'Aula 1', sublabel: '' },
        { id: 'aula-2', x: 500, y: 150, w: 80, h: 60, label: 'Aula 2', sublabel: '' },
        { id: 'aula-3', x: 500, y: 220, w: 80, h: 60, label: 'Aula 3', sublabel: '' },
        { id: 'aula-4', x: 500, y: 290, w: 80, h: 60, label: 'Aula 4', sublabel: 'UMA' },
        { id: 'aula-5', x: 500, y: 360, w: 80, h: 60, label: 'Aula 5', sublabel: '' },
        { id: 'aula-6', x: 500, y: 430, w: 130, h: 70, label: 'Aula 6', sublabel: 'Aula magna' },
        { id: 'modulo-1', x: 700, y: 80, w: 100, h: 100, label: 'Módulo 1', sublabel: 'Empresas' },
        { id: 'modulo-2', x: 810, y: 80, w: 100, h: 100, label: 'Módulo 2', sublabel: 'Empresas' },
        { id: 'uma', x: 200, y: 320, w: 200, h: 60, label: 'UMA', sublabel: 'Universidad' },
        { id: 'coworking-1', x: 700, y: 500, w: 100, h: 80, label: 'Coworking 1', sublabel: 'CW1' },
        { id: 'coworking-2', x: 500, y: 540, w: 130, h: 60, label: 'Coworking 2', sublabel: 'CW2' },
        { id: 'sala-reuniones-1', x: 200, y: 540, w: 60, h: 50, label: 'Sala 4.1', sublabel: '' },
        { id: 'sala-reuniones-2', x: 270, y: 540, w: 60, h: 50, label: 'Sala 4.2', sublabel: '' },
        { id: 'agora', x: 600, y: 200, w: 80, h: 80, label: 'Ágora', sublabel: 'Eventos' },
        { id: 'agora-2', x: 800, y: 500, w: 100, h: 80, label: 'Ágora 2', sublabel: '' },
    ];

    const ZONAS_PRIMERA = [
        { id: 'go2work', x: 100, y: 100, w: 350, h: 200, label: 'Go2Work', sublabel: 'Coworking premium' },
        { id: 'despacho-3', x: 100, y: 320, w: 160, h: 120, label: 'Despacho 3', sublabel: '' },
        { id: 'despacho-4', x: 280, y: 320, w: 170, h: 120, label: 'Despacho 4', sublabel: '' },
        { id: 'despacho-flex', x: 100, y: 460, w: 80, h: 100, label: 'Flex', sublabel: 'Despacho flexible' },
        { id: 'despacho-1', x: 200, y: 460, w: 70, h: 100, label: 'Despacho 1', sublabel: '' },
        { id: 'despacho-2', x: 290, y: 460, w: 70, h: 100, label: 'Despacho 2', sublabel: '' },
        { id: 'lab-vr', x: 510, y: 100, w: 200, h: 200, label: 'Lab. VR / XR', sublabel: 'Realidad virtual' },
        { id: 'lab-audio', x: 730, y: 100, w: 200, h: 200, label: 'Lab. Audio', sublabel: 'Grabación' },
        { id: 'lab-3d', x: 510, y: 320, w: 200, h: 240, label: 'Lab. 3D', sublabel: 'Impresión' },
        { id: 'lab-video', x: 730, y: 320, w: 200, h: 120, label: 'Sala Audiovisual', sublabel: 'Producción' },
        { id: 'sala-proyeccion', x: 730, y: 460, w: 200, h: 100, label: 'Sala Proyección', sublabel: '50 pax' },
    ];

    // ==================== RENDERIZADO DE PLANTA ====================
    function renderPlanta(plantaId, zonas) {
        const colores = obtenerColores();
        const plantaDiv = document.getElementById(`planta-${plantaId}`);

        let svgContent = `<svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">`;

        // Fondo del edificio (suelo)
        svgContent += `<defs>
            <pattern id="grid-${plantaId}" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--color-borde)" stroke-width="0.3" opacity="0.5"/>
            </pattern>
            <linearGradient id="bgGrad-${plantaId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${document.body.classList.contains('modo-oscuro') ? '#1a1f2b' : '#f8f9fb'}"/>
                <stop offset="100%" stop-color="${document.body.classList.contains('modo-oscuro') ? '#161b22' : '#ebeef3'}"/>
            </linearGradient>
            <filter id="zonaShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.15"/>
            </filter>
        </defs>`;

        // Estructura del edificio (líneas de pared externas)
        svgContent += renderEstructura(plantaId);

        // Suelo con grid sutil
        svgContent += `<rect x="60" y="40" width="880" height="620" rx="12" fill="url(#bgGrad-${plantaId})"/>`;
        svgContent += `<rect x="60" y="40" width="880" height="620" rx="12" fill="url(#grid-${plantaId})"/>`;

        // Zonas
        zonas.forEach(zona => {
            const espacio = ESPACIOS[zona.id];
            if (!espacio) return;
            const color = colores[espacio.tipo] || colores.comun;
            const numEmpresas = EMPRESAS.filter(e => e.espacioId === zona.id).length;

            svgContent += `
                <g class="zona" data-zona-id="${zona.id}" tabindex="0" role="button" aria-label="${zona.label}">
                    <rect class="zona-rect"
                        x="${zona.x}" y="${zona.y}"
                        width="${zona.w}" height="${zona.h}"
                        rx="6"
                        fill="${color.fill}"
                        stroke="${color.stroke}"
                        stroke-width="1.5"
                        fill-opacity="0.6"
                        filter="url(#zonaShadow)"
                    />
                    <text class="zona-label" x="${zona.x + zona.w/2}" y="${zona.y + zona.h/2 - (zona.sublabel ? 6 : 0)}">
                        ${zona.label}
                    </text>
                    ${zona.sublabel ? `<text class="zona-sublabel" x="${zona.x + zona.w/2}" y="${zona.y + zona.h/2 + 10}">${zona.sublabel}</text>` : ''}
                    ${numEmpresas > 0 ? `
                        <circle class="zona-punto" cx="${zona.x + zona.w - 14}" cy="${zona.y + 14}" r="4.5" fill="${color.stroke}" />
                        <text x="${zona.x + zona.w - 14}" y="${zona.y + 14}" text-anchor="middle" dominant-baseline="central" font-size="8" font-weight="700" fill="white">${numEmpresas}</text>
                    ` : ''}
                </g>
            `;
        });

        // Indicador de entrada
        if (plantaId === 'baja') {
            svgContent += `
                <g class="entrada-indicador">
                    <circle cx="80" cy="95" r="8" fill="none" stroke="var(--color-acento)" stroke-width="2.5" stroke-dasharray="3 3">
                        <animate attributeName="r" values="8;14;8" dur="2s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="80" cy="95" r="3" fill="var(--color-acento)"/>
                    <text x="80" y="80" text-anchor="middle" font-size="10" font-weight="700" fill="var(--color-acento)">↳ ENTRADA</text>
                </g>
            `;
        }

        // Líneas de sinergia (overlay)
        svgContent += `<g id="lineas-sinergia-${plantaId}">`;
        if (plantaId === 'baja') {
            svgContent += renderLineasSinergia('baja', zonas, false);
        } else {
            svgContent += renderLineasSinergia('primera', zonas, false);
        }
        // Sinergias entre plantas
        if (plantaId === 'baja') {
            svgContent += renderLineasSinergiaCruzadas(zonas, false);
        } else {
            svgContent += renderLineasSinergiaCruzadas(zonas, true);
        }
        svgContent += `</g>`;

        svgContent += `</svg>`;

        plantaDiv.innerHTML = svgContent;

        // Añadir interactividad
        plantaDiv.querySelectorAll('.zona').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-zona-id');
                seleccionarZona(id);
            });
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const id = el.getAttribute('data-zona-id');
                    seleccionarZona(id);
                }
            });
        });
    }

    function renderEstructura(plantaId) {
        // Paredes externas del edificio
        let html = `<g class="estructura">`;

        if (plantaId === 'baja') {
            // Edificio principal
            html += `<rect x="60" y="40" width="880" height="620" rx="12" fill="none" stroke="var(--color-texto)" stroke-width="3"/>`;
            // Anexos laterales
            html += `<rect x="60" y="40" width="100" height="200" fill="none" stroke="var(--color-texto)" stroke-width="2" opacity="0.4"/>`;
            html += `<rect x="840" y="100" width="100" height="200" fill="none" stroke="var(--color-texto)" stroke-width="2" opacity="0.4"/>`;
        } else {
            // Planta primera
            html += `<rect x="60" y="40" width="880" height="620" rx="12" fill="none" stroke="var(--color-texto)" stroke-width="3"/>`;
        }

        html += `</g>`;
        return html;
    }

    function renderLineasSinergia(planta, zonas, cruzadas) {
        let html = '';
        const zonasMap = {};
        zonas.forEach(z => { zonasMap[z.id] = z; });

        // Generar sinergias predefinidas que están en esta planta
        SINERGIAS_PREDEFINIDAS.forEach((sinergia, idx) => {
            const [idA, idB] = sinergia.empresas;
            const empA = EMPRESAS.find(e => e.id === idA);
            const empB = EMPRESAS.find(e => e.id === idB);
            if (!empA || !empB) return;

            const zonaA = ESPACIOS[empA.espacioId];
            const zonaB = ESPACIOS[empB.espacioId];
            if (!zonaA || !zonaB) return;
            if (zonaA.planta !== planta || zonaB.planta !== planta) return;

            const zA = zonasMap[empA.espacioId];
            const zB = zonasMap[empB.espacioId];
            if (!zA || !zB) return;

            const cxA = zA.x + zA.w/2;
            const cyA = zA.y + zA.h/2;
            const cxB = zB.x + zB.w/2;
            const cyB = zB.y + zB.h/2;

            // Curva de Bézier
            const midX = (cxA + cxB) / 2;
            const midY = (cyA + cyB) / 2 - 20;

            html += `<path class="linea-sinergia" data-sinergia="${idA}-${idB}" d="M ${cxA} ${cyA} Q ${midX} ${midY}, ${cxB} ${cyB}"/>`;
        });

        return html;
    }

    function renderLineasSinergiaCruzadas(zonas, esPlantaPrimera) {
        let html = '';
        const zonasMap = {};
        zonas.forEach(z => { zonasMap[z.id] = z; });

        const plantaActual = esPlantaPrimera ? 'primera' : 'baja';
        const otraPlanta = esPlantaPrimera ? 'baja' : 'primera';

        // Sinergias cruzadas se indican con un punto de "ir a otra planta"
        SINERGIAS_PREDEFINIDAS.forEach(sinergia => {
            const [idA, idB] = sinergia.empresas;
            const empA = EMPRESAS.find(e => e.id === idA);
            const empB = EMPRESAS.find(e => e.id === idB);
            if (!empA || !empB) return;

            const zonaA = ESPACIOS[empA.espacioId];
            const zonaB = ESPACIOS[empB.espacioId];
            if (!zonaA || !zonaB) return;
            if (zonaA.planta === zonaB.planta) return; // Ya manejado arriba
            if (zonaA.planta !== plantaActual) return; // Solo las que tocan esta planta

            const zA = zonasMap[empA.espacioId];
            if (!zA) return;

            // Indicador: flecha hacia otra planta
            const cx = zA.x + zA.w/2;
            const cy = zA.y + zA.h/2;

            html += `<g class="indicador-cruzado" data-empresa-id="${idB}">
                <circle cx="${cx}" cy="${cy + 20}" r="3" fill="var(--color-sinergia)" opacity="0.7"/>
            </g>`;
        });

        return html;
    }

    // ==================== ESTADÍSTICAS ====================
    function actualizarEstadisticas() {
        document.getElementById('statEmpresas').textContent = EMPRESAS.length;
        document.getElementById('statEspacios').textContent = Object.keys(ESPACIOS).length;
        document.getElementById('statSinergias').textContent = SINERGIAS_PREDEFINIDAS.length;
        document.getElementById('statSectores').textContent = SECTORES.length;

        // Contadores por planta
        const empBaja = EMPRESAS.filter(e => ESPACIOS[e.espacioId]?.planta === 'baja').length;
        const empPrimera = EMPRESAS.filter(e => ESPACIOS[e.espacioId]?.planta === 'primera').length;
        document.getElementById('cntTodas').textContent = EMPRESAS.length;
        document.getElementById('cntBaja').textContent = empBaja;
        document.getElementById('cntPrimera').textContent = empPrimera;
    }

    // ==================== LEYENDA ====================
    function renderLeyenda() {
        const tipos = {
            comun: { label: 'Espacio común', color: '#94a8c5' },
            aula: { label: 'Aula de formación', color: '#5b8def' },
            institucion: { label: 'Institución', color: '#f39200' },
            oficinas: { label: 'Oficinas privadas', color: '#00a88f' },
            coworking: { label: 'Coworking', color: '#9b6dff' },
            laboratorio: { label: 'Laboratorio', color: '#e94e77' },
        };

        const container = document.getElementById('leyendaItems');
        container.innerHTML = Object.entries(tipos).map(([key, t]) => `
            <div class="leyenda-item">
                <div class="leyenda-item__color" style="background:${t.color}"></div>
                <span>${t.label}</span>
            </div>
        `).join('');
    }

    // ==================== FILTRO DE SECTORES ====================
    function renderFiltrosSectores() {
        const container = document.getElementById('filtrosSectores');
        const html = SECTORES.map(s => `
            <button class="filtro-sector" data-sector="${s.id}" style="--color-sector: ${s.color}">
                <span>${s.label}</span>
            </button>
        `).join('');
        container.innerHTML = '<button class="filtro-sector activo" data-sector="todos"><span>Todos los sectores</span></button>' + html;
    }

    // ==================== INTERACCIONES ====================
    function seleccionarZona(zonaId) {
        // Quitar selección anterior
        document.querySelectorAll('.zona.activa').forEach(el => el.classList.remove('activa'));
        // Marcar nueva
        const el = document.querySelector(`.zona[data-zona-id="${zonaId}"]`);
        if (el) el.classList.add('activa');

        App.mostrarEspacio(zonaId);
    }

    function cambiarPlanta(planta) {
        plantaActiva = planta;
        document.querySelectorAll('.planta-tab').forEach(t => t.classList.remove('activo'));
        document.querySelector(`.planta-tab[data-planta-tab="${planta}"]`).classList.add('activo');

        document.querySelectorAll('.mapa__planta').forEach(p => p.classList.remove('activa'));
        document.getElementById(`planta-${planta}`).classList.add('activa');

        // Resetear selección
        document.querySelectorAll('.zona.activa').forEach(el => el.classList.remove('activa'));
    }

    function toggleSinergias() {
        sinergiasVisibles = !sinergiasVisibles;
        const mapa = document.querySelector('.mapa');
        const btn = document.getElementById('btnVerSinergias');
        if (sinergiasVisibles) {
            mapa.classList.add('sinergias-visible');
            btn.classList.add('activo');
        } else {
            mapa.classList.remove('sinergias-visible');
            btn.classList.remove('activo');
        }
    }

    // ==================== PAN & ZOOM ====================
    function setupPanZoom() {
        const canvas = document.getElementById('canvas');

        canvas.addEventListener('mousedown', (e) => {
            if (e.target.closest('.zona')) return;
            arrastrando = true;
            inicioX = e.clientX;
            inicioY = e.clientY;
            inicioPanX = panX;
            inicioPanY = panY;
            canvas.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!arrastrando) return;
            panX = inicioPanX + (e.clientX - inicioX);
            panY = inicioPanY + (e.clientY - inicioY);
            aplicarTransform();
        });

        document.addEventListener('mouseup', () => {
            if (arrastrando) {
                arrastrando = false;
                canvas.style.cursor = 'grab';
            }
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            zoom = Math.min(2, Math.max(0.5, zoom + delta));
            aplicarTransform();
        }, { passive: false });
    }

    function aplicarTransform() {
        document.querySelectorAll('.mapa__planta svg').forEach(svg => {
            svg.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`;
        });
    }

    function resetVista() {
        zoom = 1;
        panX = 0;
        panY = 0;
        aplicarTransform();
    }

    // ==================== RESALTAR EMPRESA ====================
    function resaltarEmpresa(empresaId) {
        const empresa = EMPRESAS.find(e => e.id === empresaId);
        if (!empresa) return;
        const espacio = ESPACIOS[empresa.espacioId];
        if (!espacio) return;

        // Cambiar de planta si es necesario
        if (espacio.planta !== plantaActiva) {
            cambiarPlanta(espacio.planta);
        }

        // Quitar selección anterior
        document.querySelectorAll('.zona.activa').forEach(el => el.classList.remove('activa'));
        // Marcar nueva con animación
        setTimeout(() => {
            const el = document.querySelector(`.zona[data-zona-id="${empresa.espacioId}"]`);
            if (el) {
                el.classList.add('activa');
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            App.mostrarEspacio(empresa.espacioId);
        }, 100);
    }

    // ==================== HIGHLIGHT POR SECTOR ====================
    function resaltarPorSector(sectorId) {
        // Quitar todos los highlights
        document.querySelectorAll('.zona').forEach(el => {
            el.classList.remove('resaltado-sector', 'atenuado');
        });

        if (sectorId === 'todos') return;

        const empresasSector = new Set(EMPRESAS.filter(e => e.sector === sectorId).map(e => e.espacioId));

        document.querySelectorAll('.zona').forEach(el => {
            const id = el.getAttribute('data-zona-id');
            if (empresasSector.has(id)) {
                el.classList.add('resaltado-sector');
            } else {
                el.classList.add('atenuado');
            }
        });
    }

    // ==================== INIT ====================
    function init() {
        renderPlanta('baja', ZONAS_BAJA);
        renderPlanta('primera', ZONAS_PRIMERA);
        renderLeyenda();
        renderFiltrosSectores();
        actualizarEstadisticas();
        setupPanZoom();

        // Tabs de planta
        document.querySelectorAll('.planta-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                cambiarPlanta(tab.getAttribute('data-planta-tab'));
            });
        });

        // Botón resetear vista
        document.getElementById('btnResetVista').addEventListener('click', resetVista);

        // Botón ver sinergias
        document.getElementById('btnVerSinergias').addEventListener('click', toggleSinergias);
    }

    return { init, cambiarPlanta, seleccionarZona, resaltarEmpresa, resaltarPorSector, toggleSinergias };
})();
