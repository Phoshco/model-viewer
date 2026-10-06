import { MmdPlayerControl } from "babylon-mmd/esm/Runtime/Util/mmdPlayerControl";

import "./mmdPlayerControl.css";

/**
 * Inline SVG icon markup used by the playbar buttons.
 *
 * Using inline SVG (instead of emoji/text glyphs) keeps every button visually
 * consistent and crisp at any DPI. All icons use `currentColor` so a single CSS
 * `color` drives their appearance (including hover states).
 */
const ICONS = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
    volumeOn:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4.03v8.06A4.5 4.5 0 0016.5 12zM14 3.23v2.06a7 7 0 010 13.42v2.06a9 9 0 000-17.54z"/></svg>',
    volumeOff:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.59 3L19 9.41 17.59 8 15 10.59 12.41 8 11 9.41 13.59 12 11 14.59 12.41 16 15 13.41 17.59 16 19 14.59z"/></svg>',
    fullscreen:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>'
};

/**
 * Display time format
 *
 * This enum is used for `MmdPlayerControl.displayTimeFormat`
 */
export var DisplayTimeFormat;
(function (DisplayTimeFormat) {
    DisplayTimeFormat[DisplayTimeFormat["Seconds"] = 0] = "Seconds";
    DisplayTimeFormat[DisplayTimeFormat["Frames"] = 1] = "Frames";
})(DisplayTimeFormat || (DisplayTimeFormat = {}));

export class mobileMmdPlayerControl extends MmdPlayerControl {
    /** How long (ms) the bar stays visible after playback starts before it collapses. */
    static COLLAPSE_DELAY_MS = 1500;

    _isMobile;
    _speedlabel;

    constructor(scene, mmdRuntime, audioPlayer, isMobile = false)  {
        super(scene, mmdRuntime, audioPlayer);
        this._speedlabel = null;
        this._isMobile = isMobile;
        this._mmdRuntimeRef = mmdRuntime;
        this._audioPlayerRef = audioPlayer ?? null;
        // Tracks whether the pointer is currently over the bar, so we never
        // collapse the bar out from under an interacting user.
        this._isHovered = false;
        // Pending "collapse after a short delay" timer (set when playback starts).
        this._collapseDelayId = undefined;
        this._mobileRemoval();

        // The base MmdPlayerControl writes emoji/text into the play & sound
        // buttons through its own observers (and resets the time slider every
        // frame). We register our own observers *after* the base ones so ours
        // run last and win: they paint crisp SVG icons, keep the accent fill of
        // the time slider in sync with playback, and auto-collapse the bar when
        // the animation plays. Keeping the base observers intact means this
        // stays robust across babylon-mmd versions.
        //
        // The base class only hides the bar via mouse-leave timeouts, so it
        // behaves inconsistently (it never looks at the play state). We drive
        // the collapse off the actual play/pause state instead: collapse when
        // playback starts, reveal when it pauses.
        this._syncIcons();
        this._onPlayStateChanged = () => {
            this._updatePlayIcon();
            this._updateAutoCollapse();
        };
        this._onMuteChanged = () => this._updateSoundIcon();
        this._onTick = () => this._updateTimeFill();
        mmdRuntime.onPlayAnimationObservable.add(this._onPlayStateChanged);
        mmdRuntime.onPauseAnimationObservable.add(this._onPlayStateChanged);
        mmdRuntime.onAnimationTickObservable.add(this._onTick);
        mmdRuntime.onAnimationDurationChangedObservable.add(this._onTick);
        this._audioPlayerRef?.onMuteStateChangedObservable.add(this._onMuteChanged);

        // `_createPlayerControl` (called inside super()) wired the container's
        // mouse handlers to the *base* class versions, because our overrides
        // aren't installed until after super() returns. Re-point them to our
        // play-aware handlers now, and set the initial visibility from the
        // current play state.
        this._boundMouseEnter = () => {
            this._isHovered = true;
            this._updateAutoCollapse();
        };
        this._boundMouseLeave = () => {
            this._isHovered = false;
            this._updateAutoCollapse();
        };
        if (this._playerContainer) {
            this._playerContainer.onmouseenter = this._boundMouseEnter;
            this._playerContainer.onmouseleave = this._boundMouseLeave;
        }
        this._updateAutoCollapse();
    }

