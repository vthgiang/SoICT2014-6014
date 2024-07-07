const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Define Schedule Schema
const Transport3ScheduleSchema = new Schema(
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
      // 1. Chưa giao hàng 2. Đang giao hàng 3. Đã giao hàng 4. Thất bại
      status: {
        type: Number
      },
      // thời gian dự kiến đến
      estimateTimeArrive: {
        type: String
      },
      // thời gian đến
      timeArrive: {
        type: String
      },
      // thời gian dự kiến phục vụ
      estimateTimeService: {
        type: String
      },
      // thời gian phục vụ
      timeService: {
        type: String
      },
      // thời gian bắt đầu vận chuyển đơn hàng này
      beginTime: {
        type: String
      },
      // thời gian dự kiến đến động
      dynamicEstimatedTime: {
        type: String
      },
      // khoảng cách từ depot đến địa chỉ giao hàng (tổng từ depot -> 1 + từ 1 -> 2)
      // phục vụ cho việc dự đoán khả năng giao hàng đúng hạn
      distance: {
        type: Number
      },
      //d
      estimatedOntime: {
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
    employees: [{
      type: Schema.Types.ObjectId,
      ref: 'Employee'
    }],
    // 1. Chưa thực hiện; 2 Đang thực hiện; 3. Đã hoàn thành
    status: {
      type: Number
    },
    beginTime: {
      type: String
    },
    endTime: {
      type: String
    },
    note: {
      type: String
    },
    isAutoSchedule: {
      type: Boolean
    },
    draftSchedule: {
      type: Schema.Types.ObjectId,
      ref: 'Transport3Schedule'
    }
  },
  {
    timestamps: true,
  })
;

Transport3ScheduleSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.Transport3Schedule)
    return db.model('Transport3Schedule', Transport3ScheduleSchema);
  return db.models.Transport3Schedule;
};
