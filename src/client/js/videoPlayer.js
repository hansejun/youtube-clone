const controls = document.getElementById("watchControls");
const video = document.querySelector(".watch video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const screenBtn = document.getElementById("fullScreen");
const screenBtnIcon = screenBtn.querySelector("i");
const timeline = document.getElementById("timeline");
const container = document.querySelector(".watch-container");
const textarea = document.querySelector(".watch-comment__add form textarea");
const playerIconBtn = document.querySelector(".watch-video__icons");
const playerIcon = playerIconBtn.querySelector("i");

let volumeValue = 0.5;
video.volume = volumeValue;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const removeClassList = () => {
  playerIconBtn.classList.remove("fadeOut");
};

const handlePlayClick = () => {
  if (video.paused) {
    video.play();
    playerIconBtn.classList.add("fadeOut");
  } else {
    video.pause();
    playerIconBtn.classList.add("fadeOut");
  }
  playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
  playerIcon.className = video.paused ? "fas fa-pause" : "fas fa-play";
  setTimeout(removeClassList, 500);
};

const handleMuteClick = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.className = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;

  if (video.muted) {
    video.muted = false;
    muteBtnIcon.className = "fas fa-volume-up";
  }
  if (value == 0) {
    video.muted = true;
    muteBtnIcon.className = "fas fa-volume-mute";
  }
  volumeValue = value;
  video.volume = volumeValue;
};

const formatTime = (time) => new Date(time * 1000).toISOString().substr(14, 5);

const handleLoadedMetaData = (e) => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handelTimelineChange = () => {
  video.currentTime = timeline.value;
};

const handleFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    container.requestFullscreen();
  }
  screenBtnIcon.className = document.fullscreenElement
    ? "fas fa-expand"
    : "fas fa-compress";
};

const hideControls = () => {
  controls.classList.remove("showing");
};

const handleMouseMove = (e) => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  controls.classList.add("showing");
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 2000);
};

const handleTimePlus = (num) => {
  timeline.value += num;
  handelTimelineChange();
};
const handleTimeMinus = (num) => {
  timeline.value -= num;
  handelTimelineChange();
};

const handleKeyDown = (event) => {
  const key = event.key;
  console.log(key);
  if (key === " ") {
    handlePlayClick();
  }
  if (key === "ArrowRight") {
    handleTimePlus(5);
  }
  if (key === "ArrowLeft") {
    handleTimeMinus(5);
  }
  if (event.keyCode == 32) {
    event.preventDefault();
  }
};

const handleEnded = () => {
  const { id } = container.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

const handleCancelKeyDown = () => {
  window.removeEventListener("keydown", handleKeyDown);
};
const handlePlayKeyDown = () => {
  window.addEventListener("keydown", handleKeyDown);
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("canplay", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handelTimelineChange);
screenBtn.addEventListener("click", handleFullScreen);
container.addEventListener("mousemove", handleMouseMove);
container.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handlePlayClick);
window.addEventListener("keydown", handleKeyDown);
textarea.addEventListener("focus", handleCancelKeyDown);
textarea.addEventListener("blur", handlePlayKeyDown);
video.addEventListener("ended", handleEnded);

handleLoadedMetaData();
