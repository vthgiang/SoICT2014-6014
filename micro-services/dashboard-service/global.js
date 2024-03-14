const { backup } = require('./helpers/dbHelper');
const CronJob = require('cron').CronJob;
const { BACKUP, backupMongo } = require('./helpers/backupHelper');

module.exports = async () => {
  for (let i = 0; i < backupMongo?.length; i++) {
    let { time } = backupMongo[i].backup;
    let timeConfig = `${time.second} ${time.minute} ${time.hour} ${time.date} ${time.month} ${time.day}`;
    BACKUP[backupMongo[i].name] = {
      auto: backupMongo[i].backup.auto,
      limit: backupMongo[i].backup.limit,
      time: backupMongo[i].backup.time,
      job: new CronJob({
        cronTime: timeConfig,
        onTick: () =>
          backup({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            db: backupMongo[i].name !== 'all' ? backupMongo[i].name : undefined,
          }),
        timezone: 'Asia/Ho_Chi_Minh',
      }),
    };
  }

  if (BACKUP && typeof BACKUP === 'object') {
    for (const [db] of Object.entries(BACKUP)) {
        if (BACKUP[db].auto) BACKUP[db].job.start();
    }
  }
};
