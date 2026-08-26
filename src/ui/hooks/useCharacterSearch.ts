import { useMemo } from "preact/hooks";
import miniSearch from "minisearch";
import type { BaseCharData } from "../../sceneBuilder.types";
import type { CharacterData } from "../../scene/sceneState";
import { getFirstDigit, findCharByName, normalize } from "../../sceneBuilder.utils";

export function useCharacterSearch(charData: CharacterData | null): (query: string) => BaseCharData[] {
    return useMemo(() => {
        if (!charData) return (): BaseCharData[] => [];
        const all: BaseCharData[] = [
            ...charData.genshin,
            ...charData.hsr,
            ...charData.zzz,
            ...charData.wuwa,
            ...charData.hna,
            ...charData.nte
        ];
        const ms = new miniSearch({
            fields: ["name"],
            storeFields: ["id", "name"],
            searchOptions: { fuzzy: 0.2, prefix: true }
        });
        ms.addAll(all);
        return (query: string): BaseCharData[] => {
            const normalized = normalize(query);
            if (!normalized) return [];
            const results = ms.search(normalized);
            const out: BaseCharData[] = [];
            for (const r of results) {
                const digit = getFirstDigit(r.id);
                let arr: BaseCharData[];
                if (digit === 1) arr = charData.genshin;
                else if (digit === 2) arr = charData.hsr;
                else if (digit === 3) arr = charData.zzz;
                else if (digit === 4) arr = charData.wuwa;
                else if (digit === 5) arr = charData.hna;
                else arr = charData.nte;
                const c = findCharByName(arr, r.name);
                if (c) out.push(c);
            }
            return out;
        };
    }, [charData]);
}