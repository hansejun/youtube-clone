import Video from "../../models/Video";
import User from "../../models/User";
import Comment from "../../models/Comment";

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