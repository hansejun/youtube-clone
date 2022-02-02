import express from "express";
import { home,getSearch } from "../controllers/video/videoController";
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
import { onlyLoggedIn, onlyLoggedOut } from "../middleware";

const globalRouter = express.Router();

globalRouter.route("/").get(home);
globalRouter.route("/join").all(onlyLoggedOut).get(getJoin).post(postJoin);
globalRouter.route("/search/:keyword").get(getSearch)
globalRouter.route("/login").all(onlyLoggedOut).get(getLogin).post(postLogin);
globalRouter.route("/login/git-start").all(onlyLoggedOut).get(startGitLogin);
globalRouter.route("/login/git-finish").all(onlyLoggedOut).get(finishGitLogin);
globalRouter
  .route("/login/kakao-start")
  .all(onlyLoggedOut)
  .get(startKakaoLogin);
globalRouter
  .route("/login/kakao-finish")
  .all(onlyLoggedOut)
  .get(finishKakaoLogin);
globalRouter
  .route("/login/naver-start")
  .all(onlyLoggedOut)
  .get(startNaverLogin);
globalRouter.route("/login/naver-finish").get(finishNaverLogin);

globalRouter.route("/logout").all(onlyLoggedIn).get(logout);
export default globalRouter;
