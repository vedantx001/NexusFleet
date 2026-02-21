const jwt = require('jsonwebtoken');

function signAccessToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }

  return jwt.sign({ sub: String(userId) }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function verifyAccessToken(token) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }

  return jwt.verify(token, secret);
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days (kept aligned with default JWT expiry)
  });
}

function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
  });
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  setAuthCookie,
  clearAuthCookie,
};
