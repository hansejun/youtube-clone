import express from "express";
import { home } from "../controllers/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.route("/").get(home);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
export default globalRouter;
