import { useEffect, useState } from "preact/hooks";
import type { SceneApi } from "../../scene/sceneApi";
import type { SceneState } from "../../scene/sceneState";

export function useSceneState(api: SceneApi): SceneState {
    const [state, setState] = useState<SceneState>(api.state.get());
    useEffect(() => {
        return api.state.subscribe(setState);
    }, [api]);
    return state;
}