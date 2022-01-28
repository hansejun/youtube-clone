import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video" },
  text: { type: String, required: true },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
