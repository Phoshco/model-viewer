import * as gui from "@babylonjs/gui";
import type { ZZZCharData } from "../sceneBuilder.types";

export type ZzzFilterItem = { key: keyof ZZZCharData; value: string };

export type ZzzUIController = {
    hide(): void;
    showAll(): void;
    reset(): void;
};
export function createZzzUI(params: {
    filterBar: gui.Rectangle;
    filterBar2: gui.Rectangle;
    hoverCharName: gui.TextBlock;
    charPanel: gui.Rectangle;
    sortModeChanger: gui.Button;
    filterArray: ZzzFilterItem[];
    applyFilter: () => void;
}): ZzzUIController {
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

    const rarity4Button = createIconButton("res/assets/ZZZ/Icon_AgentRank_A.png", -188, () => {
        toggleFilter(rarity4Button, "rarity", "4", clearRarityBG);
    }, "");

    const rarity5Button = createIconButton("res/assets/ZZZ/Icon_AgentRank_S.png", -148, () => {
        toggleFilter(rarity5Button, "rarity", "5", clearRarityBG);
    }, "");

    filterBar.addControl(rarity4Button);
    filterBar.addControl(rarity5Button);

    const electricButton = createIconButton("res/assets/ZZZ/Icon_Electric.png", 52, () => {
        toggleFilter(electricButton, "element", "Electric", offElementBG);
    }, "Electric");

    const etherButton = createIconButton("res/assets/ZZZ/Icon_Ether.png", 92, () => {
        toggleFilter(etherButton, "element", "Ether", offElementBG);
    }, "Ether");

    const fireButton = createIconButton("res/assets/ZZZ/Icon_Fire.png", 132, () => {
        toggleFilter(fireButton, "element", "Fire", offElementBG);
    }, "Fire");

    const iceButton = createIconButton("res/assets/ZZZ/Icon_Ice.png", 172, () => {
        toggleFilter(iceButton, "element", "Ice", offElementBG);
    }, "Ice");

    const physicalButton = createIconButton("res/assets/ZZZ/Icon_Physical.png", 212, () => {
        toggleFilter(physicalButton, "element", "Physical", offElementBG);
    }, "Physical");

    const windButton = createIconButton("res/assets/ZZZ/Icon_Wind.png", 252, () => {
        toggleFilter(windButton, "element", "Wind", offElementBG);
    }, "Wind");

    filterBar.addControl(electricButton);
    filterBar.addControl(etherButton);
    filterBar.addControl(fireButton);
    filterBar.addControl(iceButton);
    filterBar.addControl(physicalButton);
    filterBar.addControl(windButton);

    const anomalyButton = createIconButton("res/assets/ZZZ/Icon_Anomaly.png", 52, () => {
        toggleFilter(anomalyButton, "weaponType", "Anomaly", offStyleBG);
    }, "Anomaly");

    const attackButton = createIconButton("res/assets/ZZZ/Icon_Attack.png", 92, () => {
        toggleFilter(attackButton, "weaponType", "Attack", offStyleBG);
    }, "Attack");

    const defenseButton = createIconButton("res/assets/ZZZ/Icon_Defense.png", 132, () => {
        toggleFilter(defenseButton, "weaponType", "Defense", offStyleBG);
    }, "Defense");

    const stunButton = createIconButton("res/assets/ZZZ/Icon_Stun.png", 172, () => {
        toggleFilter(stunButton, "weaponType", "Stun", offStyleBG);
    }, "Stun");

    const supportButton = createIconButton("res/assets/ZZZ/Icon_Support.png", 212, () => {
        toggleFilter(supportButton, "weaponType", "Support", offStyleBG);
    }, "Support");

    const ruptureButton = createIconButton("res/assets/ZZZ/Icon_Rupture.png", 252, () => {
        toggleFilter(ruptureButton, "weaponType", "Rupture", offStyleBG);
    }, "Rupture");

    filterBar2.addControl(anomalyButton);
    filterBar2.addControl(attackButton);
    filterBar2.addControl(defenseButton);
    filterBar2.addControl(stunButton);
    filterBar2.addControl(supportButton);
    filterBar2.addControl(ruptureButton);

    function clearRarityBG(): void {
        rarity4Button.background = "rgba(0,0,0,0)";
        rarity5Button.background = "rgba(0,0,0,0)";
    }

    function offElementBG(): void {
        electricButton.background = "rgba(0,0,0,0)";
        etherButton.background = "rgba(0,0,0,0)";
        fireButton.background = "rgba(0,0,0,0)";
        iceButton.background = "rgba(0,0,0,0)";
        physicalButton.background = "rgba(0,0,0,0)";
        windButton.background = "rgba(0,0,0,0)";
    }

    function offStyleBG(): void {
        anomalyButton.background = "rgba(0,0,0,0)";
        attackButton.background = "rgba(0,0,0,0)";
        defenseButton.background = "rgba(0,0,0,0)";
        stunButton.background = "rgba(0,0,0,0)";
        supportButton.background = "rgba(0,0,0,0)";
        ruptureButton.background = "rgba(0,0,0,0)";
    }

    function toggleFilter(
        button: gui.Button,
        key: keyof ZZZCharData,
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
            electricButton,
            etherButton,
            fireButton,
            iceButton,
            physicalButton,
            windButton,
            anomalyButton,
            attackButton,
            defenseButton,
            stunButton,
            supportButton,
            ruptureButton
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
            offStyleBG();
            filterArray.length = 0;
            applyFilter();
        }
    };
}