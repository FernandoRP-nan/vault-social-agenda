/* agenda_perfil.ts — migrado a módulo TS */
// @ts-nocheck
import { AgendaAstral } from "./agenda_astral";

/* agenda_perfil.js - MBTI, eneagrama y cálculos astrológicos/tarot */

export const AgendaPerfil = {
    MBTI_OPCIONES: [
        "", "INTJ", "INTP", "ENTJ", "ENTP",
        "INFJ", "INFP", "ENFJ", "ENFP",
        "ISTJ", "ISFJ", "ESTJ", "ESFJ",
        "ISTP", "ISFP", "ESTP", "ESFP"
    ],

    ENEAGRAMA_OPCIONES: [
        { v: "", l: "— Sin definir —" },
        { v: "1", l: "Tipo 1 — El Reformador" },
        { v: "2", l: "Tipo 2 — El Ayudador" },
        { v: "3", l: "Tipo 3 — El Triunfador" },
        { v: "4", l: "Tipo 4 — El Individualista" },
        { v: "5", l: "Tipo 5 — El Investigador" },
        { v: "6", l: "Tipo 6 — El Leal" },
        { v: "7", l: "Tipo 7 — El Entusiasta" },
        { v: "8", l: "Tipo 8 — El Desafiador" },
        { v: "9", l: "Tipo 9 — El Pacifista" },
        { v: "1w9", l: "1w9 — Reformador · ala Pacifista" },
        { v: "1w2", l: "1w2 — Reformador · ala Ayudador" },
        { v: "2w1", l: "2w1 — Ayudador · ala Reformador" },
        { v: "2w3", l: "2w3 — Ayudador · ala Triunfador" },
        { v: "3w2", l: "3w2 — Triunfador · ala Ayudador" },
        { v: "3w4", l: "3w4 — Triunfador · ala Individualista" },
        { v: "4w3", l: "4w3 — Individualista · ala Triunfador" },
        { v: "4w5", l: "4w5 — Individualista · ala Investigador" },
        { v: "5w4", l: "5w4 — Investigador · ala Individualista" },
        { v: "5w6", l: "5w6 — Investigador · ala Leal" },
        { v: "6w5", l: "6w5 — Leal · ala Investigador" },
        { v: "6w7", l: "6w7 — Leal · ala Entusiasta" },
        { v: "7w6", l: "7w6 — Entusiasta · ala Leal" },
        { v: "7w8", l: "7w8 — Entusiasta · ala Desafiador" },
        { v: "8w7", l: "8w7 — Desafiador · ala Entusiasta" },
        { v: "8w9", l: "8w9 — Desafiador · ala Pacifista" },
        { v: "9w8", l: "9w8 — Pacifista · ala Desafiador" },
        { v: "9w1", l: "9w1 — Pacifista · ala Reformador" }
    ],

    _ARCANOS_MAYORES: [
        "", "El Mago", "La Sacerdotisa", "La Emperatriz", "El Emperador",
        "El Hierofante", "Los Enamorados", "El Carro", "La Fuerza",
        "El Ermitaño", "La Rueda de la Fortuna", "La Justicia", "El Colgado",
        "La Muerte", "La Templanza", "El Diablo", "La Torre",
        "La Estrella", "La Luna", "El Sol", "El Juicio", "El Mundo"
    ],

    calcularSignoZodiacal: (fechaNac) => {
        if (!fechaNac) return "";
        const partes = fechaNac.split("-").map(Number);
        if (partes.length < 3 || partes.some(n => isNaN(n))) return "";
        const [, mes, dia] = partes;
        const cortes = [
            ["Capricornio", 1, 19], ["Acuario", 2, 18], ["Piscis", 3, 20],
            ["Aries", 4, 19], ["Tauro", 5, 20], ["Géminis", 6, 20],
            ["Cáncer", 7, 22], ["Leo", 8, 22], ["Virgo", 9, 22],
            ["Libra", 10, 22], ["Escorpio", 11, 21], ["Sagitario", 12, 21],
            ["Capricornio", 12, 31]
        ];
        for (const [signo, m, d] of cortes) {
            if (mes < m || (mes === m && dia <= d)) return signo;
        }
        return "Capricornio";
    },

    calcularCartaTarot: (fechaNac) => {
        if (!fechaNac) return "";
        const digitos = fechaNac.replace(/\D/g, "").split("").map(Number);
        if (!digitos.length) return "";
        let suma = digitos.reduce((a, b) => a + b, 0);
        while (suma > 22) {
            suma = String(suma).split("").map(Number).reduce((a, b) => a + b, 0);
        }
        if (suma === 0 || suma === 22) return "0 — El Loco";
        const nombre = AgendaPerfil._ARCANOS_MAYORES[suma];
        const romanos = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
            "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
        return `${romanos[suma]} — ${nombre}`;
    },

    calcularDiasParaCumpleanos: (fechaNac) => {
        if (!fechaNac) return "";
        const partes = fechaNac.split("-").map(Number);
        if (partes.length < 3 || partes.some(n => isNaN(n))) return "";
        const [, mes, dia] = partes;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        let proximo = new Date(hoy.getFullYear(), mes - 1, dia);
        if (proximo < hoy) proximo = new Date(hoy.getFullYear() + 1, mes - 1, dia);
        const diff = Math.round((proximo - hoy) / 86400000);
        if (diff === 0) return "¡Es hoy! 🎂";
        return `Faltan ${diff} día${diff !== 1 ? "s" : ""}`;
    },

    validarHoraNacimiento: (hora) => {
        if (!hora) return "";
        const m = String(hora).trim().match(/^(\d{1,2}):(\d{2})$/);
        if (!m) return "";
        const h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        if (h < 0 || h > 23 || min < 0 || min > 59) return "";
        return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
    },

    validarLatitud: (valor) => {
        const n = parseFloat(valor);
        if (isNaN(n) || n < -90 || n > 90) return null;
        return Math.round(n * 10000) / 10000;
    },

    validarLongitud: (valor) => {
        const n = parseFloat(valor);
        if (isNaN(n) || n < -180 || n > 180) return null;
        return Math.round(n * 10000) / 10000;
    },

    formatearCoordenadas: (lat, lon) => {
        const la = AgendaPerfil.validarLatitud(lat);
        const lo = AgendaPerfil.validarLongitud(lon);
        if (la == null || lo == null) return "";
        return `${la}°, ${lo}°`;
    },

    _geoCache: new Map(),

    _cargarJsonUrl: async (url, app) => {
        if (app?.requestUrl) {
            const resp = await app.requestUrl({ url, method: "GET" });
            return resp.json;
        }
        if (typeof fetch !== "undefined") {
            const resp = await fetch(url);
            return await resp.json();
        }
        const https = require("https");
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = "";
                res.on("data", (chunk) => { data += chunk; });
                res.on("end", () => {
                    try { resolve(JSON.parse(data)); }
                    catch (err) { reject(err); }
                });
            }).on("error", reject);
        });
    },

    _coincideTexto: (a, b) => {
        if (!a || !b) return false;
        const norm = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        const na = norm(a);
        const nb = norm(b);
        return na === nb || na.includes(nb) || nb.includes(na);
    },

    _coincidePais: (a, b) => AgendaPerfil._coincideTexto(a, b),

    formatearLugarNacimiento: (persona) =>
        [persona?.ciudad, persona?.estado_nacimiento, persona?.pais_nacimiento].filter(Boolean).join(", "),

    _consultasGeocodificacion: (ciudad, estado, pais) => {
        const c = String(ciudad || "").trim();
        const e = String(estado || "").trim();
        const p = String(pais || "").trim();
        const out = [];
        if (c && e && p) out.push(`${c}, ${e}, ${p}`);
        if (c && e) out.push(`${c}, ${e}`);
        if (c && p) out.push(`${c}, ${p}`);
        if (c) out.push(c);
        return [...new Set(out)];
    },

    _elegirMejorGeo: (results, ciudad, estado, pais) => {
        if (!results?.length) return null;
        const puntaje = (r) => {
            let s = 0;
            if (AgendaPerfil._coincideTexto(r.name, ciudad)) s += 12;
            if (estado && AgendaPerfil._coincideTexto(r.admin1, estado)) s += 10;
            if (pais && AgendaPerfil._coincideTexto(r.country, pais)) s += 8;
            if (r.population) s += Math.min(4, Math.log10(r.population + 1));
            return s;
        };
        const ordenados = [...results].sort((a, b) => puntaje(b) - puntaje(a));
        return ordenados[0];
    },

    // Geocodifica ciudad + estado/provincia + país vía Open-Meteo
    geocodificarLugar: async (ciudad, pais = "", estado = "", app = null) => {
        const city = String(ciudad || "").trim();
        if (!city) return null;

        const paisTxt = String(pais || "").trim();
        const estadoTxt = String(estado || "").trim();
        const consultas = AgendaPerfil._consultasGeocodificacion(city, estadoTxt, paisTxt);

        for (const query of consultas) {
            const cacheKey = query.toLowerCase();
            if (AgendaPerfil._geoCache.has(cacheKey)) {
                const cached = AgendaPerfil._geoCache.get(cacheKey);
                if (cached) return cached;
            }

            const url = "https://geocoding-api.open-meteo.com/v1/search"
                + `?name=${encodeURIComponent(query)}&count=12&language=es&format=json`;

            try {
                const json = await AgendaPerfil._cargarJsonUrl(url, app);
                const results = json?.results || [];
                const best = AgendaPerfil._elegirMejorGeo(results, city, estadoTxt, paisTxt);
                if (!best) continue;

                const out = {
                    latitud: AgendaPerfil.validarLatitud(best.latitude),
                    longitud: AgendaPerfil.validarLongitud(best.longitude),
                    zona_horaria: best.timezone || "",
                    pais_nacimiento: best.country || "",
                    estado_nacimiento: best.admin1 || "",
                    nombre: best.name || city,
                    region: best.admin1 || ""
                };
                AgendaPerfil._geoCache.set(cacheKey, out);
                return out;
            } catch (err) {
                console.error("Geocodificación:", err);
            }
        }
        return null;
    },

    etiquetaLugarGeocodificado: (geo) => {
        if (!geo) return "";
        return [geo.nombre, geo.estado_nacimiento || geo.region, geo.pais_nacimiento].filter(Boolean).join(", ");
    },

    evaluarCartaAstral: (persona) => {
        const faltantes = [];
        if (!persona?.fecha_nacimiento) faltantes.push("fecha de nacimiento");
        const horaDesconocida = !!persona?.hora_nacimiento_desconocida;
        if (!horaDesconocida && !AgendaPerfil.validarHoraNacimiento(persona?.hora_nacimiento)) {
            faltantes.push("hora de nacimiento");
        }
        if (AgendaPerfil.validarLatitud(persona?.latitud) == null) faltantes.push("latitud");
        if (AgendaPerfil.validarLongitud(persona?.longitud) == null) faltantes.push("longitud");
        if (!(persona?.zona_horaria || "").trim()) faltantes.push("zona horaria");
        return {
            listo: faltantes.length === 0,
            faltantes,
            horaExacta: !horaDesconocida
        };
    },

    obtenerDatosNatal: (persona) => {
        const evalCarta = AgendaPerfil.evaluarCartaAstral(persona);
        if (!evalCarta.listo) return null;
        return {
            fecha: persona.fecha_nacimiento,
            hora: evalCarta.horaExacta
                ? AgendaPerfil.validarHoraNacimiento(persona.hora_nacimiento)
                : null,
            horaDesconocida: !evalCarta.horaExacta,
            latitud: AgendaPerfil.validarLatitud(persona.latitud),
            longitud: AgendaPerfil.validarLongitud(persona.longitud),
            zonaHoraria: (persona.zona_horaria || "").trim(),
            lugar: AgendaPerfil.formatearLugarNacimiento(persona)
        };
    },

    enriquecer: (persona) => {
        const signo = AgendaPerfil.calcularSignoZodiacal(persona.fecha_nacimiento);
        const tarot = AgendaPerfil.calcularCartaTarot(persona.fecha_nacimiento);
        const cumple = AgendaPerfil.calcularDiasParaCumpleanos(persona.fecha_nacimiento);
        const cartaAstral = AgendaPerfil.evaluarCartaAstral(persona);
        const cartaNatal = cartaAstral.listo && AgendaAstral
            ? AgendaAstral.calcularCartaNatal(persona)
            : null;
        return { ...persona, signo_zodiacal: signo, carta_tarot: tarot, dias_para_cumple: cumple, carta_astral: cartaAstral, carta_natal: cartaNatal };
    },

    etiquetaTarotCorta: (carta) => {
        if (!carta) return "";
        return carta.split("—")[0].trim() || carta;
    },

    // Etiqueta completa para filtros y agrupación: número + nombre
    etiquetaTarotFiltro: (carta) => {
        if (!carta) return "";
        return carta.trim();
    },

    // Orden de arcanos para listas (0 = El Loco, luego I…XXI)
    ordenTarot: (carta) => {
        if (!carta) return 99;
        if (carta.startsWith("0")) return 0;
        for (let i = 1; i < AgendaPerfil._ARCANOS_MAYORES.length; i++) {
            const nombre = AgendaPerfil._ARCANOS_MAYORES[i];
            if (nombre && carta.includes(nombre)) return i;
        }
        return 99;
    },

    etiquetaEneagrama: (valor) => {
        if (!valor) return "";
        const op = AgendaPerfil.ENEAGRAMA_OPCIONES.find(o => o.v === valor);
        return op ? op.l : valor;
    },

    SIGNOS_ZODIACO: [
        "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
        "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"
    ],

    COLOR_DEFECTO: "#6366f1",
    PALETA_DEFECTO: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"],

    validarColorHex: (color) => {
        const c = (color || "").trim();
        return /^#[0-9A-Fa-f]{6}$/.test(c) ? c.toLowerCase() : "";
    },

    _colorPorNombre: (nombre) => {
        const paleta = AgendaPerfil.PALETA_DEFECTO;
        let hash = 0;
        for (let i = 0; i < (nombre || "").length; i++) {
            hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
        }
        return paleta[Math.abs(hash) % paleta.length];
    },

    resolverColorPersona: (persona) => {
        const favorito = AgendaPerfil.validarColorHex(persona?.color_favorito);
        if (favorito) return favorito;
        return AgendaPerfil._colorPorNombre(persona?.nombre || "?");
    },

    ajustarColor: (hex, factor) => {
        const h = AgendaPerfil.validarColorHex(hex) || AgendaPerfil.COLOR_DEFECTO;
        const n = parseInt(h.slice(1), 16);
        const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
        const mix = (c) => Math.max(0, Math.min(255, Math.round(c * factor)));
        return `#${[mix(r), mix(g), mix(b)].map(x => x.toString(16).padStart(2, "0")).join("")}`;
    },

    colorTextoContraste: (hex) => {
        const h = AgendaPerfil.validarColorHex(hex) || AgendaPerfil.COLOR_DEFECTO;
        const n = parseInt(h.slice(1), 16);
        const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return lum > 0.55 ? "#1e293b" : "#ffffff";
    },

    PUNTOS_SUGERIDOS: [
        "creatividad", "memoria", "empatía", "liderazgo", "humor", "paciencia",
        "organización", "adaptabilidad", "intuición", "comunicación", "análisis", "resiliencia"
    ],

    TIPOS_INTELIGENCIA: [
        { id: "linguistica", l: "Lingüística-verbal" },
        { id: "logica", l: "Lógico-matemática" },
        { id: "espacial", l: "Espacial-visual" },
        { id: "corporal", l: "Corporal-kinestésica" },
        { id: "musical", l: "Musical" },
        { id: "interpersonal", l: "Interpersonal" },
        { id: "intrapersonal", l: "Intrapersonal" },
        { id: "naturalista", l: "Naturalista" }
    ],

    NIVELES_INTELIGENCIA: [
        { v: "", l: "— Sin definir —" },
        { v: "F", l: "F — Muy bajo" },
        { v: "D", l: "D — Bajo" },
        { v: "C", l: "C — Medio-bajo" },
        { v: "B", l: "B — Medio" },
        { v: "A", l: "A — Alto" },
        { v: "S", l: "S — Sobresaliente" }
    ],

    RANGOS_IQ_DEFECTO: [
        { min: 55, max: 69, etiqueta: "Deficiencia leve" },
        { min: 70, max: 84, etiqueta: "Bajo promedio" },
        { min: 85, max: 100, etiqueta: "Promedio" },
        { min: 101, max: 114, etiqueta: "Superior al promedio" },
        { min: 115, max: 130, etiqueta: "Superior / muy superior" },
        { min: 131, max: 145, etiqueta: "Muy superior / talento" },
        { min: 146, max: 160, etiqueta: "Excepcional" }
    ],

    normalizarLista: (val) => {
        if (!val) return [];
        if (Array.isArray(val)) {
            return [...new Set(val.map(x => String(x).trim()).filter(Boolean))];
        }
        return [];
    },

    normalizarInteligencias: (val) => {
        const out = {};
        AgendaPerfil.TIPOS_INTELIGENCIA.forEach(t => { out[t.id] = ""; });
        if (!val || typeof val !== "object") return out;
        Object.entries(val).forEach(([k, v]) => {
            const nivel = String(v || "").trim().toUpperCase();
            if (AgendaPerfil.NIVELES_INTELIGENCIA.some(n => n.v === nivel)) {
                out[k] = nivel;
            }
        });
        return out;
    },

    serializarInteligencias: (val) => {
        const n = AgendaPerfil.normalizarInteligencias(val);
        return AgendaPerfil.TIPOS_INTELIGENCIA
            .filter(t => n[t.id])
            .map(t => `${t.l}: ${n[t.id]}`)
            .join(" · ") || "(vacío)";
    },

    formatearIq: (min, max) => {
        const a = parseInt(min, 10) || 0;
        const b = parseInt(max, 10) || 0;
        if (a <= 0 && b <= 0) return "";
        if (a > 0 && b > 0) return `${Math.min(a, b)}–${Math.max(a, b)}`;
        return String(a > 0 ? a : b);
    },

    etiquetaRangoIq: (min, max, rangos) => {
        const a = parseInt(min, 10) || 0;
        const b = parseInt(max, 10) || 0;
        if (a <= 0 && b <= 0) return "";
        const centro = a > 0 && b > 0 ? Math.round((a + b) / 2) : (a || b);
        const lista = rangos?.length ? rangos : AgendaPerfil.RANGOS_IQ_DEFECTO;
        const match = lista.find(r => centro >= r.min && centro <= r.max);
        return match ? match.etiqueta : "";
    },

    normalizarRangosIq: (val) => {
        const base = AgendaPerfil.RANGOS_IQ_DEFECTO.map(r => ({ ...r }));
        if (!Array.isArray(val)) return base;
        const limpios = val.map(r => ({
            min: Math.max(0, parseInt(r?.min, 10) || 0),
            max: Math.max(0, parseInt(r?.max, 10) || 0),
            etiqueta: String(r?.etiqueta || "").trim()
        })).filter(r => r.min > 0 && r.max >= r.min && r.etiqueta);
        return limpios.length ? limpios.sort((a, b) => a.min - b.min) : base;
    }
};
