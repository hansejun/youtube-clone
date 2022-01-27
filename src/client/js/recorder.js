const bodyParser = require("body-parser");

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
// ffmpeg를 사용하기 위해서는 2개의 함수를 import 시켜주어야한다.

const actionBtn = document.getElementById("recordingBtn");
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
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
  init();
};

const handleStart = () => {
  actionBtn.innerText = "Recording";
  actionBtn.disabled = true;
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleDownload);
  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (e) => {
    console.log(e.data);
    // createObjectUrl은 브라우저 메모리에서만 가능한 URL을 만들어준다.
    // 웹사이트상에 존재하는 URL처럼 보이지만 실제로는 존재하지 않는다. 단순히 브라우저의 메모리를 가리키기만 하고 있는 URL일 뿐이다.
    // 쉽게 말해 파일을 가리키고 있는 URL이다.
    videoFile = URL.createObjectURL(e.data);
    console.log(videoFile);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    actionBtn.innerText = "Download";
    actionBtn.disabled = false;
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  // getUserMedia 메소드는 객체를 argument로 가진다.
  // async와 await을 사용하려면 regenerator Runtime을 설치해야한다.
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 400, height: 400 },
  });
  video.srcObject = stream;
  video.play();
};

init();

actionBtn.addEventListener("click", handleStart);
