// ============================================================
// MAPAPOLO — Datos de empresas y espacios del Polo Nacional
// de Contenidos Digitales de Málaga
// Fuente: polodigital.eu/habitantes + PDFs de Bases 2026
// ============================================================

const EMPRESAS = [
  {
    id: "64train",
    nombre: "64Train",
    logo: null,
    sector: "Videojuegos",
    descripcion: "Desarrollo de videojuegos indie con enfoque en experiencias narrativas y pixel art retro.",
    tecnologias: ["Unity", "C#", "Pixel Art", "Game Design"],
    planta: "primera",
    zona: "zona-coworking",
    web: "https://64train.com",
    sinergias: ["forgotten", "murcielagos", "owogame", "indiedevs"]
  },
  {
    id: "ademass",
    nombre: "Ademass",
    logo: null,
    sector: "Marketing Digital",
    descripcion: "Agencia de marketing digital especializada en videojuegos y entretenimiento digital.",
    tecnologias: ["Marketing", "Social Media", "Community Management", "Analytics"],
    planta: "baja",
    zona: "zona-oficinas-baja",
    web: "https://ademass.com",
    sinergias: ["mickrea", "redvel"]
  },
  {
    id: "bebyte",
    nombre: "Bebite",
    logo: null,
    sector: "Ciberseguridad",
    descripcion: "Soluciones de ciberseguridad y protección de datos para empresas del sector tecnológico.",
    tecnologias: ["Ciberseguridad", "Penetration Testing", "Auditoría", "Blockchain"],
    planta: "baja",
    zona: "zona-aula2",
    web: "https://bebyte.net",
    sinergias: ["inone", "heqate"]
  },
  {
    id: "bestride",
    nombre: "Best Ride Simulators",
    logo: null,
    sector: "Simulación",
    descripcion: "Simuladores de conducción y realidad virtual para formación y entretenimiento.",
    tecnologias: ["Simulación", "VR", "Hardware", "Unreal Engine"],
    planta: "primera",
    zona: "zona-lab-vr",
    web: "https://bestridesimulators.com",
    sinergias: ["cienciavr", "mickrea", "twindustry"]
  },
  {
    id: "cienciavr",
    nombre: "CienciaVR",
    logo: null,
    sector: "Educación VR",
    descripcion: "Contenido educativo inmersivo en realidad virtual para centros de enseñanza.",
    tecnologias: ["Realidad Virtual", "Unity", "C#", "Educación"],
    planta: "primera",
    zona: "zona-lab-vr",
    web: "https://cienciavr.com",
    sinergias: ["bestride", "mickrea", "64train", "owogame"]
  },
  {
    id: "cooking",
    nombre: "Cooking & Publishing",
    logo: null,
    sector: "Edición Digital",
    descripcion: "Editorial digital y producción de contenido editorial interactivo.",
    tecnologias: ["Editorial", "Diseño Gráfico", "DTP", "Multimedia"],
    planta: "baja",
    zona: "zona-oficinas-baja",
    web: "https://www.cookingandpublishing.com",
    sinergias: ["naolito", "novelingo"]
  },
  {
    id: "eartes",
    nombre: "Eartes",
    logo: null,
    sector: "Arte Digital",
    descripcion: "Producción artística digital y creación de contenido visual para medios interactivos.",
    tecnologias: ["Arte Digital", "Diseño", "Ilustración", "Concept Art"],
    planta: "primera",
    zona: "zona-despachos",
    web: "https://www.eartes.com",
    sinergias: ["naolito", "pablo", "eartes"]
  },
  {
    id: "featlander",
    nombre: "Featlander",
    logo: null,
    sector: "Videojuegos",
    descripcion: "Desarrollo de videojuegos con énfasis en jugabilidad innovadora y experiencias únicas.",
    tecnologias: ["Unreal Engine", "C++", "Game Design", "Narrativa"],
    planta: "primera",
    zona: "zona-despachos",
    web: "https://featlander.com",
    sinergias: ["forgotten", "64train", "underbed"]
  },
  {
    id: "forgotten",
    nombre: "Forgotten Empires",
    logo: null,
    sector: "Videojuegos AAA",
    descripcion: "Estudio de desarrollo de videojuegos AAA, creadores de Age of Empires Definitive Edition.",
    tecnologias: ["C++", "DirectX", "Game Design", "IA", "Redes"],
    planta: "baja",
    zona: "zona-modulos-baja",
    web: "https://www.forgottenempires.net",
    sinergias: ["64train", "featlander", "underbed", "redvel"]
  },
  {
    id: "gimnasio",
    nombre: "Gimnasio Escénico",
    logo: null,
    sector: "Artes Escénicas",
    descripcion: "Espacio de artes escénicas y performance digital para eventos y shows.",
    tecnologias: ["Performance", "Motion Capture", "Audio", "Iluminación"],
    planta: "baja",
    zona: "zona-agora",
    web: "https://gimnasioescenico.com",
    sinergias: ["heqate", "tal"]
  },
  {
    id: "heqate",
    nombre: "Heqate",
    logo: null,
    sector: "Producción Audiovisual",
    descripcion: "Producción audiovisual, postproducción y efectos especiales para cine y televisión.",
    tecnologias: ["VFX", "Edición", "DaVinci Resolve", "After Effects", "Cámaras 4K"],
    planta: "primera",
    zona: "zona-lab-audio",
    web: "https://heqate.com",
    sinergias: ["tal", "malagafilm", "gimnasio", "eartes"]
  },
  {
    id: "inakin",
    nombre: "Inakin",
    logo: null,
    sector: "Videojuegos",
    descripcion: "Desarrollo de videojuegos con enfoque en IA procedural y generación de contenido.",
    tecnologias: ["IA", "Procedural Generation", "Unity", "Python"],
    planta: "primera",
    zona: "zona-despachos",
    web: "https://twitter.com/Inakin",
    sinergias: ["inone", "releevant", "64train"]
  },
  {
    id: "inone",
    nombre: "InOne",
    logo: null,
    sector: "Inteligencia Artificial",
    descripcion: "Soluciones de IA aplicada a videojuegos y contenido interactivo.",
    tecnologias: ["Machine Learning", "Deep Learning", "Python", "TensorFlow"],
    planta: "baja",
    zona: "zona-aula2",
    web: "https://www.inone.es",
    sinergias: ["releevant", "inakin", "bebyte"]
  },
  {
    id: "krilloud",
    nombre: "Krilloud",
    logo: null,
    sector: "Audio / Sound Design",
    descripcion: "Diseño sonoro y producción de audio inmersivo para videojuegos y realidad virtual.",
    tecnologias: ["Wwise", "FMOD", "Sound Design", "Audio Middleware"],
    planta: "primera",
    zona: "zona-lab-audio",
    web: "https://krilloud.com",
    sinergias: ["tal", "heqate", "64train", "murcielagos"]
  },
  {
    id: "malagafilm",
    nombre: "Málaga Film Office",
    logo: null,
    sector: "Cine / Film Commission",
    descripcion: "Oficina de cine de Málaga, promoción audiovisual y facilitación de rodajes.",
    tecnologias: ["Producción", "Film Commission", "Locaciones", "Networking"],
    planta: "baja",
    zona: "zona-oficinas-baja",
    web: "https://www.malagafilmoffice.com",
    sinergias: ["heqate", "tal", "eartes"]
  },
  {
    id: "mickrea",
    nombre: "Mickrea",
    logo: null,
    sector: "Realidad Mixta",
    descripcion: "Desarrollo de experiencias de realidad mixta y extendida para empresas.",
    tecnologias: ["AR", "MR", "Unity", "Apple Vision Pro", "Meta Quest"],
    planta: "primera",
    zona: "zona-lab-vr",
    web: "https://mickrea.com",
    sinergias: ["bestride", "cienciavr", "owogame"]
  },
  {
    id: "pablo",
    nombre: "Pablo Becerra",
    logo: null,
    sector: "3D / Arte Digital",
    descripcion: "Artista 3D especializado en personajes y modelos para videojuegos y animación.",
    tecnologias: ["Blender", "Maya", "ZBrush", "Substance Painter"],
    planta: "primera",
    zona: "zona-despachos",
    web: "https://linkedin.com/in/pablo-becerra-lópez",
    sinergias: ["eartes", "naolito", "redvel"]
  },
  {
    id: "murcielagos",
    nombre: "Murciélagos Games",
    logo: null,
    sector: "Videojuegos",
    descripcion: "Estudio de desarrollo de videojuegos independientes con enfoque en terror y misterio.",
    tecnologias: ["Unity", "C#", "Narrativa", "Horror"],
    planta: "primera",
    zona: "zona-despachos",
    web: "https://murcielagosmalaga.com",
    sinergias: ["64train", "krilloud", "underbed", "owogame"]
  },
  {
    id: "naolito",
    nombre: "Naolito",
    logo: null,
    sector: "Animación",
    descripcion: "Estudio de animación 2D y motion graphics para contenido digital y publicidad.",
    tecnologias: ["After Effects", "Illustrator", "Motion Graphics", "Animación 2D"],
    planta: "baja",
    zona: "zona-oficinas-baja",
    web: "https://www.naolito.com",
    sinergias: ["eartes", "pablo", "cooking", "heqate"]
  },
  {
    id: "novelingo",
    nombre: "Novelingo",
    logo: null,
    sector: "Narrativa Digital",
    descripcion: "Plataforma de narrativa interactiva y storytelling digital para marcas.",
    tecnologias: ["Narrativa", "Escritura Creativa", "Games", "Interactividad"],
    planta: "baja",
    zona: "zona-aula2",
    web: "https://www.novelingo.com",
    sinergias: ["cooking", "64train", "featlander"]
  },
  {
    id: "owogame",
    nombre: "OWO Game",
    logo: null,
    sector: "Videojuegos",
    descripcion: "Desarrollo de videojuegos con tecnología háptica y experiencias inmersivas.",
    tecnologias: ["Haptic Feedback", "Unity", "C#", "Wearables"],
    planta: "primera",
    zona: "zona-coworking",
    web: "https://owogame.com",
    sinergias: ["mickrea", "bestride", "cienciavr", "64train"]
  },
  {
    id: "prosfy",
    nombre: "Prosfy",
    logo: null,
    sector: "Fintech / Deportes",
    descripcion: "Plataforma fintech para gestión de patrocinios deportivos con IA.",
    tecnologias: ["IA", "Python", "Data Analytics", "Fintech"],
    planta: "baja",
    zona: "zona-modulos-baja",
    web: "https://prosfy.com",
    sinergias: ["inone", "releevant", "bebyte"]
  },
  {
    id: "redvel",
    nombre: "Red Vel Games",
    logo: null,
    sector: "Videojuegos",
    descripcion: "Estudio de desarrollo de videojuegos casuales y mobile con enfoque social.",
    tecnologias: ["Unity", "C#", "Mobile", "Game Design"],
    planta: "primera",
    zona: "zona-despachos",
    web: "https://redvelgames.com",
    sinergias: ["64train", "forgotten", "pablo", "naolito"]
  },
  {
    id: "releevant",
    nombre: "Releevant",
    logo: null,
    sector: "Inteligencia Artificial",
    descripcion: "Soluciones de IA y machine learning aplicadas a contenido digital y automatización.",
    tecnologias: ["Machine Learning", "NLP", "Python", "LLM"],
    planta: "baja",
    zona: "zona-modulos-baja",
    web: "https://www.releevant.com",
    sinergias: ["inone", "inakin", "prosfy"]
  },
  {
    id: "tal",
    nombre: "Tal Estudios",
    logo: null,
    sector: "Audio Profesional",
    descripcion: "Estudio de grabación profesional, doblaje, locución y mezcla de audio.",
    tecnologias: ["Pro Tools", "Grabación", "Doblaje", "Mezcla", "Podcast"],
    planta: "primera",
    zona: "zona-lab-audio",
    web: "https://www.talestudios.com",
    sinergias: ["krilloud", "heqate", "64train", "murcielagos"]
  },
  {
    id: "twindustry",
    nombre: "Twindustry",
    logo: null,
    sector: "Industria 4.0",
    descripcion: "Digital twin y gemelos digitales industriales con tecnología de simulación avanzada.",
    tecnologias: ["Digital Twin", "IoT", "Simulación", "Unreal Engine"],
    planta: "primera",
    zona: "zona-despachos",
    web: "https://twindustry.net",
    sinergias: ["bestride", "heqate", "inone"]
  },
  {
    id: "underbed",
    nombre: "Under the Bed Games",
    logo: null,
    sector: "Videojuegos",
    descripcion: "Estudio indie de videojuegos con enfoque en historias de terror y suspense.",
    tecnologias: ["Unity", "Unreal Engine", "Narrativa", "Horror"],
    planta: "primera",
    zona: "zona-despachos",
    web: "https://underthebedgames.com",
    sinergias: ["forgotten", "featlander", "murcielagos", "krilloud"]
  }
];

