/* agenda_astral.ts — migrado a módulo TS */
// @ts-nocheck
import { AgendaPerfil } from "./agenda_perfil";

/* agenda_astral.js - Cálculo y visualización de carta natal */

export const AgendaAstral = {
    SIGNOS: [
        { n: "Aries", s: "♈" }, { n: "Tauro", s: "♉" }, { n: "Géminis", s: "♊" },
        { n: "Cáncer", s: "♋" }, { n: "Leo", s: "♌" }, { n: "Virgo", s: "♍" },
        { n: "Libra", s: "♎" }, { n: "Escorpio", s: "♏" }, { n: "Sagitario", s: "♐" },
        { n: "Capricornio", s: "♑" }, { n: "Acuario", s: "♒" }, { n: "Piscis", s: "♓" }
    ],

    // Qué aporta cada signo cuando un planeta cae ahí
    SIGNO_DESC: {
        Aries: "actúas con rapidez, franqueza e independencia; te impulsa iniciar y tomar la delantera",
        Tauro: "buscas estabilidad, placer concreto y constancia; avanzas despacio pero con mucha determinación",
        Géminis: "piensas en movimiento, con curiosidad y adaptabilidad; necesitas variedad, diálogo e intercambio",
        Cáncer: "te guías por la sensibilidad, la memoria y el cuidado; proteges lo que amas y valoras la intimidad",
        Leo: "expresas calidez, orgullo y creatividad; necesitas sentirte visto y ser fiel a lo que te representa",
        Virgo: "analizas, ordenas y mejoras lo cotidiano; te importa ser útil, preciso y eficiente",
        Libra: "buscas equilibrio, armonía y vínculos justos; piensas en el otro y en la estética de las relaciones",
        Escorpio: "profundizas, investigas y te implicas intensamente; no te quedas en la superficie de las cosas",
        Sagitario: "aspiras a sentido, libertad y horizonte amplio; aprendes viajando, enseñando o cuestionando creencias",
        Capricornio: "construyes con disciplina, paciencia y sentido de responsabilidad; piensas a largo plazo",
        Acuario: "valoras la autenticidad, lo colectivo y lo diferente; necesitas espacio para pensar fuera de lo convencional",
        Piscis: "percibes matices emocionales y simbólicos; eres empático, imaginativo y sensible al ambiente"
    },

    CUERPOS: [
        { id: "sol", l: "Sol", sim: "☉", rol: "Quién eres cuando estás consciente de ti mismo", area: "identidad, vitalidad y propósito" },
        { id: "luna", l: "Luna", sim: "☽", rol: "Cómo reaccionas emocionalmente y qué te hace sentir seguro", area: "emociones, hábitos y necesidades íntimas" },
        { id: "mercurio", l: "Mercurio", sim: "☿", rol: "Cómo piensas, hablas y procesas información", area: "estudio, conversación y decisiones cotidianas" },
        { id: "venus", l: "Venus", sim: "♀", rol: "Qué te atrae, cómo amas y qué disfrutas", area: "afecto, gusto estético y acuerdos" },
        { id: "marte", l: "Marte", sim: "♂", rol: "Cómo actúas cuando quieres algo o te enfrentas a un reto", area: "impulso, coraje, deseo y conflicto" },
        { id: "jupiter", l: "Júpiter", sim: "♃", rol: "Dónde confías, te expandes y encuentras oportunidades", area: "crecimiento, optimismo y sentido de abundancia" },
        { id: "saturno", l: "Saturno", sim: "♄", rol: "Dónde te exiges, maduras y aprendes con esfuerzo", area: "límites, responsabilidad y lecciones de vida" }
    ],

    INTRO_CARTA: "La carta natal es una foto del cielo al nacer. No te encasilla: describe tendencias. El signo indica el estilo con el que vives esa energía; la casa indica en qué área de la vida se nota con más fuerza.",

    LEER_CARTA: "Ejemplo: «Sol en Leo en Casa V» = te expresas con calidez y creatividad (Leo), sobre todo en el ocio, el romance y los proyectos personales (Casa V).",

    NOTA_CARTA_SOLAR: "Sin hora exacta calculamos las posiciones del día (carta solar). Puedes leer signos planetarios, pero faltan Ascendente, Medio Cielo y casas.",

    NOTA_CASAS: "Cada casa es un escenario de la vida. Si un planeta está en una casa, esa energía se vive con más frecuencia en ese tema concreto.",

    ANGULOS: {
        ascendente: {
            t: "Ascendente (ASC)",
            rol: "La actitud con la que llegas al mundo y la primera impresión que das"
        },
        mediocielo: {
            t: "Medio Cielo (MC)",
            rol: "Tu vocación visible, metas profesionales y la huella pública que construyes"
        }
    },

    CASAS: {
        1: { t: "Casa I · Identidad", d: "Cuerpo, actitud personal y forma de iniciar.", practica: "ahí se nota cómo te presentas, tu estilo y tu manera de arrancar proyectos" },
        2: { t: "Casa II · Recursos", d: "Dinero, posesiones y autoestima material.", practica: "influye en ingresos, gastos, talentos rentables y en lo que consideras valioso" },
        3: { t: "Casa III · Entorno cercano", d: "Comunicación diaria, estudios básicos y vecindario.", practica: "marca tu forma de hablar, aprender cosas prácticas y relacionarte con hermanos o vecinos" },
        4: { t: "Casa IV · Raíces", d: "Hogar, familia y vida privada.", practica: "habla de tu base emocional, la relación con tus raíces y el refugio que necesitas" },
        5: { t: "Casa V · Creatividad", d: "Placer, romance, hijos y expresión lúdica.", practica: "se activa en citas, hobbies, arte, juego y en lo que haces por puro disfrute" },
        6: { t: "Casa VI · Rutina", d: "Trabajo cotidiano, salud y hábitos.", practica: "afecta empleo diario, organización, cuidado del cuerpo y servicio a otros" },
        7: { t: "Casa VII · Relaciones", d: "Pareja, socios y acuerdos uno a uno.", practica: "describe qué buscas en el otro, cómo negocias y el tipo de vínculo que repites" },
        8: { t: "Casa VIII · Profundidad", d: "Intimidad, crisis, herencias y transformación.", practica: "aparece en vínculos intensos, finales, cambios profundos y recursos compartidos" },
        9: { t: "Casa IX · Horizonte", d: "Viajes lejanos, filosofía y estudios superiores.", practica: "influye en creencias, idiomas, docencia y búsqueda de sentido amplio" },
        10: { t: "Casa X · Carrera", d: "Profesión, reputación y metas públicas.", practica: "señala tu camino laboral visible, logros sociales y lo que quieres construir" },
        11: { t: "Casa XI · Comunidad", d: "Amistades, redes y proyectos colectivos.", practica: "marca tus grupos, causas, amistades duraderas y metas compartidas" },
        12: { t: "Casa XII · Interior", d: "Inconsciente, retiro y procesos invisibles.", practica: "actúa en soledad, sueños, sanación y en lo que gestionas en privado" }
    },

    _norm360: (g) => {
        let d = g % 360;
        if (d < 0) d += 360;
        return d;
    },

    _rad: (g) => g * Math.PI / 180,
    _deg: (r) => r * 180 / Math.PI,

    _lonASigno: (lon) => {
        const idx = Math.floor(AgendaAstral._norm360(lon) / 30) % 12;
        const enSigno = AgendaAstral._norm360(lon) % 30;
        const signo = AgendaAstral.SIGNOS[idx];
        return { ...signo, idx, grado: enSigno, minuto: Math.floor((enSigno % 1) * 60) };
    },

    formatearPosicion: (lon) => {
        const p = AgendaAstral._lonASigno(lon);
        return `${p.s} ${Math.floor(p.grado)}°${String(p.minuto).padStart(2, "0")}' ${p.n}`;
    },

    _localAUtc: (fecha, hora, tz) => {
        const [y, mo, d] = fecha.split("-").map(Number);
        const [h, mi] = hora.split(":").map(Number);
        const guess = Date.UTC(y, mo - 1, d, h, mi, 0);
        const partes = new Intl.DateTimeFormat("en-CA", {
            timeZone: tz, hour12: false,
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        }).formatToParts(new Date(guess));
        const val = (t) => parseInt(partes.find(p => p.type === t)?.value || "0", 10);
        const localComoUtc = Date.UTC(val("year"), val("month") - 1, val("day"), val("hour"), val("minute"), val("second"));
        return new Date(guess + (guess - localComoUtc));
    },

    _julianDay: (dateUtc) => {
        const y = dateUtc.getUTCFullYear();
        let mo = dateUtc.getUTCMonth() + 1;
        let Y = y;
        const d = dateUtc.getUTCHours() / 24
            + dateUtc.getUTCMinutes() / 1440
            + dateUtc.getUTCSeconds() / 86400
            + dateUtc.getUTCDate();
        if (mo <= 2) { Y--; mo += 12; }
        const A = Math.floor(Y / 100);
        const B = 2 - A + Math.floor(A / 4);
        return Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (mo + 1)) + d + B - 1524.5;
    },

    _kepler: (M, e) => {
        const m = AgendaAstral._rad(M);
        let E = m;
        for (let i = 0; i < 8; i++) E = m + e * Math.sin(E);
        const xv = Math.cos(E) - e;
        const yv = Math.sqrt(1 - e * e) * Math.sin(E);
        return AgendaAstral._deg(Math.atan2(yv, xv));
    },

    // Posiciones geocéntricas eclípticas (basado en Schlyter / Meeus)
    _posiciones: (jd) => {
        const d = jd - 2451543.5;
        const rad = (g) => g * Math.PI / 180;
        const helio = (N, i, w, a, e, M) => {
            const E = AgendaAstral._kepler(M, e);
            const xv = a * (Math.cos(rad(E)) - e);
            const yv = a * Math.sqrt(1 - e * e) * Math.sin(rad(E));
            const v = AgendaAstral._deg(Math.atan2(yv, xv));
            const lon = v + w;
            const r = a * (1 - e * Math.cos(rad(E)));
            const xh = r * (Math.cos(rad(N)) * Math.cos(rad(lon)) - Math.sin(rad(N)) * Math.sin(rad(lon)) * Math.cos(rad(i)));
            const yh = r * (Math.sin(rad(N)) * Math.cos(rad(lon)) + Math.cos(rad(N)) * Math.sin(rad(lon)) * Math.cos(rad(i)));
            const zh = r * Math.sin(rad(lon)) * Math.sin(rad(i));
            return { xh, yh, zh, lon: AgendaAstral._norm360(lon + N) };
        };
        const geo = (xh, yh, zh, xs, ys, zs) =>
            AgendaAstral._norm360(AgendaAstral._deg(Math.atan2(yh - ys, xh - xs)));

        const wSol = 282.9404 + 4.70935e-5 * d;
        const eSol = 0.016709 - 1.151e-9 * d;
        const MSol = 356.0470 + 0.9856002585 * d;
        const ESol = AgendaAstral._kepler(MSol, eSol);
        const xSol = Math.cos(rad(ESol)) - eSol;
        const ySol = Math.sin(rad(ESol)) * Math.sqrt(1 - eSol * eSol);
        const vSol = AgendaAstral._deg(Math.atan2(ySol, xSol));
        const lonSol = AgendaAstral._norm360(vSol + wSol);
        const rSol = 1.0000002 * (1 - eSol * Math.cos(rad(ESol)));
        const xs = rSol * Math.cos(rad(lonSol));
        const ys = rSol * Math.sin(rad(lonSol));
        const zs = 0;

        const Nm = 125.1228 - 0.0529538083 * d;
        const im = 5.1454;
        const wm = 318.0634 + 0.1643573223 * d;
        const em = 0.054900;
        const am = 60.2666;
        const Mm = 115.3654 + 13.0649929509 * d;
        const Em = AgendaAstral._kepler(Mm, em);
        const rm = am * (1 - em * Math.cos(rad(Em)));
        const vm = AgendaAstral._deg(Math.atan2(
            rm * Math.sqrt(1 - em * em) * Math.sin(rad(Em)),
            rm * (Math.cos(rad(Em)) - em)
        ));
        const lonm = AgendaAstral._norm360(vm + wm);
        const xm = rm * (Math.cos(rad(Nm)) * Math.cos(rad(lonm)) - Math.sin(rad(Nm)) * Math.sin(rad(lonm)) * Math.cos(rad(im)));
        const ym = rm * (Math.sin(rad(Nm)) * Math.cos(rad(lonm)) + Math.cos(rad(Nm)) * Math.sin(rad(lonm)) * Math.cos(rad(im)));
        const zm = rm * Math.sin(rad(lonm)) * Math.sin(rad(im));

        const pMerc = helio(
            48.3313 + 3.24587e-5 * d, 7.0047 + 5e-8 * d, 29.1241 + 1.01444e-5 * d,
            0.387098, 0.205635 + 5.59e-10 * d, 168.6562 + 4.0923344368 * d
        );
        const pVenus = helio(
            76.6799 + 2.465e-5 * d, 3.3946 + 2.75e-8 * d, 54.8910 + 1.38374e-5 * d,
            0.723330, 0.006773 - 1.302e-9 * d, 48.0052 + 1.6021302244 * d
        );
        const pMarte = helio(
            49.5574 + 2.11081e-5 * d, 1.8497 - 1.78e-8 * d, 286.5016 + 2.92961e-5 * d,
            1.523688, 0.093405 + 2.516e-9 * d, 18.6021 + 0.5240207766 * d
        );
        const pJup = helio(
            100.4542 + 2.76854e-5 * d, 1.3030 - 1.557e-7 * d, 273.8777 + 1.64505e-5 * d,
            5.20256, 0.048498 + 4.469e-9 * d, 19.8950 + 0.0830853001 * d
        );
        const pSat = helio(
            113.6634 + 2.3898e-5 * d, 2.4886 - 1.081e-7 * d, 339.3939 + 2.97681e-5 * d,
            9.55475, 0.055546 - 9.499e-9 * d, 316.9670 + 0.0334442282 * d
        );

        return {
            sol: lonSol,
            luna: AgendaAstral._norm360(AgendaAstral._deg(Math.atan2(ym, xm))),
            mercurio: geo(pMerc.xh, pMerc.yh, pMerc.zh, xs, ys, zs),
            venus: geo(pVenus.xh, pVenus.yh, pVenus.zh, xs, ys, zs),
            marte: geo(pMarte.xh, pMarte.yh, pMarte.zh, xs, ys, zs),
            jupiter: geo(pJup.xh, pJup.yh, pJup.zh, xs, ys, zs),
            saturno: geo(pSat.xh, pSat.yh, pSat.zh, xs, ys, zs)
        };
    },

    _oblicuidad: (jd) => {
        const T = (jd - 2451545) / 36525;
        return 23.439291 - 0.0130042 * T;
    },

    _lst: (jd, lon) => {
        const d = jd - 2451545.0;
        let gmst = 280.46061837 + 360.98564736629 * d;
        gmst = AgendaAstral._norm360(gmst);
        return AgendaAstral._norm360(gmst + lon);
    },

    _ascendente: (jd, lat, lon) => {
        const lst = AgendaAstral._lst(jd, lon);
        const eps = AgendaAstral._oblicuidad(jd);
        const ramc = AgendaAstral._rad(lst);
        const phi = AgendaAstral._rad(lat);
        const ep = AgendaAstral._rad(eps);
        const asc = Math.atan2(
            Math.cos(ramc),
            -(Math.sin(ramc) * Math.cos(ep) + Math.tan(phi) * Math.sin(ep))
        );
        return AgendaAstral._norm360(AgendaAstral._deg(asc));
    },

    _mediocielo: (jd, lon) => {
        const lst = AgendaAstral._lst(jd, lon);
        const eps = AgendaAstral._oblicuidad(jd);
        const mc = Math.atan2(Math.tan(AgendaAstral._rad(lst)), Math.cos(AgendaAstral._rad(eps)));
        return AgendaAstral._norm360(AgendaAstral._deg(mc));
    },

    _casaSignoEntero: (lonPlaneta, lonAsc) => {
        const base = Math.floor(AgendaAstral._norm360(lonAsc) / 30);
        const signo = Math.floor(AgendaAstral._norm360(lonPlaneta) / 30);
        let casa = signo - base + 1;
        if (casa <= 0) casa += 12;
        return casa;
    },

    calcularCartaNatal: (persona) => {
        if (!AgendaPerfil) return null;
        const datos = AgendaPerfil.obtenerDatosNatal(persona);
        if (!datos) return null;

        const hora = datos.hora || "12:00";
        const utc = AgendaAstral._localAUtc(datos.fecha, hora, datos.zonaHoraria);
        const jd = AgendaAstral._julianDay(utc);
        const pos = AgendaAstral._posiciones(jd);

        const carta = {
            solar: datos.horaDesconocida,
            lugar: datos.lugar,
            fecha: datos.fecha,
            hora: datos.horaDesconocida ? null : hora,
            utc: utc.toISOString(),
            cuerpos: [],
            ascendente: null,
            mediocielo: null
        };

        if (!datos.horaDesconocida) {
            carta.ascendente = {
                lon: AgendaAstral._ascendente(jd, datos.latitud, datos.longitud),
                etiqueta: "Ascendente"
            };
            carta.mediocielo = {
                lon: AgendaAstral._mediocielo(jd, datos.longitud),
                etiqueta: "Medio Cielo"
            };
        }

        AgendaAstral.CUERPOS.forEach(c => {
            const lon = pos[c.id];
            const item = {
                ...c,
                lon,
                posicion: AgendaAstral.formatearPosicion(lon),
                casa: null
            };
            if (carta.ascendente) item.casa = AgendaAstral._casaSignoEntero(lon, carta.ascendente.lon);
            carta.cuerpos.push(item);
        });

        if (carta.ascendente) {
            carta.ascendente.posicion = AgendaAstral.formatearPosicion(carta.ascendente.lon);
            carta.ascendente.casa = 1;
        }
        if (carta.mediocielo) {
            carta.mediocielo.posicion = AgendaAstral.formatearPosicion(carta.mediocielo.lon);
            carta.mediocielo.casa = 10;
        }

        return carta;
    },

    injectStyles: () => {
        if (document.getElementById("agenda-carta-styles")) return;
        const st = document.createElement("style");
        st.id = "agenda-carta-styles";
        st.textContent = `
            .agenda-carta-wrap { display: flex; flex-direction: column; gap: 18px; }
            .agenda-carta-intro {
                padding: 14px 16px; border-radius: 12px; line-height: 1.55; font-size: 0.92em;
                background: var(--background-secondary);
                border-left: 4px solid var(--interactive-accent);
                color: var(--text-normal);
            }
            .agenda-carta-nota {
                padding: 10px 12px; border-radius: 8px; font-size: 0.85em; line-height: 1.45;
                background: color-mix(in srgb, var(--interactive-accent) 10%, var(--background-primary));
                color: var(--text-muted); border: 1px solid var(--background-modifier-border);
            }
            .agenda-carta-bloque { display: flex; flex-direction: column; gap: 10px; }
            .agenda-carta-bloque-titulo {
                margin: 0; font-size: 0.95em; font-weight: 700; color: var(--text-accent);
                letter-spacing: 0.02em;
            }
            .agenda-carta-bloque-sub {
                margin: -4px 0 0; font-size: 0.82em; color: var(--text-muted); line-height: 1.4;
            }
            .agenda-carta-datos {
                display: flex; flex-wrap: wrap; gap: 8px 16px; font-size: 0.88em; color: var(--text-muted);
            }
            .agenda-carta-datos span { white-space: nowrap; }
            .agenda-carta-pilares {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;
            }
            .agenda-carta-pilar {
                padding: 12px 14px; border-radius: 12px;
                background: var(--background-secondary);
                border: 1px solid var(--background-modifier-border);
            }
            .agenda-carta-pilar--destacado {
                border-color: color-mix(in srgb, var(--interactive-accent) 45%, var(--background-modifier-border));
                background: color-mix(in srgb, var(--interactive-accent) 6%, var(--background-secondary));
            }
            .agenda-carta-pilar-etq {
                display: block; font-size: 0.75em; font-weight: 700; text-transform: uppercase;
                letter-spacing: 0.04em; color: var(--text-muted); margin-bottom: 4px;
            }
            .agenda-carta-pilar-pos {
                font-size: 1.05em; font-weight: 600; color: var(--text-normal); margin-bottom: 6px;
            }
            .agenda-carta-pilar-sig { font-size: 0.86em; line-height: 1.55; color: var(--text-muted); }
            .agenda-carta-pilar-rol {
                font-size: 0.78em; font-weight: 600; color: var(--text-normal);
                margin-bottom: 4px; opacity: 0.85;
            }
            .agenda-carta-ejemplo {
                padding: 10px 12px; border-radius: 8px; font-size: 0.84em; line-height: 1.5;
                background: var(--background-primary);
                border: 1px dashed var(--background-modifier-border);
                color: var(--text-muted);
            }
            .agenda-carta-planeta-rol { font-size: 0.78em; color: var(--text-muted); margin-top: 2px; }
            .agenda-carta-planeta-sig {
                grid-column: 1 / -1; font-size: 0.86em; color: var(--text-normal);
                line-height: 1.55; padding-top: 4px; border-top: 1px solid var(--background-modifier-border);
            }
            .agenda-carta-planetas { display: flex; flex-direction: column; gap: 8px; }
            .agenda-carta-planeta {
                display: grid; grid-template-columns: minmax(110px, 130px) 1fr auto;
                gap: 8px 12px; align-items: start; padding: 10px 12px; border-radius: 10px;
                background: var(--background-secondary);
                border: 1px solid var(--background-modifier-border);
            }
            @media (max-width: 520px) {
                .agenda-carta-planeta { grid-template-columns: 1fr; }
            }
            .agenda-carta-planeta-nom { font-weight: 600; font-size: 0.92em; }
            .agenda-carta-planeta-pos { font-size: 0.9em; color: var(--text-accent); }
            .agenda-carta-planeta-casa {
                font-size: 0.78em; font-weight: 600; padding: 3px 8px; border-radius: 999px;
                background: var(--background-primary); color: var(--text-muted); white-space: nowrap;
            }
            .agenda-carta-casas {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px;
            }
            .agenda-carta-casa-item {
                padding: 8px 10px; border-radius: 8px; font-size: 0.8em; line-height: 1.35;
                background: var(--background-secondary); border: 1px solid var(--background-modifier-border);
            }
            .agenda-carta-casa-item strong { display: block; font-size: 0.92em; color: var(--text-normal); margin-bottom: 2px; }
            .agenda-carta-vacio { color: var(--text-muted); font-style: italic; padding: 12px 0; line-height: 1.5; }
            .agenda-carta-enlace {
                font-size: 0.85em; color: var(--text-accent); cursor: pointer; margin-top: 4px;
                text-decoration: underline; text-underline-offset: 2px;
            }
            .agenda-carta-preview-host { margin-top: 12px; }
            .agenda-auto-badge--carta-lista span { color: var(--interactive-accent); font-weight: 600; }
        `;
        document.head.appendChild(st);
    },

    _vaciar: (el) => { if (el?.empty) el.empty(); else if (el) el.innerHTML = ""; },

    _bloque: (parent, titulo, subtitulo) => {
        const b = parent.createEl("div", { cls: "agenda-carta-bloque" });
        b.createEl("h4", { cls: "agenda-carta-bloque-titulo", text: titulo });
        if (subtitulo) b.createEl("p", { cls: "agenda-carta-bloque-sub", text: subtitulo });
        return b;
    },

    _pilar: (parent, { etiqueta, posicion, rol, significado, destacado }) => {
        const card = parent.createEl("div", { cls: "agenda-carta-pilar" + (destacado ? " agenda-carta-pilar--destacado" : "") });
        card.createEl("span", { cls: "agenda-carta-pilar-etq", text: etiqueta });
        if (rol) card.createEl("div", { cls: "agenda-carta-pilar-rol", text: rol });
        card.createEl("div", { cls: "agenda-carta-pilar-pos", text: posicion || "—" });
        if (significado) card.createEl("div", { cls: "agenda-carta-pilar-sig", text: significado });
        return card;
    },

    _significadoCasa: (num) => {
        const c = AgendaAstral.CASAS[num];
        return c ? c.practica : "";
    },

    _interpretarSigno: (lon) => {
        const signo = AgendaAstral._lonASigno(lon);
        const desc = AgendaAstral.SIGNO_DESC[signo.n] || "expresas esta energía de forma particular";
        return { signo: signo.n, simbolo: signo.s, desc };
    },

    _interpretarCuerpo: (cuerpo, lon, casa) => {
        const meta = AgendaAstral.CUERPOS.find(x => x.id === cuerpo.id) || cuerpo;
        const { signo, desc } = AgendaAstral._interpretarSigno(lon);
        let txt = `${meta.rol}. En ${signo} ${desc}.`;
        if (casa) {
            const c = AgendaAstral.CASAS[casa];
            if (c) txt += ` En ${c.t.toLowerCase()} (${casa}): ${c.practica}.`;
        } else {
            txt += ` Esto colorea tu ${meta.area}.`;
        }
        return txt;
    },

    _interpretarAngulo: (tipo, lon) => {
        const ang = AgendaAstral.ANGULOS[tipo];
        const { signo, desc } = AgendaAstral._interpretarSigno(lon);
        if (tipo === "ascendente") {
            return `${ang.rol}. Con Ascendente en ${signo}, ${desc}; así te perciben al conocerte y es la lente con la que encaras lo nuevo.`;
        }
        return `${ang.rol}. Con Medio Cielo en ${signo}, ${desc}; es el tono con el que buscas dejar huella profesional o pública.`;
    },

    renderCarta: (contenedor, persona, opts = {}) => {
        AgendaAstral.injectStyles();
        AgendaAstral._vaciar(contenedor);

        const carta = persona.carta_natal || AgendaAstral.calcularCartaNatal(persona);
        if (!carta) {
            contenedor.createEl("p", {
                cls: "agenda-carta-vacio",
                text: "Completa fecha, hora (o marca «hora desconocida»), coordenadas y zona horaria en el perfil para calcular la carta."
            });
            return;
        }

        const compacto = !!opts.compacto;
        const wrap = contenedor.createEl("div", { cls: "agenda-carta-wrap" });

        if (!compacto) {
            wrap.createEl("div", { cls: "agenda-carta-intro", text: AgendaAstral.INTRO_CARTA });
            wrap.createEl("div", { cls: "agenda-carta-ejemplo", text: AgendaAstral.LEER_CARTA });
        }

        const bDatos = AgendaAstral._bloque(wrap, "📋 Datos de nacimiento",
            compacto ? null : "Base usada para el cálculo de posiciones planetarias.");
        const datos = bDatos.createEl("div", { cls: "agenda-carta-datos" });
        const horaTxt = carta.hora ? `${carta.fecha} · ${carta.hora}` : `${carta.fecha} · mediodía local (carta solar)`;
        datos.createEl("span", { text: `📅 ${horaTxt}` });
        if (carta.lugar) datos.createEl("span", { text: `📍 ${carta.lugar}` });

        if (carta.solar) {
            wrap.createEl("div", { cls: "agenda-carta-nota", text: AgendaAstral.NOTA_CARTA_SOLAR });
        }

        const sol = carta.cuerpos.find(c => c.id === "sol");
        const luna = carta.cuerpos.find(c => c.id === "luna");
        const bPilares = AgendaAstral._bloque(wrap, "✨ Lo esencial para ti",
            compacto ? null : "Interpretación directa de los cuatro puntos más personales de tu carta.");
        const pilares = bPilares.createEl("div", { cls: "agenda-carta-pilares" });

        if (sol) {
            AgendaAstral._pilar(pilares, {
                etiqueta: `${sol.sim} Sol · signo solar`,
                rol: sol.rol,
                posicion: sol.posicion,
                significado: AgendaAstral._interpretarCuerpo(sol, sol.lon, sol.casa),
                destacado: true
            });
        }
        if (luna) {
            AgendaAstral._pilar(pilares, {
                etiqueta: `${luna.sim} Luna · signo lunar`,
                rol: luna.rol,
                posicion: luna.posicion,
                significado: AgendaAstral._interpretarCuerpo(luna, luna.lon, luna.casa),
                destacado: true
            });
        }
        if (carta.ascendente) {
            const ang = AgendaAstral.ANGULOS.ascendente;
            AgendaAstral._pilar(pilares, {
                etiqueta: `↑ ${ang.t}`,
                rol: ang.rol,
                posicion: carta.ascendente.posicion,
                significado: AgendaAstral._interpretarAngulo("ascendente", carta.ascendente.lon),
                destacado: true
            });
        }
        if (carta.mediocielo) {
            const ang = AgendaAstral.ANGULOS.mediocielo;
            AgendaAstral._pilar(pilares, {
                etiqueta: `⌂ ${ang.t}`,
                rol: ang.rol,
                posicion: carta.mediocielo.posicion,
                significado: AgendaAstral._interpretarAngulo("mediocielo", carta.mediocielo.lon),
                destacado: true
            });
        }

        const bPlanetas = AgendaAstral._bloque(wrap, "🪐 El resto de tu carta" + (carta.ascendente ? "" : " · signos"),
            compacto ? null : "Cada fila combina planeta + signo + casa (si hay hora) en un texto aplicado a tu caso.");
        const lista = bPlanetas.createEl("div", { cls: "agenda-carta-planetas" });

        carta.cuerpos.forEach(c => {
            const fila = lista.createEl("div", { cls: "agenda-carta-planeta" });
            const colNom = fila.createEl("div");
            colNom.createEl("div", { cls: "agenda-carta-planeta-nom", text: `${c.sim} ${c.l}` });
            colNom.createEl("div", { cls: "agenda-carta-planeta-rol", text: c.rol });
            fila.createEl("div", { cls: "agenda-carta-planeta-pos", text: c.posicion });
            if (c.casa) {
                const casaInfo = AgendaAstral.CASAS[c.casa];
                fila.createEl("span", {
                    cls: "agenda-carta-planeta-casa",
                    text: casaInfo ? casaInfo.t.replace(/^Casa [IVX]+ · /, "C. ") : `C. ${c.casa}`
                });
            }
            fila.createEl("div", {
                cls: "agenda-carta-planeta-sig",
                text: AgendaAstral._interpretarCuerpo(c, c.lon, c.casa)
            });
        });

        if (!compacto && carta.ascendente) {
            const bCasas = AgendaAstral._bloque(wrap, "🏠 Qué significa cada casa", AgendaAstral.NOTA_CASAS);
            const gridCasas = bCasas.createEl("div", { cls: "agenda-carta-casas" });
            Object.entries(AgendaAstral.CASAS).forEach(([, info]) => {
                const item = gridCasas.createEl("div", { cls: "agenda-carta-casa-item" });
                item.createEl("strong", { text: info.t });
                item.createEl("span", { text: `${info.d} ${info.practica}.` });
            });
        }

        if (compacto && opts.enlaceCompleto) {
            const enlace = contenedor.createEl("p", { cls: "agenda-carta-enlace", text: "→ Ver carta astral completa con guía de casas" });
            if (opts.onIrATab) enlace.onclick = (e) => { e.preventDefault(); opts.onIrATab(); };
        }
    },

    renderResumenEditor: (contenedor, persona) => {
        AgendaAstral.injectStyles();
        AgendaAstral._vaciar(contenedor);
        const evalCarta = AgendaPerfil.evaluarCartaAstral(persona);
        if (!evalCarta.listo) {
            contenedor.createEl("p", {
                cls: "agenda-carta-editor-vacio",
                text: `Completa: ${evalCarta.faltantes.join(", ")}`
            });
            return;
        }
        const carta = AgendaAstral.calcularCartaNatal(persona);
        if (!carta) return;

        const wrap = contenedor.createEl("div", { cls: "agenda-carta-editor-resumen" });
        wrap.createEl("p", {
            text: evalCarta.horaExacta ? "✓ Carta natal lista para calcular" : "✓ Carta solar (sin ascendente ni casas)"
        });
        const sol = carta.cuerpos.find(c => c.id === "sol");
        const luna = carta.cuerpos.find(c => c.id === "luna");
        if (sol) wrap.createEl("div", { cls: "agenda-carta-editor-linea", text: `☉ Sol · ${sol.posicion}` });
        if (luna) wrap.createEl("div", { cls: "agenda-carta-editor-linea", text: `☽ Luna · ${luna.posicion}` });
        if (carta.ascendente) {
            wrap.createEl("div", { cls: "agenda-carta-editor-linea", text: `↑ ASC · ${carta.ascendente.posicion}` });
        }
        wrap.createEl("p", {
            cls: "agenda-carta-editor-nota",
            text: "Guarda y abre el perfil → pestaña «Carta astral» para ver la interpretación completa."
        });
    },

    renderPreview: (contenedor, persona) =>
        AgendaAstral.renderCarta(contenedor, persona, { compacto: true })
};
