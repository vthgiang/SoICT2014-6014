const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const authLogger = createLogger({
    level: 'error',
    format: combine(
      label({ label: 'Authenticate' }),
      timestamp(),
      myFormat
    ),
    transports: [
    new transports.File({ filename: './logs/error.log', level: 'error' }),
    new transports.File({ filename: './logs/info.log', level: 'info' }),
    new transports.File({ filename: './logs/debug.log', level: 'debug' }),
    new transports.File({ filename: './logs/combined.log' })
    ]
});

const adminLogger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'Admin-Management' }),
    timestamp(),
    myFormat
  ),
  transports: [
  new transports.File({ filename: './logs/error.log', level: 'error' }),
  new transports.File({ filename: './logs/info.log', level: 'info' }),
  new transports.File({ filename: './logs/debug.log', level: 'debug' }),
  new transports.File({ filename: './logs/combined.log' })
  ]
});

module.exports = {
    authLogger,
    adminLogger
};