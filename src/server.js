import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middleware";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import flash from "express-flash";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", "src/views");

app.use(express.urlencoded({ extended: true }));
// form을 이해하고 req.body로 받기 위한 코드
app.use(logger);
app.use("/convert", express.static("node_modules/@ffmpeg/core/dist"));
app.use(express.json());

//app.use((req, res, next) => {
//res.header("Cross-Origin-Embedder-Policy", "require-corp");
//res.header("Cross-Origin-Opener-Policy", "same-origin");
//next();
//});
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
// session을 MongoDB에 저장
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use(flash());
app.use(localsMiddleware);
app.use("/api", apiRouter);
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
