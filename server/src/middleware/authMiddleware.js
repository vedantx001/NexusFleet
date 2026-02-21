const { verifyAccessToken } = require('../utils/token');

function requireAuth(req, res, next) {
  try {
    const cookieToken = req.cookies?.token;

    const header = req.headers.authorization || '';
    const bearerToken = header.startsWith('Bearer ') ? header.slice(7) : null;

    const token = cookieToken || bearerToken;
    if (!token) {
      const err = new Error('Not authenticated');
      err.statusCode = 401;
      throw err;
    }

    const payload = verifyAccessToken(token);
    req.userId = payload.sub;

    next();
  } catch (e) {
    e.statusCode = e.statusCode || 401;
    next(e);
  }
}

module.exports = {
  requireAuth,
};
