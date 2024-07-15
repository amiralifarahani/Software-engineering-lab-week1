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