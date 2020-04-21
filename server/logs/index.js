const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const Company = require('../models/system-admin/company.model');

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} |${label}| ${level} ${message}`;
});

const Log = async (filename, title) => {
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

const LogInfo = async(user, content, company=undefined) => {
    try {
        if(company === undefined){
            //Không có id công ty để check trong databse
            const Logger = await Log('system', content); //Khởi tạo lưu vào thư mục guest
            await Logger.info(user);
        }else{
            //Có id của công ty
            const com = await Company.findById(company._id); //lấy thông tin về công ty trong hệ thống
            if(com === null){
                //Không có dữ liệu về công ty này
                const Logger = await Log('system', content); //ghi log vào thư mục system - systemadmin
                await Logger.info(user);
            }else{
                //Có dữ liệu về công ty
                const Logger = await Log(`${company.short_name}-${company._id}`, content);
                com.log && await Logger.info(user);
            }
        }
    } catch (error) {
        console.log(error)
    }
    
}

const LogError = async(user, content, company=undefined) => {
    try {
        if(company === undefined){
            //Không có id công ty để check trong databse
            const Logger = await Log('system', content); //Khởi tạo lưu vào thư mục guest
            await Logger.error(user);
        }else{
            //Có id của công ty
            const com = await Company.findById(company._id); //lấy thông tin về công ty trong hệ thống
            if(com === null){
                //Không có dữ liệu về công ty này
                const Logger = await Log('system', content); //ghi log vào thư mục log chung
                await Logger.error(user);
            }else{
                //Có dữ liệu về công ty
                const Logger = await Log(`${company.short_name}-${company._id}`, content);
                com.log && await Logger.error(user);
            }
        }
    } catch (error) {
        console.log(error)
    }
    
}

module.exports = {
    Log,
    LogInfo,
    LogError
};