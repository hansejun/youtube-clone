import mongoose, { Schema } from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  hashtags: [{ type: String, required: true }],
  meta: {
    views: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
  },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
