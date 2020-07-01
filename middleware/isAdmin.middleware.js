module.exports.isAdmin = (req, res, next) => {
  if (res.locals.isAdmin === false) {
    res.redirect('/')
    return
  }
  next()
}