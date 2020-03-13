const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const Company = require('../models/company.model');

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

const LogInfo = async(user, content, companyId=null, companyShortName="system") => {
    const directory = companyId === null ? 'system' : companyShortName;
    const Logger = await Log(directory, content);
    if(companyId !== null){
        const company = await Company.findById(companyId); //lấy thông tin của công ty
        company.log && await Logger.info(user);
    }else{
        await Logger.info(user);
    }
}

const LogError = async(user, content, companyId=null, companyShortName="system") => {
    const directory = companyId === null ? 'system' : companyShortName;
    const Logger = await Log(directory, content);
    if(companyId !== null){
        const company = await Company.findById(companyId); //lấy thông tin của công ty
        company.log && await Logger.error(user);
    }else{
        await Logger.error(user);
    }
}

module.exports = {
    Log,
    LogInfo,
    LogError
};