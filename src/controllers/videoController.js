import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  if (!video) {
    return res.status(400).redirect("/");
  }
  return res.render("videos/watch", { pageTitle: video.title, video, videos });
};

export const getUploadVideo = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload" });
};

export const postUploadVideo = async (req, res) => {
  const { title, content, hashtags } = req.body;
  const file = req.file;
  const { _id } = req.session.user;
  try {
    const newVideo = await Video.create({
      title,
      content,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl: file.path,
      owner: _id,
    });
    const user = await User.findById(_id).populate("videos");
    user.videos.push(newVideo._id);
    user.save();
    req.session.user = user;
    return res.redirect("/");
  } catch (e) {
    return res.status(404).redirect("/videos/upload");
  }
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  const newHashtags = video.hashtags.map((hashtag) => hashtag.substr(1).trim());
  console.log(video.owner);
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

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(400);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};
