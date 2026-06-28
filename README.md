# Social Agenda

Plugin local de Obsidian: agenda de contactos, relaciones, perfil cognitivo y calendario social.

## Dependencia

Requiere el plugin local **[vault-task-board](../vault-task-board)** para sincronizar actividades tipo tarea con el tablero Kanban.

## Instalación local

1. Instala y activa **vault-task-board** primero.
2. Copia este repo en `.obsidian/plugins/vault-social-agenda/`.
3. Asegura sql.js en `.obsidian/scripts/node_modules/` (ver README de task-board).
4. Compila:

```bash
cd .obsidian/plugins/vault-social-agenda
npm install
npm run build
```

5. Activa **Social Agenda** en complementos.

## Datos

- `.obsidian/scripts/agenda_social.db`
- Imágenes: `Adjuntos/Agenda Social/`

## Comunicación entre plugins

Al cargar, busca `app.plugins.getPlugin('vault-task-board')` y conecta `window.TaskBoardBridge`.

Escucha `vault-task-board:ready` y `vault-task-board:changed` para refrescar el dashboard.

## Desarrollo

```bash
npm run dev
npm run build
```
