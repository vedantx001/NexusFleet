const { sendError } = require('../utils/response');

const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    let message = err.message || 'Server error';

    // Check for Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }

    const data =
        process.env.NODE_ENV === 'production'
            ? undefined
            : {
                  stack: err.stack,
              };

    return sendError(res, {
        statusCode,
        message,
        ...(data ? { data } : {}),
    });
};

module.exports = { notFound, errorHandler };
