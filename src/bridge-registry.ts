import type { TaskBoardApi } from "./types";

let bridge: TaskBoardApi | undefined;

export function setTaskBoardBridge(api: TaskBoardApi | undefined): void {
    bridge = api;
}

export function getTaskBoardBridge(): TaskBoardApi | undefined {
    return bridge;
}
