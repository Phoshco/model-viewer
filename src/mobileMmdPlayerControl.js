import { MmdPlayerControl } from "babylon-mmd/esm/Runtime/Util/mmdPlayerControl";

/**
 * Display time format enum used for `MmdPlayerControl.displayTimeFormat`.
 * @enum {number}
 */
export var DisplayTimeFormat = {
    Seconds: 0,
    Frames: 1
};

/**
 * A specialized MMD Player Control with adjustments for mobile devices.
 * Extends the standard MmdPlayerControl class and optionally removes
 * speed UI elements if `_isMobile` is true.
 */
export class MobileMmdPlayerControl extends MmdPlayerControl {
    /** @type {boolean} Indicates whether this control is operating on a mobile device. */
    _isMobile;

    /** @type {HTMLLabelElement|null} Holds a reference to the speed label UI. */
    _speedLabel;

    /**
     * @constructor
     * @param {any} scene - The Babylon.js scene or rendering context.
     * @param {any} mmdRuntime - The MMD runtime handling animation state.
     * @param {any} audioPlayer - The audio player to control volume/mute.
     * @param {boolean} [isMobile=false] - Flag to define mobile logic.
     */
    constructor(scene, mmdRuntime, audioPlayer, isMobile = false) {
        super(scene, mmdRuntime, audioPlayer);

        this._speedLabel = null;
        this._isMobile = isMobile;

        this._removeMobileElements();
    }

    /**
     * Removes certain UI elements if running on a mobile device.
     * e.g., speed slider and label.
     * 
     * @private
     */
    _removeMobileElements() {
        if (!this._isMobile) return;

        const playerLowerRightContainer = document.getElementById("plrc");
        const speedLabelElem = document.getElementById("sLa");
        const speedSliderElem = document.getElementById("sLi");

        // Check if each element is found before removing
        if (playerLowerRightContainer && speedLabelElem) {
            playerLowerRightContainer.removeChild(speedLabelElem);
        }
        if (playerLowerRightContainer && speedSliderElem) {
            playerLowerRightContainer.removeChild(speedSliderElem);
        }
    }

