import { ItemView, Notice, Plugin, WorkspaceLeaf } from "obsidian";
import "./legacy";

interface TaskBoardApi {
    PLUGIN_ID: string;
    isAvailable: () => boolean;
    dbPath: () => string;
    notaConMarcaAgenda: (notas: string, agendaId: string) => string;
    buscarIdPorAgendaId: (agendaId: string) => number | null | undefined;
    obtenerTodas: () => Array<{ id: number; estado: string }>;
    crearTarea: (datos: Record<string, unknown>) => number;
    actualizarTarea: (tareaId: number, datos: Record<string, unknown>) => number | undefined;
    eliminarTarea: (tareaId: number) => void;
    emitChange: (app: unknown) => void;
}

declare global {
    interface Window {
        ScriptsRuntime: {
            configure: (app: unknown) => void;
            initSqlJs: () => Promise<unknown>;
            puedeUsarFs: () => boolean;
            leerBinarioAsync: (path: string) => Promise<Uint8Array | null>;
        };
        AgendaDB: {
            DB_RELATIVE: string;
            KANBAN_DB_RELATIVE: string;
            init: (SQL: unknown, dbPath: string) => Promise<unknown>;
            migrarDesdeFrontmatterSiVacio: (app: unknown, db: unknown, dbPath: string) => Promise<boolean>;
        };
        AgendaUI: {
            injectStyles: () => void;
            renderDashboard: (
                container: HTMLElement,
                db: unknown,
                dbPath: string,
                onRefresh: () => Promise<void>,
                ctx: Record<string, unknown>
            ) => Promise<void>;
        };
        TaskBoardBridge?: TaskBoardApi;
    }
}

export const VIEW_TYPE = "vault-social-agenda-dashboard";
const TASK_BOARD_ID = "vault-task-board";

interface AppWithPlugins {
    plugins: {
        getPlugin(id: string): { api?: TaskBoardApi } | null;
    };
}

export default class SocialAgendaPlugin extends Plugin {
    private sql: unknown = null;

    async onload(): Promise<void> {
        window.ScriptsRuntime.configure(this.app);
        this.conectarTaskBoard();

        this.registerEvent(
            // @ts-expect-error evento personalizado entre plugins locales
            this.app.workspace.on("vault-task-board:ready", () => this.conectarTaskBoard())
        );
        this.registerEvent(
            // @ts-expect-error evento personalizado entre plugins locales
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
        const plugins = (this.app as unknown as AppWithPlugins).plugins;
        const plugin = plugins.getPlugin(TASK_BOARD_ID) as { api?: TaskBoardApi } | null;
        if (plugin?.api) {
            window.TaskBoardBridge = plugin.api;
        }
    }

    async ensureSql(): Promise<unknown> {
        if (!this.sql) this.sql = await window.ScriptsRuntime.initSqlJs();
        return this.sql;
    }

    kanbanDisponible(): boolean {
        return !!window.TaskBoardBridge?.isAvailable();
    }

    private async activateView(): Promise<void> {
        const { workspace } = this.app;
        let leaf = workspace.getLeavesOfType(VIEW_TYPE)[0];
        if (!leaf) {
            leaf = workspace.getLeaf(true);
            await leaf.setViewState({ type: VIEW_TYPE, active: true });
        }
        workspace.revealLeaf(leaf);
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

        if (!this.plugin.kanbanDisponible()) {
            root.createEl("p", {
                text: "⚠️ Activa el plugin local vault-task-board para sincronizar tareas con el tablero."
            });
        }

        try {
            const SQL = await this.plugin.ensureSql();
            const dbPath = window.AgendaDB.DB_RELATIVE;
            const kanbanPath = window.AgendaDB.KANBAN_DB_RELATIVE;

            if (!window.ScriptsRuntime.puedeUsarFs()) {
                await window.ScriptsRuntime.leerBinarioAsync(kanbanPath);
            }

            let db = await window.AgendaDB.init(SQL, dbPath);
            const migrado = await window.AgendaDB.migrarDesdeFrontmatterSiVacio(this.app, db, dbPath);
            if (migrado) new Notice("📦 Datos migrados del frontmatter a SQLite");

            window.AgendaUI.injectStyles();

            const ejecutarRender = async () => {
                this.plugin.conectarTaskBoard();
                db = await window.AgendaDB.init(SQL, dbPath);
                root.empty();
                await window.AgendaUI.renderDashboard(root, db, dbPath, ejecutarRender, {
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
