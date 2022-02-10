import User from "../../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import Video from "../../models/Video";

export const profile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: { path: "owner" },
  });
  if (!user) {
    req.flash("error", "Failed to bring user information.");
    return res.status(400).redirect("/");
  }
  return res.render("users/profile", {
    pageTitle: user.username,
    user,
  });
};

export const getEditProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    req.flash("error", "Failed to bring user information.");
    return res.status(400).redirect(`/users/${id}`);
  }

  return res.render("users/edit-profile", { pageTitle: "Edit Profile", user });
};

export const postEditProfile = async (req, res) => {
  const { username, name, email } = req.body;
  const { _id } = req.session.user;
  const pageTitle = "Edit Profile";
  const file = req.file;
  const user = await User.findById(_id);
  // id를 수정했다면 수정한 id가 DB에 존재하는지 확인
  if (user.username !== username) {
    const checkUsername = await User.exists({ username });
    if (checkUsername) {
      req.flash("error", "Already exists ID.");
      return res.status(400).render("users/edit-profile", {
        pageTitle,
        user,
      });
    }
  }
  // email을 수정했다면 수정한 email과 중복되는 email이 DB에 존재하는지 확인
  if (user.email !== email) {
    const checkEmail = await User.exists({ email });
    if (checkEmail) {
      req.flash("error", "Already exists Email.");
      return res.status(400).render("users/edit-profile", {
        pageTitle,
        user,
      });
    }
  }
  const isHeroku = process.env.NODE_ENV === "production";

  await User.findByIdAndUpdate(_id, {
    username: username.trim(),
    name: name.trim(),
    email: email.trim(),
    avatarUrl: file
      ? isHeroku
        ? file.location
        : file.path
      : req.session.user.avatarUrl,
  });
  const updatedUser = await User.findById(_id);
  req.session.user = updatedUser;
  return res.redirect(`/users/${_id}`);
};

export const getEditPassword = (req, res) => {
  return res.render("users/edit-password", { pageTitle: "Changed Password" });
};

export const postEditPassword = async (req, res) => {
  const pageTitle = "Changed Password";
  const { nowPassword, newPassword, newPassword2 } = req.body;
  const { _id } = req.session.user;
  const user = await User.findById(_id);
  const checkPassword = await bcrypt.compare(nowPassword, user.password);
  // 현재 비밀번호가 내 계정 비밀번호와 맞는지 확인
  if (!checkPassword) {
    req.flash("error", "The password is not correct.");
    return res.status(400).render("users/edit-password", {
      pageTitle,
    });
  }
  if (newPassword !== newPassword2) {
    req.flash("error", "Please check out the new password.");
    return res.status(400).render("users/edit-password", {
      pageTitle,
    });
  }
  user.password = newPassword;
  user.save();
  return res.redirect("/login");
};