// ============================================================
// Espacios físicos del Polo
// ============================================================

const ESPACIOS = {
  // --- PLANTA BAJA ---
  "recepcion": {
    titulo: "Recepción Principal",
    planta: "baja",
    tipo: "zona-comun",
    descripcion: "Acceso principal del edificio Tabacalera E3. Punto de control y atención al visitante. Aquí comienza tu ruta por el Polo.",
    capacidad: "Variable",
    equipamiento: ["Información", "Control de acceso", "Tótem interactivo"],
    empresas: [],
    sinergias: ["Escanea el código QR del tótem para generar una ruta personalizada hasta la empresa que buscas."]
  },
  "agora": {
    titulo: "Ágora de Eventos",
    planta: "baja",
    tipo: "zona-comun",
    descripcion: "Zona central abierta para ponencias, pitchs, competiciones de esports, demo-days y eventos de networking.",
    capacidad: "200 personas",
    equipamiento: ["Escenario", "Pantalla LED", "Sonido", "Iluminación"],
    empresas: [],
    sinergias: ["Ideal para eventos de networking entre startups y empresas consolidadas. La IA sugiere organizar 'Matchmaking Rápido' coincidiendo con eventos semanales."]
  },
  "showroom": {
    titulo: "Showroom",
    planta: "baja",
    tipo: "zona-comun",
    descripcion: "Espacio de exposición y demostración de proyectos tecnológicos del Polo.",
    capacidad: "50 personas",
    equipamiento: ["Pantallas", "Expositores", "VR Stations"],
    empresas: [],
    sinergias: ["Las empresas pueden presentar aquí sus productos a inversores y visitantes internacionales."]
  },
  "aula1": {
    titulo: "Aula 1",
    planta: "baja",
    tipo: "aula",
    descripcion: "Aula de formación tecnológica principal. Aquí se imparten cursos de programación, diseño y desarrollo.",
    capacidad: "30 personas",
    equipamiento: ["Puestos de trabajo", "Pantalla", "Proyector"],
    empresas: [],
    sinergias: ["Las empresas del Polo pueden tutorizar proyectos finales de los alumnos para captar talento joven."]
  },
  "aula2": {
    titulo: "Aula 2",
    planta: "baja",
    tipo: "aula",
    descripcion: "Aula de formación secundaria, gestionada por la Universidad de Málaga para cátedras de tecnología.",
    capacidad: "30 personas",
    equipamiento: ["Puestos de trabajo", "Pantalla", "Proyector"],
    empresas: [],
    sinergias: ["Subcontratar estudios de viabilidad técnica o auditorías de seguridad con los investigadores residentes."]
  },
  "aula3": {
    titulo: "Aula 3",
    planta: "baja",
    tipo: "aula",
    descripcion: "Aula de formación especializada en diseño y creación digital.",
    capacidad: "25 personas",
    equipamiento: ["Tabletas gráficas", "Pantalla", "Software de diseño"],
    empresas: [],
    sinergias: ["Cursos de ilustración digital y concept art para artistas del Polo."]
  },
  "aula4": {
    titulo: "Aula 4",
    planta: "baja",
    tipo: "aula",
    descripcion: "Aula dedicada a formación en IA y machine learning.",
    capacidad: "25 personas",
    equipamiento: ["GPU Stations", "Pantalla", "Software de ML"],
    empresas: [],
    sinergias: ["Talleres de IA generativa para empresas del sector audiovisual y gaming."]
  },
  "aula5": {
    titulo: "Aula 5",
    planta: "baja",
    tipo: "aula",
    descripcion: "Aula de formación en ciberseguridad y redes.",
    capacidad: "25 personas",
    equipamiento: ["Laboratorio de redes", "Pantalla", "Herramientas de auditoría"],
    empresas: [],
    sinergias: ["Cursos de ethical hacking para startups del Polo."]
  },
  "aula6": {
    titulo: "Aula 6",
    planta: "baja",
    tipo: "aula",
    descripcion: "Aula multiusos para talleres y sesiones de trabajo colaborativo.",
    capacidad: "30 personas",
    equipamiento: ["Mesas modulares", "Pantalla", "Pizarra digital"],
    empresas: [],
    sinergias: ["Sesiones de brainstorming entre equipos de diferentes empresas."]
  },
  "modulo1": {
    titulo: "Módulo 1 — Empresas Consolidadas",
    planta: "baja",
    tipo: "oficina",
    descripcion: "Oficinas privadas para empresas consolidadas del sector IA y tecnología de datos.",
    capacidad: "10-15 personas",
    equipamiento: ["Oficina privada", "Sala de reuniones", "Servidor"],
    empresas: ["forgotten", "inone", "releevant", "prosfy"],
    sinergias: ["Cluster de IA y datos: estas empresas pueden compartir herramientas de ML y crear pipelines de datos conjuntos."]
  },
  "modulo2": {
    titulo: "Módulo 2 — Empresas Consolidadas",
    planta: "baja",
    tipo: "oficina",
    descripcion: "Oficinas privadas para empresas consolidadas del sector audiovisual y contenido 3D.",
    capacidad: "10-15 personas",
    equipamiento: ["Oficina privada", "Sala de reuniones", "GPU Rendering"],
    empresas: ["ademass", "cooking", "malagafilm", "naolito"],
    sinergias: ["Cluster de contenido: producción audiovisual, diseño editorial y marketing digital bajo un mismo techo."]
  },
  "patio1": {
    titulo: "Patio 1",
    planta: "baja",
    tipo: "zona-comun",
    descripcion: "Patio interior ajardinado para descanso y networking informal.",
    capacidad: "Variable",
    equipamiento: ["Bancos", "Zona de sombra", "Cafetería"],
    empresas: [],
    sinergias: ["Encuentros espontáneos entre profesionales. La IA sugiere organizar 'coffee meetings' cruzados entre sectores."]
  },
  "patio2": {
    titulo: "Patio 2",
    planta: "baja",
    tipo: "zona-comun",
    descripcion: "Segundo patio interior con zona de comedor y kitchenette.",
    capacidad: "Variable",
    equipamiento: ["Mesas", "Kitchenette", "Zona de comedor"],
    empresas: [],
    sinergias: ["Zona ideal para almuerzos de networking entre startups de diferentes plantas."]
  },

  // --- PLANTA PRIMERA ---
  "coworking": {
    titulo: "Go2Work — Coworking",
    planta: "primera",
    tipo: "coworking",
    descripcion: "Espacio compartido de alto rendimiento para startups emergentes y proyectos en fase semilla. Mesa caliente y escritorios asignados.",
    capacidad: "40 personas",
    equipamiento: ["Escritorios", "Wi-Fi", "Monitor compartido", "Cafetería"],
    empresas: ["64train", "owogame"],
    sinergias: ["Las startups del coworking comparten licencias de software, herramientas de project management y conocimiento técnico."]
  },
  "lab-vr": {
    titulo: "Laboratorio de Realidad Virtual (VR/XR)",
    planta: "primera",
    tipo: "laboratorio",
    descripcion: "Espacio equipado con dispositivos de última generación: Apple Vision Pro, Meta Quest 3, HTC Vive, y más para pruebas de concepto.",
    capacidad: "10 personas",
    equipamiento: ["Apple Vision Pro", "Meta Quest 3", "HTC Vive", "Tracking óptico"],
    empresas: ["bestride", "cienciavr", "mickrea"],
    sinergias: ["Cualquier startup de videojuegos puede solicitar tests cruzados. La IA sugiere agendar sesiones de testeo de control gestual."]
  },
  "lab-audio": {
    titulo: "Estudio de Grabación de Audio",
    planta: "primera",
    tipo: "laboratorio",
    descripcion: "Estudio acústicamente aislado con equipamiento profesional de mezcla, grabación y doblaje de voz.",
    capacidad: "5 personas",
    equipamiento: ["Pro Tools", "Mezclador", "Micrófonos profesionales", "Cabinas de grabación"],
    empresas: ["krilloud", "tal", "heqate"],
    sinergias: ["Conexión directa con estudios de videojuegos para la composición de bandas sonoras y efectos foley."]
  },
  "lab-3d": {
    titulo: "Laboratorio de Prototipado 3D",
    planta: "primera",
    tipo: "laboratorio",
    descripcion: "Área técnica con casi una veintena de impresoras 3D (FDM y resina), escáneres y cortadora láser.",
    capacidad: "8 personas",
    equipamiento: ["Impresoras FDM", "Impresoras Resina", "Escáner 3D", "Cortadora Láser"],
    empresas: [],
    sinergias: ["Soporte para merchandising 3D, prototipos de hardware y piezas de escenografía para eventos del Ágora."]
  },
  "lab-video": {
    titulo: "Estudio de Grabación de Video",
    planta: "primera",
    tipo: "laboratorio",
    descripcion: "Estudio de grabación con cámaras 8K, cromas, estructuras de iluminación y postproducción.",
    capacidad: "15 personas",
    equipamiento: ["Cámaras 8K", "Cromas", "Iluminación LED", "Edición en tiempo real"],
    empresas: ["heqate", "malagafilm"],
    sinergias: ["Producción de contenido promocional para las startups del Polo y grabación de demos de videojuegos."]
  },
  "despacho3": {
    titulo: "Despacho 3",
    planta: "primera",
    tipo: "oficina",
    descripcion: "Despacho privado de desarrollo para estudios en crecimiento.",
    capacidad: "5-8 personas",
    equipamiento: ["Escritorios", "Pantallas", "Servidor local"],
    empresas: ["murcielagos", "eartes", "pablo"],
    sinergias: ["Cluster creativo: artistas y desarrolladores de videojuegos trabajando en sinergia."]
  },
  "despacho4": {
    titulo: "Despacho 4",
    planta: "primera",
    tipo: "oficina",
    descripcion: "Despacho de producción multimedia y cinematografía digital.",
    capacidad: "5-8 personas",
    equipamiento: ["Escritorios", "Pantallas", "Estación de edición"],
    empresas: ["featlander", "redvel", "inakin", "twindustry"],
    sinergias: ["Producción de contenido: videojuegos, gemelos digitales y experiencias inmersivas."]
  },
  "despacho5": {
    titulo: "Despacho 5",
    planta: "primera",
    tipo: "oficina",
    descripcion: "Oficina para proyectos de investigación y desarrollo tecnológico.",
    capacidad: "5-8 personas",
    equipamiento: ["Escritorios", "GPU Stations", "Pantallas"],
    empresas: ["underbed", "novelingo"],
    sinergias: ["Investigación narrativa y desarrollo de historias interactivas."]
  },
  "recepcion2": {
    titulo: "Recepción Planta Primera",
    planta: "primera",
    tipo: "zona-comun",
    descripcion: "Punto de acceso a la Planta Primera desde las escaleras o ascensor.",
    capacidad: "Variable",
    equipamiento: ["Información", "Display interactivo"],
    empresas: [],
    sinergias: ["Punto de inicio para visitar los laboratorios y zonas de coworking."]
  }
};

