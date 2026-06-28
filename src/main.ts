import { ItemView, Notice, Plugin, TFile, WorkspaceLeaf } from "obsidian";
import { setTaskBoardBridge } from "./bridge-registry";
import { ScriptsRuntime } from "./runtime/scripts-runtime";
import { AgendaDB } from "./lib/agenda_db";
import { AgendaUI } from "./lib/agenda_ui";
import type { TaskBoardApi, TaskBoardPluginLike } from "./types";

const PLUGIN_ID = "vault-social-agenda";
const PLUGIN_ROOT = `.obsidian/plugins/${PLUGIN_ID}`;
const LEGACY_DB = ".obsidian/scripts/agenda_social.db";
const TASK_BOARD_ID = "vault-task-board";

export const VIEW_TYPE = "vault-social-agenda-dashboard";

interface AppWithPlugins {
    plugins: {
        getPlugin(id: string): TaskBoardPluginLike | null;
    };
}

export default class SocialAgendaPlugin extends Plugin {
    private sql: unknown = null;

    async onload(): Promise<void> {
        ScriptsRuntime.configure(this.app, {
            sqlJsRel: `${PLUGIN_ROOT}/assets/sql-wasm.js`,
            sqlWasmRel: `${PLUGIN_ROOT}/assets/sql-wasm.wasm`
        });

        if (await ScriptsRuntime.migrarArchivoBinario(LEGACY_DB, AgendaDB.DB_RELATIVE)) {
            new Notice("Social Agenda: base de datos migrada a plugins-data.");
        }

        this.conectarTaskBoard();

        this.registerEvent(
            // @ts-expect-error evento personalizado
            this.app.workspace.on("vault-task-board:ready", () => this.conectarTaskBoard())
        );
        this.registerEvent(
            // @ts-expect-error evento personalizado
            this.app.workspace.on("vault-task-board:changed", () => {
                const leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
                if (leaf?.view instanceof SocialAgendaView) void leaf.view.refresh();
            })
        );

        this.registerView(VIEW_TYPE, (leaf) => new SocialAgendaView(leaf, this));
        this.addRibbonIcon("users", "Social Agenda", () => this.activateView());
        this.addCommand({
            id: "open-dashboard",
            name: "Abrir agenda social",
            callback: () => this.activateView()
        });
    }

    conectarTaskBoard(): void {
        const plugin = (this.app as unknown as AppWithPlugins).plugins.getPlugin(TASK_BOARD_ID);
        setTaskBoardBridge(plugin?.api);
    }

    async ensureSql(): Promise<unknown> {
        if (!this.sql) this.sql = await ScriptsRuntime.initSqlJs();
        return this.sql;
    }

    private async activateView(): Promise<void> {
        let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
        if (!leaf) {
            leaf = this.app.workspace.getLeaf(true);
            await leaf.setViewState({ type: VIEW_TYPE, active: true });
        }
        this.app.workspace.revealLeaf(leaf);
    }
}

export class SocialAgendaView extends ItemView {
    constructor(leaf: WorkspaceLeaf, private plugin: SocialAgendaPlugin) {
        super(leaf);
    }

    getViewType(): string {
        return VIEW_TYPE;
    }

    getDisplayText(): string {
        return "Social Agenda";
    }

    getIcon(): string {
        return "users";
    }

    async onOpen(): Promise<void> {
        await this.refresh();
    }

    async onClose(): Promise<void> {
        this.containerEl.empty();
    }

    async refresh(): Promise<void> {
        const root = this.containerEl;
        root.empty();
        root.addClass("vault-social-agenda-root");

        this.plugin.conectarTaskBoard();

        const { getTaskBoardBridge } = await import("./bridge-registry");
        if (!getTaskBoardBridge()?.isAvailable()) {
            root.createEl("p", {
                text: "⚠️ Activa vault-task-board para sincronizar tareas con el tablero."
            });
        }

        try {
            const SQL = await this.plugin.ensureSql();
            const dbPath = AgendaDB.DB_RELATIVE;
            const kanbanPath = AgendaDB.KANBAN_DB_RELATIVE;

            if (!ScriptsRuntime.puedeUsarFs()) {
                await ScriptsRuntime.leerBinarioAsync(dbPath);
            }

            let db = await AgendaDB.init(SQL, dbPath);
            const migrado = await AgendaDB.migrarDesdeFrontmatterSiVacio(this.app, db, dbPath);
            if (migrado) new Notice("📦 Datos migrados del frontmatter a SQLite");

            AgendaUI.injectStyles();

            const ejecutarRender = async () => {
                this.plugin.conectarTaskBoard();
                db = await AgendaDB.init(SQL, dbPath);
                root.empty();
                await AgendaUI.renderDashboard(root, db, dbPath, ejecutarRender, {
                    SQL,
                    kanbanPath,
                    dbPath
                });
            };
            await ejecutarRender();
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            root.createEl("p", { text: `❌ Error: ${msg}` });
        }
    }
}
