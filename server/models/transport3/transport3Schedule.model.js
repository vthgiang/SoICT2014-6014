const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

// Define Schedule Schema
const Transport3ScheduleSchema = new Schema(
  {
    code: {
      type: String
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer'
    },
    customerPhone: {
      type: String
    },
    address: {
      type: String
    },
    lat: {
      type: Number
    },
    lng: {
      type: Number
    },
    deliveryTime: {
      type: Date
    },
    note: {
      type: String
    },
    noteAddress: {
      type: String
    },
    priority: {
      type: Number
    },
    // status: 1: chờ xác nhận, 2: đã xác nhận, 3: đã giao hàng
    status: {
      type: Number
    },
    stockIn: {
      stock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
      },
      stockName: {
        type: String
      },
      stockAddress: {
        type: String
      }
    },
    stockOut: {
      stock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
      },
      stockName: {
        type: String
      },
      stockAddress: {
        type: String
      }
    },
    transportType: {
      type: Number
    },
    goods: [
      {
        good: {
          type: Schema.Types.ObjectId,
          ref: 'Good'
        },
        code: {
          type: String
        },
        goodName: {
          type: String
        },
        baseUnit: {
          type: String
        },
        quantity: {
          type: Number
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

Transport3ScheduleSchema.plugin(mongoosePaginate);

module.exports = (db) => {
  if (!db.models.Transport3Schedule)
    return db.model('Transport3OSchedule', Transport3ScheduleSchema);
  return db.models.Transport3Schedule;
};
