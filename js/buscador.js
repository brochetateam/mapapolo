const Buscador = (() => {
  const STOP_WORDS = ['busco', 'una', 'un', 'el', 'la', 'los', 'las', 'que', 'para', 'por', 'con', 'de', 'del', 'en', 'al', 'y', 'e', 'o', 'a', 'su', 'me', 'te', 'se', 'lo', 'le', 'como', 'mas', 'pero', 'es', 'esta', 'este', 'esto', 'muy', 'tiene', 'pueda', 'necesito', 'quiero', 'estoy', 'seria', 'algo', 'donde', 'empresa', 'empresas', 'estudio', 'estudios', 'laboratorio', 'espacio'];

  function tokenizar(texto) {
    return texto.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !STOP_WORDS.includes(t));
  }

  function stemming(palabra) {
    if (palabra.endsWith('cion') || palabra.endsWith('sion')) return palabra.slice(0, -4) + 'r';
    if (palabra.endsWith('ciones')) return palabra.slice(0, -6) + 'r';
    if (palabra.endsWith('miento')) return palabra.slice(0, -6);
    if (palabra.endsWith('mientos')) return palabra.slice(0, -7);
    if (palabra.endsWith('idad')) return palabra.slice(0, -4);
    if (palabra.endsWith('grafia')) return palabra.slice(0, -6);
    if (palabra.endsWith('mente')) return palabra;
    if (palabra.endsWith('ando') || palabra.endsWith('endo')) return palabra.slice(0, -4);
    if (palabra.endsWith('acion')) return palabra.slice(0, -5) + 'ar';
    if (palabra.endsWith('ativo')) return palabra.slice(0, -5);
    return palabra;
  }

  const SINONIMOS = {
    'vr': ['realidad virtual', 'virtual', 'metaverso', 'xr', 'rv'],
    'audio': ['sonido', 'musica', 'musical', 'grabacion', 'sonoro', 'mezcla', 'masterizacion', 'doblaje', 'foley', 'podcast'],
    'video': ['audiovisual', 'filmacion', 'grabacion', 'cine', 'television', 'contenido'],
    'videojuego': ['videojuegos', 'gaming', 'gamedev', 'juego', 'juegos', 'indie', 'desarrollo'],
    '3d': ['modelado', 'animacion', 'render', 'escultura', 'textura', 'impresion'],
    'ia': ['inteligencia artificial', 'machine learning', 'datos', 'analitica', 'algoritmo', 'automacion'],
    'marketing': ['publicidad', 'branding', 'social media', 'comunicacion'],
    'educacion': ['educativo', 'aprendizaje', 'formacion', 'ensenanza', 'taller', 'cursos'],
    'seguridad': ['ciberseguridad', 'proteccion', 'auditoria', 'hacking', 'pentesting'],
    'diseno': ['design', 'arte', 'grafico', 'visual', 'creativo']
  };

  function expandir(token) {
    const expandidos = [token, stemming(token)];
    for (const [base, sinonimos] of Object.entries(SINONIMOS)) {
      if (sinonimos.includes(token) || base === token) {
        expandidos.push(base, ...sinonimos);
        break;
      }
    }
    for (const [base, sinonimos] of Object.entries(SINONIMOS)) {
      if (sinonimos.some(s => s.includes(token)) && !expandidos.includes(base)) {
        expandidos.push(base);
      }
    }
    return [...new Set(expandidos)];
  }

  function calcularScore(empresa, tokensExpandidos) {
    let score = 0;
    const campos = [
      { key: 'nombre', peso: 3 },
      { key: 'sector', peso: 2.5 },
      { key: 'desc', peso: 1.5 },
      { key: 'tech', peso: 2 },
    ];

    for (const token of tokensExpandidos) {
      for (const campo of campos) {
        const valor = campo.key === 'tech'
          ? (empresa[campo.key] || []).join(' ')
          : (empresa[campo.key] || '');
        if (valor.toLowerCase().includes(token)) {
          score += campo.peso;
        }
      }
    }

    MAPAPOLO.sinergias.forEach(s => {
      if (s.de === empresa.id || s.con.includes(empresa.id)) {
        for (const token of tokensExpandidos) {
          if (s.motivo.toLowerCase().includes(token)) {
            score += 1.5;
            break;
          }
        }
      }
    });

    return score;
  }

  function buscar(query) {
    if (!query || query.trim().length < 2) return [];
    const tokens = tokenizar(query);
    if (tokens.length === 0) return [];

    const tokensExpandidos = tokens.flatMap(expandir);
    const scored = MAPAPOLO.empresas
      .map(e => ({ empresa: e, score: calcularScore(e, tokensExpandidos) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored;
  }

  function buscarEspacios(query) {
    if (!query || query.trim().length < 2) return [];
    const tokens = tokenizar(query);
    if (tokens.length === 0) return [];
    const tokensExpandidos = tokens.flatMap(expandir);

    const scored = Object.values(MAPAPOLO.espacios)
      .map(e => {
        let score = 0;
        for (const token of tokensExpandidos) {
          if (e.nombre.toLowerCase().includes(token)) score += 3;
          if (e.desc.toLowerCase().includes(token)) score += 1.5;
          if (e.tipo.toLowerCase().includes(token)) score += 2;
          if (e.planta.toLowerCase().includes(token)) score += 1;
        }
        return { espacio: e, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored;
  }

  function buscarTodo(query) {
    const empresas = buscar(query);
    const espacios = buscarEspacios(query);
    return { empresas, espacios };
  }

  return { buscar, buscarEspacios, buscarTodo };
})();
