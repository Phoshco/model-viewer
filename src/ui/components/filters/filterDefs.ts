// Per-tab filter definitions (icon path + filter key + value + hover label).
// Icon paths are stored as bundled-asset relative paths (like "res/assets/..."),
// and consumers should wrap them with `resUrl()` from `../../config` at render time.
export interface FilterButtonDef {
    icon: string;
    key: string;
    value: string;
    label: string;
}

export interface GameFilters {
    rarity: FilterButtonDef[];
    element: FilterButtonDef[];
    weapon: FilterButtonDef[];
}

export const genshinFilters: GameFilters = {
    rarity: [
        { icon: "res/assets/Genshin/rarity_4.png", key: "rarity", value: "4", label: "4★" },
        { icon: "res/assets/Genshin/rarity_5.png", key: "rarity", value: "5", label: "5★" }
    ],
    element: [
        { icon: "res/assets/Genshin/element_anemo.png", key: "element", value: "Anemo", label: "Anemo" },
        { icon: "res/assets/Genshin/element_geo.png", key: "element", value: "Geo", label: "Geo" },
        { icon: "res/assets/Genshin/element_electro.png", key: "element", value: "Electro", label: "Electro" },
        { icon: "res/assets/Genshin/element_dendro.png", key: "element", value: "Dendro", label: "Dendro" },
        { icon: "res/assets/Genshin/element_hydro.png", key: "element", value: "Hydro", label: "Hydro" },
        { icon: "res/assets/Genshin/element_pyro.png", key: "element", value: "Pyro", label: "Pyro" },
        { icon: "res/assets/Genshin/element_cryo.png", key: "element", value: "Cryo", label: "Cryo" }
    ],
    weapon: [
        { icon: "res/assets/Genshin/Sword.png", key: "weaponType", value: "Sword", label: "Sword" },
        { icon: "res/assets/Genshin/Catalyst.png", key: "weaponType", value: "Catalyst", label: "Catalyst" },
        { icon: "res/assets/Genshin/Bow.png", key: "weaponType", value: "Bow", label: "Bow" },
        { icon: "res/assets/Genshin/Claymore.png", key: "weaponType", value: "Claymore", label: "Claymore" },
        { icon: "res/assets/Genshin/Pole.png", key: "weaponType", value: "Polearm", label: "Polearm" }
    ]
};

export const hsrFilters: GameFilters = {
    rarity: [
        { icon: "res/assets/HSR/rarity_5.png", key: "rarity", value: "5", label: "5★" },
        { icon: "res/assets/HSR/rarity_4.png", key: "rarity", value: "4", label: "4★" }
    ],
    element: [
        { icon: "res/assets/HSR/element_fire.png", key: "element", value: "Fire", label: "Fire" },
        { icon: "res/assets/HSR/element_ice.png", key: "element", value: "Ice", label: "Ice" },
        { icon: "res/assets/HSR/element_imaginary.png", key: "element", value: "Imaginary", label: "Imaginary" },
        { icon: "res/assets/HSR/element_lightning.png", key: "element", value: "Lightning", label: "Lightning" },
        { icon: "res/assets/HSR/element_physical.png", key: "element", value: "Physical", label: "Physical" },
        { icon: "res/assets/HSR/element_quantum.png", key: "element", value: "Quantum", label: "Quantum" },
        { icon: "res/assets/HSR/element_wind.png", key: "element", value: "Wind", label: "Wind" }
    ],
    weapon: [
        { icon: "res/assets/HSR/path_the_abundance.png", key: "weaponType", value: "Abundance", label: "Abundance" },
        { icon: "res/assets/HSR/path_the_destruction.png", key: "weaponType", value: "Destruction", label: "Destruction" },
        { icon: "res/assets/HSR/path_the_erudition.png", key: "weaponType", value: "Erudition", label: "Erudition" },
        { icon: "res/assets/HSR/path_the_harmony.png", key: "weaponType", value: "Harmony", label: "Harmony" },
        { icon: "res/assets/HSR/path_the_hunt.png", key: "weaponType", value: "Hunt", label: "Hunt" },
        { icon: "res/assets/HSR/path_the_nihility.png", key: "weaponType", value: "Nihility", label: "Nihility" },
        { icon: "res/assets/HSR/path_the_preservation.png", key: "weaponType", value: "Preservation", label: "Preservation" },
        { icon: "res/assets/HSR/path_the_remembrance.png", key: "weaponType", value: "Remembrance", label: "Remembrance" },
        { icon: "res/assets/HSR/path_the_elation.png", key: "weaponType", value: "Elation", label: "Elation" }
    ]
};

