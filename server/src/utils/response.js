function sendSuccess(res, { message = 'OK', data, statusCode = 200 } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  });
}

function sendError(res, { message = 'Something went wrong', data, statusCode = 400 } = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(data !== undefined ? { data } : {}),
  });
}

module.exports = {
  sendSuccess,
  sendError,
};
