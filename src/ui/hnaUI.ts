import * as gui from "@babylonjs/gui";
import type { HNACharData } from "../sceneBuilder.types";

export type HNAFilterItem = { key: keyof HNACharData; value: string };

export type HNAUIController = {
    hide(): void;
    showAll(): void;
    reset(): void;
};

export function createHnaUI(params: {
    filterBar: gui.Rectangle;
    filterBar2: gui.Rectangle;
    hoverCharName: gui.TextBlock;
    charPanel: gui.Rectangle;
    sortModeChanger: gui.Button;
    filterArray: HNAFilterItem[];
    applyFilter: () => void;
}): HNAUIController {
    const { filterBar, hoverCharName, charPanel, sortModeChanger, filterArray, applyFilter } = params;

    const buttonSize = "40px";
    const buttonRadius = 5;

    const createIconButton = (icon: string, left: number, onClick: () => void, hoverText: string) => {
        const btn = gui.Button.CreateImageOnlyButton("but", icon);
        btn.height = buttonSize;
        btn.width = buttonSize;
        btn.left = left;
        btn.thickness = 0;
        btn.cornerRadius = buttonRadius;
        btn.onPointerClickObservable.add(onClick);
        btn.onPointerEnterObservable.add(() => {
            hoverCharName.text = hoverText;
        });
        btn.onPointerOutObservable.add(() => {
            hoverCharName.text = "";
        });
        return btn;
    };

    const rarity4Button = createIconButton("res/assets/HNA/rarity_4.png", -188, () => toggleFilter(rarity4Button, "rarity", "4", clearRarityBG), "");
    const rarity5Button = createIconButton("res/assets/HNA/rarity_5.png", -148, () => toggleFilter(rarity5Button, "rarity", "5", clearRarityBG), "");

    filterBar.addControl(rarity4Button);
    filterBar.addControl(rarity5Button);

    function clearRarityBG(): void {
        rarity4Button.background = "rgba(0,0,0,0)";
        rarity5Button.background = "rgba(0,0,0,0)";
    }

    function offHNAElementBG(): void {
        // placeholder for future element icons logic
    }
    offHNAElementBG;

    function offHNAWeaponBG(): void {
        // placeholder for future weapon icons logic
    }
    offHNAWeaponBG;

    function toggleFilter(button: gui.Button, key: keyof HNACharData, value: string, clearGroupBg: () => void): void {
        const index = filterArray.findIndex(obj => obj.key === key);
        if (index !== -1) {
            if (filterArray[index].value === value) {
                filterArray.splice(index, 1);
                button.background = "rgba(0,0,0,0)";
            } else {
                filterArray[index].value = value;
                clearGroupBg();
                button.background = charPanel.background;
            }
        } else {
            filterArray.push({ key, value });
            button.background = charPanel.background;
        }
        applyFilter();
    }

    function setVisible(visible: boolean): void {
        [rarity4Button, rarity5Button].forEach(btn => {
            btn.isVisible = visible;
        });
        sortModeChanger.isVisible = visible;
    }

    return {
        hide: () => setVisible(false),
        showAll: () => setVisible(true),
        reset: () => {
            setVisible(false);
            clearRarityBG();
            filterArray.length = 0;
            applyFilter();
        }
    };
}
