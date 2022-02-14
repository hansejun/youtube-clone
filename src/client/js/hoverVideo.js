const videoBox = document.querySelectorAll(".video-mixin");
let video;
let timer;
const handleHoverVideo = (e) => {
  timer = setTimeout(() => {
    const a = e.target;
    const hoverBox = a.querySelector(".hoverVideo");
    video = a.querySelector("video");
    hoverBox.style.display = "block";
    setTimeout(() => video.play(), 300);
  }, 1000);
};

const handleLeaveVideo = (e) => {
  clearTimeout(timer);
  if (video) {
    const a = e.target;
    const hoverBox = a.querySelector(".hoverVideo");
    hoverBox.style.display = "none";
    video.pause();
    video.currentTime = 0;
  }
  video = "";
};
if (videoBox) {
  for (i = 0; i < videoBox.length; i++) {
    videoBox[i].addEventListener("mouseenter", handleHoverVideo);
    videoBox[i].addEventListener("mouseleave", handleLeaveVideo);
  }
}
