const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BillSchema = new Schema ({

    fromStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    group: {
        type: String,
        enum: ["1", "2", "3", "4", "5"]
    },

    toStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    code: {
        type: String,
        required: true
    },

    type: { //1: Nhập nguyên vật liệu, 2: Nhập thành phẩm, 3:Xuất sản phẩm, 4: Xuất nguyên vật liệu, 5: Kiểm kê định kỳ, 6: Kiểm kê thường xuyên, 7: Trả hàng, 8: luân chuyển
        type: String,
        enum: ["1", "2", "3", "4", "5", "6", "7", "8"]
    },

    status: { //1: Chờ phê duyệt, 2:Đã hủy, 3: Đã hoàn thành, 4: đã phê duyệt,
        type: String,
        enum: ["1", "2", "3", "4"]
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    approver: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },

    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },

    receiver: {
        name: {
            type: String
        },

        phone: {
            type: Number
        },

        email: {
            type: String
        },

        address: {
            type: String
        }
    },

    timestamp: {
        type: Date,
        default: Date.now
    },

    description: {
        type: String
    },

    goods: [{

        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },

        quantity: {
            type: Number
        },

        returnQuantity: {
            type: Number
        },

        lots: [{

            lot: {
                type: Schema.Types.ObjectId,
                ref: 'Lot'
            },

            quantity: {
                type: Number
            },

            returnQuantity: {
                type: Number
            },

            damagedQuantity: {
                type: Number
            },

            note: {
                type: String
            }
        }],

        description: {
            type: String
        }
    }]
});

BillSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if(!db.models.Bill)
        return db.model('Bill', BillSchema);
    return db.models.Bill;
}