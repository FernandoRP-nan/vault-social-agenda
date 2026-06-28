/* agenda_db.ts — migrado a módulo TS */
// @ts-nocheck
import { ScriptsRuntime } from "../runtime/scripts-runtime";
import { AgendaCalendario } from "./agenda_calendario";
import { AgendaHistorial } from "./agenda_historial";
import { AgendaPerfil } from "./agenda_perfil";
import { AgendaPreferencias } from "./agenda_preferencias";

import { getTaskBoardBridge } from "../bridge-registry";

/* agenda_db.js - Persistencia SQLite para agenda social */

export const AgendaDB = {
    DB_RELATIVE: ".obsidian/plugins-data/vault-social-agenda/agenda_social.db",
    KANBAN_DB_RELATIVE: ".obsidian/plugins-data/vault-task-board/kanban_tareas.db",
    NOTE_PATH: "Plugins/vault-social-agenda/dashboard",
    FOTO_CARPETA: "Adjuntos/Agenda Social",

    SCHEMA_PERSONAS: `CREATE TABLE IF NOT EXISTS personas (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        alias TEXT DEFAULT '[]',
        fecha_nacimiento TEXT DEFAULT '',
        zona_horaria TEXT DEFAULT 'America/Mexico_City',
        ciudad TEXT DEFAULT '',
        telefono TEXT DEFAULT '',
        email TEXT DEFAULT '',
        instagram TEXT DEFAULT '',
        twitter TEXT DEFAULT '',
        facebook TEXT DEFAULT '',
        gustos TEXT DEFAULT '[]',
        notas TEXT DEFAULT '',
        tags TEXT DEFAULT '[]',
        actividad_dias INTEGER DEFAULT 0,
        actividad_semanas INTEGER DEFAULT 0,
        actividad_meses INTEGER DEFAULT 0
    );`,

    TIPOS_RELACION: ["pareja", "amigos", "mejores_amigos", "familia", "conocidos", "trabajo", "escuela"],
    TIPOS_EXCLUSIVOS: ["pareja", "amigos", "mejores_amigos", "familia", "conocidos"],
    TIPOS_COMPARTIDOS: ["trabajo", "escuela"],
    TIPOS_RELACION_SQL: "'pareja','amigos','mejores_amigos','familia','conocidos','trabajo','escuela'",

    SCHEMA_RELACIONES: `CREATE TABLE IF NOT EXISTS relaciones (
        origen_id TEXT NOT NULL,
        destino_id TEXT NOT NULL,
        tipo TEXT CHECK( tipo IN ('pareja','amigos','mejores_amigos','familia','conocidos','trabajo','escuela') ) NOT NULL,
        PRIMARY KEY (origen_id, destino_id, tipo),
        FOREIGN KEY (origen_id) REFERENCES personas(id) ON DELETE CASCADE,
        FOREIGN KEY (destino_id) REFERENCES personas(id) ON DELETE CASCADE
    );`,

    SCHEMA_CONFIG: `CREATE TABLE IF NOT EXISTS agenda_config (
        clave TEXT PRIMARY KEY,
        valor TEXT DEFAULT ''
    );`,

    SCHEMA_ACTIVIDADES: `CREATE TABLE IF NOT EXISTS agenda_actividades (
        id TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        tipo TEXT CHECK( tipo IN ('evento','tarea') ) NOT NULL DEFAULT 'evento',
        icono TEXT DEFAULT '📅',
        fecha TEXT NOT NULL,
        fecha_fin TEXT DEFAULT '',
        estado TEXT CHECK( estado IN ('pendiente','en_proceso','terminado','descartado') ) DEFAULT 'pendiente',
        notas TEXT DEFAULT '',
        persona_ids TEXT DEFAULT '[]',
        grupos TEXT DEFAULT '[]',
        tarea_kanban_id INTEGER DEFAULT 0,
        creado_en TEXT NOT NULL,
        iniciado_en TEXT DEFAULT '',
        terminado_en TEXT DEFAULT '',
        descartado_en TEXT DEFAULT ''
    );`,

    _relacionesVacias: () => {
        const r = {};
        AgendaDB.TIPOS_RELACION.forEach(t => { r[t] = []; });
        return r;
    },

    esTipoCompartido: (tipo) => AgendaDB.TIPOS_COMPARTIDOS.includes(tipo),

    vincularRelacion: (relaciones, tipo, personaId) => {
        const base = { ...AgendaDB._relacionesVacias(), ...relaciones };
        if (AgendaDB.esTipoCompartido(tipo)) {
            if (!base[tipo].includes(personaId)) base[tipo].push(personaId);
            return base;
        }
        AgendaDB.TIPOS_EXCLUSIVOS.forEach(t => {
            base[t] = (base[t] || []).filter(id => id !== personaId);
        });
        if (!base[tipo].includes(personaId)) base[tipo].push(personaId);
        return base;
    },

    idsVinculadosRelaciones: (relaciones, excluirTipo = null) => {
        const ids = new Set();
        AgendaDB.TIPOS_EXCLUSIVOS.forEach(t => {
            if (t === excluirTipo) return;
            (relaciones[t] || []).forEach(id => ids.add(id));
        });
        return ids;
    },

    normalizarRelacionesExclusivas: (relaciones) => {
        const base = AgendaDB._relacionesVacias();
        const vistosExcl = new Set();
        AgendaDB.TIPOS_EXCLUSIVOS.forEach(t => {
            (relaciones?.[t] || []).forEach(id => {
                if (vistosExcl.has(id)) return;
                base[t].push(id);
                vistosExcl.add(id);
            });
        });
        AgendaDB.TIPOS_COMPARTIDOS.forEach(t => {
            base[t] = [...new Set(relaciones?.[t] || [])];
        });
        return base;
    },

    init: async (SQL, dbPath) => ScriptsRuntime.initDb(SQL, dbPath, (db, esNueva) => {
        db.run(AgendaDB.SCHEMA_PERSONAS);
        db.run(AgendaDB.SCHEMA_RELACIONES);
        db.run(AgendaDB.SCHEMA_CONFIG);
        db.run(AgendaDB.SCHEMA_ACTIVIDADES);
        if (AgendaHistorial) AgendaHistorial.init(db);
        AgendaDB._migrarEsquema(db, esNueva ? null : dbPath);
        AgendaDB._migrarRelacionesEsquema(db, dbPath);
    }),

    _migrarEsquema: (db, dbPath) => {
        const cols = (db.exec("PRAGMA table_info(personas)")[0]?.values || []).map(c => c[1]);
        let cambio = false;
        const colsTexto = ["mbti", "eneagrama", "relacion_conmigo", "color_favorito", "disgustos", "foto", "grupos",
            "puntos_destacables", "inteligencias", "moralidad", "etica", "potencial", "habitos", "debilidades",
            "hora_nacimiento", "pais_nacimiento", "estado_nacimiento"];
        const colsEntero = ["actividad_dias", "actividad_semanas", "actividad_meses", "iq_min", "iq_max",
            "hora_nacimiento_desconocida"];
        const colsReal = ["latitud", "longitud"];
        [...colsTexto, ...colsEntero].forEach(col => {
            if (!cols.includes(col)) {
                if (col === "disgustos") {
                    db.run("ALTER TABLE personas ADD COLUMN disgustos TEXT DEFAULT '{}'");
                } else if (col === "grupos" || col === "puntos_destacables" || col === "habitos" || col === "debilidades") {
                    db.run(`ALTER TABLE personas ADD COLUMN ${col} TEXT DEFAULT '[]'`);
                } else if (col === "inteligencias") {
                    db.run("ALTER TABLE personas ADD COLUMN inteligencias TEXT DEFAULT '{}'");
                } else if (colsEntero.includes(col)) {
                    db.run(`ALTER TABLE personas ADD COLUMN ${col} INTEGER DEFAULT 0`);
                } else {
                    db.run(`ALTER TABLE personas ADD COLUMN ${col} TEXT DEFAULT ''`);
                }
                cambio = true;
            }
        });
        colsReal.forEach(col => {
            if (!cols.includes(col)) {
                db.run(`ALTER TABLE personas ADD COLUMN ${col} REAL`);
                cambio = true;
            }
        });
        if (cambio && dbPath) AgendaDB.guardar(db, dbPath);
    },

    _migrarRelacionesEsquema: (db, dbPath) => {
        const fila = db.exec("SELECT sql FROM sqlite_master WHERE type='table' AND name='relaciones'")[0]?.values?.[0];
        const sql = fila?.[0] || "";
        const esperado = AgendaDB.TIPOS_RELACION_SQL;
        if (!sql || sql.includes("mejores_amigos") && sql.includes("trabajo")) return;

        db.run(`CREATE TABLE relaciones_new (
            origen_id TEXT NOT NULL,
            destino_id TEXT NOT NULL,
            tipo TEXT CHECK( tipo IN (${esperado}) ) NOT NULL,
            PRIMARY KEY (origen_id, destino_id, tipo),
            FOREIGN KEY (origen_id) REFERENCES personas(id) ON DELETE CASCADE,
            FOREIGN KEY (destino_id) REFERENCES personas(id) ON DELETE CASCADE
        )`);
        db.run("INSERT INTO relaciones_new SELECT * FROM relaciones");
        db.run("DROP TABLE relaciones");
        db.run("ALTER TABLE relaciones_new RENAME TO relaciones");
        if (dbPath) AgendaDB.guardar(db, dbPath);
    },

    guardar: (db, dbPath) => ScriptsRuntime.guardarDb(db, dbPath),

    _json: (val, fallback) => {
        try { return JSON.parse(val); } catch { return fallback; }
    },

    _slugify: (texto) => (texto || "")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),

    _plantillaPersona: () => ({
        id: "",
        nombre: "",
        alias: [],
        grupos: [],
        fecha_nacimiento: "",
        hora_nacimiento: "",
        hora_nacimiento_desconocida: 0,
        latitud: null,
        longitud: null,
        pais_nacimiento: "",
        estado_nacimiento: "",
        zona_horaria: "America/Mexico_City",
        ciudad: "",
        contacto: { telefono: "", email: "" },
        redes: { instagram: "", twitter: "", facebook: "" },
        gustos: {},
        disgustos: {},
        relaciones: AgendaDB._relacionesVacias(),
        actividad_social: { tipo: "semanas", valor: 0 },
        mbti: "",
        eneagrama: "",
        color_favorito: "",
        foto: "",
        relacion_conmigo: "",
        notas: "",
        puntos_destacables: [],
        iq_min: 0,
        iq_max: 0,
        inteligencias: {},
        moralidad: "",
        etica: "",
        potencial: "",
        habitos: [],
        debilidades: []
    }),

    _filaAPersona: (r, relMap) => AgendaPerfil.enriquecer({
        id: r[0],
        nombre: r[1],
        alias: AgendaDB._json(r[2], []),
        grupos: AgendaDB._json(r[23], []),
        fecha_nacimiento: r[3] || "",
        hora_nacimiento: r[33] || "",
        hora_nacimiento_desconocida: !!r[34],
        latitud: r[35] != null && r[35] !== "" ? Number(r[35]) : null,
        longitud: r[36] != null && r[36] !== "" ? Number(r[36]) : null,
        pais_nacimiento: r[37] || "",
        estado_nacimiento: r[38] || "",
        zona_horaria: r[4] || "America/Mexico_City",
        ciudad: r[5] || "",
        contacto: { telefono: r[6] || "", email: r[7] || "" },
        redes: { instagram: r[8] || "", twitter: r[9] || "", facebook: r[10] || "" },
        gustos: AgendaPreferencias.normalizar(AgendaDB._json(r[11], {})),
        notas: r[12] || "",
        actividad_social: AgendaDB.normalizarActividad({
            dias: r[14] || 0, semanas: r[15] || 0, meses: r[16] || 0
        }),
        relaciones: { ...AgendaDB._relacionesVacias(), ...(relMap.get(r[0]) || {}) },
        mbti: r[17] || "",
        eneagrama: r[18] || "",
        relacion_conmigo: r[19] || "",
        color_favorito: r[20] || "",
        disgustos: AgendaPreferencias.normalizar(AgendaDB._json(r[21], {})),
        foto: r[22] || "",
        puntos_destacables: AgendaPerfil.normalizarLista(AgendaDB._json(r[24], [])),
        iq_min: r[25] || 0,
        iq_max: r[26] || 0,
        inteligencias: AgendaPerfil.normalizarInteligencias(AgendaDB._json(r[27], {})),
        moralidad: r[28] || "",
        etica: r[29] || "",
        potencial: r[30] || "",
        habitos: AgendaPerfil.normalizarLista(AgendaDB._json(r[31], [])),
        debilidades: AgendaPerfil.normalizarLista(AgendaDB._json(r[32], []))
    }),

    _obtenerMapaRelaciones: (db) => {
        const mapa = new Map();
        const stmt = db.prepare("SELECT origen_id, destino_id, tipo FROM relaciones");
        while (stmt.step()) {
            const [origen, destino, tipo] = stmt.get();
            if (!mapa.has(origen)) mapa.set(origen, AgendaDB._relacionesVacias());
            if (mapa.get(origen)[tipo]) mapa.get(origen)[tipo].push(destino);
        }
        stmt.free();
        return mapa;
    },

    obtenerTodas: (db) => {
        const relMap = AgendaDB._obtenerMapaRelaciones(db);
        const stmt = db.prepare(`SELECT id, nombre, alias, fecha_nacimiento, zona_horaria, ciudad,
            telefono, email, instagram, twitter, facebook, gustos, notas, tags,
            actividad_dias, actividad_semanas, actividad_meses, mbti, eneagrama, relacion_conmigo, color_favorito, disgustos, foto, grupos,
            puntos_destacables, iq_min, iq_max, inteligencias, moralidad, etica, potencial, habitos, debilidades,
            hora_nacimiento, hora_nacimiento_desconocida, latitud, longitud, pais_nacimiento, estado_nacimiento
            FROM personas ORDER BY nombre COLLATE NOCASE`);
        const rows = [];
        while (stmt.step()) rows.push(AgendaDB._filaAPersona(stmt.get(), relMap));
        stmt.free();
        return rows;
    },

    cargarEstado: (db, opciones = {}) => {
        const personas = AgendaDB.obtenerTodas(db);
        if (opciones.SQL && opciones.kanbanPath) {
            AgendaDB.sincronizarEstadosDesdeKanban(db, opciones.dbPath, opciones.SQL, opciones.kanbanPath);
            AgendaDB._sincronizarTareasHuerfanas(db, opciones.dbPath, opciones.SQL, opciones.kanbanPath);
        }
        return {
            personas,
            actividades: AgendaDB.obtenerActividades(db),
            miPersonaId: AgendaDB.obtenerMiPersonaId(db),
            vocabulario: AgendaDB.actualizarVocabulario(personas, {})
        };
    },

    _guardarRelaciones: (db, origenId, relaciones) => {
        db.run("DELETE FROM relaciones WHERE origen_id = ?", [origenId]);
        const stmt = db.prepare("INSERT OR IGNORE INTO relaciones (origen_id, destino_id, tipo) VALUES (?, ?, ?)");
        AgendaDB.TIPOS_RELACION.forEach(tipo => {
            (relaciones[tipo] || []).forEach(dest => stmt.run([origenId, dest, tipo]));
        });
        stmt.free();
    },

    _sincronizarRelaciones: (db, idOrigen) => {
        const personas = AgendaDB.obtenerTodas(db);
        const origen = personas.find(p => p.id === idOrigen);
        if (!origen) return;

        const tipos = AgendaDB.TIPOS_RELACION;
        personas.forEach(p => {
            if (p.id === idOrigen) return;
            tipos.forEach(tipo => {
                const tiene = (origen.relaciones[tipo] || []).includes(p.id);
                const destTiene = (p.relaciones[tipo] || []).includes(idOrigen);
                if (tiene && !destTiene) {
                    const nueva = { ...p.relaciones, [tipo]: [...(p.relaciones[tipo] || []), idOrigen] };
                    AgendaDB._guardarRelaciones(db, p.id, nueva);
                }
                if (!tiene && destTiene) {
                    const nueva = { ...p.relaciones, [tipo]: p.relaciones[tipo].filter(r => r !== idOrigen) };
                    AgendaDB._guardarRelaciones(db, p.id, nueva);
                }
            });
        });
    },

    obtenerMiPersonaId: (db) => {
        const stmt = db.prepare("SELECT valor FROM agenda_config WHERE clave = 'mi_persona_id'");
        let id = "";
        if (stmt.step()) id = stmt.get()[0] || "";
        stmt.free();
        return id;
    },

    establecerMiPersona: (db, dbPath, personaId) => {
        db.run("INSERT INTO agenda_config (clave, valor) VALUES ('mi_persona_id', ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor", [personaId || ""]);
        AgendaDB.guardar(db, dbPath);
    },

    obtenerPersonaDb: (db, id) => {
        if (!id) return null;
        return AgendaDB.obtenerTodas(db).find(p => p.id === id) || null;
    },

    upsertPersona: (db, dbPath, persona, opciones = {}) => {
        const base = AgendaDB._plantillaPersona();
        const p = {
            ...base, ...persona,
            contacto: { ...base.contacto, ...(persona.contacto || {}) },
            redes: { ...base.redes, ...(persona.redes || {}) },
            relaciones: { ...base.relaciones, ...(persona.relaciones || {}) },
            actividad_social: AgendaDB.normalizarActividad(persona.actividad_social || {}),
            alias: Array.isArray(persona.alias) ? persona.alias : [],
            grupos: Array.isArray(persona.grupos) ? persona.grupos : [],
            gustos: AgendaPreferencias.clonar(persona.gustos),
            disgustos: AgendaPreferencias.clonar(persona.disgustos),
            mbti: (persona.mbti || "").trim(),
            eneagrama: (persona.eneagrama || "").trim(),
            color_favorito: AgendaPerfil.validarColorHex(persona.color_favorito),
            foto: (persona.foto || "").trim(),
            puntos_destacables: AgendaPerfil.normalizarLista(persona.puntos_destacables),
            iq_min: Math.max(0, parseInt(persona.iq_min, 10) || 0),
            iq_max: Math.max(0, parseInt(persona.iq_max, 10) || 0),
            inteligencias: AgendaPerfil.normalizarInteligencias(persona.inteligencias),
            moralidad: (persona.moralidad || "").trim(),
            etica: (persona.etica || "").trim(),
            potencial: (persona.potencial || "").trim(),
            habitos: AgendaPerfil.normalizarLista(persona.habitos),
            debilidades: AgendaPerfil.normalizarLista(persona.debilidades),
            hora_nacimiento: AgendaPerfil.validarHoraNacimiento(persona.hora_nacimiento),
            hora_nacimiento_desconocida: persona.hora_nacimiento_desconocida ? 1 : 0,
            latitud: AgendaPerfil.validarLatitud(persona.latitud),
            longitud: AgendaPerfil.validarLongitud(persona.longitud),
            pais_nacimiento: (persona.pais_nacimiento || "").trim(),
            estado_nacimiento: (persona.estado_nacimiento || "").trim()
        };

        if (!p.nombre.trim()) throw new Error("El nombre es obligatorio.");
        const slug = AgendaDB._slugify(p.nombre);
        p.id = p.id || slug;

        const anterior = AgendaDB.obtenerPersonaDb(db, p.id);
        const personas = AgendaDB.obtenerTodas(db);

        const dup = db.prepare("SELECT nombre FROM personas WHERE id != ? AND lower(nombre) = lower(?)");
        dup.bind([p.id, p.nombre]);
        if (dup.step()) { dup.free(); throw new Error(`Ya existe: ${p.nombre}`); }
        dup.free();

        const act = AgendaDB.serializarActividad(p.actividad_social);
        db.run(`INSERT INTO personas (id, nombre, alias, fecha_nacimiento, zona_horaria, ciudad,
            telefono, email, instagram, twitter, facebook, gustos, notas, tags,
            actividad_dias, actividad_semanas, actividad_meses, mbti, eneagrama, relacion_conmigo, color_favorito, disgustos, foto, grupos,
            puntos_destacables, iq_min, iq_max, inteligencias, moralidad, etica, potencial, habitos, debilidades,
            hora_nacimiento, hora_nacimiento_desconocida, latitud, longitud, pais_nacimiento, estado_nacimiento)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(id) DO UPDATE SET
            nombre=excluded.nombre, alias=excluded.alias, fecha_nacimiento=excluded.fecha_nacimiento,
            zona_horaria=excluded.zona_horaria, ciudad=excluded.ciudad, telefono=excluded.telefono,
            email=excluded.email, instagram=excluded.instagram, twitter=excluded.twitter,
            facebook=excluded.facebook, gustos=excluded.gustos, notas=excluded.notas, tags='[]',
            actividad_dias=excluded.actividad_dias, actividad_semanas=excluded.actividad_semanas,
            actividad_meses=excluded.actividad_meses, mbti=excluded.mbti, eneagrama=excluded.eneagrama,
            relacion_conmigo=excluded.relacion_conmigo, color_favorito=excluded.color_favorito,
            disgustos=excluded.disgustos, foto=excluded.foto, grupos=excluded.grupos,
            puntos_destacables=excluded.puntos_destacables, iq_min=excluded.iq_min, iq_max=excluded.iq_max,
            inteligencias=excluded.inteligencias, moralidad=excluded.moralidad, etica=excluded.etica,
            potencial=excluded.potencial, habitos=excluded.habitos, debilidades=excluded.debilidades,
            hora_nacimiento=excluded.hora_nacimiento, hora_nacimiento_desconocida=excluded.hora_nacimiento_desconocida,
            latitud=excluded.latitud, longitud=excluded.longitud, pais_nacimiento=excluded.pais_nacimiento,
            estado_nacimiento=excluded.estado_nacimiento`, [
            p.id, p.nombre, JSON.stringify(p.alias), p.fecha_nacimiento, p.zona_horaria, p.ciudad,
            p.contacto.telefono, p.contacto.email, p.redes.instagram, p.redes.twitter, p.redes.facebook,
            JSON.stringify(p.gustos), p.notas, "[]",
            act.dias, act.semanas, act.meses, p.mbti, p.eneagrama, "", p.color_favorito,
            JSON.stringify(p.disgustos), p.foto, JSON.stringify(p.grupos),
            JSON.stringify(p.puntos_destacables), p.iq_min, p.iq_max, JSON.stringify(p.inteligencias),
            p.moralidad, p.etica, p.potencial, JSON.stringify(p.habitos), JSON.stringify(p.debilidades),
            p.hora_nacimiento, p.hora_nacimiento_desconocida, p.latitud, p.longitud, p.pais_nacimiento, p.estado_nacimiento
        ]);

        p.relaciones = AgendaDB.normalizarRelacionesExclusivas(p.relaciones);

        AgendaDB._guardarRelaciones(db, p.id, p.relaciones);
        AgendaDB._sincronizarRelaciones(db, p.id);

        if (!opciones.omitirHistorial && AgendaHistorial) {
            AgendaHistorial.registrarCambios(db, p.id, anterior, p, personas);
        }
        AgendaDB.guardar(db, dbPath);
        return p;
    },

    eliminarPersona: (db, dbPath, id) => {
        db.run("DELETE FROM personas WHERE id = ?", [id]);
        AgendaDB.guardar(db, dbPath);
    },

    obtenerPorId: (personas, id) => personas.find(p => p.id === id),

    nombreDe: (personas, id) => {
        const p = AgendaDB.obtenerPorId(personas, id);
        return p ? p.nombre : id;
    },

    calcularEdad: (fechaNac) => {
        if (!fechaNac) return null;
        const hoy = new Date();
        const nac = new Date(fechaNac + "T12:00:00");
        if (isNaN(nac.getTime())) return null;
        let edad = hoy.getFullYear() - nac.getFullYear();
        const m = hoy.getMonth() - nac.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
        return edad;
    },

    normalizarActividad: (act) => {
        if (act?.tipo && ["dias", "semanas", "meses"].includes(act.tipo)) {
            return { tipo: act.tipo, valor: Math.max(0, act.valor || 0) };
        }
        const dias = act?.dias || 0;
        const semanas = act?.semanas || 0;
        const meses = act?.meses || 0;
        if (dias > 0) return { tipo: "dias", valor: dias };
        if (semanas > 0) return { tipo: "semanas", valor: semanas };
        if (meses > 0) return { tipo: "meses", valor: meses };
        return { tipo: "semanas", valor: 0 };
    },

    serializarActividad: (act) => {
        const { tipo, valor } = AgendaDB.normalizarActividad(act);
        const v = valor > 0 ? valor : 0;
        return {
            dias: tipo === "dias" ? v : 0,
            semanas: tipo === "semanas" ? v : 0,
            meses: tipo === "meses" ? v : 0
        };
    },

    formatearActividadSocial: (act) => {
        const { tipo, valor } = AgendaDB.normalizarActividad(act);
        if (!valor) return "Sin frecuencia definida";
        if (tipo === "dias") return `Cada ${valor} día${valor > 1 ? "s" : ""}`;
        if (tipo === "semanas") return `Cada ${valor} semana${valor > 1 ? "s" : ""}`;
        return `Cada ${valor} mes${valor > 1 ? "es" : ""}`;
    },

    obtenerRangosIq: (db) => {
        const stmt = db.prepare("SELECT valor FROM agenda_config WHERE clave = 'iq_rangos'");
        let raw = "";
        if (stmt.step()) raw = stmt.get()[0] || "";
        stmt.free();
        try {
            return AgendaPerfil.normalizarRangosIq(JSON.parse(raw || "null"));
        } catch {
            return AgendaPerfil.normalizarRangosIq(null);
        }
    },

    guardarRangosIq: (db, dbPath, rangos) => {
        const limpios = AgendaPerfil.normalizarRangosIq(rangos);
        db.run(
            "INSERT INTO agenda_config (clave, valor) VALUES ('iq_rangos', ?) ON CONFLICT(clave) DO UPDATE SET valor = excluded.valor",
            [JSON.stringify(limpios)]
        );
        AgendaDB.guardar(db, dbPath);
        return limpios;
    },

    actualizarVocabulario: (personas, vocabulario) => {
        const pref = AgendaPreferencias.recolectarVocabulario(personas);
        const sets = {
            ciudades: new Set(vocabulario.ciudades || []),
            paises_nacimiento: new Set(vocabulario.paises_nacimiento || []),
            estados_nacimiento: new Set(vocabulario.estados_nacimiento || []),
            zonas_horarias: new Set(vocabulario.zonas_horarias || ["America/Mexico_City"]),
            grupos: new Set(vocabulario.grupos || []),
            puntos_destacables: new Set(AgendaPerfil.PUNTOS_SUGERIDOS),
            habitos: new Set(vocabulario.habitos || []),
            debilidades: new Set(vocabulario.debilidades || [])
        };
        personas.forEach(p => {
            if (p.ciudad) sets.ciudades.add(p.ciudad);
            if (p.pais_nacimiento) sets.paises_nacimiento.add(p.pais_nacimiento);
            if (p.estado_nacimiento) sets.estados_nacimiento.add(p.estado_nacimiento);
            if (p.zona_horaria) sets.zonas_horarias.add(p.zona_horaria);
            (p.grupos || []).forEach(g => { if (g) sets.grupos.add(g); });
            (p.puntos_destacables || []).forEach(x => { if (x) sets.puntos_destacables.add(x); });
            (p.habitos || []).forEach(x => { if (x) sets.habitos.add(x); });
            (p.debilidades || []).forEach(x => { if (x) sets.debilidades.add(x); });
        });
        return {
            ...pref,
            ciudades: [...sets.ciudades].sort((a, b) => a.localeCompare(b, "es")),
            paises_nacimiento: [...sets.paises_nacimiento].sort((a, b) => a.localeCompare(b, "es")),
            estados_nacimiento: [...sets.estados_nacimiento].sort((a, b) => a.localeCompare(b, "es")),
            zonas_horarias: [...sets.zonas_horarias].sort(),
            grupos: [...sets.grupos].sort((a, b) => a.localeCompare(b, "es")),
            puntos_destacables: [...sets.puntos_destacables].sort((a, b) => a.localeCompare(b, "es")),
            habitos: [...sets.habitos].sort((a, b) => a.localeCompare(b, "es")),
            debilidades: [...sets.debilidades].sort((a, b) => a.localeCompare(b, "es"))
        };
    },

    obtenerSugerencias: (estado) => {
        const alias = new Set();
        estado.personas.forEach(p => (p.alias || []).forEach(a => alias.add(a)));
        return {
            tipos_preferencia: estado.vocabulario.tipos_preferencia,
            elementos_por_tipo: estado.vocabulario.elementos_por_tipo,
            todos_elementos_gusto: estado.vocabulario.todos_elementos_gusto,
            todos_elementos_disgusto: estado.vocabulario.todos_elementos_disgusto,
            ciudades: estado.vocabulario.ciudades,
            paises_nacimiento: estado.vocabulario.paises_nacimiento,
            estados_nacimiento: estado.vocabulario.estados_nacimiento,
            zonas_horarias: estado.vocabulario.zonas_horarias,
            grupos: estado.vocabulario.grupos,
            puntos_destacables: estado.vocabulario.puntos_destacables,
            habitos: estado.vocabulario.habitos,
            debilidades: estado.vocabulario.debilidades,
            alias: [...alias].sort((a, b) => a.localeCompare(b, "es")),
            personas: estado.personas.map(p => ({ id: p.id, nombre: p.nombre, alias: p.alias || [] }))
        };
    },

    migrarDesdeFrontmatterSiVacio: async (app, db, dbPath) => {
        const count = db.exec("SELECT COUNT(*) FROM personas")[0]?.values[0][0] || 0;
        if (count > 0) return false;

        let personas = [];
        const file = app.vault.getAbstractFileByPath(AgendaDB.NOTE_PATH);
        if (file) {
            const { parseYaml } = require("obsidian");
            const contenido = await app.vault.read(file);
            const match = contenido.match(/^---\r?\n([\s\S]*?)\r?\n---/);
            if (match) personas = (parseYaml(match[1]) || {}).personas || [];
        }

        if (!personas.length) return false;

        // Fase 1: personas sin relaciones (evita FK rotas)
        personas.forEach(p => {
            const { relaciones, ...rest } = p;
            AgendaDB.upsertPersona(db, dbPath, {
                ...rest,
                id: p.id || AgendaDB._slugify(p.nombre),
                actividad_social: p.actividad_social || { tipo: "semanas", valor: 0 },
                relaciones: AgendaDB._relacionesVacias()
            }, { omitirHistorial: true });
        });

        // Fase 2: relaciones
        personas.forEach(p => {
            const id = p.id || AgendaDB._slugify(p.nombre);
            if (p.relaciones) {
                AgendaDB._guardarRelaciones(db, id, p.relaciones);
                AgendaDB._sincronizarRelaciones(db, id);
            }
        });
        AgendaDB.guardar(db, dbPath);
        return true;
    },

    _filaAActividad: (r) => AgendaCalendario?.normalizar({
        id: r[0], titulo: r[1], tipo: r[2], icono: r[3], fecha: r[4], fecha_fin: r[5],
        estado: r[6], notas: r[7],
        persona_ids: AgendaDB._json(r[8], []),
        grupos: AgendaDB._json(r[9], []),
        tarea_kanban_id: r[10], creado_en: r[11], iniciado_en: r[12],
        terminado_en: r[13], descartado_en: r[14]
    }) || {},

    obtenerActividades: (db) => {
        const stmt = db.prepare(`SELECT id, titulo, tipo, icono, fecha, fecha_fin, estado, notas,
            persona_ids, grupos, tarea_kanban_id, creado_en, iniciado_en, terminado_en, descartado_en
            FROM agenda_actividades ORDER BY fecha DESC, creado_en DESC`);
        const rows = [];
        while (stmt.step()) rows.push(AgendaDB._filaAActividad(stmt.get()));
        stmt.free();
        return rows;
    },

    _bridge: () => getTaskBoardBridge(),

    _kanbanDisponible: () => getTaskBoardBridge()?.isAvailable?.() ?? false,

    _sincronizarTareasHuerfanas: (db, dbPath, SQL, kanbanPath) => {
        if (!AgendaDB._kanbanDisponible()) return;
        const personas = AgendaDB.obtenerTodas(db);
        let cambio = false;
        AgendaDB.obtenerActividades(db).forEach(act => {
            if (act.tipo !== "tarea" || act.tarea_kanban_id) return;
            const id = AgendaDB._sincronizarKanban(act, personas, SQL, kanbanPath, dbPath);
            if (id) {
                act.tarea_kanban_id = id;
                AgendaDB._guardarActividadDb(db, act);
                cambio = true;
            }
        });
        if (cambio) AgendaDB.guardar(db, dbPath);
    },

    sincronizarEstadosDesdeKanban: (db, dbPath, SQL, kanbanPath) => {
        const bridge = AgendaDB._bridge();
        if (!bridge?.isAvailable()) return;
        const tareas = bridge.obtenerTodas();
        const mapa = new Map(tareas.map(t => [t.id, t]));
        AgendaDB.obtenerActividades(db).forEach(act => {
            if (act.tipo !== "tarea" || !act.tarea_kanban_id) return;
            const kt = mapa.get(act.tarea_kanban_id);
            if (!kt) return;
            const nuevo = AgendaCalendario.estadoDesdeKanban(kt.estado);
            if (nuevo === act.estado) return;
            const actualizado = AgendaCalendario.aplicarEstado({ ...act, estado: nuevo });
            AgendaDB._guardarActividadDb(db, actualizado);
        });
        AgendaDB.guardar(db, dbPath);
    },

    _guardarActividadDb: (db, act) => {
        db.run(`INSERT INTO agenda_actividades (id, titulo, tipo, icono, fecha, fecha_fin, estado, notas,
            persona_ids, grupos, tarea_kanban_id, creado_en, iniciado_en, terminado_en, descartado_en)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(id) DO UPDATE SET
            titulo=excluded.titulo, tipo=excluded.tipo, icono=excluded.icono, fecha=excluded.fecha,
            fecha_fin=excluded.fecha_fin, estado=excluded.estado, notas=excluded.notas,
            persona_ids=excluded.persona_ids, grupos=excluded.grupos, tarea_kanban_id=excluded.tarea_kanban_id,
            creado_en=excluded.creado_en, iniciado_en=excluded.iniciado_en,
            terminado_en=excluded.terminado_en, descartado_en=excluded.descartado_en`, [
            act.id, act.titulo, act.tipo, act.icono, act.fecha, act.fecha_fin, act.estado, act.notas,
            JSON.stringify(act.persona_ids), JSON.stringify(act.grupos), act.tarea_kanban_id,
            act.creado_en, act.iniciado_en, act.terminado_en, act.descartado_en
        ]);
    },

    _sincronizarKanban: (act, personas, SQL, kanbanPath, dbPath) => {
        const bridge = AgendaDB._bridge();
        if (!bridge?.isAvailable()) return act.tarea_kanban_id || 0;

        if (act.tipo !== "tarea") {
            if (act.tarea_kanban_id) {
                bridge.eliminarTarea(act.tarea_kanban_id);
                act.tarea_kanban_id = 0;
            }
            return 0;
        }

        const proyecto = AgendaCalendario.resolverProyecto(act, personas);
        const payload = {
            texto: act.titulo,
            proyecto,
            estado: AgendaCalendario.estadoAKanban(act.estado),
            nota: bridge.notaConMarcaAgenda(act.notas, act.id),
            requisito_ids: [],
            subtareas: [],
            imagenes: []
        };

        const porMarca = bridge.buscarIdPorAgendaId(act.id);
        const kanbanId = porMarca || act.tarea_kanban_id;

        if (kanbanId) {
            act.tarea_kanban_id = kanbanId;
            bridge.actualizarTarea(kanbanId, payload);
        } else {
            act.tarea_kanban_id = bridge.crearTarea(payload);
        }
        return act.tarea_kanban_id;
    },

    upsertActividad: (db, dbPath, datos, opciones = {}) => {
        const personas = opciones.personas || AgendaDB.obtenerTodas(db);
        let act = AgendaCalendario.normalizar(datos);
        if (!act.titulo) throw new Error("El título es obligatorio.");
        if (!act.fecha) throw new Error("La fecha es obligatoria.");

        const miId = AgendaDB.obtenerMiPersonaId(db);
        if (!act.persona_ids.length && miId) act.persona_ids = [miId];

        const anterior = act.id ? AgendaDB.obtenerActividades(db).find(a => a.id === act.id) : null;
        if (!act.id) act.id = AgendaDB._slugify(act.titulo) + "-" + Date.now().toString(36);
        if (!act.creado_en) act.creado_en = AgendaCalendario._ahora();

        if (anterior && anterior.estado !== act.estado) {
            act = AgendaCalendario.aplicarEstado(act, act.estado);
        } else if (anterior) {
            act.iniciado_en = anterior.iniciado_en;
            act.terminado_en = anterior.terminado_en;
            act.descartado_en = anterior.descartado_en;
            act.tarea_kanban_id = act.tarea_kanban_id || anterior.tarea_kanban_id;
        }

        if (!opciones.omitirKanban && opciones.SQL && opciones.kanbanPath) {
            act.tarea_kanban_id = AgendaDB._sincronizarKanban(
                act, personas, opciones.SQL, opciones.kanbanPath, dbPath
            );
        }

        AgendaDB._guardarActividadDb(db, act);
        AgendaDB.guardar(db, dbPath);

        if (act.tipo === "tarea" && !act.tarea_kanban_id && !opciones.omitirKanban) {
            throw new Error("No se pudo crear la tarea en Task Board. Activa el plugin vault-task-board e intenta de nuevo.");
        }

        return act;
    },

    eliminarActividad: (db, dbPath, id, opciones = {}) => {
        const act = AgendaDB.obtenerActividades(db).find(a => a.id === id);
        if (!act) return;
        if (act.tarea_kanban_id && opciones.SQL && opciones.kanbanPath && AgendaDB._kanbanDisponible()) {
            AgendaDB._bridge().eliminarTarea(act.tarea_kanban_id);
        }
        db.run("DELETE FROM agenda_actividades WHERE id = ?", [id]);
        AgendaDB.guardar(db, dbPath);
    }
};
