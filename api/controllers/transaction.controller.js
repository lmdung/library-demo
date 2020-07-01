const Transaction = require("../../models/transaction.model");
module.exports.index = async (req, res) => {
  Transaction.find()
    .then(transactions => res.json(transactions))
    .catch(err => res.status(404).json({ success: false }))
};