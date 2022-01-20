import Video from "../models/Video";

export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

export const watch = (req, res) => {
  res.send("Watch Page");
};

export const getUploadVideo = (req, res) => {
  return res.render("upload", { pageTitle: "Upload" });
};

export const postUploadVideo = async (req, res) => {
  const { title, content, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      content,
      hashtags,
    });
    return res.redirect("/");
  } catch (e) {
    return res.status(404).redirect("/videos/upload");
  }
};

export const getEditVideo = (req, res) => {
  res.send("Edit Video");
};

export const postEditVideo = (req, res) => {
  res.send("Post Edit Video");
};

export const deleteVideo = (req, res) => {
  res.send("Delete Video");
};
