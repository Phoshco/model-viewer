// import type { ILoadingScreen, Scene } from "@babylonjs/core";
// import * as gui from "@babylonjs/gui";
import { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine.js";

// Element -> accent color. Mirrors the palette used by the reference sheet so
// the loading UI matches the rest of the app. Falls back to a neutral gold.
const ELEMENT_COLORS = {
    Pyro: "#ff7a4d",
    Hydro: "#4fc3f7",
    Anemo: "#74e0c0",
    Electro: "#c07af0",
    Dendro: "#9bd44a",
    Cryo: "#a5e8ff",
    Geo: "#f6c445",
    HSR: "#8f7bff",
    Universal: "#c9a86a"
};
const DEFAULT_ACCENT = "#c9a86a";

/**
 * Resolves an element name OR a raw color string to a usable CSS color.
 * - If given a value starting with "#" (or empty), it's treated as a color.
 * - Otherwise it's looked up in ELEMENT_COLORS (fallback = DEFAULT_ACCENT).
 */
function resolveAccent(elementOrColor) {
    if (!elementOrColor) return DEFAULT_ACCENT;
    if (elementOrColor[0] === "#") return elementOrColor;
    return ELEMENT_COLORS[elementOrColor] ?? DEFAULT_ACCENT;
}

/**
 * Builds the rotating spinner icon as an inline (URL-encoded) SVG data URI with
 * the fill color injected, so it can match the current element's accent color.
 * Same icon shape as the original Babylon spinner, just recolorable.
 */
function buildSpinnerSvg(color) {
    const path = "M40.21,126.43c3.7-7.31,7.67-14.44,12-21.32l3.36-5.1,3.52-5c1.23-1.63,2.41-3.29,3.65-4.91s2.53-3.21,3.82-4.79A185.2,185.2,0,0,1,83.4,67.43a208,208,0,0,1,19-15.66c3.35-2.41,6.74-4.78,10.25-7s7.11-4.28,10.75-6.32c7.29-4,14.73-8,22.53-11.49,3.9-1.72,7.88-3.3,12-4.64a104.22,104.22,0,0,1,12.44-3.23,62.44,62.44,0,0,1,12.78-1.39A25.92,25.92,0,0,1,196,21.44a6.55,6.55,0,0,1,2.05,9,6.66,6.66,0,0,1-1.64,1.78l-.41.29a22.07,22.07,0,0,1-5.78,3,30.42,30.42,0,0,1-5.67,1.62,37.82,37.82,0,0,1-5.69.71c-1,0-1.9.18-2.85.26l-2.85.24q-5.72.51-11.48,1.1c-3.84.4-7.71.82-11.58,1.4a112.34,112.34,0,0,0-22.94,5.61c-3.72,1.35-7.34,3-10.94,4.64s-7.14,3.51-10.6,5.51A151.6,151.6,0,0,0,68.56,87C67.23,88.48,66,90,64.64,91.56s-2.51,3.15-3.75,4.73l-3.54,4.9c-1.13,1.66-2.23,3.35-3.33,5a127,127,0,0,0-10.93,21.49,1.58,1.58,0,1,1-3-1.15S40.19,126.47,40.21,126.43Z";
    const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 392 392'>" +
        "<path fill='" + color + "' d='" + path + "'/>" +
        "<rect fill='none' width='392' height='392'/></svg>";
    return "data:image/svg+xml," + encodeURIComponent(svg);
}

export class CustomLoadingScreen {
    loadingUIBackgroundColor;
    loadingUIText;

    /**
     * Creates a new default loading screen
     * @param _renderingCanvas defines the canvas used to render the scene
     * @param _loadingText defines the default text to display
     * @param _loadingDivBackgroundColor defines the default background color
     */
    constructor(_renderingCanvas, _loadingText = "Loading", _loadingDivBackgroundColor = "black") {
        this._renderingCanvas = _renderingCanvas;
        this._loadingText = _loadingText;
        this._loadingDivBackgroundColor = _loadingDivBackgroundColor;
        // Element accent color (spinner + progress bar). Defaults to neutral
        // gold; set per-character via setAccentColor().
        this._accentColor = DEFAULT_ACCENT;
        // Resize
        this._resizeLoadingUI = () => {
            const canvasRect = this._renderingCanvas.getBoundingClientRect();
            const canvasPositioning = window.getComputedStyle(this._renderingCanvas).position;
            if (!this._loadingDiv) {
                return;
            }
            this._loadingDiv.style.position = canvasPositioning === "fixed" ? "fixed" : "absolute";
            this._loadingDiv.style.left = canvasRect.left + "px";
            this._loadingDiv.style.top = canvasRect.top + "px";
            this._loadingDiv.style.width = canvasRect.width + "px";
            this._loadingDiv.style.height = canvasRect.height + "px";
        };
    }

    /**
     * Function called to display the loading screen
     */
    displayLoadingUI() {
        if (this._loadingDiv) {
            // Do not add a loading screen if there is already one
            return;
        }
        this._loadingDiv = document.createElement("div");
        this._loadingDiv.id = "babylonjsLoadingDiv";
        this._loadingDiv.style.opacity = "0";
        this._loadingDiv.style.transition = "opacity 1.5s ease";
        // Above the Preact overlay (#app has z-index: 10) so the loading screen
        // fully covers the toolbar icons, character name and disclaimer text.
        this._loadingDiv.style.zIndex = "1000";
        this._loadingDiv.style.pointerEvents = "none";
        this._loadingDiv.style.display = "grid";
        this._loadingDiv.style.gridTemplateRows = "100%";
        this._loadingDiv.style.gridTemplateColumns = "100%";
        this._loadingDiv.style.justifyItems = "center";
        this._loadingDiv.style.alignItems = "center";
        // --- Progress panel: step label + element-colored progress bar ---
        // Centered below the spinner/GIF. Replaces the old plain multi-line text.
        const accent = resolveAccent(this._accentColor);
        const panel = this._progressPanel = document.createElement("div");
        panel.style.position = "absolute";
        panel.style.left = "50%";
        panel.style.top = "50%";
        panel.style.marginTop = "132px";
        panel.style.transform = "translateX(-50%)";
        panel.style.width = "min(320px, 72vw)";
        panel.style.display = "flex";
        panel.style.flexDirection = "column";
        panel.style.alignItems = "center";
        panel.style.gap = "12px";
        panel.style.zIndex = "1";

        // Step label (uses the app font stack for consistency with the UI).
        const label = this._progressLabel = document.createElement("div");
        label.style.fontFamily = "'Segoe UI', system-ui, sans-serif";
        label.style.fontSize = "15px";
        label.style.fontWeight = "500";
        label.style.letterSpacing = "0.4px";
        label.style.color = "#e8e8ee";
        label.style.textAlign = "center";
        label.style.textShadow = "0 1px 3px rgba(0,0,0,0.6)";
        label.style.animation = "lsPulse 1.6s ease-in-out infinite";
        label.textContent = this._loadingText || "Loading";
        panel.appendChild(label);

        // Progress bar: rounded track + element-accent fill with a shimmer.
        const track = this._progressTrack = document.createElement("div");
        track.style.width = "100%";
        track.style.height = "6px";
        track.style.borderRadius = "999px";
        track.style.background = "rgba(255,255,255,0.15)";
        track.style.overflow = "hidden";
        track.style.boxShadow = "inset 0 0 0 1px rgba(255,255,255,0.08)";
        const fill = this._progressFill = document.createElement("div");
        fill.style.width = "0%";
        fill.style.height = "100%";
        fill.style.borderRadius = "999px";
        fill.style.background = accent;
        fill.style.boxShadow = "0 0 10px " + accent;
        fill.style.transition = "width 0.3s ease";
        fill.style.backgroundSize = "200% 100%";
        fill.style.animation = "lsShimmer 1.8s linear infinite";
        track.appendChild(fill);
        panel.appendChild(track);

        this._loadingDiv.appendChild(panel);

        // Backward-compat: keep a hidden loadingTextDiv so any direct writes to
        // `.innerHTML` (and the ILoadingScreen contract) still work. The visible
        // UI is driven by setProgress()/the panel above.
        this.loadingTextDiv = document.createElement("div");
        this.loadingTextDiv.style.display = "none";
        this.loadingTextDiv.innerHTML = this._loadingText;
        this._loadingDiv.appendChild(this.loadingTextDiv);
        // Generating keyframes
        this._style = document.createElement("style");
        this._style.type = "text/css";
        const keyFrames = `@-webkit-keyframes spin1 {\
                    0% { -webkit-transform: rotate(0deg);}
                    100% { -webkit-transform: rotate(360deg);}
                }\
                @keyframes spin1 {\
                    0% { transform: rotate(0deg);}
                    100% { transform: rotate(360deg);}
                }\
                @keyframes lsPulse {\
                    0%, 100% { opacity: 0.65; }
                    50% { opacity: 1; }
                }\
                @keyframes lsShimmer {\
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }`;
        this._style.innerHTML = keyFrames;
        document.getElementsByTagName("head")[0].appendChild(this._style);
        const svgSupport = !!window.SVGSVGElement;
        // Loading img
        const imgBack = new Image();
        const loadingImgs = [
           "paimon_load",
           "kururin",
           "guinaifen",
           "furina",
           "bangboo"
        ]
        imgBack.src = "res/assets/loads/" + loadingImgs[Math.floor(Math.random() * loadingImgs.length)] + ".gif";
        
        imgBack.style.width = "150px";
        imgBack.style.gridColumn = "1";
        imgBack.style.gridRow = "1";
        imgBack.style.top = "50%";
        imgBack.style.left = "50%";
        imgBack.style.transform = "translate(-50%, -50%)";
        imgBack.style.position = "absolute";
        const imageSpinnerContainer = document.createElement("div");
        imageSpinnerContainer.style.width = "300px";
        imageSpinnerContainer.style.gridColumn = "1";
        imageSpinnerContainer.style.gridRow = "1";
        imageSpinnerContainer.style.top = "50%";
        imageSpinnerContainer.style.left = "50%";
        imageSpinnerContainer.style.transform = "translate(-50%, -50%)";
        imageSpinnerContainer.style.position = "absolute";
        // Loading spinner
        const imgSpinner = this._spinnerImg = new Image();
        if (!CustomLoadingScreen.DefaultSpinnerUrl) {
            imgSpinner.src = !svgSupport
                ? "https://cdn.babylonjs.com/Assets/loadingIcon.png"
                : buildSpinnerSvg(accent);
        }
        else {
            imgSpinner.src = CustomLoadingScreen.DefaultSpinnerUrl;
        }
        imgSpinner.style.animation = "spin1 0.75s infinite linear";
        imgSpinner.style.webkitAnimation = "spin1 0.75s infinite linear";
        imgSpinner.style.transformOrigin = "50% 50%";
        imgSpinner.style.webkitTransformOrigin = "50% 50%";
        if (!svgSupport) {
            const logoSize = { w: 16, h: 18.5 };
            const loadingSize = { w: 30, h: 30 };
            // set styling correctly
            imgBack.style.width = `${logoSize.w}vh`;
            imgBack.style.height = `${logoSize.h}vh`;
            imgBack.style.left = `calc(50% - ${logoSize.w / 2}vh)`;
            imgBack.style.top = `calc(50% - ${logoSize.h / 2}vh)`;
            imgSpinner.style.width = `${loadingSize.w}vh`;
            imgSpinner.style.height = `${loadingSize.h}vh`;
            imgSpinner.style.left = `calc(50% - ${loadingSize.w / 2}vh)`;
            imgSpinner.style.top = `calc(50% - ${loadingSize.h / 2}vh)`;
        }
        imageSpinnerContainer.appendChild(imgSpinner);
        this._loadingDiv.appendChild(imgBack);
        this._loadingDiv.appendChild(imageSpinnerContainer);
        this._resizeLoadingUI();
        window.addEventListener("resize", this._resizeLoadingUI);
        this._loadingDiv.style.backgroundColor = this._loadingDivBackgroundColor;
        document.body.appendChild(this._loadingDiv);
        this._loadingDiv.style.opacity = "1";
    }

    /**
     * Sets the accent color (used by the spinner + progress bar). Accepts either
     * an element name (e.g. "Pyro", "HSR") or a raw CSS color ("#rrggbb"). Safe
     * to call before or after the UI is shown; updates live elements if present.
     * @param {string} elementOrColor
     */
    setAccentColor(elementOrColor) {
        const color = resolveAccent(elementOrColor);
        this._accentColor = color;
        if (this._spinnerImg && !CustomLoadingScreen.DefaultSpinnerUrl && !!window.SVGSVGElement) {
            this._spinnerImg.src = buildSpinnerSvg(color);
        }
        if (this._progressFill) {
            this._progressFill.style.background = color;
            this._progressFill.style.boxShadow = "0 0 10px " + color;
        }
    }

    /**
     * Updates the progress panel: a step label + a determinate progress bar.
     * @param {string} label text shown above the bar (e.g. "Loading model…")
     * @param {number} percent 0..100 fill amount for the bar
     */
    setProgress(label, percent) {
        if (this._progressLabel && typeof label === "string") {
            this._progressLabel.textContent = label;
        }
        if (this._progressFill) {
            const clamped = Math.max(0, Math.min(100, Number(percent) || 0));
            this._progressFill.style.width = clamped + "%";
        }
    }

    /**
     * Function called to hide the loading screen
     */
    hideLoadingUI() {
        if (!this._loadingDiv) {
            return;
        }
        const onTransitionEnd = () => {
            if (this.loadingTextDiv) {
                this.loadingTextDiv.remove();
                this.loadingTextDiv = null;
            }
            if (this._loadingDiv) {
                this._loadingDiv.remove();
                this._loadingDiv = null;
            }
            // Drop references to the (now detached) progress panel so later
            // setProgress()/setAccentColor() calls no-op until the next display.
            this._progressPanel = null;
            this._progressLabel = null;
            this._progressTrack = null;
            this._progressFill = null;
            this._spinnerImg = null;
            if (this._style) {
                this._style.remove();
                this._style = null;
            }
            window.removeEventListener("resize", this._resizeLoadingUI);
        };
        this._loadingDiv.style.opacity = "0";
        this._loadingDiv.addEventListener("transitionend", onTransitionEnd);
    }
    /**
     * Gets or sets the text to display while loading
     */
    set loadingUIText(text) {
        this._loadingText = text;
        if (this.loadingTextDiv) {
            this.loadingTextDiv.innerHTML = this._loadingText;
        }
    }
    get loadingUIText() {
        return this._loadingText;
    }
    /**
     * Gets or sets the color to use for the background
     */
    get loadingUIBackgroundColor() {
        return this._loadingDivBackgroundColor;
    }
    set loadingUIBackgroundColor(color) {
        this._loadingDivBackgroundColor = color;
        if (!this._loadingDiv) {
            return;
        }
        this._loadingDiv.style.backgroundColor = this._loadingDivBackgroundColor;
    }
}
AbstractEngine.DefaultLoadingScreenFactory = (canvas) => {
    return new CustomLoadingScreen(canvas);
};
