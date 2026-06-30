/* ============================================================
   MAPAPOLO 2026 · Buscador semántico (simulado)
   ------------------------------------------------------------
   Motor de scoring ponderado que entiende queries en lenguaje
   natural: "busco estudio de audio para doblaje de videojuego"
   o "necesito animación 3D para una serie infantil".
   ============================================================ */

window.MAPAPOLO_BUSCADOR = (function () {
  "use strict";

  const DATA = window.MAPAPOLO_DATA;
  if (!DATA) {
    console.error("[MAPAPOLO] datos.js no está cargado.");
    return {};
  }

  /* ---------- STEMMING + SINÓNIMOS (español) ---------- */
  const STEMS = {
    "busco": "buscar", "buscas": "buscar", "buscamos": "buscar",
    "necesito": "necesitar", "necesita": "necesitar", "necesitamos": "necesitar",
    "tengo": "tener", "tenemos": "tener",
    "hago": "hacer", "hacemos": "hacer",
    "videojuego": "juego", "videojuegos": "juego", "juego": "juego", "juegos": "juego",
    "realidad": "vr", "virtual": "vr",
    "aumentada": "ar",
    "mixta": "mr",
    "inteligencia": "ia", "artificial": "ia",
    "audio": "sonido", "sonido": "sonido", "musica": "sonido", "musical": "sonido",
    "sonora": "sonido", "sonorizacion": "sonido",
    "doblaje": "voz", "locucion": "voz", "voz": "voz", "voces": "voz",
    "animacion": "animar", "animar": "animar", "animo": "animar",
    "3d": "tresd", "tridimensional": "tresd",
    "2d": "dosd", "bidimensional": "dosd",
    "imagen": "imagen", "imagenes": "imagen",
    "render": "renderizar", "renderizado": "renderizar", "renderizar": "renderizar",
    "diseno": "disenar", "diseño": "disenar", "disenar": "disenar",
    "publicidad": "marketing", "marketing": "marketing",
    "formacion": "educar", "educacion": "educar", "educar": "educar",
    "taller": "formar", "curso": "formar",
    "modelado": "modelar", "modelado3d": "modelar", "modelar": "modelar",
    "postproduccion": "post", "post": "post", "efectos": "post", "vfx": "post",
    "cine": "audiovisual", "pelicula": "audiovisual", "serie": "audiovisual",
    "docencia": "educar", "ensenanza": "educar",
    "evento": "evento", "eventos": "evento", "feria": "evento",
    "live": "directo", "directo": "directo", "streaming": "directo",
    "podcast": "audio", "musica": "sonido"
  };

  /* Palabras vacías que no aportan señal */
  const STOP = new Set([
    "el","la","los","las","un","una","unos","unas","y","o","u","de","del","al",
    "en","por","para","con","sin","a","que","qué","cual","cuál","cuales","cuáles",
    "se","me","te","le","nos","os","les","lo","mi","tu","su","nuestro","vuestro",
    "este","esta","estos","estas","ese","esa","esos","esas","aquel","aquella",
    "del","al","del","del","del","del","del","del","del","del","del","del","del",
    "tengo","tienes","tiene","tenemos","tienen","tener",
    "hay","puede","puedo","pueden","ser","estar","estoy","estas","esta",
    "como","cómo","donde","dónde","cuando","cuándo","porque","por","qué"
  ]);

  /* ---------- TOKENIZACIÓN ---------- */
  function normalize(s) {
    return (s || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u0303\u0305-\u036f]/g, "") // quitar diacríticos excepto tilde de la ñ
      .replace(/ñ/g, "n")
      .replace(/[¿?¡!(){}[\].,;:¡"']/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokenize(s) {
    const norm = normalize(s);
    const tokens = norm.split(" ").filter(function (t) {
      return t.length > 1 && !STOP.has(t);
    });
    return tokens.map(function (t) {
      return STEMS[t] || t;
    });
  }

  /* ---------- SCORING ---------- */
  function scoreEmpresa(empresa, tokens) {
    if (!tokens.length) return 0;
    const fields = [
      { text: (empresa.nombre || "").toLowerCase(),   weight: 4 },
      { text: (empresa.sector || "").toLowerCase(),  weight: 3 },
      { text: (empresa.desc || "").toLowerCase(),     weight: 2 },
      { text: (empresa.tech || []).join(" ").toLowerCase(), weight: 3 },
      { text: (DATA.tagsByEmpresa[empresa.id] || []).join(" ").toLowerCase(), weight: 3 }
    ];
    const textHaystack = fields.map(function (f) {
      return f.text;
    }).join(" \u2022 ");

    let score = 0;
    let matched = 0;
    tokens.forEach(function (tk) {
      let tokenHit = 0;
      fields.forEach(function (f) {
        if (f.text.indexOf(tk) !== -1) {
          // Bonus si la palabra está en el nombre
          let bonus = 1;
          if (f === fields[0] && f.text.indexOf(tk) !== -1) bonus = 2.5;
          if (f === fields[1] && f.text.indexOf(tk) !== -1) bonus = 2;
          score += f.weight * bonus;
          tokenHit += 1;
        }
      });
      if (tokenHit > 0) {
        matched += 1;
        // Bonus por cobertura total de tokens
        score += 1.5;
      } else {
        // Penalizar tokens no encontrados
        score -= 0.5;
      }
    });

    // Normalizar por nº de tokens (cobertura)
    const cobertura = matched / tokens.length;
    return score * (0.5 + 0.5 * cobertura);
  }

  /* ---------- BÚSQUEDA PRINCIPAL ---------- */
  function buscar(query, limit) {
    limit = limit || 8;
    const tokens = tokenize(query);
    if (!tokens.length) return [];

    const scored = DATA.empresas
      .map(function (e) {
        return { empresa: e, score: scoreEmpresa(e, tokens) };
      })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit);

    return scored.map(function (r) {
      return Object.assign({}, r.empresa, { _score: Math.round(r.score) });
    });
  }

  /* ---------- SINERGIAS: ¿qué empresas encajan con una dada? ---------- */
  function emparejarSinergias(empresaId, limit) {
    limit = limit || 3;
    const origen = DATA.getEmpresaById(empresaId);
    if (!origen) return [];

    const tokensOrigen = tokenize(origen.nombre + " " + origen.sector + " " + origen.desc + " " + origen.tech.join(" "));

    const ranked = DATA.empresas
      .filter(function (e) { return e.id !== empresaId; })
      .map(function (e) {
        const tokensE = tokenize(e.nombre + " " + e.sector + " " + e.desc + " " + e.tech.join(" "));
        // Intersección + afinidad
        let common = 0;
        const setOrig = new Set(tokensOrigen);
        tokensE.forEach(function (t) { if (setOrig.has(t)) common += 1; });
        // Compartir tags
        const tagsOrig = DATA.tagsByEmpresa[empresaId] || [];
        const tagsE = DATA.tagsByEmpresa[e.id] || [];
        const tagCommon = tagsOrig.filter(function (t) { return tagsE.indexOf(t) !== -1; }).length;
        // Cercanía física (mismo edificio) — en este MVP solo planta baja
        const mismaZona = origen.zonas.some(function (z) { return e.zonas.indexOf(z) !== -1; });
        // Score final
        let score = 30 + common * 4 + tagCommon * 18 + (mismaZona ? 12 : 0);
        return { empresa: e, score: score, common: common + tagCommon, mismaZona: mismaZona };
      })
      .filter(function (r) { return r.score > 0; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit);

    return ranked.map(function (r) {
      const e = r.empresa;
      const tagsOrig = DATA.tagsByEmpresa[empresaId] || [];
      const tagsE = DATA.tagsByEmpresa[e.id] || [];
      const shared = tagsE.filter(function (t) { return tagsOrig.indexOf(t) !== -1; });
      const razon = (function () {
        if (r.mismaZona && shared.length) {
          return "Comparte zona en la planta y tecnologías: " + shared.slice(0, 3).join(", ") + ".";
        } else if (r.mismaZona) {
          return "Misma zona en planta baja: oportunidad de colaboración presencial.";
        } else if (shared.length) {
          return "Tecnologías y sector afines: " + shared.slice(0, 3).join(", ") + ".";
        }
        return "Ambos pertenecen al ecosistema digital del Polo.";
      })();
      return Object.assign({}, e, {
        _score: Math.min(99, Math.round(r.score)),
        _razon: razon,
        _match: shared.slice(0, 4)
      });
    });
  }

  /* ---------- SUGERENCIAS RÁPIDAS ---------- */
  const SUGERENCIAS = [
    "estudio de audio",
    "animación 3D",
    "videojuegos Unity",
    "realidad virtual XR",
    "inteligencia artificial",
    "producción audiovisual"
  ];

  /* ---------- API pública ---------- */
  return {
    buscar: buscar,
    emparejarSinergias: emparejarSinergias,
    sugerencias: SUGERENCIAS,
    tokenize: tokenize,
    score: scoreEmpresa
  };
})();
