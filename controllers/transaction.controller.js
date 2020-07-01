const Transaction = require("../models/transaction.model");
const Book = require("../models/book.model");
const User = require("../models/user.model");

module.exports.index = async (req, res) => {
  var userLogin = res.locals.userLogin;
  var listTransaction = [];
  if (res.locals.isAdmin == false) {
    var transaction = await Transaction.find({ userId: userLogin.id });
  } else {
    var transaction = await Transaction.find();
  }
  for (const e of transaction) {
     if (e.isComplete == false) {
      var user = await User.findById(e.userId);
      var book = await Book.findById(e.bookId);
      listTransaction.push({
        user: user.name,
        userId: user.id,
        book: book.title,
        id: e.id,
        quantity: e.quantity
      });
    }
  }
  res.render("transaction/transaction", {
    listTransaction: listTransaction
  });
};

module.exports.create = async (req, res) => {
  var users = await User.find();
  var books = await Book.find();
  res.render("transaction/create.transaction.pug", {
    users: users,
    books: books
  });
};

module.exports.complete = (req, res) => {
  Transaction.findById(req.params.id, function(err, doc) {
    if (err) {
      console.log(err);
    }
    doc.isComplete = true;
    doc.save();
  });
  res.redirect("back");
};

module.exports.postCreate = (req, res) => {
  req.body.isComplete = false;
  Transaction.create(req.body, function(err, small) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/transaction");
};
