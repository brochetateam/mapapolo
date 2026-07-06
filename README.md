# MAPAPOLO 2026

> Mapa directorio inteligente del **Polo Nacional de Contenidos Digitales** (Málaga) —  
> con buscador semántico y recomendador de sinergias con IA local.

![Status](https://img.shields.io/badge/status-Prototipo-orange)
![Planta](https://img.shields.io/badge/Planta%20Baja-Lista-blue)
![Planta 1ª](https://img.shields.io/badge/Planta%201ª-Pendiente-lightgrey)
![Web](https://img.shields.io/badge/HTML%2FCSS%2FJS-Puro-success)

---

## Índice

- [¿Qué es?](#qué-es)
- [Demo en vivo](#demo-en-vivo)
- [Funcionalidades](#funcionalidades)
- [Empresas y zonas](#empresas-y-zonas)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo correr en local](#cómo-correr-en-local)
- [Deploy en GitHub Pages](#deploy-en-github-pages)
- [Atajos de teclado](#atajos-de-teclado)
- [Roadmap](#roadmap)
- [Créditos](#créditos)

---

## ¿Qué es?

MAPAPOLO es una web-app estática que convierte el plano oficial del Polo Nacional de Contenidos Digitales en un **directorio interactivo** con inteligencia artificial. Está desarrollada como **prototipo funcional** para explorar cómo la combinación de mapa visual, datos de empresa y recomendación IA puede mejorar la conexión entre los habitantes del Polo.

Combina:

- **Mapa vectorizado real** — SVG oficial de la planta baja del Edificio E3 (Tabacalera, Málaga) con zonas interactivas (hover para resaltar, click para ver detalle).
- **Buscador semántico** — No hace falta saber el nombre exacto. Escribe *"estudio de audio"*, *"animación 3D para serie"*, *"necesito colaboración en videojuegos"* y el motor entiende la intención gracias a un sistema de scoring ponderado con stemming y sinónimos.
- **Recomendador de sinergias con IA** — Al seleccionar una empresa, el sistema cruza automáticamente sus tecnologías y sector con los del resto de empresas del Polo, calculando afinidades y mostrando colaboraciones potenciales.
- **Ruta visual de sinergia** — Las conexiones entre empresas se dibujan como líneas animadas sobre el mapa, permitiendo descubrir relaciones espaciales y temáticas.
- **UI futurista** — Tema oscuro por defecto con acentos neón (cyan, coral, violeta), toggle a modo claro, tipografía display (Outfit + Space Grotesk), y panel lateral tipo mockup 2026.

---

## Demo en vivo

🌐 **https://kreatures-studio.github.io/mapapolo/**

Pruébalo directamente desde el navegador (escritorio o móvil).

---

## Funcionalidades

### Mapa interactivo

- Pasa el ratón por cualquier zona del plano: se resalta con glow y aparece un tooltip con el nombre, la empresa (si se conoce) y la descripción del espacio.
- Haz clic en una zona: la información se carga en el panel lateral (empresa, sector, tecnologías, web).
- El mapa se adapta a ambos temas (oscuro/claro) manteniendo la legibilidad de las etiquetas.

### Buscador semántico

- Busca por sector, tecnología, nombre de empresa o necesidad.
- El motor analiza la consulta, aplica stemming (raíces de palabras), sinónimos y calcula relevancia.
- Resultados en tiempo real con sugerencias desplegables.
- Atajo con tecla `/` para foco rápido.

### Sinergias con IA

- Cada empresa tiene tecnologías y sector asociados.
- Al seleccionar una empresa, el motor de sinergias encuentra otras empresas del Polo con tecnologías complementarias o sectores afines.
- Las sinergias se muestran tanto en el panel lateral como en el mapa (líneas trazadas entre zonas).
- Las zonas sin empresas relevantes (aulas, coworkings, ágoras, recepción, of. técnica) no generan sinergias para mantener la interfaz limpia.

### Diseño responsive

- **Escritorio**: panel lateral + mapa en grid, todo visible sin scroll vertical.
- **Móvil**: mapa primero, luego fichas. Menú hamburguesa con navegación rápida (Mapa, Empresas, Sinergias, Tema). Leyenda apilada bajo el título.

---

## Empresas y zonas

### Planta baja — oficinas asignadas

| Zona | Empresa | Web |
|------|---------|-----|
| OF1 | Nacho Arranz | [nachoarranz.com](https://nachoarranz.com/nacho-arranz) |
| OF2 | *(disponible)* | — |
| OF3 | Axtra Gaming Club | [axtragaming.club](https://axtragaming.club/) |
| OF4 | Oficina Técnica | [polodigital.eu](https://www.polodigital.eu) |
| OF5 | VR Estudio | [vrestudio.com](https://vrestudio.com/app) |
| OF6 | *(disponible)* | — |

### Otras zonas del plano

Incluye 6 aulas de formación (AU1–6), 2 ágoras/eventos, 2 patios, 2 coworkings (CW1, CW2), recepción, antesala/office, almacenes y aseos — todas cliqueables con información de superficie y descripción.

### Empresas en primera planta (pendiente de confirmar)

Varias empresas adicionales están registradas en la base de datos con ubicación sin confirmar, posiblemente en la primera planta del edificio: 64Train, Bebite, Best Ride Simulators, Forgotten Empires, Inone, Mickrea, Murciélagos, OWO Game, Redvel Games, Twindustry, Under the Bed Games.

---

## Estructura del proyecto

```
mapapolo/
├── index.html                   # entrada principal
├── README.md                    # este archivo
├── descripcion_mockup.md        # análisis del mockup original
├── css/
│   └── estilo.css              # ~1850 líneas: tema oscuro + glassmorphism + responsive
├── js/
│   ├── datos.js                # 20+ empresas + 28 zonas del SVG con colores por categoría
│   ├── buscador.js             # motor de scoring ponderado (stemming + sinónimos)
│   ├── mapa.js                 # inyecta SVG + interactividad + tooltip + líneas de sinergia
│   └── app.js                  # controlador principal: init, eventos, sinergias, tema
├── mapas/
│   └── plano_polo_planta_baja.svg  # SVG editado del plano oficial
└── img/
    └── ...                     # assets (pendiente)
```

---

## Cómo correr en local

El proyecto es **100 % estático** (HTML / CSS / JS puro, sin build, sin dependencias). Solo necesitas servir los archivos con un servidor HTTP.

### Opción 1 — Python (recomendado)
```bash
cd mapapolo
python -m http.server 8000
# abre http://localhost:8000
```

### Opción 2 — Node
```bash
npx serve .
# o
npx http-server -p 8000
```

### Opción 3 — VSCode
Instala la extensión **Live Server** y haz click derecho → "Open with Live Server".

> ⚠️ **Importante**: abrir `index.html` directamente con `file://` **no funciona** porque el SVG se carga con `fetch()` y requiere un servidor HTTP.

---

## Deploy en GitHub Pages

1. Sube el repo a GitHub.
2. Ve a **Settings → Pages**.
3. Selecciona rama `main` y carpeta `/ (root)`.
4. Espera ~1 minuto y abre `https://<usuario>.github.io/mapapolo/`.

No necesita build, compilación ni dependencias.

---

## Atajos de teclado

| Tecla | Acción |
|-------|--------|
| `/` | Foco en el buscador |
| `Esc` | Reset selección / cerrar sugerencias |
| `T` | Cambiar tema claro/oscuro |

---

## Roadmap

- [x] Fase 1 — Análisis del mockup (`descripcion_mockup.md`)
- [x] Fase 2 — HTML semántico completo con header, sidebar, mapa, footer
- [x] Fase 3 — CSS tema oscuro con glassmorphism, neón, grid layout
- [x] Fase 4 — Datos de empresas reales del Polo (scraping + manual)
- [x] Fase 5 — Interactividad del SVG (hover, click, highlight, tooltip)
- [x] Fase 6 — Buscador semántico con scoring ponderado
- [x] Fase 7 — Sinergias IA: cruce de tecnologías + líneas visuales en mapa
- [x] Fase 8 — Modo claro/oscuro toggle
- [x] Fase 9 — Diseño responsive (escritorio + móvil + menú hamburguesa)
- [x] Fase 10 — Limpieza de código y CSS (eliminado mockup móvil, FABs, código legacy)
- [ ] Fase 11 — Planta primera (1ª) con todas las empresas reubicadas
- [ ] Fase 12 — Mejora del motor de sinergias (pesos configurables, feedback loop)
- [ ] Fase 13 — PWA / offline (service worker)
- [ ] Fase 14 — Panel de administración para gestión de empresas

---

## Créditos

- **Datos de empresas** — [Directorio público del Polo de Contenidos Digitales](https://www.polodigital.eu/habitantes/nuevos/)
- **Planos** — Documentación oficial del *Anexo 2 · Bases Reguladoras 2026* del Polo Nacional de Contenidos Digitales
- **Diseño conceptual** — Equipo MAPAPOLO / Kreatures Studio
- **Desarrollo** — Prototipo funcional desarrollado con HTML, CSS y JavaScript puros
- **Hecho por** [Kreatures Studio](https://kreatures-studio.github.io/mapapolo/) ❤ en Málaga
