import type { JSX } from "preact";
import { resUrl } from "../../config";
import type { SceneApi } from "../../scene/sceneApi";
import type { SceneState } from "../../scene/sceneState";

interface Props {
    api: SceneApi;
    state: SceneState;
}

/**
 * Fixed-size toolbar (50px icons, 10px gaps) that works on any screen size.
 * Touch targets stay comfortable at 50×50 on phones, and the old "double on mobile"
 * behavior was only an artifact of Babylon GUI's ideal-size scaling — DOM icons don't
 * need that trick.
 */
export function Toolbar({ api, state }: Props): JSX.Element {
    const btnStyle = "fadeable pointer-events-auto cursor-pointer w-[50px] h-[50px] object-contain select-none";
    const step = 50;
    const gap = 10;
    const topAt = (i: number): string => `${gap + i * step}px`;

    return (
        <>
            {/* Menu button (opens char panel) */}
            <img
                src={resUrl("res/assets/menu.png")}
                class={btnStyle}
                style={{ position: "absolute", left: `${gap}px`, top: topAt(0) }}
                onClick={(): void => api.toggleCharPanel()}
                alt="menu"
            />

            {/* Dark mode toggle */}
            <img
                src={resUrl(state.darkMode ? "res/assets/light_mode.png" : "res/assets/dark_mode.png")}
                class={btnStyle}
                style={{
                    position: "absolute",
                    left: `${gap + step}px`,
                    top: topAt(0),
                    opacity: state.charScreenMode ? 0.4 : 1,
                    pointerEvents: state.charScreenMode ? "none" : "auto"
                }}
                onClick={(): void => {
                    if (!state.charScreenMode) api.toggleDarkMode();
                }}
                alt="dark mode"
            />

            {/* Char screen mode toggle (paimon) */}
            {state.tabMode !== "WuWa" && state.tabMode !== "NTE" && (
                <img
                    src={resUrl("res/assets/paimon.png")}
                    class={btnStyle}
                    style={{ position: "absolute", left: `${gap}px`, top: topAt(1) }}
                    onClick={(): void => api.toggleCharScreenMode()}
                    alt="char screen"
                />
            )}

            {/* Skin cycle */}
            {state.hasSkinButton && (
                <img
                    src={resUrl(state.darkMode ? "res/assets/alter_light.png" : "res/assets/alter.png")}
                    class={btnStyle}
                    style={{ position: "absolute", left: `${gap + step}px`, top: topAt(1) }}
                    onClick={async (): Promise<void> => { await api.cycleSkin(); }}
                    alt="skin"
                />
            )}

            {/* Motion selector */}
            <img
                src={resUrl(state.darkMode ? "res/assets/note_light.png" : "res/assets/note.png")}
                class={btnStyle}
                style={{
                    position: "absolute",
                    left: `${gap}px`,
                    top: topAt(2),
                    background: state.isTrackPanelOpen ? "rgba(119,119,119,0.5)" : "transparent",
                    borderRadius: "10px"
                }}
                onClick={(): void => api.toggleTrackPanel()}
                alt="motion"
            />

            {/* Physics toggle */}
            <img
                src={resUrl(state.darkMode ? "res/assets/physics_light.png" : "res/assets/physics.png")}
                class={btnStyle}
                style={{
                    position: "absolute",
                    left: `${gap}px`,
                    top: topAt(3),
                    background: state.physicsModeOn ? "rgba(119,119,119,0.5)" : "transparent",
                    borderRadius: "10px"
                }}
                onClick={async (): Promise<void> => { await api.togglePhysics(); }}
                alt="physics"
            />

            {/* Support button (top right) */}
            <img
                src={resUrl("res/assets/support.png")}
                class={btnStyle}
                style={{ position: "absolute", right: `${gap}px`, top: "30px" }}
                onClick={(): void => api.openSupport()}
                alt="support"
            />
        </>
    );
}