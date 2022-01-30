import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id)
    .populate("owner")
    .populate({
      path: "comments",
      populate: {
        path: "owner",
      },
    });
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  if (!video) {
    req.flash("error","Failed to bring video information.")
    return res.status(400).redirect("/");
  }
  return res.render("videos/watch", { pageTitle: video.title, video, videos });
};

export const getUploadVideo = (req, res) => {
  return res.render("videos/upload", { pageTitle: "Upload" });
};

export const postUploadVideo = async (req, res) => {
  const { title, content, hashtags } = req.body;
  const { videoFile, thumbFile } = req.files;
  const { _id } = req.session.user;
  try {
    const newVideo = await Video.create({
      title,
      content,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl: videoFile[0].path,
      thumbUrl: thumbFile[0].path,
      owner: _id,
    });
    const user = await User.findById(_id).populate("videos");
    user.videos.push(newVideo._id);
    user.save();
    req.session.user = user;
    return res.redirect("/");
  } catch (e) {
    req.flash("error","Video upload failed.")
    return res.status(404).redirect("/videos/upload");
  }
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  const newHashtags = video.hashtags.map((hashtag) => hashtag.substr(1).trim());
  console.log(video.owner);
  if (!video) {
    req.flash("error","Failed to bring video information.")
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
  const {_id} = req.session.user;
  const video = await Video.findById(id).populate("comments").populate("owner");
  //const user = await User.findById(video.owner._id);
  let comments = [...video.comments];
  let userOwners = [];
  let userComments = [];

  for(let i=0;i<comments.length;i++){ 
    await Comment.findByIdAndDelete(comments[i]._id);
    userOwners.push(comments[i].owner);
    userComments.push(comments[i]._id);
  }
 
  for(let i=0; i<userOwners.length;i++){ 
    let user = await User.findById({_id:userOwners[i]});
    user.comments = user.comments.filter((el) => String(el) !== String(userComments[i])) 
    await user.save();
    console.log(user);
  }

  const userModel = await User.findById(video.owner._id);
  let newUserVideos = userModel.videos.filter((el)=> String(el) !== String(id));
  
  userModel.videos = newUserVideos;
  await userModel.save();
  req.session.user = userModel;
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

export const addComment = async (req, res) => {
  const userId = req.session.user._id;
  const { id } = req.params;
  const { text } = req.body;

  const video = await Video.findById(id).populate("owner").populate("comments");
  try{
    const comment = await Comment.create({
      owner: userId,
      video: id,
      text,
    });
    const user = await User.findById(userId);
    user.comments.push(comment._id);
    video.comments.push(comment._id);
    await user.save();
    video.save();
    req.session.user = user;
    return res.status(200).json({ newCommentId: comment._id, user });
  }catch(e){
    req.flash("error","Failed to create a comment.")
    return res.sendStatus(400);
  }
  
};

export const changeComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  await Comment.findByIdAndUpdate(id, {
    text,
  });
  return res.sendStatus(200);
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id)
    .populate("owner")
    .populate("video");
  const user = await User.findById(comment.owner._id);
  const video = await Video.findById(comment.video._id);

  if (!comment || !user || !video) {
    req.flash("error","Failed to delete the comment.")
    return res.sendStatus(400);
  }
  const userComments = user.comments.filter(
    (element) => String(element._id) !== String(id)
  );
  const videoComments = video.comments.filter(
    (element) => String(element._id) !== String(id)
  );
  user.comments = userComments;
  video.comments = videoComments;
  user.save();
  video.save();
  req.session.user = user;
  console.log(req.session.user);
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(200);
};
