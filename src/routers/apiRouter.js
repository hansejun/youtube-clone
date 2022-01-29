import express from "express";
import {
  registerView,
  addComment,
  changeComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.route("/videos/:id([0-9a-f]{24})/comment").post(addComment);
apiRouter.route("/comments/:id([0-9a-f]{24})/change").post(changeComment);
export default apiRouter;