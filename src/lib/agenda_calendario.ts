/* agenda_calendario.ts — migrado a módulo TS */
// @ts-nocheck
import { AgendaDB } from "./agenda_db";

/* agenda_calendario.js - Eventos, tareas, timeline y calendario por persona */

export const AgendaCalendario = {
    ICONOS: ["📅", "🎂", "📞", "☕", "🎁", "✈️", "💼", "🎓", "❤️", "⭐", "🔔", "📝", "🎯", "🏠", "🎉"],
    ESTADOS: ["pendiente", "en_proceso", "terminado", "descartado"],
    PROYECTO_PERSONAL: "Personal",

    _ahora: () => new Date().toISOString(),

    normalizar: (a) => ({
        id: a?.id || "",
        titulo: (a?.titulo || "").trim(),
        tipo: a?.tipo === "tarea" ? "tarea" : "evento",
        icono: (a?.icono || "📅").trim() || "📅",
        fecha: (a?.fecha || "").slice(0, 10),
        fecha_fin: (a?.fecha_fin || "").slice(0, 10),
        estado: AgendaCalendario.ESTADOS.includes(a?.estado) ? a.estado : "pendiente",
        notas: (a?.notas || "").trim(),
        persona_ids: [...new Set((a?.persona_ids || []).filter(Boolean))],
        grupos: [...new Set((a?.grupos || []).map(g => String(g).trim()).filter(Boolean))],
        tarea_kanban_id: parseInt(a?.tarea_kanban_id, 10) || 0,
        creado_en: a?.creado_en || "",
        iniciado_en: a?.iniciado_en || "",
        terminado_en: a?.terminado_en || "",
        descartado_en: a?.descartado_en || ""
    }),

    estadoAKanban: (estado) => ({
        pendiente: "Por Hacer",
        en_proceso: "En Proceso",
        terminado: "Terminado",
        descartado: "Terminado"
    }[estado] || "Por Hacer"),

    estadoDesdeKanban: (estado) => ({
        "Por Hacer": "pendiente",
        "En Proceso": "en_proceso",
        "Terminado": "terminado"
    }[estado] || "pendiente"),

    resolverProyecto: (actividad, personas) => {
        const a = AgendaCalendario.normalizar(actividad);
        if (a.grupos.length) return a.grupos[0];
        for (const pid of a.persona_ids) {
            const p = personas.find(x => x.id === pid);
            if (p?.grupos?.length) return p.grupos[0];
        }
        return AgendaCalendario.PROYECTO_PERSONAL;
    },

    aplicarEstado: (act, estado, ahora = null) => {
        const ts = ahora || AgendaCalendario._ahora();
        const out = { ...act, estado };
        if (estado === "en_proceso" && !out.iniciado_en) out.iniciado_en = ts;
        if (estado === "terminado" && !out.terminado_en) out.terminado_en = ts;
        if (estado === "descartado" && !out.descartado_en) out.descartado_en = ts;
        return out;
    },

    filtrarPorPersona: (actividades, personaId) =>
        actividades.filter(a =>
            (a.persona_ids || []).includes(personaId) ||
            !(a.persona_ids || []).length && personaId === null
        ),

    perteneceAMiPersona: (act, miId) =>
        !act.persona_ids?.length ? miId : act.persona_ids.includes(miId),

    formatearFecha: (iso) => {
        if (!iso) return "—";
        try {
            const d = new Date(iso.length <= 10 ? iso + "T12:00:00" : iso);
            return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
        } catch { return iso; }
    },

    formatearFechaHora: (iso) => {
        if (!iso) return "—";
        try {
            const d = new Date(iso);
            return d.toLocaleString("es-MX", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            });
        } catch { return iso; }
    },

    fechasImportantes: (personas, limite = 60) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const items = [];
        personas.forEach(p => {
            if (!p.fecha_nacimiento) return;
            const [, mes, dia] = p.fecha_nacimiento.split("-").map(Number);
            if (!mes || !dia) return;
            let prox = new Date(hoy.getFullYear(), mes - 1, dia);
            if (prox < hoy) prox = new Date(hoy.getFullYear() + 1, mes - 1, dia);
            const diff = Math.round((prox - hoy) / 86400000);
            if (diff > limite) return;
            items.push({
                id: `cumple-${p.id}`,
                titulo: `Cumpleaños de ${p.nombre}`,
                tipo: "fecha_importante",
                icono: "🎂",
                fecha: prox.toISOString().slice(0, 10),
                persona_ids: [p.id],
                diasRestantes: diff,
                esHoy: diff === 0
            });
        });
        return items.sort((a, b) => a.fecha.localeCompare(b.fecha));
    },

    proximos: (actividades, personas, dias = 30) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const limite = new Date(hoy);
        limite.setDate(limite.getDate() + dias);
        const importantes = AgendaCalendario.fechasImportantes(personas, dias);
        const acts = actividades
            .filter(a => a.estado !== "descartado" && a.estado !== "terminado")
            .map(a => ({ ...a, _sort: a.fecha }))
            .filter(a => {
                const d = new Date(a.fecha + "T12:00:00");
                return d >= hoy && d <= limite;
            });
        return [...importantes, ...acts].sort((a, b) => a.fecha.localeCompare(b.fecha) || a.titulo.localeCompare(b.titulo, "es"));
    },

    hitosTimeline: (act) => {
        const h = [];
        if (act.creado_en) h.push({ tipo: "creado", fecha: act.creado_en, label: "Agregado" });
        if (act.iniciado_en) h.push({ tipo: "inicio", fecha: act.iniciado_en, label: "Iniciado" });
        if (act.terminado_en) h.push({ tipo: "fin", fecha: act.terminado_en, label: "Terminado" });
        if (act.descartado_en) h.push({ tipo: "descartado", fecha: act.descartado_en, label: "Descartado" });
        return h.sort((a, b) => a.fecha.localeCompare(b.fecha));
    },

    _nombrePersonas: (ids, personas) =>
        (ids || []).map(id => AgendaDB.nombreDe(personas, id)).filter(Boolean).join(", "),

    renderTarjetaProximo: (parent, item, personas, onClick) => {
        const card = parent.createEl("div", { cls: "agenda-cal-prox-card" });
        card.createEl("span", { text: item.icono || "📅", cls: "agenda-cal-prox-icono" });
        const cuerpo = card.createEl("div", { cls: "agenda-cal-prox-cuerpo" });
        cuerpo.createEl("strong", { text: item.titulo });
        const meta = [];
        meta.push(AgendaCalendario.formatearFecha(item.fecha));
        if (item.diasRestantes !== undefined) {
            meta.push(item.esHoy ? "¡Hoy!" : `En ${item.diasRestantes} día${item.diasRestantes !== 1 ? "s" : ""}`);
        }
        if (item.tipo === "tarea") meta.push("Tarea");
        else if (item.tipo === "evento") meta.push("Evento");
        else meta.push("Fecha importante");
        const nombres = AgendaCalendario._nombrePersonas(item.persona_ids, personas);
        if (nombres) meta.push(nombres);
        cuerpo.createEl("small", { text: meta.join(" · ") });
        if (onClick && item.tipo !== "fecha_importante") card.onclick = () => onClick(item);
        return card;
    },

    renderProximos: (parent, actividades, personas, opts = {}) => {
        const wrap = parent.createEl("div", { cls: "agenda-cal-proximos" });
        const items = AgendaCalendario.proximos(actividades, personas, opts.dias || 30)
            .filter(it => !opts.personaId || (it.persona_ids || []).includes(opts.personaId) || it.tipo === "fecha_importante" && it.persona_ids?.includes(opts.personaId));
        if (!items.length) {
            wrap.createEl("p", { text: "Sin eventos próximos.", style: "color: var(--text-muted); font-style: italic; margin: 0;" });
            return wrap;
        }
        items.slice(0, opts.max || 8).forEach(it =>
            AgendaCalendario.renderTarjetaProximo(wrap, it, personas, opts.onEdit));
        return wrap;
    },

    renderTimeline: (parent, actividades, personas, opts = {}) => {
        const lista = parent.createEl("div", { cls: "agenda-cal-timeline" });
        let acts = [...actividades];
        if (opts.personaId) {
            acts = acts.filter(a => (a.persona_ids || []).includes(opts.personaId));
        }
        acts.sort((a, b) => (b.creado_en || b.fecha).localeCompare(a.creado_en || a.fecha));
        if (!acts.length) {
            lista.createEl("p", { text: "Sin actividades registradas.", style: "color: var(--text-muted); font-style: italic;" });
            return lista;
        }
        acts.forEach(act => {
            const item = lista.createEl("div", { cls: "agenda-cal-timeline-item" });
            const cab = item.createEl("div", { cls: "agenda-cal-timeline-cab" });
            cab.createEl("span", { text: act.icono || "📅" });
            cab.createEl("strong", { text: act.titulo });
            cab.createEl("span", {
                text: act.tipo === "tarea" ? "Tarea" : "Evento",
                cls: `agenda-cal-badge agenda-cal-badge--${act.tipo}`
            });
            cab.createEl("span", { text: act.estado.replace("_", " "), cls: "agenda-cal-badge agenda-cal-badge--estado" });
            if (opts.onEdit) {
                cab.createEl("button", { text: "✏️", cls: "agenda-cal-btn-mini" }).onclick = (e) => {
                    e.stopPropagation();
                    opts.onEdit(act);
                };
            }
            const hitos = AgendaCalendario.hitosTimeline(act);
            const ul = item.createEl("ul", { cls: "agenda-cal-hitos" });
            hitos.forEach(h => {
                const li = ul.createEl("li");
                li.createEl("span", { text: h.label, cls: "agenda-cal-hito-label" });
                li.createEl("span", { text: AgendaCalendario.formatearFechaHora(h.fecha) });
            });
            if (act.fecha) {
                const prog = ul.createEl("li");
                prog.createEl("span", { text: "Programado", cls: "agenda-cal-hito-label" });
                prog.createEl("span", { text: AgendaCalendario.formatearFecha(act.fecha) });
            }
            const nombres = AgendaCalendario._nombrePersonas(act.persona_ids, personas);
            if (nombres) item.createEl("small", { text: `👤 ${nombres}`, style: "color: var(--text-muted);" });
        });
        return lista;
    },

    _diasMes: (anio, mes) => new Date(anio, mes + 1, 0).getDate(),

    _itemsEnDia: (fecha, actividades, importantes) => {
        const acts = actividades.filter(a => a.fecha === fecha || (a.fecha_fin && fecha >= a.fecha && fecha <= a.fecha_fin));
        const imps = importantes.filter(i => i.fecha === fecha);
        return [...imps, ...acts];
    },

    renderCalendario: (parent, actividades, personas, opts = {}) => {
        const hoy = new Date();
        let anio = opts.anio ?? hoy.getFullYear();
        let mes = opts.mes ?? hoy.getMonth();
        const cont = parent.createEl("div", { cls: "agenda-cal-wrap" });
        const nav = cont.createEl("div", { cls: "agenda-cal-nav" });
        const titulo = nav.createEl("strong");
        const btnPrev = nav.createEl("button", { text: "◀", cls: "agenda-cal-nav-btn" });
        const btnNext = nav.createEl("button", { text: "▶", cls: "agenda-cal-nav-btn" });
        const gridHost = cont.createEl("div");

        const importantes = AgendaCalendario.fechasImportantes(personas, 366);

        const pintar = () => {
            gridHost.empty();
            titulo.setText(new Date(anio, mes, 1).toLocaleDateString("es-MX", { month: "long", year: "numeric" }));
            const grid = gridHost.createEl("div", { cls: "agenda-cal-grid" });
            ["L", "M", "X", "J", "V", "S", "D"].forEach(d => grid.createEl("div", { text: d, cls: "agenda-cal-dow" }));
            const primerDia = new Date(anio, mes, 1);
            let offset = (primerDia.getDay() + 6) % 7;
            for (let i = 0; i < offset; i++) grid.createEl("div", { cls: "agenda-cal-celda agenda-cal-celda--vacia" });
            const total = AgendaCalendario._diasMes(anio, mes);
            const hoyStr = hoy.toISOString().slice(0, 10);
            for (let d = 1; d <= total; d++) {
                const fecha = `${anio}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const celda = grid.createEl("div", {
                    cls: `agenda-cal-celda${fecha === hoyStr ? " agenda-cal-celda--hoy" : ""}`
                });
                celda.createEl("span", { text: String(d), cls: "agenda-cal-dia-num" });
                const items = AgendaCalendario._itemsEnDia(fecha, actividades, importantes);
                if (opts.personaId) {
                    items.filter(it =>
                        it.tipo === "fecha_importante" ? it.persona_ids?.includes(opts.personaId)
                            : (it.persona_ids || []).includes(opts.personaId)
                    );
                }
                const filtrados = opts.personaId
                    ? items.filter(it => it.tipo === "fecha_importante"
                        ? it.persona_ids?.includes(opts.personaId)
                        : (it.persona_ids || []).includes(opts.personaId))
                    : items;
                const chips = celda.createEl("div", { cls: "agenda-cal-celda-chips" });
                filtrados.slice(0, 3).forEach(it => {
                    chips.createEl("span", {
                        text: `${it.icono || "📅"} ${it.titulo.slice(0, 12)}${it.titulo.length > 12 ? "…" : ""}`,
                        cls: "agenda-cal-chip",
                        title: it.titulo
                    });
                });
                if (filtrados.length > 3) chips.createEl("span", { text: `+${filtrados.length - 3}`, cls: "agenda-cal-chip" });
                celda.onclick = () => opts.onDiaClick?.(fecha, filtrados);
            }
        };

        btnPrev.onclick = () => { mes--; if (mes < 0) { mes = 11; anio--; } pintar(); };
        btnNext.onclick = () => { mes++; if (mes > 11) { mes = 0; anio++; } pintar(); };
        pintar();
        return cont;
    },

    injectStyles: () => {
        const ID = "estilos-agenda-cal-v1";
        if (document.getElementById(ID)) return;
        const el = document.createElement("style");
        el.id = ID;
        el.textContent = `
            .agenda-cal-proximos { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
            .agenda-cal-prox-card { display: flex; gap: 12px; padding: 14px; border-radius: 10px;
                background: var(--background-primary); border: 1px solid var(--background-modifier-border);
                cursor: pointer; transition: border-color .2s; }
            .agenda-cal-prox-card:hover { border-color: var(--interactive-accent); }
            .agenda-cal-prox-icono { font-size: 1.6em; flex-shrink: 0; }
            .agenda-cal-prox-cuerpo { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
            .agenda-cal-prox-cuerpo small { color: var(--text-muted); font-size: 0.82em; }
            .agenda-cal-timeline { display: flex; flex-direction: column; gap: 14px; }
            .agenda-cal-timeline-item { padding: 14px 16px; border-radius: 10px;
                background: var(--background-primary); border: 1px solid var(--background-modifier-border); }
            .agenda-cal-timeline-cab { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 10px; }
            .agenda-cal-badge { font-size: 0.75em; padding: 3px 8px; border-radius: 10px;
                background: var(--background-modifier-border); text-transform: capitalize; }
            .agenda-cal-badge--tarea { background: rgba(99,102,241,.15); color: var(--text-accent); }
            .agenda-cal-badge--evento { background: rgba(16,185,129,.12); color: #059669; }
            .agenda-cal-hitos { margin: 0; padding-left: 18px; font-size: 0.88em; line-height: 1.6; }
            .agenda-cal-hito-label { font-weight: 600; margin-right: 8px; color: var(--text-muted); }
            .agenda-cal-btn-mini { border: none; background: none; cursor: pointer; margin-left: auto; }
            .agenda-cal-wrap { background: var(--background-secondary); border: 1px solid var(--background-modifier-border);
                border-radius: 12px; padding: 16px; }
            .agenda-cal-nav { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
            .agenda-cal-nav strong { flex: 1; text-transform: capitalize; color: var(--text-accent); }
            .agenda-cal-nav-btn { border: 1px solid var(--background-modifier-border); background: var(--background-primary);
                border-radius: 6px; padding: 6px 12px; cursor: pointer; }
            .agenda-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
            .agenda-cal-dow { text-align: center; font-size: 0.78em; font-weight: 700; color: var(--text-muted); padding: 4px; }
            .agenda-cal-celda { min-height: 72px; padding: 6px; border-radius: 8px;
                background: var(--background-primary); border: 1px solid var(--background-modifier-border);
                cursor: pointer; font-size: 0.78em; }
            .agenda-cal-celda--hoy { border-color: var(--interactive-accent); box-shadow: 0 0 0 1px var(--interactive-accent); }
            .agenda-cal-celda--vacia { background: transparent; border: none; cursor: default; }
            .agenda-cal-dia-num { font-weight: 700; display: block; margin-bottom: 4px; }
            .agenda-cal-celda-chips { display: flex; flex-direction: column; gap: 2px; }
            .agenda-cal-chip { overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                padding: 2px 4px; border-radius: 4px; background: var(--background-modifier-border); }
            .agenda-vista-tabs { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
            .agenda-vista-tab { padding: 8px 16px; border-radius: 8px; border: 1px solid var(--background-modifier-border);
                background: var(--background-primary); cursor: pointer; font-weight: 600; }
            .agenda-vista-tab--activa { background: var(--interactive-accent); color: var(--text-on-accent); border-color: transparent; }
        `;
        document.head.appendChild(el);
    }
};
