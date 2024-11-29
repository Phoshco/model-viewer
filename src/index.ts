import { Engine } from "@babylonjs/core/Engines/engine";

import { BaseRuntime } from "./baseRuntime";
import { SceneBuilder } from "./sceneBuilder";

window.onload = (): void => {
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.border = "none";
    canvas.style.outline = "none";
    document.body.appendChild(canvas);

    const engine = new Engine(canvas, false, {
        preserveDrawingBuffer: false,
        stencil: false,
        antialias: true, //false
        alpha: false,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
        doNotHandleTouchAction: false, //true
        doNotHandleContextLost: true,
        audioEngine: false
    }, true);

    // Capture the path from the URL
    const path = window.location.pathname.slice(1).replace(/\/$/, ""); // Removes leading '/'
    // Remove trailing slash if exists
    // Optionally process path (e.g., remove trailing slashes, handle specific cases)

    const item = path || "";

    // Redirect to root
    if (path) {
        window.history.replaceState(null, "", "/"); // Avoids a full reload
    }

    BaseRuntime.Create({
        canvas,
        engine,
        sceneBuilder: new SceneBuilder()
    }, item).then(runtime => runtime.run());
};
