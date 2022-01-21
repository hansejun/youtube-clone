import express from "express";
import {
  profile,
  getEditProfile,
  postEditProfile,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/:id([0-9a-f]{24})").get(profile);
userRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEditProfile)
  .post(postEditProfile);
export default userRouter;
