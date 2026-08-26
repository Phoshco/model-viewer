import type { BaseCharData, GenshinCharData, HSRCharData, ZZZCharData, WuwaCharData, HNACharData, NTECharData } from "../sceneBuilder.types";

export type TabMode = "Genshin" | "HSR" | "ZZZ" | "WuWa" | "HNA" | "NTE" | "None";

export type SortModeKey = "id" | "name";

export interface CharacterData {
    genshin: GenshinCharData[];
    genshinSkins: GenshinCharData[];
    hsr: HSRCharData[];
    hsrSkins: HSRCharData[];
    zzz: ZZZCharData[];
    zzzSkins: ZZZCharData[];
    wuwa: WuwaCharData[];
    wuwaSkins: WuwaCharData[];
    hna: HNACharData[];
    hnaSkins: HNACharData[];
    nte: NTECharData[];
    nteSkins: NTECharData[];
    allSkins: BaseCharData[];
}

export interface FilterEntry {
    key: string;
    value: string;
}

export interface SceneState {
    chosenCharName: string;
    chosenCharId: number;
    tabMode: TabMode;
    darkMode: boolean;
    charScreenMode: boolean;
    skinMode: boolean;
    hasSkinButton: boolean;
    physicsModeOn: boolean;
    isPlaying: boolean;
    motionName: string;
    isCharPanelOpen: boolean;
    isTrackPanelOpen: boolean;
    // per-tab filters
    genshinFilter: FilterEntry[];
    hsrFilter: FilterEntry[];
    zzzFilter: FilterEntry[];
    wuwaFilter: FilterEntry[];
    hnaFilter: FilterEntry[];
    nteFilter: FilterEntry[];
    sortModeAscending: boolean;
    sortModeKey: SortModeKey;
    searchQuery: string;
    charData: CharacterData | null;
    isMobile: boolean;
}

type Listener = (state: SceneState) => void;

export class SceneStateStore {
    private state: SceneState;
    private listeners = new Set<Listener>();

    public constructor(initial: SceneState) {
        this.state = initial;
    }

    public get(): SceneState {
        return this.state;
    }

    public set(patch: Partial<SceneState>): void {
        this.state = { ...this.state, ...patch };
        this.listeners.forEach(l => l(this.state));
    }

    public subscribe(l: Listener): () => void {
        this.listeners.add(l);
        return (): void => {
            this.listeners.delete(l);
        };
    }
}

export function createInitialState(isMobile: boolean): SceneState {
    return {
        chosenCharName: "",
        chosenCharId: 0,
        tabMode: "Genshin",
        darkMode: true,
        charScreenMode: true,
        skinMode: false,
        hasSkinButton: false,
        physicsModeOn: false,
        isPlaying: false,
        motionName: "",
        isCharPanelOpen: false,
        isTrackPanelOpen: false,
        genshinFilter: [{ key: "id", value: "1000" }],
        hsrFilter: [{ key: "id", value: "2000" }],
        zzzFilter: [{ key: "id", value: "3000" }],
        wuwaFilter: [{ key: "id", value: "4000" }],
        hnaFilter: [{ key: "id", value: "5000" }],
        nteFilter: [{ key: "id", value: "6000" }],
        sortModeAscending: false,
        sortModeKey: "id",
        searchQuery: "",
        charData: null,
        isMobile
    };
}