const defaultOptions = {
    wrapperID: "video-wrapper",
    videoSrc: null,
    posterSrc: null,
    absolute: false,
    hideControlsOnPlay: true,
    progressColor: "red"
};

function Video(options = defaultOptions) {

    // check options and its validity
    if (!options || typeof options !== "object" || !options.wrapperID)
        throw new Error("Options not passed to the Video functions.");
    this.options = Object.assign(defaultOptions, options);

    // check the existence of video wrapper
    let wrapper = document.getElementById(this.options.wrapperID);
    if (!wrapper && (!wrapper instanceof Element || !wrapper instanceof HTMLDocument))
        throw new Error("Wrapper must be a valid node.");
    this.wrapper = wrapper;

    // initialize the video
    this.init();
}

Video.prototype.init = function () {
    if (this.video)
        return;

    // init the icons
    this.icons = {
        stop: '<svg><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>',
        play: '<svg><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>',
        pause: '<svg><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>',
        muted: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>',
        volume_0: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>',
        volume_1: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
        volume_2: '<svg><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',
        fullscreen: '<svg><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
        exitFullscreen: '<svg><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
    };

    // add special class to the wrapper to active all styles
    this.wrapper.classList.add("m-video");

    // check the existence of video tag in wrapper.
    this.video = this.wrapper.querySelector("video");
    if (!this.video) {
        if (!this.options.videoSrc)
            throw new Error("Can not find video tag in the wrapper or videoSrc in options");

        // create video tag with source and append it to wrapper
        this.generateVideoTag();
    }

    // se default controls to false;
    this.video.controls = false;

    // create custom controls element and append it to wrapper
    this.generateControls();

    // initialize the listeners.
    this.initListeners();
};

Video.prototype.generateControls = function () {
    if (!this.video || this.controls)
        return;

    this.controls = document.createElement("div");
    this.controls.classList.add("v-controls");
    if (this.options.absolute)
        this.controls.classList.add("--absolute");

    if (this.options.hideControlsOnPlay)
        this.controls.classList.add("--auto-hide");

    this.controls.innerHTML = `
            <div class="v-controls__btns">
                <div class="v-controls__btns__sound">
                    <button id="sound-toggle">${this.icons.volume_2}</button>
                    <input type="range" min="0" max="1" value="1" step="0.1" id="sound-range">
                </div>
                <div class="v-controls__btns_play">
                    <button id="video-play">${this.icons.play}</button>
                    <button id="video-stop">${this.icons.stop}</button>
                </div>
                <div class="v-controls__btns_fs">
                    <button id="video-fs">${this.icons.fullscreen}</button>
                </div>
            </div>
            <div class="v-controls__timing">
                <span class="elapsed-time">00:00</span>
                <input type="range" min="0" max="100" step="0.05" value="0" id="video-progress">
                <span class="remaining-time">00:00</span>
            </div>`;


    this.elapsedTimeSpan = this.controls.querySelector(".v-controls__timing .elapsed-time");
    this.remainingTimeSpan = this.controls.querySelector(".v-controls__timing .remaining-time");

    this.wrapper.style.setProperty('--progress-color', this.options.progressColor);
    this.wrapper.append(this.controls);

    this.videoPlayBtn = this.wrapper.querySelector(".v-controls__btns #video-play");
    this.videoStopBtn = this.wrapper.querySelector(".v-controls__btns #video-stop");
    this.soundToggleBtn = this.wrapper.querySelector(".v-controls__btns #sound-toggle");
    this.videoFullscreenBtn = this.wrapper.querySelector(".v-controls__btns #video-fs");
    this.videoProgress = this.wrapper.querySelector(".v-controls__timing input[type=range]");
    this.soundRange = this.wrapper.querySelector(".v-controls__btns__sound input[type=range]");

};

Video.prototype.initListeners = function () {
    if (!this.video || !this.controls)
        return;

    this.video.addEventListener("loadeddata", this.calcProgress.bind(this));
    this.video.addEventListener("play", this.onPlay.bind(this));
    this.video.addEventListener("pause", this.onPause.bind(this));
    this.video.addEventListener("timeupdate", this.calcProgress.bind(this));

    this.videoPlayBtn.addEventListener("click", this.togglePlay.bind(this));
    this.videoStopBtn.addEventListener("click", this.stop.bind(this));
    this.soundToggleBtn.addEventListener("click", this.soundToggle.bind(this));
    this.videoFullscreenBtn.addEventListener("click", this.toggleFullscreen.bind(this));
    this.videoProgress.addEventListener("change", this.setCurrentTime.bind(this));
    this.soundRange.addEventListener("change", this.updateVolume.bind(this));

};
