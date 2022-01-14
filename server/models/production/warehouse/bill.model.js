const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const BillSchema = new Schema({
    // LSX
    fromStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },
    // LSX 1. Nhập kho 2. Xuất kho 
    group: {
        type: String,
        enum: ["1", "2", "3", "4", "5"]
    },

    toStock: {
        type: Schema.Types.ObjectId,
        ref: 'Stock'
    },

    bill: {
        type: Schema.Types.ObjectId,
        replies: this
    },

    // LSX 
    code: {
        type: String,
        required: true
    },

    // LSX 2, 4
    // 1: Nhập nguyên vật liệu, 2: Nhập thành phẩm, 3: Nhập công cụ, dụng cụ, 4: Nhập phế phẩm 
    // 5:Xuất sản phẩm, 6: Xuất nguyên vật liệu, 7: Xuất công cụ, dụng cụ, 8: Xuất phế phẩm
    // 9: Kiểm kê định kỳ, 10: Kiểm kê thường xuyên, 
    // 11: Trả hàng, 12: Luân chuyển
    type: {
        type: String,
        enum: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
    },

    // LSX 1
    status: { //1: Chờ phê duyệt, 2: Đã hoàn thành, 3: Đã phê duyệt, 4: Đã hủy, 5: Đang thực hiện
        type: String,
        enum: ["1", "2", "3", "4", "5"]
    },

    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],

    // LSX
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    // LSX
    approvers: [{
        approver: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        approvedTime: {
            type: Date
        }
    }],

    // LSX
    qualityControlStaffs: [{ // Danh sách người kiểm định chất lượng 
        staff: { // Người kiểm định
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        status: { // Trạng thái kiểm định 1. Chưa kiểm định, 2. Kiểm định Ok, 3. Kiểm định có vấn đề
            type: Number
        },

        content: { // Nội dung kiểm định
            type: String
        },

        time: { // Thời gian kiểm định
            type: Date
        }
    }],

    // LSX
    responsibles: [{ // Danh sách người thực hiện
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    // LSX
    accountables: [{ // Người giám sát
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },

    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },

    // LSX
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

    // LSX
    description: {
        type: String
    },

    // LSX
    goods: [{
        //LSX
        good: {
            type: Schema.Types.ObjectId,
            ref: 'Good'
        },
        //LSX
        quantity: {
            type: Number,
            default: 0
        },

        returnQuantity: {
            type: Number,
            default: 0
        },

        damagedQuantity: {
            type: Number,
            default: 0
        },

        realQuantity: {
            type: Number
        },

        lots: [{
            // LSX
            lot: {
                type: Schema.Types.ObjectId,
                ref: 'Lot'
            },
            // LSX
            quantity: {
                type: Number,
                default: 0
            },

            returnQuantity: {
                type: Number,
                default: 0
            },

            damagedQuantity: {
                type: Number,
                default: 0
            },

            realQuantity: {
                type: Number
            },

            note: {
                type: String
            }
        }],

        description: {
            type: String
        }
    }],

    // LSX
    manufacturingMill: {
        type: Schema.Types.ObjectId,
        ref: "ManufacturingMill"
    },
    // LSX
    manufacturingCommand: {
        type: Schema.Types.ObjectId,
        ref: "ManufacturingCommand"
    },

    // Tạo log khi create
    logs: [{
        createAt: {
            type: Date
        },

        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },

        title: {
            type: String
        },

        versions: {
            type: String
        }
    }]
}, {
    timestamps: true
});

BillSchema.plugin(mongoosePaginate);

module.exports = (db) => {
    if (!db.models.Bill)
        return db.model('Bill', BillSchema);
    return db.models.Bill;
}
