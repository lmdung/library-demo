const shortid = require('shortid');
const Session = require('../models/session.model')

module.exports = async (req, res, next) => {
  if (!req.signedCookies.sessionId) {
    var sessionId = shortid.generate();
    res.cookie("sessionId", sessionId, { signed: true });
    Session.create({ sessionId: sessionId }, function(err, small) {
      if (err) console.log(err);
    });
  } else {
    var cartInfor = await Session.find({sessionId: req.signedCookies.sessionId});
    console.log(cartInfor)
    var countCart = cartInfor[0].cart.length
    res.locals.countCart = countCart
  }
  next()
}