import * as gui from "@babylonjs/gui";
import type { NTECharData } from "../sceneBuilder.types";

export type NteFilterItem = { key: keyof NTECharData; value: string };

export type NteUIController = {
    hide(): void;
    showAll(): void;
    reset(): void;
};

export function createNteUI(params: {
    filterBar: gui.Rectangle;
    filterBar2: gui.Rectangle;
    hoverCharName: gui.TextBlock;
    charPanel: gui.Rectangle;
    sortModeChanger: gui.Button;
    filterArray: NteFilterItem[];
    applyFilter: () => void;
}): NteUIController {
    const {
        filterBar,
        filterBar2,
        hoverCharName,
        charPanel,
        sortModeChanger,
        filterArray,
        applyFilter
    } = params;

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

    const rarity4Button = createIconButton("res/assets/NTE/rank-a.png", -188, () => {
        toggleFilter(rarity4Button, "rarity", "4", clearRarityBG);
    }, "");

    const rarity5Button = createIconButton("res/assets/NTE/rank-s.png", -148, () => {
        toggleFilter(rarity5Button, "rarity", "5", clearRarityBG);
    }, "");

    filterBar.addControl(rarity4Button);
    filterBar.addControl(rarity5Button);

    const animaButton = createIconButton("res/assets/NTE/anima.png", 52, () => {
        toggleFilter(animaButton, "element", "Anima", offElementBG);
    }, "Anima");

    const chaosButton = createIconButton("res/assets/NTE/chaos.png", 92, () => {
        toggleFilter(chaosButton, "element", "Chaos", offElementBG);
    }, "Chaos");

    const cosmosButton = createIconButton("res/assets/NTE/cosmos.png", 132, () => {
        toggleFilter(cosmosButton, "element", "Cosmos", offElementBG);
    }, "Cosmos");

    const incantationButton = createIconButton("res/assets/NTE/incantation.png", 172, () => {
        toggleFilter(incantationButton, "element", "Incantation", offElementBG);
    }, "Incantation");

    const lakshanaButton = createIconButton("res/assets/NTE/lakshana.png", 212, () => {
        toggleFilter(lakshanaButton, "element", "Lakshana", offElementBG);
    }, "Lakshana");

    const psycheButton = createIconButton("res/assets/NTE/psyche.png", 252, () => {
        toggleFilter(psycheButton, "element", "Psyche", offElementBG);
    }, "Psyche");

    filterBar.addControl(animaButton);
    filterBar.addControl(chaosButton);
    filterBar.addControl(cosmosButton);
    filterBar.addControl(incantationButton);
    filterBar.addControl(lakshanaButton);
    filterBar.addControl(psycheButton);

    const synthesisButton = createIconButton("res/assets/NTE/arc_Synthesis.png", 92, () => {
        toggleFilter(synthesisButton, "weaponType", "Synthesis", offWeaponBG);
    }, "Synthesis");

    const gasButton = createIconButton("res/assets/NTE/arc_Gas.png", 132, () => {
        toggleFilter(gasButton, "weaponType", "Gas", offWeaponBG);
    }, "Gas");

    const liquidButton = createIconButton("res/assets/NTE/arc_Liquid.png", 172, () => {
        toggleFilter(liquidButton, "weaponType", "Liquid", offWeaponBG);
    }, "Liquid");

    const plasmaButton = createIconButton("res/assets/NTE/arc_Plasma.png", 212, () => {
        toggleFilter(plasmaButton, "weaponType", "Plasma", offWeaponBG);
    }, "Plasma");

    const solidButton = createIconButton("res/assets/NTE/arc_Solid.png", 252, () => {
        toggleFilter(solidButton, "weaponType", "Solid", offWeaponBG);
    }, "Solid");

    filterBar2.addControl(synthesisButton);
    filterBar2.addControl(gasButton);
    filterBar2.addControl(liquidButton);
    filterBar2.addControl(plasmaButton);
    filterBar2.addControl(solidButton);

    function clearRarityBG(): void {
        rarity4Button.background = "rgba(0,0,0,0)";
        rarity5Button.background = "rgba(0,0,0,0)";
    }

    function offElementBG(): void {
        animaButton.background = "rgba(0,0,0,0)";
        chaosButton.background = "rgba(0,0,0,0)";
        cosmosButton.background = "rgba(0,0,0,0)";
        incantationButton.background = "rgba(0,0,0,0)";
        lakshanaButton.background = "rgba(0,0,0,0)";
        psycheButton.background = "rgba(0,0,0,0)";
    }

    function offWeaponBG(): void {
        synthesisButton.background = "rgba(0,0,0,0)";
        gasButton.background = "rgba(0,0,0,0)";
        liquidButton.background = "rgba(0,0,0,0)";
        plasmaButton.background = "rgba(0,0,0,0)";
        solidButton.background = "rgba(0,0,0,0)";
    }

    function toggleFilter(
        button: gui.Button,
        key: keyof NTECharData,
        value: string,
        clearGroupBg: () => void
    ): void {
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
        const allControls = [
            rarity4Button,
            rarity5Button,
            animaButton,
            chaosButton,
            cosmosButton,
            incantationButton,
            lakshanaButton,
            psycheButton,
            synthesisButton,
            gasButton,
            liquidButton,
            plasmaButton,
            solidButton
        ];
        allControls.forEach(c => {
            c.isVisible = visible;
        });
        sortModeChanger.isVisible = visible;
    }

    return {
        hide: () => setVisible(false),
        showAll: () => setVisible(true),
        reset: () => {
            setVisible(false);
            clearRarityBG();
            offElementBG();
            offWeaponBG();
            filterArray.length = 0;
            applyFilter();
        }
    };
}