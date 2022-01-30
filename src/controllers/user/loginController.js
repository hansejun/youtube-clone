import User from "../../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

let info = false;

export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "Login Page" });
};

export const postLogin = async (req, res) => {
  const pageTitle = "Login Page";
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  // 계정이 존재하는지 확인
  if (!user) {
    req.flash("error","Check your ID.")
    return res
      .status(400)
      .render("users/login", { pageTitle,});
  }
  // 비밀번호 확인 맞으면 true 아니면 false 반환
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    req.flash("error","Check your Password.")
    return res.status(400).render("users/login", {
      pageTitle,
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

// Github Login

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

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      req.flash("error","Failed to bring email information.")
      return res.redirect("/");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (user) {
      if (user.social !== "GITHUB") {
        req.flash("error","This account already exists.")
        return res.status(400).redirect("/");
      }
    } else {
      try {
        user = await User.create({
          username: `GITHUB_${emailObj.email.split("@")[0]}`,
          name: userData.login,
          password: "",
          socialOnly: true,
          social: "GITHUB",
          email: emailObj.email,
        });
        info = "Membership registration was successful.";
      } catch (e) {
        req.flash("error","Failed to create an account.")
        console.log(e);
        return res.status(400).redirect("/");
      }
    }
    if(info){
      req.flash("info",info);
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    req.flash("error","Login failed.")
    return res.status(400).redirect("/");
  }
};

export const startKakaoLogin = (req, res) => {
  const baseUrl = "/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_CLIENT_ID,
    redirect_uri: process.env.KAKAO_REDIRECT_URI,
    response_type: "code",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `https://kauth.kakao.com${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT_ID,
    client_secret: process.env.KAKAO_CLIENT_SECRET,
    redirect_uri: process.env.KAKAO_REDIRECT_URI,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://kapi.kakao.com/v2/user/me";
    const userData = await (
      await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    if (!userData) {
      req.flash("error","Failed to bring user information.")
      return res.status(400).redirect("/login");
    }
    let user = await User.findOne({ email: userData.kakao_account.email });
    if (user) {
      if (user.social !== "KAKAO") {
        req.flash("error","This account already exists.")
        return res.status(400).redirect("/");
      }
    } else {
      try {
        user = await User.create({
          username: `KAKAO_${userData.kakao_account.email.split("@")[0]}`,
          password: "",
          email: userData.kakao_account.email,
          name: userData.properties.nickname,
          socialOnly: true,
          social: "KAKAO",
        });
        info = "Membership registration was successful.";
      } catch (e) {
        req.flash("error","Failed to create an account.")
        console.log(e);
        return res.status(400).redirect("/login");
      }
    }
    if(info){
      req.flash("info",info);
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    req.flash("error","Login failed.")
    return res.status(400).redirect("/login");
  }
};

export const startNaverLogin = (req, res) => {
  const baseUrl = "https://nid.naver.com/oauth2.0/authorize";
  const config = {
    response_type: "code",
    client_id: process.env.NAVER_CLIENT_ID,
    redirect_uri: process.env.NAVER_REDIRECT_URI,
    state: "200",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishNaverLogin = async (req, res) => {
  const baseUrl = "https://nid.naver.com/oauth2.0/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.NAVER_CLIENT_ID,
    client_secret: process.env.NAVER_CLIENT_SECRET,
    redirect_uri: process.env.NAVER_REDIRECT_URI,
    code: req.query.code,
    state: req.query.state,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/json;charset=utf-8",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://openapi.naver.com/v1/nid/me";
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();
    let user = await User.findOne({ email: userData.response.email });
    if (user) {
      if (user.social !== "NAVER") {
        req.flash("error","This account already exists.")
        return res.status(400).redirect("/");
      }
    } else {
      try {
        user = await User.create({
          username: `NAVER_${userData.response.email.split("@")[0]}`,
          password: "",
          email: userData.response.email,
          name: userData.response.name,
          socialOnly: true,
          social: "NAVER",
        });
        info = "Membership registration was successful.";
      } catch (e) {
        console.log(e);
        req.flash("error","Failed to create an account.")
        return res.status(400).redirect("/");
      }
    }
    if(info){
      req.flash("info",info);
    }
    req.session.user = user;
    req.session.loggedIn = true;
    return res.redirect("/");
  } else {
    req.flash("error","Login failed.")
    return res.status(400).redirect("/");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
