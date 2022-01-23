import Video from "../models/Video";

export const home = async (req, res) => {
  const videos = await Video.find({}).sort({ createdAt: "desc" });
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
  const file = req.file;
  try {
    const newVideo = await Video.create({
      title,
      content,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl: file.path,
    });
    return res.redirect("/");
  } catch (e) {
    return res.status(404).redirect("/videos/upload");
  }
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const newHashtags = video.hashtags.map((hashtag) => hashtag.substr(1).trim());
  if (!video) {
    return res.status(400).redirect(`/videos/${id}`);
  }
  return res.render("videos/edit-video", {
    pageTitle: "Edit Video",
    video,
    newHashtags,
  });
};

export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const { title, content, hashtags } = req.body;
  await Video.findByIdAndUpdate(id, {
    title,
    content,
    hashtags: Video.formatHashtags(hashtags),
  });
  const video = await Video.findById(id);
  return res.render("videos/watch", { pageTitle: video.title, video });
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({ title: { $regex: new RegExp(keyword, "i") } });
  }
  return res.render("search", { pageTitle: "Search Page", videos });
};
