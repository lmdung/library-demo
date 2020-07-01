const shortid = require("shortid");
const Session = require('../models/session.model');
const Book = require('../models/book.model')
const Transaction = require('../models/transaction.model')

module.exports.addToCart = async (req, res, next) => {
  let bookId = req.params.id;
  let sessionId = req.signedCookies.sessionId;
  if (!sessionId) {
    res.redirect("/books");
    return;
  }
  var session = await Session.findOne({ sessionId: sessionId }).exec();
  session.cart.push(bookId);
  session.save();
  res.redirect("/books");
};

module.exports.index = async (req, res, next) => {
  var cartInfor = await Session.find({sessionId: req.signedCookies.sessionId});
  var cartArray = cartInfor[0].cart;
  var cartObject = {};
  var bookInCart = [];
  cartArray.forEach(function(i) { cartObject[i] = (cartObject[i]||0) + 1;});
  var bookIdArray = Object.keys(cartObject);
  for (const bookId of bookIdArray) {
    var book = await Book.findById(bookId)
    book.amountRent = cartObject[bookId];
    bookInCart.push(book)
  }
  res.render("cart/cart", {
    listBookRent: bookInCart
  });
};

module.exports.rent = async (req, res, next) => {
  var cartInfor = await Session.find({sessionId: req.signedCookies.sessionId});
  var cartArray = cartInfor[0].cart;
  var user = res.locals.userLogin;
  var cartObject = {};
  cartArray.forEach(function(i) { cartObject[i] = (cartObject[i]||0) + 1;});
  var bookIdArray = Object.keys(cartObject);
  for (const bookId of bookIdArray) {
    var transaction = {
        userId: user.id,
        bookId: bookId,
        id: shortid.generate(),
        isComplete: false,
        quantity: cartObject[bookId]
      }
    Transaction.create(transaction, function(err, small) {
      if (err) {console.log(err)} ;
    });
    var sessionEnd = await Session.findOne({ sessionId: req.signedCookies.sessionId }).exec();
    console.log(sessionEnd)
    sessionEnd.cart = [];
    sessionEnd.save();
  }
  res.redirect('/transaction')
}