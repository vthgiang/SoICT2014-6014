const { Configuration } = require('../models');
const { connect } = require('./dbHelper');
const { getDbConnection } = require('../database');

const BACKUP = {};

(async () => {
    let backupMongo = await Configuration(connect(getDbConnection()(), process.env.DB_NAME)).find();

    module.exports = {
        BACKUP,
        backupMongo
    };
})();
