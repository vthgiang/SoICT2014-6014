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
      // 1. Chưa giao hàng 2. Đang giao hàng 3. Đã giao hàng 4. Thất bại
      status: {
        type: Number
      },
      // thời gian dự kiến đến
      estimateTimeArrive: {
        type: Date
      },
      // thời gian đến
      timeArrive: {
        type: Date
      },
      // thời gian dự kiến phục vụ
      estimateTimeService: {
        type: Date
      },
      // thời gian phục vụ
      timeService: {
        type: Date
      },
      // thời gian bắt đầu vận chuyển đơn hàng này
      beginTime: {
        type: Date
      },
      // thời gian dự kiến đến động
      dynamicEstimatedTime: {
        type: Date
      },
      // khoảng cách từ depot đến địa chỉ giao hàng
      // phục vụ cho việc dự đoán khả năng giao hàng đúng hạn
      distance: {
        type: Number
      }, 
      //Dự báo khả năng giao hàng đúng hạn
      estimatedOntime: {
        type: Number
      }
    }],
    vehicles: {
      type: Schema.Types.ObjectId,
      ref: 'Transport3Vehicle'
    },
    depot: {
      type: Schema.Types.ObjectId,
      ref: 'Stock'
    },
    employee: [{
      type: Schema.Types.ObjectId,
      ref: 'Transport3Employee'
    }],
    // 1. Chưa thực hiện; 2 Đang thực hiện; 3. Đã hoàn thành
    status: {
      type: Number
    },
    beginTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
    note: {
      type: String
    }
  },
  {
    timestamps: true,
  })
;

Transport3ScheduleSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.Transport3Schedule)
    return db.model('Transport3OSchedule', Transport3ScheduleSchema);
  return db.models.Transport3Schedule;
};
