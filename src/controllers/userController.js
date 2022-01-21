import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("users/join", { pageTitle: "Join Page" });
};

export const postJoin = async (req, res) => {
  const pageTitle = "Join Page";
  const { username, password, password2, email, name } = req.body;
  const existUsername = await User.exists({ username });
  const existEmail = await User.exists({ email });
  // 이미 존재하는 ID인지 체크
  if (existUsername) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "Already exists ID",
    });
  }
  // 이미 존재하는 email인지 체크
  if (existEmail) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "Already exists Email",
    });
  }
  // password와 check하는 password가 동일한지 확인
  if (password !== password2) {
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "Check your password",
    });
  }
  try {
    await User.create({
      username,
      password,
      email,
      name,
    });
    return res.redirect("/login");
  } catch (e) {
    console.log(e);
    return res.status(400).render("users/join", {
      pageTitle,
      errorMessage: "Failed create account",
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "Login Page" });
};

export const postLogin = async (req, res) => {
  const pageTitle = "Login Page";
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  // 계정이 존재하는지 확인
  console.log(user);
  if (!user) {
    return res
      .status(400)
      .render("users/login", { pageTitle, errorMessage: "Check your ID" });
  }
  // 비밀번호 확인 맞으면 true 아니면 false 반환
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(400).render("users/login", {
      pageTitle,
      errorMessage: "Check your Password",
    });
  }
  return res.redirect("/");
};
