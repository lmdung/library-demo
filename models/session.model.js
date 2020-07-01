const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  sessionId: String,
  cart: [mongoose.Schema.Types.Mixed]
});

var Session = mongoose.model('Session', sessionSchema, 'sessions');

module.exports = Session;