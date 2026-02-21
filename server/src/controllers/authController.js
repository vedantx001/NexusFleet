const { sendSuccess } = require('../utils/response');
const { signAccessToken, setAuthCookie, clearAuthCookie } = require('../utils/token');
const authService = require('../services/authService');
const userService = require('../services/userService');

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      const err = new Error('Name, email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const user = await authService.register({ name, email, password });
    const token = signAccessToken(user._id);
    setAuthCookie(res, token);

    return sendSuccess(res, {
      message: 'Registration successful',
      data: { user: user.toPublicJSON() },
      statusCode: 201,
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      const err = new Error('Email and password are required');
      err.statusCode = 400;
      throw err;
    }

    const user = await authService.login({ email, password });
    const token = signAccessToken(user._id);
    setAuthCookie(res, token);

    return sendSuccess(res, {
      message: 'Login successful',
      data: { user: user.toPublicJSON() },
    });
  } catch (e) {
    next(e);
  }
}

async function logout(req, res) {
  clearAuthCookie(res);
  return sendSuccess(res, { message: 'Logout successful' });
}

async function me(req, res, next) {
  try {
    if (!req.userId || req.userId === 'dev') {
      return sendSuccess(res, {
        message: 'Current user',
        data: {
          user: {
            id: 'dev',
            name: 'Dev User',
            email: 'dev@nexusfleet.local',
          },
        },
      });
    }

    const user = await userService.getUserById(req.userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    return sendSuccess(res, {
      message: 'Current user',
      data: { user: user.toPublicJSON() },
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  register,
  login,
  logout,
  me,
};
