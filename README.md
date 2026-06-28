# Social Agenda

Plugin local de Obsidian: agenda de contactos, relaciones, perfil cognitivo y calendario social.

## Dependencia

Requiere **[vault-task-board](https://github.com/FernandoRP-nan/vault-task-board)** activo para sincronizar actividades tipo tarea con el Kanban.

## Instalación local

> **Importante:** desarrolla **fuera del vault**. Si el repo con `node_modules` queda dentro de la bóveda, Obsidian puede colgarse al indexar.

### 1. Clonar (fuera del vault)

```bash
git clone https://github.com/FernandoRP-nan/vault-social-agenda.git
```

### 2. sql.js (una vez por vault)

Ver [vault-task-board](https://github.com/FernandoRP-nan/vault-task-board#2-sqljs-una-vez-por-vault).

### 3. Compilar

```bash
cd /ruta/a/Obsidian-Plugins/vault-social-agenda
npm install
npm run build
```

### 4. Enlazar al vault

```bash
VAULT="/ruta/a/tu/vault/.obsidian/plugins"
ln -sf /ruta/a/Obsidian-Plugins/vault-social-agenda "$VAULT/vault-social-agenda"
```

### 5. Activar

Activa **Task Board** primero, luego **Social Agenda**.

## Uso

- Icono 👥 en la cinta lateral
- Paleta de comandos → **Abrir agenda social**

Datos: `.obsidian/scripts/agenda_social.db` · Imágenes: `Adjuntos/Agenda Social/`

## Comunicación entre plugins

```
vault-task-board  →  expone TaskBoardBridge
vault-social-agenda  →  getPlugin('vault-task-board') + eventos :ready / :changed
```

## Desarrollo

```bash
npm run dev
npm run build
```
