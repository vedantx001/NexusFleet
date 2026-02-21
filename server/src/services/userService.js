const User = require('../models/User');

async function getUserById(userId) {
  const user = await User.findById(userId);
  return user;
}

async function getUserByEmailWithPassword(email) {
  return User.findOne({ email }).select('+password');
}

async function createUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email is already in use');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ name, email, password });
  return user;
}

module.exports = {
  getUserById,
  getUserByEmailWithPassword,
  createUser,
};
