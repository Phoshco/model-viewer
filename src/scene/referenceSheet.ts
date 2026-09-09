import type { AbstractEngine } from "@babylonjs/core/Engines/abstractEngine";
import { CreateScreenshotUsingRenderTargetAsync } from "@babylonjs/core/Misc/screenshotTools";
import type { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import type { Camera } from "@babylonjs/core/Cameras/camera";
import type { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import type { Scene } from "@babylonjs/core/scene";
import type { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import QRCode from "qrcode";

/**
 * A single fixed camera pose used to capture one turnaround view of the model.
 *
 * `alpha` / `beta` are ABSOLUTE ArcRotateCamera angles (independent of wherever
 * the user had dragged the camera), so "Front" is always the model's front.
 * The model faces -Z in this scene, so alpha = -PI/2 looks at the front.
 *
 * `frame`:
 *   - "full" : whole body, target/radius derived from the model bounding box.
 *   - "face" : head shot, target = head bone (front).
 *   - "head" : same framing as "face" but from another angle (e.g. back of head).
 *   - "feet" : zoomed onto the footwear / bottom of the model.
 *   - "mid"  : zoomed onto the upper/mid body for detail.
 */
export interface CapturePose {
    key: string;
    label: string;
    alpha: number;
    beta: number;
    frame: "full" | "face" | "head" | "feet" | "mid";
    /** Captured tile aspect (width / height). Portrait (<1) for full body. */
    aspect: number;
}

const HALF_PI = Math.PI / 2;

// Turnaround angle set for a game-style character design sheet.
const POSE_FRONT: CapturePose = { key: "front", label: "Front", alpha: -HALF_PI, beta: HALF_PI, frame: "full", aspect: 0.52 };
// Face uses the exact same viewing angle as FRONT (confirmed correct), just
// zoomed onto the head bone — so it can never end up behind the head.
// Portrait aspect so it fills the tall right-hand FACE panel.
const POSE_FACE: CapturePose = { key: "face", label: "Face", alpha: -HALF_PI, beta: HALF_PI, frame: "face", aspect: 0.62 };
// Ordered turnaround thumbnails shown in the side strip.
const POSES_TURNAROUND: CapturePose[] = [
    { key: "front34", label: "3/4 Front", alpha: -HALF_PI - Math.PI / 5, beta: HALF_PI, frame: "full", aspect: 0.52 },
    { key: "side", label: "Side", alpha: -Math.PI, beta: HALF_PI, frame: "full", aspect: 0.52 },
    { key: "back34", label: "3/4 Back", alpha: HALF_PI - Math.PI / 5, beta: HALF_PI, frame: "full", aspect: 0.52 },
    { key: "back", label: "Back", alpha: HALF_PI, beta: HALF_PI, frame: "full", aspect: 0.52 }
];

// Zoomed-in detail shots (shown as square/near-square callouts).
// NOTE: the detail 3/4 shots orbit to the OPPOSITE side from the turnaround
// 3/4 shots (which use -PI/5 for front and -PI/5 for back), so they reveal the
// mirrored side of the model rather than repeating the same angle.
const POSES_DETAIL: CapturePose[] = [
    { key: "feet", label: "Footwear", alpha: -HALF_PI - Math.PI / 5, beta: HALF_PI, frame: "feet", aspect: 1 },
    { key: "frontDetail", label: "Front Detail", alpha: -HALF_PI + Math.PI / 5, beta: HALF_PI, frame: "mid", aspect: 0.72 },
    { key: "backDetail", label: "Back Detail", alpha: HALF_PI + Math.PI / 5, beta: HALF_PI, frame: "mid", aspect: 0.72 },
    { key: "headBack", label: "Back of Head", alpha: HALF_PI, beta: HALF_PI, frame: "head", aspect: 1 }
];

// Base capture height in pixels (width derived from each pose's aspect).
// High so viewers can zoom in on model detail.
const CAPTURE_H = 1800;

// Multisample count for each captured screenshot (higher = smoother edges).
const CAPTURE_SAMPLES = 8;

// The composed sheet is drawn in a logical 2400x1500 space then rendered onto a
// backing canvas scaled by this factor for a crisp, zoomable export.
const SHEET_SCALE = 2;

export interface ReferenceSheetContext {
    scene: Scene;
    engine: AbstractEngine;
    captureCamera: ArcRotateCamera;
    mmdRuntime: { isAnimationPlaying: boolean; pauseAnimation: () => void };
    pipeline: DefaultRenderingPipeline;
    modelMeshes: AbstractMesh[];
    headWorldPos: Vector3 | null;
    characterName: string;
    element: string;
    weaponType: string;
    /** Resolved icon URL for the element (game-specific), or "" if none. */
    elementIcon: string;
    /** Resolved icon URL for the weapon/path (game-specific), or "" if none. */
    weaponIcon: string;
    rarity: number;
    /** Game/source label shown in the header (e.g. "Genshin Impact"). */
    game: string;
    /** Direct link to this model in the viewer (shown in the footer). */
    modelUrl: string;
    darkMode: boolean;
}

interface ModelBounds {
    min: Vector3;
    max: Vector3;
    center: Vector3;
    height: number;
    girth: number;
}

/**
 * World-space bounding box across all model meshes so framing adapts to tall /
 * short models instead of using hardcoded heights.
 */
function computeModelBounds(meshes: AbstractMesh[]): ModelBounds {
    let min = new Vector3(Infinity, Infinity, Infinity);
    let max = new Vector3(-Infinity, -Infinity, -Infinity);
    for (const mesh of meshes) {
        try {
            mesh.refreshBoundingInfo({ applySkeleton: true, applyMorph: true });
        } catch {
            /* ignore meshes without skinning / geometry */
        }
        const bi = mesh.getBoundingInfo?.();
        if (!bi) continue;
        min = Vector3.Minimize(min, bi.boundingBox.minimumWorld);
        max = Vector3.Maximize(max, bi.boundingBox.maximumWorld);
    }
    if (!isFinite(min.x)) {
        min = new Vector3(-8, 0, -8);
        max = new Vector3(8, 20, 8);
    }
    const center = Vector3.Center(min, max);
    return { min, max, center, height: max.y - min.y, girth: Math.max(max.x - min.x, max.z - min.z) };
}

// Element accent colors, with fallbacks for the non-Genshin element buckets.
const ELEMENT_COLORS: Record<string, string> = {
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

function accentColor(element: string): string {
    return ELEMENT_COLORS[element] ?? "#c9a86a";
}

async function loadImage(dataUrl: string): Promise<HTMLImageElement> {
    return await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = (): void => resolve(img);
        img.onerror = (e): void => reject(e);
        img.src = dataUrl;
    });
}

interface CapturedTile {
    pose: CapturePose;
    dataUrl: string;
}

/**
 * Positions the capture camera for a pose using the model bounds so the whole
 * model is framed (heads never get cut off, regardless of model height), then
 * captures a screenshot at the pose's aspect ratio.
 */
async function capturePose(
    ctx: ReferenceSheetContext,
    pose: CapturePose,
    bounds: ModelBounds
): Promise<CapturedTile> {
    const { engine, captureCamera } = ctx;
    const cam = captureCamera;

    const width = Math.round(CAPTURE_H * pose.aspect);
    const height = CAPTURE_H;

    // IMPORTANT: set the target FIRST, then alpha/beta/radius. ArcRotateCamera's
    // setTarget() recomputes alpha/beta from the current camera position, so
    // setting angles before the target lets them get clobbered (which made the
    // face shot orbit to the back of the head after a "BACK" capture).
    let radius: number;
    if (pose.frame === "face" || pose.frame === "head") {
        // Target the real head bone when we have it; otherwise fall back to a
        // point near the top of the bounding box. The 頭 bone sits low (neck /
        // skull base), so lift the aim point upward slightly so the actual face
        // is centered (not the chin/neck). The face tile is portrait, so drop the
        // aim a touch below the head to include the shoulders/upper chest.
        const headBase = ctx.headWorldPos ? ctx.headWorldPos.y : bounds.max.y - bounds.height * 0.08;
        const headY = headBase - bounds.height * 0.02;
        const headX = ctx.headWorldPos ? ctx.headWorldPos.x : bounds.center.x;
        const headZ = ctx.headWorldPos ? ctx.headWorldPos.z : bounds.center.z;
        cam.setTarget(new Vector3(headX, headY, headZ));
        // Head-and-shoulders portrait framing scaled to model size.
        radius = Math.max(bounds.height * 0.4, 6);
    } else if (pose.frame === "feet") {
        // Footwear: aim at the bottom of the model (just above the floor) and
        // zoom onto roughly the lower ~1/4 of the body.
        cam.setTarget(new Vector3(bounds.center.x, bounds.min.y + bounds.height * 0.09, bounds.center.z));
        radius = Math.max(bounds.height * 0.34, 5);
    } else if (pose.frame === "mid") {
        // Upper/mid body detail: aim around chest height, zoom onto ~upper half.
        cam.setTarget(new Vector3(bounds.center.x, bounds.center.y + bounds.height * 0.2, bounds.center.z));
        radius = Math.max(bounds.height * 0.55, 8);
    } else {
        // Full body: aim at vertical center, pull back enough to fit height with
        // margin. FOV defaults to ~0.8 rad; radius = (halfHeight / tan(fov/2)).
        cam.setTarget(new Vector3(bounds.center.x, bounds.center.y, bounds.center.z));
        const fov = cam.fov || 0.8;
        const halfExtent = Math.max(bounds.height, bounds.girth * 1.6) / 2;
        const margin = 1.18; // headroom so nothing touches the edges
        radius = (halfExtent * margin) / Math.tan(fov / 2);
    }

    // Now apply the absolute orbit angles + distance (after setTarget).
    cam.alpha = pose.alpha;
    cam.beta = pose.beta;
    cam.radius = radius;

    const dataUrl = await CreateScreenshotUsingRenderTargetAsync(
        engine,
        cam,
        { width, height },
        "image/png",
        CAPTURE_SAMPLES,
        true
    );
    return { pose, dataUrl };
}

/**
 * Captures the model from a set of fixed angles at the CURRENT (frozen) pose,
 * composes them into a single game-style character design sheet, and opens the
 * result in a new browser tab as a temporary object URL. Nothing is persisted
 * server-side.
 *
 * The animation is paused (not seeked) on entry so whatever pose the model is
 * in — rest pose or mid-animation — is what gets captured. Camera and pipeline
 * state are restored afterwards; the animation is left paused.
 */
export async function generateReferenceSheet(ctx: ReferenceSheetContext): Promise<void> {
    const { scene, captureCamera, mmdRuntime, pipeline } = ctx;

    // Freeze the current pose (pause only, no seek).
    if (mmdRuntime.isAnimationPlaying) {
        mmdRuntime.pauseAnimation();
    }

    // --- Snapshot state so we can restore it afterwards ---
    const savedActive: Camera[] = scene.activeCameras ? scene.activeCameras.slice() : [];
    const savedAlpha = captureCamera.alpha;
    const savedBeta = captureCamera.beta;
    const savedRadius = captureCamera.radius;
    const savedTarget = captureCamera.target.clone();
    const savedDof = pipeline.depthOfFieldEnabled;

    if (scene.activeCameras && scene.activeCameras.length > 0) {
        scene.activeCameras[0] = captureCamera;
    }
    pipeline.depthOfFieldEnabled = false;

    const tiles = new Map<string, CapturedTile>();

    try {
        // Solve bones / render once so the paused pose is fully resolved.
        scene.render();
        const bounds = computeModelBounds(ctx.modelMeshes);

        const all: CapturePose[] = [POSE_FRONT, ...POSES_TURNAROUND, POSE_FACE, ...POSES_DETAIL];
        for (const pose of all) {
            const tile = await capturePose(ctx, pose, bounds);
            tiles.set(pose.key, tile);
        }
    } finally {
        // --- Restore state ---
        if (scene.activeCameras && savedActive.length > 0) {
            scene.activeCameras[0] = savedActive[0];
        }
        captureCamera.alpha = savedAlpha;
        captureCamera.beta = savedBeta;
        captureCamera.radius = savedRadius;
        captureCamera.setTarget(savedTarget);
        pipeline.depthOfFieldEnabled = savedDof;
    }

    await composeAndOpen(ctx, tiles);
}

interface Theme {
    bg: string;
    panel: string;
    panelEdge: string;
    grid: string;
    fg: string;
    sub: string;
    accent: string;
    tileBg1: string;
    tileBg2: string;
    chip: string;
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
    const rr = Math.min(r, w / 2, h / 2);
    g.beginPath();
    g.moveTo(x + rr, y);
    g.arcTo(x + w, y, x + w, y + h, rr);
    g.arcTo(x + w, y + h, x, y + h, rr);
    g.arcTo(x, y + h, x, y, rr);
    g.arcTo(x, y, x + w, y, rr);
    g.closePath();
}

/** Fills a rounded panel with a subtle vertical gradient + edge stroke. */
function drawPanel(g: CanvasRenderingContext2D, t: Theme, x: number, y: number, w: number, h: number): void {
    const grad = g.createLinearGradient(0, y, 0, y + h);
    grad.addColorStop(0, t.tileBg1);
    grad.addColorStop(1, t.tileBg2);
    g.save();
    g.shadowColor = "rgba(0,0,0,0.35)";
    g.shadowBlur = 22;
    g.shadowOffsetY = 8;
    roundRect(g, x, y, w, h, 18);
    g.fillStyle = grad;
    g.fill();
    g.restore();
    roundRect(g, x + 0.5, y + 0.5, w - 1, h - 1, 18);
    g.strokeStyle = t.panelEdge;
    g.lineWidth = 1.5;
    g.stroke();
}

/** Draws a subtle blueprint-style grid clipped to a rounded rect. */
function drawGrid(g: CanvasRenderingContext2D, t: Theme, x: number, y: number, w: number, h: number): void {
    g.save();
    roundRect(g, x, y, w, h, 18);
    g.clip();
    g.strokeStyle = t.grid;
    g.lineWidth = 1;
    const step = 44;
    g.beginPath();
    for (let gx = x + step; gx < x + w; gx += step) { g.moveTo(gx, y); g.lineTo(gx, y + h); }
    for (let gy = y + step; gy < y + h; gy += step) { g.moveTo(x, gy); g.lineTo(x + w, gy); }
    g.stroke();
    g.restore();
}

/** Draws an image "contained" (letterboxed) inside a box, centered. */
function drawContained(g: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number): void {
    const scale = Math.min(w / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    g.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

/**
 * Caption label centered under a view. No pill, no outline — clean text with a
 * very soft drop shadow so it stays legible without a hard border.
 */
function drawCaption(g: CanvasRenderingContext2D, t: Theme, text: string, cx: number, y: number): void {
    g.save();
    g.font = "700 24px 'Segoe UI', sans-serif";
    g.textAlign = "center";
    g.textBaseline = "middle";
    const midY = y + 16;
    g.shadowColor = "rgba(0,0,0,0.18)";
    g.shadowBlur = 6;
    g.shadowOffsetY = 1;
    g.fillStyle = t.fg;
    g.fillText(text, cx, midY);
    g.restore();
}

/** Draws an icon + label "chip" (rounded pill) and returns its total width. */
function drawInfoChip(
    g: CanvasRenderingContext2D,
    t: Theme,
    icon: HTMLImageElement | null,
    label: string,
    x: number,
    yMid: number
): number {
    const h = 40;
    const iconSz = 30;
    g.font = "600 22px 'Segoe UI', sans-serif";
    const textW = g.measureText(label).width;
    const leftPad = icon ? 12 : 16;
    const w = leftPad + (icon ? iconSz + 10 : 0) + textW + 16;
    roundRect(g, x, yMid - h / 2, w, h, h / 2);
    g.fillStyle = t.chip;
    g.fill();
    g.strokeStyle = "rgba(0,0,0,0.18)";
    g.lineWidth = 1;
    g.stroke();
    let cx = x + leftPad;
    if (icon) {
        g.drawImage(icon, cx, yMid - iconSz / 2, iconSz, iconSz);
        cx += iconSz + 10;
    }
    // Light text on the dark chip.
    g.fillStyle = "#f4f4f6";
    g.textAlign = "left";
    g.textBaseline = "middle";
    g.fillText(label, cx, yMid + 1);
    return w;
}

/**
 * Draws the top title block: name + info chips (element/weapon icons, rarity),
 * with the game name on the right.
 */
function drawHeader(
    g: CanvasRenderingContext2D,
    ctx: ReferenceSheetContext,
    t: Theme,
    x: number,
    y: number,
    w: number,
    h: number,
    elementIcon: HTMLImageElement | null,
    weaponIcon: HTMLImageElement | null,
    qrImg: HTMLImageElement | null
): void {
    // Accent side bar
    roundRect(g, x, y + 6, 8, h - 12, 4);
    g.fillStyle = t.accent;
    g.fill();

    // QR code (top-right), scan → opens the model link. Drawn first so the game
    // name can be right-aligned to its left edge.
    let rightEdge = x + w;
    if (qrImg) {
        const qrSize = h; // square, full header height
        const qrX = x + w - qrSize;
        // White quiet-zone card behind the QR so it always scans on any bg.
        roundRect(g, qrX, y, qrSize, qrSize, 10);
        g.fillStyle = "#ffffff";
        g.fill();
        g.strokeStyle = t.panelEdge;
        g.lineWidth = 1;
        g.stroke();
        const inset = 8;
        g.drawImage(qrImg, qrX + inset, y + inset, qrSize - inset * 2, qrSize - inset * 2);
        // "SCAN" hint under nothing—keep it minimal; label sits left of the QR.
        rightEdge = qrX - 24;
    }

    const textX = x + 28;

    // Character name
    g.textAlign = "left";
    g.textBaseline = "alphabetic";
    g.fillStyle = t.fg;
    g.font = "800 58px 'Segoe UI', sans-serif";
    const name = (ctx.characterName || "Reference Sheet").toUpperCase();
    g.fillText(name, textX, y + 54);

    // Info chips row: element, weapon, rarity.
    const chipY = y + 88;
    let mx = textX;
    if (ctx.element) mx += drawInfoChip(g, t, elementIcon, ctx.element, mx, chipY) + 12;
    if (ctx.weaponType && ctx.weaponType !== "Others") {
        mx += drawInfoChip(g, t, weaponIcon, ctx.weaponType, mx, chipY) + 12;
    }
    if (ctx.rarity && ctx.rarity > 0) {
        drawInfoChip(g, t, null, "\u2605".repeat(Math.min(ctx.rarity, 5)), mx, chipY);
    }

    // Game name (right side, vertically centered, left of the QR if present)
    g.font = "700 30px 'Segoe UI', sans-serif";
    g.fillStyle = t.sub;
    g.textAlign = "right";
    g.textBaseline = "middle";
    if (ctx.game) g.fillText(ctx.game.toUpperCase(), rightEdge, y + h / 2 - 12);
    if (qrImg) {
        g.font = "600 16px 'Segoe UI', sans-serif";
        g.fillStyle = t.sub;
        g.fillText("SCAN FOR MODEL", rightEdge, y + h / 2 + 16);
    }
    g.textAlign = "left";
    g.textBaseline = "alphabetic";
}

async function composeAndOpen(ctx: ReferenceSheetContext, tiles: Map<string, CapturedTile>): Promise<void> {
    // Load all captured images.
    const entries = Array.from(tiles.values());
    const imgById = new Map<string, HTMLImageElement>();
    await Promise.all(entries.map(async (e) => {
        imgById.set(e.pose.key, await loadImage(e.dataUrl));
    }));

    // Load the game-specific spec icons (best-effort; null if missing/unloadable).
    const loadIconSafe = async (url: string): Promise<HTMLImageElement | null> => {
        if (!url) return null;
        try {
            const img = new Image();
            img.crossOrigin = "anonymous";
            await new Promise<void>((resolve, reject) => {
                img.onload = (): void => resolve();
                img.onerror = (): void => reject(new Error("icon load failed"));
                img.src = url;
            });
            return img;
        } catch {
            return null;
        }
    };
    const [elementIconImg, weaponIconImg] = await Promise.all([
        loadIconSafe(ctx.elementIcon),
        loadIconSafe(ctx.weaponIcon)
    ]);

    // Generate a QR code for the model link (best-effort; null on failure). It's
    // rendered at high resolution so it stays crisp/scannable when zoomed.
    let qrImg: HTMLImageElement | null = null;
    if (ctx.modelUrl) {
        try {
            const qrDataUrl = await QRCode.toDataURL(ctx.modelUrl, {
                errorCorrectionLevel: "M",
                margin: 0,
                width: 512,
                color: { dark: "#111111ff", light: "#ffffffff" }
            });
            qrImg = await loadImage(qrDataUrl);
        } catch {
            qrImg = null;
        }
    }

    // The generated sheet always uses the light theme (looks cleaner as a doc
    // and keeps text/icon contrast consistent regardless of the app's dark mode).
    const t: Theme = {
        bg: "#ececef", panel: "#ffffff", panelEdge: "rgba(0,0,0,0.10)",
        grid: "rgba(0,0,0,0.05)", fg: "#1a1a1f", sub: "#6a6a72",
        accent: accentColor(ctx.element), tileBg1: "#ffffff", tileBg2: "#e9e9ee",
        // Mid-dark chip so white/light element & weapon icons stay visible
        // without being heavy on the light sheet.
        chip: "#4a4a55"
    };

    // --- Overall sheet dimensions (landscape design-sheet) ---
    // Layout is authored in this logical coordinate space; the backing canvas
    // is rendered at SHEET_SCALE× so the exported image stays crisp when viewers
    // zoom in. All layout constants below stay in logical units.
    const W = 2400;
    const H = 1880;
    const pad = 48;
    const headerH = 112;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(W * SHEET_SCALE);
    canvas.height = Math.round(H * SHEET_SCALE);
    const g = canvas.getContext("2d");
    if (!g) throw new Error("Could not get 2D context for reference sheet");
    g.scale(SHEET_SCALE, SHEET_SCALE);
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = "high";

    // Background with faint vignette
    g.fillStyle = t.bg;
    g.fillRect(0, 0, W, H);
    const vg = g.createRadialGradient(W / 2, H / 2, H * 0.2, W / 2, H / 2, H * 0.8);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.06)");
    g.fillStyle = vg;
    g.fillRect(0, 0, W, H);

    // Header
    drawHeader(g, ctx, t, pad, pad, W - pad * 2, headerH, elementIconImg, weaponIconImg, qrImg);
    // Divider line under header
    g.strokeStyle = t.panelEdge;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(pad, pad + headerH + 8);
    g.lineTo(W - pad, pad + headerH + 8);
    g.stroke();

    const bodyTop = pad + headerH + 28;
    // Reserve a band at the bottom for the zoomed detail strip.
    const detailStripH = 360;
    const detailStripTop = H - pad - 34 - detailStripH;
    const bodyBottom = detailStripTop - 28;
    const bodyH = bodyBottom - bodyTop;

    // --- Layout columns ---
    // Left: hero FRONT panel. Middle: turnaround strip (2x2). Right: face + notes.
    const heroW = 720;
    const faceColW = 520;
    const gap = 28;
    const stripW = W - pad * 2 - heroW - faceColW - gap * 2;

    const heroX = pad;
    const stripX = heroX + heroW + gap;
    const faceX = stripX + stripW + gap;

    // Hero panel (FRONT)
    drawPanel(g, t, heroX, bodyTop, heroW, bodyH);
    drawGrid(g, t, heroX, bodyTop, heroW, bodyH);
    const heroImg = imgById.get("front");
    if (heroImg) drawContained(g, heroImg, heroX + 20, bodyTop + 20, heroW - 40, bodyH - 70);
    drawCaption(g, t, POSE_FRONT.label, heroX + heroW / 2, bodyBottom - 40);

    // Turnaround strip: 2x2 grid of the four turnaround views.
    const cellGap = 24;
    const cellW = (stripW - cellGap) / 2;
    const cellH = (bodyH - cellGap) / 2;
    for (let i = 0; i < POSES_TURNAROUND.length; i++) {
        const pose = POSES_TURNAROUND[i];
        const col = i % 2;
        const row = Math.floor(i / 2);
        const cx = stripX + col * (cellW + cellGap);
        const cy = bodyTop + row * (cellH + cellGap);
        drawPanel(g, t, cx, cy, cellW, cellH);
        drawGrid(g, t, cx, cy, cellW, cellH);
        const img = imgById.get(pose.key);
        if (img) drawContained(g, img, cx + 14, cy + 14, cellW - 28, cellH - 54);
        drawCaption(g, t, pose.label, cx + cellW / 2, cy + cellH - 32);
    }

    // Face column: single tall FACE callout filling the body height.
    drawPanel(g, t, faceX, bodyTop, faceColW, bodyH);
    drawGrid(g, t, faceX, bodyTop, faceColW, bodyH);
    const faceImg = imgById.get("face");
    if (faceImg) drawContained(g, faceImg, faceX + 18, bodyTop + 18, faceColW - 36, bodyH - 70);
    drawCaption(g, t, POSE_FACE.label, faceX + faceColW / 2, bodyBottom - 40);

    // --- Bottom detail strip: 4 zoomed-in callouts across the full width ---
    const detailGap = 28;
    const detailCount = POSES_DETAIL.length;
    const detailW = (W - pad * 2 - detailGap * (detailCount - 1)) / detailCount;
    for (let i = 0; i < detailCount; i++) {
        const pose = POSES_DETAIL[i];
        const dx = pad + i * (detailW + detailGap);
        drawPanel(g, t, dx, detailStripTop, detailW, detailStripH);
        drawGrid(g, t, dx, detailStripTop, detailW, detailStripH);
        const img = imgById.get(pose.key);
        if (img) drawContained(g, img, dx + 14, detailStripTop + 14, detailW - 28, detailStripH - 54);
        drawCaption(g, t, pose.label, dx + detailW / 2, detailStripTop + detailStripH - 32);
    }

    // Footer: credit + direct model link (left), timestamp (right).
    g.textBaseline = "alphabetic";
    g.textAlign = "left";
    g.fillStyle = t.sub;
    g.font = "500 18px 'Segoe UI', sans-serif";
    const credit = "Generated with model-viewer \u2022 phoshco";
    g.fillText(credit, pad, H - pad + 6);
    if (ctx.modelUrl) {
        const creditW = g.measureText(credit).width;
        g.fillStyle = t.sub;
        g.fillText("\u2022", pad + creditW + 12, H - pad + 6);
        // Readable link color on the light footer (accent colors can be too pale).
        g.fillStyle = "#2b6cb0";
        g.font = "600 18px 'Segoe UI', sans-serif";
        g.fillText(ctx.modelUrl, pad + creditW + 30, H - pad + 6);
    }
    g.fillStyle = t.sub;
    g.font = "500 18px 'Segoe UI', sans-serif";
    g.textAlign = "right";
    g.fillText(new Date().toLocaleString(), W - pad, H - pad + 6);

    // Encode as WebP (fallback PNG) and open in a new tab as a temporary URL.
    const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/webp", 0.95);
    }) ?? await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), "image/png");
    });
    if (!blob) throw new Error("Failed to encode reference sheet image");

    const objectUrl = URL.createObjectURL(blob);
    window.open(objectUrl, "_blank");
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}
