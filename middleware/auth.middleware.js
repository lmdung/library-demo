const User = require("../models/user.model");
module.exports.requireAuth = async (req, res, next) => {
  if (!req.signedCookies.userId) {
    res.redirect("/auth/login");
    return;
  }
  var user = await User.findById(req.signedCookies.userId);
  if (!user) {
    res.redirect("/auth/login");
    return;
  }
  if (user.isAdmin !== true) {
    res.locals.isAdmin = false;
  }
  res.locals.userLogin = user
  next()
}