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
      ref: 'Transport3Schedule'
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Transport3Order'
    },
    type: {
      // 1: Lỗi xe, 2: Lỗi tuyến đường, 3: Lỗi hàng hóa 4: Lỗi khác
      type: Number
    },
    status: {
      // 1: Chưa xử lý, 2: Đang xử lý, 3: Đã xử lý
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
