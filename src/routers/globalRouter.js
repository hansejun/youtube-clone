import express from "express";
import { home, search } from "../controllers/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
} from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.route("/").get(home);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.route("/logout").get(logout);
globalRouter.route("/search").get(search);
export default globalRouter;