    /**
     * Collapse the bar while the animation is playing (unless the pointer is
     * hovering it) and reveal it whenever playback is paused/stopped.
     *
     * Called on every play/pause transition and on hover enter/leave so the
     * bar's visibility always reflects the current state.
     */
    _updateAutoCollapse() {
        if (!this._playerContainer) return;
        // Cancel any pending base-class hide timeout and our own collapse delay
        // so the different timers don't fight each other.
        if (this._hidePlayerControlTimeoutId !== undefined) {
            window.clearTimeout(this._hidePlayerControlTimeoutId);
            this._hidePlayerControlTimeoutId = undefined;
        }
        if (this._collapseDelayId !== undefined) {
            window.clearTimeout(this._collapseDelayId);
            this._collapseDelayId = undefined;
        }
        if (this._mmdRuntimeRef.isAnimationPlaying && !this._isHovered) {
            // Give the user a brief moment to see the bar after pressing play
            // before it slides away. Any state change (pause/hover) cancels
            // this pending collapse above.
            this._collapseDelayId = window.setTimeout(() => {
                this._collapseDelayId = undefined;
                if (this._mmdRuntimeRef.isAnimationPlaying && !this._isHovered) {
                    this.hidePlayerControl();
                }
            }, mobileMmdPlayerControl.COLLAPSE_DELAY_MS);
        } else {
            this.showPlayerControl();
        }
    }

    /** Repaint every icon / fill to the current runtime state. */
    _syncIcons() {
        this._updatePlayIcon();
        this._updateSoundIcon();
        this._updateTimeFill();
    }

    _updatePlayIcon() {
        if (!this._playButton) return;
        this._playButton.innerHTML = this._mmdRuntimeRef.isAnimationPlaying ? ICONS.pause : ICONS.play;
    }

    _updateSoundIcon() {
        if (!this._soundButton || !this._audioPlayerRef) return;
        this._soundButton.innerHTML = this._audioPlayerRef.muted ? ICONS.volumeOff : ICONS.volumeOn;
    }

    /** Set a slider's accent-fill (0..100) via the `--mmd-fill` CSS variable. */
    _setFill(slider) {
        if (!slider) return;
        const min = Number(slider.min) || 0;
        const max = Number(slider.max);
        const span = max - min;
        const pct = span > 0 ? ((Number(slider.value) - min) / span) * 100 : 0;
        slider.style.setProperty("--mmd-fill", Math.max(0, Math.min(100, pct)) + "%");
    }

    _updateTimeFill() {
        this._setFill(this._timeSlider);
    }

    _mobileRemoval() {
        if (this._isMobile) {
            const playerLowerRightContainer = document.getElementById('plrc');
            const sLa = document.getElementById('sLa');
            const sLi = document.getElementById('sLi');
            playerLowerRightContainer.removeChild(sLa);
            playerLowerRightContainer.removeChild(sLi);
        }
    }

