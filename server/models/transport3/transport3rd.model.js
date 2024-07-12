const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Define 3rd transport schema
const Transport3rdSchema = new Schema(
  {
    code: {
      type: String
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Transport3Order'
    },
    order3rd: {
      type: String
    },
    // 1. Chưa hoàn thành, 2. Đã hoàn thành
    status: {
      type: Number
    },
  },
  {
    timestamps: true,
  })
;

Transport3rdSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.Transport3rd)
    return db.model('Transport3rd', Transport3rdSchema);
  return db.models.Transport3rd;
};
