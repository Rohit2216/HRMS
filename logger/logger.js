const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

// ✅ Corrected log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// ✅ Logger configuration
const logger = createLogger({
  format: combine(
    colorize(), // Adds color to log levels
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Custom timestamp
    logFormat // Custom log format
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'logs/error.log', level: 'error' }) // Log errors to file
  ],
});

// ✅ Export logger
module.exports = logger;
