import type { Scene } from "@babylonjs/core/scene";
import type { IAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/IAudioPlayer";
import type { IMmdRuntime } from "babylon-mmd/esm/Runtime/IMmdRuntime";

export declare enum DisplayTimeFormat {
    Seconds = 0,
    Frames = 1
}

/**
 * Mmd player control
 *
 * Create youtube-like player control for MMD
 *
 * It's just a GUI for debugging purposes, so it doesn't offer a lot of customization, and We don't plan to
 */
export declare class mobileMmdPlayerControl {
    public _isMobile: boolean;
    private _speedlabel;
    /**
     * Create a MMD player control
     * @param scene Scene
     * @param mmdRuntime MMD runtime
     * @param audioPlayer Audio player
     * @param isMobile If device is mobile
     * @throws {Error} if failed to get root element
     */
    constructor(scene: Scene, mmdRuntime: IMmdRuntime, audioPlayer?: IAudioPlayer, isMobile?: boolean);
    private _createPlayerControl;
    private _mobileRemoval;
    /**
     * Hide player control
     */
    hidePlayerControl(): void;
    /**
     * Show player control
     */
    showPlayerControl(): void;
    /**
     * Dispose this object
     */
    dispose(): void;
}
