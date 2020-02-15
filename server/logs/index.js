const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const Logger = createLogger({
    level: 'error',
    format: combine(
        label({ label: 'Log' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.File({ filename: './logs/history/error.log', level: 'error' }),
        new transports.File({ filename: './logs/history/info.log', level: 'info' }),
        new transports.File({ filename: './logs/history/debug.log', level: 'debug' }),
        new transports.File({ filename: './logs/history/combined.log' })
    ]
});

module.exports = {
    Logger
};