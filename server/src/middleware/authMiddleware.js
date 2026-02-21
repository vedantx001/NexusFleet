function requireAuth(req, res, next) {
  // Auth bypass: treat all requests as authenticated.
  req.userId = req.userId || 'dev';
  next();
}

module.exports = {
  requireAuth,
};
