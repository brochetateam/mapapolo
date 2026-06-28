// ============================================================
// MAPAPOLO — Motor de Búsqueda Semántica Simulada
// Sistema de scoring contextual sin servidor
// ============================================================

const Buscador = (() => {

  // Diccionario de sinónimos y relaciones semánticas
  const sinonimos = {
    // Audio / Sonido
    "audio": ["sonido", "grabación", "grabar", "mezcla", "doblaje", "locución", "voz", "banda sonora", "efectos", "foley", "podcast", "música"],
    "sonido": ["audio", "grabación", "mezcla", "doblaje", "efectos"],
    "doblaje": ["audio", "voz", "grabación", "locución"],
    "podcast": ["audio", "grabación", "locución"],

    // Videojuegos
    "videojuegos": ["juego", "gaming", "gameplay", "indie", "mobile", "consola", "pc"],
    "juego": ["videojuegos", "gaming", "gameplay"],
    "gaming": ["videojuegos", "esports", "competición"],

    // VR / AR / XR
    "vr": ["realidad virtual", "virtual", "inmersivo", "headset", "quest", "vision pro"],
    "realidad virtual": ["vr", "inmersivo", "xr", "metaverso"],
    "ar": ["realidad aumentada", "augmented", "hololens"],
    "realidad aumentada": ["ar", "augmented"],
    "xr": ["realidad mixta", "realidad extendida", "vr", "ar", "mixed reality"],
    "metaverso": ["vr", "virtual", "mundo virtual", "spatial"],

    // IA
    "ia": ["inteligencia artificial", "ai", "machine learning", "ml", "deep learning", "neural", "llm"],
    "inteligencia artificial": ["ia", "ai", "machine learning", "deep learning"],
    "machine learning": ["ia", "ml", "deep learning"],
    "llm": ["ia", "gpt", "lenguaje", "nlp", "modelo"],

    // 3D / Modelado
    "3d": ["tres dimensiones", "modelado", "modelos", "personajes", "assets", "blender", "maya", "zbrush"],
    "modelado": ["3d", "modelos", "personajes", "assets"],
    "personajes": ["3d", "modelado", "character design", "concept art"],
    "impresion 3d": ["3d", "impresora", "prototipo", "prototipado", "fdm", "resina"],

    // Animación
    "animacion": ["animar", "motion", "2d", "after effects", "ilustración"],
    "motion": ["animacion", "motion graphics", "after effects"],
    "ilustracion": ["animacion", "dibujo", "arte digital", "concept art"],

    // Audiovisual
    "audiovisual": ["cine", "video", "film", "rodaje", "producción"],
    "cine": ["audiovisual", "film", "rodaje", "pelicula"],
    "video": ["audiovisual", "film", "grabación"],
    "vfx": ["efectos visuales", "postproducción", "compositing"],

    // Simulación
    "simulacion": ["simulador", "simular", "training", "formación"],
    "simulador": ["simulacion", "simular"],

    // Ciberseguridad
    "ciberseguridad": ["seguridad", "hacking", "penetration", "auditoría", "blockchain"],
    "seguridad": ["ciberseguridad", "protección"],

    // Narrativa
    "narrativa": ["historia", "storytelling", "guion", "escritura"],
    "storytelling": ["narrativa", "historia"],

    // Marketing
    "marketing": ["comunity", "social media", "digital", "analytics", "seo"],
    "social media": ["marketing", "community"],

    // Hardware
    "hardware": ["dispositivo", "gadget", "wearable", "háptico"],
    "wearable": ["hardware", "dispositivo", "háptico"],

    // Educación
    "educacion": ["formación", "curso", "enseñanza", "aprendizaje", "aula"],
    "formacion": ["educacion", "curso", "taller"],

    // Industria
    "industria": ["industrial", "industria 4.0", "iot", "digital twin", "gemelo digital"],
    "iot": ["industria", "internet of things", "sensores"],

    // Arte
    "arte": ["artístico", "creativo", "concept art", "diseño"],
    "diseno": ["diseño", "gráfico", "visual", "ux", "ui"]
  };

  // Tokenización y normalización
  function tokenize(text) {
    return text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quitar acentos
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2);
  }

  // Expandir tokens con sinónimos
  function expandTokens(tokens) {
    const expanded = new Set(tokens);
    for (const token of tokens) {
      for (const [key, syns] of Object.entries(sinonimos)) {
        if (key === token || syns.includes(token)) {
          expanded.add(key);
          syns.forEach(s => expanded.add(s));
        }
      }
    }
    return [...expanded];
  }

  // Calcular score de coincidencia para una empresa
  function scoreEmpresa(empresa, tokensExpandidos, queryOriginal) {
    let score = 0;
    const queryLower = queryOriginal.toLowerCase();

    // 1. Coincidencia en nombre (peso x4)
    const nombreLower = empresa.nombre.toLowerCase();
    if (nombreLower.includes(queryLower)) score += 40;
    tokensExpandidos.forEach(t => {
      if (nombreLower.includes(t)) score += 20;
    });

    // 2. Coincidencia en sector (peso x3)
    const sectorLower = empresa.sector.toLowerCase();
    tokensExpandidos.forEach(t => {
      if (sectorLower.includes(t)) score += 15;
    });

    // 3. Coincidencia en tecnologías (peso x3)
    empresa.tecnologias.forEach(tech => {
      const techLower = tech.toLowerCase();
      tokensExpandidos.forEach(t => {
        if (techLower.includes(t)) score += 12;
      });
    });

    // 4. Coincidencia en descripción (peso x2)
    const descLower = empresa.descripcion.toLowerCase();
    tokensExpandidos.forEach(t => {
      if (descLower.includes(t)) score += 6;
    });

    // 5. Bonus por múltiples coincidencias
    const coincidencias = tokensExpandidos.filter(t =>
      nombreLower.includes(t) ||
      sectorLower.includes(t) ||
      empresa.tecnologias.some(tech => tech.toLowerCase().includes(t)) ||
      descLower.includes(t)
    );
    if (coincidencias.length >= 3) score += 15;
    if (coincidencias.length >= 5) score += 10;

    return Math.min(score, 100);
  }

  // Calcular score para espacios
  function scoreEspacio(espacio, tokensExpandidos, queryOriginal) {
    let score = 0;
    const queryLower = queryOriginal.toLowerCase();

    // Coincidencia en nombre
    if (espacio.titulo.toLowerCase().includes(queryLower)) score += 30;
    tokensExpandidos.forEach(t => {
      if (espacio.titulo.toLowerCase().includes(t)) score += 15;
    });

    // Coincidencia en tipo
    tokensExpandidos.forEach(t => {
      if (espacio.tipo.includes(t)) score += 10;
    });

    // Coincidencia en descripción
    tokensExpandidos.forEach(t => {
      if (espacio.descripcion.toLowerCase().includes(t)) score += 5;
    });

    // Bonus por empresas en el espacio
    if (espacio.empresas.length > 0) score += 5;

    return Math.min(score, 100);
  }

  // Buscar empresas
  function buscarEmpresas(query) {
    if (!query || query.trim().length < 2) return [];

    const tokens = tokenize(query);
    const tokensExp = expandTokens(tokens);

    const resultados = EMPRESAS.map(empresa => ({
      tipo: "empresa",
      item: empresa,
      score: scoreEmpresa(empresa, tokensExp, query)
    }))
    .filter(r => r.score > 8)
    .sort((a, b) => b.score - a.score);

    return resultados;
  }

  // Buscar espacios
  function buscarEspacios(query) {
    if (!query || query.trim().length < 2) return [];

    const tokens = tokenize(query);
    const tokensExp = expandTokens(tokens);

    const resultados = Object.entries(ESPACIOS).map(([id, espacio]) => ({
      tipo: "espacio",
      id: id,
      item: espacio,
      score: scoreEspacio(espacio, tokensExp, query)
    }))
    .filter(r => r.score > 8)
    .sort((a, b) => b.score - a.score);

    return resultados;
  }

  // Buscar todo (empresas + espacios)
  function buscar(query) {
    const empresas = buscarEmpresas(query);
    const espacios = buscarEspacios(query);

    // Combinar y ordenar
    const todos = [...empresas, ...espacios]
      .sort((a, b) => b.score - a.score);

    return todos;
  }

  // Encontrar sinergias para una empresa
  function encontrarSinergias(empresaId) {
    const empresa = EMPRESAS.find(e => e.id === empresaId);
    if (!empresa) return [];

    const sinergias = [];

    // 1. Sinergias predefinidas
    SINERGIAS_PREDEFINIDAS.forEach(s => {
      if (s.empresa1 === empresaId || s.empresa2 === empresaId) {
        const otraId = s.empresa1 === empresaId ? s.empresa2 : s.empresa1;
        const otraEmpresa = EMPRESAS.find(e => e.id === otraId);
        if (otraEmpresa) {
          sinergias.push({
            empresa: otraEmpresa,
            razon: s.razon,
            tipo: s.tipo,
            score: s.score,
            fuente: "predefinida"
          });
        }
      }
    });

    // 2. Sinergias calculadas por tecnología
    EMPRESAS.forEach(otra => {
      if (otra.id === empresaId) return;

      // Calcular overlap de tecnologías
      const techsComunes = empresa.tecnologias.filter(t1 =>
        otra.tecnologias.some(t2 => {
          const t1l = t1.toLowerCase();
          const t2l = t2.toLowerCase();
          return t1l === t2l ||
                 t1l.includes(t2l) ||
                 t2l.includes(t1l) ||
                 sinonimos[t1l]?.some(s => t2l.includes(s)) ||
                 sinonimos[t2l]?.some(s => t1l.includes(s));
        })
      );

      if (techsComunes.length >= 1) {
        // Verificar que no esté ya en sinergias predefinidas
        const yaExiste = sinergias.some(s => s.empresa.id === otra.id);
        if (!yaExiste) {
          const score = 50 + (techsComunes.length * 15);
          sinergias.push({
            empresa: otra,
            razon: `Comparten tecnologías: ${techsComunes.join(", ")}. Potencial de colaboración técnica.`,
            tipo: "tecnológica",
            score: Math.min(score, 95),
            fuente: "calculada"
          });
        }
      }
    });

    // Ordenar por score
    return sinergias.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  // Buscar por categoría predefinida
  function buscarPorCategoria(categoria) {
    const ids = CATEGORIAS[categoria.toLowerCase()];
    if (!ids) return [];

    return ids.map(id => {
      const empresa = EMPRESAS.find(e => e.id === id);
      const espacio = ESPACIOS[id];
      if (empresa) return { tipo: "empresa", item: empresa, score: 90 };
      if (espacio) return { tipo: "espacio", id: id, item: espacio, score: 90 };
      return null;
    }).filter(Boolean);
  }

  // API pública
  return {
    buscar,
    buscarEmpresas,
    buscarEspacios,
    encontrarSinergias,
    buscarPorCategoria
  };

})();
