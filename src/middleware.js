import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  next();
};

export const onlyLoggedIn = (req, res, next) => {
  if (!req.session.loggedIn) {
    req.flash("error","Please log in.")
    return res.redirect("/");
  }
  next();
};

export const onlyLoggedOut = (req, res, next) => {
  if (req.session.loggedIn) {
    req.flash("error","Only non-members can use it.")
    return res.redirect("/");
  }
  next();
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 30000000 },
});
export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 100000000 },
});
