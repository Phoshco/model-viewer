import type { JSX } from "preact";
import motionConfig from "../../../res/cam_motion/motion.json";
import type { SceneApi } from "../../scene/sceneApi";

interface Props {
    api: SceneApi;
    open: boolean;
}

/**
 * Motion track dropdown. Anchored below the motion (note) toolbar button,
 * which sits at row-index 2 (top: 110px), left col 2 (left: 60px).
 */
export function TrackPanel({ api, open }: Props): JSX.Element | null {
    if (!open) return null;
    return (
        <div
            class="pointer-events-auto absolute bg-[rgb(44,48,50)] text-white rounded-lg overflow-y-auto shadow-lg
                   w-[220px] max-h-[240px] text-sm
                   sm:w-[250px] sm:max-h-[280px] sm:text-base"
            style={{ left: "60px", top: "110px" }}
        >
            {motionConfig.map((track): JSX.Element => (
                <button
                    key={track.name}
                    class="block w-full text-left px-3 py-2 hover:bg-[rgb(64,68,70)]"
                    onClick={async (): Promise<void> => {
                        await api.changeMotion(track.name);
                    }}
                >
                    {track.name}
                </button>
            ))}
        </div>
    );
}