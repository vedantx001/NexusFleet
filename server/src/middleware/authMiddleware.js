const User = require('../models/User');
const { sendError } = require('../utils/response');
const { verifyAccessToken } = require('../utils/token');

function extractToken(req) {
  const authHeader = req.headers?.authorization;
  if (authHeader && typeof authHeader === 'string') {
    const [scheme, value] = authHeader.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && value) return value;
  }

  const cookieToken = req.cookies?.token;
  if (cookieToken && typeof cookieToken === 'string') return cookieToken;

  return null;
}

async function requireAuth(req, res, next) {
  try {
    const token = extractToken(req);
    if (!token) {
      return sendError(res, { statusCode: 401, message: 'Unauthorized' });
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (e) {
      return sendError(res, { statusCode: 401, message: 'Invalid or expired token' });
    }

    const userId = payload?.sub;
    if (!userId) {
      return sendError(res, { statusCode: 401, message: 'Invalid token payload' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return sendError(res, { statusCode: 401, message: 'User not found' });
    }

    req.userId = String(user._id);
    req.user = typeof user.toObject === 'function' ? user.toObject() : user;
    next();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  requireAuth,
};
