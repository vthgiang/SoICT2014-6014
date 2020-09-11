const { createLogger, format, transports } = require('winston');
const { connect } = require(`${SERVER_HELPERS_DIR}/dbHelper`);
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
            new transports.File({ filename: `./logs/_multi-tenant/history/${company}/error.log`, level: 'error' }),
            new transports.File({ filename: `./logs/_multi-tenant/history/${company}/info.log`, level: 'info' }),
            new transports.File({ filename: `./logs/_multi-tenant/history/${company}/debug.log`, level: 'debug' }),
            new transports.File({ filename: `./logs/_multi-tenant/history/${company}/combined.log` })
        ]
    };

    return createLogger(option);
}

module.exports = {
    info: async(user, content, portal) => {
        try {
            const com = await Company(connect(DB_CONNECTION, process.env.DB_NAME))
            .findOne({shortName: portal});
            if(com === null){
                const log = Log(process.env.DB_NAME, content);
                log.info(user)
            }else{
                const log = Log(portal, content);
                com.log && log.info(user)
            }
        } catch (error) {
            console.log(error);
        }
    },

    error: async(user, content, portal) => {
        try {
            const com = await Company(connect(DB_CONNECTION, process.env.DB_NAME))
            .findOne({shortName: portal});
            if(com === null){
                const log = Log(process.env.DB_NAME, content);
                log.error(user)
            }else{
                const log = Log(portal, content);
                com.log && log.error(user)
            }
        } catch (error) {
            console.log(error);
        }
    },
}