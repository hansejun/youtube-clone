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
videoRouter.route("/:id([0-9a-f]{24})").get(watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEditVideo)
  .post(postEditVideo);
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);

///:id([0-9a-f]{24})
export default videoRouter;
