/**
 * Populates the game model into the user model.
 * Redirects to login page if not logged in.
 */
exports.requireAuthentication = (req, res, next) => {
  if (!req.user) {
    res.redirect('/user/login')
  } else {
    req.user.populate('game', next)
  }
}
