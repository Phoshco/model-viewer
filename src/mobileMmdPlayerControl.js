import { MmdPlayerControl } from "babylon-mmd/esm/Runtime/Util/mmdPlayerControl";

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
    _isMobile;
    _speedlabel;

    constructor(scene, mmdRuntime, audioPlayer, isMobile = false)  {
        super(scene, mmdRuntime, audioPlayer);
        this._speedlabel = null;
        this._isMobile = isMobile;
        this._mobileRemoval();
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
        parentControl.appendChild(playerContainer);
        playerContainer.onmouseenter = this._onPlayerControlMouseEnter;
        playerContainer.onmouseleave = this._onPlayerControlMouseLeave;
        {
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
                playerLowerContainer.style.padding = "0 5px";
                playerLowerContainer.style.boxSizing = "border-box";
                playerLowerContainer.style.display = "flex";
                playerLowerContainer.style.flexDirection = "row";
                playerLowerContainer.style.alignItems = "space-between";
                playerInnerContainer.appendChild(playerLowerContainer);
                {
                    const playerLowerLeftContainer = ownerDocument.createElement("div");
                    playerLowerLeftContainer.style.flex = "1";
                    playerLowerLeftContainer.style.display = "flex";
                    playerLowerLeftContainer.style.flexDirection = "row";
                    playerLowerLeftContainer.style.alignItems = "center";
                    playerLowerContainer.appendChild(playerLowerLeftContainer);
                    {
                        const playButton = this._playButton = ownerDocument.createElement("button");
                        playButton.style.width = "40px";
                        playButton.style.border = "none";
                        playButton.style.backgroundColor = "rgba(0, 0, 0, 0)";
                        playButton.style.color = "white";
                        playButton.style.fontSize = "18px";
                        playButton.innerText = mmdRuntime.isAnimationPlaying ? "❚❚" : "▶";
                        playButton.onclick = () => {
                            if (mmdRuntime.isAnimationPlaying)
                                mmdRuntime.pauseAnimation();
                            else
                                mmdRuntime.playAnimation();
                        };
                        playerLowerLeftContainer.appendChild(playButton);
                        if (audioPlayer !== undefined) {
                            const soundButton = this._soundButton = ownerDocument.createElement("button");
                            soundButton.style.width = "35px";
                            soundButton.style.border = "none";
                            soundButton.style.backgroundColor = "rgba(0, 0, 0, 0)";
                            soundButton.style.color = "white";
                            soundButton.style.fontSize = "20px";
                            soundButton.innerText = audioPlayer.muted ? "🔇" : "🔊";
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
                        const curentFrameNumber = this._currentFrameNumberSpan = ownerDocument.createElement("span");
                        curentFrameNumber.style.width = "40px";
                        curentFrameNumber.style.textAlign = "right";
                        curentFrameNumber.style.color = "white";
                        curentFrameNumber.innerText = this.displayTimeFormat === DisplayTimeFormat.Seconds
                            ? this._getFormattedTime(mmdRuntime.currentTime)
                            : Math.floor(mmdRuntime.currentFrameTime).toString();
                        playerLowerLeftContainer.appendChild(curentFrameNumber);
                        const endFrameNumber = this._endFrameNumberSpan = ownerDocument.createElement("span");
                        endFrameNumber.style.width = "50px";
                        endFrameNumber.style.textAlign = "left";
                        endFrameNumber.style.color = "white";
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
                    playerLowerRightContainer.id = "plrc";
                    playerLowerContainer.appendChild(playerLowerRightContainer);
                    {
                        const speedLabel = this._speedlabel = ownerDocument.createElement("label");
                        speedLabel.style.width = "40px";
                        speedLabel.style.textAlign = "center";
                        speedLabel.style.color = "white";
                        speedLabel.innerText = "1.00x";
                        speedLabel.id = "sLa";
                        playerLowerRightContainer.appendChild(speedLabel);
                        const speedSlider = this._speedSlider = ownerDocument.createElement("input");
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
                        const fullscreenButton = this._fullscreenButton = ownerDocument.createElement("button");
                        fullscreenButton.style.width = "40px";
                        fullscreenButton.style.border = "none";
                        fullscreenButton.style.color = "white";
                        fullscreenButton.style.backgroundColor = "rgba(0, 0, 0, 0)";
                        fullscreenButton.style.fontSize = "20px";
                        fullscreenButton.innerText = "🗖";
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