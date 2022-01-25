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
    return res.status(400).redirect("/");
  }
  const avatarOk = user.avatarUrl.startsWith("h");
  return res.render("users/profile", {
    pageTitle: user.username,
    user,
    avatarOk,
  });
};

export const getEditProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
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
      return res.status(400).render("users/edit-profile", {
        pageTitle,
        errorMessage: "Already exists ID",
        user,
      });
    }
  }
  // email을 수정했다면 수정한 email과 중복되는 email이 DB에 존재하는지 확인
  if (user.email !== email) {
    const checkEmail = await User.exists({ email });
    if (checkEmail) {
      return res.status(400).render("users/edit-profile", {
        pageTitle,
        errorMessage: "Already exists Email",
        user,
      });
    }
  }

  await User.findByIdAndUpdate(_id, {
    username,
    name,
    email,
    avatarUrl: file ? file.path : req.session.user.avatarUrl,
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
    return res.status(400).render("users/edit-password", {
      pageTitle,
      errorMessage: "The password is not correct.",
    });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).render("users/edit-password", {
      pageTitle,
      errorMessage: "Please check out the new password.",
    });
  }
  user.password = newPassword;
  user.save();
  return res.redirect("/login");
};
