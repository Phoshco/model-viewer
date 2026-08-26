import { Engine } from "@babylonjs/core/Engines/engine";
import { render, h } from "preact";

import "./index.css";
import { BaseRuntime } from "./baseRuntime";
import { SceneBuilder } from "./scene/sceneBuilder";
import { App } from "./ui/App";

/** Render a full-viewport error banner if boot fails, so we can debug on mobile. */
function showBootError(err: unknown): void {
    const el = document.createElement("pre");
    el.style.cssText = "position:fixed;inset:0;color:#fff;background:#320000;padding:20px;font-size:14px;white-space:pre-wrap;z-index:99999;overflow:auto;pointer-events:auto;font-family:monospace;";
    const stack = (err as { stack?: string; message?: string })?.stack || (err as { message?: string })?.message || String(err);
    el.textContent = "Boot failed:\n\n" + stack;
    document.body.appendChild(el);
    console.error("Boot failed:", err);
}

window.onload = (): void => {
    // Proactively unregister any service workers left over from previous versions.
    // Old versions may have cached responses with strict COEP/COOP headers that
    // block cross-origin character portraits. Wiping them fixes
    // ERR_BLOCKED_BY_RESPONSE.NotSameOriginAfterDefaultedToSameOriginByCoep.
    try {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then((regs) => {
                for (const r of regs) void r.unregister();
            }).catch(() => { /* ignore */ });
            if ("caches" in window) {
                caches.keys().then((keys) => keys.forEach((k) => void caches.delete(k))).catch(() => { /* ignore */ });
            }
        }
    } catch { /* ignore */ }

    const canvas = document.createElement("canvas");
    // Keep the canvas in normal document flow so babylon-mmd's MmdPlayerControl
    // can append its controls as a sibling and position them at the bottom.
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.border = "none";
    canvas.style.outline = "none";
    document.body.appendChild(canvas);

    const engine = new Engine(canvas, false, {
        preserveDrawingBuffer: false,
        stencil: false,
        antialias: true,
        alpha: false,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
        doNotHandleTouchAction: false,
        doNotHandleContextLost: true,
        audioEngine: false
    }, true);

    // Parse the character slug out of the URL.
    // Rules:
    //   - localhost / LAN IP: pathname is `/<slug>` (no subfolder)
    //   - github.io deployment: pathname is `/model-viewer/<slug>`
    let fullPath = window.location.pathname;
    console.log("pathname:", fullPath);
    if (fullPath.endsWith("/")) {
        fullPath = fullPath.slice(0, -1);
    }
    const isGithubPages = window.location.hostname.includes("github.io");
    let item = "";
    if (isGithubPages) {
        const stripPrefixes = ["/model-viewer", "/docs"];
        let stripped = fullPath;
        for (const p of stripPrefixes) {
            if (stripped.startsWith(p)) {
                stripped = stripped.slice(p.length);
                break;
            }
        }
        item = stripped.replace(/^\/+/, "").replace(/\/$/, "");
    } else {
        item = fullPath.replace(/^\/+/, "").replace(/\/$/, "");
    }
    console.log("slug:", item);

    const sceneBuilder = new SceneBuilder();
    BaseRuntime.Create({
        canvas,
        engine,
        sceneBuilder
    }, item).then(runtime => {
        runtime.run();
        const result = sceneBuilder.getResult();
        if (result) {
            // Some entry HTML files (e.g. an older cached 404.html served by
            // GitHub Pages for /<slug> URLs) may not include the <div id="app">
            // container. Create one on the fly so the UI still mounts.
            let appEl = document.getElementById("app");
            if (!appEl) {
                appEl = document.createElement("div");
                appEl.id = "app";
                document.body.appendChild(appEl);
            }
            render(h(App, { api: result.api }), appEl);
        }
    }).catch(showBootError);
};

// Global handler for uncaught errors that happen after boot.
window.addEventListener("error", (e): void => {
    console.error("Uncaught error:", e.error);
});
window.addEventListener("unhandledrejection", (e): void => {
    console.error("Unhandled rejection:", e.reason);
});