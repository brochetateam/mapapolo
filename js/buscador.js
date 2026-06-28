/* =============================================
   MAPAPOLO 2026 - Buscador Semántico
   Simula búsqueda inteligente con scoring
   contextual en lenguaje natural
   ============================================= */

const Buscador = (() => {
    // Diccionario de sinónimos / expansiones semánticas (es -> clave)
    const DICCIONARIO = {
        // Audio y sonido
        'audio': ['audio', 'sonido', 'sound', 'musica', 'music', 'graba', 'microfono'],
        'sonido': ['audio', 'sonido', 'sound', 'musica', 'graba', 'foley'],
        'musica': ['audio', 'musica', 'music', 'banda sonora', 'soundtrack'],
        'doblaje': ['audio', 'doblaje', 'locucion', 'voz', 'voice', 'castellano', 'idioma'],
        'podcast': ['audio', 'podcast', 'radio', 'streaming'],
        'foley': ['audio', 'foley', 'efectos sonido'],
        'sound': ['audio', 'sound', 'sonido'],
        'microfono': ['audio', 'microfono', 'micro'],
        'banda sonora': ['audio', 'musica', 'soundtrack', 'bs'],

        // Videojuegos
        'videojuego': ['videojuegos', 'juego', 'game', 'games', 'gaming'],
        'juego': ['videojuegos', 'juego', 'game', 'games'],
        'game': ['videojuegos', 'game', 'games'],
        'gaming': ['videojuegos', 'gaming', 'esports'],
        'indie': ['videojuegos', 'indie', 'independiente'],
        'esports': ['videojuegos', 'esports', 'competicion'],
        'rpg': ['videojuegos', 'rpg', 'rol'],
        'narrativo': ['videojuegos', 'narrativo', 'historia', 'storytelling'],

        // XR / VR
        'vr': ['xr', 'vr', 'realidad virtual', 'virtual'],
        'realidad virtual': ['xr', 'vr', 'realidad virtual', 'rv', 'metaverso'],
        'ar': ['xr', 'ar', 'realidad aumentada', 'augmented'],
        'realidad aumentada': ['xr', 'ar', 'realidad aumentada'],
        'xr': ['xr', 'vr', 'ar', 'mr', 'extended'],
        'mr': ['xr', 'mr', 'mixed', 'realidad mixta', 'hololens'],
        'realidad mixta': ['xr', 'mr', 'mixed', 'realidad mixta'],
        'metaverso': ['xr', 'metaverso', 'metaverse', 'virtual'],
        'hololens': ['xr', 'mr', 'hololens', 'microsoft'],
        'vision pro': ['xr', 'apple', 'vision'],

        // 3D / Animación
        '3d': ['3d', 'tres dimensiones', 'modelado', 'render', 'blender', 'maya'],
        'animacion': ['animacion', 'animation', 'animated', 'motion'],
        'animación': ['animacion', 'animation', 'animated', 'motion'],
        'modelado': ['3d', 'modelado', 'modeling', 'character'],
        'render': ['3d', 'render', 'rendering'],
        'cgi': ['3d', 'cgi', 'efectos', 'vfx', 'animacion'],
        'vfx': ['3d', 'vfx', 'efectos visuales', 'postproduccion'],

        // Producción audiovisual
        'video': ['video', 'produccion', 'audiovisual', 'film', 'cine'],
        'cine': ['video', 'cine', 'film', 'cinematografia', 'produccion'],
        'documental': ['video', 'documental', 'documentary'],
        'rodaje': ['video', 'rodaje', 'filmacion', 'produccion'],
        'publicidad': ['video', 'publicidad', 'marketing', 'anuncio', 'spot'],
        'postproduccion': ['video', 'postproduccion', 'edicion', 'color'],

        // IA
        'ia': ['ia', 'ai', 'inteligencia artificial', 'machine learning', 'ml'],
        'inteligencia artificial': ['ia', 'ai', 'inteligencia artificial', 'ml', 'machine learning'],
        'machine learning': ['ia', 'ml', 'machine learning', 'ai'],
        'nlp': ['ia', 'nlp', 'lenguaje', 'chatbot', 'asistente'],
        'chatbot': ['ia', 'nlp', 'chatbot', 'asistente', 'llm'],
        'computer vision': ['ia', 'computer vision', 'cv', 'vision artificial'],

        // Programación
        'unity': ['videojuegos', 'unity', 'engine', 'motor'],
        'unreal': ['videojuegos', 'unreal', 'ue', 'engine', 'epic'],
        'web': ['web', 'frontend', 'backend', 'fullstack', 'javascript', 'html'],
        'app': ['app', 'mobile', 'ios', 'android', 'movil'],
        'mobile': ['app', 'mobile', 'movil', 'ios', 'android'],

        // Audiovisual / Educación
        'educacion': ['educacion', 'e-learning', 'elearning', 'formacion'],
        'e-learning': ['educacion', 'e-learning', 'elearning', 'formacion'],
        'formacion': ['educacion', 'formacion', 'capacitacion', 'curso'],

        // Industrias verticales
        'salud': ['salud', 'health', 'medical', 'medico'],
        'educativa': ['educacion', 'e-learning', 'escolar'],
        'industrial': ['industria', 'iot', 'industria 4.0', 'fabric'],
        'retail': ['retail', 'comercio', 'tienda', 'venta'],

        // Búsquedas comunes
        'empresa': ['empresa', 'habitante', 'residente', 'startup', 'compañia'],
        'startup': ['startup', 'empresa', 'habitante'],
        'busco': ['busco', 'necesito', 'quiero', 'requiero'],
        'necesito': ['necesito', 'busco', 'quiero'],
    };

    // Palabras vacías (no aportan significado)
    const STOPWORDS = new Set([
        'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al',
        'a', 'en', 'por', 'para', 'con', 'sin', 'sobre', 'y', 'o', 'u', 'que',
        'se', 'es', 'son', 'ser', 'estar', 'este', 'esta', 'estos', 'estas', 'aquel',
        'aquella', 'como', 'donde', 'cuando', 'quien', 'cual', 'cuyo', 'mio', 'tuyo',
        'su', 'sus', 'mi', 'mis', 'tu', 'tus', 'yo', 'tu', 'el', 'nos', 'les',
        'lo', 'me', 'te', 'se', 'si', 'no', 'ya', 'mas', 'muy', 'algo', 'algun',
        'alguno', 'alguna', 'algunos', 'algunas', 'todo', 'todos', 'toda', 'todas',
        'mucho', 'muchos', 'mucha', 'muchas', 'poco', 'pocos', 'poca', 'pocas',
        'mas', 'menos', 'tan', 'tanto', 'tanta', 'tanta', 'ese', 'esa', 'eso',
        'aqui', 'alli', 'ahi', 'donde', 'desde', 'hasta', 'segun', 'sin',
    ]);

    // Abreviaturas / expansiones
    const ABREVIATURAS = {
        'rv': 'realidad virtual',
        'ra': 'realidad aumentada',
        'rm': 'realidad mixta',
        'ia': 'inteligencia artificial',
        'ml': 'machine learning',
        'cv': 'computer vision',
        'vr': 'realidad virtual',
        'ar': 'realidad aumentada',
        'mr': 'realidad mixta',
        'edtech': 'tecnologia educativa',
        'proptech': 'tecnologia inmobiliaria',
        'fintech': 'tecnologia financiera',
        '3d': 'tres dimensiones',
        '2d': 'dos dimensiones',
    };

    // ==================== NORMALIZACIÓN ====================
    function normalizar(texto) {
        if (!texto) return '';
        return texto.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar acentos
            .replace(/[¿?¡!.,;:"(){}[\]]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function tokenizar(texto) {
        const normalizado = normalizar(texto);
        const tokens = normalizado.split(' ').filter(t => t.length > 1 && !STOPWORDS.has(t));
        // Expandir abreviaturas
        const expandidos = tokens.flatMap(t => {
            if (ABREVIATURAS[t]) {
                return [t, ...normalizar(ABREVIATURAS[t]).split(' ')];
            }
            return [t];
        });
        return [...new Set(expandidos)];
    }

    // ==================== EXPANSIÓN SEMÁNTICA ====================
    function expandirTokens(tokens) {
        const expandidos = new Set(tokens);
        tokens.forEach(token => {
            // Buscar en el diccionario
            Object.entries(DICCIONARIO).forEach(([key, sinonimos]) => {
                const keyNorm = normalizar(key);
                const sinonimosNorm = sinonimos.map(normalizar);
                if (keyNorm === token || sinonimosNorm.includes(token)) {
                    sinonimosNorm.forEach(s => expandidos.add(s));
                    expandidos.add(keyNorm);
                }
            });
        });
        return [...expandidos];
    }

    // ==================== STEMMING BÁSICO (ES) ====================
    function stem(palabra) {
        if (palabra.length <= 3) return palabra;
        // Quitar sufijos comunes
        const sufijos = ['mente', 'acion', 'acion', 'ando', 'iendo', 'ado', 'ido', 'ar', 'er', 'ir', 'os', 'as', 'es', 's'];
        for (const suf of sufijos) {
            if (palabra.endsWith(suf) && palabra.length - suf.length >= 3) {
                return palabra.slice(0, -suf.length);
            }
        }
        return palabra;
    }

    // ==================== SCORING ====================
    function calcularScore(empresa, tokensQuery, tokensExpandidos) {
        let score = 0;
        const camposTexto = [
            { texto: empresa.nombre, peso: 4 },
            { texto: empresa.sector, peso: 3 },
            { texto: empresa.sectorLabel, peso: 3 },
            { texto: empresa.descripcion, peso: 2 },
            { texto: empresa.tecnologias.join(' '), peso: 3 },
        ];

        const nombreNorm = normalizar(empresa.nombre);
        const sectorNorm = normalizar(empresa.sector);
        const techsNorm = empresa.tecnologias.map(normalizar).join(' ');

        tokensQuery.forEach(token => {
            // Match exacto en nombre (boost alto)
            if (nombreNorm.includes(token)) {
                score += 15;
            }
            // Match en tecnologías
            if (techsNorm.includes(token)) {
                score += 8;
            }
            // Match en sector
            if (sectorNorm.includes(token) || normalizar(empresa.sectorLabel).includes(token)) {
                score += 6;
            }
        });

        // Bonus por match en tokens expandidos (sinónimos)
        tokensExpandidos.forEach(token => {
            if (!tokensQuery.includes(token)) {
                if (nombreNorm.includes(token)) score += 3;
                if (techsNorm.includes(token)) score += 2;
                if (sectorNorm.includes(token) || normalizar(empresa.sectorLabel).includes(token)) score += 2;
            }
        });

        // Bonus por match en descripción
        const descNorm = normalizar(empresa.descripcion);
        tokensQuery.forEach(token => {
            if (descNorm.includes(token)) score += 2;
        });

        return score;
    }

    // ==================== BÚSQUEDA PRINCIPAL ====================
    function buscar(query, limite = 8) {
        if (!query || query.trim().length < 2) return [];

        const tokensQuery = tokenizar(query);
        if (tokensQuery.length === 0) return [];

        const tokensExpandidos = expandirTokens(tokensQuery);

        // Calcular scores
        const resultados = EMPRESAS.map(empresa => ({
            empresa,
            score: calcularScore(empresa, tokensQuery, tokensExpandidos),
        }))
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limite);

        // Normalizar score a porcentaje (0-100)
        const maxScore = resultados[0]?.score || 1;
        return resultados.map(r => ({
            ...r,
            match: Math.min(100, Math.round((r.score / maxScore) * 100)),
        }));
    }

    // ==================== BÚSQUEDA POR SECTOR ====================
    function buscarPorSector(sectorId) {
        return EMPRESAS.filter(e => e.sector === sectorId);
    }

    // ==================== BÚSQUEDA POR PLANTA ====================
    function buscarPorPlanta(planta) {
        return EMPRESAS.filter(e => {
            const espacio = ESPACIOS[e.espacioId];
            return espacio && espacio.planta === planta;
        });
    }

    // ==================== BÚSQUEDA DE SINERGIAS ====================
    function buscarSinergias(empresaId) {
        const sinergias = [];

        SINERGIAS_PREDEFINIDAS.forEach(s => {
            if (s.empresas.includes(empresaId)) {
                const otraId = s.empresas.find(id => id !== empresaId);
                const otra = EMPRESAS.find(e => e.id === otraId);
                if (otra) {
                    sinergias.push({
                        empresas: [empresaId, otraId],
                        otraEmpresa: otra,
                        razon: s.razon,
                    });
                }
            }
        });

        return sinergias;
    }

    function buscarSinergiasParaEspacio(espacioId) {
        const empresasEnEspacio = EMPRESAS.filter(e => e.espacioId === espacioId);
        if (empresasEnEspacio.length === 0) return [];

        const sinergias = [];

        empresasEnEspacio.forEach(empresa => {
            const sinonimas = buscarSinergias(empresa.id);
            sinonimas.forEach(s => {
                // Evitar duplicados
                const key = [empresa.id, s.otraEmpresa.id].sort().join('-');
                if (!sinergias.find(x => x.key === key)) {
                    sinergias.push({
                        key,
                        empresaOrigen: empresa,
                        empresaDestino: s.otraEmpresa,
                        razon: s.razon,
                    });
                }
            });
        });

        return sinergias;
    }

    // ==================== SUGERENCIAS ====================
    function obtenerSugerencias(query) {
        if (!query || query.length < 2) return [];
        const norm = normalizar(query);
        const sugerencias = new Set();

        // Buscar nombres de empresas
        EMPRESAS.forEach(e => {
            if (normalizar(e.nombre).includes(norm)) {
                sugerencias.add(e.nombre);
            }
        });

        // Buscar tecnologías
        EMPRESAS.forEach(e => {
            e.tecnologias.forEach(t => {
                if (normalizar(t).includes(norm)) {
                    sugerencias.add(t);
                }
            });
        });

        // Buscar sectores
        SECTORES.forEach(s => {
            if (normalizar(s.label).includes(norm)) {
                sugerencias.add(s.label);
            }
        });

        return [...sugerencias].slice(0, 6);
    }

    return { buscar, buscarPorSector, buscarPorPlanta, buscarSinergias, buscarSinergiasParaEspacio, obtenerSugerencias, normalizar, tokenizar };
})();
