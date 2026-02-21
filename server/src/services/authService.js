const { createUser, getUserByEmailWithPassword } = require('./userService');

async function register({ name, email, password }) {
  const user = await createUser({ name, email, password });
  return user;
}

async function login({ email, password }) {
  const user = await getUserByEmailWithPassword(email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  return user;
}

module.exports = {
  register,
  login,
};
