const path = require('path');

const SERVER_DIR = __dirname;
const SERVER_BACKUP_DIR = path.resolve(SERVER_DIR, '..', 'backup');
const SERVER_MODELS_DIR = SERVER_DIR + '/models';
const SERVER_UPLOAD_DIR = path.resolve(__dirname, '..', 'upload');
const SERVER_MODULES_DIR = SERVER_DIR + '/modules';
const SERVER_HELPERS_DIR = SERVER_DIR + '/helpers';
const SERVER_MIDDLEWARE_DIR = SERVER_DIR + '/middleware';
const SERVER_SEED_DIR = SERVER_DIR + '/seed';
const SERVER_LOGS_DIR = SERVER_DIR + '/logs';

module.exports = {
    SERVER_BACKUP_DIR,
    SERVER_MODELS_DIR,
    SERVER_LOGS_DIR,
    SERVER_MODULES_DIR,
    SERVER_UPLOAD_DIR,
    SERVER_HELPERS_DIR,
    SERVER_MIDDLEWARE_DIR,
    SERVER_SEED_DIR
}
