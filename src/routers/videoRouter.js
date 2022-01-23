import express from "express";
import {
  watch,
  getUploadVideo,
  postUploadVideo,
  getEditVideo,
  postEditVideo,
  deleteVideo,
} from "../controllers/videoController";
import { onlyLoggedIn, videoUpload } from "../middleware";
const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(onlyLoggedIn)
  .get(getUploadVideo)
  .post(videoUpload.single("videoFile"), postUploadVideo);
videoRouter.route("/:id([0-9a-f]{24})").get(watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(onlyLoggedIn)
  .get(getEditVideo)
  .post(postEditVideo);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(onlyLoggedIn)
  .get(deleteVideo);

///:id([0-9a-f]{24})
export default videoRouter;
