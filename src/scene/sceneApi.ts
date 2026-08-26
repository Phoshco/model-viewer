import type { SceneStateStore } from "./sceneState";

export interface SceneApi {
    state: SceneStateStore;
    changeCharacter(name: string, id?: number): Promise<void>;
    changeMotion(trackName: string): Promise<void>;
    togglePhysics(): Promise<void>;
    setDarkMode(dark: boolean): void;
    toggleDarkMode(): void;
    toggleCharScreenMode(): void;
    cycleSkin(): Promise<void>;
    openCharPanel(): void;
    closeCharPanel(): void;
    toggleCharPanel(): void;
    openTrackPanel(): void;
    closeTrackPanel(): void;
    toggleTrackPanel(): void;
    openSupport(): void;
    setSearchQuery(q: string): void;
    setTab(tab: "Genshin" | "HSR" | "ZZZ" | "WuWa" | "HNA" | "NTE"): void;
    setSortAscending(asc: boolean): void;
    toggleSortAscending(): void;
    toggleSortModeKey(): void;
    setFilter(tab: "Genshin" | "HSR" | "ZZZ" | "WuWa" | "HNA" | "NTE", key: string, value: string): void;
}