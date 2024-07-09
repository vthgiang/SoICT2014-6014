const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

// Bảng lộ trình di chuyển của các chuyến xe giao hàng
const JourneySchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        code : {
            type: String
        },
        data: {
            type: Schema.Types.Mixed
        },
        orders: [{
            order: {
                type: Schema.Types.ObjectId,
                ref: "ProductRequestManagement"
            },
            weight: {
                type: Number
            },
            volume: {
                type: Number
            },
            orderValue: {
                type: Number
            },
            // 1. Đã giao hàng xong. 2 Chưa giao hàng 3. Thất bại
            status: {
                type: Number
            },
            estimateTimeService: {
                type: Date
            },
            timeService: {
                type: Date
            },
            customerName: {
                type: String
            },
            destinationPlace: {
                type: String
            }
        }],
        depotsTravel: {
            type: Schema.Types.Mixed
        },
        shippers: [{
            type: Schema.Types.ObjectId,
            ref: "Employee",
        }],
        // 1. Chưa thực hiện; 2 Đang thực hiện; 3. Đã hoàn thành toàn bộ
        status: {
            type: Number
        },
        estimatedDeliveryDate: {
            type: Date
        },
        totalOrder: {
            type: Number
        },
        perfectDeliveryOrders: {
            type: Number
        },
        vehicleName: {
            type: String
        }
    },
    {
        timestamps: true,
    }
);

JourneySchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Journey) return db.model("Journey", JourneySchema);
    return db.models.Journey;
};