import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({});
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(400).redirect("/");
  }
  return res.render("videos/watch", { pageTitle: video.title, video });
};

export const getUploadVideo = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload" });
};

export const postUploadVideo = async (req, res) => {
  const { title, content, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      content,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (e) {
    return res.status(404).redirect("/videos/upload");
  }
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(400).redirect(`/videos/${id}`);
  }
  return res.render("videos/edit-video", { pageTitle: "Edit Video", video });
};

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const { title, content, hashtags } = req.body;
  const video = await Video.findByIdAndUpdate(id, {
    title,
    content,
    hashtags: Video.formatHashtags(hashtags),
  });
  if (!video) {
    console.log("Not Found");
    return res.status(400).redirect("/");
  }
  video.save();
  return res.render("videos/watch", { pageTitle: video.title, video });
};

export const deleteVideo = (req, res) => {
  res.send("Delete Video");
};
