const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} |${label}| ${level} ${message}`;
});
const Log = async (filename="guest", title) => {
    var option = {
        level: 'error',
        format: combine(
            label({label: title}),
            timestamp(),
            myFormat
        ),
        transports: [
            new transports.File({ filename: `./logs/history/${filename}/error.log`, level: 'error' }),
            new transports.File({ filename: `./logs/history/${filename}/info.log`, level: 'info' }),
            new transports.File({ filename: `./logs/history/${filename}/debug.log`, level: 'debug' }),
            new transports.File({ filename: `./logs/history/${filename}/combined.log` })
        ]
    };

    return await createLogger(option);
}

module.exports = {
    Log
};