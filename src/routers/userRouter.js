import express from "express";
import {
  profile,
  getEditProfile,
  postEditProfile,
  getEditPassword,
  postEditPassword,
} from "../controllers/user/profileController";
import { onlyLoggedIn, avatarUpload } from "../middleware";
const userRouter = express.Router();

userRouter.route("/:id([0-9a-f]{24})").get(profile);
userRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(onlyLoggedIn)
  .get(getEditProfile)
  .post(avatarUpload.single("avatar"), postEditProfile);
userRouter
  .route("/:id([0-9a-f]{24})/edit-password")
  .all(onlyLoggedIn)
  .get(getEditPassword)
  .post(postEditPassword);
export default userRouter;
