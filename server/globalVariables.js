global.SERVER_DIR = __dirname;
global.SERVER_BACKUP_DIR = __dirname + "/../backup";
global.SERVER_BAKUP_TIME = '0 0 2 15 * *';

global.AUTO_BACKUP_DATABASE = require("./helpers/backupHelper").backupAutomatic;