export const zzzFilters: GameFilters = {
    rarity: [
        { icon: "res/assets/ZZZ/Icon_AgentRank_A.png", key: "rarity", value: "4", label: "A" },
        { icon: "res/assets/ZZZ/Icon_AgentRank_S.png", key: "rarity", value: "5", label: "S" }
    ],
    element: [
        { icon: "res/assets/ZZZ/Icon_Electric.png", key: "element", value: "Electric", label: "Electric" },
        { icon: "res/assets/ZZZ/Icon_Ether.png", key: "element", value: "Ether", label: "Ether" },
        { icon: "res/assets/ZZZ/Icon_Fire.png", key: "element", value: "Fire", label: "Fire" },
        { icon: "res/assets/ZZZ/Icon_Ice.png", key: "element", value: "Ice", label: "Ice" },
        { icon: "res/assets/ZZZ/Icon_Physical.png", key: "element", value: "Physical", label: "Physical" },
        { icon: "res/assets/ZZZ/Icon_Wind.png", key: "element", value: "Wind", label: "Wind" },
        { icon: "res/assets/ZZZ/Icon_Lumiflux.png", key: "element", value: "Lumiflux", label: "Lumiflux" }
    ],
    weapon: [
        { icon: "res/assets/ZZZ/Icon_Anomaly.png", key: "weaponType", value: "Anomaly", label: "Anomaly" },
        { icon: "res/assets/ZZZ/Icon_Attack.png", key: "weaponType", value: "Attack", label: "Attack" },
        { icon: "res/assets/ZZZ/Icon_Defense.png", key: "weaponType", value: "Defense", label: "Defense" },
        { icon: "res/assets/ZZZ/Icon_Stun.png", key: "weaponType", value: "Stun", label: "Stun" },
        { icon: "res/assets/ZZZ/Icon_Support.png", key: "weaponType", value: "Support", label: "Support" },
        { icon: "res/assets/ZZZ/Icon_Rupture.png", key: "weaponType", value: "Rupture", label: "Rupture" }
    ]
};

export const wuwaFilters: GameFilters = {
    rarity: [
        { icon: "res/assets/WuWa/rarity_4.png", key: "rarity", value: "4", label: "4★" },
        { icon: "res/assets/WuWa/rarity_5.png", key: "rarity", value: "5", label: "5★" }
    ],
    element: [
        { icon: "res/assets/WuWa/Aero.png", key: "element", value: "Aero", label: "Aero" },
        { icon: "res/assets/WuWa/Spectro.png", key: "element", value: "Spectro", label: "Spectro" },
        { icon: "res/assets/WuWa/Electro.png", key: "element", value: "Electro", label: "Electro" },
        { icon: "res/assets/WuWa/Havoc.png", key: "element", value: "Havoc", label: "Havoc" },
        { icon: "res/assets/WuWa/Glacio.png", key: "element", value: "Glacio", label: "Glacio" },
        { icon: "res/assets/WuWa/Fusion.png", key: "element", value: "Fusion", label: "Fusion" }
    ],
    weapon: [
        { icon: "res/assets/WuWa/Sword_Icon.png", key: "weaponType", value: "Sword", label: "Sword" },
        { icon: "res/assets/WuWa/Rectifier_Icon.png", key: "weaponType", value: "Rectifier", label: "Rectifier" },
        { icon: "res/assets/WuWa/Pistols_Icon.png", key: "weaponType", value: "Pistols", label: "Pistols" },
        { icon: "res/assets/WuWa/Gauntlets_Icon.png", key: "weaponType", value: "Gauntlets", label: "Gauntlets" },
        { icon: "res/assets/WuWa/Broadblade_Icon.png", key: "weaponType", value: "Broadblade", label: "Broadblade" }
    ]
};

export const hnaFilters: GameFilters = {
    rarity: [
        { icon: "res/assets/HNA/rarity_4.png", key: "rarity", value: "4", label: "4★" },
        { icon: "res/assets/HNA/rarity_5.png", key: "rarity", value: "5", label: "5★" }
    ],
    element: [],
    weapon: []
};

export const nteFilters: GameFilters = {
    rarity: [
        { icon: "res/assets/NTE/rank-a.png", key: "rarity", value: "4", label: "A" },
        { icon: "res/assets/NTE/rank-s.png", key: "rarity", value: "5", label: "S" }
    ],
    element: [
        { icon: "res/assets/NTE/anima.png", key: "element", value: "Anima", label: "Anima" },
        { icon: "res/assets/NTE/chaos.png", key: "element", value: "Chaos", label: "Chaos" },
        { icon: "res/assets/NTE/cosmos.png", key: "element", value: "Cosmos", label: "Cosmos" },
        { icon: "res/assets/NTE/incantation.png", key: "element", value: "Incantation", label: "Incantation" },
        { icon: "res/assets/NTE/lakshana.png", key: "element", value: "Lakshana", label: "Lakshana" },
        { icon: "res/assets/NTE/psyche.png", key: "element", value: "Psyche", label: "Psyche" }
    ],
    weapon: [
        { icon: "res/assets/NTE/arc_Synthesis.png", key: "weaponType", value: "Synthesis", label: "Synthesis" },
        { icon: "res/assets/NTE/arc_Gas.png", key: "weaponType", value: "Gas", label: "Gas" },
        { icon: "res/assets/NTE/arc_Liquid.png", key: "weaponType", value: "Liquid", label: "Liquid" },
        { icon: "res/assets/NTE/arc_Plasma.png", key: "weaponType", value: "Plasma", label: "Plasma" },
        { icon: "res/assets/NTE/arc_Solid.png", key: "weaponType", value: "Solid", label: "Solid" }
    ]
};

export function getFiltersForTab(tab: string): GameFilters {
    switch (tab) {
        case "Genshin": return genshinFilters;
        case "HSR": return hsrFilters;
        case "ZZZ": return zzzFilters;
        case "WuWa": return wuwaFilters;
        case "HNA": return hnaFilters;
        case "NTE": return nteFilters;
        default: return genshinFilters;
    }
}