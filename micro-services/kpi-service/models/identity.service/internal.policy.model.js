const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const InternalPolicySchema = new Schema({
  name: String,

  description: String,

  effect: String,

  actions: [String],

  resources: [String],

  effectiveStartTime: Date,

  effectiveEndTime: Date
});

module.exports = (db) => {
  if (!db.models.InternalPolicy)
      return db.model('InternalPolicy', InternalPolicySchema);
  return db.models.InternalPolicy;
}