    /**
     * Internal creation of the player control UI.
     * Overridden to adjust styling and event behavior for mobile or desktop usage.
     * 
     * @protected
     * @override
     * @param {HTMLElement} parentControl - The parent DOM element to attach UI to.
     * @param {any} mmdRuntime - The MMD runtime instance.
     * @param {any} audioPlayer - The audio player instance.
     */
    _createPlayerControl(parentControl, mmdRuntime, audioPlayer) {
        const ownerDocument = parentControl.ownerDocument;

        // Root container
        const playerContainer = (this._playerContainer = ownerDocument.createElement("div"));
        playerContainer.style.position = "relative";
        playerContainer.style.bottom = "120px";
        playerContainer.style.left = "0";
        playerContainer.style.width = "100%";
        playerContainer.style.height = "120px";
        playerContainer.style.transform = "translateY(50%)";
        playerContainer.style.transition = "transform 0.5s";

        parentControl.appendChild(playerContainer);

        // Show/hide logic on hover
        playerContainer.onmouseenter = this._onPlayerControlMouseEnter;
        playerContainer.onmouseleave = this._onPlayerControlMouseLeave;

        // Sub-container for the gradient background & child UI
        const playerInnerContainer = ownerDocument.createElement("div");
        playerInnerContainer.style.position = "absolute";
        playerInnerContainer.style.bottom = "0";
        playerInnerContainer.style.left = "0";
        playerInnerContainer.style.width = "100%";
        playerInnerContainer.style.height = "50%";
        playerInnerContainer.style.boxSizing = "border-box";
        playerInnerContainer.style.background = "linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6))";
        playerInnerContainer.style.display = "flex";
        playerInnerContainer.style.flexDirection = "column";

        playerContainer.appendChild(playerInnerContainer);

        // Upper container: houses time slider
        const playerUpperContainer = ownerDocument.createElement("div");
        playerUpperContainer.style.width = "100%";
        playerUpperContainer.style.boxSizing = "border-box";
        playerUpperContainer.style.display = "flex";
        playerUpperContainer.style.flexDirection = "row";
        playerUpperContainer.style.alignItems = "center";

        playerInnerContainer.appendChild(playerUpperContainer);

        // Time slider
        const timeSlider = (this._timeSlider = ownerDocument.createElement("input"));
        timeSlider.style.width = "100%";
        timeSlider.style.height = "4px";
        timeSlider.style.border = "none";
        timeSlider.style.opacity = "0.5";
        timeSlider.type = "range";
        timeSlider.min = "0";
        timeSlider.max = mmdRuntime.animationFrameTimeDuration.toString();
        timeSlider.oninput = (e) => {
            e.preventDefault();
            mmdRuntime.seekAnimation(Number(timeSlider.value), true);
        };

        // Pause the animation while seeking
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

        playerUpperContainer.appendChild(timeSlider);

        // Lower container: houses play/sound controls, current time, speed controls, etc.
        const playerLowerContainer = ownerDocument.createElement("div");
        playerLowerContainer.style.width = "100%";
        playerLowerContainer.style.flexGrow = "1";
        playerLowerContainer.style.padding = "0 5px";
        playerLowerContainer.style.boxSizing = "border-box";
        playerLowerContainer.style.display = "flex";
        playerLowerContainer.style.flexDirection = "row";
        playerLowerContainer.style.alignItems = "space-between";

        playerInnerContainer.appendChild(playerLowerContainer);

        // Lower-left container for playback & time display
        const playerLowerLeftContainer = ownerDocument.createElement("div");
        playerLowerLeftContainer.style.flex = "1";
        playerLowerLeftContainer.style.display = "flex";
        playerLowerLeftContainer.style.flexDirection = "row";
        playerLowerLeftContainer.style.alignItems = "center";

        playerLowerContainer.appendChild(playerLowerLeftContainer);

        // Play/pause button
        const playButton = (this._playButton = ownerDocument.createElement("button"));
        playButton.style.width = "40px";
        playButton.style.border = "none";
        playButton.style.backgroundColor = "rgba(0, 0, 0, 0)";
        playButton.style.color = "white";
        playButton.style.fontSize = "18px";
        playButton.innerText = mmdRuntime.isAnimationPlaying ? "❚❚" : "▶";
        playButton.onclick = () => {
            if (mmdRuntime.isAnimationPlaying) {
                mmdRuntime.pauseAnimation();
            } else {
                mmdRuntime.playAnimation();
            }
        };
        playerLowerLeftContainer.appendChild(playButton);

        // Sound controls if audioPlayer is present
        if (audioPlayer !== undefined) {
            const soundButton = (this._soundButton = ownerDocument.createElement("button"));
            soundButton.style.width = "35px";
            soundButton.style.border = "none";
            soundButton.style.backgroundColor = "rgba(0, 0, 0, 0)";
            soundButton.style.color = "white";
            soundButton.style.fontSize = "20px";
            soundButton.innerText = audioPlayer.muted ? "🔇" : "🔊";
            soundButton.onclick = () => {
                if (audioPlayer.muted) {
                    audioPlayer.unmute();
                } else {
                    audioPlayer.mute();
                }
            };
            playerLowerLeftContainer.appendChild(soundButton);

            const volumeSlider = (this._volumeSlider = ownerDocument.createElement("input"));
            volumeSlider.style.width = "80px";
            volumeSlider.style.height = "4px";
            volumeSlider.style.border = "none";
            volumeSlider.style.opacity = "0.5";
            volumeSlider.type = "range";
            volumeSlider.min = "0";
            volumeSlider.max = "1";
            volumeSlider.step = "0.01";
            volumeSlider.value = audioPlayer.volume.toString();
            volumeSlider.oninput = () => {
                audioPlayer.volume = Number(volumeSlider.value);
            };
            playerLowerLeftContainer.appendChild(volumeSlider);
        }

        // Current frame display
        const currentFrameNumber = (this._currentFrameNumberSpan = ownerDocument.createElement("span"));
        currentFrameNumber.style.width = "40px";
        currentFrameNumber.style.textAlign = "right";
        currentFrameNumber.style.color = "white";
        currentFrameNumber.innerText =
            this.displayTimeFormat === DisplayTimeFormat.Seconds
                ? this._getFormattedTime(mmdRuntime.currentTime)
                : Math.floor(mmdRuntime.currentFrameTime).toString();
        playerLowerLeftContainer.appendChild(currentFrameNumber);

        // End frame display
        const endFrameNumber = (this._endFrameNumberSpan = ownerDocument.createElement("span"));
        endFrameNumber.style.width = "50px";
        endFrameNumber.style.textAlign = "left";
        endFrameNumber.style.color = "white";
        endFrameNumber.innerHTML =
            "&nbsp;/&nbsp;" +
            (this.displayTimeFormat === DisplayTimeFormat.Seconds
                ? this._getFormattedTime(mmdRuntime.animationDuration)
                : Math.floor(mmdRuntime.animationFrameTimeDuration).toString());
        playerLowerLeftContainer.appendChild(endFrameNumber);

        // Lower-right container for speed controls, fullscreen, etc.
        const playerLowerRightContainer = ownerDocument.createElement("div");
        playerLowerRightContainer.style.flex = "1";
        playerLowerRightContainer.style.display = "flex";
        playerLowerRightContainer.style.flexDirection = "row";
        playerLowerRightContainer.style.alignItems = "center";
        playerLowerRightContainer.style.justifyContent = "flex-end";
        playerLowerRightContainer.id = "plrc";
        playerLowerContainer.appendChild(playerLowerRightContainer);

        // Speed label
        const speedLabel = (this._speedLabel = ownerDocument.createElement("label"));
        speedLabel.style.width = "40px";
        speedLabel.style.textAlign = "center";
        speedLabel.style.color = "white";
        speedLabel.innerText = "1.00x";
        speedLabel.id = "sLa";
        playerLowerRightContainer.appendChild(speedLabel);

        // Speed slider
        const speedSlider = (this._speedSlider = ownerDocument.createElement("input"));
        speedSlider.style.width = "80px";
        speedSlider.style.height = "4px";
        speedSlider.style.border = "none";
        speedSlider.style.opacity = "0.5";
        speedSlider.type = "range";
        speedSlider.min = "0.07";
        speedSlider.max = "1";
        speedSlider.step = "0.01";
        speedSlider.id = "sLi";
        speedSlider.value = mmdRuntime.timeScale.toString();
        speedSlider.oninput = () => {
            mmdRuntime.timeScale = Number(speedSlider.value);
            speedLabel.innerText = mmdRuntime.timeScale.toFixed(2) + "x";
        };
        playerLowerRightContainer.appendChild(speedSlider);

        // Fullscreen button
        const fullscreenButton = (this._fullscreenButton = ownerDocument.createElement("button"));
        fullscreenButton.style.width = "40px";
        fullscreenButton.style.border = "none";
        fullscreenButton.style.color = "white";
        fullscreenButton.style.backgroundColor = "rgba(0, 0, 0, 0)";
        fullscreenButton.style.fontSize = "20px";
        fullscreenButton.innerHTML = `<img src="res/assets/maximise.png" alt="Fullscreen" style="width: 100%; height: 100%;">`;
        fullscreenButton.onclick = () => {
            if (ownerDocument.fullscreenElement) {
                ownerDocument.exitFullscreen();
            } else {
                parentControl.requestFullscreen();
            }
        };
        playerLowerRightContainer.appendChild(fullscreenButton);
    }
}
