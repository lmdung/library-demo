const Shop = require('../models/shop.model')
const User = require("../models/user.model");
const cloudinary = require("cloudinary");
const BookShop = require("../models/bookShop.model")

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports.index =  async (req, res) => {
  if (!req.signedCookies.userId) {
    res.render("shop/shop", {
      login: false
    });
    return;
  }
  var user = await User.findById(req.signedCookies.userId);
  var shop = await Shop.find({userId: user.id})
  if (shop.length > 0) {
    var books = await BookShop.find({shopId: shop[0].id})
  }
  res.render('shop/shop', {
    shop: shop[0],
    books: books,
    login: true
  })
};
module.exports.create = (req, res) => {
  var user = res.locals.userLogin;
  res.render('shop/create', {
    user: user
  })
};
module.exports.addBook = (req, res) => {
  var shopId = req.params.id;
  res.render('addBook', {
    shopId: shopId
  })
}
module.exports.getShop = async (req, res) => {
  var shopId = req.params.id;
  var shop = await Shop.find({_id: shopId})
  var books = await BookShop.find({shopId: shop[0].id})
  res.render('shop/shopPublic', {
    shop: shop[0],
    books: books
  })
}

module.exports.postCreate = (req, res) => {
  req.body.userId = req.params.id;
  Shop.create(req.body, function(err, shop) {
    if (err)  console.log(err)
  });
  res.redirect('/shop')
}
module.exports.postAddBook = (req, res) => {
  let bookPath = req.files.bookCover.path;
  req.body.shopId = req.params.id
  cloudinary.uploader.upload(bookPath, function(result, error) {
    if (result) {
      req.body.bookCoverUrl = result.url;
    }
    console.log(req.body)
    BookShop.create(req.body, function(err, small) {
      if (err)  console.log(err);
    });
    res.redirect('/shop')
  })
}