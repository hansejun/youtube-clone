import express from "express";
import { home, search } from "../controllers/videoController";
import { getJoin, postJoin } from "../controllers/user/joinController";
import {
  logout,
  getLogin,
  postLogin,
  startGitLogin,
  finishGitLogin,
  startKakaoLogin,
  finishKakaoLogin,
  startNaverLogin,
  finishNaverLogin,
} from "../controllers/user/loginController";

const globalRouter = express.Router();

globalRouter.route("/").get(home);
globalRouter.route("/join").get(getJoin).post(postJoin);

globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.route("/login/git-start").get(startGitLogin);
globalRouter.route("/login/git-finish").get(finishGitLogin);
globalRouter.route("/login/kakao-start").get(startKakaoLogin);
globalRouter.route("/login/kakao-finish").get(finishKakaoLogin);
globalRouter.route("/login/naver-start").get(startNaverLogin);
globalRouter.route("/login/naver-finish").get(finishNaverLogin);

globalRouter.route("/logout").get(logout);
globalRouter.route("/search").get(search);
export default globalRouter;
