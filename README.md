# Social Agenda

Plugin local de Obsidian: contactos, relaciones, perfil cognitivo y calendario social.

Requiere **[vault-task-board](https://github.com/FernandoRP-nan/vault-task-board)** activo.

## Instalación

```bash
git clone https://github.com/FernandoRP-nan/vault-social-agenda.git
cd vault-social-agenda
npm install && npm run build
ln -sf "$(pwd)" /ruta/vault/.obsidian/plugins/vault-social-agenda
```

Activa **Task Board** primero, luego **Social Agenda**.

## Datos

| Qué | Ruta |
|-----|------|
| SQLite agenda | `.obsidian/plugins-data/vault-social-agenda/agenda_social.db` |
| Tareas Kanban | vía API de Task Board (`plugins-data/vault-task-board/`) |
| Imágenes | `Adjuntos/Agenda Social/` |
| sql.js | empaquetado en `assets/` del plugin |

Migración automática desde `.obsidian/scripts/agenda_social.db`.

## Uso

- Cinta lateral → 👥
- Comando → **Abrir agenda social**

## Desarrollo

```bash
npm run dev && npm run build
```
