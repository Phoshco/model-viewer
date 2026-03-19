import * as gui from "@babylonjs/gui";
import type { WuwaCharData } from "../sceneBuilder.types";

export type WuwaFilterItem = { key: keyof WuwaCharData; value: string };

export type WuwaUIController = {
    hide(): void;
    showAll(): void;
    reset(): void;
};

export function createWuwaUI(params: {
    filterBar: gui.Rectangle;
    filterBar2: gui.Rectangle;
    hoverCharName: gui.TextBlock;
    charPanel: gui.Rectangle;
    sortModeChanger: gui.Button;
    filterArray: WuwaFilterItem[];
    applyFilter: () => void;
}): WuwaUIController {
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

    const rarity4Button = createIconButton("res/assets/WuWa/rarity_4.png", -188, () => {
        toggleFilter(rarity4Button, "rarity", "4", clearRarityBG);
    }, "");

    const rarity5Button = createIconButton("res/assets/WuWa/rarity_5.png", -148, () => {
        toggleFilter(rarity5Button, "rarity", "5", clearRarityBG);
    }, "");

    filterBar.addControl(rarity4Button);
    filterBar.addControl(rarity5Button);

    const aeroButton = createIconButton("res/assets/WuWa/Aero.png", 52, () => {
        toggleFilter(aeroButton, "element", "Aero", offElementBG);
    }, "Aero");

    const spectroButton = createIconButton("res/assets/WuWa/Spectro.png", 92, () => {
        toggleFilter(spectroButton, "element", "Spectro", offElementBG);
    }, "Spectro");

    const electroButton = createIconButton("res/assets/WuWa/Electro.png", 132, () => {
        toggleFilter(electroButton, "element", "Electro", offElementBG);
    }, "Electro");

    const havocButton = createIconButton("res/assets/WuWa/Havoc.png", 172, () => {
        toggleFilter(havocButton, "element", "Havoc", offElementBG);
    }, "Havoc");

    const glacioButton = createIconButton("res/assets/WuWa/Glacio.png", 212, () => {
        toggleFilter(glacioButton, "element", "Glacio", offElementBG);
    }, "Glacio");

    const fusionButton = createIconButton("res/assets/WuWa/Fusion.png", 252, () => {
        toggleFilter(fusionButton, "element", "Fusion", offElementBG);
    }, "Fusion");

    filterBar.addControl(aeroButton);
    filterBar.addControl(spectroButton);
    filterBar.addControl(electroButton);
    filterBar.addControl(havocButton);
    filterBar.addControl(glacioButton);
    filterBar.addControl(fusionButton);

    const swordButton = createIconButton("res/assets/WuWa/Sword_Icon.png", 92, () => {
        toggleFilter(swordButton, "weaponType", "Sword", offWeaponBG);
    }, "Sword");

    const rectifierButton = createIconButton("res/assets/WuWa/Rectifier_Icon.png", 132, () => {
        toggleFilter(rectifierButton, "weaponType", "Rectifier", offWeaponBG);
    }, "Rectifier");

    const pistolsButton = createIconButton("res/assets/WuWa/Pistols_Icon.png", 172, () => {
        toggleFilter(pistolsButton, "weaponType", "Pistols", offWeaponBG);
    }, "Pistols");

    const gauntletsButton = createIconButton("res/assets/WuWa/Gauntlets_Icon.png", 212, () => {
        toggleFilter(gauntletsButton, "weaponType", "Gauntlets", offWeaponBG);
    }, "Gauntlets");

    const broadbladeButton = createIconButton("res/assets/WuWa/Broadblade_Icon.png", 252, () => {
        toggleFilter(broadbladeButton, "weaponType", "Broadblade", offWeaponBG);
    }, "Broadblade");

    filterBar2.addControl(swordButton);
    filterBar2.addControl(rectifierButton);
    filterBar2.addControl(pistolsButton);
    filterBar2.addControl(gauntletsButton);
    filterBar2.addControl(broadbladeButton);

    function clearRarityBG(): void {
        rarity4Button.background = "rgba(0,0,0,0)";
        rarity5Button.background = "rgba(0,0,0,0)";
    }

    function offElementBG(): void {
        aeroButton.background = "rgba(0,0,0,0)";
        spectroButton.background = "rgba(0,0,0,0)";
        electroButton.background = "rgba(0,0,0,0)";
        havocButton.background = "rgba(0,0,0,0)";
        glacioButton.background = "rgba(0,0,0,0)";
        fusionButton.background = "rgba(0,0,0,0)";
    }

    function offWeaponBG(): void {
        swordButton.background = "rgba(0,0,0,0)";
        rectifierButton.background = "rgba(0,0,0,0)";
        pistolsButton.background = "rgba(0,0,0,0)";
        gauntletsButton.background = "rgba(0,0,0,0)";
        broadbladeButton.background = "rgba(0,0,0,0)";
    }

    function toggleFilter(
        button: gui.Button,
        key: keyof WuwaCharData,
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
        const showOrHide = (b: gui.Control) => {
            b.isVisible = visible;
        };

        [
            rarity4Button,
            rarity5Button,
            aeroButton,
            spectroButton,
            electroButton,
            havocButton,
            glacioButton,
            fusionButton,
            swordButton,
            rectifierButton,
            pistolsButton,
            gauntletsButton,
            broadbladeButton
        ].forEach(showOrHide);

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
