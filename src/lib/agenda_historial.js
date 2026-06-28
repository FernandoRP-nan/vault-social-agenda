/* agenda_historial.js - Registro y visualización de cambios por persona */

window.AgendaHistorial = {
    SCHEMA: `CREATE TABLE IF NOT EXISTS persona_historial (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        persona_id TEXT NOT NULL,
        fecha TEXT NOT NULL,
        campo TEXT NOT NULL,
        valor_anterior TEXT DEFAULT '',
        valor_nuevo TEXT DEFAULT '',
        FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE
    );`,

    ETIQUETAS: {
        nombre: "Nombre",
        alias: "Alias",
        grupos: "Grupos",
        foto: "Foto",
        fecha_nacimiento: "Fecha de nacimiento",
        hora_nacimiento: "Hora de nacimiento",
        hora_nacimiento_desconocida: "Hora desconocida",
        latitud: "Latitud",
        longitud: "Longitud",
        pais_nacimiento: "País de nacimiento",
        estado_nacimiento: "Estado / provincia de nacimiento",
        zona_horaria: "Zona horaria",
        ciudad: "Ciudad",
        telefono: "Teléfono",
        email: "Email",
        instagram: "Instagram",
        twitter: "Twitter",
        facebook: "Facebook",
        gustos: "Gustos",
        disgustos: "Disgustos",
        notas: "Notas",
        mbti: "MBTI",
        eneagrama: "Eneagrama",
        color_favorito: "Color favorito",
        actividad_social: "Actividad social",
        relaciones: "Relaciones",
        puntos_destacables: "Puntos destacables",
        iq_aproximado: "IQ aproximado",
        inteligencias: "Niveles de inteligencia",
        moralidad: "Moralidad",
        etica: "Ética",
        potencial: "Potencial",
        habitos: "Hábitos",
        debilidades: "Debilidades",
        _creacion: "Registro"
    },

    init: (db) => { db.run(window.AgendaHistorial.SCHEMA); },

    _ahora: () => new Date().toISOString(),

    _serializar: (campo, valor, personas = []) => {
        if (valor === undefined || valor === null) return "";
        if (campo === "alias" || campo === "grupos") {
            return Array.isArray(valor) ? valor.join(", ") : String(valor);
        }
        if (campo === "gustos" || campo === "disgustos") {
            return window.AgendaPreferencias.serializarTexto(valor);
        }
        if (campo === "puntos_destacables" || campo === "habitos" || campo === "debilidades") {
            return window.AgendaPerfil.normalizarLista(valor).join(", ") || "(vacío)";
        }
        if (campo === "iq_aproximado") {
            const txt = window.AgendaPerfil.formatearIq(valor?.min, valor?.max);
            const etq = window.AgendaPerfil.etiquetaRangoIq(valor?.min, valor?.max);
            return etq ? `${txt} (${etq})` : (txt || "(vacío)");
        }
        if (campo === "inteligencias") {
            return window.AgendaPerfil.serializarInteligencias(valor);
        }
        if (campo === "actividad_social") {
            return window.AgendaDB.formatearActividadSocial(valor);
        }
        if (campo === "hora_nacimiento_desconocida") {
            return valor ? "Sí" : "No";
        }
        if (campo === "latitud" || campo === "longitud") {
            const n = parseFloat(valor);
            return isNaN(n) ? "(vacío)" : String(n);
        }
        if (campo === "relaciones") {
            const partes = [];
            (window.AgendaDB?.TIPOS_RELACION || []).forEach(t => {
                const ids = valor?.[t] || [];
                if (ids.length) {
                    const nombres = ids.map(id => window.AgendaDB.nombreDe(personas, id)).join(", ");
                    partes.push(`${t}: ${nombres}`);
                }
            });
            return partes.join(" · ") || "(vacío)";
        }
        return String(valor).trim();
    },

    _snapshot: (p, personas) => ({
        nombre: p.nombre,
        alias: p.alias,
        grupos: p.grupos,
        foto: p.foto,
        fecha_nacimiento: p.fecha_nacimiento,
        hora_nacimiento: p.hora_nacimiento,
        hora_nacimiento_desconocida: p.hora_nacimiento_desconocida,
        latitud: p.latitud,
        longitud: p.longitud,
        pais_nacimiento: p.pais_nacimiento,
        estado_nacimiento: p.estado_nacimiento,
        zona_horaria: p.zona_horaria,
        ciudad: p.ciudad,
        telefono: p.contacto?.telefono,
        email: p.contacto?.email,
        instagram: p.redes?.instagram,
        twitter: p.redes?.twitter,
        facebook: p.redes?.facebook,
        gustos: p.gustos,
        disgustos: p.disgustos,
        notas: p.notas,
        mbti: p.mbti,
        eneagrama: p.eneagrama,
        color_favorito: p.color_favorito,
        actividad_social: p.actividad_social,
        relaciones: p.relaciones,
        puntos_destacables: p.puntos_destacables,
        iq_aproximado: { min: p.iq_min, max: p.iq_max },
        inteligencias: p.inteligencias,
        moralidad: p.moralidad,
        etica: p.etica,
        potencial: p.potencial,
        habitos: p.habitos,
        debilidades: p.debilidades
    }),

    registrarCambios: (db, personaId, anterior, nuevo, personas) => {
        const campos = Object.keys(window.AgendaHistorial.ETIQUETAS).filter(k => k !== "_creacion");
        const stmt = db.prepare(
            "INSERT INTO persona_historial (persona_id, fecha, campo, valor_anterior, valor_nuevo) VALUES (?,?,?,?,?)"
        );
        const fecha = window.AgendaHistorial._ahora();

        if (!anterior) {
            stmt.run([personaId, fecha, "_creacion", "", "Persona creada en la agenda"]);
            stmt.free();
            return;
        }

        const snapA = window.AgendaHistorial._snapshot(anterior, personas);
        const snapN = window.AgendaHistorial._snapshot(nuevo, personas);

        campos.forEach(campo => {
            const va = window.AgendaHistorial._serializar(campo, snapA[campo], personas);
            const vn = window.AgendaHistorial._serializar(campo, snapN[campo], personas);
            if (va !== vn) stmt.run([personaId, fecha, campo, va, vn]);
        });
        stmt.free();
    },

    obtener: (db, personaId) => {
        const stmt = db.prepare(
            "SELECT id, fecha, campo, valor_anterior, valor_nuevo FROM persona_historial WHERE persona_id = ? ORDER BY fecha DESC, id DESC"
        );
        stmt.bind([personaId]);
        const rows = [];
        while (stmt.step()) {
            const [id, fecha, campo, anterior, nuevo] = stmt.get();
            rows.push({ id, fecha, campo, valor_anterior: anterior, valor_nuevo: nuevo });
        }
        stmt.free();
        return rows;
    },

    eliminar: (db, dbPath, entradaId) => {
        db.run("DELETE FROM persona_historial WHERE id = ?", [entradaId]);
        window.AgendaDB.guardar(db, dbPath);
    },

    formatearFecha: (iso) => {
        try {
            const d = new Date(iso);
            return d.toLocaleString("es-MX", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            });
        } catch { return iso; }
    },

    etiquetaCampo: (campo) => window.AgendaHistorial.ETIQUETAS[campo] || campo
};
