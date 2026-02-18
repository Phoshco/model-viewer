// Shared types extracted from sceneBuilder.ts for readability
export interface BaseCharData {
    id: number;
    name: string;
    weaponType: string;
    element: string;
    gender: string;
    rarity: number;
    directory: string;
    image: string;
    pmx: string;
}

export interface GenshinCharData extends BaseCharData {
    region: string;
}

export interface HSRCharData extends BaseCharData {}
export interface ZZZCharData extends BaseCharData { region: string }
export interface WuwaCharData extends BaseCharData {}
export interface HNACharData extends BaseCharData {}
export interface NTECharData extends BaseCharData {}
export interface ExtraCharData extends BaseCharData {}
