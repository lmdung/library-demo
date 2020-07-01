const mongoose = require("mongoose");

const bookShopSchema = new mongoose.Schema({
  shopId: String,
  title: String,
  description: String,
  bookCoverUrl: String
});

var BookShop = mongoose.model('BookShop', bookShopSchema, 'book_shop');

module.exports = BookShop;