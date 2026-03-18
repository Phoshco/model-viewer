import * as gui from "@babylonjs/gui";
import type { GenshinCharData } from "../sceneBuilder.types";

export type GenshinFilterItem = { key: keyof GenshinCharData; value: string };

export type GenshinUIController = {
    hide(): void;
    showAll(): void;
    reset(): void;
};

export function createGenshinUI(params: {
    filterBar: gui.Rectangle;
    filterBar2: gui.Rectangle;
    hoverCharName: gui.TextBlock;
    charPanel: gui.Rectangle;
    sortModeChanger: gui.Button;
    filterArray: GenshinFilterItem[];
    applyFilter: () => void;
}): GenshinUIController {
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
    
    const rarity4Button = createIconButton("res/assets/Genshin/rarity_4.png", -188, () => {
        toggleFilter(rarity4Button, "rarity", "4", clearRarityBG);
    }, "4★");
    
    const rarity5Button = createIconButton("res/assets/Genshin/rarity_5.png", -148, () => {
        toggleFilter(rarity5Button, "rarity", "5", clearRarityBG);
    }, "5★");
    
    filterBar.addControl(rarity4Button);
    filterBar.addControl(rarity5Button);
    
    const anemoButton = createIconButton("res/assets/Genshin/element_anemo.png", 52, () => {
        toggleFilter(anemoButton, "element", "Anemo", offElementBG);
    }, "Anemo");
    
    const geoButton = createIconButton("res/assets/Genshin/element_geo.png", 92, () => {
        toggleFilter(geoButton, "element", "Geo", offElementBG);
    }, "Geo");
    
    const electroButton = createIconButton("res/assets/Genshin/element_electro.png", 132, () => {
        toggleFilter(electroButton, "element", "Electro", offElementBG);
    }, "Electro");
    
    const dendroButton = createIconButton("res/assets/Genshin/element_dendro.png", 172, () => {
        toggleFilter(dendroButton, "element", "Dendro", offElementBG);
    }, "Dendro");
    
    const hydroButton = createIconButton("res/assets/Genshin/element_hydro.png", 212, () => {
        toggleFilter(hydroButton, "element", "Hydro", offElementBG);
    }, "Hydro");
    
    const pyroButton = createIconButton("res/assets/Genshin/element_pyro.png", 252, () => {
        toggleFilter(pyroButton, "element", "Pyro", offElementBG);
    }, "Pyro");
    
    const cryoButton = createIconButton("res/assets/Genshin/element_cryo.png", 292, () => {
        toggleFilter(cryoButton, "element", "Cryo", offElementBG);
    }, "Cryo");
    
    filterBar.addControl(anemoButton);
    filterBar.addControl(geoButton);
    filterBar.addControl(electroButton);
    filterBar.addControl(dendroButton);
    filterBar.addControl(hydroButton);
    filterBar.addControl(pyroButton);
    filterBar.addControl(cryoButton);
    
    const swordButton = createIconButton("res/assets/Genshin/Sword.png", 92, () => {
        toggleFilter(swordButton, "weaponType", "Sword", offWeaponBG);
    }, "Sword");
    
    const catalystButton = createIconButton("res/assets/Genshin/Catalyst.png", 132, () => {
        toggleFilter(catalystButton, "weaponType", "Catalyst", offWeaponBG);
    }, "Catalyst");
    
    const bowButton = createIconButton("res/assets/Genshin/Bow.png", 172, () => {
        toggleFilter(bowButton, "weaponType", "Bow", offWeaponBG);
    }, "Bow");
    
    const claymoreButton = createIconButton("res/assets/Genshin/Claymore.png", 212, () => {
        toggleFilter(claymoreButton, "weaponType", "Claymore", offWeaponBG);
    }, "Claymore");
    
    const polearmButton = createIconButton("res/assets/Genshin/Pole.png", 252, () => {
        toggleFilter(polearmButton, "weaponType", "Polearm", offWeaponBG);
    }, "Polearm");
    
    filterBar2.addControl(swordButton);
    filterBar2.addControl(catalystButton);
    filterBar2.addControl(bowButton);
    filterBar2.addControl(claymoreButton);
    filterBar2.addControl(polearmButton);
    
    function clearRarityBG(): void {
        rarity4Button.background = "rgba(0,0,0,0)";
        rarity5Button.background = "rgba(0,0,0,0)";
    }

    function offElementBG(): void {
        anemoButton.background = "rgba(0,0,0,0)";
        geoButton.background = "rgba(0,0,0,0)";
        electroButton.background = "rgba(0,0,0,0)";
        dendroButton.background = "rgba(0,0,0,0)";
        hydroButton.background = "rgba(0,0,0,0)";
        pyroButton.background = "rgba(0,0,0,0)";
        cryoButton.background = "rgba(0,0,0,0)";
    }

    function offWeaponBG(): void {
        swordButton.background = "rgba(0,0,0,0)";
        catalystButton.background = "rgba(0,0,0,0)";
        bowButton.background = "rgba(0,0,0,0)";
        claymoreButton.background = "rgba(0,0,0,0)";
        polearmButton.background = "rgba(0,0,0,0)";
    }

    function toggleFilter(
        button: gui.Button,
        key: keyof GenshinCharData,
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
            anemoButton,
            geoButton,
            electroButton,
            dendroButton,
            hydroButton,
            pyroButton,
            cryoButton,
            swordButton,
            catalystButton,
            bowButton,
            claymoreButton,
            polearmButton
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