    _createPlayerControl(parentControl, mmdRuntime, audioPlayer) {
        const ownerDocument = parentControl.ownerDocument;
        const playerContainer = this._playerContainer = ownerDocument.createElement("div");
        playerContainer.style.position = "relative";
        playerContainer.style.bottom = "120px";
        playerContainer.style.left = "0";
        playerContainer.style.width = "100%";
        playerContainer.style.height = "120px";
        playerContainer.style.transform = "translateY(50%)";
        playerContainer.style.transition = "transform 0.5s";
        playerContainer.classList.add("mmd-playbar");
        parentControl.appendChild(playerContainer);
        playerContainer.onmouseenter = this._onPlayerControlMouseEnter;
        playerContainer.onmouseleave = this._onPlayerControlMouseLeave;
        {
            const playerInnerContainer = ownerDocument.createElement("div");
            playerInnerContainer.classList.add("mmd-playbar__inner");
            playerInnerContainer.style.position = "absolute";
            playerInnerContainer.style.bottom = "0";
            playerInnerContainer.style.left = "0";
            playerInnerContainer.style.width = "100%";
            playerInnerContainer.style.height = "50%";
            playerInnerContainer.style.display = "flex";
            playerInnerContainer.style.flexDirection = "column";
            playerContainer.appendChild(playerInnerContainer);
            {
                const playerUpperContainer = ownerDocument.createElement("div");
                playerUpperContainer.style.width = "100%";
                playerUpperContainer.style.boxSizing = "border-box";
                playerUpperContainer.style.display = "flex";
                playerUpperContainer.style.flexDirection = "row";
                playerUpperContainer.style.alignItems = "center";
                playerInnerContainer.appendChild(playerUpperContainer);
                {
                    const timeSlider = this._timeSlider = ownerDocument.createElement("input");
                    timeSlider.classList.add("mmd-playbar__slider", "mmd-playbar__slider--time");
                    timeSlider.style.width = "100%";
                    timeSlider.type = "range";
                    timeSlider.min = "0";
                    timeSlider.max = mmdRuntime.animationFrameTimeDuration.toString();
                    timeSlider.oninput = (e) => {
                        e.preventDefault();
                        mmdRuntime.seekAnimation(Number(timeSlider.value), true);
                        this._setFill(timeSlider);
                    };
                    {
                        let isPlaySeeking = false;
                        timeSlider.onmousedown = () => {
                            if (mmdRuntime.isAnimationPlaying) {
                                mmdRuntime.pauseAnimation();
                                isPlaySeeking = true;
                            }
                        };
                        timeSlider.onmouseup = () => {
                            if (isPlaySeeking) {
                                mmdRuntime.playAnimation();
                                isPlaySeeking = false;
                            }
                        };
                    }
                    playerUpperContainer.appendChild(timeSlider);
                }
                const playerLowerContainer = ownerDocument.createElement("div");
                playerLowerContainer.style.width = "100%";
                playerLowerContainer.style.flexGrow = "1";
                playerLowerContainer.style.boxSizing = "border-box";
                playerLowerContainer.style.display = "flex";
                playerLowerContainer.style.flexDirection = "row";
                playerLowerContainer.style.alignItems = "center";
                playerLowerContainer.style.gap = "6px";
                playerInnerContainer.appendChild(playerLowerContainer);
                {
                    const playerLowerLeftContainer = ownerDocument.createElement("div");
                    playerLowerLeftContainer.style.flex = "1";
                    playerLowerLeftContainer.style.display = "flex";
                    playerLowerLeftContainer.style.flexDirection = "row";
                    playerLowerLeftContainer.style.alignItems = "center";
                    playerLowerLeftContainer.style.gap = "6px";
                    playerLowerContainer.appendChild(playerLowerLeftContainer);
                    {
                        const playButton = this._playButton = ownerDocument.createElement("button");
                        playButton.classList.add("mmd-playbar__btn");
                        playButton.style.width = "36px";
                        playButton.style.height = "36px";
                        playButton.innerHTML = mmdRuntime.isAnimationPlaying ? ICONS.pause : ICONS.play;
                        playButton.onclick = () => {
                            if (mmdRuntime.isAnimationPlaying)
                                mmdRuntime.pauseAnimation();
                            else
                                mmdRuntime.playAnimation();
                        };
                        playerLowerLeftContainer.appendChild(playButton);
                        if (audioPlayer !== undefined) {
                            const soundButton = this._soundButton = ownerDocument.createElement("button");
                            soundButton.classList.add("mmd-playbar__btn");
                            soundButton.style.width = "34px";
                            soundButton.style.height = "34px";
                            soundButton.innerHTML = audioPlayer.muted ? ICONS.volumeOff : ICONS.volumeOn;
                            soundButton.onclick = () => {
                                if (audioPlayer.muted) {
                                    audioPlayer.unmute();
                                }
                                else {
                                    audioPlayer.mute();
                                }
                            };
                            playerLowerLeftContainer.appendChild(soundButton);
                            const volumeSlider = this._volumeSlider = ownerDocument.createElement("input");
                            volumeSlider.classList.add("mmd-playbar__slider");
                            volumeSlider.style.width = "80px";
                            volumeSlider.type = "range";
                            volumeSlider.min = "0";
                            volumeSlider.max = "1";
                            volumeSlider.step = "0.01";
                            volumeSlider.value = audioPlayer.volume.toString();
                            this._setFill(volumeSlider);
                            volumeSlider.oninput = () => {
                                audioPlayer.volume = Number(volumeSlider.value);
                                this._setFill(volumeSlider);
                            };
                            playerLowerLeftContainer.appendChild(volumeSlider);
                        }
                        const curentFrameNumber = this._currentFrameNumberSpan = ownerDocument.createElement("span");
                        curentFrameNumber.classList.add("mmd-playbar__time");
                        curentFrameNumber.style.minWidth = "40px";
                        curentFrameNumber.style.textAlign = "right";
                        curentFrameNumber.innerText = this.displayTimeFormat === DisplayTimeFormat.Seconds
                            ? this._getFormattedTime(mmdRuntime.currentTime)
                            : Math.floor(mmdRuntime.currentFrameTime).toString();
                        playerLowerLeftContainer.appendChild(curentFrameNumber);
                        const endFrameNumber = this._endFrameNumberSpan = ownerDocument.createElement("span");
                        endFrameNumber.classList.add("mmd-playbar__time", "mmd-playbar__time--total");
                        endFrameNumber.style.minWidth = "50px";
                        endFrameNumber.style.textAlign = "left";
                        endFrameNumber.innerHTML = "&nbsp;/&nbsp;" +
                            (this.displayTimeFormat === DisplayTimeFormat.Seconds
                                ? this._getFormattedTime(mmdRuntime.animationDuration)
                                : Math.floor(mmdRuntime.animationFrameTimeDuration).toString());
                        playerLowerLeftContainer.appendChild(endFrameNumber);
                    }
                    const playerLowerRightContainer = ownerDocument.createElement("div");
                    playerLowerRightContainer.style.flex = "1";
                    playerLowerRightContainer.style.display = "flex";
                    playerLowerRightContainer.style.flexDirection = "row";
                    playerLowerRightContainer.style.alignItems = "center";
                    playerLowerRightContainer.style.justifyContent = "flex-end";
                    playerLowerRightContainer.style.gap = "6px";
                    playerLowerRightContainer.id = "plrc";
                    playerLowerContainer.appendChild(playerLowerRightContainer);
                    {
                        const speedLabel = this._speedlabel = ownerDocument.createElement("label");
                        speedLabel.classList.add("mmd-playbar__speed-label");
                        speedLabel.style.width = "40px";
                        speedLabel.style.textAlign = "center";
                        speedLabel.innerText = "1.00x";
                        speedLabel.id = "sLa";
                        playerLowerRightContainer.appendChild(speedLabel);
                        const speedSlider = this._speedSlider = ownerDocument.createElement("input");
                        speedSlider.classList.add("mmd-playbar__slider");
                        speedSlider.style.width = "80px";
                        speedSlider.type = "range";
                        speedSlider.min = "0.07";
                        speedSlider.max = "1";
                        speedSlider.step = "0.01";
                        speedSlider.id = "sLi";
                        speedSlider.value = mmdRuntime.timeScale.toString();
                        this._setFill(speedSlider);
                        speedSlider.oninput = () => {
                            mmdRuntime.timeScale = Number(speedSlider.value);
                            speedLabel.innerText = mmdRuntime.timeScale.toFixed(2) + "x";
                            this._setFill(speedSlider);
                        };
                        playerLowerRightContainer.appendChild(speedSlider);
                        const fullscreenButton = this._fullscreenButton = ownerDocument.createElement("button");
                        fullscreenButton.classList.add("mmd-playbar__btn");
                        fullscreenButton.style.width = "34px";
                        fullscreenButton.style.height = "34px";
                        fullscreenButton.innerHTML = ICONS.fullscreen;
                        fullscreenButton.onclick = () => {
                            if (ownerDocument.fullscreenElement)
                                ownerDocument.exitFullscreen();
                            else
                                parentControl.requestFullscreen();
                        };
                        playerLowerRightContainer.appendChild(fullscreenButton);
                    }
                }
            }
        }
    }
}