const logger = require('../logger/logger');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error stack trace for detailed info
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}\nStack Trace: ${err.stack}`);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    errorDetails: err.stack // Return stack trace in response (optional, not recommended for production)
  });
};

module.exports = errorHandler;
