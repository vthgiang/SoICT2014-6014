const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Bảng kế hoạch vận chuyển hàng trong 1 ngày
const DeliveryScheduleSchema = new Schema(
    {
        code: {
            type: String
        },
        carrierDate: {
            type: Date
        },
        orders: [
            { order: {
                type: Schema.Types.ObjectId,
                ref: "ProductRequestManagement"
                }                  
            }
        ],
        //1: Chưa giao
        //2: Đang giao
        //3: Đã giao
        //4: Thất bại
        status: {
            type: Number
        },
        shippers: [{
            type: Schema.Types.ObjectId,
            ref: "Employee",
        }],
        estimatedDeliveryDate: {
            type: Date
        },
        actualDeliveryDate: {
            type: Date
        },
        estimatedOntime: {
            type: Number
        }
    },
    {
        timestamps: true,
    }
);

DeliveryScheduleSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.DeliverySchedule) return db.model("DeliverySchedule", DeliveryScheduleSchema);
    return db.models.DeliverySchedule;
};