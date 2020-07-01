const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const User = require("../../models/user.model");

module.exports.postLogin = async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var user = await User.findOne({ email: email }).exec()
  if (!user) {
    res.send("User does not exist")
    return
  }
  if (bcrypt.compareSync(password, user.password) === false) {
    res.send("Wrong password !");
    return;
  }
  res.redirect("/api/transaction");
};
