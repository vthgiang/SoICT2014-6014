const mongoose = require("mongoose");
const { initModels, connect, autoRun, backup } = require("./helpers/dbHelper");
const models = require("./models");
const { Configuration } = models;
const CronJob = require("cron").CronJob;
const admin = require("firebase-admin");
const serviceAccount = require("./dx-workplace-firebase-adminsdk-wxsr2-726a4a58e4.json");

module.exports = async (server) => {
  global.FIREBASE_ADMIN = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dx-workplace.firebaseio.com",
  });

  // Socket.io realtime
  global.CONNECTED_CLIENTS = [];

  let path = require("path");
  global.SERVER_DIR = __dirname;
  global.SERVER_BACKUP_DIR = path.resolve(__dirname, "..", "backup");
  global.SERVER_MODELS_DIR = SERVER_DIR + "/models";
  global.SERVER_UPLOAD_DIR = path.resolve(__dirname, "..", "upload");
  global.SERVER_MODULES_DIR = SERVER_DIR + "/modules";
  global.SERVER_HELPERS_DIR = SERVER_DIR + "/helpers";
  global.SERVER_MIDDLEWARE_DIR = SERVER_DIR + "/middleware";
  global.SERVER_SEED_DIR = SERVER_DIR + "/seed";
  global.SERVER_LOGS_DIR = SERVER_DIR + "/logs";

  let connectOptions =
    process.env.DB_AUTHENTICATION === "true"
      ? {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
          user: process.env.DB_USERNAME,
          pass: process.env.DB_PASSWORD,
          auth: {
            authSource: "admin",
          },
        }
      : {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false,
        };

  global.DB_CONNECTION = mongoose.createConnection(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT || "27017"}/${
      process.env.DB_NAME
    }`,
    connectOptions
  );
  initModels(DB_CONNECTION, models);

};
