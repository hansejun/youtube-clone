import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => {
  return res.render("users/join", { pageTitle: "Join Page" });
};

export const postJoin = async (xwreq, res) => {
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
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const startGitLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GIT_CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGitLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GIT_CLIENT_ID,
    client_secret: process.env.GIT_CLIENT_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
  console.log(tokenRequest);

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log("emaildata", emailData);
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      try {
        user = await User.create({
          username: userData.login,
          name: userData.login,
          password: "",
          socialOnly: true,
          email: emailObj.email,
          avatarUrl: userData.avatar_Url,
        });
      } catch (e) {
        console.log("계정 생성 에러", e);
        return res.status(400).redirect("/");
      }
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.status(400).redirect("/");
  }
};
export const profile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(400).redirect("/");
  }
  return res.render("users/profile", { pageTitle: user.username, user });
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
  const updatedUser = await User.findByIdAndUpdate(_id, {
    username,
    name,
    email,
  });
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
