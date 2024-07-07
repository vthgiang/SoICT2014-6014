const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Define Draft Schedule Schema
const Transport3DraftScheduleSchema = new Schema(
  {
    code: {
      type: String
    },
    orders: [{
      order: {
        type: Schema.Types.ObjectId,
        ref: 'Transport3Order'
      },
      code: {
        type: String
      },
      // thời gian dự kiến đến
      estimateTimeArrive: {
        type: String
      },
      // thời gian dự kiến phục vụ
      estimateTimeService: {
        type: String
      },
      // khoảng cách từ depot đến địa chỉ giao hàng (tổng từ depot -> 1 + từ 1 -> 2)
      // phục vụ cho việc dự đoán khả năng giao hàng đúng hạn
      distance: {
        type: Number
      }
    }],
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Transport3Vehicle'
    },
    depot: {
      type: Schema.Types.ObjectId,
      ref: 'Stock'
    },
    value: {
      type: Number
    },
    note: {
      type: String
    }
  },
  {
    timestamps: true,
  })
;

Transport3DraftScheduleSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.Transport3DraftSchedule)
    return db.model('Transport3DraftSchedule', Transport3DraftScheduleSchema);
  return db.models.Transport3DraftSchedule;
};
