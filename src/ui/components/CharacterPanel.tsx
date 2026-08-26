import type { JSX } from "preact";
import { useMemo, useState } from "preact/hooks";
import { baseUrl, resUrl } from "../../config";
import type { SceneApi } from "../../scene/sceneApi";
import type { FilterEntry, SceneState, TabMode } from "../../scene/sceneState";
import type { BaseCharData } from "../../sceneBuilder.types";
import { filterBy, findCharByName, sortBy } from "../../sceneBuilder.utils";
import { useCharacterSearch } from "../hooks/useCharacterSearch";
import { getFiltersForTab } from "./filters/filterDefs";

interface Props {
    api: SceneApi;
    state: SceneState;
}

type NamedTab = "Genshin" | "HSR" | "ZZZ" | "WuWa" | "HNA" | "NTE";
const TAB_TEXT: { key: NamedTab; label: string; short: string }[] = [
    { key: "Genshin", label: "Genshin Impact", short: "Genshin" },
    { key: "HSR", label: "Honkai: Star Rail", short: "HSR" },
    { key: "ZZZ", label: "Zenless Zone Zero", short: "ZZZ" },
    { key: "HNA", label: "Honkai: Nexus Anima", short: "HNA" }
];

function getExtras(): Record<string, { name: string; image: string }> {
    return {
        Genshin: { name: "Paimon", image: `${baseUrl}gi/Genshin/Paimon.png` },
        HSR: { name: "Pom-Pom", image: `${baseUrl}hsr/HSR/Pom-Pom.png` },
        ZZZ: { name: "Bangboo", image: `${baseUrl}zzz/ZZZ/Bangboo.png` },
        WuWa: { name: "Abby", image: `${baseUrl}ww/WuWa/Abby.png` },
        HNA: { name: "Puddlipup", image: resUrl("res/assets/HNA/Puddlipup.png") },
        NTE: { name: "Taygedo", image: resUrl("res/assets/NTE/Taygedo.png") }
    };
}

function getFilterField(state: SceneState, tab: TabMode): FilterEntry[] {
    switch (tab) {
        case "Genshin": return state.genshinFilter;
        case "HSR": return state.hsrFilter;
        case "ZZZ": return state.zzzFilter;
        case "WuWa": return state.wuwaFilter;
        case "HNA": return state.hnaFilter;
        case "NTE": return state.nteFilter;
        default: return state.genshinFilter;
    }
}

function getMainArray(state: SceneState, tab: TabMode): BaseCharData[] {
    const cd = state.charData;
    if (!cd) return [];
    switch (tab) {
        case "Genshin": return cd.genshin;
        case "HSR": return cd.hsr;
        case "ZZZ": return cd.zzz;
        case "WuWa": return cd.wuwa;
        case "HNA": return cd.hna;
        case "NTE": return cd.nte;
        default: return cd.genshin;
    }
}

