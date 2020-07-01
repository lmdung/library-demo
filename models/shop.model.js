const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  userId: String,
  name: String,
  books: [mongoose.Schema.Types.Mixed]
});

var Shop = mongoose.model('Shop', shopSchema, 'shops');

module.exports = Shop;