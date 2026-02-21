const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const { sendSuccess } = require('../../utils/response');
const { signAccessToken, setAuthCookie, clearAuthCookie } = require('../../utils/token');

function toPublicUser(userDoc) {
  if (!userDoc) return null;
  const user = typeof userDoc.toObject === 'function' ? userDoc.toObject() : userDoc;
  if (user.password !== undefined) delete user.password;
  return user;
}

async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body || {};

    if (!name || !email || !password || !role) {
      const err = new Error('Name, email, password and role are required');
      err.statusCode = 400;
      throw err;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      const err = new Error('Email is already in use');
      err.statusCode = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      name,
      email,
      password: passwordHash,
      role,
    });

    const token = signAccessToken(user._id);
    setAuthCookie(res, token);

    return sendSuccess(res, {
      message: 'Registration successful',
      statusCode: 201,
      data: {
        user: toPublicUser(user),
        token,
      },
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

    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const isValid = await bcrypt.compare(String(password), String(user.password));
    if (!isValid) {
      const err = new Error('Invalid email or password');
      err.statusCode = 401;
      throw err;
    }

    const token = signAccessToken(user._id);
    setAuthCookie(res, token);

    return sendSuccess(res, {
      message: 'Login successful',
      data: {
        user: toPublicUser(user),
        token,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function logout(req, res) {
  clearAuthCookie(res);
  return sendSuccess(res, { message: 'Logout successful' });
}

async function me(req, res) {
  return sendSuccess(res, {
    message: 'Current user',
    data: { user: req.user || null },
  });
}

module.exports = {
  register,
  login,
  logout,
  me,
};
