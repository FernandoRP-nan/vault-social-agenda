# Social Agenda

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Complemento local para [Obsidian](https://obsidian.md) orientado a gestionar contactos, relaciones, calendario de actividades y perfil personal. Ideal como agenda social o CRM ligero dentro de tu vault. Todo se almacena localmente en SQLite.

## Características

- Directorio de personas con relaciones (pareja, amigos, familia, trabajo, etc.).
- Calendario de actividades, eventos y tareas sociales.
- Perfil cognitivo, preferencias y datos astrológicos opcionales.
- Sincronización de tareas con el complemento **Task Board** (opcional pero recomendado).

## Requisitos

- Obsidian 1.5.0 o superior.
- [Task Board](https://github.com/FernandoRP-nan/vault-task-board) activo si quieres vincular actividades tipo tarea al Kanban.
- Node.js 18+ (solo para compilar desde el código fuente).

## Instalación

```bash
git clone https://github.com/FernandoRP-nan/vault-social-agenda.git
cd vault-social-agenda
npm install && npm run build
ln -sf "$(pwd)" /ruta/a/tu/vault/.obsidian/plugins/vault-social-agenda
```

Activa **Task Board** antes que **Social Agenda** en Ajustes → Complementos.

También puedes usar un [release precompilado](https://github.com/FernandoRP-nan/vault-social-agenda/releases) (`main.js`, `manifest.json`, `assets/`).

## Uso

- Cinta lateral → icono de personas.
- Paleta de comandos → **Abrir agenda social**.

## Datos y privacidad

| Elemento | Ubicación |
|----------|-----------|
| Base de datos | `.obsidian/plugins-data/vault-social-agenda/agenda_social.db` |
| Imágenes | Carpeta configurable (p. ej. `Adjuntos/Agenda Social/`) |

Migración automática desde `.obsidian/scripts/agenda_social.db` si existe.

## Complementos relacionados

- [Task Board](https://github.com/FernandoRP-nan/vault-task-board) — tablero Kanban (dependencia para sync de tareas).
- [Character Collection](https://github.com/FernandoRP-nan/vault-character-collection) — colección de personajes (independiente).

## Desarrollo

```bash
npm run dev && npm run build
```

## Licencia

[MIT](LICENSE) — Copyright (c) 2026 FernandoRP-nan.
