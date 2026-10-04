import type { SceneStateStore } from "./sceneState";

export interface SceneApi {
    state: SceneStateStore;
    changeCharacter(name: string, id?: number): Promise<void>;
    // Opens the character panel in "add second" mode (next pick is added beside).
    beginAddSecondCharacter(): void;
    // Loads a second character beside the current one.
    addSecondCharacter(name: string, id?: number): Promise<void>;
    // Removes the second character and reverts to the single-character state.
    removeSecondCharacter(): Promise<void>;
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
    generateReferenceSheet(): Promise<void>;
    setSearchQuery(q: string): void;
    setTab(tab: "Genshin" | "HSR" | "ZZZ" | "WuWa" | "HNA" | "NTE"): void;
    setSortAscending(asc: boolean): void;
    toggleSortAscending(): void;
    toggleSortModeKey(): void;
    setFilter(tab: "Genshin" | "HSR" | "ZZZ" | "WuWa" | "HNA" | "NTE", key: string, value: string): void;
}