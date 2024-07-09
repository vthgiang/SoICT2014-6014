const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const LoggingRecordSchema = new Schema({
  type: String,

  status: String,

  target: String,

  payload: Object,

  timestamp: Date,
});

module.exports = (db) => {
  if (!db.models.LoggingRecord)
      return db.model('LoggingRecord', LoggingRecordSchema);
  return db.models.LoggingRecord;
}
