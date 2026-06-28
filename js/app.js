/* =============================================
   MAPAPOLO 2026 - Controlador Principal
   ============================================= */

const App = (() => {
    let busquedaActiva = '';
    let filtroSectorActivo = 'todos';
    let filtroPlantaActivo = 'todas';
    let panelAbierto = false;
    let tabPanelActivo = 'empresas';

    // ==================== INICIALIZACIÓN ====================
    function init() {
        Mapa.init();
        setupEventListeners();
        setupAtajosTeclado();
        cargarInfoPolo();
    }

    function setupEventListeners() {
        // Buscador
        const inputBusqueda = document.getElementById('inputBusqueda');
        let timeoutId = null;
        inputBusqueda.addEventListener('input', (e) => {
            clearTimeout(timeoutId);
            const query = e.target.value.trim();
            timeoutId = setTimeout(() => {
                busquedaActiva = query;
                if (query.length >= 2) {
                    ejecutarBusqueda(query);
                } else {
                    ocultarResultados();
                }
            }, 200);
        });

        inputBusqueda.addEventListener('focus', () => {
            if (inputBusqueda.value.trim().length >= 2) {
                ejecutarBusqueda(inputBusqueda.value.trim());
            }
        });

        // Cerrar resultados al hacer click fuera
        document.addEventListener('click', (e) => {
            const buscador = document.querySelector('.buscador');
            const resultados = document.getElementById('resultados');
            if (resultados && !resultados.contains(e.target) && !buscador.contains(e.target)) {
                // No cerrar si estamos clickeando en el panel
                if (!e.target.closest('.panel') && !e.target.closest('.mapa')) {
                    ocultarResultados();
                }
            }
        });

        // Chips de sugerencia
        document.querySelectorAll('.chip-sugerencia').forEach(chip => {
            chip.addEventListener('click', () => {
                const query = chip.getAttribute('data-query');
                inputBusqueda.value = query;
                inputBusqueda.focus();
                ejecutarBusqueda(query);
            });
        });

        // Cerrar resultados
        document.getElementById('cerrarResultados').addEventListener('click', () => {
            ocultarResultados();
            inputBusqueda.value = '';
            inputBusqueda.focus();
        });

        // Filtros de planta
        document.querySelectorAll('.filtro-planta').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filtro-planta').forEach(b => b.classList.remove('activo'));
                btn.classList.add('activo');
                filtroPlantaActivo = btn.getAttribute('data-planta');
                aplicarFiltros();
            });
        });

        // Filtros de sector
        document.getElementById('filtrosSectores').addEventListener('click', (e) => {
            const btn = e.target.closest('.filtro-sector');
            if (!btn) return;
            document.querySelectorAll('.filtro-sector').forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            filtroSectorActivo = btn.getAttribute('data-sector');
            aplicarFiltros();
        });

        // Tabs del panel
        document.querySelectorAll('.panel-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                cambiarTabPanel(tab.getAttribute('data-tab'));
            });
        });

        // Cerrar panel
        document.getElementById('cerrarPanel').addEventListener('click', cerrarPanel);

        // Botón info polo
        document.querySelector('[data-accion="info-polo"]').addEventListener('click', () => {
            document.getElementById('modalPolo').hidden = false;
        });

        // Cerrar modal
        document.querySelectorAll('[data-cerrar-modal]').forEach(el => {
            el.addEventListener('click', () => {
                document.getElementById('modalPolo').hidden = true;
            });
        });

        // Toggle tema
        document.getElementById('btnTema').addEventListener('click', () => {
            document.body.classList.toggle('modo-oscuro');
            const isOscuro = document.body.classList.contains('modo-oscuro');
            localStorage.setItem('mapapolo-tema', isOscuro ? 'oscuro' : 'claro');
            // Re-renderizar para actualizar colores del mapa
            Mapa.init();
            Mapa.cambiarPlanta('baja');
            if (panelAbierto) {
                const zonaActiva = document.querySelector('.zona.activa');
                if (zonaActiva) {
                    const id = zonaActiva.getAttribute('data-zona-id');
                    setTimeout(() => mostrarEspacio(id), 50);
                }
            }
        });

        // Cargar tema guardado
        const temaGuardado = localStorage.getItem('mapapolo-tema');
        if (temaGuardado === 'oscuro') {
            document.body.classList.add('modo-oscuro');
        }
    }

    function setupAtajosTeclado() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + K: foco en buscador
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('inputBusqueda').focus();
            }
            // Escape: cerrar modales y panel
            if (e.key === 'Escape') {
                if (!document.getElementById('modalPolo').hidden) {
                    document.getElementById('modalPolo').hidden = true;
                } else if (panelAbierto) {
                    cerrarPanel();
                } else if (busquedaActiva) {
                    ocultarResultados();
                    document.getElementById('inputBusqueda').value = '';
                }
            }
        });
    }

    // ==================== BÚSQUEDA ====================
    function ejecutarBusqueda(query) {
        const resultados = Buscador.buscar(query);
        const container = document.getElementById('resultadosGrid');
        const titulo = document.getElementById('resultadosTitulo');

        if (resultados.length === 0) {
            container.innerHTML = `
                <div class="resultado-vacio" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <p style="color: var(--color-texto-suave); margin-bottom: 8px;">No se encontraron resultados para "<strong>${escapeHtml(query)}</strong>"</p>
                    <p style="color: var(--color-texto-suave); font-size: 0.875rem;">Prueba con otros términos o explora el mapa.</p>
                </div>
            `;
        } else {
            titulo.textContent = `${resultados.length} ${resultados.length === 1 ? 'resultado' : 'resultados'} para "${query}"`;
            container.innerHTML = resultados.map(r => renderResultadoCard(r.empresa, r.match)).join('');
        }

        document.getElementById('resultados').hidden = false;
    }

    function renderResultadoCard(empresa, match) {
        const sector = SECTORES.find(s => s.id === empresa.sector);
        const espacio = ESPACIOS[empresa.espacioId];
        return `
            <article class="resultado-card" data-empresa-id="${empresa.id}">
                <div class="resultado-card__head">
                    <h3 class="resultado-card__nombre">${empresa.nombre}</h3>
                    <span class="resultado-card__match">${match}% match</span>
                </div>
                <p class="resultado-card__desc">${empresa.descripcion}</p>
                <div class="resultado-card__footer">
                    <span>${sector ? sector.label : empresa.sectorLabel}</span>
                    <span>${espacio ? espacio.nombre : '—'}</span>
                </div>
            </article>
        `;
    }

    function ocultarResultados() {
        document.getElementById('resultados').hidden = true;
    }

    // ==================== FILTROS ====================
    function aplicarFiltros() {
        let empresas = EMPRESAS;

        if (filtroPlantaActivo !== 'todas') {
            empresas = empresas.filter(e => ESPACIOS[e.espacioId]?.planta === filtroPlantaActivo);
        }

        if (filtroSectorActivo !== 'todos') {
            empresas = empresas.filter(e => e.sector === filtroSectorActivo);
        }

        // Cambiar de planta si el filtro afecta
        if (filtroPlantaActivo !== 'todas') {
            Mapa.cambiarPlanta(filtroPlantaActivo);
        }

        // Resaltar en el mapa
        Mapa.resaltarPorSector(filtroSectorActivo);

        // Si hay filtro de planta, ocultar la otra planta
        if (filtroPlantaActivo !== 'todas') {
            atenuarPlanasNoActivas(filtroPlantaActivo);
        } else {
            quitarAtenuacion();
        }
    }

    function atenuarPlanasNoActivas(plantaActiva) {
        document.querySelectorAll('.mapa__planta').forEach(p => {
            if (p.id !== `planta-${plantaActiva}`) {
                p.style.opacity = '0.3';
            } else {
                p.style.opacity = '1';
            }
        });
    }

    function quitarAtenuacion() {
        document.querySelectorAll('.mapa__planta').forEach(p => {
            p.style.opacity = '';
        });
    }

    // ==================== PANEL DE DETALLE ====================
    function mostrarEspacio(zonaId) {
        const espacio = ESPACIOS[zonaId];
        if (!espacio) return;

        panelAbierto = true;
        const empresasEnEspacio = EMPRESAS.filter(e => e.espacioId === zonaId);

        // Mostrar panel
        document.getElementById('estadoVacio').hidden = true;
        document.getElementById('panelContenido').hidden = false;

        // Header
        document.getElementById('panelBadge').textContent = espacio.planta === 'baja' ? 'Planta Baja' : 'Planta Primera';
        document.getElementById('panelTitulo').textContent = espacio.nombre;
        document.getElementById('panelSubtitulo').textContent = `${empresasEnEspacio.length} ${empresasEnEspacio.length === 1 ? 'empresa' : 'empresas'} · ${capitalize(espacio.tipo)}`;

        // Tab Empresas
        const listaEmpresas = document.getElementById('listaEmpresas');
        if (empresasEnEspacio.length === 0) {
            listaEmpresas.innerHTML = `
                <div class="sinergia-vacio">
                    Este espacio está disponible pero no tiene empresas asignadas actualmente.
                    ${espacio.descripcion ? '<p style="margin-top: 8px; color: var(--color-texto-secundario);">' + espacio.descripcion + '</p>' : ''}
                </div>
            `;
        } else {
            listaEmpresas.innerHTML = empresasEnEspacio.map(e => renderEmpresaCard(e)).join('');
        }

        // Tab Detalles
        const detalles = document.getElementById('detallesEspacio');
        detalles.innerHTML = renderDetallesEspacio(espacio);

        // Tab Sinergias
        const sinergias = Buscador.buscarSinergiasParaEspacio(zonaId);
        const listaSinergias = document.getElementById('listaSinergias');
        if (sinergias.length === 0) {
            listaSinergias.innerHTML = `
                <div class="sinergia-vacio">
                    No se detectaron sinergias automáticas para este espacio.
                </div>
            `;
        } else {
            listaSinergias.innerHTML = sinergias.map(s => renderSinergia(s)).join('');
        }

        // Event listeners en cards de empresa
        listaEmpresas.querySelectorAll('.empresa-card').forEach(card => {
            card.addEventListener('click', () => {
                const empId = card.getAttribute('data-empresa-id');
                mostrarEmpresaIndividual(empId);
            });
        });

        // Event listeners en items de sinergia
        listaSinergias.querySelectorAll('.sinergia-item').forEach(item => {
            item.addEventListener('click', () => {
                const empId = item.getAttribute('data-empresa-destino');
                Mapa.resaltarEmpresa(empId);
            });
        });
    }

    function renderEmpresaCard(empresa) {
        const sector = SECTORES.find(s => s.id === empresa.sector);
        const colorSector = sector ? sector.color : '#5b8def';
        const iniciales = empresa.nombre.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
        return `
            <article class="empresa-card" data-empresa-id="${empresa.id}">
                <div class="empresa-card__head">
                    <h3 class="empresa-card__nombre">${empresa.nombre}</h3>
                    <span class="empresa-card__sector" style="background: ${colorSector}">${empresa.sectorLabel}</span>
                </div>
                <p class="empresa-card__desc">${empresa.descripcion}</p>
                <div class="empresa-card__tech">
                    ${empresa.tecnologias.slice(0, 4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    ${empresa.tecnologias.length > 4 ? `<span class="tech-tag">+${empresa.tecnologias.length - 4}</span>` : ''}
                </div>
                <a href="${empresa.web}" target="_blank" rel="noopener" class="empresa-card__link">
                    Visitar web ↗
                </a>
            </article>
        `;
    }

    function renderDetallesEspacio(espacio) {
        return `
            <div class="detalle-grupo">
                <div class="detalle-grupo__label">Descripción</div>
                <p class="detalle-grupo__valor">${espacio.descripcion}</p>
            </div>
            ${espacio.capacidad ? `
                <div class="detalle-grupo">
                    <div class="detalle-grupo__label">Capacidad</div>
                    <p class="detalle-grupo__valor">${espacio.capacidad}</p>
                </div>
            ` : ''}
            ${espacio.servicios && espacio.servicios.length > 0 ? `
                <div class="detalle-grupo">
                    <div class="detalle-grupo__label">Servicios</div>
                    <ul class="detalle-grupo__lista">
                        ${espacio.servicios.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${espacio.equipamiento && espacio.equipamiento.length > 0 ? `
                <div class="detalle-grupo">
                    <div class="detalle-grupo__label">Equipamiento</div>
                    <ul class="detalle-grupo__lista">
                        ${espacio.equipamiento.map(e => `<li>${e}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <div class="detalle-grupo">
                <div class="detalle-grupo__label">Cómo llegar</div>
                <p class="detalle-grupo__valor">
                    <strong>Desde la entrada principal:</strong> ${calcularRuta(espacio)}
                </p>
            </div>
        `;
    }

    function renderSinergia(sinergia) {
        const origen = SECTORES.find(sec => sec.id === sinergia.empresaOrigen.sector);
        const destino = SECTORES.find(sec => sec.id === sinergia.empresaDestino.sector);
        return `
            <article class="sinergia-item" data-empresa-destino="${sinergia.empresaDestino.id}">
                <div class="sinergia-item__empresas">
                    <span class="sinergia-item__empresa">${sinergia.empresaOrigen.nombre}</span>
                    <span class="sinergia-item__flecha">→</span>
                    <span class="sinergia-item__empresa">${sinergia.empresaDestino.nombre}</span>
                </div>
                <p class="sinergia-item__razon">${sinergia.razon}</p>
            </article>
        `;
    }

    function mostrarEmpresaIndividual(empresaId) {
        const empresa = EMPRESAS.find(e => e.id === empresaId);
        if (!empresa) return;
        Mapa.resaltarEmpresa(empresaId);
    }

    function cambiarTabPanel(tab) {
        tabPanelActivo = tab;
        document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('activo'));
        document.querySelector(`.panel-tab[data-tab="${tab}"]`).classList.add('activo');
        document.querySelectorAll('.panel__seccion').forEach(s => s.classList.remove('activa'));
        document.getElementById(`tab-${tab}`).classList.add('activa');
    }

    function cerrarPanel() {
        panelAbierto = false;
        document.getElementById('estadoVacio').hidden = false;
        document.getElementById('panelContenido').hidden = true;
        document.querySelectorAll('.zona.activa').forEach(el => el.classList.remove('activa'));
        cambiarTabPanel('empresas');
    }

    // ==================== CÁLCULO DE RUTA ====================
    function calcularRuta(espacio) {
        if (espacio.id === 'recepcion') return 'Estás en la entrada principal.';
        if (espacio.planta === 'baja') {
            return 'Entra por la puerta principal, avanza por el hall y sigue las señales hasta llegar a la zona indicada.';
        } else {
            return 'Sube las escaleras desde el hall principal hasta la primera planta. El espacio se encuentra dentro del área de Go2Work / Laboratorios.';
        }
    }

    // ==================== MODAL DEL POLO ====================
    function cargarInfoPolo() {
        document.getElementById('poloDireccion').textContent = POLO_INFO.direccion;
        document.getElementById('poloContacto').innerHTML = `${POLO_INFO.telefono}<br>${POLO_INFO.email}`;
        document.getElementById('poloWeb').textContent = POLO_INFO.web;
        document.getElementById('poloWeb').href = POLO_INFO.web;

        const ambitos = [
            'Artes visuales (fotografía, cine, productoras, postproducción)',
            'Desarrollo 2D/3D, animación, realidad virtual/aumentada',
            'Videojuegos, serious games y gamificación',
            'E-learning y contenidos educativos digitales',
            'Medios y editoriales digitales (Youtubers, podcasters)',
            'Música digital (producción, gestión musical)',
            'Tecnologías habilitadoras (IA, blockchain, IoT)',
        ];
        document.getElementById('listaAmbitos').innerHTML = ambitos.map(a => `<li>${a}</li>`).join('');
    }

    // ==================== EVENT LISTENERS PARA RESULTADOS ====================
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.resultado-card');
        if (card) {
            const empId = card.getAttribute('data-empresa-id');
            Mapa.resaltarEmpresa(empId);
            document.getElementById('inputBusqueda').value = '';
            ocultarResultados();
        }
    });

    // ==================== UTILIDADES ====================
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    // ==================== TOAST ====================
    let toastTimeout = null;
    window.mostrarToast = (mensaje) => {
        const toast = document.getElementById('toast');
        document.getElementById('toastMensaje').textContent = mensaje;
        toast.hidden = false;
        // Forzar reflow
        toast.offsetHeight;
        toast.classList.add('visible');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => { toast.hidden = true; }, 240);
        }, 2400);
    };

    return { init, mostrarEspacio, cerrarPanel };
})();

// ==================== INIT AL CARGAR ====================
document.addEventListener('DOMContentLoaded', App.init);