// ============================================================
// Sinergias predefinidas (por si la búsqueda automática falla)
// ============================================================

const SINERGIAS_PREDEFINIDAS = [
  {
    empresa1: "forgotten",
    empresa2: "krilloud",
    razon: "Forgotten Empires necesita diseño sonoro AAA para sus estrategias; Krilloud es especialista en audio middleware para videojuegos.",
    tipo: "complementaria",
    score: 92
  },
  {
    empresa1: "cienciavr",
    empresa2: "tal",
    razon: "CienciaVR necesita doblaje profesional para sus experiencias educativas en VR; Tal Estudios tiene cabinas de grabación especializadas.",
    tipo: "complementaria",
    score: 88
  },
  {
    empresa1: "64train",
    empresa2: "krilloud",
    razon: "64Train desarrolla videojuegos indie que necesitan sound design inmersivo; Krilloud puede proporcionar audio middleware y efectos.",
    tipo: "complementaria",
    score: 85
  },
  {
    empresa1: "bestride",
    empresa2: "heqate",
    razon: "Best Ride Simulators necesita grabar video de referencia para sus simuladores; Heqate tiene el equipamiento de grabación profesional.",
    tipo: "complementaria",
    score: 82
  },
  {
    empresa1: "mickrea",
    empresa2: "owogame",
    razon: "Mickrea desarrolla hardware háptico que puede integrarse con las experiencias de realidad mixta de OWO Game.",
    tipo: "complementaria",
    score: 80
  },
  {
    empresa1: "pablo",
    empresa2: "forgotten",
    razon: "Pablo Becerra es artista 3D especializado en personajes; Forgotten Empires necesita assets de alta calidad para sus juegos.",
    tipo: "complementaria",
    score: 90
  },
  {
    empresa1: "inone",
    empresa2: "inakin",
    razon: "InOne tiene expertise en IA aplicada; Inakin busca integrar IA procedural en sus videojuegos.",
    tipo: "complementaria",
    score: 87
  },
  {
    empresa1: "heqate",
    empresa2: "malagafilm",
    razon: "Ambas empresas comparten el ecosistema audiovisual de Málaga; colaboración en postproducción y VFX.",
    tipo: "colaborativa",
    score: 85
  },
  {
    empresa1: "underbed",
    empresa2: "murcielagos",
    razon: "Ambos estudios se especializan en videojuegos de terror; pueden compartir assets, técnicas de narrativa y testing cruzado.",
    tipo: "colaborativa",
    score: 78
  },
  {
    empresa1: "naolito",
    empresa2: "eartes",
    razon: "Naolito hace animación 2D y motion graphics; Eartes se enfoca en arte digital conceptual. Complementan en pipeline de producción.",
    tipo: "complementaria",
    score: 75
  },
  {
    empresa1: "releevant",
    empresa2: "prosfy",
    razon: "Releevant tiene expertise en NLP y LLM; Prosfy necesita IA para analizar datos de patrocinios deportivos.",
    tipo: "complementaria",
    score: 83
  },
  {
    empresa1: "twindustry",
    empresa2: "bestride",
    razon: "Twindustry trabaja en gemelos digitales industriales; Best Ride tiene experiencia en simulación y hardware.",
    tipo: "complementaria",
    score: 79
  },
  {
    empresa1: "redvel",
    empresa2: "pablo",
    razon: "Red Vel Games necesita artistas 3D para sus juegos mobile; Pablo puede crear assets estilo stylized.",
    tipo: "complementaria",
    score: 76
  },
  {
    empresa1: "featlander",
    empresa2: "underbed",
    razon: "Ambos buscan narrativa innovadora; pueden co-desarrollar experiencias narrativas experimentales.",
    tipo: "colaborativa",
    score: 74
  },
  {
    empresa1: "cooking",
    empresa2: "novelingo",
    razon: "Cooking edita contenido digital; Novelingo crea narrativa interactiva. Juntos pueden producir libros/gamebooks digitales.",
    tipo: "complementaria",
    score: 72
  }
];

// ============================================================
// Mapa de categorías para el buscador
// ============================================================

const CATEGORIAS = {
  "videojuegos": ["64train", "featlander", "forgotten", "inakin", "murcielagos", "owogame", "redvel", "underbed"],
  "realidad virtual": ["bestride", "cienciavr", "mickrea"],
  "audio": ["krilloud", "tal", "heqate"],
  "ia": ["inone", "releevant", "prosfy"],
  "animacion": ["naolito", "eartes", "pablo"],
  "audiovisual": ["heqate", "malagafilm", "tal"],
  "3d": ["pablo", "eartes", "bestride"],
  "formacion": ["aula1", "aula2", "aula3", "aula4", "aula5", "aula6"],
  "coworking": ["coworking"],
  "laboratorios": ["lab-vr", "lab-audio", "lab-3d", "lab-video"]
};
