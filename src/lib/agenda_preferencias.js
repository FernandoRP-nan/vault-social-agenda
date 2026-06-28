/* agenda_preferencias.js - Gustos y disgustos por categoría reutilizable */

window.AgendaPreferencias = {
    TIPOS_SUGERIDOS: ["comida", "música", "películas", "series", "actividades", "deportes", "otros"],

    normalizar: (val) => {
        if (!val) return {};
        if (Array.isArray(val)) {
            const out = {};
            val.filter(Boolean).forEach(g => {
                const t = String(g).trim();
                if (!t) return;
                if (!out.general) out.general = [];
                if (!out.general.includes(t)) out.general.push(t);
            });
            return out;
        }
        if (typeof val === "object") {
            const out = {};
            Object.entries(val).forEach(([k, items]) => {
                const tipo = String(k).trim();
                if (!tipo) return;
                const lista = Array.isArray(items) ? items : [];
                out[tipo] = [...new Set(lista.map(x => String(x).trim()).filter(Boolean))];
            });
            return out;
        }
        return {};
    },

    clonar: (val) => {
        const n = window.AgendaPreferencias.normalizar(val);
        const out = {};
        Object.keys(n).forEach(t => { out[t] = [...n[t]]; });
        return out;
    },

    serializarTexto: (val) => {
        const n = window.AgendaPreferencias.normalizar(val);
        return Object.keys(n).sort((a, b) => a.localeCompare(b, "es")).map(tipo => {
            const elems = n[tipo];
            if (!elems.length) return `${tipo}: (vacío)`;
            return `${tipo}: ${elems.join(", ")}`;
        }).join(" · ") || "(vacío)";
    },

    aplanarTexto: (val) => {
        const n = window.AgendaPreferencias.normalizar(val);
        const partes = [];
        Object.entries(n).forEach(([tipo, elems]) => {
            partes.push(tipo);
            elems.forEach(e => partes.push(e));
        });
        return partes;
    },

    contarElementos: (val) => {
        const n = window.AgendaPreferencias.normalizar(val);
        return Object.values(n).reduce((s, arr) => s + arr.length, 0);
    },

    coincideFiltro: (val, tipo, elemento = "") => {
        if (!tipo) return true;
        const n = window.AgendaPreferencias.normalizar(val);
        const lista = n[tipo];
        if (!lista?.length) return false;
        if (!elemento) return true;
        return lista.includes(elemento);
    },

    recolectarVocabulario: (personas) => {
        const tipos = new Set(window.AgendaPreferencias.TIPOS_SUGERIDOS);
        const elementosPorTipo = {};
        const todosGusto = new Set();
        const todosDisgusto = new Set();

        const add = (prefs, todosSet) => {
            Object.entries(window.AgendaPreferencias.normalizar(prefs)).forEach(([tipo, elems]) => {
                tipos.add(tipo);
                if (!elementosPorTipo[tipo]) elementosPorTipo[tipo] = new Set();
                elems.forEach(e => {
                    elementosPorTipo[tipo].add(e);
                    todosSet.add(e);
                });
            });
        };

        personas.forEach(p => {
            add(p.gustos, todosGusto);
            add(p.disgustos, todosDisgusto);
        });

        const mapaOrdenado = {};
        [...tipos].sort((a, b) => a.localeCompare(b, "es")).forEach(t => {
            mapaOrdenado[t] = [...(elementosPorTipo[t] || [])].sort((a, b) => a.localeCompare(b, "es"));
        });

        return {
            tipos_preferencia: [...tipos].sort((a, b) => a.localeCompare(b, "es")),
            elementos_por_tipo: mapaOrdenado,
            todos_elementos_gusto: [...todosGusto].sort((a, b) => a.localeCompare(b, "es")),
            todos_elementos_disgusto: [...todosDisgusto].sort((a, b) => a.localeCompare(b, "es"))
        };
    }
};
