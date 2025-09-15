const { ERROR_MESSAGES, HTTP_STATUS } = require('../config/constants');

function errorHandler(err, req, res, next) {
  console.error('Global error handler:', err);

  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = ERROR_MESSAGES.SERVER_ERROR;

  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = err.message;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = ERROR_MESSAGES.API_KEY_INVALID;
  } else if (err.status) {
    statusCode = err.status;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

function notFoundHandler(req, res) {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
}

module.exports = {
  errorHandler,
  notFoundHandler
};