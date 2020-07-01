const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

const User = require("../models/user.model");

module.exports.index = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var user = await User.findOne({ email: email }).exec()
  if (!user) {
    res.render("auth/login", {
      errors: ["User does not exist"],
      values: req.body
    });
    return;
  }
  if (bcrypt.compareSync(password, user.password) === false) {
    User.findById(user.id, function (err, doc) {
      if (err) {console.log(err)}
      doc.wrongLoginCount = user.wrongLoginCount + 1;
      doc.save();
    });
    if (user.wrongLoginCount >= 4) {
      var transporter = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          auth: {
            user: process.env.SESSION_USER,
            pass: process.env.SESSION_PASS
          }
        })
      );
      transporter.verify(function(error, success) {
        // Nếu có lỗi.
        if (error) {
          console.log(error);
        } else {
          //Nếu thành công.
          console.log("Kết nối thành công!");
        }
      });
      var mailOptions = {
        from: "lmdung94@gmail.com",
        to: user.email,
        subject: "Có người đang cố gắng đăng nhập vào tài khoản của bạn !",
        html: `<strong>Dear ${user.name}</strong>
      <p>Bạn hoặc người lạ nào đó đã cố gắng đăng nhập vào tài khoản của bạn !</p>  
      <p>Hãy kiểm tra lại !</p>
      <p>Xin cảm ơn !</p>`
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.render("auth/login", {
        wrongLogin: true
      });
      return;
    }
    res.render("auth/login", {
      errors: ["Wrong password !"],
      values: req.body
    });
    return;
  }
  User.findById(user.id, function (err, doc) {
      if (err) {console.log(err)}
      doc.wrongLoginCount = 0;
      doc.save();
  });
  res.cookie("userId", user.id, { signed: true });
  if (user.isAdmin === true) {
    res.redirect("/");
    return;
  }
  res.redirect("/transaction");
};
