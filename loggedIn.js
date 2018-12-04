module.exports = function (type) {
  return function (req, res, next) {
    if (req.user && req.user.type === type) {
      next();
    } else {
      req.session.returnTo = req.originalUrl;
      res.redirect('/login');
    }
  };
};