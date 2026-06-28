const MAPAPOLO = {
  empresas: [
    { id: 'train64', nombre: '64Train', sector: 'Videojuegos', desc: 'Estudio de desarrollo de videojuegos indie especializado en juegos de estrategia y simulación.', tech: ['Unity', 'C#', 'Game Design', 'Pixel Art'], planta: 'primera', zona: 'despacho-3', web: 'https://64train.com', color: '#6366f1' },
    { id: 'ademass', nombre: 'Ademass', sector: 'Marketing Digital', desc: 'Agencia de marketing digital y producción de contenido para marcas del sector tecnológico.', tech: ['Marketing', 'Social Media', 'Branding', 'Producción'], planta: 'primera', zona: 'coworking', web: 'https://ademass.com', color: '#ec4899' },
    { id: 'bebite', nombre: 'Bebite', sector: 'Ciberseguridad', desc: 'Startup de ciberseguridad ofreciendo soluciones de protección de datos y auditoría de sistemas.', tech: ['Ciberseguridad', 'Auditoría', 'Pentesting', 'Cloud'], planta: 'baja', zona: 'modulo-2', web: 'https://bebyte.net', color: '#10b981' },
    { id: 'bestride', nombre: 'Best Ride Simulators', sector: 'Simulación', desc: 'Desarrollo de simuladores de conducción y realidad virtual para entrenamiento y entretenimiento.', tech: ['Realidad Virtual', 'Simulación', 'Unity', '3D Modeling'], planta: 'primera', zona: 'coworking', web: 'https://bestridesimulators.com', color: '#f59e0b' },
    { id: 'cienciavr', nombre: 'CienciaVR', sector: 'XR / Metaverso', desc: 'Creación de experiencias educativas en realidad virtual para museos, centros educativos y divulgación científica.', tech: ['VR', 'Educación', 'Unity', '3D', 'Narrativa'], planta: 'primera', zona: 'coworking', web: 'https://cienciavr.com', color: '#8b5cf6' },
    { id: 'cookingpub', nombre: 'Cooking & Publishing', sector: 'Contenido Editorial', desc: 'Producción de contenido editorial digital y publicaciones interactivas multiplataforma.', tech: ['Edición', 'Diseño editorial', 'HTML5', 'Multimedia'], planta: 'baja', zona: 'modulo-1', web: 'https://cookingandpublishing.com', color: '#ef4444' },
    { id: 'eartes', nombre: 'Eartes', sector: 'Arte Digital', desc: 'Plataforma de arte digital y NFT enfocada en la promoción de artistas emergentes.', tech: ['NFT', 'Blockchain', 'Arte Digital', '3D', 'Community'], planta: 'primera', zona: 'coworking', web: 'https://eartes.com', color: '#14b8a6' },
    { id: 'featlander', nombre: 'Featlander', sector: 'Videojuegos', desc: 'Desarrollo de videojuegos RPG con mundos abiertos y narrativas ramificadas.', tech: ['Unreal Engine 5', 'C++', 'RPG', 'Narrativa', '3D Art'], planta: 'primera', zona: 'despacho-4', web: 'https://featlander.com', color: '#a855f7' },
    { id: 'forgottenempires', nombre: 'Forgotten Empires', sector: 'Videojuegos', desc: 'Estudio de desarrollo conocido por su trabajo en la saga Age of Empires. Especialistas en estrategia en tiempo real.', tech: ['Game Design', 'Estrategia', 'Historia', 'Online'], planta: 'primera', zona: 'despacho-3', web: 'https://forgottenempires.net', color: '#3b82f6' },
    { id: 'gimnasioescenico', nombre: 'Gimnasio Escénico', sector: 'Artes Escénicas', desc: 'Espacio de creación escénica y performance que integra tecnología digital en sus producciones.', tech: ['Performance', 'Mapping', 'Live Cinema', 'Interactividad'], planta: 'baja', zona: 'aula-3', web: 'https://gimnasioescenico.com', color: '#f97316' },
    { id: 'heqate', nombre: 'Heqate', sector: 'Producción Audiovisual', desc: 'Productora audiovisual especializada en cine, publicidad y contenidos para plataformas digitales.', tech: ['Edición de video', 'Cámaras 8K', 'Postproducción', 'VFX'], planta: 'baja', zona: 'modulo-2', web: 'https://heqate.com', color: '#dc2626' },
    { id: 'inakin', nombre: 'Inakin', sector: 'Videojuegos', desc: 'Estudio de desarrollo de videojuegos con enfoque en serious games y gamificación educativa.', tech: ['Unity', 'C#', 'Serious Games', 'Gamificación'], planta: 'primera', zona: 'coworking', web: 'https://twitter.com/Inakin', color: '#eab308' },
    { id: 'inone', nombre: 'Inone', sector: 'Inteligencia Artificial', desc: 'Desarrollo de soluciones de inteligencia artificial para automatización de procesos empresariales.', tech: ['Machine Learning', 'IA', 'Automatización', 'Python', 'NLP'], planta: 'baja', zona: 'modulo-1', web: 'https://inone.es', color: '#06b6d4' },
    { id: 'krilloud', nombre: 'Krilloud', sector: 'Audio / Sound Design', desc: 'Plataforma de licencias de música y efectos de sonido para creadores de contenido, videojuegos y audiovisual.', tech: ['Sound Design', 'Música', 'Licencias', 'Audio', 'Plataforma'], planta: 'primera', zona: 'coworking', web: 'https://krilloud.com', color: '#84cc16' },
    { id: 'malagafilmoffice', nombre: 'Málaga Film Office', sector: 'Audiovisual', desc: 'Oficina municipal de apoyo a la producción audiovisual y cinematográfica en Málaga.', tech: ['Film Commission', 'Producción', 'Localizaciones', 'Permisos'], planta: 'baja', zona: 'promalaga', web: 'https://malagafilmoffice.com', color: '#0ea5e9' },
    { id: 'mickrea', nombre: 'Mickrea', sector: 'Realidad Mixta', desc: 'Desarrollo de aplicaciones de realidad mixta para industria, educación y entretenimiento.', tech: ['Mixed Reality', 'Hololens', 'Unity', '3D Scanning'], planta: 'primera', zona: 'lab-vr', web: 'https://mickrea.com', color: '#d946ef' },
    { id: 'pablocabrera', nombre: 'Pablo Becerra', sector: 'Arte 3D', desc: 'Artista 3D especializado en modelado de personajes y esculturas digitales para videojuegos y cine.', tech: ['ZBrush', 'Blender', 'Maya', '3D Modeling', 'Texturing'], planta: 'primera', zona: 'lab-3d', web: 'https://es.linkedin.com/in/pablo-becerra-lópez', color: '#7c3aed' },
    { id: 'murcielagos', nombre: 'Murciélagos', sector: 'Videojuegos', desc: 'Desarrollo de videojuegos indie con estética retro y mecánicas innovadoras.', tech: ['GameMaker', 'Pixel Art', 'Game Design', 'Retro'], planta: 'primera', zona: 'coworking', web: 'https://murcielagosmalaga.com', color: '#f43f5e' },
    { id: 'naolito', nombre: 'Naolito', sector: 'Animación', desc: 'Estudio de animación 2D/3D especializado en cortometrajes, series y contenido publicitario.', tech: ['Animation 2D', 'Animation 3D', 'Blender', 'Storyboard'], planta: 'primera', zona: 'despacho-3', web: 'https://naolito.com', color: '#f97316' },
    { id: 'novelingo', nombre: 'Novelingo', sector: 'Narrativa Digital', desc: 'Plataforma de narrativa interactiva y ficción digital para lectores y creadores.', tech: ['Narrativa', 'HTML5', 'Interactive Fiction', 'Web'], planta: 'primera', zona: 'coworking', web: 'https://novelingo.com', color: '#8b5cf6' },
    { id: 'owogame', nombre: 'OWO Game', sector: 'Videojuegos', desc: 'Desarrollo de videojuegos con integración de sensaciones hápticas para una experiencia inmersiva total.', tech: ['Game Development', 'Háptica', 'VR', 'Unity', 'Hardware'], planta: 'primera', zona: 'despacho-4', web: 'https://owogame.com', color: '#0891b2' },
    { id: 'prosfy', nombre: 'Prosfy', sector: 'Deportech', desc: 'Plataforma tecnológica para la gestión de clubs deportivos y conexión entre deportistas.', tech: ['Web App', 'Mobile', 'SaaS', 'Data Analytics'], planta: 'primera', zona: 'coworking', web: 'https://prosfy.com', color: '#22c55e' },
    { id: 'redvelgames', nombre: 'Red Vel Games', sector: 'Videojuegos', desc: 'Estudio de videojuegos indie centrado en narrativas emocionantes y arte visual único.', tech: ['Unity', 'C#', 'Game Design', 'Pixel Art', 'Narrativa'], planta: 'primera', zona: 'coworking', web: 'https://redvelgames.com', color: '#dc2626' },
    { id: 'releevant', nombre: 'Releevant', sector: 'Inteligencia Artificial', desc: 'Soluciones de IA para la optimización de procesos de recursos humanos y selección de talento.', tech: ['IA', 'Machine Learning', 'HR Tech', 'NLP', 'SaaS'], planta: 'baja', zona: 'modulo-1', web: 'https://releevant.com', color: '#6366f1' },
    { id: 'talestudios', nombre: 'Tal Estudios', sector: 'Audio Profesional', desc: 'Estudio de producción musical, diseño sonoro y postproducción de audio para cine y televisión.', tech: ['Sound Design', 'Mezcla', 'Masterizacion', 'Composición', 'Foley'], planta: 'primera', zona: 'lab-audio', web: 'https://talestudios.com', color: '#a855f7' },
    { id: 'twindustry', nombre: 'Tindustry', sector: 'Industria 4.0', desc: 'Consultoría tecnológica especializada en digitalización de procesos industriales y gemelos digitales.', tech: ['Digital Twin', 'IoT', 'Industria 4.0', '3D Simulation'], planta: 'baja', zona: 'modulo-2', web: 'https://twindustry.net', color: '#0d9488' },
    { id: 'underthebed', nombre: 'Under the Bed Games', sector: 'Videojuegos', desc: 'Estudio de videojuegos indie de terror y aventura gráfica con estilo artístico único.', tech: ['Unity', 'C#', 'Horror', '2D Art', 'Game Design'], planta: 'primera', zona: 'coworking', web: 'https://underthebedgames.com', color: '#1e293b' }
  ],

  espacios: {
    'recepcion': {
      id: 'recepcion', nombre: 'Recepción Principal', planta: 'baja',
      desc: 'Acceso principal al Polo Nacional de Contenidos Digitales. Punto de información y atención a visitantes.',
      tipo: 'comun',
      empresas: []
    },
    'agora': {
      id: 'agora', nombre: 'Ágora de Eventos', planta: 'baja',
      desc: 'Espacio central multiusos para eventos, charlas, pitch sessions, competiciones de esports y demo-days.',
      tipo: 'comun',
      empresas: []
    },
    'patio-1': {
      id: 'patio-1', nombre: 'Patio 1', planta: 'baja',
      desc: 'Patio interior con luz natural, ideal para networking y descanso entre reuniones.',
      tipo: 'comun',
      empresas: []
    },
    'patio-2': {
      id: 'patio-2', nombre: 'Patio 2', planta: 'baja',
      desc: 'Segundo patio interior del Polo, espacio abierto para eventos informales.',
      tipo: 'comun',
      empresas: []
    },
    'showroom': {
      id: 'showroom', nombre: 'Showroom', planta: 'baja',
      desc: 'Espacio de exhibición para que las empresas del Polo muestren sus productos y prototipos.',
      tipo: 'comun',
      empresas: []
    },
    'aula-1': {
      id: 'aula-1', nombre: 'Aula 1', planta: 'baja',
      desc: 'Aula de formación con equipamiento tecnológico para talleres y cursos.',
      tipo: 'formacion',
      empresas: []
    },
    'aula-2': {
      id: 'aula-2', nombre: 'Aula 2', planta: 'baja',
      desc: 'Aula de formación para programas de capacitación en desarrollo de software.',
      tipo: 'formacion',
      empresas: []
    },
    'aula-3': {
      id: 'aula-3', nombre: 'Aula 3', planta: 'baja',
      desc: 'Aula polivalente equipada para workshops y sesiones de coworking formativo.',
      tipo: 'formacion',
      empresas: ['gimnasioescenico']
    },
    'promalaga': {
      id: 'promalaga', nombre: 'Oficina Promálaga', planta: 'baja',
      desc: 'Oficinas del área de Promálaga, la agencia municipal de promoción empresarial.',
      tipo: 'institucional',
      empresas: ['malagafilmoffice']
    },
    'uma': {
      id: 'uma', nombre: 'Espacio UMA', planta: 'baja',
      desc: 'Aula universitaria gestionada por la Universidad de Málaga para programas de investigación y formación.',
      tipo: 'institucional',
      empresas: []
    },
    'modulo-1': {
      id: 'modulo-1', nombre: 'Módulo 1', planta: 'baja',
      desc: 'Módulo de empresas consolidadas especializadas en inteligencia artificial y datos.',
      tipo: 'oficina',
      empresas: ['cookingpub', 'inone', 'releevant']
    },
    'modulo-2': {
      id: 'modulo-2', nombre: 'Módulo 2', planta: 'baja',
      desc: 'Módulo de empresas consolidadas del sector audiovisual y la industria 4.0.',
      tipo: 'oficina',
      empresas: ['bebite', 'heqate', 'twindustry']
    },
    'coworking': {
      id: 'coworking', nombre: 'Go2Work Coworking', planta: 'primera',
      desc: 'Espacio de coworking abierto para startups y emprendedores. 40 puestos de trabajo con alta rotación y sinergias.',
      tipo: 'coworking',
      empresas: ['ademass', 'bestride', 'cienciavr', 'eartes', 'inakin', 'krilloud', 'murcielagos', 'novelingo', 'prosfy', 'redvelgames', 'underthebed']
    },
    'despacho-3': {
      id: 'despacho-3', nombre: 'Despacho 3', planta: 'primera',
      desc: 'Despacho para estudios de videojuegos y animación en fase de crecimiento.',
      tipo: 'oficina',
      empresas: ['train64', 'forgottenempires', 'naolito']
    },
    'despacho-4': {
      id: 'despacho-4', nombre: 'Despacho 4', planta: 'primera',
      desc: 'Despacho de producción audiovisual y desarrollo de videojuegos avanzados.',
      tipo: 'oficina',
      empresas: ['featlander', 'owogame']
    },
    'lab-vr': {
      id: 'lab-vr', nombre: 'Laboratorio VR & XR', planta: 'primera',
      desc: 'Laboratorio equipado con dispositivos de realidad virtual y extendida de última generación: Apple Vision Pro, Meta Quest 3, HoloLens.',
      tipo: 'laboratorio',
      empresas: ['mickrea']
    },
    'lab-audio': {
      id: 'lab-audio', nombre: 'Estudio de Grabación', planta: 'primera',
      desc: 'Estudio de grabación insonorizado con equipamiento profesional para producción musical, doblaje y diseño sonoro.',
      tipo: 'laboratorio',
      empresas: ['talestudios']
    },
    'lab-3d': {
      id: 'lab-3d', nombre: 'Lab. Impresión 3D', planta: 'primera',
      desc: 'Laboratorio de prototipado con 20 impresoras 3D (FDM y resina), escáneres 3D y cortadora láser.',
      tipo: 'laboratorio',
      empresas: ['pablocabrera']
    },
    'lab-video': {
      id: 'lab-video', nombre: 'Estudio de Vídeo', planta: 'primera',
      desc: 'Plató de grabación con cromas, iluminación profesional y cámaras 8K para producciones audiovisuales.',
      tipo: 'laboratorio',
      empresas: []
    }
  },

  sinergias: [
    { de: 'train64', con: ['krilloud', 'murcielagos', 'naolito', 'talestudios'], motivo: 'Colaboración en audio y arte para videojuegos indie.' },
    { de: 'forgottenempires', con: ['train64', 'featlander'], motivo: 'Sinergia en desarrollo de estrategia y narrativa histórica.' },
    { de: 'cienciavr', con: ['mickrea', 'bestride'], motivo: 'Desarrollo conjunto de experiencias VR educativas e inmersivas.' },
    { de: 'mickrea', con: ['cienciavr', 'featlander'], motivo: 'Integración de realidad mixta en experiencias interactivas.' },
    { de: 'inone', con: ['releevant', 'bebite'], motivo: 'IA y datos: colaboración en automatización inteligente.' },
    { de: 'releevant', con: ['inone', 'prosfy'], motivo: 'Soluciones IA aplicadas a HR tech y deportes.' },
    { de: 'krilloud', con: ['talestudios', 'heqate', 'train64'], motivo: 'Ecosistema de audio: licencias, producción y diseño sonoro.' },
    { de: 'talestudios', con: ['krilloud', 'heqate', 'owogame'], motivo: 'Postproducción de audio para videojuegos y audiovisual.' },
    { de: 'heqate', con: ['talestudios', 'malagafilmoffice'], motivo: 'Producción audiovisual con apoyo institucional.' },
    { de: 'featlander', con: ['mickrea', 'owogame', 'train64'], motivo: 'Videojuegos avanzados con realidad mixta y háptica.' },
    { de: 'owogame', con: ['featlander', 'talestudios'], motivo: 'Integración de háptica y audio avanzado en videojuegos.' },
    { de: 'naolito', con: ['train64', 'heqate'], motivo: 'Animación 2D/3D para videojuegos y producción audiovisual.' },
    { de: 'eartes', con: ['naolito', 'pablocabrera'], motivo: 'Arte digital, NFT y escultura 3D.' },
    { de: 'pablocabrera', con: ['eartes', 'featlander'], motivo: 'Modelado 3D para arte digital y videojuegos.' },
    { de: 'gimnasioescenico', con: ['heqate', 'novelingo'], motivo: 'Performance digital con producción audiovisual y narrativa.' },
    { de: 'novelingo', con: ['gimnasioescenico', 'cienciavr'], motivo: 'Narrativa interactiva aplicada a VR y artes escénicas.' },
    { de: 'twindustry', con: ['inone', 'bestride'], motivo: 'Gemelos digitales e IA para simulación industrial.' },
    { de: 'bebite', con: ['inone', 'cookingpub'], motivo: 'Seguridad digital para plataformas de contenido.' },
    { de: 'prosfy', con: ['releevant', 'bestride'], motivo: 'Tecnología deportiva con datos y simulación.' },
    { de: 'murcielagos', con: ['train64', 'redvelgames'], motivo: 'Videojuegos indie con estética retro y narrativa única.' },
    { de: 'redvelgames', con: ['murcielagos', 'krilloud'], motivo: 'Colaboración en arte, música y game design indie.' },
    { de: 'underthebed', con: ['krilloud', 'redvelgames'], motivo: 'Videojuegos de terror: audio ambiental y arte oscuro.' },
    { de: 'malagafilmoffice', con: ['heqate', 'featlander'], motivo: 'Apoyo a producciones audiovisuales y locales de rodaje.' },
    { de: 'ademass', con: ['krilloud', 'eartes'], motivo: 'Marketing digital para marcas de audio, arte y tecnología.' },
    { de: 'bestride', con: ['cienciavr', 'twindustry'], motivo: 'Simulación VR aplicada a entretenimiento e industria.' },
    { de: 'cookingpub', con: ['inone', 'novelingo'], motivo: 'Contenido editorial digital con IA y narrativa interactiva.' }
  ]
};

MAPAPOLO.getEmpresasEnEspacio = function (espacioId) {
  const espacio = this.espacios[espacioId];
  if (!espacio) return [];
  return (espacio.empresas || []).map(id => this.empresas.find(e => e.id === id)).filter(Boolean);
};

MAPAPOLO.getSinergias = function (empresaId) {
  const resultado = [];
  this.sinergias.forEach(s => {
    if (s.de === empresaId) {
      s.con.forEach(conId => {
        const con = this.empresas.find(e => e.id === conId);
        if (con) resultado.push({ desde: null, hacia: con, motivo: s.motivo });
      });
    }
    if (s.con.includes(empresaId)) {
      const desde = this.empresas.find(e => e.id === s.de);
      if (desde) resultado.push({ desde, hacia: null, motivo: s.motivo });
    }
  });
  return resultado;
};

MAPAPOLO.getEmpresasPorPlanta = function (planta) {
  const ids = Object.values(this.espacios)
    .filter(e => e.planta === planta)
    .flatMap(e => e.empresas || []);
  return [...new Set(ids)].map(id => this.empresas.find(e => e.id === id)).filter(Boolean);
};
