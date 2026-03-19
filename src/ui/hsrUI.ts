import * as gui from "@babylonjs/gui";
import type { HSRCharData } from "../sceneBuilder.types";

export type HSRFilterItem = { key: keyof HSRCharData; value: string };

export type HSRUIController = {
    hide(): void;
    showAll(): void;
    reset(): void;
    setSortModeSource(imagePath: string): void;
};

export function createHsrUI(params: {
    filterBar: gui.Rectangle;
    filterBar2: gui.Rectangle;
    hoverCharName: gui.TextBlock;
    charPanel: gui.Rectangle;
    sortModeChanger: gui.Button;
    filterArray: HSRFilterItem[];
    applyFilter: () => void;
    onSortModeChange?: () => void;
}): HSRUIController {
    const { filterBar, filterBar2, hoverCharName, charPanel, sortModeChanger, filterArray, applyFilter, onSortModeChange } = params;

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

    const hsrSortModeChanger = gui.Button.CreateImageOnlyButton("but", "res/assets/release.png");
    hsrSortModeChanger.height = buttonSize;
    hsrSortModeChanger.width = buttonSize;
    hsrSortModeChanger.left = -278;
    hsrSortModeChanger.thickness = 0;
    hsrSortModeChanger.onPointerClickObservable.add(() => {
        if (sortModeChanger.textBlock != null) {
            if (sortModeChanger.textBlock.text.trim() === "Release") {
                sortModeChanger.textBlock.text = " Name ";
                hsrSortModeChanger.image!.source = "res/assets/alphabet.png";
            } else {
                sortModeChanger.textBlock.text = " Release ";
                hsrSortModeChanger.image!.source = "res/assets/release.png";
            }
        }
        if (typeof onSortModeChange === "function") {
            onSortModeChange();
        } else {
            applyFilter();
        }
    });
    hsrSortModeChanger.isVisible = false;
    filterBar.addControl(hsrSortModeChanger);

    const hsrStarImage = gui.Button.CreateImageOnlyButton("but", "res/assets/HSR/rarity_5.png");
    hsrStarImage.height = buttonSize;
    hsrStarImage.width = buttonSize;
    hsrStarImage.left = -238;
    hsrStarImage.thickness = 0;
    hsrStarImage.cornerRadius = buttonRadius;
    hsrStarImage.onPointerClickObservable.add(() => {
        const index = filterArray.findIndex(obj => obj.key === "rarity");
        if (index !== -1) {
            if (filterArray[index].value === "4") {
                filterArray.splice(index, 1);
                hsrStarImage.background = "rgba(0,0,0,0)";
                hsrStarImage.image!.source = "res/assets/HSR/rarity_5.png";
            } else {
                filterArray[index].value = "4";
                hsrStarImage.background = charPanel.background;
                hsrStarImage.image!.source = "res/assets/HSR/rarity_4.png";
            }
        } else {
            filterArray.push({ key: "rarity", value: "5" });
            hsrStarImage.background = charPanel.background;
        }
        applyFilter();
    });
    hsrStarImage.isVisible = false;
    filterBar.addControl(hsrStarImage);

    const elementButtons: gui.Button[] = [];
    const pathButtons: gui.Button[] = [];

    const elementData = [
        { icon: "res/assets/HSR/element_fire.png", value: "Fire" },
        { icon: "res/assets/HSR/element_ice.png", value: "Ice" },
        { icon: "res/assets/HSR/element_imaginary.png", value: "Imaginary" },
        { icon: "res/assets/HSR/element_lightning.png", value: "Lightning" },
        { icon: "res/assets/HSR/element_physical.png", value: "Physical" },
        { icon: "res/assets/HSR/element_quantum.png", value: "Quantum" },
        { icon: "res/assets/HSR/element_wind.png", value: "Wind" }
    ];

    elementData.forEach((e, idx) => {
        const btn = createIconButton(e.icon, 52 + idx * 40, () => toggleFilter(btn, "element", e.value, offElementBG), e.value);
        elementButtons.push(btn);
        btn.isVisible = false;
        filterBar.addControl(btn);
    });

    const pathData = [
        { icon: "res/assets/HSR/path_the_abundance.png", value: "Abundance", left: -8 },
        { icon: "res/assets/HSR/path_the_destruction.png", value: "Destruction", left: 32 },
        { icon: "res/assets/HSR/path_the_erudition.png", value: "Erudition", left: 72 },
        { icon: "res/assets/HSR/path_the_harmony.png", value: "Harmony", left: 112 },
        { icon: "res/assets/HSR/path_the_hunt.png", value: "Hunt", left: 152 },
        { icon: "res/assets/HSR/path_the_nihility.png", value: "Nihility", left: 192 },
        { icon: "res/assets/HSR/path_the_preservation.png", value: "Preservation", left: 232 },
        { icon: "res/assets/HSR/path_the_remembrance.png", value: "Remembrance", left: 272 },
        { icon: "res/assets/HSR/path_the_elation.png", value: "Elation", left: 312 }
    ];

    pathData.forEach((p) => {
        const btn = createIconButton(p.icon, p.left, () => toggleFilter(btn, "weaponType", p.value, offPathBG), p.value);
        pathButtons.push(btn);
        btn.isVisible = false;
        filterBar2.addControl(btn);
    });

    function clearRarityBG(): void {
        hsrStarImage.background = "rgba(0,0,0,0)";
        hsrStarImage.image!.source = "res/assets/HSR/rarity_5.png";
    }

    function offElementBG(): void {
        elementButtons.forEach(btn => (btn.background = "rgba(0,0,0,0)"));
    }

    function offPathBG(): void {
        pathButtons.forEach(btn => (btn.background = "rgba(0,0,0,0)"));
    }

    function toggleFilter(button: gui.Button, key: keyof HSRCharData, value: string, clearGroupBg: () => void): void {
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
        [...elementButtons, ...pathButtons, hsrStarImage].forEach(c => (c.isVisible = visible));
        hsrSortModeChanger.isVisible = visible;
    }

    return {
        hide: () => setVisible(false),
        showAll: () => setVisible(true),
        reset: () => {
            setVisible(false);
            clearRarityBG();
            offElementBG();
            offPathBG();
            filterArray.length = 0;
            applyFilter();
        },
        setSortModeSource: (imagePath: string) => {
            hsrSortModeChanger.image!.source = imagePath;
        }
    };
}
