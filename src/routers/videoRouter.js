import express from "express";
import {
  watch,
  getUploadVideo,
  postUploadVideo,
  getEditVideo,
  postEditVideo,
  deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.route("/upload").get(getUploadVideo).post(postUploadVideo);
videoRouter.route("/:id").get(watch);
videoRouter.route("/:id/edit").get(getEditVideo).post(postEditVideo);
videoRouter.route("/:id/delete").get(deleteVideo);

///:id([0-9a-f]{24})
export default videoRouter;
