const path = require('path');

const SERVER_DIR = __dirname;
const SERVER_BACKUP_DIR = path.resolve(SERVER_DIR, '..', 'backup');

module.exports = {
    SERVER_BACKUP_DIR,
}
