/* ============================================================
   MAPAPOLO 2026 · Datos de empresas y zonas
   ------------------------------------------------------------
   Empresas reales del directorio público del Polo de Contenidos
   Digitales (polodigital.eu/habitantes/nuevos). Cada empresa está
   vinculada a una o varias zonas (id del SVG) del plano de la
   planta baja generado.
   ============================================================ */

window.MAPAPOLO_DATA = (function () {
  "use strict";

  /* ---------- ZONAS (mapeo con IDs del SVG plano_polo_planta_baja.svg) ---------- */
  const zonas = {
    "almacen_top":  { nombre: "Almacén",           categoria: "comun",   m2: 14.5,  desc: "Almacén general de planta baja." },
    "agora1":      { nombre: "Ágora 1",            categoria: "eventos", m2: 56.8,  desc: "Sala Ágora 1 con grada para presentaciones y reuniones de empresa." },
    "agora2":      { nombre: "Ágora 2",            categoria: "eventos", m2: 19.8,  desc: "Sala Ágora 2, espacio reducido para reuniones y workshops." },
    "wc1":         { nombre: "Aseos",              categoria: "comun",   m2: 6.5,   desc: "Aseos planta baja." },
    "wc2":         { nombre: "Aseos",              categoria: "comun",   m2: 6.5,   desc: "Aseos planta baja." },
    "hall":        { nombre: "Recepción / Hall",   categoria: "comun",   m2: 36,    desc: "Recepción principal y hall de bienvenida del Polo." },
    "au1":         { nombre: "Aula 1 (AU 1)",      categoria: "aulas",   m2: 8.7,   desc: "Aula de formación 1 — capacidad 24 pax." },
    "au2":         { nombre: "Aula 2 (AU 2)",      categoria: "aulas",   m2: 6,     desc: "Aula de formación 2 — capacidad 24 pax." },
    "au3":         { nombre: "Aula 3 (AU 3)",      categoria: "aulas",   m2: 6.9,   desc: "Aula de formación 3 — capacidad 24 pax." },
    "au4":         { nombre: "Aula 4 (AU 4)",      categoria: "aulas",   m2: 7.4,   desc: "Aula de formación 4 — capacidad 24 pax." },
    "au5":         { nombre: "Aula 5 (AU 5)",      categoria: "aulas",   m2: 6.4,   desc: "Aula de formación 5 — capacidad 24 pax." },
    "au6":         { nombre: "Aula 6 (AU 6)",      categoria: "aulas",   m2: 7.5,   desc: "Aula de formación 6 — capacidad 24 pax." },
    "patio1":      { nombre: "Patio 1",            categoria: "eventos", m2: 49.5,  desc: "Patio interior, eje central del edificio. Acoge eventos y zona de paso." },
    "patio2":      { nombre: "Patio 2",            categoria: "eventos", m2: 41,    desc: "Patio interior secundario, espacio de paso y descanso." },
    "of1":         { nombre: "Oficina OF 1",       categoria: "oficinas",m2: 7.9,   desc: "Oficina modular consolidada." },
    "of2":         { nombre: "Oficina OF 2",       categoria: "oficinas",m2: 5.4,   desc: "Oficina modular consolidada." },
    "of3":         { nombre: "Oficina OF 3",       categoria: "oficinas",m2: 4.9,   desc: "Oficina modular consolidada." },
    "of4":         { nombre: "Oficina OF 4",       categoria: "oficinas",m2: 7.1,   desc: "Oficina modular consolidada de mayor tamaño." },
    "of5":         { nombre: "Oficina OF 5",       categoria: "oficinas",m2: 6.8,   desc: "Oficina modular consolidada." },
    "of6":         { nombre: "Oficina OF 6",       categoria: "oficinas",m2: 11.6,  desc: "Oficina modular Coworking 1." },
    "alm_mant":    { nombre: "Almacén Mantenim.",  categoria: "comun",   m2: 6.8,   desc: "Almacén de mantenimiento." },
    "almacen4":    { nombre: "Almacén 4",          categoria: "comun",   m2: 6.2,   desc: "Almacén 4." },
    "almacen5":    { nombre: "Almacén 5",          categoria: "comun",   m2: 6.4,   desc: "Almacén 5." },
    "office":      { nombre: "Office (Promálaga)", categoria: "comun",   m2: 3,     desc: "Office interior." },
    "antesala":    { nombre: "Antesala / Office",  categoria: "comun",   m2: 38,    desc: "Antesala office y zona de exposición. Acoge el videowall de 4 pantallas de 65\"." },
    "recepcion2":  { nombre: "Recepción 2",        categoria: "comun",   m2: 21,    desc: "Recepción secundaria (entrada IAT)." },
    "cw2":         { nombre: "Coworking 2 (CW2)",  categoria: "coworking",m2: 25.4, desc: "Zona coworking 2 con puestos de trabajo." },
    "mid1":        { nombre: "Zona intermedia",    categoria: "comun",   m2: 24,    desc: "Zona intermedia / almacén / coworking compartido." },
    "cw1":         { nombre: "Coworking 1 (CW1)",  categoria: "coworking",m2: 18.9, desc: "Zona coworking 1." }
  };

  /* ---------- COLORES por categoría (consumidos por mapa.js) ---------- */
  const categoriaColor = {
    aulas:     "#f59e0b", // amber
    oficinas:  "#6366f1", // indigo
    coworking: "#06b6d4", // cyan
    eventos:   "#ef4444", // red
    comun:     "#94a3b8"  // slate
  };

  const categoriaLabel = {
    aulas:     "Aulas",
    oficinas:  "Oficinas",
    coworking: "Coworking",
    eventos:   "Eventos",
    comun:     "Común"
  };

  /* ---------- EMPRESAS REALES DEL POLO (datos públicos) ---------- */
  /* Cada empresa está asociada a una o varias zonas por id del SVG. */
  const empresas = [
    {
      id: "64train",
      nombre: "64Train",
      web: "https://www.64train.com",
      sector: "Videojuegos",
      desc: "Estudio de desarrollo de videojuegos. Formación y desarrollo creativo en el sector del entertainment digital.",
      tech: ["Unity", "C#", "Game Design", "Unreal Engine"],
      zonas: ["of1", "of4"],
      color: "#ef4444"
    },
    {
      id: "ademass",
      nombre: "Ademass",
      web: "https://ademass.com",
      sector: "Marketing Digital",
      desc: "Agencia de marketing digital y comunicación. Estrategias, branding y growth.",
      tech: ["SEO", "SEM", "Analytics", "Content"],
      zonas: ["of5"],
      color: "#a855f7"
    },
    {
      id: "bebite",
      nombre: "Bebite",
      web: "https://bebite.net",
      sector: "Ciberseguridad",
      desc: "Empresa especializada en ciberseguridad y protección de datos.",
      tech: ["Pentesting", "Security Audit", "Compliance"],
      zonas: ["of2"],
      color: "#22c55e"
    },
    {
      id: "bestridesimulators",
      nombre: "Best Ride Simulators",
      web: "https://bestridesimulators.com",
      sector: "Simulación",
      desc: "Simuladores de conducción y experiencias inmersivas de entrenamiento.",
      tech: ["Unreal Engine", "VR", "Motion Simulation"],
      zonas: ["of3"],
      color: "#06b6d4"
    },
    {
      id: "cienciavr",
      nombre: "CienciaVR",
      web: "https://cienciavr.com",
      sector: "Educación VR",
      desc: "Realidad virtual aplicada a la divulgación científica y educación.",
      tech: ["VR", "Unity", "Educational Content"],
      zonas: ["cw2"],
      color: "#ec4899"
    },
    {
      id: "cookingandpublishing",
      nombre: "Cooking & Publishing",
      web: "https://www.cookingandpublishing.com",
      sector: "Edición Digital",
      desc: "Editorial digital y publicación de contenido interactivo.",
      tech: ["Publishing", "Content", "Interactive Media"],
      zonas: ["cw2"],
      color: "#f59e0b"
    },
    {
      id: "eartes",
      nombre: "Eartes",
      web: "https://www.eartes.com",
      sector: "Arte Digital",
      desc: "Estudio creativo de arte digital y producción visual para marcas.",
      tech: ["Illustrator", "Photoshop", "3D Art"],
      zonas: ["cw1"],
      color: "#ec4899"
    },
    {
      id: "featlander",
      nombre: "Featlander",
      web: "https://featlander.com/es/",
      sector: "Videojuegos",
      desc: "Estudio independiente de videojuegos. Desarrollo de títulos originales.",
      tech: ["Unity", "C#", "Gameplay Programming"],
      zonas: ["cw1"],
      color: "#ef4444"
    },
    {
      id: "forgottenempires",
      nombre: "Forgotten Empires",
      web: "https://www.forgottenempires.net",
      sector: "Videojuegos AAA",
      desc: "Estudio veterano desarrollador de la saga Age of Empires. Uno de los estudios internacionales de referencia en el Polo.",
      tech: ["Unreal Engine", "C++", "Multiplayer", "Strategy Games"],
      zonas: ["of1", "of4"],
      color: "#ef4444"
    },
    {
      id: "gimnasioescenico",
      nombre: "Gimnasio Escénico",
      web: "https://gimnasioescenico.com",
      sector: "Artes Escénicas",
      desc: "Compañía de artes escénicas con producción digital y motion capture.",
      tech: ["Motion Capture", "Performance", "Digital Stage"],
      zonas: ["agora1"],
      color: "#a855f7"
    },
    {
      id: "heqate",
      nombre: "Heqate",
      web: "https://heqate.com",
      sector: "Producción Audiovisual",
      desc: "Productora audiovisual con tecnología de virtual production.",
      tech: ["Unreal Engine", "Virtual Production", "LED Wall", "Cinema 4D"],
      zonas: ["agora1"],
      color: "#22c55e"
    },
    {
      id: "inakin",
      nombre: "Inakin Studio",
      web: "https://twitter.com/Inakin",
      sector: "Videojuegos",
      desc: "Estudio de desarrollo de juegos narrativos e indie.",
      tech: ["Ren'Py", "Narrative Design", "Unity"],
      zonas: ["cw1"],
      color: "#ef4444"
    },
    {
      id: "inone",
      nombre: "Inone",
      web: "https://www.inone.es",
      sector: "Inteligencia Artificial",
      desc: "Soluciones de inteligencia artificial aplicadas a empresa.",
      tech: ["LLM", "NLP", "Computer Vision", "ML Ops"],
      zonas: ["of4"],
      color: "#22c55e"
    },
    {
      id: "krilloud",
      nombre: "Krilloud",
      web: "https://krilloud.com",
      sector: "Audio / Sound Design",
      desc: "Estudio de diseño de sonido y audio para videojuegos y medios digitales.",
      tech: ["Wwise", "FMOD", "Sound Design", "Field Recording"],
      zonas: ["cw2"],
      color: "#22c55e"
    },
    {
      id: "mickrea",
      nombre: "Mickrea",
      web: "https://mickrea.com",
      sector: "Realidad Mixta",
      desc: "Estudio de realidad mixta, aumentada y experiencias XR para marcas y educación.",
      tech: ["MR", "ARKit", "ARCore", "Vision Pro", "Meta Quest"],
      zonas: ["of2"],
      color: "#a855f7"
    },
    {
      id: "pablobecerra",
      nombre: "Pablo Becerra",
      web: "https://es.linkedin.com/in/pablo-becerra-l%C3%B3pez",
      sector: "Arte 3D",
      desc: "Artista y director 3D independiente. Trabajos para cine, publicidad y videojuegos.",
      tech: ["Houdini", "ZBrush", "Substance", "Maya"],
      zonas: ["cw1"],
      color: "#f59e0b"
    },
    {
      id: "murcielagos",
      nombre: "Murciélagos",
      web: "https://murcielagosmalaga.com",
      sector: "Videojuegos",
      desc: "Estudio malagueño de desarrollo de videojuegos. Narrativa y arte cuidado.",
      tech: ["Unity", "Pixel Art", "2D Animation"],
      zonas: ["of3"],
      color: "#ef4444"
    },
    {
      id: "naolito",
      nombre: "Naolito",
      web: "http://www.naolito.com",
      sector: "Animación 2D/3D",
      desc: "Estudio de animación 2D/3D. Trabajos para series, cortometrajes y videojuegos.",
      tech: ["After Effects", "Toon Boom", "Maya", "Illustrator"],
      zonas: ["cw2"],
      color: "#f59e0b"
    },
    {
      id: "novelingo",
      nombre: "Novelingo",
      web: "https://www.novelingo.com",
      sector: "Narrativa Digital",
      desc: "Estudio de narrativa digital interactiva. Novelas visuales y guiones para juegos.",
      tech: ["Twine", "Ink", "Narrative Design", "Ren'Py"],
      zonas: ["cw1"],
      color: "#ec4899"
    },
    {
      id: "owogame",
      nombre: "OWO Game",
      web: "https://owogame.com/es/",
      sector: "Videojuegos Haptic",
      desc: "Videojuegos con feedback háptico wearable. Integración sensorial en el gameplay.",
      tech: ["Unreal Engine", "Haptics", "Wearable", "VR"],
      zonas: ["of4"],
      color: "#ef4444"
    },
    {
      id: "prosfy",
      nombre: "Prosfy",
      web: "https://prosfy.com/es/",
      sector: "Sports Tech",
      desc: "Tecnología aplicada al deporte. Plataformas y datos para clubes y atletas.",
      tech: ["Data Analytics", "App Dev", "IoT"],
      zonas: ["of5"],
      color: "#22c55e"
    },
    {
      id: "redvelgames",
      nombre: "Redvel Games",
      web: "https://redvelgames.com",
      sector: "Videojuegos",
      desc: "Estudio de videojuegos para móvil. Free to play y casual.",
      tech: ["Unity", "C#", "Mobile Dev", "Backend"],
      zonas: ["of2"],
      color: "#ef4444"
    },
    {
      id: "releevant",
      nombre: "Releevant",
      web: "https://www.releevant.com",
      sector: "IA / Personalización",
      desc: "IA aplicada a e-commerce y personalización de la experiencia de usuario.",
      tech: ["ML", "Recommender Systems", "NLP"],
      zonas: ["of5"],
      color: "#22c55e"
    },
    {
      id: "talestudios",
      nombre: "Tal Estudios",
      web: "https://www.talestudios.com",
      sector: "Producción Audiovisual",
      desc: "Productora audiovisual y de animación. Series y branded content.",
      tech: ["After Effects", "Premiere", "Cinema 4D", "DaVinci"],
      zonas: ["cw2"],
      color: "#06b6d4"
    },
    {
      id: "twindustry",
      nombre: "Tindustry",
      web: "https://www.twindustry.net",
      sector: "Industria 4.0",
      desc: "Soluciones de industria 4.0, simulación y gemelos digitales para el sector industrial.",
      tech: ["Unity", "IoT", "Digital Twin", "Simulación"],
      zonas: ["of3"],
      color: "#06b6d4"
    },
    {
      id: "underthebedgames",
      nombre: "Under the Bed Games",
      web: "https://underthebedgames.com",
      sector: "Videojuegos",
      desc: "Estudio independiente de videojuegos narrativos.",
      tech: ["Unity", "C#", "Narrative"],
      zonas: ["of2"],
      color: "#ef4444"
    },
    {
      id: "inone2",
      nombre: "Inone Lab",
      web: "https://www.inone.es",
      sector: "IA / I+D",
      desc: "Laboratorio de experimentación en inteligencia artificial aplicada al sector creativo.",
      tech: ["Generative AI", "Stable Diffusion", "LLM", "Computer Vision"],
      zonas: ["of5"],
      color: "#22c55e"
    }
  ];

  /* ---------- TAGS / ETIQUETAS (mapeo a categorías del mockup) ---------- */
  const tagsByEmpresa = {};
  empresas.forEach(function (e) {
    tagsByEmpresa[e.id] = [];
    if (/videojuego|game/i.test(e.sector)) tagsByEmpresa[e.id].push("videojuegos");
    if (/xr|realidad|metaverso/i.test(e.sector)) tagsByEmpresa[e.id].push("XR");
    if (/audiovisual|film|producci/i.test(e.sector)) tagsByEmpresa[e.id].push("audiovisual");
    if (/animaci|arte 3d/i.test(e.sector)) tagsByEmpresa[e.id].push("animación");
    if (/ia|inteligencia|artificial/i.test(e.sector)) tagsByEmpresa[e.id].push("IA");
    if (/edici|publicaci|narrativa|contenido/i.test(e.sector)) tagsByEmpresa[e.id].push("contenido digital");
    if (/ciberseguridad|seguridad/i.test(e.sector)) tagsByEmpresa[e.id].push("ciberseguridad");
    if (/simulaci/i.test(e.sector)) tagsByEmpresa[e.id].push("simulación");
    if (/marketing/i.test(e.sector)) tagsByEmpresa[e.id].push("marketing");
    if (/industria/i.test(e.sector)) tagsByEmpresa[e.id].push("industria 4.0");
    if (/film commission|ofic/i.test(e.sector)) tagsByEmpresa[e.id].push("institucional");
  });

  /* ---------- API pública ---------- */
  return {
    zonas: zonas,
    empresas: empresas,
    tagsByEmpresa: tagsByEmpresa,
    categoriaColor: categoriaColor,
    categoriaLabel: categoriaLabel,
    /* Helpers */
    getEmpresaById: function (id) {
      return empresas.find(function (e) { return e.id === id; });
    },
    getZonaById: function (id) {
      return zonas[id];
    },
    getEmpresasByZona: function (zonaId) {
      return empresas.filter(function (e) {
        return e.zonas.indexOf(zonaId) !== -1;
      });
    }
  };
})();
