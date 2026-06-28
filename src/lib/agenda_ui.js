/* agenda_ui.js - Dashboard visual de la agenda social */

window.AgendaUI = {
    injectStyles: () => {
        const ID = "estilos-agenda-social-v12";
        document.getElementById("estilos-agenda-social-v11")?.remove();
        document.getElementById("estilos-agenda-social-v10")?.remove();
        document.getElementById("estilos-agenda-social-v9")?.remove();
        document.getElementById("estilos-agenda-social-v8")?.remove();
        let el = document.getElementById(ID);
        if (!el) {
            el = document.createElement("style");
            el.id = ID;
            document.head.appendChild(el);
        }
        el.textContent = `
            .agenda-shell { display: flex; flex-direction: column; gap: 0; }
            .agenda-cabecera {
                position: sticky; top: 0; z-index: 20;
                background: var(--background-primary);
                border-bottom: 1px solid var(--background-modifier-border);
                padding-bottom: 10px; margin-bottom: 12px;
            }
            .agenda-panel {
                background: var(--background-secondary);
                border: 1px solid var(--background-modifier-border);
                border-radius: 10px; padding: 12px 14px; margin-bottom: 10px;
            }
            .agenda-panel--compact { padding: 10px 12px; margin-bottom: 8px; }
            .agenda-herramientas {
                display: flex; flex-wrap: wrap; gap: 10px; align-items: center;
                justify-content: space-between;
            }
            .agenda-herramientas-acciones {
                display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
            }
            .agenda-herramientas-acciones button,
            .agenda-herramientas-acciones select {
                height: 36px; padding: 0 12px; border-radius: 8px;
                border: 1px solid var(--background-modifier-border);
                background: var(--background-primary); cursor: pointer;
            }
            .agenda-herramientas-acciones button.agenda-btn-primario {
                background: var(--interactive-accent); color: var(--text-on-accent);
                border-color: transparent; font-weight: 700;
            }
            .agenda-vista-tabs {
                display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;
            }
            .agenda-vista-tab {
                padding: 7px 14px; border-radius: 8px;
                border: 1px solid var(--background-modifier-border);
                background: var(--background-secondary); color: var(--text-normal);
                cursor: pointer; font-size: 0.88em; font-weight: 600;
            }
            .agenda-vista-tab:hover { border-color: var(--interactive-accent); }
            .agenda-vista-tab--activa {
                background: var(--interactive-accent); color: var(--text-on-accent);
                border-color: transparent;
            }
            .agenda-barra-personas {
                display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
                margin-bottom: 8px;
            }
            .agenda-barra-personas input[type="search"] {
                flex: 1; min-width: 160px; height: 36px; padding: 0 12px;
                border-radius: 8px; border: 1px solid var(--background-modifier-border);
                background: var(--background-secondary);
            }
            .agenda-btn-filtros {
                height: 36px; padding: 0 12px; border-radius: 8px;
                border: 1px solid var(--background-modifier-border);
                background: var(--background-secondary); cursor: pointer;
                font-size: 0.86em; font-weight: 600;
            }
            .agenda-btn-filtros--activa {
                background: var(--interactive-accent); color: var(--text-on-accent);
                border-color: transparent;
            }
            .agenda-filtros-avanzados {
                display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
                padding: 10px 12px; margin-bottom: 8px;
                background: var(--background-secondary);
                border: 1px solid var(--background-modifier-border);
                border-radius: 10px;
            }
            .agenda-filtros-avanzados input,
            .agenda-filtros-avanzados select {
                height: 34px; padding: 0 10px; border-radius: 6px;
                border: 1px solid var(--background-modifier-border);
                background: var(--background-primary); font-size: 0.86em;
            }
            .agenda-contenido-dinamico { min-height: 120px; }
            .agenda-filtros { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
            .agenda-stats { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
            .agenda-stat-pill { padding: 6px 14px; border-radius: 20px; font-size: 0.88em; font-weight: 600;
                background: var(--background-modifier-border); color: var(--text-muted); }
            .agenda-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
            .agenda-card {
                background: var(--background-secondary);
                border: 1px solid var(--background-modifier-border);
                border-radius: 16px; overflow: hidden;
                transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
                display: flex; flex-direction: column;
            }
            .agenda-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 12px 28px rgba(0,0,0,.1);
                border-color: var(--interactive-accent);
            }
            .agenda-card-banner { height: 5px; width: 100%; flex-shrink: 0; }
            .agenda-card-click {
                flex: 1; cursor: pointer; display: flex; flex-direction: column; min-height: 0;
            }
            .agenda-card-header {
                display: flex; gap: 14px; padding: 18px 18px 12px; align-items: flex-start;
            }
            .agenda-card-header .agenda-avatar {
                width: 52px; height: 52px; font-size: 1em;
                box-shadow: 0 4px 12px rgba(0,0,0,.12);
            }
            .agenda-card-titulo { min-width: 0; flex: 1; }
            .agenda-card-nombre {
                margin: 0; font-size: 1.05em; font-weight: 800; line-height: 1.25;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .agenda-card-sub { font-size: 0.82em; color: var(--text-muted); margin-top: 4px; line-height: 1.35; }
            .agenda-card-badges {
                display: flex; flex-wrap: wrap; gap: 6px; padding: 0 18px 10px;
            }
            .agenda-card-badge {
                font-size: 0.72em; font-weight: 700; padding: 4px 10px; border-radius: 12px;
                background: var(--background-primary); border: 1px solid var(--background-modifier-border);
            }
            .agenda-card-preview {
                margin: 0 18px 14px; padding: 10px 12px; border-radius: 10px;
                background: var(--background-primary);
                border: 1px dashed var(--background-modifier-border);
                font-size: 0.82em; display: flex; gap: 10px; align-items: center;
            }
            .agenda-card-preview-icono { font-size: 1.3em; flex-shrink: 0; }
            .agenda-card-preview-texto { min-width: 0; }
            .agenda-card-preview-texto strong { display: block; font-size: 0.95em; margin-bottom: 2px; }
            .agenda-card-preview-texto small { color: var(--text-muted); }
            .agenda-card-rel-row {
                display: flex; flex-wrap: wrap; gap: 6px; padding: 0 18px 14px;
            }
            .agenda-card-body { padding: 0; }
            .agenda-card-body .agenda-chip,
            .agenda-card-body .agenda-chip-gusto,
            .agenda-card-body .agenda-chip-rel,
            .agenda-card-body .agenda-chip-actividad,
            .agenda-card-body .agenda-chip-perfil {
                display: inline-flex; align-items: center; gap: 5px;
                padding: 5px 10px; border-radius: 14px;
                font-size: 0.78em; margin: 0;
            }
            .agenda-card-body .agenda-chip-gusto { background: rgba(99,102,241,.15); color: var(--text-accent); border: 1px solid rgba(99,102,241,.25); }
            .agenda-card-body .agenda-chip-rel { background: rgba(16,185,129,.12); color: #059669; border: 1px solid rgba(16,185,129,.25); }
            .agenda-card-body .agenda-chip-actividad { background: rgba(245,158,11,.14); color: #b45309; border: 1px solid rgba(245,158,11,.3); }
            .agenda-card-body .agenda-chip-perfil { background: rgba(139,92,246,.14); color: #7c3aed; border: 1px solid rgba(139,92,246,.28); }
            .agenda-card-body .agenda-chip-grupo { background: rgba(14,165,233,.14); color: #0369a1; border: 1px solid rgba(14,165,233,.28); }
            .agenda-avatar { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center;
                justify-content: center; font-weight: 800; font-size: 1.1em; color: #fff; flex-shrink: 0; }
            .agenda-avatar--foto { padding: 0; overflow: hidden; background: transparent !important; color: inherit; }
            .agenda-avatar--foto img { width: 100%; height: 100%; object-fit: cover; display: block; }
            .agenda-avatar--grande { width: 88px; height: 88px; font-size: 1.4em; }
            .agenda-card-acciones {
                display: flex; justify-content: flex-end; gap: 6px; padding: 10px 14px 14px;
                border-top: 1px solid var(--background-modifier-border);
                background: var(--background-primary);
            }
            .agenda-btn-icon {
                background: var(--background-secondary); border: 1px solid var(--background-modifier-border);
                border-radius: 8px; cursor: pointer; font-size: 1em;
                width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
                opacity: .85; transition: opacity .15s, transform .15s;
            }
            .agenda-btn-icon:hover { opacity: 1; transform: scale(1.06); }
            .agenda-seccion-mapa {
                background: var(--background-secondary);
                border: 1px solid var(--background-modifier-border);
                border-radius: 10px; padding: 16px; margin-bottom: 14px;
            }
            .agenda-seccion-mapa h3 { margin: 0 0 8px; color: var(--text-accent); }
            .agenda-mermaid-hint { margin: 0 0 16px; font-size: 0.9em; color: var(--text-muted); }
            .agenda-mermaid-contenedor {
                overflow: visible;
                min-height: 120px;
                padding: 8px 4px 16px;
            }
            .agenda-mermaid-svg { overflow: visible; }
            .agenda-mermaid-svg svg { max-width: 100%; height: auto; display: block; overflow: visible; }
            .agenda-mermaid-svg g.cluster rect {
                rx: 14px; ry: 14px;
            }
            .agenda-agrupacion-panel {
                margin-bottom: 16px; padding: 14px 16px;
                background: var(--background-primary);
                border: 1px solid var(--background-modifier-border);
                border-radius: 10px;
            }
            .agenda-agrupacion-panel strong {
                display: block; margin-bottom: 10px; color: var(--text-accent); font-size: 0.92em;
            }
            .agenda-agrupacion-grupos {
                display: flex; flex-wrap: wrap; gap: 10px;
            }
            .agenda-agrupacion-grupo {
                flex: 1 1 200px; min-width: 160px; max-width: 100%;
                padding: 10px 12px; border-radius: 10px;
                border: 1px solid var(--background-modifier-border);
                border-left-width: 3px;
                background: var(--background-secondary);
            }
            .agenda-agrupacion-titulo {
                display: block; font-weight: 700; font-size: 0.9em; margin-bottom: 4px;
            }
            .agenda-agrupacion-miembros {
                font-size: 0.82em; color: var(--text-muted); line-height: 1.45;
            }
            .agenda-mermaid-svg [data-persona-id] { cursor: pointer; transition: opacity .25s ease; }
            .agenda-mermaid-svg g.node.agenda-mermaid-foco rect,
            .agenda-mermaid-svg g.node.agenda-mermaid-foco polygon,
            .agenda-mermaid-svg g.node.agenda-mermaid-foco path { stroke-width: 3px; }
            .agenda-mermaid-svg g.node.agenda-mermaid-dim { opacity: 0.2 !important; }
            .agenda-mermaid-svg g.edgePath { transition: opacity .25s ease; }
            .agenda-mermaid-svg g.edgePath.agenda-mermaid-dim { opacity: 0.1 !important; }
            .agenda-mermaid-svg g.edgePath.agenda-mermaid-foco-edge { opacity: 1 !important; }
            .agenda-mermaid-svg [data-persona-id]:hover rect, .agenda-mermaid-svg [data-persona-id]:hover path { opacity: .92; }
            .agenda-mermaid-svg .edgePath path { stroke-width: 2.5px; }
            .agenda-mermaid-svg .edgePath marker path { fill: inherit; }
            .agenda-mermaid-svg .edgeLabel, .agenda-mermaid-svg .edgeLabel rect { display: none !important; }
            .agenda-leyenda-rel { display: flex; flex-wrap: wrap; gap: 16px 20px; margin-bottom: 14px; font-size: 0.85em; color: var(--text-muted); }
            .agenda-leyenda-item { display: inline-flex; align-items: center; gap: 8px; }
            .agenda-leyenda-linea { display: inline-block; width: 32px; height: 0; border-top: 3px solid transparent; flex-shrink: 0; }
            .agenda-leyenda-pareja { border-top-color: #f472b6; border-top-width: 4px; }
            .agenda-leyenda-amigos { border-top-color: #60a5fa; }
            .agenda-leyenda-familia { border-top-style: dashed; border-top-color: #34d399; }
            .agenda-leyenda-conocidos { border-top-color: #a78bfa; border-top-style: dotted; }
            .agenda-leyenda-mejores { border-top-color: #fbbf24; border-top-width: 4px; }
            .agenda-leyenda-trabajo { border-top-color: #ea580c; }
            .agenda-leyenda-escuela { border-top-color: #0891b2; border-top-style: dashed; }
            .agenda-filtros-diagrama {
                display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center;
                margin-bottom: 16px; padding: 14px 16px;
                background: var(--background-primary); border-radius: 8px;
                border: 1px solid var(--background-modifier-border);
            }
            .agenda-filtros-diagrama label { font-size: 0.82em; font-weight: 600; color: var(--text-muted); }
            .agenda-filtros-diagrama select {
                padding: 7px 10px; border-radius: 6px; min-width: 130px;
                border: 1px solid var(--background-modifier-border);
                background: var(--background-secondary); font-size: 0.88em;
            }
            .agenda-filtros-diagrama .agenda-filtro-grupo {
                display: flex; flex-direction: column; gap: 4px;
            }
        `;
    },

    _sanitizarMermaid: (texto) =>
        String(texto).replace(/["\[\]{}|#;]/g, " ").replace(/\n/g, " ").trim(),

    _colorAvatar: (persona) => window.AgendaPerfil.resolverColorPersona(
        typeof persona === "string" ? { nombre: persona } : persona
    ),

    _gradienteAvatar: (persona) => {
        const base = window.AgendaPerfil.resolverColorPersona(persona);
        const tono = window.AgendaPerfil.ajustarColor(base, 0.72);
        return `linear-gradient(135deg, ${base}, ${tono})`;
    },

    _estanRelacionados: (a, b, tipoRel = "") => {
        const tipos = tipoRel ? [tipoRel] : window.AgendaDB.TIPOS_RELACION;
        return tipos.some(t =>
            (a.relaciones?.[t] || []).includes(b.id) || (b.relaciones?.[t] || []).includes(a.id)
        );
    },

    _opcionesFiltroDiagrama: (personas) => {
        const mbti = new Set(), enea = new Set(), signos = new Set(), tarots = new Set(), grupos = new Set();
        personas.forEach(p => {
            if (p.mbti) mbti.add(p.mbti);
            if (p.eneagrama) enea.add(p.eneagrama);
            if (p.signo_zodiacal) signos.add(p.signo_zodiacal);
            if (p.carta_tarot) tarots.add(p.carta_tarot);
            (p.grupos || []).forEach(g => { if (g) grupos.add(g); });
        });
        return {
            mbti: [...mbti].sort(),
            eneagrama: [...enea].sort((a, b) => a.localeCompare(b, "es", { numeric: true })),
            signos: [...signos].sort((a, b) => a.localeCompare(b, "es")),
            tarots: [...tarots].sort((a, b) =>
                window.AgendaPerfil.ordenTarot(a) - window.AgendaPerfil.ordenTarot(b)
            ),
            grupos: [...grupos].sort((a, b) => a.localeCompare(b, "es"))
        };
    },

    _filtrarPersonasDiagrama: (todas, filtros) =>
        todas.filter(p => {
            if (filtros.mbti && p.mbti !== filtros.mbti) return false;
            if (filtros.eneagrama && p.eneagrama !== filtros.eneagrama) return false;
            if (filtros.signo && p.signo_zodiacal !== filtros.signo) return false;
            if (filtros.tarot && p.carta_tarot !== filtros.tarot) return false;
            if (filtros.grupo && !(p.grupos || []).includes(filtros.grupo)) return false;
            return true;
        }),

    _resolverUrlFoto: (rutaFoto) => {
        if (!rutaFoto?.trim()) return "";
        const limpia = rutaFoto.trim().replace(/^\[\[|\]\]$/g, "").split("|")[0].trim();
        const dest = app.metadataCache.getFirstLinkpathDest(limpia, "");
        if (dest) return app.vault.adapter.getResourcePath(dest.path);
        if (app.vault.getAbstractFileByPath(limpia)) {
            return app.vault.adapter.getResourcePath(limpia);
        }
        return "";
    },

    _pintarAvatar: (el, persona) => {
        const url = window.AgendaUI._resolverUrlFoto(persona.foto);
        el.empty();
        el.classList.remove("agenda-avatar--foto");
        if (url) {
            el.classList.add("agenda-avatar--foto");
            el.createEl("img", { attr: { src: url, alt: persona.nombre || "" } });
            return;
        }
        el.textContent = window.AgendaUI._iniciales(persona.nombre);
        el.style.background = window.AgendaUI._gradienteAvatar(persona);
        el.style.color = window.AgendaPerfil.colorTextoContraste(
            window.AgendaPerfil.resolverColorPersona(persona)
        );
    },

    _proximoEventoPersona: (persona, actividades, personas) => {
        const items = window.AgendaCalendario.proximos(actividades, personas, 45)
            .filter(it => (it.persona_ids || []).includes(persona.id));
        return items[0] || null;
    },

    _crearTarjetaPersona: (grid, p, estado, ctx) => {
        const { db, dbPath, onRefresh, syncOpts, abrirActividad } = ctx;
        const color = window.AgendaPerfil.resolverColorPersona(p);

        const card = grid.createEl("div", { cls: "agenda-card" });
        card.createEl("div", { cls: "agenda-card-banner", style: `background: ${color};` });

        const clickZone = card.createEl("div", { cls: "agenda-card-click" });
        clickZone.onclick = () => window.AgendaUI._abrirPerfil(
            app, p, estado, db, dbPath, onRefresh, { syncOpts, abrirActividad }
        );

        const header = clickZone.createEl("div", { cls: "agenda-card-header" });
        const avatar = header.createEl("div", { cls: "agenda-avatar" });
        window.AgendaUI._pintarAvatar(avatar, p);

        const titulo = header.createEl("div", { cls: "agenda-card-titulo" });
        titulo.createEl("h4", { text: p.nombre, cls: "agenda-card-nombre" });
        const edad = window.AgendaDB.calcularEdad(p.fecha_nacimiento);
        const subPartes = [
            ...(p.alias || []).length ? [(p.alias || []).join(" · ")] : [],
            p.ciudad,
            edad !== null ? `${edad} años` : null
        ].filter(Boolean);
        if (subPartes.length) titulo.createEl("div", { text: subPartes.join(" · "), cls: "agenda-card-sub" });

        const badges = clickZone.createEl("div", { cls: "agenda-card-badges" });
        if (p.mbti) badges.createEl("span", { text: p.mbti, cls: "agenda-card-badge" });
        if (p.eneagrama) badges.createEl("span", { text: `E-${p.eneagrama}`, cls: "agenda-card-badge" });
        if (p.signo_zodiacal) badges.createEl("span", { text: `♈ ${p.signo_zodiacal}`, cls: "agenda-card-badge" });
        if (p.grupos?.length) badges.createEl("span", { text: `📂 ${p.grupos[0]}`, cls: "agenda-card-badge" });

        const proximo = window.AgendaUI._proximoEventoPersona(p, estado.actividades || [], estado.personas);
        if (proximo) {
            const prev = clickZone.createEl("div", { cls: "agenda-card-preview" });
            prev.createEl("span", { text: proximo.icono || "📅", cls: "agenda-card-preview-icono" });
            const txt = prev.createEl("div", { cls: "agenda-card-preview-texto" });
            txt.createEl("strong", { text: proximo.titulo });
            const meta = [window.AgendaCalendario.formatearFecha(proximo.fecha)];
            if (proximo.diasRestantes !== undefined) {
                meta.push(proximo.esHoy ? "¡Hoy!" : `En ${proximo.diasRestantes}d`);
            }
            txt.createEl("small", { text: meta.join(" · ") });
        } else if (p.dias_para_cumple) {
            const prev = clickZone.createEl("div", { cls: "agenda-card-preview" });
            prev.createEl("span", { text: "🎂", cls: "agenda-card-preview-icono" });
            const txt = prev.createEl("div", { cls: "agenda-card-preview-texto" });
            txt.createEl("strong", { text: "Próximo cumpleaños" });
            txt.createEl("small", { text: p.dias_para_cumple });
        }

        const relRow = clickZone.createEl("div", { cls: "agenda-card-rel-row" });
        const iconoRel = { pareja: "💕", mejores_amigos: "⭐", amigos: "🤝", familia: "👪" };
        let relCount = 0;
        ["pareja", "mejores_amigos", "amigos", "familia"].forEach(tipo => {
            (p.relaciones?.[tipo] || []).forEach(rid => {
                if (relCount >= 3) return;
                relRow.createEl("span", {
                    text: `${iconoRel[tipo] || "🔗"} ${window.AgendaDB.nombreDe(estado.personas, rid)}`,
                    cls: "agenda-chip-rel"
                });
                relCount++;
            });
        });

        clickZone.createEl("div", { cls: "agenda-card-body" });

        const acciones = card.createEl("div", { cls: "agenda-card-acciones" });
        acciones.onclick = (e) => e.stopPropagation();
        acciones.createEl("button", { text: "✏️", cls: "agenda-btn-icon", attr: { title: "Editar" } }).onclick = () =>
            new window.AgendaModals.PersonaFormModal(app, db, dbPath, p, onRefresh).open();
        acciones.createEl("button", { text: "📅", cls: "agenda-btn-icon", attr: { title: "Nuevo evento" } }).onclick = () =>
            abrirActividad(null, { personaIds: [p.id], tipoInicial: "evento" });
        acciones.createEl("button", { text: "🗑️", cls: "agenda-btn-icon", attr: { title: "Eliminar" } }).onclick = () => {
            new window.AgendaModals.AgendaConfirmModal(app, `¿Eliminar a "${p.nombre}"?`, () => {
                window.AgendaDB.eliminarPersona(db, dbPath, p.id);
                new (require("obsidian").Notice)("🗑️ Persona eliminada");
                onRefresh();
            }).open();
        };
    },

    _esTemaOscuroAgenda: () =>
        document.body.classList.contains("theme-dark")
        || document.documentElement.classList.contains("theme-dark"),

    // Paleta suave según tema (fondos poco saturados, bordes discretos)
    _paletaGrupos: () => {
        const oscuro = window.AgendaUI._esTemaOscuroAgenda();
        if (oscuro) {
            return [
                { fill: "#252838", stroke: "#6366f166", texto: "#a5b4fc" },
                { fill: "#1f2d2a", stroke: "#10b98166", texto: "#6ee7b7" },
                { fill: "#2d2820", stroke: "#f59e0b66", texto: "#fcd34d" },
                { fill: "#2d2230", stroke: "#ec489966", texto: "#f9a8d4" },
                { fill: "#1f2838", stroke: "#3b82f666", texto: "#93c5fd" },
                { fill: "#282538", stroke: "#8b5cf666", texto: "#c4b5fd" },
                { fill: "#1f2e2e", stroke: "#14b8a666", texto: "#5eead4" },
                { fill: "#2d2222", stroke: "#ef444466", texto: "#fca5a5" }
            ];
        }
        return [
            { fill: "#f4f3ff", stroke: "#c7d2fe", texto: "#4338ca" },
            { fill: "#f0fdf8", stroke: "#a7f3d0", texto: "#047857" },
            { fill: "#fffbeb", stroke: "#fde68a", texto: "#b45309" },
            { fill: "#fdf2f8", stroke: "#fbcfe8", texto: "#be185d" },
            { fill: "#eff6ff", stroke: "#bfdbfe", texto: "#1d4ed8" },
            { fill: "#f5f3ff", stroke: "#ddd6fe", texto: "#6d28d9" },
            { fill: "#f0fdfa", stroke: "#99f6e4", texto: "#0f766e" },
            { fill: "#fef2f2", stroke: "#fecaca", texto: "#b91c1c" }
        ];
    },

    _etiquetaAgruparPor: (clave) => ({
        mbti: "MBTI", eneagrama: "Eneagrama", signo: "Signo zodiacal",
        tarot: "Carta de tarot", grupos: "Grupo"
    }[clave] || clave),

    _clavesAgrupacion: (p, agruparPor) => {
        if (agruparPor === "grupos") {
            const g = (p.grupos || []).filter(Boolean);
            return g.length ? g : ["Sin grupo"];
        }
        const k = window.AgendaUI._claveAgrupacion(p, agruparPor);
        return [k || "Sin categoría"];
    },

    _claveAgrupacion: (p, agruparPor) => {
        if (agruparPor === "mbti") return p.mbti || "Sin MBTI";
        if (agruparPor === "eneagrama") {
            return window.AgendaPerfil.etiquetaEneagrama(p.eneagrama) || "Sin eneagrama";
        }
        if (agruparPor === "signo") return p.signo_zodiacal || "Sin signo";
        if (agruparPor === "tarot") {
            return window.AgendaPerfil.etiquetaTarotFiltro(p.carta_tarot) || "Sin carta";
        }
        return "";
    },

    _sanitizarIdMermaid: (texto) =>
        String(texto).replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40) || "grupo",

    _iniciales: (nombre) => {
        const partes = (nombre || "?").trim().split(/\s+/).filter(Boolean);
        if (!partes.length) return "?";
        if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
        return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    },

    _nodoMermaidId: (id, sufijo = "") => {
        const slug = String(id || "").replace(/[^a-zA-Z0-9]/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
        const base = "P" + (slug || "x");
        if (!sufijo) return base;
        const suf = window.AgendaUI._sanitizarIdMermaid(sufijo);
        return `${base}__${suf}`;
    },

    _normalizarBusqueda: (texto) => String(texto || "")
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(),

    _coincideNombreApodo: (persona, consulta) => {
        const q = window.AgendaUI._normalizarBusqueda(consulta);
        if (!q) return true;
        const nombre = window.AgendaUI._normalizarBusqueda(persona.nombre);
        if (nombre.includes(q)) return true;
        return (persona.alias || []).some(a => window.AgendaUI._normalizarBusqueda(a).includes(q));
    },

    _filtrarPersonas: (personas, filtros) => {
        const q = (filtros.busqueda || "").toLowerCase().trim();
        return personas.filter(p => {
            if (!window.AgendaUI._coincideNombreApodo(p, filtros.busquedaNombre)) return false;
            if (filtros.tipoGusto && !window.AgendaPreferencias.coincideFiltro(
                p.gustos, filtros.tipoGusto, filtros.elementoGusto
            )) return false;
            if (filtros.tipoDisgusto && !window.AgendaPreferencias.coincideFiltro(
                p.disgustos, filtros.tipoDisgusto, filtros.elementoDisgusto
            )) return false;
            if (filtros.grupo && !(p.grupos || []).includes(filtros.grupo)) return false;
            if (filtros.ciudad && p.ciudad !== filtros.ciudad) return false;
            if (!q) return true;
            const texto = [
                p.nombre, p.ciudad, p.notas, ...(p.alias || []), ...(p.grupos || []),
                ...window.AgendaPreferencias.aplanarTexto(p.gustos),
                ...window.AgendaPreferencias.aplanarTexto(p.disgustos)
            ].join(" ").toLowerCase();
            return texto.includes(q);
        });
    },

    _llenarElementosPref: (sel, tipo, mapa, todos) => {
        sel.empty();
        sel.createEl("option", { text: "Todos los elementos", value: "" });
        const lista = tipo ? (mapa[tipo] || []) : todos;
        lista.forEach(v => sel.createEl("option", { text: v, value: v }));
    },

    _obtenerApiMermaid: async () => {
        if (!window._agendaMermaidCDN) {
            const mod = await import("https://cdn.jsdelivr.net/npm/mermaid@10.9.3/dist/mermaid.esm.min.mjs");
            window._agendaMermaidCDN = mod.default?.mermaidAPI ?? mod.default;
            window._agendaMermaidCDN.initialize({
                startOnLoad: false,
                securityLevel: "loose",
                theme: "base",
                themeVariables: {
                    fontFamily: "var(--font-text, system-ui, sans-serif)",
                    fontSize: "14px",
                    lineColor: "#718096",
                    primaryTextColor: "#f8fafc",
                    clusterBkg: "transparent",
                    clusterBorder: "#64748b55",
                    titleColor: "var(--text-muted, #94a3b8)"
                },
                flowchart: { curve: "basis", padding: 20, nodeSpacing: 50, rankSpacing: 60, htmlLabels: false }
            });
            window._agendaMermaidInit = true;
        }
        return window._agendaMermaidCDN;
    },

    _renderMermaidSvg: async (hostEl, codigo) => {
        hostEl.innerHTML = "";
        const renderId = `agenda-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
        try {
            const api = await window.AgendaUI._obtenerApiMermaid();
            const { svg, bindFunctions } = await api.render(renderId, codigo);
            hostEl.innerHTML = svg;
            if (bindFunctions) bindFunctions(hostEl);
        } catch (err) {
            console.error("Mermaid agenda:", err);
            hostEl.innerHTML = `<pre style="font-size:0.85em;color:var(--text-error);">${codigo}</pre>`;
        }
    },

    _pulirEstiloNodosMermaid: (hostEl) => {
        const svg = hostEl.querySelector("svg");
        if (!svg) return;
        const uid = `agenda-fx-${Date.now()}`;
        let defs = svg.querySelector("defs") || svg.insertBefore(
            document.createElementNS("http://www.w3.org/2000/svg", "defs"), svg.firstChild
        );
        const filtro = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        filtro.setAttribute("id", `${uid}-sombra`);
        filtro.innerHTML = '<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.28"/>';
        defs.appendChild(filtro);
        svg.querySelectorAll("g.node").forEach(g => {
            if (g.closest("g.cluster-label")) return;
            const forma = g.querySelector("rect, polygon, path");
            if (forma) {
                forma.setAttribute("filter", `url(#${uid}-sombra)`);
                if (forma.tagName === "rect") { forma.setAttribute("rx", "16"); forma.setAttribute("ry", "16"); }
            }
            g.querySelectorAll("text").forEach(t => { t.setAttribute("font-weight", "600"); t.setAttribute("font-size", "13px"); });
        });
    },

    _resolverClaveNodoMermaid: (elementId, clavesOrdenadas) => {
        if (!elementId || !clavesOrdenadas?.length) return null;
        for (const nodoId of clavesOrdenadas) {
            if (elementId === nodoId) return nodoId;
            // El id SVG de Mermaid suele ser flowchart-P_slug-0; evitar que P_ana coincida con P_anabel
            const esc = nodoId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const patron = new RegExp(`(^|[^A-Za-z0-9_])${esc}([^A-Za-z0-9_]|$)`);
            if (patron.test(elementId)) return nodoId;
        }
        return null;
    },

    _etiquetarNodosMermaid: (hostEl, personas) => {
        const svg = hostEl.querySelector("svg");
        if (!svg) return;

        const mapaCustom = hostEl._agendaNodoPersonaMap;
        const mapa = mapaCustom || Object.fromEntries(
            personas.map(p => [window.AgendaUI._nodoMermaidId(p.id), p.id])
        );
        const clavesOrd = Object.keys(mapa).sort((a, b) => b.length - a.length);

        svg.querySelectorAll("g.node").forEach(g => {
            delete g.dataset.personaId;
            if (g.closest("g.cluster-label")) return;
            const nodoId = window.AgendaUI._resolverClaveNodoMermaid(g.id, clavesOrd);
            if (nodoId) g.dataset.personaId = mapa[nodoId];
        });
    },

    _obtenerEdgePathsVisibles: (svg) =>
        [...svg.querySelectorAll("g.edgePath")].filter(g => g.querySelector("path.path")),

    _etiquetarAristasMermaid: (hostEl, aristasMeta) => {
        const svg = hostEl.querySelector("svg");
        if (!svg || !aristasMeta?.length) return;
        const paths = window.AgendaUI._obtenerEdgePathsVisibles(svg);
        paths.forEach(g => {
            delete g.dataset.origenId;
            delete g.dataset.destinoId;
            delete g.dataset.agendaEdge;
        });
        aristasMeta.forEach((meta, i) => {
            const g = paths[i];
            if (!g || !meta.origenId || !meta.destinoId) return;
            g.dataset.origenId = meta.origenId;
            g.dataset.destinoId = meta.destinoId;
            g.dataset.agendaEdge = "1";
        });
    },

    _obtenerRelacionadosMermaid: (personaId, personas) => {
        const rel = new Set([personaId]);
        const yo = personas.find(p => p.id === personaId);
        if (!yo) return rel;
        window.AgendaDB.TIPOS_RELACION.forEach(t => {
            (yo.relaciones?.[t] || []).forEach(id => rel.add(id));
        });
        personas.forEach(p => {
            if (p.id === personaId) return;
            window.AgendaDB.TIPOS_RELACION.forEach(t => {
                if ((p.relaciones?.[t] || []).includes(personaId)) rel.add(p.id);
            });
        });
        return rel;
    },

    _aplicarFocoMermaid: (hostEl, focoId) => {
        const svg = hostEl.querySelector("svg");
        if (!svg) return;
        const personas = hostEl._agendaPersonas || [];

        svg.querySelectorAll("g.node").forEach(n => {
            n.classList.remove("agenda-mermaid-dim", "agenda-mermaid-foco");
            n.style.opacity = "";
        });
        svg.querySelectorAll("g.edgePath").forEach(g => {
            g.classList.remove("agenda-mermaid-dim", "agenda-mermaid-foco-edge");
            g.style.opacity = "";
        });

        if (!focoId) {
            hostEl._focoPersonaId = null;
            return;
        }

        const relacionados = window.AgendaUI._obtenerRelacionadosMermaid(focoId, personas);
        hostEl._focoPersonaId = focoId;

        svg.querySelectorAll("g.node[data-persona-id]").forEach(n => {
            const id = n.dataset.personaId;
            if (!relacionados.has(id)) n.classList.add("agenda-mermaid-dim");
            else if (id === focoId) n.classList.add("agenda-mermaid-foco");
        });

        svg.querySelectorAll("g.edgePath[data-agenda-edge]").forEach(g => {
            const o = g.dataset.origenId;
            const d = g.dataset.destinoId;
            if (o === focoId || d === focoId) g.classList.add("agenda-mermaid-foco-edge");
            else g.classList.add("agenda-mermaid-dim");
        });
        svg.querySelectorAll("g.edgePath:not([data-agenda-edge])").forEach(g => {
            g.classList.add("agenda-mermaid-dim");
        });
    },

    _toggleFocoMermaid: (hostEl, personaId) => {
        if (hostEl._focoPersonaId === personaId) {
            window.AgendaUI._aplicarFocoMermaid(hostEl, null);
        } else {
            window.AgendaUI._aplicarFocoMermaid(hostEl, personaId);
        }
    },

    _enlazarClicksMermaid: (hostEl, db, dbPath, onRefresh) => {
        const personas = hostEl._agendaPersonas || window.AgendaDB.obtenerTodas(db);
        window.AgendaUI._etiquetarNodosMermaid(hostEl, personas);
        const svg = hostEl.querySelector("svg");
        if (!svg) return;

        const abrir = (personaId) => {
            const p = (hostEl._agendaPersonas || personas).find(x => x.id === personaId);
            if (p) {
                const estado = window.AgendaDB.cargarEstado(db);
                window.AgendaUI._abrirPerfil(app, p, estado, db, dbPath, onRefresh);
            }
        };

        if (hostEl._agendaClickMermaid) {
            svg.removeEventListener("click", hostEl._agendaClickMermaid);
            svg.removeEventListener("contextmenu", hostEl._agendaCtxMermaid);
        }

        hostEl._agendaClickMermaid = (e) => {
            const nodo = e.target.closest("g.node[data-persona-id]");
            if (!nodo) return;
            e.preventDefault();
            e.stopPropagation();
            window.AgendaUI._toggleFocoMermaid(hostEl, nodo.dataset.personaId);
        };
        hostEl._agendaCtxMermaid = (e) => {
            const nodo = e.target.closest("g.node[data-persona-id]");
            if (!nodo) return;
            e.preventDefault();
            e.stopPropagation();
            abrir(nodo.dataset.personaId);
        };

        svg.addEventListener("click", hostEl._agendaClickMermaid);
        svg.addEventListener("contextmenu", hostEl._agendaCtxMermaid);
        svg.querySelectorAll("g.node[data-persona-id]").forEach(n => { n.style.cursor = "pointer"; });
    },

    _pulirEstiloAristasMermaid: (hostEl, estilosArista) => {
        const svg = hostEl.querySelector("svg");
        if (!svg) return;
        const paths = window.AgendaUI._obtenerEdgePathsVisibles(svg);
        paths.forEach((g, i) => {
            const path = g.querySelector("path.path");
            if (!path || !estilosArista[i]) return;
            const { color, grosor, punteado } = estilosArista[i];
            path.setAttribute("stroke", color);
            path.setAttribute("stroke-width", String(grosor));
            if (punteado) path.setAttribute("stroke-dasharray", "7 5");
            else path.removeAttribute("stroke-dasharray");

            const markerRef = path.getAttribute("marker-end");
            const markerId = markerRef?.match(/url\(#([^)]+)\)/)?.[1];
            if (markerId) {
                svg.querySelectorAll(`#${CSS.escape(markerId)} path`).forEach(m => {
                    m.setAttribute("fill", color);
                    m.setAttribute("stroke", color);
                });
            }
        });
        window.AgendaUI._etiquetarAristasMermaid(hostEl, estilosArista);
        svg.querySelectorAll(".edgeLabel").forEach(el => { el.remove(); });
    },

    _pulirEstiloSubgrafosMermaid: (hostEl, gruposMeta = []) => {
        const svg = hostEl.querySelector("svg");
        if (!svg || !gruposMeta.length) return;

        const paleta = window.AgendaUI._paletaGrupos();
        svg.style.overflow = "visible";
        const clusters = [...svg.querySelectorAll("g.cluster")];
        clusters.forEach((cluster, i) => {
            const meta = gruposMeta[i] || paleta[i % paleta.length];

            // Fondo del subgrafo (Mermaid suele usar el primer rect del cluster)
            const fondos = cluster.querySelectorAll(":scope > rect, :scope > polygon");
            fondos.forEach(forma => {
                forma.setAttribute("fill", meta.fill);
                forma.style.fill = meta.fill;
                forma.setAttribute("stroke", meta.stroke);
                forma.style.stroke = meta.stroke;
                forma.setAttribute("stroke-width", "1.5");
                forma.setAttribute("rx", "14");
                forma.setAttribute("ry", "14");
                forma.removeAttribute("clip-path");
            });

            cluster.querySelectorAll(".cluster-label text, .cluster-label span").forEach(t => {
                t.setAttribute("font-weight", "600");
                t.setAttribute("font-size", "13px");
                t.setAttribute("fill", meta.texto);
                t.style.fill = meta.texto;
            });
        });
    },

    _renderLeyendaAgrupacion: (host, agruparPor, personas) => {
        host.empty();
        if (!agruparPor || !personas.length) {
            host.style.display = "none";
            return;
        }

        const mapa = new Map();
        personas.forEach(p => {
            window.AgendaUI._clavesAgrupacion(p, agruparPor).forEach(k => {
                if (!mapa.has(k)) mapa.set(k, []);
                if (!mapa.get(k).includes(p.nombre)) mapa.get(k).push(p.nombre);
            });
        });

        const paleta = window.AgendaUI._paletaGrupos();
        host.style.display = "";
        host.createEl("strong", {
            text: `📂 Agrupado por ${window.AgendaUI._etiquetaAgruparPor(agruparPor)} · ${mapa.size} grupo${mapa.size !== 1 ? "s" : ""}`
        });
        const grupos = host.createEl("div", { cls: "agenda-agrupacion-grupos" });
        [...mapa.entries()]
            .sort((a, b) => a[0].localeCompare(b[0], "es"))
            .forEach(([titulo, nombres], i) => {
                const col = paleta[i % paleta.length];
                const card = grupos.createEl("div", {
                    cls: "agenda-agrupacion-grupo",
                    style: `border-left-color: ${col.stroke};`
                });
                const tit = card.createEl("span", { cls: "agenda-agrupacion-titulo" });
                tit.setText(`${titulo} (${nombres.length})`);
                tit.style.color = col.texto;
                card.createEl("span", { cls: "agenda-agrupacion-miembros", text: nombres.join(", ") });
            });
    },

    _construirMermaidRelaciones: (personas, opts = {}) => {
        const ids = new Set(personas.map(p => p.id));
        const agruparPor = opts.agruparPor || "";
        const tipoRel = opts.tipoRel || "";
        const paleta = window.AgendaUI._paletaGrupos();
        const multiGrupo = agruparPor === "grupos";
        let codigo = agruparPor ? "graph TB\n" : "graph LR\n";
        const gruposMeta = [];
        const nodoPersonaMap = {};
        const nodoPorPersonaGrupo = new Map();

        const registrarNodo = (p, grupoTitulo, indent) => {
            const nid = multiGrupo
                ? window.AgendaUI._nodoMermaidId(p.id, grupoTitulo)
                : window.AgendaUI._nodoMermaidId(p.id);
            nodoPersonaMap[nid] = p.id;
            if (multiGrupo) {
                if (!nodoPorPersonaGrupo.has(p.id)) nodoPorPersonaGrupo.set(p.id, new Map());
                nodoPorPersonaGrupo.get(p.id).set(grupoTitulo, nid);
            }
            const label = window.AgendaUI._sanitizarMermaid(p.nombre);
            const base = window.AgendaPerfil.resolverColorPersona(p);
            const stroke = window.AgendaPerfil.ajustarColor(base, 0.72);
            const texto = window.AgendaPerfil.colorTextoContraste(base);
            codigo += `${indent}${nid}(["${label}"])\n`;
            codigo += `${indent}style ${nid} fill:${base},stroke:${stroke},color:${texto},stroke-width:2px\n`;
            return nid;
        };

        if (agruparPor) {
            const mapa = new Map();
            personas.forEach(p => {
                window.AgendaUI._clavesAgrupacion(p, agruparPor).forEach(k => {
                    if (!mapa.has(k)) mapa.set(k, []);
                    mapa.get(k).push(p);
                });
            });
            let gi = 0;
            [...mapa.entries()].sort((a, b) => a[0].localeCompare(b[0], "es")).forEach(([titulo, lista]) => {
                const col = paleta[gi % paleta.length];
                const sg = `SG${gi}`;
                const tit = window.AgendaUI._sanitizarMermaid(titulo);
                codigo += `  subgraph ${sg}["${tit}"]\n    direction LR\n`;
                lista.forEach(p => registrarNodo(p, titulo, "    "));
                codigo += "  end\n";
                gruposMeta.push({
                    id: sg, titulo, fill: col.fill, stroke: col.stroke, texto: col.texto,
                    miembros: lista.map(p => p.nombre)
                });
                gi++;
            });
        } else {
            personas.forEach(p => registrarNodo(p, "", "  "));
        }

        const resolverOrigen = (p) => {
            if (multiGrupo) return nodoPorPersonaGrupo.get(p.id);
            return new Map([["", window.AgendaUI._nodoMermaidId(p.id)]]);
        };

        const vistos = new Set();
        const estilosArista = [];
        const tiposArista = {
            pareja: { flecha: "==>", color: "#f472b6", grosor: 3.5, punteado: false },
            mejores_amigos: { flecha: "==>", color: "#fbbf24", grosor: 3, punteado: false },
            amigos: { flecha: "-->", color: "#60a5fa", grosor: 2.5, punteado: false },
            familia: { flecha: "-.->", color: "#34d399", grosor: 2.5, punteado: true },
            conocidos: { flecha: "-.->", color: "#a78bfa", grosor: 2, punteado: true },
            trabajo: { flecha: "-->", color: "#ea580c", grosor: 2.5, punteado: false },
            escuela: { flecha: "-.->", color: "#0891b2", grosor: 2.5, punteado: true }
        };
        const tiposActivos = tipoRel ? [tipoRel] : Object.keys(tiposArista);

        const agregarArista = (origen, dest, p, rid, tipo, cfg) => {
            const par = [origen, dest].sort().join("|") + "|" + tipo;
            if (vistos.has(par)) return;
            vistos.add(par);
            codigo += `  ${origen} ${cfg.flecha} ${dest}\n`;
            estilosArista.push({
                color: cfg.color, grosor: cfg.grosor, punteado: cfg.punteado,
                origenId: p.id, destinoId: rid
            });
        };

        personas.forEach(p => {
            const mapaOrigen = resolverOrigen(p);
            tiposActivos.forEach(tipo => {
                const cfg = tiposArista[tipo];
                if (!cfg) return;
                (p.relaciones?.[tipo] || []).forEach(rid => {
                    if (!ids.has(rid)) return;
                    const mapaDest = resolverOrigen({ id: rid });
                    if (multiGrupo) {
                        mapaOrigen.forEach((nidO, gO) => {
                            const nidD = mapaDest?.get(gO);
                            if (nidD) agregarArista(nidO, nidD, p, rid, tipo, cfg);
                        });
                    } else {
                        const origen = mapaOrigen.get("");
                        const dest = mapaDest?.get("");
                        if (origen && dest) agregarArista(origen, dest, p, rid, tipo, cfg);
                    }
                });
            });
        });

        estilosArista.forEach((s, i) => {
            const dash = s.punteado ? ",stroke-dasharray:7 5" : "";
            codigo += `  linkStyle ${i} stroke:${s.color},stroke-width:${s.grosor}px${dash}\n`;
        });

        return { codigo, estilosArista, gruposMeta, nodoPersonaMap };
    },

    _crearSelectFiltroDiagrama: (parent, label, valorVacio) => {
        const g = parent.createEl("div", { cls: "agenda-filtro-grupo" });
        g.createEl("label", { text: label });
        return g.createEl("select");
    },

    _llenarSelectFiltro: (sel, vacio, opciones, resolver = v => v) => {
        sel.empty();
        sel.createEl("option", { text: vacio, value: "" });
        opciones.forEach(v => sel.createEl("option", { text: resolver(v), value: v }));
    },

    _renderMapaRelaciones: async (container, db, dbPath, onRefresh, opciones = {}) => {
        const obtenerBase = () => {
            const todas = window.AgendaDB.obtenerTodas(db);
            if (typeof opciones.obtenerFiltrosDashboard === "function") {
                return window.AgendaUI._filtrarPersonas(todas, opciones.obtenerFiltrosDashboard());
            }
            return todas;
        };
        const todas = obtenerBase();
        const optsDiagrama = window.AgendaUI._opcionesFiltroDiagrama(todas);
        const wrapper = container.createEl("div", { cls: "agenda-seccion-mapa" });
        wrapper.createEl("h3", { text: "🕸️ Red de Relaciones Social" });

        const filtrosWrap = wrapper.createEl("div", { cls: "agenda-filtros-diagrama" });
        const selMbti = window.AgendaUI._crearSelectFiltroDiagrama(filtrosWrap, "MBTI", "");
        window.AgendaUI._llenarSelectFiltro(selMbti, "Todos", optsDiagrama.mbti);
        const selEnea = window.AgendaUI._crearSelectFiltroDiagrama(filtrosWrap, "Eneagrama", "");
        window.AgendaUI._llenarSelectFiltro(selEnea, "Todos", optsDiagrama.eneagrama,
            v => window.AgendaPerfil.etiquetaEneagrama(v));
        const selSigno = window.AgendaUI._crearSelectFiltroDiagrama(filtrosWrap, "Signo", "");
        window.AgendaUI._llenarSelectFiltro(selSigno, "Todos", optsDiagrama.signos);
        const selTarot = window.AgendaUI._crearSelectFiltroDiagrama(filtrosWrap, "Tarot", "");
        window.AgendaUI._llenarSelectFiltro(selTarot, "Todos", optsDiagrama.tarots,
            v => window.AgendaPerfil.etiquetaTarotFiltro(v));
        const selGrupo = window.AgendaUI._crearSelectFiltroDiagrama(filtrosWrap, "Grupo", "");
        window.AgendaUI._llenarSelectFiltro(selGrupo, "Todos", optsDiagrama.grupos);
        const selTipoRel = window.AgendaUI._crearSelectFiltroDiagrama(filtrosWrap, "Tipo vínculo", "");
        window.AgendaUI._llenarSelectFiltro(selTipoRel, "Todos", window.AgendaDB.TIPOS_RELACION, t => {
            const n = {
                pareja: "Pareja", mejores_amigos: "Mejores amigos", amigos: "Amigos",
                familia: "Familia", conocidos: "Conocidos", trabajo: "Trabajo", escuela: "Escuela"
            };
            return n[t] || t;
        });
        const selAgrupar = window.AgendaUI._crearSelectFiltroDiagrama(filtrosWrap, "Agrupar por", "");
        [
            { v: "", t: "Sin agrupar" },
            { v: "mbti", t: "MBTI" },
            { v: "eneagrama", t: "Eneagrama" },
            { v: "signo", t: "Signo zodiacal" },
            { v: "tarot", t: "Carta de tarot" },
            { v: "grupos", t: "Grupo" }
        ].forEach(o => selAgrupar.createEl("option", { text: o.t, value: o.v }));

        wrapper.createEl("p", {
            text: "💡 Clic izquierdo: resaltar conexiones · Clic derecho: editar · Los nodos usan el color favorito de cada persona",
            cls: "agenda-mermaid-hint"
        });

        const leyenda = wrapper.createEl("div", { cls: "agenda-leyenda-rel" });
        [
            { cls: "agenda-leyenda-pareja", text: "Pareja" },
            { cls: "agenda-leyenda-mejores", text: "Mejores amigos" },
            { cls: "agenda-leyenda-amigos", text: "Amigos" },
            { cls: "agenda-leyenda-familia", text: "Familia" },
            { cls: "agenda-leyenda-conocidos", text: "Conocidos" },
            { cls: "agenda-leyenda-trabajo", text: "Trabajo" },
            { cls: "agenda-leyenda-escuela", text: "Escuela" }
        ].forEach(item => {
            const el = leyenda.createEl("span", { cls: "agenda-leyenda-item" });
            el.createEl("span", { cls: `agenda-leyenda-linea ${item.cls}` });
            el.createSpan({ text: item.text });
        });

        const agrupacionHost = wrapper.createEl("div", { cls: "agenda-agrupacion-panel", style: "display: none;" });

        const host = wrapper.createEl("div", { cls: "agenda-mermaid-contenedor" });
        const svgHost = host.createEl("div", { cls: "agenda-mermaid-svg" });
        const msgHost = host.createEl("div");

        const renderDiagrama = async () => {
            msgHost.empty();
            svgHost.innerHTML = "";
            svgHost._focoPersonaId = null;
            svgHost._agendaNodoPersonaMap = null;
            window.AgendaUI._renderLeyendaAgrupacion(agrupacionHost, "", []);

            const base = obtenerBase();
            const filtros = {
                mbti: selMbti.value,
                eneagrama: selEnea.value,
                signo: selSigno.value,
                tarot: selTarot.value,
                grupo: selGrupo.value,
                tipoRel: selTipoRel.value
            };
            const personas = window.AgendaUI._filtrarPersonasDiagrama(base, filtros);
            const agruparPor = selAgrupar.value;

            if (!base.length) {
                msgHost.createEl("p", {
                    text: opciones.obtenerFiltrosDashboard
                        ? "Ninguna persona coincide con los filtros del listado."
                        : "Añade personas para visualizar la red.",
                    style: "color: var(--text-muted); font-style: italic;"
                });
                return;
            }
            if (!personas.length) {
                msgHost.createEl("p", {
                    text: "Ninguna persona coincide con los filtros del diagrama.",
                    style: "color: var(--text-muted); font-style: italic;"
                });
                return;
            }

            const tieneVinculos = personas.some(p =>
                window.AgendaDB.TIPOS_RELACION.some(t => {
                    if (filtros.tipoRel && t !== filtros.tipoRel) return false;
                    return (p.relaciones?.[t] || []).some(rid => personas.some(x => x.id === rid));
                })
            );
            if (!tieneVinculos) {
                msgHost.createEl("p", {
                    text: "Sin vínculos visibles con estos filtros (solo nodos).",
                    style: "color: var(--text-muted); font-style: italic; margin-bottom: 8px;"
                });
            }

            const { codigo, estilosArista, gruposMeta, nodoPersonaMap } = window.AgendaUI._construirMermaidRelaciones(personas, {
                agruparPor, tipoRel: filtros.tipoRel
            });
            window.AgendaUI._renderLeyendaAgrupacion(agrupacionHost, agruparPor, personas);
            svgHost._agendaAristasMeta = estilosArista;
            svgHost._agendaPersonas = personas;
            svgHost._agendaNodoPersonaMap = nodoPersonaMap;
            await window.AgendaUI._renderMermaidSvg(svgHost, codigo);
            window.AgendaUI._pulirEstiloNodosMermaid(svgHost);
            window.AgendaUI._pulirEstiloSubgrafosMermaid(svgHost, gruposMeta);
            window.AgendaUI._pulirEstiloAristasMermaid(svgHost, estilosArista);
            window.AgendaUI._enlazarClicksMermaid(svgHost, db, dbPath, onRefresh);
        };

        [selMbti, selEnea, selSigno, selTarot, selGrupo, selTipoRel, selAgrupar].forEach(el => {
            el.onchange = renderDiagrama;
        });
        await renderDiagrama();
    },

    renderDashboard: async (mainContainer, db, dbPath, onRefresh, ctx = {}) => {
        const Notice = require("obsidian").Notice;
        const syncOpts = { SQL: ctx.SQL, kanbanPath: ctx.kanbanPath, dbPath };
        mainContainer.empty();
        mainContainer.addClass("agenda-shell");
        window.AgendaCalendario.injectStyles();
        window.AgendaUI.injectStyles();
        const estado = window.AgendaDB.cargarEstado(db, syncOpts);
        const sugerencias = window.AgendaDB.obtenerSugerencias(estado);
        let vistaActual = "personas";
        let filtrosAbiertos = false;

        const abrirActividad = (datos, extra = {}) => {
            new window.AgendaModals.ActividadFormModal(app, db, dbPath, {
                datosEdicion: datos,
                personaIds: extra.personaIds,
                tipoInicial: extra.tipoInicial,
                fecha: extra.fecha,
                syncOpts
            }, onRefresh).open();
        };

        const cabecera = mainContainer.createEl("div", { cls: "agenda-cabecera" });
        const panel = cabecera.createEl("div", { cls: "agenda-panel agenda-panel--compact" });
        const tools = panel.createEl("div", { cls: "agenda-herramientas" });
        const izqTools = tools.createEl("div", { cls: "agenda-herramientas-acciones" });
        izqTools.createEl("button", {
            text: "➕ Nueva Persona",
            cls: "agenda-btn-primario"
        }).onclick = () => new window.AgendaModals.PersonaFormModal(app, db, dbPath, null, onRefresh).open();
        izqTools.createEl("button", { text: "📅 Evento" }).onclick = () => abrirActividad(null, { tipoInicial: "evento" });
        izqTools.createEl("button", { text: "📝 Tarea" }).onclick = () => abrirActividad(null, { tipoInicial: "tarea" });
        const selMiPersona = izqTools.createEl("select", { attr: { title: "¿Quién eres?" } });
        selMiPersona.createEl("option", { text: "👤 Soy yo: —", value: "" });
        estado.personas.forEach(p => {
            const opt = selMiPersona.createEl("option", { text: `👤 ${p.nombre}`, value: p.id });
            if (p.id === estado.miPersonaId) opt.selected = true;
        });
        selMiPersona.onchange = () => {
            window.AgendaDB.establecerMiPersona(db, dbPath, selMiPersona.value);
            new Notice(selMiPersona.value ? "✅ Persona vinculada como tú" : "Sin persona vinculada");
            onRefresh();
        };

        const tabsWrap = cabecera.createEl("div", { cls: "agenda-vista-tabs" });
        const tabs = [
            { id: "personas", label: "👥 Personas" },
            { id: "red", label: "🕸️ Red" },
            { id: "proximos", label: "🔔 Próximos" },
            { id: "calendario", label: "📅 Calendario" },
            { id: "timeline", label: "📜 Timeline" }
        ];
        const tabBtns = {};
        tabs.forEach(t => {
            tabBtns[t.id] = tabsWrap.createEl("button", { text: t.label, cls: "agenda-vista-tab", type: "button" });
            tabBtns[t.id].onclick = () => { vistaActual = t.id; render(); };
        });

        const barraPersonas = cabecera.createEl("div", { cls: "agenda-barra-personas", style: "display: none;" });
        const inBusquedaPersonas = barraPersonas.createEl("input", {
            type: "search",
            attr: { placeholder: "🔍 Nombre o apodo…" }
        });
        const btnFiltros = barraPersonas.createEl("button", {
            text: "⚙️ Filtros",
            cls: "agenda-btn-filtros",
            type: "button"
        });

        const filtrosAvanzados = cabecera.createEl("div", {
            cls: "agenda-filtros-avanzados",
            style: "display: none;"
        });
        const inBusqueda = filtrosAvanzados.createEl("input", {
            type: "search",
            attr: { placeholder: "Gustos, notas, ciudad…" }
        });
        const selTipoGusto = filtrosAvanzados.createEl("select");
        selTipoGusto.createEl("option", { text: "Gusto: todas", value: "" });
        sugerencias.tipos_preferencia.forEach(t => selTipoGusto.createEl("option", { text: `Gusto: ${t}`, value: t }));
        const selElemGusto = filtrosAvanzados.createEl("select");
        window.AgendaUI._llenarElementosPref(
            selElemGusto, "", sugerencias.elementos_por_tipo, sugerencias.todos_elementos_gusto
        );
        const selTipoDisgusto = filtrosAvanzados.createEl("select");
        selTipoDisgusto.createEl("option", { text: "Disgusto: todas", value: "" });
        sugerencias.tipos_preferencia.forEach(t =>
            selTipoDisgusto.createEl("option", { text: `Disgusto: ${t}`, value: t }));
        const selElemDisgusto = filtrosAvanzados.createEl("select");
        window.AgendaUI._llenarElementosPref(
            selElemDisgusto, "", sugerencias.elementos_por_tipo, sugerencias.todos_elementos_disgusto
        );
        const selCiudad = filtrosAvanzados.createEl("select");
        selCiudad.createEl("option", { text: "Todas las ciudades", value: "" });
        sugerencias.ciudades.forEach(c => selCiudad.createEl("option", { text: c, value: c }));
        const selGrupo = filtrosAvanzados.createEl("select");
        selGrupo.createEl("option", { text: "Todos los grupos", value: "" });
        sugerencias.grupos.forEach(g => selGrupo.createEl("option", { text: g, value: g }));

        const actualizarBarraPersonas = () => {
            const enPersonas = vistaActual === "personas";
            barraPersonas.style.display = enPersonas ? "" : "none";
            filtrosAvanzados.style.display = enPersonas && filtrosAbiertos ? "" : "none";
            btnFiltros.classList.toggle("agenda-btn-filtros--activa", enPersonas && filtrosAbiertos);
        };
        btnFiltros.onclick = () => {
            filtrosAbiertos = !filtrosAbiertos;
            actualizarBarraPersonas();
        };

        const obtenerFiltros = () => ({
            busqueda: inBusqueda.value,
            busquedaNombre: inBusquedaPersonas.value,
            tipoGusto: selTipoGusto.value,
            elementoGusto: selElemGusto.value,
            tipoDisgusto: selTipoDisgusto.value,
            elementoDisgusto: selElemDisgusto.value,
            grupo: selGrupo.value,
            ciudad: selCiudad.value
        });

        const render = async () => {
            const estadoActual = window.AgendaDB.cargarEstado(db, syncOpts);
            Object.values(tabBtns).forEach(b => b.classList.remove("agenda-vista-tab--activa"));
            tabBtns[vistaActual]?.classList.add("agenda-vista-tab--activa");
            actualizarBarraPersonas();

            const filtros = obtenerFiltros();
            mainContainer.querySelectorAll(".agenda-contenido-dinamico").forEach(el => el.remove());
            const contenido = mainContainer.createEl("div", { cls: "agenda-contenido-dinamico" });

            if (vistaActual === "calendario") {
                const sec = contenido.createEl("div", { cls: "agenda-seccion-mapa" });
                sec.createEl("h3", { text: "📅 Calendario" });
                window.AgendaCalendario.renderCalendario(sec, estadoActual.actividades, estadoActual.personas, {
                    onDiaClick: (fecha) => abrirActividad(null, { fecha }),
                    onEdit: (act) => abrirActividad(act)
                });
                const secProx = contenido.createEl("div", { cls: "agenda-seccion-mapa" });
                secProx.createEl("h3", { text: "🔔 Próximos eventos y fechas importantes" });
                window.AgendaCalendario.renderProximos(secProx, estadoActual.actividades, estadoActual.personas, {
                    onEdit: (act) => act.tipo !== "fecha_importante" && abrirActividad(act)
                });
                return;
            }

            if (vistaActual === "timeline") {
                const sec = contenido.createEl("div", { cls: "agenda-seccion-mapa" });
                sec.createEl("h3", { text: "📜 Línea de tiempo de actividades" });
                window.AgendaCalendario.renderTimeline(sec, estadoActual.actividades, estadoActual.personas, {
                    onEdit: (act) => abrirActividad(act)
                });
                return;
            }

            if (vistaActual === "proximos") {
                const sec = contenido.createEl("div", { cls: "agenda-seccion-mapa" });
                sec.createEl("h3", { text: "🔔 Próximos eventos y cumpleaños" });
                window.AgendaCalendario.renderProximos(sec, estadoActual.actividades, estadoActual.personas, {
                    max: 12,
                    onEdit: (act) => act.tipo !== "fecha_importante" && abrirActividad(act)
                });
                return;
            }

            if (vistaActual === "red") {
                await window.AgendaUI._renderMapaRelaciones(contenido, db, dbPath, onRefresh, {
                    obtenerFiltrosDashboard: obtenerFiltros
                });
                return;
            }

            const filtradas = window.AgendaUI._filtrarPersonas(estadoActual.personas, filtros);
            const stats = contenido.createEl("div", { cls: "agenda-stats" });
            stats.createEl("span", {
                text: `👥 ${filtradas.length} / ${estadoActual.personas.length}`,
                cls: "agenda-stat-pill"
            });
            stats.createEl("span", {
                text: `📅 ${estadoActual.actividades.length} actividades`,
                cls: "agenda-stat-pill"
            });

            const grid = contenido.createEl("div", { cls: "agenda-grid" });
            if (!filtradas.length) {
                grid.createEl("p", {
                    text: "No hay personas que coincidan.",
                    style: "color: var(--text-muted); grid-column: 1 / -1;"
                });
                return;
            }
            filtradas.forEach(p => window.AgendaUI._crearTarjetaPersona(grid, p, estadoActual, {
                db, dbPath, onRefresh, syncOpts, abrirActividad
            }));
        };

        inBusqueda.oninput = render;
        inBusquedaPersonas.oninput = render;
        selElemGusto.onchange = render;
        selElemDisgusto.onchange = render;
        selCiudad.onchange = render;
        selGrupo.onchange = render;
        selTipoGusto.onchange = () => {
            window.AgendaUI._llenarElementosPref(
                selElemGusto, selTipoGusto.value, sugerencias.elementos_por_tipo, sugerencias.todos_elementos_gusto
            );
            render();
        };
        selTipoDisgusto.onchange = () => {
            window.AgendaUI._llenarElementosPref(
                selElemDisgusto, selTipoDisgusto.value, sugerencias.elementos_por_tipo, sugerencias.todos_elementos_disgusto
            );
            render();
        };
        render();
    },

    _abrirPerfil: (app, persona, estado, db, dbPath, onRefresh, ctx = {}) => {
        const syncOpts = ctx.syncOpts || {};
        const abrirAct = ctx.abrirActividad || ((datos, extra = {}) => {
            new window.AgendaModals.ActividadFormModal(app, db, dbPath, {
                datosEdicion: datos, personaIds: extra.personaIds || [persona.id],
                tipoInicial: extra.tipoInicial, fecha: extra.fecha, syncOpts
            }, onRefresh || (() => {})).open();
        });
        const actividades = estado.actividades || window.AgendaDB.obtenerActividades(db);
        const color = window.AgendaPerfil.resolverColorPersona(persona);
        const colorOscuro = window.AgendaPerfil.ajustarColor(color, 0.62);

        const dato = (parent, label, valor) => {
            if (valor === undefined || valor === null || valor === "") return;
            const box = parent.createEl("div", { cls: "agenda-perfil-dato" });
            box.createEl("label", { text: label });
            box.createEl("span", { text: String(valor) });
        };

        class PerfilModal extends window.Modal {
            onOpen() {
                window.AgendaModals.injectFormStyles();
                window.AgendaCalendario.injectStyles();
                const { contentEl } = this;
                const layout = contentEl.createEl("div", { cls: "agenda-perfil-layout" });

                const hero = layout.createEl("div", {
                    cls: "agenda-perfil-hero",
                    style: `background: linear-gradient(135deg, ${color}, ${colorOscuro});`
                });
                const heroInner = hero.createEl("div", { cls: "agenda-perfil-hero-inner" });
                const avatarDet = heroInner.createEl("div", { cls: "agenda-avatar agenda-avatar--grande" });
                window.AgendaUI._pintarAvatar(avatarDet, persona);

                const info = heroInner.createEl("div", { cls: "agenda-perfil-hero-info" });
                info.createEl("h2", { text: persona.nombre });
                const edad = window.AgendaDB.calcularEdad(persona.fecha_nacimiento);
                const meta = [persona.ciudad, edad !== null ? `${edad} años` : null, ...(persona.alias || [])].filter(Boolean).join(" · ");
                if (meta) info.createEl("div", { text: meta, cls: "agenda-perfil-hero-meta" });

                const chips = info.createEl("div", { cls: "agenda-perfil-hero-chips" });
                if (persona.mbti) chips.createEl("span", { text: persona.mbti, cls: "agenda-perfil-hero-chip" });
                if (persona.eneagrama) chips.createEl("span", { text: `E-${persona.eneagrama}`, cls: "agenda-perfil-hero-chip" });
                if (persona.signo_zodiacal) chips.createEl("span", { text: persona.signo_zodiacal, cls: "agenda-perfil-hero-chip" });
                if (persona.carta_natal?.ascendente) {
                    const ascSigno = window.AgendaAstral._lonASigno(persona.carta_natal.ascendente.lon);
                    chips.createEl("span", { text: `ASC ${ascSigno.s} ${ascSigno.n}`, cls: "agenda-perfil-hero-chip" });
                }
                if (persona.dias_para_cumple) chips.createEl("span", { text: `🎂 ${persona.dias_para_cumple}`, cls: "agenda-perfil-hero-chip" });

                const accHero = heroInner.createEl("div", { cls: "agenda-perfil-acciones-hero" });
                accHero.createEl("button", { text: "✏️ Editar" }).onclick = () => {
                    this.close();
                    new window.AgendaModals.PersonaFormModal(app, db, dbPath, persona, onRefresh).open();
                };
                accHero.createEl("button", { text: "📅 Evento" }).onclick = () => abrirAct(null, { personaIds: [persona.id], tipoInicial: "evento" });
                accHero.createEl("button", { text: "📝 Tarea" }).onclick = () => abrirAct(null, { personaIds: [persona.id], tipoInicial: "tarea" });

                const tabsBar = layout.createEl("div", { cls: "agenda-perfil-tabs" });
                const scroll = layout.createEl("div", { cls: "agenda-perfil-scroll" });
                const tabDefs = [
                    { id: "resumen", label: "Resumen" },
                    { id: "carta", label: "Carta astral" },
                    { id: "calendario", label: "Calendario" },
                    { id: "datos", label: "Perfil completo" }
                ];
                let tabActiva = "resumen";
                const tabBtns = {};

                const pintarContenido = () => {
                    scroll.empty();
                    if (tabActiva === "resumen") {
                        const s1 = scroll.createEl("div", { cls: "agenda-perfil-seccion" });
                        s1.createEl("h4", { text: "🔔 Próximos eventos" });
                        window.AgendaCalendario.renderProximos(s1, actividades, estado.personas, {
                            personaId: persona.id, max: 6,
                            onEdit: (act) => act.tipo !== "fecha_importante" && abrirAct(act)
                        });
                        const s2 = scroll.createEl("div", { cls: "agenda-perfil-seccion" });
                        s2.createEl("h4", { text: "📜 Línea de tiempo reciente" });
                        window.AgendaCalendario.renderTimeline(s2, actividades, estado.personas, {
                            personaId: persona.id, onEdit: (act) => abrirAct(act)
                        });
                        if (persona.carta_natal) {
                            const s3 = scroll.createEl("div", { cls: "agenda-perfil-seccion" });
                            s3.createEl("h4", { text: "🌌 Carta natal" });
                            window.AgendaAstral.renderCarta(s3, persona, {
                                compacto: true,
                                enlaceCompleto: true,
                                onIrATab: () => {
                                    tabActiva = "carta";
                                    Object.values(tabBtns).forEach(b => b.classList.remove("agenda-perfil-tab--activa"));
                                    tabBtns.carta.classList.add("agenda-perfil-tab--activa");
                                    pintarContenido();
                                }
                            });
                        }
                    } else if (tabActiva === "carta") {
                        window.AgendaAstral.renderCarta(scroll, persona);
                    } else if (tabActiva === "calendario") {
                        const s = scroll.createEl("div", { cls: "agenda-perfil-seccion" });
                        window.AgendaCalendario.renderCalendario(s, actividades, estado.personas, {
                            personaId: persona.id,
                            onDiaClick: (fecha) => abrirAct(null, { personaIds: [persona.id], fecha }),
                            onEdit: (act) => abrirAct(act)
                        });
                    } else {
                        const sPerfil = scroll.createEl("div", { cls: "agenda-perfil-seccion" });
                        sPerfil.createEl("h4", { text: "🧠 Perfil y contacto" });
                        const grid = sPerfil.createEl("div", { cls: "agenda-perfil-datos" });
                        dato(grid, "Grupos", (persona.grupos || []).join(", "));
                        dato(grid, "Nacimiento", persona.fecha_nacimiento);
                        dato(grid, "Hora de nacimiento", persona.hora_nacimiento_desconocida
                            ? "Desconocida"
                            : (persona.hora_nacimiento || "—"));
                        const lugarNac = window.AgendaPerfil.formatearLugarNacimiento(persona);
                        dato(grid, "Lugar de nacimiento", lugarNac || "—");
                        if (persona.estado_nacimiento) dato(grid, "Estado / provincia", persona.estado_nacimiento);
                        const coords = window.AgendaPerfil.formatearCoordenadas(persona.latitud, persona.longitud);
                        dato(grid, "Coordenadas", coords || "—");
                        dato(grid, "Zona horaria", persona.zona_horaria);
                        if (persona.carta_astral?.listo) {
                            dato(grid, "Carta natal", persona.carta_astral.horaExacta
                                ? "Calculada (ver pestaña Carta astral)"
                                : "Carta solar (ver pestaña Carta astral)");
                        } else if (persona.carta_astral) {
                            dato(grid, "Carta natal", `Incompleta: ${persona.carta_astral.faltantes.join(", ")}`);
                        }
                        dato(grid, "Próximo cumpleaños", persona.dias_para_cumple);
                        dato(grid, "MBTI", persona.mbti);
                        dato(grid, "Eneagrama", window.AgendaPerfil.etiquetaEneagrama(persona.eneagrama));
                        const iqDet = window.AgendaPerfil.formatearIq(persona.iq_min, persona.iq_max);
                        if (iqDet) {
                            const etqIq = window.AgendaPerfil.etiquetaRangoIq(persona.iq_min, persona.iq_max, window.AgendaDB.obtenerRangosIq(db));
                            dato(grid, "IQ aproximado", etqIq ? `${iqDet} (${etqIq})` : iqDet);
                        }
                        dato(grid, "Puntos destacables", (persona.puntos_destacables || []).join(", "));
                        dato(grid, "Inteligencias", window.AgendaPerfil.serializarInteligencias(persona.inteligencias));
                        dato(grid, "Teléfono", persona.contacto?.telefono);
                        dato(grid, "Email", persona.contacto?.email);
                        dato(grid, "Ciudad", persona.ciudad);
                        dato(grid, "Actividad social", window.AgendaDB.formatearActividadSocial(persona.actividad_social));
                        dato(grid, "Gustos", window.AgendaPreferencias.serializarTexto(persona.gustos));
                        dato(grid, "Disgustos", window.AgendaPreferencias.serializarTexto(persona.disgustos));
                        dato(grid, "Moralidad", persona.moralidad);
                        dato(grid, "Ética", persona.etica);
                        dato(grid, "Potencial de mejora", persona.potencial);
                        dato(grid, "Hábitos / costumbres", (persona.habitos || []).join(", "));
                        dato(grid, "Debilidades", (persona.debilidades || []).join(", "));

                        const sRel = scroll.createEl("div", { cls: "agenda-perfil-seccion" });
                        sRel.createEl("h4", { text: "🔗 Relaciones" });
                        const gridRel = sRel.createEl("div", { cls: "agenda-perfil-datos" });
                        window.AgendaDB.TIPOS_RELACION.forEach(tipo => {
                            const nombres = (persona.relaciones?.[tipo] || []).map(id => window.AgendaDB.nombreDe(estado.personas, id)).join(", ");
                            dato(gridRel, tipo.replace("_", " "), nombres);
                        });

                        if (persona.notas) {
                            const sNotas = scroll.createEl("div", { cls: "agenda-perfil-seccion" });
                            sNotas.createEl("h4", { text: "📝 Notas" });
                            sNotas.createEl("div", { text: persona.notas, style: "white-space: pre-wrap; line-height: 1.55;" });
                        }
                    }
                };

                tabDefs.forEach(t => {
                    tabBtns[t.id] = tabsBar.createEl("button", {
                        text: t.label, cls: "agenda-perfil-tab", type: "button"
                    });
                    tabBtns[t.id].onclick = () => {
                        tabActiva = t.id;
                        Object.values(tabBtns).forEach(b => b.classList.remove("agenda-perfil-tab--activa"));
                        tabBtns[t.id].classList.add("agenda-perfil-tab--activa");
                        pintarContenido();
                    };
                });
                tabBtns.resumen.classList.add("agenda-perfil-tab--activa");
                pintarContenido();
            }
            onClose() { this.contentEl.empty(); }
        }
        new PerfilModal(app).open();
    },

    _abrirDetalle: (app, persona, estado, db, dbPath, onRefresh, ctx) =>
        window.AgendaUI._abrirPerfil(app, persona, estado, db, dbPath, onRefresh, ctx)
};
