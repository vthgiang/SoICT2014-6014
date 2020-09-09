const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const { Company } = require(`${SERVER_MODELS_DIR}/_multi-tenant`);

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} |${label}| ${level} ${message}`;
});

const Log = (company, content) => {
    var option = {
        level: 'error',
        format: combine(
            label({ label: content}),
            timestamp(),
            myFormat
        ),
        transports: [
            new transports.File({ filename: `./logs/_multi-tenant/${company}/error.log`, level: 'error' }),
            new transports.File({ filename: `./logs/_multi-tenant/${company}/info.log`, level: 'info' }),
            new transports.File({ filename: `./logs/_multi-tenant/${company}/debug.log`, level: 'debug' }),
            new transports.File({ filename: `./logs/_multi-tenant/${company}/combined.log` })
        ]
    };

    return createLogger(option);
}

const setLog = (type, log, data) => {
    if(type === 'info') log.info(data);
    else log.error(data);
}

module.exports = async(type, user, content, portal) => {
    try {
        const com = await Company(DB_CONNECTION[process.env.DB_NAME]).findOne({shortName: portal});
        if(com === null){
            const log = Log(process.env.DB_NAME, content);
            setLog(type, log, user);
        }else{
            const log = Log(portal, content);
            com.log && setLog(type, log, user);
        }
    } catch (error) {
        console.log(error);
    }
}