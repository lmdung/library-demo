const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: String,
  bookId: String,
  isComplete: Boolean,
  quantity: Number
});

var Transaction = mongoose.model('Transaction', transactionSchema, 'transactions');
module.exports = Transaction;