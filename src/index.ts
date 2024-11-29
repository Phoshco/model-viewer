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

    // // Capture the path from the URL
    // const path = window.location.pathname.slice(1).replace(/\/$/, ""); // Removes leading '/'
    // // Remove trailing slash if exists
    // // Optionally process path (e.g., remove trailing slashes, handle specific cases)

    // const item = path || "";

    // // Redirect to root
    // if (path) {
    //     window.history.replaceState(null, "", "/"); // Avoids a full reload
    // }

    // // Capture the full path from the URL
    // let fullPath = window.location.pathname;
    // if (!fullPath.endsWith("/")) {
    //     fullPath += "/";
    // }

    // const lastSlashIndex = fullPath.lastIndexOf("/");

    // // Extract the base path (everything before the item name)
    // const basePath = fullPath.substring(0, fullPath.lastIndexOf("/", lastSlashIndex - 1)) || "/"; // Will default to "/" if there's no base path

    // // Extract the item name (the part after the last "/")
    // const item = fullPath.slice(basePath.length + 1).replace(/\/$/, "") || ""; // Get the item name

    // // Redirect to the base path (without the item name)
    // if (item) {
    //     window.history.replaceState(null, "", basePath); // Redirect to the base path without the item
    // }




    // Capture the full path from the URL
    let fullPath = window.location.pathname;
    console.log(fullPath);

    // If the path ends with a "/", remove it to standardize the URL
    if (fullPath.endsWith("/")) {
        fullPath = fullPath.slice(0, -1); // Remove the trailing "/"
    }

    // Check for substrings to differentiate between local and online paths
    const isLocal = window.location.hostname.includes("localhost");
    console.log(isLocal);
    const isOnline = window.location.hostname.includes("github.io");

    // Define potential subfolders for online URLs
    const onlineBasePaths = ["model-viewer", "docs"];

    // Extract the base path and item
    let basePath = "";
    let item = "";

    // Local case: assume the URL format ends directly with the item
    if (isLocal) {
        basePath = "/"; // If no base path, default to root
        console.log(basePath);
        item = fullPath.slice(1).replace(/\/$/, "") || ""; // Get the item after the last "/"
        console.log(item);
    } else if (isOnline) {
    // {
        // Online case: handle URLs that include subfolders like "model-viewer" or "docs"
        // Check if the URL contains any of the online base paths
        for (const base of onlineBasePaths) {
            if (fullPath.includes(base)) {
                // Extract the base path and item, considering the folder structure
                const baseIndex = fullPath.indexOf(base) + base.length;
                basePath = fullPath.substring(0, fullPath.lastIndexOf("/"));
                console.log(basePath);
                item = fullPath.slice(baseIndex + 1).replace(/\/$/, "") || "";
                console.log(item);
                break;
            }
        }
    }

    // Redirect to the base path (without the item name)
    if (item) {
        window.history.replaceState(null, "", basePath); // Redirect to the base path without the item
    }

    BaseRuntime.Create({
        canvas,
        engine,
        sceneBuilder: new SceneBuilder()
    }, item).then(runtime => runtime.run());
};
