const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Define Transport3Issue Schema
const Transport3IssueSchema = new Schema(
  {
    code: {
      type: String
    },
    schedule: {
      type: Schema.Types.ObjectId,
      ref: 'Transport3Issue'
    },
    type: {
      //
      type: Number
    },
    status: {
      //
      type: Number
    },
    reason: {
      type: String
    },
    description: {
      type: String
    },
    receiver_solve: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
  },
  {
    timestamps: true,
  })
;

Transport3IssueSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.Transport3Issue)
    return db.model('Transport3Issue', Transport3IssueSchema);
  return db.models.Transport3Issue;
};