export function CharacterPanel({ api, state }: Props): JSX.Element | null {
    if (!state.isCharPanelOpen) return null;
    if (!state.charData) return null;

    const searchFn = useCharacterSearch(state.charData);
    const [dragged, setDragged] = useState(false);
    const [hoverName, setHoverName] = useState("");

    type ActiveTab = "Genshin" | "HSR" | "ZZZ" | "WuWa" | "HNA" | "NTE";
    const activeTab: ActiveTab = state.tabMode === "None" ? "Genshin" : state.tabMode;
    const filters = getFiltersForTab(activeTab);
    const filterArray = getFilterField(state, activeTab);

    const displayList = useMemo((): BaseCharData[] => {
        if (state.searchQuery.trim() !== "") {
            return searchFn(state.searchQuery);
        }
        const main = getMainArray(state, activeTab);
        const filtered = filterBy(main, filterArray as { key: keyof BaseCharData; value: string }[]);
        return sortBy(filtered, state.sortModeKey as keyof BaseCharData, state.sortModeAscending);
    }, [state, activeTab, searchFn]);

    const isFilterActive = (key: string, value: string): boolean => {
        return filterArray.some(f => f.key === key && f.value === value);
    };

    const onCharClick = async (char: BaseCharData): Promise<void> => {
        api.closeCharPanel();
        if (state.chosenCharName !== char.name) {
            await api.changeCharacter(char.name, char.id);
        } else if (state.chosenCharId !== char.id && !state.skinMode) {
            await api.changeCharacter(char.name, char.id);
        }
    };

    const onExtraClick = async (name: string): Promise<void> => {
        if (name !== "Paimon" && name !== "Pom-Pom" && name !== "Bangboo" && name !== "Abby") return;
        api.closeCharPanel();
        if (state.chosenCharName !== name) {
            await api.changeCharacter(name, 0);
        }
    };

    const extras = getExtras()[activeTab];
    const skinNames = new Set((state.charData.allSkins as BaseCharData[]).map(s => s.name));

    // Backdrop click closes (but not if user dragged their finger/mouse)
    const onBackdropMouseDown = (): void => setDragged(false);
    const onBackdropMouseMove = (): void => setDragged(true);
    const onBackdropClick = (): void => {
        if (!dragged) api.closeCharPanel();
        setDragged(false);
    };

    // Small helper for filter button
    const FilterBtn = ({ f, keyPrefix }: { f: { icon: string; key: string; value: string; label: string }; keyPrefix: string }): JSX.Element => (
        <button
            key={`${keyPrefix}-${f.value}`}
            class={`w-9 h-9 sm:w-10 sm:h-10 rounded shrink-0 ${isFilterActive(f.key, f.value) ? "bg-[rgb(44,48,50)]" : ""}`}
            onClick={(): void => api.setFilter(activeTab, f.key, f.value)}
            onMouseEnter={(): void => setHoverName(f.label)}
            onMouseLeave={(): void => setHoverName("")}
            title={f.label}
        >
            <img src={resUrl(f.icon)} class="w-full h-full object-contain" />
        </button>
    );

    return (
        <div
            class="pointer-events-auto fixed inset-0 flex items-stretch justify-center sm:items-center bg-black/40"
            onMouseDown={onBackdropMouseDown}
            onMouseMove={onBackdropMouseMove}
            onClick={onBackdropClick}
        >
            <div
                class="relative bg-[rgb(44,48,50)] text-white shadow-2xl flex flex-col
                       w-full h-full rounded-none border-0
                       sm:w-[720px] sm:max-w-[95vw] sm:h-[920px] sm:max-h-[95vh] sm:rounded-2xl sm:border-2 sm:border-black"
                onClick={(e): void => e.stopPropagation()}
                onMouseDown={(e): void => e.stopPropagation()}
                onMouseMove={(e): void => e.stopPropagation()}
            >
                {/* Close button — absolutely positioned over the tab bar area (mobile-essential) */}
                <button
                    class="absolute right-2 top-2 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white text-xl leading-none sm:hidden"
                    onClick={(): void => api.closeCharPanel()}
                    aria-label="Close"
                    title="Close"
                >
                    ✕
                </button>

                {/* Tab bar */}
                <div class="flex justify-center gap-1 sm:gap-2 p-2 sm:p-3 pr-12 sm:pr-3">
                    {TAB_TEXT.map(t => (
                        <button
                            key={t.key}
                            class={`text-xs sm:text-sm px-2 sm:px-3 py-2 rounded-xl flex-1 sm:flex-none sm:w-[170px] ${state.tabMode === t.key ? "bg-[rgb(64,68,70)]" : "bg-transparent"}`}
                            onClick={(): void => api.setTab(t.key)}
                        >
                            <span class="hidden sm:inline">{t.label}</span>
                            <span class="sm:hidden">{t.short}</span>
                        </button>
                    ))}
                </div>

                {/* Filter bar row 1: sort + rarity + hover-name + element filters
                    On mobile: wrap freely, auto-height.
                    On desktop: single 50px row with right-aligned element filters. */}
                <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 px-2 sm:px-3 py-2 sm:py-0 sm:h-[50px] bg-[rgb(64,68,70)]">
                    <button
                        class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0"
                        onClick={(): void => api.toggleSortAscending()}
                    >
                        <img src={resUrl(state.sortModeAscending ? "res/assets/ascending.png" : "res/assets/descending.png")} class="w-7 h-7 sm:w-8 sm:h-8" />
                    </button>
                    <button
                        class="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-[rgb(44,48,50)] shrink-0"
                        onClick={(): void => api.toggleSortModeKey()}
                    >
                        {state.sortModeKey === "id" ? " Release " : " Name "}
                    </button>
                    {filters.rarity.map(f => <FilterBtn key={`r-${f.value}`} f={f} keyPrefix="r" />)}
                    <div class="hidden sm:block flex-1" />
                    <div class="hidden sm:block text-base text-white truncate select-none pr-2">{hoverName}</div>
                    {/* Element filters — right-aligned on desktop, inline on mobile */}
                    {filters.element.map(f => <FilterBtn key={`e-${f.value}`} f={f} keyPrefix="e" />)}
                </div>

                {/* Filter bar row 2: WuWa/NTE + search + weapon filters */}
                <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 px-2 sm:px-3 py-2 sm:py-0 sm:h-[50px] bg-[rgb(64,68,70)] sm:rounded-b-xl">
                    <button
                        class={`w-9 h-9 sm:w-10 sm:h-10 rounded shrink-0 ${state.tabMode === "WuWa" ? "bg-[rgb(44,48,50)]" : ""}`}
                        onClick={(): void => api.setTab("WuWa")}
                        onMouseEnter={(): void => setHoverName("Wuthering Waves")}
                        onMouseLeave={(): void => setHoverName("")}
                        title="Wuthering Waves"
                    >
                        <img src={resUrl("res/assets/tacet.png")} class="w-full h-full object-contain" />
                    </button>
                    <button
                        class={`w-9 h-9 sm:w-10 sm:h-10 rounded shrink-0 ${state.tabMode === "NTE" ? "bg-[rgb(44,48,50)]" : ""}`}
                        onClick={(): void => api.setTab("NTE")}
                        onMouseEnter={(): void => setHoverName("Neverness To Everness")}
                        onMouseLeave={(): void => setHoverName("")}
                        title="Neverness To Everness"
                    >
                        <img src={resUrl("res/assets/nte.png")} class="w-full h-full object-contain" />
                    </button>
                    {/* Search box */}
                    <div class="flex items-center bg-[rgb(44,48,50)] rounded-2xl px-2 h-9 sm:h-10 shrink-0">
                        <img src={resUrl("res/assets/search.png")} class="w-5 h-5 sm:w-6 sm:h-6" />
                        <input
                            type="text"
                            placeholder="Find..."
                            class="bg-transparent outline-none text-white w-20 sm:w-20 px-1 text-sm sm:text-base"
                            value={state.searchQuery}
                            onInput={(e): void => api.setSearchQuery((e.currentTarget as HTMLInputElement).value)}
                        />
                        {state.searchQuery && (
                            <img
                                src={resUrl("res/assets/clear.png")}
                                class="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
                                onClick={(): void => api.setSearchQuery("")}
                            />
                        )}
                    </div>
                    <div class="hidden sm:block flex-1" />
                    {/* Weapon filters */}
                    {filters.weapon.map(f => <FilterBtn key={`w-${f.value}`} f={f} keyPrefix="w" />)}
                </div>

                {/* Mobile-only hover-name row (desktop shows it inline in row 1) */}
                {hoverName && (
                    <div class="sm:hidden text-sm text-white bg-[rgb(64,68,70)] px-3 py-1 truncate">
                        {hoverName}
                    </div>
                )}

                {/* Character grid */}
                <div class="flex-1 overflow-y-auto p-2">
                    <div class="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {displayList.map((char): JSX.Element => {
                            let bg = "rgb(123,92,144)";
                            if (char.rarity === 5) bg = "rgb(146,109,69)";
                            else if (char.rarity === 6) bg = "rgb(192,79,85)";
                            const hasSkin = findCharByName(state.charData!.allSkins, char.name) !== undefined || skinNames.has(char.name);
                            return (
                                <button
                                    key={char.id}
                                    class="relative rounded-lg overflow-hidden aspect-square"
                                    style={{ background: bg }}
                                    onClick={async (): Promise<void> => await onCharClick(char)}
                                    onMouseEnter={(): void => setHoverName(char.name)}
                                    onMouseLeave={(): void => setHoverName("")}
                                    title={char.name}
                                >
                                    <img src={`${baseUrl}${char.image}`} class="w-full h-full object-cover" />
                                    {hasSkin && (
                                        <img
                                            src={resUrl("res/assets/skin_icon.png")}
                                            class="absolute top-1 right-1 w-5 h-5"
                                        />
                                    )}
                                </button>
                            );
                        })}
                        {/* Extras cell */}
                        {extras && state.searchQuery.trim() === "" && (
                            <button
                                class="relative rounded-lg overflow-hidden aspect-square bg-[rgb(64,68,70)]"
                                onClick={async (): Promise<void> => await onExtraClick(extras.name)}
                                onMouseEnter={(): void => setHoverName(extras.name)}
                                onMouseLeave={(): void => setHoverName("")}
                                title={extras.name}
                            >
                                <img src={extras.image} class="w-full h-full object-cover" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}