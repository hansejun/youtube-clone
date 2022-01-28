const bodyParser = require("body-parser");

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
// ffmpeg를 사용하기 위해서는 2개의 함수를 import 시켜주어야한다.

const previewContainer = document.getElementById("preview-container");
const actionBtn = document.getElementById("recordingBtn");
const btnIcon = actionBtn.querySelector("i");
const returnBtn = previewContainer.querySelector(".upload-preview__btn");
const video = document.getElementById("preview");

let stream = null;
let recorder = null;
let videoFile = null;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload);

  actionBtn.innerText = "Transcording...";

  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "/convert/ffmpeg-core.js",
  });

  await ffmpeg.load();

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer, { type: "image/jpg" }]);

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false;
  actionBtn.style.backgroundColor = "green";
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", init);
  previewContainer.style.display = "none";
  stream = null;
  video.srcObject = stream;
};

const handleStart = () => {
  actionBtn.disabled = true;
  actionBtn.innerText = "Recording";
  actionBtn.style.backgroundColor = "red";
  actionBtn.removeEventListener("click", handleStart);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    console.log(e.data);
    videoFile = URL.createObjectURL(e.data);
    console.log(videoFile);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.style.backgroundColor = "green";
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
    actionBtn.addEventListener("click", handleDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
    actionBtn.addEventListener("click", handleDownload);
    returnBtn.style.opacity = 1;
    returnBtn.addEventListener("click", handleReturn);
  }, 5000);
};

const handleReturn = () => {
  actionBtn.removeEventListener("click", handleDownload);
  init();
};

const init = async () => {
  actionBtn.style.backgroundColor = "green";
  returnBtn.style.opacity = 0;
  previewContainer.style.display = "block";
  actionBtn.removeEventListener("click", init);
  actionBtn.addEventListener("click", handleStart);
  actionBtn.innerText = "Start";
  // getUserMedia 메소드는 객체를 argument로 가진다.
  // async와 await을 사용하려면 regenerator Runtime을 설치해야한다.
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 640, height: 360 },
  });
  video.srcObject = stream;
  video.play();
};

actionBtn.addEventListener("click", init);
