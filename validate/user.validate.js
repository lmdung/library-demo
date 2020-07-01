module.exports.postCreate = (req, res, next) => {
  var errors = [];
  if (!req.body.name) {
    errors.push('Name is required !')
  }
  if (!req.body.phone) {
    errors.push('Phone is required !')
  }
  if (!req.body.email) {
    errors.push('Email is required !')
  }
  if (req.body.name && req.body.name.length > 30) {
    errors.push('Name less than 30 characters !')
  }
  if (errors.length) {
    res.render("users/addUser", {
      errors: errors,
      values: req.body
    })
    return
  }
  next()
}