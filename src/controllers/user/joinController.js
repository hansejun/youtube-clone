import User from "../../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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
    req.flash("error","Already exists ID")
    return res.status(400).render("users/join", {
      pageTitle,
    });
  }
  // 이미 존재하는 email인지 체크
  if (existEmail) {
    req.flash("error","Already exists Email.")
    return res.status(400).render("users/join", {
      pageTitle,
    });
  }
  // password와 check하는 password가 동일한지 확인
  if (password !== password2) {
    req.flash("error","Check your password.")
    return res.status(400).render("users/join", {
      pageTitle,
    });
  }
  try {
    await User.create({
      username: username.trim(),
      password: password.trim(),
      email: email.trim(),
      name: name.trim(),
    });
    req.flash("info","Membership registration was successful.")
    return res.redirect("/login");
  } catch (e) {
    console.log(e);
    req.flash("error","Failed create account.")
    return res.status(400).render("users/join", {
      pageTitle,
    });
  }
};
