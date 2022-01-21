import express from "express";
import {
  profile,
  getEditProfile,
  postEditProfile,
  getEditPassword,
  postEditPassword,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/:id([0-9a-f]{24})").get(profile);
userRouter
  .route("/:id([0-9a-f]{24})/edit")
  .get(getEditProfile)
  .post(postEditProfile);
userRouter
  .route("/:id([0-9a-f]{24})/edit-password")
  .get(getEditPassword)
  .post(postEditPassword);
export default userRouter;
