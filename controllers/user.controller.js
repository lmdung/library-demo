const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary");
const saltRounds = 10;
const User = require("../models/user.model");

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.index = async (req, res) => {
  var users = await User.find();
  var page = parseInt(req.query.page) || 1;
  var perPage = 3;
  var start = (page - 1) * perPage;
  var end = page * perPage;
  var maxPage = Math.floor(users.length / perPage) + 1;
  if (users.length % perPage === 0) {
    maxPage = users.length / perPage;
  }
  res.render("users/users", {
    users: users.slice(start, end),
    start: start,
    page: page,
    maxPage: maxPage
  });
};

module.exports.create = (req, res) => {
  res.render("users/addUser");
};
module.exports.delete = (req, res) => {
  var id = req.params.id;
  User.deleteOne({ _id: id }, function(err) {
    if (err) console.log(err);
  });
  res.redirect("back");
};

module.exports.update = async (req, res) => {
  var id = req.params.id;
  var user = await User.findById(id);
  res.render("users/updateUser", {
    user: user
  });
};

module.exports.updateAvatar = async (req, res) => {
  var id = req.params.id;
  var user = await User.findById(id);
  res.render("users/updateAvatar", {
    user: user
  });
};

module.exports.postCreate = (req, res) => {
  let fileName = req.files.avatar.path;
  cloudinary.uploader.upload(fileName, function(result, error) {
    if (result) {
      req.body.avatar = result.url;
    }
    if (req.body.isAdmin) {
      req.body.isAdmin = true;
    } else {
      req.body.isAdmin = false;
    }
    req.body.wrongLoginCount = 0;
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    User.create(req.body, function(err, small) {
      if (err) console.log(err);
      // saved!
    });
    res.redirect("/users");
    console.log(req.body);
  });
};

module.exports.postUpdate = (req, res) => {
  var id = req.params.id
  User.findById(id, function (err, doc) {
    if (err) {console.log(err)}
    doc.name = req.body.name;
    doc.phone = req.body.phone;
    doc.email = req.body.email;
    doc.save();
  });
  res.redirect("/users");
};
module.exports.postUpdateAvatar = (req, res) => {
  let avatarUrl = req.files.avatar.path;
  cloudinary.uploader.upload(avatarUrl, function(result, error) {
    if (result) {
      var id = req.params.id
      User.findOneAndUpdate({ _id: id }, { avatar: result.url }, {upsert: true}, function(err, doc) {
        if (err) console.log(err)
      });
    }
    res.redirect("/users/update/" + req.params.id);
  });
};
