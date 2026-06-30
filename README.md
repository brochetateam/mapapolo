# MAPAPOLO 2026

> Mapa directorio inteligente del **Polo Nacional de Contenidos Digitales** (Málaga) — con buscador semántico y recomendador de sinergias con IA local.

![Status](https://img.shields.io/badge/status-MVP-orange) ![Planta](https://img.shields.io/badge/Planta%20Baja-Lista-blue) ![Planta 1ª](https://img.shields.io/badge/Planta%201ª-Pendiente-lightgrey) ![Web](https://img.shields.io/badge/HTML%2FCSS%2FJS-Puro-success)

## ¿Qué es?

Una web-app estática que combina:

- **Mapa vectorizado real** de la planta baja del edificio E3 (Tabacalera).
- **Buscador semántico** que entiende lenguaje natural: *"busco estudio de audio para doblaje"*, *"necesito animación 3D para una serie"*, etc.
- **Recomendador de sinergias** que cruza tecnologías y sectores de las **27+ empresas reales** del Polo y propone colaboraciones.
- **Ruta visual** entre zonas.
- **UI futurista** con tema oscuro, gradientes neón y panel de identidad estilo mockup 2026.

## Vista rápida

![Mockup](mockup.png)

## Estructura

```
mapapolo/
├── index.html               # entrada principal
├── descripcion_mockup.md     # análisis del mockup (paleta, secciones, interpretación)
├── css/
│   └── estilo.css           # tema oscuro + glassmorphism + responsive
├── js/
│   ├── datos.js             # 27+ empresas reales + zonas del SVG
│   ├── buscador.js          # motor de scoring ponderado (stemming + sinónimos)
│   ├── mapa.js              # inyecta SVG + interactividad + líneas de sinergia
│   └── app.js               # controlador principal
├── mapas/
│   └── plano_polo_planta_baja.svg   # SVG real del plano
└── img/                      # iconos / assets (vacío por ahora)
```

## Cómo correr en local

El proyecto es **100 % estático** (HTML / CSS / JS puro, sin build). Solo necesitas servir los archivos.

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
Instala la extensión **Live Server** y haz click en "Go Live".

> ⚠️ **Importante**: abrir `index.html` directamente con `file://` **no funciona** porque el SVG se carga con `fetch()` y eso requiere un servidor HTTP.

## Deploy en GitHub Pages

1. Sube el repo a GitHub.
2. Ve a **Settings → Pages**.
3. Selecciona rama `main` y carpeta `/ (root)`.
4. Espera ~1 min y abre `https://<usuario>.github.io/mapapolo/`.

No necesita build ni dependencias.

## Atajos de teclado

| Tecla | Acción |
|---|---|
| `/` | Foco en el buscador |
| `Esc` | Reset selección / cerrar sugerencias |
| `T` | Cambiar tema claro/oscuro |

## Roadmap

- [x] Fase 1 — `descripcion_mockup.md` (análisis del mockup)
- [x] Fase 2 — HTML semántico completo
- [x] Fase 3 — CSS tema oscuro con glassmorphism
- [x] Fase 4 — Datos de 27+ empresas reales
- [x] Fase 5 — Interactividad del SVG (hover, click, líneas de sinergia)
- [x] Fase 6 — Buscador semántico con scoring
- [x] Fase 7 — Controlador (toast, FAB, shortcuts, modo claro/oscuro)
- [ ] Fase 8 — Planta primera (1ª)
- [ ] Fase 9 — Modo 3D isométrico estilo mockup (opcional)
- [ ] Fase 10 — PWA / offline

## Créditos

- **Datos de empresas** — [polodigital.eu/habitantes/nuevos/](https://www.polodigital.eu/habitantes/nuevos/)
- **Planos** — Documentación oficial del *Anexo 2 · Bases Reguladoras 2026* del Polo.
- **Mockup** — Diseño conceptual del equipo MAPAPOLO.
- **Hecho con** ❤ en el Polo de Contenidos Digitales, Málaga.
