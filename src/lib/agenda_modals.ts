/* agenda_modals.ts — migrado a módulo TS */
// @ts-nocheck
import { AgendaAstral } from "./agenda_astral";
import { AgendaCalendario } from "./agenda_calendario";
import { AgendaDB } from "./agenda_db";
import { AgendaHistorial } from "./agenda_historial";
import { AgendaPerfil } from "./agenda_perfil";
import { AgendaPreferencias } from "./agenda_preferencias";
import { AgendaUI } from "./agenda_ui";
import { Modal, Setting, SuggestModal, Notice } from "obsidian";

/* agenda_modals.js - Modales con autocompletado para la agenda social */

const injectFormStyles = () => {
    const ID = "estilos-agenda-form-v16";
    document.getElementById("estilos-agenda-form-v15")?.remove();
    document.getElementById("estilos-agenda-form-v10")?.remove();
    document.getElementById("estilos-agenda-form-v3")?.remove();
    let styleEl = document.getElementById(ID);
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = ID;
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
        .modal:has(.agenda-form-persona) {
            width: min(860px, 94vw) !important;
            max-width: 96vw !important;
        }
        .modal:has(.agenda-form-layout):not(:has(.agenda-form-persona)) {
            width: min(960px, 94vw) !important;
            max-width: 96vw !important;
        }
        .modal:has(.agenda-form-layout):not(:has(.agenda-form-persona)) .modal-content {
            padding: 26px 30px 22px !important;
            max-height: min(88vh, 920px);
            overflow-y: auto;
            overflow-x: hidden;
        }
        .agenda-form-col {
            display: flex;
            flex-direction: column;
            gap: 36px;
            min-width: 0;
            width: 100%;
        }
        .agenda-form-layout {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
            gap: 36px 28px;
            align-items: start;
            width: 100%;
        }
        .modal:has(.agenda-form-persona) .modal-content {
            padding: 22px 26px 18px !important;
            max-height: min(92vh, 960px) !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
        }
        .agenda-form-persona {
            display: block;
            width: 100%;
            min-height: 0;
        }
        .agenda-form-persona > h2 { margin: 0 0 14px !important; }
        .agenda-form-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            padding-bottom: 12px;
            margin-bottom: 8px;
            border-bottom: 1px solid var(--background-modifier-border);
            position: sticky;
            top: 0;
            z-index: 2;
            background: var(--background-primary);
        }
        .agenda-form-nav-btn {
            padding: 8px 13px;
            border-radius: 8px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-secondary);
            color: var(--text-normal);
            cursor: pointer;
            font-size: 0.86em;
            font-weight: 600;
        }
        .agenda-form-nav-btn:hover { border-color: var(--interactive-accent); }
        .agenda-form-nav-btn--activa {
            background: var(--interactive-accent);
            color: var(--text-on-accent);
            border-color: transparent;
        }
        .agenda-form-body {
            width: 100%;
            overflow: visible;
            padding: 4px 0 20px;
        }
        .agenda-form-grupo {
            display: flex;
            flex-direction: column;
            gap: 14px;
            padding: 18px 0 22px;
            margin-bottom: 4px;
            border-bottom: 1px solid var(--background-modifier-border);
            scroll-margin-top: 72px;
        }
        .agenda-form-grupo:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 8px;
        }
        .agenda-form-grupo-titulo {
            margin: 0;
            font-size: 1.02em;
            font-weight: 700;
            color: var(--text-accent);
            padding-bottom: 8px;
            border-bottom: 2px solid var(--interactive-accent);
        }
        .agenda-form-grupo-contenido {
            display: flex;
            flex-direction: column;
            gap: 18px;
            width: 100%;
            min-width: 0;
        }
        .agenda-form-grupo-contenido > .agenda-form-seccion,
        .agenda-form-grupo-contenido > .agenda-form-rel-grid,
        .agenda-form-grupo-contenido > p {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
        }
        .agenda-form-grupo[data-tab="contacto"] .agenda-form-seccion,
        .agenda-form-grupo[data-tab="vinculos"] .agenda-form-seccion,
        .agenda-form-grupo[data-tab="notas"] .agenda-form-seccion {
            min-height: 48px;
        }
        .agenda-form-campos-2col {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px 18px;
            width: 100%;
        }
        .agenda-form-campos-2col .agenda-campo { min-width: 0; }
        .agenda-form-campos-2col--ancho { grid-column: 1 / -1; }
        .agenda-form-styled .agenda-form-rel-grid--social,
        .agenda-form-styled .agenda-form-rel-grid--contexto {
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .agenda-form-styled .agenda-input-nota,
        .agenda-form-persona textarea.agenda-input-nota {
            display: block;
            min-height: 140px;
            width: 100%;
            box-sizing: border-box;
            resize: vertical;
            line-height: 1.5;
            padding: 11px 14px;
            border-radius: 8px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-primary);
            color: var(--text-normal);
            font-size: 0.92em;
        }
        .agenda-form-styled .agenda-texto-medio {
            min-height: 88px;
            width: 100%;
            box-sizing: border-box;
            resize: vertical;
            line-height: 1.5;
        }
        .agenda-form-acciones {
            flex-shrink: 0;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
            margin-top: 14px;
            padding-top: 14px;
            border-top: 1px solid var(--background-modifier-border);
        }
        .agenda-form-styled .agenda-check-row input[type="checkbox"] {
            width: auto;
            min-height: auto;
            margin: 0;
        }
        .agenda-carta-editor-resumen {
            margin-top: 10px;
            padding: 12px 14px;
            border-radius: 10px;
            background: var(--background-primary);
            border: 1px solid var(--background-modifier-border);
        }
        .agenda-carta-editor-resumen > p:first-child {
            margin: 0 0 8px;
            font-size: 0.88em;
            font-weight: 600;
            color: var(--interactive-accent);
        }
        .agenda-carta-editor-linea {
            font-size: 0.88em;
            color: var(--text-normal);
            margin: 3px 0;
        }
        .agenda-carta-editor-nota {
            margin: 10px 0 0 !important;
            font-size: 0.8em;
            color: var(--text-muted);
            line-height: 1.45;
        }
        .agenda-carta-editor-vacio {
            margin: 8px 0 0;
            font-size: 0.86em;
            color: var(--text-muted);
            font-style: italic;
        }
        .agenda-form-col-full { grid-column: 1 / -1; }
        .agenda-form-rel-grid {
            display: grid;
            gap: 24px;
            align-items: start;
            width: 100%;
        }
        .agenda-form-rel-grid--social,
        .agenda-form-rel-grid--contexto {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        .agenda-form-seccion {
            background: var(--background-secondary);
            border: 1px solid var(--background-modifier-border);
            border-radius: 12px;
            padding: 20px 22px;
            display: flex;
            flex-direction: column;
            gap: 18px;
            min-width: 0;
            width: 100%;
            box-sizing: border-box;
        }
        .agenda-form-seccion-titulo {
            margin: 0;
            font-size: 0.95em;
            font-weight: 700;
            color: var(--text-accent);
            padding-bottom: 12px;
            border-bottom: 1px solid var(--background-modifier-border);
        }
        .agenda-form-seccion .agenda-form-campos-2col,
        .agenda-form-seccion .agenda-lista-wrap,
        .agenda-form-seccion .agenda-pref-bloques,
        .agenda-form-seccion .agenda-auto-calc,
        .agenda-form-seccion .agenda-actividad-unica,
        .agenda-form-seccion .agenda-intel-grid,
        .agenda-form-seccion .agenda-iq-fila {
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
        }
        .agenda-form-styled .agenda-campo {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        .agenda-form-styled .agenda-campo label {
            font-size: 0.88em;
            font-weight: 600;
            color: var(--text-muted);
            line-height: 1.3;
        }
        .agenda-form-styled .agenda-campo input,
        .agenda-form-styled .agenda-campo select,
        .agenda-form-styled .agenda-campo textarea {
            width: 100%;
            min-height: 42px;
            padding: 11px 14px;
            border-radius: 8px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-primary);
            box-sizing: border-box;
            line-height: 1.45;
            font-size: 0.92em;
        }
        .agenda-form-styled .agenda-campo select {
            min-height: 44px;
            height: auto;
            padding: 12px 36px 12px 14px;
            appearance: auto;
        }
        .agenda-form-styled .agenda-select-perfil {
            min-height: 46px;
            padding-top: 12px;
            padding-bottom: 12px;
            line-height: 1.5;
            font-size: 0.9em;
        }
        .agenda-form-styled .agenda-fila-input {
            display: flex;
            gap: 10px;
            align-items: stretch;
        }
        .agenda-form-styled .agenda-fila-input input {
            flex: 1;
            min-width: 0;
        }
        .agenda-form-styled .agenda-fila-input button {
            flex-shrink: 0;
            min-height: 42px;
            padding: 0 16px;
            border-radius: 8px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-modifier-hover);
            cursor: pointer;
        }
        .agenda-form-styled .agenda-auto-calc {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 14px;
        }
        .agenda-form-styled .agenda-auto-calc .agenda-auto-badge--ancho {
            grid-column: 1 / -1;
        }
        .agenda-form-styled .agenda-auto-badge {
            padding: 12px 14px;
            border-radius: 8px;
            background: var(--background-primary);
            border: 1px dashed var(--background-modifier-border);
            font-size: 0.9em;
            line-height: 1.4;
        }
        .agenda-form-styled .agenda-auto-badge strong {
            display: block;
            font-size: 0.78em;
            color: var(--text-muted);
            margin-bottom: 6px;
            font-weight: 600;
        }
        .agenda-form-styled .agenda-auto-badge span {
            color: var(--text-normal);
            font-weight: 600;
        }
        .agenda-form-styled .agenda-auto-badge.vacio span {
            color: var(--text-muted);
            font-weight: 400;
            font-style: italic;
        }
        .agenda-form-styled .agenda-lista-wrap {
            display: flex;
            flex-direction: column;
            gap: 14px;
        }
        .agenda-form-styled .agenda-chips-row {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 10px;
            row-gap: 10px;
            min-height: 36px;
            padding: 6px 0 10px;
            margin: 0 !important;
        }
        .agenda-form-styled .agenda-chip {
            display: inline-flex !important;
            align-items: center;
            gap: 6px;
            margin: 0 !important;
            padding: 6px 12px !important;
            border-radius: 16px;
            font-size: 0.84em;
            line-height: 1.35;
            background: var(--background-modifier-border);
            border: 1px solid var(--background-modifier-border-hover);
        }
        .agenda-form-styled .agenda-chip-quitar {
            border: none;
            background: none;
            cursor: pointer;
            padding: 0 0 0 2px;
            margin: 0;
            line-height: 1;
            opacity: 0.75;
        }
        .agenda-form-styled .agenda-actividad-unica {
            display: flex;
            gap: 12px;
            align-items: stretch;
        }
        .agenda-form-styled .agenda-actividad-unica select {
            flex: 0 0 140px;
            min-height: 42px;
            padding: 11px 14px;
            border-radius: 8px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-primary);
            color: var(--text-normal);
            box-sizing: border-box;
        }
        .agenda-form-styled .agenda-actividad-unica input {
            flex: 1;
            min-width: 60px;
            min-height: 42px;
            padding: 11px 14px;
            border-radius: 8px;
            border: 1px solid var(--background-modifier-border);
            background: var(--background-primary);
            color: var(--text-normal);
            box-sizing: border-box;
        }
        .agenda-form-styled .agenda-historial-lista {
            display: flex;
            flex-direction: column;
            gap: 14px;
            max-height: 320px;
            overflow-y: auto;
            padding: 4px 2px;
        }
        .agenda-form-styled .agenda-historial-item {
            background: var(--background-primary);
            border: 1px solid var(--background-modifier-border);
            border-radius: 10px;
            padding: 12px 14px;
            position: relative;
        }
        .agenda-form-styled .agenda-historial-meta {
            font-size: 0.78em;
            color: var(--text-muted);
            margin-bottom: 8px;
            font-weight: 600;
        }
        .agenda-form-styled .agenda-historial-diff {
            font-size: 0.9em;
            line-height: 1.5;
            word-break: break-word;
        }
        .agenda-form-styled .agenda-historial-diff del {
            color: var(--text-muted);
            opacity: 0.85;
        }
        .agenda-form-styled .agenda-historial-diff .nuevo {
            color: var(--text-accent);
            font-weight: 600;
        }
        .agenda-form-styled .agenda-historial-borrar {
            position: absolute;
            top: 10px;
            right: 10px;
            border: none;
            background: none;
            cursor: pointer;
            opacity: 0.6;
            font-size: 1em;
        }
        .agenda-form-styled .agenda-historial-borrar:hover { opacity: 1; }
        .agenda-form-styled .agenda-campo-color {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
        }
        .agenda-form-styled .agenda-campo-color input[type="color"] {
            width: 52px;
            height: 42px;
            padding: 4px;
            cursor: pointer;
        }
        .agenda-form-styled .agenda-campo-color input[type="text"] {
            flex: 1;
            min-width: 120px;
        }
        .agenda-form-styled .agenda-muestra-color {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            border: 2px solid var(--background-modifier-border);
            flex-shrink: 0;
        }
        .agenda-form-styled .agenda-pref-bloques {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .agenda-form-styled .agenda-pref-bloque {
            background: var(--background-primary);
            border: 1px solid var(--background-modifier-border);
            border-radius: 10px;
            padding: 14px 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .agenda-form-styled .agenda-pref-bloque-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }
        .agenda-form-styled .agenda-pref-tipo-nombre {
            color: var(--text-accent);
            font-size: 0.92em;
            text-transform: capitalize;
        }
        .agenda-form-styled .agenda-pref-nueva-tipo {
            margin-top: 4px;
        }
        .agenda-form-styled .agenda-pref-btn-quitar {
            border: none;
            background: none;
            cursor: pointer;
            opacity: 0.65;
            font-size: 0.9em;
        }
        .agenda-form-styled .agenda-pref-btn-quitar:hover { opacity: 1; }
        .agenda-form-styled .agenda-campo-foto {
            display: flex; flex-wrap: wrap; gap: 14px; align-items: center;
        }
        .agenda-form-styled .agenda-campo-foto-preview {
            width: 72px; height: 72px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            border: 2px solid var(--background-modifier-border);
            font-weight: 800; font-size: 1.2em; color: #fff;
        }
        .agenda-form-styled .agenda-campo-foto-preview img {
            width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .agenda-form-styled .agenda-campo-foto-acciones {
            display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 180px;
        }
        .agenda-form-styled .agenda-campo-foto-btns { display: flex; flex-wrap: wrap; gap: 8px; }
        .agenda-form-styled .agenda-suggest-img {
            display: flex !important; align-items: center; gap: 10px;
        }
        .agenda-form-styled .agenda-suggest-img img {
            width: 48px; height: 48px; object-fit: cover; border-radius: 6px; flex-shrink: 0;
        }
        .agenda-form-styled .agenda-iq-fila {
            display: flex; flex-wrap: wrap; gap: 12px; align-items: center;
        }
        .agenda-form-styled .agenda-iq-fila input[type="number"] {
            width: 88px; flex: 0 0 88px;
        }
        .agenda-form-styled .agenda-iq-leyenda {
            margin-top: 10px; padding: 12px 14px; border-radius: 8px;
            background: var(--background-primary);
            border: 1px dashed var(--background-modifier-border);
            font-size: 0.82em; line-height: 1.55;
        }
        .agenda-form-styled .agenda-iq-leyenda strong {
            display: block; margin-bottom: 8px; color: var(--text-muted); font-size: 0.95em;
        }
        .agenda-form-styled .agenda-iq-leyenda-item {
            display: flex; gap: 8px; justify-content: space-between;
            padding: 3px 0; border-bottom: 1px solid var(--background-modifier-border);
        }
        .agenda-form-styled .agenda-iq-leyenda-item:last-child { border-bottom: none; }
        .agenda-form-styled .agenda-intel-grid {
            display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px;
        }
        .agenda-form-styled .agenda-intel-item {
            display: flex; flex-direction: column; gap: 6px;
        }
        .agenda-form-styled .agenda-intel-item label {
            font-size: 0.82em; font-weight: 600; color: var(--text-muted);
        }
        .modal:has(.agenda-act-form) { width: min(720px, 94vw) !important; }
        .agenda-act-hero {
            display: flex; gap: 16px; align-items: center; margin-bottom: 22px;
            padding: 18px 20px; border-radius: 14px;
            background: linear-gradient(135deg, var(--background-primary), var(--background-secondary));
            border: 1px solid var(--background-modifier-border);
        }
        .agenda-act-hero-icono {
            width: 64px; height: 64px; border-radius: 16px; flex-shrink: 0;
            display: flex; align-items: center; justify-content: center;
            font-size: 2em; background: var(--background-secondary);
            border: 2px solid var(--background-modifier-border);
        }
        .agenda-act-hero-texto { flex: 1; min-width: 0; }
        .agenda-act-hero-texto h2 { margin: 0 0 6px; font-size: 1.15em; color: var(--text-accent); }
        .agenda-act-hero-texto p { margin: 0; font-size: 0.85em; color: var(--text-muted); }
        .agenda-act-tipo-toggle {
            display: flex; gap: 10px; flex-wrap: wrap;
        }
        .modal:has(.agenda-act-form) .agenda-act-tipo-btn {
            flex: 1; min-width: 140px; padding: 12px 16px; border-radius: 10px;
            border: 2px solid var(--background-modifier-border) !important;
            background: var(--background-primary) !important;
            color: var(--text-normal) !important;
            cursor: pointer; font-weight: 600; font-size: 0.9em; text-align: left;
            transition: border-color .2s, background .2s, box-shadow .2s, color .2s;
            box-shadow: none;
        }
        .modal:has(.agenda-act-form) .agenda-act-tipo-btn:hover {
            border-color: var(--interactive-accent) !important;
            background: var(--background-modifier-hover) !important;
        }
        .modal:has(.agenda-act-form) .agenda-act-tipo-btn--activo,
        .modal:has(.agenda-act-form) .agenda-act-tipo-btn--activo:hover {
            border-color: var(--interactive-accent) !important;
            background: rgba(99,102,241,.16) !important;
            color: var(--interactive-accent) !important;
            box-shadow: 0 0 0 2px rgba(99,102,241,.22);
        }
        .modal:has(.agenda-act-form) .agenda-act-tipo-btn small {
            display: block; font-weight: 400; color: var(--text-muted);
            margin-top: 4px; font-size: 0.82em;
        }
        .modal:has(.agenda-act-form) .agenda-act-tipo-btn--activo small {
            color: var(--interactive-accent); opacity: 0.88;
        }
        .agenda-icono-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); gap: 8px;
        }
        .agenda-icono-btn {
            aspect-ratio: 1; font-size: 1.35em; border-radius: 10px; cursor: pointer;
            border: 2px solid var(--background-modifier-border);
            background: var(--background-primary); transition: transform .15s, border-color .15s;
        }
        .agenda-icono-btn:hover { transform: scale(1.08); }
        .agenda-icono-btn--activo {
            border-color: var(--interactive-accent);
            background: rgba(99,102,241,.12);
            box-shadow: 0 0 0 1px var(--interactive-accent);
        }
        .agenda-act-fechas { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .agenda-estado-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .modal:has(.agenda-act-form) .agenda-estado-pill {
            padding: 8px 14px; border-radius: 20px; font-size: 0.85em; font-weight: 600;
            border: 1px solid var(--background-modifier-border) !important;
            background: var(--background-primary) !important;
            color: var(--text-normal) !important;
            cursor: pointer; text-transform: capitalize;
        }
        .modal:has(.agenda-act-form) .agenda-estado-pill--activo {
            background: var(--interactive-accent) !important;
            color: var(--text-on-accent) !important;
            border-color: transparent !important;
            box-shadow: 0 0 0 2px rgba(99,102,241,.25);
        }
        .modal:has(.agenda-perfil-layout) {
            width: min(920px, 96vw) !important;
            max-width: 98vw !important;
            max-height: 92vh !important;
        }
        .modal:has(.agenda-perfil-layout) .modal-content {
            padding: 0 !important;
            max-height: min(92vh, 980px) !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
        }
        .agenda-perfil-layout {
            display: flex;
            flex-direction: column;
            flex: 1 1 auto;
            min-height: 0;
            overflow: hidden;
        }
        .agenda-perfil-scroll {
            overflow-y: auto;
            overflow-x: hidden;
            flex: 1 1 auto;
            min-height: 0;
            max-height: calc(92vh - 240px);
            padding: 4px 28px 28px;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
        }
        .agenda-perfil-scroll::-webkit-scrollbar { width: 8px; }
        .agenda-perfil-scroll::-webkit-scrollbar-thumb {
            background: var(--background-modifier-border);
            border-radius: 4px;
        }
        .agenda-perfil-hero {
            position: relative; padding: 28px 28px 22px; color: #fff;
            border-radius: 0; flex-shrink: 0;
        }
        .agenda-perfil-hero-inner { display: flex; gap: 20px; align-items: flex-end; flex-wrap: wrap; }
        .agenda-perfil-hero .agenda-avatar--grande {
            width: 96px; height: 96px; font-size: 1.6em;
            border: 3px solid rgba(255,255,255,.35); box-shadow: 0 8px 24px rgba(0,0,0,.2);
        }
        .agenda-perfil-hero-info { flex: 1; min-width: 200px; }
        .agenda-perfil-hero-info h2 { margin: 0 0 6px; font-size: 1.5em; color: #fff; }
        .agenda-perfil-hero-meta { font-size: 0.9em; opacity: .92; margin-bottom: 10px; }
        .agenda-perfil-hero-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .agenda-perfil-hero-chip {
            padding: 4px 12px; border-radius: 14px; font-size: 0.8em; font-weight: 600;
            background: rgba(255,255,255,.2); border: 1px solid rgba(255,255,255,.25);
        }
        .agenda-perfil-acciones-hero { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; align-self: flex-start; }
        .agenda-perfil-acciones-hero button {
            padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,.35);
            background: rgba(255,255,255,.15); color: #fff; cursor: pointer; font-weight: 600;
            backdrop-filter: blur(4px);
        }
        .agenda-perfil-acciones-hero button:hover { background: rgba(255,255,255,.28); }
        .agenda-perfil-tabs {
            display: flex; gap: 4px; padding: 12px 28px 0; border-bottom: 1px solid var(--background-modifier-border);
            background: var(--background-secondary); flex-shrink: 0;
        }
        .agenda-perfil-tab {
            padding: 10px 18px; border: none; background: none; cursor: pointer;
            font-weight: 600; font-size: 0.9em; color: var(--text-muted);
            border-bottom: 2px solid transparent; margin-bottom: -1px;
        }
        .agenda-perfil-tab--activa { color: var(--text-accent); border-bottom-color: var(--interactive-accent); }
        .agenda-perfil-seccion {
            background: var(--background-secondary); border: 1px solid var(--background-modifier-border);
            border-radius: 12px; padding: 18px 20px; margin-top: 18px;
        }
        .agenda-perfil-seccion h4 { margin: 0 0 14px; color: var(--text-accent); font-size: 0.95em; }
        .agenda-perfil-datos { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px 20px; }
        .agenda-perfil-dato label { display: block; font-size: 0.75em; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .04em; margin-bottom: 4px; }
        .agenda-perfil-dato span { font-size: 0.92em; line-height: 1.45; }
        @media (max-width: 720px) {
            .agenda-act-fechas { grid-template-columns: 1fr; }
            .agenda-form-styled .agenda-auto-calc { grid-template-columns: 1fr; }
            .agenda-form-campos-2col { grid-template-columns: 1fr; }
            .agenda-form-styled .agenda-form-rel-grid--social,
            .agenda-form-styled .agenda-form-rel-grid--contexto {
                grid-template-columns: 1fr;
            }
        }
    `;
};

class AgendaRangosIqModal extends Modal {
    constructor(app, db, dbPath, rangos, onSaved) {
        super(app);
        this.db = db;
        this.dbPath = dbPath;
        this.rangos = (rangos || []).map(r => ({ ...r }));
        this.onSaved = onSaved;
    }

    onOpen() {
        injectFormStyles();
        const { contentEl } = this;
        contentEl.createEl("h2", { text: "⚙️ Leyendas de IQ", style: "margin: 0 0 12px; color: var(--text-accent);" });
        contentEl.createEl("p", {
            text: "Define los rangos de referencia. Se muestran al editar el IQ aproximado de cada persona.",
            style: "margin: 0 0 16px; font-size: 0.9em; color: var(--text-muted);"
        });

        const lista = contentEl.createEl("div", { style: "display: flex; flex-direction: column; gap: 10px;" });
        const filas = [];

        const render = () => {
            lista.empty();
            filas.length = 0;
            this.rangos.forEach((r, i) => {
                const fila = lista.createEl("div", { cls: "agenda-fila-input" });
                const inMin = fila.createEl("input", { type: "number", attr: { min: "1", placeholder: "Min" } });
                inMin.value = r.min ? String(r.min) : "";
                const inMax = fila.createEl("input", { type: "number", attr: { min: "1", placeholder: "Max" } });
                inMax.value = r.max ? String(r.max) : "";
                const inEtq = fila.createEl("input", { type: "text", attr: { placeholder: "Etiqueta / leyenda" } });
                inEtq.value = r.etiqueta || "";
                fila.createEl("button", { text: "🗑️" }).onclick = (e) => {
                    e.preventDefault();
                    this.rangos.splice(i, 1);
                    render();
                };
                filas.push({ inMin, inMax, inEtq });
            });
        };

        render();
        contentEl.createEl("button", { text: "➕ Rango" }).onclick = (e) => {
            e.preventDefault();
            this.rangos.push({ min: 0, max: 0, etiqueta: "" });
            render();
        };

        const acciones = contentEl.createEl("div", { cls: "agenda-form-acciones" });
        acciones.createEl("button", { text: "Cancelar" }).onclick = () => this.close();
        acciones.createEl("button", {
            text: "💾 Guardar leyendas",
            style: "background: var(--interactive-accent); color: var(--text-on-accent); border: none; padding: 10px 22px; border-radius: 8px; font-weight: bold; cursor: pointer;"
        }).onclick = () => {
            const nuevos = filas.map(f => ({
                min: parseInt(f.inMin.value, 10) || 0,
                max: parseInt(f.inMax.value, 10) || 0,
                etiqueta: f.inEtq.value.trim()
            }));
            const guardados = AgendaDB.guardarRangosIq(this.db, this.dbPath, nuevos);
            this.onSaved?.(guardados);
            new Notice("✅ Leyendas de IQ actualizadas");
            this.close();
        };
    }

    onClose() { this.contentEl.empty(); }
}

class AgendaListaSuggestModal extends SuggestModal {
    constructor(app, items, onSelect, opciones = {}) {
        super(app);
        this.items = items;
        this.onSelect = onSelect;
        this.multi = opciones.multi !== false;
        this.getExcluidos = opciones.getExcluidos || (() => new Set());
        this.setPlaceholder(opciones.placeholder || "🔍 Buscar...");
        if (this.multi && typeof this.setInstructions === "function") {
            this.setInstructions("Clic para añadir varias · Esc para cerrar");
        }
    }

    _disponibles() {
        const excl = this.getExcluidos();
        return this.items.filter(i => !excl.has(String(i)));
    }

    getSuggestions(query) {
        const q = query.toLowerCase().trim();
        const base = this._disponibles();
        if (!q) return base.slice(0, 50);
        return base.filter(i => String(i).toLowerCase().includes(q)).slice(0, 50);
    }

    renderSuggestion(item, el) {
        el.createEl("div", { text: String(item), style: "font-weight: 600;" });
    }

    onChooseSuggestion(item) {
        this.onSelect(item);
        if (this.multi) {
            this.inputEl.value = "";
            this.inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
            this.close();
        }
    }
}

class AgendaPersonaSuggestModal extends SuggestModal {
    constructor(app, personas, getExcluidos, onSelect, opciones = {}) {
        super(app);
        this.personas = personas;
        this.getExcluidos = getExcluidos || (() => new Set());
        this.onSelect = onSelect;
        this.multi = opciones.multi !== false;
        this.setPlaceholder(opciones.placeholder || "🔍 Buscar persona para vincular...");
        if (this.multi && typeof this.setInstructions === "function") {
            this.setInstructions("Clic para vincular varias · Esc para cerrar");
        }
    }

    _disponibles() {
        const excl = this.getExcluidos();
        return this.personas.filter(p => !excl.has(p.id));
    }

    getSuggestions(query) {
        const q = query.toLowerCase().trim();
        const base = this._disponibles();
        if (!q) return base;
        return base.filter(p =>
            p.nombre.toLowerCase().includes(q) ||
            (p.alias || []).some(a => a.toLowerCase().includes(q))
        );
    }

    renderSuggestion(p, el) {
        el.createEl("div", { text: p.nombre, style: "font-weight: 600;" });
        if (p.alias?.length) {
            el.createEl("small", { text: p.alias.join(", "), style: "color: var(--text-muted);" });
        }
    }

    onChooseSuggestion(p) {
        this.onSelect(p);
        if (this.multi) {
            this.inputEl.value = "";
            this.inputEl.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
            this.close();
        }
    }
}

class AgendaConfirmModal extends Modal {
    constructor(app, mensaje, onConfirm) {
        super(app);
        this.mensaje = mensaje;
        this.onConfirm = onConfirm;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl("h3", { text: "⚠️ Confirmar", style: "margin-top: 0;" });
        contentEl.createEl("p", { text: this.mensaje, style: "margin-bottom: 20px;" });
        const btns = contentEl.createEl("div", { className: "agenda-form-acciones" });
        btns.createEl("button", { text: "Cancelar" }).onclick = () => this.close();
        const btnOk = btns.createEl("button", {
            text: "Eliminar",
            style: "background: var(--text-error); color: #fff; border: none; padding: 8px 16px; border-radius: 4px;"
        });
        btnOk.onclick = () => { this.onConfirm(); this.close(); };
    }

    onClose() { this.contentEl.empty(); }
}

class AgendaImagenSuggestModal extends SuggestModal {
    constructor(app, onSelect, opts = {}) {
        super(app);
        this.onSelect = onSelect;
        this.carpeta = (opts.carpeta || AgendaDB.FOTO_CARPETA).replace(/^\/+|\/+$/g, "");
        this.setPlaceholder(opts.placeholder || "🔍 Buscar imagen en la bóveda...");
    }

    getSuggestions(query) {
        const extOk = ["jpg", "jpeg", "png", "webp", "gif", "bmp"];
        const q = (query || "").toLowerCase();
        return this.app.vault.getFiles().filter(file => {
            if (!extOk.includes(file.extension.toLowerCase())) return false;
            if (this.carpeta && !file.path.startsWith(this.carpeta + "/")) return false;
            return file.path.toLowerCase().includes(q);
        });
    }

    renderSuggestion(file, el) {
        el.classList.add("agenda-suggest-img");
        const url = this.app.vault.adapter.getResourcePath(file.path);
        el.createEl("img", { attr: { src: url, alt: "" } });
        const txt = el.createEl("div", { style: "min-width: 0;" });
        txt.createEl("strong", { text: file.name });
        txt.createEl("small", { text: file.path, style: "color: var(--text-muted); display: block;" });
    }

    onChooseSuggestion(file) {
        this.onSelect(file.path);
        this.close();
    }
}

class PersonaFormModal extends Modal {
    constructor(app, db, dbPath, datosEdicion, onSaved) {
        super(app);
        this.db = db;
        this.dbPath = dbPath;
        this.datos = datosEdicion;
        this.onSaved = onSaved;
        this.estado = AgendaDB.cargarEstado(db);
        this.sugerencias = AgendaDB.obtenerSugerencias(this.estado);
        this.listas = {
            alias: [...(datosEdicion?.alias || [])],
            grupos: [...(datosEdicion?.grupos || [])],
            gustos: AgendaPreferencias.clonar(datosEdicion?.gustos),
            disgustos: AgendaPreferencias.clonar(datosEdicion?.disgustos),
            puntos_destacables: [...(datosEdicion?.puntos_destacables || [])],
            habitos: [...(datosEdicion?.habitos || [])],
            debilidades: [...(datosEdicion?.debilidades || [])],
            relaciones: AgendaDB.normalizarRelacionesExclusivas({
                ...AgendaDB._relacionesVacias(),
                ...(datosEdicion?.relaciones || {})
            })
        };
        this.inteligencias = AgendaPerfil.normalizarInteligencias(datosEdicion?.inteligencias);
        this.rangosIq = AgendaDB.obtenerRangosIq(db);
        this.fotoRuta = datosEdicion?.foto || "";
        this._renderRelaciones = {};
    }

    _sincronizarDatosEdicion() {
        if (!this.datos?.id) return;
        const fresca = AgendaDB.obtenerPersonaDb(this.db, this.datos.id);
        if (!fresca) return;
        this.datos = fresca;
        this.listas = {
            alias: [...(fresca.alias || [])],
            grupos: [...(fresca.grupos || [])],
            gustos: AgendaPreferencias.clonar(fresca.gustos),
            disgustos: AgendaPreferencias.clonar(fresca.disgustos),
            puntos_destacables: [...(fresca.puntos_destacables || [])],
            habitos: [...(fresca.habitos || [])],
            debilidades: [...(fresca.debilidades || [])],
            relaciones: AgendaDB.normalizarRelacionesExclusivas({
                ...AgendaDB._relacionesVacias(),
                ...(fresca.relaciones || {})
            })
        };
        this.inteligencias = AgendaPerfil.normalizarInteligencias(fresca.inteligencias);
        this.fotoRuta = fresca.foto || "";
    }

    _seccion(parent, titulo) {
        const sec = parent.createEl("div", { cls: "agenda-form-seccion" });
        sec.createEl("h3", { text: titulo, cls: "agenda-form-seccion-titulo" });
        return sec;
    }

    _campo(parent, label, crearInput) {
        const wrap = parent.createEl("div", { cls: "agenda-campo" });
        wrap.createEl("label", { text: label });
        const input = crearInput(wrap);
        return { wrap, input };
    }

    _crearChips(container, items, onRemove, resolver = null) {
        container.empty();
        if (!items.length) {
            container.createEl("span", { text: "Vacío", style: "color: var(--text-muted); font-style: italic; font-size: 0.88em;" });
            return;
        }
        items.forEach((item, idx) => {
            const chip = container.createEl("span", { cls: "agenda-chip" });
            chip.createEl("span", { text: resolver ? resolver(item) : item });
            chip.createEl("button", { text: "✕", cls: "agenda-chip-quitar" }).onclick = (e) => {
                e.preventDefault();
                onRemove(idx);
            };
        });
    }

    _campoLista(parent, label, key, sugerencias, resolver = null) {
        const campo = this._campo(parent, label, (wrap) => {
            const lista = wrap.createEl("div", { cls: "agenda-lista-wrap" });
            const chips = lista.createEl("div", { cls: "agenda-chips-row" });
            const acciones = lista.createEl("div", { cls: "agenda-fila-input" });
            const inManual = acciones.createEl("input", { type: "text", placeholder: "Escribir y Enter" });

            const render = () => this._crearChips(chips, this.listas[key], (i) => {
                this.listas[key].splice(i, 1);
                render();
            }, resolver);

            const agregar = (valor) => {
                const v = String(valor || "").trim();
                if (!v || this.listas[key].includes(v)) return;
                this.listas[key].push(v);
                inManual.value = "";
                render();
            };

            inManual.onkeydown = (e) => {
                if (e.key === "Enter") { e.preventDefault(); agregar(inManual.value); }
            };

            acciones.createEl("button", { text: "📋 Elegir" }).onclick = (e) => {
                e.preventDefault();
                new AgendaListaSuggestModal(this.app, sugerencias, agregar, {
                    placeholder: `🔍 ${label}`,
                    multi: true,
                    getExcluidos: () => new Set(this.listas[key])
                }).open();
            };

            render();
            return inManual;
        });
        return campo;
    }

    _campoPreferencias(parent, label, key) {
        const tiposSug = this.sugerencias.tipos_preferencia || [];
        const elemsPorTipo = this.sugerencias.elementos_por_tipo || {};

        this._campo(parent, label, (wrap) => {
            const bloquesWrap = wrap.createEl("div", { cls: "agenda-pref-bloques" });
            const nuevaFila = wrap.createEl("div", { cls: "agenda-fila-input agenda-pref-nueva-tipo" });
            const inTipo = nuevaFila.createEl("input", {
                type: "text",
                attr: { placeholder: "Nueva categoría (ej. comida)" }
            });

            const crearTipo = (nombre) => {
                const t = String(nombre || "").trim().toLowerCase();
                if (!t) return;
                if (!this.listas[key][t]) this.listas[key][t] = [];
                inTipo.value = "";
                render();
            };

            const render = () => {
                bloquesWrap.empty();
                const tipos = Object.keys(this.listas[key]).sort((a, b) => a.localeCompare(b, "es"));
                if (!tipos.length) {
                    bloquesWrap.createEl("p", {
                        text: "Sin categorías. Crea una abajo (ej. comida).",
                        style: "color: var(--text-muted); font-style: italic; font-size: 0.88em; margin: 0;"
                    });
                }

                tipos.forEach(tipo => {
                    const bloque = bloquesWrap.createEl("div", { cls: "agenda-pref-bloque" });
                    const header = bloque.createEl("div", { cls: "agenda-pref-bloque-header" });
                    header.createEl("strong", { text: tipo, cls: "agenda-pref-tipo-nombre" });
                    header.createEl("button", { text: "🗑️ Quitar categoría", cls: "agenda-pref-btn-quitar" })
                        .onclick = (e) => {
                            e.preventDefault();
                            delete this.listas[key][tipo];
                            render();
                        };

                    const chips = bloque.createEl("div", { cls: "agenda-chips-row" });
                    const renderChips = () => {
                        this._crearChips(chips, this.listas[key][tipo], (i) => {
                            this.listas[key][tipo].splice(i, 1);
                            renderChips();
                        });
                    };
                    renderChips();

                    const fila = bloque.createEl("div", { cls: "agenda-fila-input" });
                    const inElem = fila.createEl("input", {
                        type: "text",
                        attr: { placeholder: `Elemento en ${tipo}...` }
                    });
                    const agregarElem = (valor) => {
                        const v = String(valor || "").trim();
                        if (!v || this.listas[key][tipo].includes(v)) return;
                        this.listas[key][tipo].push(v);
                        inElem.value = "";
                        renderChips();
                    };
                    inElem.onkeydown = (e) => {
                        if (e.key === "Enter") { e.preventDefault(); agregarElem(inElem.value); }
                    };
                    fila.createEl("button", { text: "📋" }).onclick = (e) => {
                        e.preventDefault();
                        new AgendaListaSuggestModal(this.app, elemsPorTipo[tipo] || [], agregarElem, {
                            placeholder: `🔍 ${tipo}`,
                            multi: true,
                            getExcluidos: () => new Set(this.listas[key][tipo])
                        }).open();
                    };
                });
            };

            inTipo.onkeydown = (e) => {
                if (e.key === "Enter") { e.preventDefault(); crearTipo(inTipo.value); }
            };
            nuevaFila.createEl("button", { text: "📋 Tipos" }).onclick = (e) => {
                e.preventDefault();
                new AgendaListaSuggestModal(this.app, tiposSug, crearTipo, {
                    placeholder: "🔍 Tipo reutilizable",
                    multi: false,
                    getExcluidos: () => new Set(Object.keys(this.listas[key]))
                }).open();
            };
            nuevaFila.createEl("button", { text: "➕ Categoría" }).onclick = (e) => {
                e.preventDefault();
                crearTipo(inTipo.value);
            };

            render();
            return inTipo;
        });
    }

    _campoFoto(parent, nombreRef) {
        this._campo(parent, "Foto de perfil", (wrap) => {
            const fila = wrap.createEl("div", { cls: "agenda-campo-foto" });
            const preview = fila.createEl("div", { cls: "agenda-campo-foto-preview" });
            const acciones = fila.createEl("div", { cls: "agenda-campo-foto-acciones" });
            const inRuta = acciones.createEl("input", {
                type: "text",
                attr: { placeholder: "Ruta en la bóveda (ej. Adjuntos/Agenda Social/foto.jpg)" }
            });
            const btns = acciones.createEl("div", { cls: "agenda-campo-foto-btns" });

            const pintarPreview = () => {
                const personaTmp = {
                    nombre: typeof nombreRef === "function" ? nombreRef() : (nombreRef?.value || "?"),
                    foto: this.fotoRuta
                };
                inRuta.value = this.fotoRuta;
                preview.empty();
                const url = AgendaUI._resolverUrlFoto(this.fotoRuta);
                if (url) {
                    preview.createEl("img", { attr: { src: url, alt: "" } });
                } else {
                    preview.textContent = AgendaUI._iniciales(personaTmp.nombre);
                    preview.style.background = AgendaUI._gradienteAvatar(personaTmp);
                }
            };

            const asignar = (ruta) => {
                this.fotoRuta = (ruta || "").trim();
                pintarPreview();
            };

            inRuta.onchange = () => asignar(inRuta.value);
            btns.createEl("button", { text: "📁 Bóveda" }).onclick = (e) => {
                e.preventDefault();
                new AgendaImagenSuggestModal(this.app, asignar, {
                    carpeta: AgendaDB.FOTO_CARPETA,
                    placeholder: "🔍 Imagen en la bóveda"
                }).open();
            };
            btns.createEl("button", { text: "💻 Cargar PC" }).onclick = (e) => {
                e.preventDefault();
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = async () => {
                    const archivo = input.files?.[0];
                    if (!archivo) return;
                    try {
                        const carpeta = AgendaDB.FOTO_CARPETA;
                        const partes = carpeta.split("/").filter(Boolean);
                        let acum = "";
                        for (const parte of partes) {
                            acum = acum ? `${acum}/${parte}` : parte;
                            if (!this.app.vault.getAbstractFileByPath(acum)) {
                                await this.app.vault.createFolder(acum);
                            }
                        }
                        const base = AgendaDB._slugify(
                            typeof nombreRef === "function" ? nombreRef() : (nombreRef?.value || "persona")
                        ) || "persona";
                        const ext = archivo.name.includes(".")
                            ? archivo.name.slice(archivo.name.lastIndexOf(".")).toLowerCase()
                            : ".jpg";
                        let destino = `${carpeta}/${base}${ext}`;
                        let n = 1;
                        while (this.app.vault.getAbstractFileByPath(destino)) {
                            destino = `${carpeta}/${base}-${n++}${ext}`;
                        }
                        const datos = new Uint8Array(await archivo.arrayBuffer());
                        await this.app.vault.createBinary(destino, datos);
                        asignar(destino);
                        new Notice("📷 Foto guardada en la bóveda");
                    } catch (err) {
                        new Notice("❌ No se pudo guardar la foto: " + err.message);
                    }
                };
                input.click();
            };
            btns.createEl("button", { text: "🗑️ Quitar" }).onclick = (e) => {
                e.preventDefault();
                asignar("");
            };

            pintarPreview();
            return inRuta;
        });
    }

    _campoRelacion(parent, label, tipo) {
        const esCompartido = AgendaDB.esTipoCompartido(tipo);
        this._campo(parent, label, (wrap) => {
            const lista = wrap.createEl("div", { cls: "agenda-lista-wrap" });
            const chips = lista.createEl("div", { cls: "agenda-chips-row" });
            const acciones = lista.createEl("div");

            const render = () => this._crearChips(
                chips, this.listas.relaciones[tipo],
                (i) => {
                    this.listas.relaciones[tipo].splice(i, 1);
                    render();
                },
                (id) => AgendaDB.nombreDe(this.estado.personas, id)
            );

            acciones.createEl("button", { text: "👤 Vincular persona" }).onclick = (e) => {
                e.preventDefault();
                new AgendaPersonaSuggestModal(
                    this.app, this.sugerencias.personas,
                    () => {
                        const excl = new Set([this.datos?.id].filter(Boolean));
                        (this.listas.relaciones[tipo] || []).forEach(id => excl.add(id));
                        if (!esCompartido) {
                            AgendaDB.idsVinculadosRelaciones(this.listas.relaciones, tipo)
                                .forEach(id => excl.add(id));
                        }
                        return excl;
                    },
                    (p) => {
                        if (esCompartido) {
                            if (!this.listas.relaciones[tipo].includes(p.id)) {
                                this.listas.relaciones[tipo].push(p.id);
                            }
                        } else {
                            this.listas.relaciones = AgendaDB.vincularRelacion(
                                this.listas.relaciones, tipo, p.id
                            );
                        }
                        Object.values(this._renderRelaciones).forEach(fn => fn());
                    },
                    { multi: true }
                ).open();
            };

            render();
            this._renderRelaciones[tipo] = render;
        });
    }

    _campoSugerenciaSimple(parent, label, valorInicial, sugerencias, onSelect) {
        return this._campo(parent, label, (wrap) => {
            const fila = wrap.createEl("div", { cls: "agenda-fila-input" });
            const inp = fila.createEl("input", { type: "text" });
            inp.value = valorInicial || "";
            fila.createEl("button", { text: "📋" }).onclick = (e) => {
                e.preventDefault();
                new AgendaListaSuggestModal(this.app, sugerencias, (v) => {
                    inp.value = v;
                    onSelect?.(v);
                }, { multi: false, getExcluidos: () => new Set() }).open();
            };
            return inp;
        });
    }

    _initFormScrollNav(shell, tabDefs) {
        const nav = shell.createEl("nav", { cls: "agenda-form-nav", attr: { "aria-label": "Secciones del formulario" } });
        const body = shell.createEl("div", { cls: "agenda-form-body" });
        const sections = {};
        const grupos = {};
        let tabActiva = tabDefs[0].id;

        tabDefs.forEach(t => {
            const grupo = body.createEl("div", {
                cls: "agenda-form-grupo",
                attr: { id: `agenda-form-grupo-${t.id}`, "data-tab": t.id }
            });
            grupo.createEl("h3", { cls: "agenda-form-grupo-titulo", text: t.label });
            sections[t.id] = grupo.createEl("div", { cls: "agenda-form-grupo-contenido" });
            grupos[t.id] = grupo;
        });

        const pintarNav = () => {
            nav.empty();
            tabDefs.forEach(t => {
                const btn = nav.createEl("button", {
                    text: t.label,
                    type: "button",
                    cls: "agenda-form-nav-btn" + (t.id === tabActiva ? " agenda-form-nav-btn--activa" : "")
                });
                btn.onclick = (e) => {
                    e.preventDefault();
                    tabActiva = t.id;
                    pintarNav();
                    grupos[t.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
                };
            });
        };
        pintarNav();

        return { sections, body, nav, pintarNav, grupos };
    }

    _bloqueAutoCalcBasico(parent, inFecha) {
        const grid = parent.createEl("div", { cls: "agenda-auto-calc" });

        const badgeCumple = grid.createEl("div", { cls: "agenda-auto-badge agenda-auto-badge--ancho vacio" });
        badgeCumple.createEl("strong", { text: "🎂 Próximo cumpleaños" });
        const txtCumple = badgeCumple.createEl("span", { text: "Ingresa fecha de nacimiento" });

        const badgeSigno = grid.createEl("div", { cls: "agenda-auto-badge vacio" });
        badgeSigno.createEl("strong", { text: "♈ Signo solar" });
        const txtSigno = badgeSigno.createEl("span", { text: "—" });

        const badgeTarot = grid.createEl("div", { cls: "agenda-auto-badge vacio" });
        badgeTarot.createEl("strong", { text: "🃏 Carta de tarot" });
        const txtTarot = badgeTarot.createEl("span", { text: "—" });

        const actualizar = () => {
            const f = inFecha.value;
            const signo = AgendaPerfil.calcularSignoZodiacal(f);
            const tarot = AgendaPerfil.calcularCartaTarot(f);
            const cumple = AgendaPerfil.calcularDiasParaCumpleanos(f);
            txtSigno.textContent = signo || "—";
            txtTarot.textContent = tarot || "—";
            txtCumple.textContent = cumple || "—";
            badgeSigno.classList.toggle("vacio", !signo);
            badgeTarot.classList.toggle("vacio", !tarot);
            badgeCumple.classList.toggle("vacio", !cumple);
        };

        inFecha.addEventListener("change", actualizar);
        inFecha.addEventListener("input", actualizar);
        actualizar();
        return actualizar;
    }

    _bloqueEstadoCarta(parent, inFecha, refsCarta = {}) {
        const badgeCarta = parent.createEl("div", { cls: "agenda-auto-badge agenda-auto-badge--ancho vacio" });
        badgeCarta.createEl("strong", { text: "🌌 Estado de la carta" });
        const txtCarta = badgeCarta.createEl("span", { text: "Completa los datos de nacimiento" });
        const contResumen = parent.createEl("div", { cls: "agenda-carta-preview-host" });

        const datosCarta = () => ({
            fecha_nacimiento: inFecha.value,
            hora_nacimiento: refsCarta.inHora?.value,
            hora_nacimiento_desconocida: refsCarta.chkHoraDesc?.checked ? 1 : 0,
            latitud: refsCarta.inLat?.value,
            longitud: refsCarta.inLon?.value,
            zona_horaria: refsCarta.inZh?.value,
            ciudad: refsCarta.inCiudad?.value || "",
            estado_nacimiento: refsCarta.inEstado?.value || "",
            pais_nacimiento: refsCarta.inPais?.value || ""
        });

        const actualizar = () => {
            const evalCarta = AgendaPerfil.evaluarCartaAstral(datosCarta());
            contResumen.empty();
            if (evalCarta.listo) {
                txtCarta.textContent = evalCarta.horaExacta
                    ? "Calculada · carta natal completa"
                    : "Calculada · carta solar (sin casas)";
                badgeCarta.classList.remove("vacio");
                badgeCarta.classList.add("agenda-auto-badge--carta-lista");
                if (AgendaAstral?.renderResumenEditor) {
                    AgendaAstral.renderResumenEditor(contResumen, datosCarta());
                } else {
                    contResumen.createEl("p", {
                        cls: "agenda-carta-editor-vacio",
                        text: "Vista previa no disponible en esta versión. La carta completa sigue disponible en el perfil."
                    });
                }
            } else {
                txtCarta.textContent = `Faltan: ${evalCarta.faltantes.join(", ")}`;
                badgeCarta.classList.add("vacio");
                badgeCarta.classList.remove("agenda-auto-badge--carta-lista");
                contResumen.createEl("p", {
                    cls: "agenda-carta-editor-vacio",
                    text: "Completa hora (o marca «hora desconocida»), coordenadas y zona horaria."
                });
            }
        };

        inFecha.addEventListener("change", actualizar);
        inFecha.addEventListener("input", actualizar);
        [refsCarta.inHora, refsCarta.inLat, refsCarta.inLon, refsCarta.inZh, refsCarta.inCiudad, refsCarta.inEstado, refsCarta.inPais].forEach(el => {
            el?.addEventListener("input", actualizar);
            el?.addEventListener("change", actualizar);
        });
        refsCarta.chkHoraDesc?.addEventListener("change", actualizar);
        actualizar();
        return actualizar;
    }

    _configurarGeocodificacion(secCarta, refs, ancla = null) {
        const { inCiudad, inEstado, inPais, inLat, inLon, inZh, onActualizado } = refs;
        let timer = null;
        let timerEstado = null;
        let timerPais = null;
        let buscando = false;
        this._ultimaGeoConsulta = `${inCiudad.value.trim()}|${inEstado.value.trim()}|${inPais.value.trim()}`.toLowerCase();

        const claveConsulta = () =>
            `${inCiudad.value.trim()}|${inEstado.value.trim()}|${inPais.value.trim()}`.toLowerCase();

        const aplicarGeo = (geo) => {
            if (!geo || geo.latitud == null || geo.longitud == null) return false;
            if (geo.latitud != null) inLat.value = String(geo.latitud);
            if (geo.longitud != null) inLon.value = String(geo.longitud);
            if (geo.zona_horaria) inZh.value = geo.zona_horaria;
            if (geo.estado_nacimiento && !inEstado.value.trim()) inEstado.value = geo.estado_nacimiento;
            if (geo.pais_nacimiento && !inPais.value.trim()) inPais.value = geo.pais_nacimiento;
            inLat.dispatchEvent(new Event("input", { bubbles: true }));
            inLon.dispatchEvent(new Event("input", { bubbles: true }));
            inZh.dispatchEvent(new Event("input", { bubbles: true }));
            onActualizado?.();
            return true;
        };

        const buscarCoords = async (silencioso = false) => {
            const ciudad = inCiudad.value.trim();
            if (!ciudad || buscando) return;

            const clave = claveConsulta();
            if (clave === this._ultimaGeoConsulta && inLat.value && inLon.value) return;

            buscando = true;
            btnGeo.disabled = true;
            btnGeo.textContent = "⏳ Buscando…";
            try {
                const geo = await AgendaPerfil.geocodificarLugar(
                    ciudad, inPais.value.trim(), inEstado.value.trim(), this.app
                );
                if (aplicarGeo(geo)) {
                    this._ultimaGeoConsulta = clave;
                    if (!silencioso) {
                        new Notice(`📍 ${AgendaPerfil.etiquetaLugarGeocodificado(geo)}`);
                    }
                } else if (!silencioso) {
                    new Notice("No se encontraron coordenadas. Prueba añadir estado/provincia y país.");
                }
            } finally {
                buscando = false;
                btnGeo.disabled = false;
                btnGeo.textContent = "📍 Obtener coordenadas";
            }
        };

        const filaGeo = secCarta.createEl("div", {
            cls: "agenda-geo-fila",
            style: "margin: -6px 0 14px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;"
        });
        const btnGeo = filaGeo.createEl("button", { text: "📍 Obtener coordenadas", type: "button" });
        btnGeo.onclick = (e) => { e.preventDefault(); buscarCoords(false); };
        filaGeo.createEl("span", {
            text: "Usa ciudad + estado + país para mayor precisión (ej. Guadalajara, Jalisco, México).",
            style: "font-size: 0.82em; color: var(--text-muted);"
        });
        if (ancla && secCarta.contains(ancla)) {
            let hijoDirecto = ancla;
            while (hijoDirecto.parentNode !== secCarta && hijoDirecto.parentNode) {
                hijoDirecto = hijoDirecto.parentNode;
            }
            if (hijoDirecto.parentNode === secCarta) secCarta.insertBefore(filaGeo, hijoDirecto);
            else secCarta.appendChild(filaGeo);
        } else {
            secCarta.appendChild(filaGeo);
        }

        const progAuto = () => {
            clearTimeout(timer);
            timer = setTimeout(() => buscarCoords(true), 1200);
        };
        inCiudad.addEventListener("input", progAuto);
        inCiudad.addEventListener("change", () => buscarCoords(true));
        inEstado.addEventListener("input", () => {
            clearTimeout(timerEstado);
            timerEstado = setTimeout(() => buscarCoords(true), 1200);
        });
        inEstado.addEventListener("change", () => { if (inCiudad.value.trim()) buscarCoords(true); });
        inPais.addEventListener("input", () => {
            clearTimeout(timerPais);
            timerPais = setTimeout(() => buscarCoords(true), 1200);
        });
        inPais.addEventListener("change", () => {
            if (inCiudad.value.trim()) buscarCoords(true);
        });

        return buscarCoords;
    }

    _pintarLeyendaIq(contenedor, rangos) {
        contenedor.empty();
        const box = contenedor.createEl("div", { cls: "agenda-iq-leyenda" });
        box.createEl("strong", { text: "Referencia de rangos IQ (aproximado)" });
        rangos.forEach(r => {
            const item = box.createEl("div", { cls: "agenda-iq-leyenda-item" });
            item.createEl("span", { text: `${r.min}–${r.max}` });
            item.createEl("span", { text: r.etiqueta, style: "color: var(--text-muted);" });
        });
    }

    _campoIq(parent, iqMin, iqMax) {
        const contLeyenda = parent.createEl("div");
        this._pintarLeyendaIq(contLeyenda, this.rangosIq);

        let inMin, inMax;
        this._campo(parent, "IQ aproximado", w => {
            const fila = w.createEl("div", { cls: "agenda-iq-fila" });
            inMin = fila.createEl("input", { type: "number", attr: { min: "1", max: "200", placeholder: "115" } });
            fila.createEl("span", { text: "—", style: "color: var(--text-muted);" });
            inMax = fila.createEl("input", { type: "number", attr: { min: "1", max: "200", placeholder: "130" } });
            if (iqMin > 0) inMin.value = String(iqMin);
            if (iqMax > 0) inMax.value = String(iqMax);
            return inMin;
        });

        parent.createEl("p", {
            text: "Estimación orientativa según los rangos de referencia. No es un diagnóstico clínico.",
            style: "margin: 0; font-size: 0.82em; color: var(--text-muted); font-style: italic;"
        });

        parent.createEl("button", { text: "⚙️ Editar leyendas de rangos" }).onclick = (e) => {
            e.preventDefault();
            new AgendaRangosIqModal(this.app, this.db, this.dbPath, this.rangosIq, (nuevos) => {
                this.rangosIq = nuevos;
                this._pintarLeyendaIq(contLeyenda, this.rangosIq);
            }).open();
        };

        return { inMin, inMax };
    }

    _campoInteligencias(parent) {
        const selects = {};
        parent.createEl("p", {
            text: "Niveles por tipo de inteligencia (F → S). Referencia: F muy bajo · D bajo · C medio-bajo · B medio · A alto · S sobresaliente.",
            style: "margin: 0; font-size: 0.82em; color: var(--text-muted); font-style: italic;"
        });
        const grid = parent.createEl("div", { cls: "agenda-intel-grid" });
        AgendaPerfil.TIPOS_INTELIGENCIA.forEach(tipo => {
            const item = grid.createEl("div", { cls: "agenda-intel-item" });
            item.createEl("label", { text: tipo.l });
            const sel = item.createEl("select", { cls: "agenda-select-perfil" });
            AgendaPerfil.NIVELES_INTELIGENCIA.forEach(o =>
                sel.createEl("option", { text: o.l, value: o.v }));
            if (this.inteligencias[tipo.id]) sel.value = this.inteligencias[tipo.id];
            sel.onchange = () => { this.inteligencias[tipo.id] = sel.value; };
            selects[tipo.id] = sel;
        });
        return selects;
    }

    _renderHistorial(container, personaId) {
        container.empty();
        if (!personaId) {
            container.createEl("p", {
                text: "El historial se generará al guardar la persona.",
                style: "color: var(--text-muted); font-style: italic; font-size: 0.9em; margin: 0;"
            });
            return;
        }

        const entradas = AgendaHistorial.obtener(this.db, personaId);
        if (!entradas.length) {
            container.createEl("p", {
                text: "Sin cambios registrados aún.",
                style: "color: var(--text-muted); font-style: italic; font-size: 0.9em; margin: 0;"
            });
            return;
        }

        const lista = container.createEl("div", { cls: "agenda-historial-lista" });
        entradas.forEach(ent => {
            const item = lista.createEl("div", { cls: "agenda-historial-item" });
            item.createEl("button", { text: "🗑️", cls: "agenda-historial-borrar", attr: { title: "Eliminar entrada" } })
                .onclick = () => {
                    new AgendaConfirmModal(this.app, "¿Eliminar esta entrada del historial?", () => {
                        AgendaHistorial.eliminar(this.db, this.dbPath, ent.id);
                        this._renderHistorial(container, personaId);
                        new Notice("Entrada eliminada del historial");
                    }).open();
                };

            const meta = item.createEl("div", { cls: "agenda-historial-meta" });
            meta.setText(`${AgendaHistorial.formatearFecha(ent.fecha)} · ${AgendaHistorial.etiquetaCampo(ent.campo)}`);

            const diff = item.createEl("div", { cls: "agenda-historial-diff" });
            if (ent.campo === "_creacion") {
                diff.createEl("span", { text: ent.valor_nuevo, cls: "nuevo" });
            } else if (!ent.valor_anterior && ent.valor_nuevo) {
                diff.createEl("span", { text: ent.valor_nuevo, cls: "nuevo" });
            } else if (ent.valor_anterior && !ent.valor_nuevo) {
                const del = diff.createEl("del");
                del.setText(ent.valor_anterior);
            } else {
                const del = diff.createEl("del");
                del.setText(ent.valor_anterior);
                diff.createSpan({ text: " → " });
                const spanNuevo = diff.createEl("span", { cls: "nuevo" });
                spanNuevo.setText(ent.valor_nuevo);
            }
        });
    }

    onOpen() {
        injectFormStyles();
        this._sincronizarDatosEdicion();
        const { contentEl } = this;
        contentEl.empty();
        const esEdicion = !!this.datos;

        const root = contentEl.createEl("div", { cls: "agenda-form-persona agenda-form-styled" });
        root.createEl("h2", {
            text: esEdicion ? "📝 Editar Persona" : "✨ Nueva Persona",
            style: "color: var(--text-accent);"
        });

        const { sections } = this._initFormScrollNav(root, [
            { id: "identidad", label: "👤 Identidad" },
            { id: "astral", label: "🌌 Carta astral" },
            { id: "perfil", label: "🧠 Perfil" },
            { id: "contacto", label: "📞 Contacto" },
            { id: "vinculos", label: "🔗 Vínculos" },
            { id: "notas", label: "📝 Notas" }
        ]);

        // —— Identidad ——
        const secIdentidad = this._seccion(sections.identidad, "👤 Datos básicos");
        const { input: inNombre } = this._campo(secIdentidad, "Nombre *", w =>
            w.createEl("input", { type: "text", placeholder: "Nombre completo" }));
        if (esEdicion) inNombre.value = this.datos.nombre;

        this._campoFoto(secIdentidad, inNombre);

        this._campoLista(secIdentidad, "Alias", "alias", this.sugerencias.alias);
        this._campoLista(secIdentidad, "Grupos", "grupos", this.sugerencias.grupos);

        const { input: inFecha } = this._campo(secIdentidad, "Fecha de nacimiento", w =>
            w.createEl("input", { type: "date" }));
        if (esEdicion && this.datos.fecha_nacimiento) inFecha.value = this.datos.fecha_nacimiento;

        const secAstro = this._seccion(sections.identidad, "✨ Calculado automáticamente");
        this._bloqueAutoCalcBasico(secAstro, inFecha);

        const secPerfil = this._seccion(sections.perfil, "🧠 Perfil psicológico");
        const gridPerfilPsico = secPerfil.createEl("div", { cls: "agenda-form-campos-2col" });
        const { input: selMbti } = this._campo(gridPerfilPsico, "MBTI", w => {
            const sel = w.createEl("select", { cls: "agenda-select-perfil" });
            sel.createEl("option", { text: "— Sin definir —", value: "" });
            AgendaPerfil.MBTI_OPCIONES.filter(Boolean).forEach(t =>
                sel.createEl("option", { text: t, value: t }));
            return sel;
        });
        if (esEdicion && this.datos.mbti) selMbti.value = this.datos.mbti;

        const { input: selEnea } = this._campo(gridPerfilPsico, "Eneagrama", w => {
            const sel = w.createEl("select", { cls: "agenda-select-perfil" });
            AgendaPerfil.ENEAGRAMA_OPCIONES.forEach(o =>
                sel.createEl("option", { text: o.l, value: o.v }));
            return sel;
        });
        if (esEdicion && this.datos.eneagrama) selEnea.value = this.datos.eneagrama;

        const colorInicial = esEdicion
            ? AgendaPerfil.resolverColorPersona(this.datos)
            : AgendaPerfil.COLOR_DEFECTO;
        const { input: inColor } = this._campo(secPerfil, "Color favorito", w => {
            const fila = w.createEl("div", { cls: "agenda-campo-color" });
            const picker = fila.createEl("input", { type: "color" });
            picker.value = colorInicial;
            const muestra = fila.createEl("span", { cls: "agenda-muestra-color" });
            muestra.style.background = colorInicial;
            const hex = fila.createEl("input", {
                type: "text",
                attr: { placeholder: "#6366f1", maxlength: "7" }
            });
            hex.value = esEdicion && this.datos.color_favorito
                ? this.datos.color_favorito
                : "";
            const sync = () => {
                const v = AgendaPerfil.validarColorHex(hex.value) || picker.value;
                picker.value = v;
                muestra.style.background = v;
            };
            picker.oninput = () => { hex.value = picker.value; sync(); };
            hex.oninput = () => { if (AgendaPerfil.validarColorHex(hex.value)) sync(); };
            sync();
            hex.dataset.colorPicker = "hex";
            picker.dataset.colorPicker = "picker";
            return hex;
        });

        // —— Carta astral ——
        const secCarta = this._seccion(sections.astral, "🌌 Datos de nacimiento");
        secCarta.createEl("p", {
            text: "Lugar y hora exactos de nacimiento para calcular la carta natal.",
            style: "margin: 0 0 12px; font-size: 0.88em; color: var(--text-muted);"
        });

        const { input: inHora } = this._campo(secCarta, "Hora de nacimiento", w =>
            w.createEl("input", { type: "time", attr: { step: "60" } }));
        if (esEdicion && this.datos.hora_nacimiento) inHora.value = this.datos.hora_nacimiento;

        const wrapHoraDesc = secCarta.createEl("label", {
            cls: "agenda-check-row",
            style: "display: flex; align-items: center; gap: 8px; margin: -4px 0 14px; font-size: 0.9em; cursor: pointer;"
        });
        const chkHoraDesc = wrapHoraDesc.createEl("input", { type: "checkbox" });
        wrapHoraDesc.createEl("span", { text: "Hora desconocida (solo carta solar)" });
        if (esEdicion && this.datos.hora_nacimiento_desconocida) chkHoraDesc.checked = true;
        const syncHoraDesc = () => {
            inHora.disabled = chkHoraDesc.checked;
            if (chkHoraDesc.checked) inHora.value = "";
        };
        chkHoraDesc.onchange = syncHoraDesc;
        syncHoraDesc();

        const { input: inCiudad } = this._campoSugerenciaSimple(
            secCarta, "Ciudad de nacimiento",
            esEdicion ? this.datos.ciudad : "",
            this.sugerencias.ciudades,
            () => buscarCoordsGeo?.(false)
        );
        const { input: inEstado } = this._campoSugerenciaSimple(
            secCarta, "Estado / provincia de nacimiento",
            esEdicion ? this.datos.estado_nacimiento : "",
            this.sugerencias.estados_nacimiento || [],
            () => buscarCoordsGeo?.(false)
        );
        secCarta.createEl("p", {
            text: "Ej.: Jalisco, Nuevo León, California, São Paulo. Ayuda a distinguir ciudades homónimas.",
            style: "margin: -6px 0 10px; font-size: 0.82em; color: var(--text-muted); font-style: italic;"
        });
        const { input: inPais } = this._campoSugerenciaSimple(
            secCarta, "País de nacimiento",
            esEdicion ? this.datos.pais_nacimiento : "",
            this.sugerencias.paises_nacimiento || [],
            () => buscarCoordsGeo?.(false)
        );
        let buscarCoordsGeo = null;
        const gridCoords = secCarta.createEl("div", { cls: "agenda-form-campos-2col" });
        const latCampo = this._campo(gridCoords, "Latitud", w => {
            const inp = w.createEl("input", {
                type: "number",
                attr: { step: "0.0001", placeholder: "19.4326", min: "-90", max: "90" }
            });
            if (esEdicion && this.datos.latitud != null) inp.value = String(this.datos.latitud);
            return inp;
        });
        const inLat = latCampo.input;
        const { input: inLon } = this._campo(gridCoords, "Longitud", w => {
            const inp = w.createEl("input", {
                type: "number",
                attr: { step: "0.0001", placeholder: "-99.1332", min: "-180", max: "180" }
            });
            if (esEdicion && this.datos.longitud != null) inp.value = String(this.datos.longitud);
            return inp;
        });
        secCarta.createEl("p", {
            text: "Sur = latitud negativa · Oeste = longitud negativa.",
            style: "margin: -6px 0 12px; font-size: 0.82em; color: var(--text-muted); font-style: italic;"
        });
        const { input: inZh } = this._campoSugerenciaSimple(
            secCarta, "Zona horaria",
            esEdicion ? this.datos.zona_horaria : "America/Mexico_City",
            this.sugerencias.zonas_horarias
        );

        const secEstadoCarta = this._seccion(sections.astral, "📊 Vista previa");
        let actualizarCarta = () => {};
        try {
            actualizarCarta = this._bloqueEstadoCarta(secEstadoCarta, inFecha, {
                inHora, chkHoraDesc, inLat, inLon, inZh, inCiudad, inEstado, inPais
            });
        } catch (err) {
            secEstadoCarta.createEl("p", {
                cls: "agenda-carta-editor-vacio",
                text: "No se pudo cargar la vista previa de carta astral."
            });
            console.error("[Agenda] Error en vista previa astral del editor:", err);
        }
        buscarCoordsGeo = this._configurarGeocodificacion(secCarta, {
            inCiudad, inEstado, inPais, inLat, inLon, inZh, onActualizado: actualizarCarta
        }, gridCoords);

        const secContacto = this._seccion(sections.contacto, "📞 Contacto y redes");
        const gridContacto = secContacto.createEl("div", { cls: "agenda-form-campos-2col" });
        const { input: inTel } = this._campo(gridContacto, "Teléfono", w => w.createEl("input", { type: "text" }));
        if (esEdicion) inTel.value = this.datos.contacto?.telefono || "";

        const { input: inEmail } = this._campo(gridContacto, "Email", w => w.createEl("input", { type: "email" }));
        if (esEdicion) inEmail.value = this.datos.contacto?.email || "";

        const redesInputs = {};
        ["instagram", "twitter", "facebook"].forEach(red => {
            const { input } = this._campo(secContacto, red.charAt(0).toUpperCase() + red.slice(1), w =>
                w.createEl("input", { type: "text", placeholder: "@usuario o URL" }));
            if (esEdicion) input.value = this.datos.redes?.[red] || "";
            redesInputs[red] = input;
        });

        const secSocial = this._seccion(sections.contacto, "📅 Actividad social");
        const act = AgendaDB.normalizarActividad(esEdicion ? this.datos.actividad_social : {});
        const actWrap = secSocial.createEl("div", { cls: "agenda-actividad-unica" });
        const selTipoAct = actWrap.createEl("select");
        [{ v: "dias", t: "Días" }, { v: "semanas", t: "Semanas" }, { v: "meses", t: "Meses" }].forEach(o => {
            const opt = selTipoAct.createEl("option", { text: o.t, value: o.v });
            if (act.tipo === o.v) opt.selected = true;
        });
        const inValorAct = actWrap.createEl("input", { type: "number", attr: { min: "0", step: "1", placeholder: "Cantidad" } });
        inValorAct.value = act.valor > 0 ? String(act.valor) : "";

        const secCognitivo = this._seccion(sections.perfil, "🧩 Perfil cognitivo");
        this._campoLista(secCognitivo, "Puntos destacables", "puntos_destacables",
            [...new Set([...(this.sugerencias.puntos_destacables || []), ...AgendaPerfil.PUNTOS_SUGERIDOS])]);
        const { inMin: inIqMin, inMax: inIqMax } = this._campoIq(
            secCognitivo,
            esEdicion ? this.datos.iq_min : 0,
            esEdicion ? this.datos.iq_max : 0
        );
        this._campo(secCognitivo, "Niveles de inteligencia", w => {
            this._campoInteligencias(w);
            return w;
        });

        const secValores = this._seccion(sections.perfil, "⚖️ Valores y conducta");
        const { input: inMoralidad } = this._campo(secValores, "Moralidad", w =>
            w.createEl("textarea", { cls: "agenda-texto-medio", attr: { placeholder: "Principios morales, límites personales..." } }));
        if (esEdicion) inMoralidad.value = this.datos.moralidad || "";

        const { input: inEtica } = this._campo(secValores, "Ética", w =>
            w.createEl("textarea", { cls: "agenda-texto-medio", attr: { placeholder: "Criterios éticos, integridad, coherencia..." } }));
        if (esEdicion) inEtica.value = this.datos.etica || "";

        const { input: inPotencial } = this._campo(secValores, "Potencial de mejora", w =>
            w.createEl("textarea", { cls: "agenda-texto-medio", attr: { placeholder: "Qué tanto puede mejorar, áreas de crecimiento..." } }));
        if (esEdicion) inPotencial.value = this.datos.potencial || "";

        this._campoLista(secValores, "Hábitos / costumbres", "habitos", this.sugerencias.habitos || []);
        this._campoLista(secValores, "Debilidades", "debilidades", this.sugerencias.debilidades || []);

        // —— Ancho completo: gustos, relaciones, notas ——
        const secGustos = this._seccion(sections.vinculos, "🎮 Gustos e intereses");
        this._campoPreferencias(secGustos, "Por categoría", "gustos");

        const secDisgustos = this._seccion(sections.vinculos, "🚫 Disgustos");
        this._campoPreferencias(secDisgustos, "Por categoría", "disgustos");

        const relGridSocial = sections.vinculos.createEl("div", { cls: "agenda-form-rel-grid agenda-form-rel-grid--social" });
        this._campoRelacion(this._seccion(relGridSocial, "💕 Pareja"), "Vínculos", "pareja");
        this._campoRelacion(this._seccion(relGridSocial, "⭐ Mejores amigos"), "Vínculos", "mejores_amigos");
        this._campoRelacion(this._seccion(relGridSocial, "🤝 Amigos"), "Vínculos", "amigos");
        this._campoRelacion(this._seccion(relGridSocial, "👪 Familia"), "Vínculos", "familia");
        this._campoRelacion(this._seccion(relGridSocial, "👋 Conocidos"), "Vínculos", "conocidos");

        sections.vinculos.createEl("p", {
            text: "Trabajo y escuela permiten la misma persona en ambas secciones.",
            style: "margin: 0; font-size: 0.85em; color: var(--text-muted); font-style: italic;"
        });
        const relGridContexto = sections.vinculos.createEl("div", { cls: "agenda-form-rel-grid agenda-form-rel-grid--contexto" });
        this._campoRelacion(this._seccion(relGridContexto, "💼 Trabajo"), "Vínculos", "trabajo");
        this._campoRelacion(this._seccion(relGridContexto, "🎓 Escuela"), "Vínculos", "escuela");

        const secNotas = this._seccion(sections.notas, "📝 Notas");
        const inNotas = secNotas.createEl("textarea", { cls: "agenda-input-nota", attr: { placeholder: "Recordatorios, contexto, detalles..." } });
        if (esEdicion) inNotas.value = this.datos.notas || "";

        const secHistorial = this._seccion(sections.notas, "📜 Historial de cambios");
        const contHistorial = secHistorial.createEl("div");
        this._renderHistorial(contHistorial, esEdicion ? this.datos.id : null);

        const acciones = root.createEl("div", { cls: "agenda-form-acciones" });
        acciones.createEl("button", { text: "Cancelar" }).onclick = () => this.close();
        acciones.createEl("button", {
            text: "💾 Guardar",
            style: "background: var(--interactive-accent); color: var(--text-on-accent); border: none; padding: 10px 22px; border-radius: 8px; font-weight: bold; cursor: pointer;"
        }).onclick = async () => {
            try {
                AgendaDB.upsertPersona(this.db, this.dbPath, {
                    id: esEdicion ? this.datos.id : "",
                    nombre: inNombre.value.trim(),
                    alias: this.listas.alias,
                    grupos: this.listas.grupos,
                    foto: this.fotoRuta,
                    fecha_nacimiento: inFecha.value,
                    hora_nacimiento: chkHoraDesc.checked ? "" : inHora.value,
                    hora_nacimiento_desconocida: chkHoraDesc.checked ? 1 : 0,
                    latitud: inLat.value,
                    longitud: inLon.value,
                    estado_nacimiento: inEstado.value.trim(),
                    pais_nacimiento: inPais.value.trim(),
                    zona_horaria: inZh.value.trim() || "America/Mexico_City",
                    ciudad: inCiudad.value.trim(),
                    contacto: { telefono: inTel.value.trim(), email: inEmail.value.trim() },
                    redes: {
                        instagram: redesInputs.instagram.value.trim(),
                        twitter: redesInputs.twitter.value.trim(),
                        facebook: redesInputs.facebook.value.trim()
                    },
                    mbti: selMbti.value,
                    eneagrama: selEnea.value,
                    color_favorito: inColor.value.trim(),
                    puntos_destacables: this.listas.puntos_destacables,
                    iq_min: parseInt(inIqMin.value, 10) || 0,
                    iq_max: parseInt(inIqMax.value, 10) || 0,
                    inteligencias: this.inteligencias,
                    moralidad: inMoralidad.value.trim(),
                    etica: inEtica.value.trim(),
                    potencial: inPotencial.value.trim(),
                    habitos: this.listas.habitos,
                    debilidades: this.listas.debilidades,
                    gustos: this.listas.gustos,
                    disgustos: this.listas.disgustos,
                    relaciones: this.listas.relaciones,
                    actividad_social: {
                        tipo: selTipoAct.value,
                        valor: Math.max(0, parseInt(inValorAct.value, 10) || 0)
                    },
                    notas: inNotas.value.trim()
                });
                new Notice(esEdicion ? "✅ Persona actualizada" : "✅ Persona registrada");
                this.onSaved();
                this.close();
            } catch (err) {
                new Notice("❌ " + err.message);
            }
        };
    }

    onClose() { this.contentEl.empty(); }
}

class ActividadFormModal extends Modal {
    constructor(app, db, dbPath, ctx, onSaved) {
        super(app);
        this.db = db;
        this.dbPath = dbPath;
        this.ctx = ctx || {};
        this.datos = ctx.datosEdicion || null;
        this.onSaved = onSaved;
        this.estado = AgendaDB.cargarEstado(db, ctx.syncOpts || {});
        this.listas = {
            persona_ids: [...(this.datos?.persona_ids || ctx.personaIds || [])],
            grupos: [...(this.datos?.grupos || [])]
        };
    }

    onOpen() {
        injectFormStyles();
        const { contentEl } = this;
        const esEdicion = !!this.datos;
        const tipoInicial = this.ctx.tipoInicial || this.datos?.tipo || "evento";
        let tipoSel = esEdicion ? this.datos.tipo : tipoInicial;
        let iconoSel = esEdicion ? this.datos.icono : "📅";
        let estadoSel = esEdicion ? this.datos.estado : "pendiente";

        const layout = contentEl.createEl("div", { cls: "agenda-form-layout agenda-form-styled agenda-act-form" });

        const hero = layout.createEl("div", { cls: "agenda-act-hero" });
        const heroIcon = hero.createEl("div", { cls: "agenda-act-hero-icono", text: iconoSel });
        const heroTxt = hero.createEl("div", { cls: "agenda-act-hero-texto" });
        heroTxt.createEl("h2", { text: esEdicion ? "Editar actividad" : "Nueva actividad" });
        heroTxt.createEl("p", { text: "Programa un evento o una tarea vinculada al calendario y contactos." });

        const colIzq = layout.createEl("div", { cls: "agenda-form-col" });
        const colDer = layout.createEl("div", { cls: "agenda-form-col" });
        const colFull = layout.createEl("div", { cls: "agenda-form-col agenda-form-col-full" });

        const secTipo = this._seccionAct(colIzq, "Tipo de actividad");
        const tipoToggle = secTipo.createEl("div", { cls: "agenda-act-tipo-toggle" });
        const btnsTipo = {};
        const marcarTipo = () => {
            Object.entries(btnsTipo).forEach(([v, btn]) => {
                btn.classList.toggle("agenda-act-tipo-btn--activo", v === tipoSel);
                btn.setAttr("aria-pressed", v === tipoSel ? "true" : "false");
            });
        };
        [
            { v: "evento", t: "📅 Evento", d: "Solo calendario de la agenda" },
            { v: "tarea", t: "📝 Tarea", d: "Calendario + Organizador" }
        ].forEach(op => {
            const btn = tipoToggle.createEl("button", {
                type: "button",
                cls: "agenda-act-tipo-btn",
                attr: { "aria-pressed": "false" }
            });
            btn.createEl("span", { text: op.t });
            btn.createEl("small", { text: op.d });
            btnsTipo[op.v] = btn;
            btn.onclick = (e) => {
                e.preventDefault();
                tipoSel = op.v;
                marcarTipo();
            };
        });
        marcarTipo();

        const secDatos = this._seccionAct(colIzq, "Detalles");
        const inTitulo = secDatos.createEl("input", {
            type: "text",
            cls: "agenda-act-input-titulo",
            attr: { placeholder: "Título de la actividad *" }
        });
        inTitulo.style.cssText = "width:100%;min-height:44px;padding:12px 14px;border-radius:8px;border:1px solid var(--background-modifier-border);background:var(--background-primary);box-sizing:border-box;font-size:1em;font-weight:600;margin-bottom:14px;";
        if (esEdicion) inTitulo.value = this.datos.titulo;

        const fechas = secDatos.createEl("div", { cls: "agenda-act-fechas" });
        const wrapIni = fechas.createEl("div", { cls: "agenda-campo" });
        wrapIni.createEl("label", { text: "Fecha inicio *" });
        const inFecha = wrapIni.createEl("input", { type: "date" });
        inFecha.value = esEdicion ? this.datos.fecha : (this.ctx.fecha || new Date().toISOString().slice(0, 10));
        const wrapFin = fechas.createEl("div", { cls: "agenda-campo" });
        wrapFin.createEl("label", { text: "Fecha fin" });
        const inFechaFin = wrapFin.createEl("input", { type: "date" });
        if (esEdicion && this.datos.fecha_fin) inFechaFin.value = this.datos.fecha_fin;

        const secIcono = this._seccionAct(colDer, "Icono en calendario");
        const iconGrid = secIcono.createEl("div", { cls: "agenda-icono-grid" });
        const pintarIconos = () => {
            iconGrid.empty();
            AgendaCalendario.ICONOS.forEach(ic => {
                const btn = iconGrid.createEl("button", {
                    type: "button",
                    cls: `agenda-icono-btn${ic === iconoSel ? " agenda-icono-btn--activo" : ""}`,
                    text: ic
                });
                btn.onclick = (e) => {
                    e.preventDefault();
                    iconoSel = ic;
                    heroIcon.setText(ic);
                    pintarIconos();
                };
            });
        };
        pintarIconos();

        const secEstado = this._seccionAct(colDer, "Estado");
        const estadoPills = secEstado.createEl("div", { cls: "agenda-estado-pills" });
        const pillsEstado = {};
        const marcarEstado = () => {
            Object.entries(pillsEstado).forEach(([v, pill]) => {
                pill.classList.toggle("agenda-estado-pill--activo", v === estadoSel);
            });
        };
        AgendaCalendario.ESTADOS.forEach(e => {
            const pill = estadoPills.createEl("button", {
                type: "button",
                cls: "agenda-estado-pill",
                text: e.replace("_", " ")
            });
            pillsEstado[e] = pill;
            pill.onclick = (ev) => {
                ev.preventDefault();
                estadoSel = e;
                marcarEstado();
            };
        });
        marcarEstado();

        const secVinculos = this._seccionAct(colFull, "👥 Vinculación");
        this._campoListaAct(secVinculos, "Personas", "persona_ids",
            this.estado.personas.map(p => p.nombre), id => AgendaDB.nombreDe(this.estado.personas, id));
        this._campoListaAct(secVinculos, "Grupos", "grupos", this.estado.vocabulario.grupos || []);

        const secNotas = this._seccionAct(colFull, "📝 Notas");
        const inNotas = secNotas.createEl("textarea", {
            cls: "agenda-input-nota",
            attr: { placeholder: "Contexto, lugar, recordatorios..." }
        });
        if (esEdicion) inNotas.value = this.datos.notas || "";

        const acciones = contentEl.createEl("div", { cls: "agenda-form-acciones" });
        if (esEdicion) {
            acciones.createEl("button", { text: "🗑️ Eliminar" }).onclick = () => {
                new AgendaConfirmModal(this.app, "¿Eliminar esta actividad?", () => {
                    AgendaDB.eliminarActividad(this.db, this.dbPath, this.datos.id, this.ctx.syncOpts || {});
                    new Notice("Eliminada");
                    this.onSaved();
                    this.close();
                }).open();
            };
        }
        acciones.createEl("button", { text: "Cancelar" }).onclick = () => this.close();
        acciones.createEl("button", {
            text: "💾 Guardar",
            style: "background: var(--interactive-accent); color: var(--text-on-accent); border: none; padding: 10px 22px; border-radius: 8px; font-weight: bold; cursor: pointer;"
        }).onclick = () => {
            try {
                const guardada = AgendaDB.upsertActividad(this.db, this.dbPath, {
                    id: esEdicion ? this.datos.id : "",
                    titulo: inTitulo.value.trim(),
                    tipo: tipoSel,
                    icono: iconoSel,
                    fecha: inFecha.value,
                    fecha_fin: inFechaFin.value,
                    estado: estadoSel,
                    notas: inNotas.value.trim(),
                    persona_ids: this.listas.persona_ids,
                    grupos: this.listas.grupos,
                    creado_en: esEdicion ? this.datos.creado_en : "",
                    tarea_kanban_id: esEdicion ? this.datos.tarea_kanban_id : 0
                }, { personas: this.estado.personas, ...(this.ctx.syncOpts || {}) });
                if (guardada.tipo === "tarea") {
                    const proyecto = AgendaCalendario.resolverProyecto(guardada, this.estado.personas);
                    new Notice(`✅ Tarea en Organizador · proyecto «${proyecto}»`);
                } else {
                    new Notice("✅ Evento guardado");
                }
                this.onSaved();
                this.close();
            } catch (err) {
                new Notice("❌ " + err.message);
            }
        };
    }

    _seccionAct(parent, titulo) {
        const sec = parent.createEl("div", { cls: "agenda-form-seccion" });
        sec.createEl("h3", { text: titulo, cls: "agenda-form-seccion-titulo" });
        return sec;
    }

    _campoAct(parent, label, crear) {
        const wrap = parent.createEl("div", { cls: "agenda-campo" });
        wrap.createEl("label", { text: label });
        const el = crear(wrap);
        return { wrap, input: el || wrap.querySelector("input, select, textarea") };
    }

    _campoListaAct(parent, label, key, sugerencias, resolver = null) {
        const wrap = parent.createEl("div", { cls: "agenda-campo" });
        wrap.createEl("label", { text: label });
        const chips = wrap.createEl("div", { cls: "agenda-chips-row" });
        const fila = wrap.createEl("div", { cls: "agenda-fila-input" });
        const inp = fila.createEl("input", { type: "text" });

        const render = () => {
            chips.empty();
            if (!this.listas[key].length) {
                chips.createEl("span", { text: "Vacío", style: "color: var(--text-muted); font-style: italic; font-size: 0.88em;" });
                return;
            }
            this.listas[key].forEach((item, i) => {
                const chip = chips.createEl("span", { cls: "agenda-chip" });
                chip.createEl("span", { text: resolver ? resolver(item) : item });
                chip.createEl("button", { text: "✕", cls: "agenda-chip-quitar" }).onclick = (e) => {
                    e.preventDefault();
                    this.listas[key].splice(i, 1);
                    render();
                };
            });
        };

        const agregar = (v) => {
            const val = String(v || "").trim();
            if (!val || this.listas[key].includes(val)) return;
            this.listas[key].push(val);
            inp.value = "";
            render();
        };

        inp.onkeydown = (e) => { if (e.key === "Enter") { e.preventDefault(); agregar(inp.value); } };
        if (key === "persona_ids") {
            fila.createEl("button", { text: "👤 Elegir" }).onclick = (e) => {
                e.preventDefault();
                new AgendaPersonaSuggestModal(this.app, this.estado.personas.map(p => ({ id: p.id, nombre: p.nombre })),
                    () => new Set(this.listas.persona_ids),
                    (p) => { if (!this.listas.persona_ids.includes(p.id)) this.listas.persona_ids.push(p.id); render(); },
                    { multi: true }).open();
            };
        } else {
            fila.createEl("button", { text: "📋" }).onclick = (e) => {
                e.preventDefault();
                new AgendaListaSuggestModal(this.app, sugerencias, agregar, {
                    multi: true, getExcluidos: () => new Set(this.listas[key])
                }).open();
            };
        }
        render();
    }

    onClose() { this.contentEl.empty(); }
}

export const AgendaModals = {
    injectFormStyles,
    PersonaFormModal,
    ActividadFormModal,
    AgendaConfirmModal,
    AgendaListaSuggestModal,
    AgendaPersonaSuggestModal,
    AgendaImagenSuggestModal,
    AgendaRangosIqModal
};
