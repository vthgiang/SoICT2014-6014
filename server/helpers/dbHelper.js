const mongoose = require('mongoose');

exports.initConnect = (dbName) => {
    return mongoose.createConnection(
        `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || '27017'}/${dbName}`,
        process.env.DB_AUTHENTICATION === "true" ? 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
            user: process.env.DB_USERNAME,
            pass: process.env.DB_PASSWORD,
        } : {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    );
}

exports.connect = (db, portal) => {
    if(db.name !== portal){
        return db.useDb(portal, { useCache: true });
    }else{
        return db;
    }
}

exports.initModels = (db, models) => {
    /**
     * db: 1 kết nối đến cơ sở dữ liệu nào đó 
     * models: các models được khai báo trong thư mục models
     */
    for (const [key, model] of Object.entries(models)) {
        if(!db.models[key]) model(db)
    }
}